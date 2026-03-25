import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";

const PORT = Number.parseInt(process.env.CODEX_BRIDGE_PORT ?? "43987", 10);
const WORKSPACE = path.resolve(process.env.CODEX_WORKSPACE ?? "E:\\Lex Universalis");
const DEFAULT_MODEL = process.env.CODEX_MODEL ?? "gpt-5.2-codex";
const API_KEY = process.env.OPENAI_API_KEY ?? "";

const client = API_KEY.trim().length > 0 ? new OpenAI({ apiKey: API_KEY }) : null;

function json(res, status, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function text(res, status, payload) {
  const body = String(payload);
  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function normalizePath(inputPath) {
  if (!inputPath || typeof inputPath !== "string") {
    return "";
  }
  const trimmed = inputPath.trim();
  if (!trimmed) {
    return "";
  }
  const resolved = path.resolve(trimmed.startsWith("res://") ? path.join(WORKSPACE, "godot", trimmed.slice(6)) : trimmed);
  const relative = path.relative(WORKSPACE, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative) && relative.includes(":")) {
    return "";
  }
  return resolved;
}

async function readWorkspaceFile(inputPath) {
  const resolved = normalizePath(inputPath);
  if (!resolved) {
    return null;
  }
  try {
    const content = await fs.readFile(resolved, "utf8");
    return {
      path: resolved,
      content,
    };
  } catch {
    return null;
  }
}

async function readRequestBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw.trim()) {
    return {};
  }
  return JSON.parse(raw);
}

function buildSystemInstructions() {
  return [
    "You are a local coding assistant for a Godot project.",
    "Focus on simplifying and improving desktop UI layouts, reducing overlap, and keeping changes consistent with Godot Control/Container patterns.",
    "Return strict JSON only, without markdown fences.",
    "Use this shape: {\"summary\":string,\"notes\":string[],\"changes\":[{\"path\":string,\"content\":string}]}",
    "When editing Godot scenes, preserve functionality and prefer container-based layouts over absolute positioning.",
    "If the request is just analysis, return an empty changes array.",
  ].join(" ");
}

function buildUserPrompt(payload, files) {
  const lines = [];
  lines.push(`Instruction: ${String(payload.instruction ?? "").trim()}`);
  lines.push(`Workspace: ${WORKSPACE}`);
  lines.push(`Target model: ${String(payload.model ?? DEFAULT_MODEL)}`);
  lines.push(`Apply directly: ${payload.apply ? "yes" : "no"}`);
  if (payload.target_path) {
    lines.push(`Target file: ${String(payload.target_path)}`);
  }
  if (Array.isArray(payload.context_paths) && payload.context_paths.length > 0) {
    lines.push("Context files:");
    for (const file of files) {
      lines.push(`--- FILE: ${file.path}`);
      lines.push(file.content);
      lines.push(`--- END FILE: ${file.path}`);
    }
  }
  return lines.join("\n\n");
}

function parseJsonResponse(textValue) {
  const trimmed = String(textValue ?? "").trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    return null;
  }
  const candidate = trimmed.slice(start, end + 1);
  try {
    return JSON.parse(candidate);
  } catch {
    return null;
  }
}

async function handleAssist(req, res) {
  let payload;
  try {
    payload = await readRequestBody(req);
  } catch (error) {
    return json(res, 400, { ok: false, error: `Invalid JSON: ${error instanceof Error ? error.message : String(error)}` });
  }

  const instruction = String(payload.instruction ?? "").trim();
  if (!instruction) {
    return json(res, 400, { ok: false, error: "instruction is required" });
  }

  const contextPaths = Array.isArray(payload.context_paths) ? payload.context_paths : [];
  const targetPath = payload.target_path ? String(payload.target_path) : "";
  const files = [];

  if (targetPath) {
    const target = await readWorkspaceFile(targetPath);
    if (target) {
      files.push(target);
    }
  }

  for (const contextPath of contextPaths.slice(0, 12)) {
    const file = await readWorkspaceFile(contextPath);
    if (file && !files.some((entry) => entry.path === file.path)) {
      files.push(file);
    }
  }

  if (!client) {
    return json(res, 503, {
      ok: false,
      error: "OPENAI_API_KEY is not configured for the local Codex bridge.",
      workspace: WORKSPACE,
      model: String(payload.model ?? DEFAULT_MODEL),
      files_loaded: files.length,
    });
  }

  const response = await client.responses.create({
    model: String(payload.model ?? DEFAULT_MODEL),
    instructions: buildSystemInstructions(),
    input: buildUserPrompt(payload, files),
  });

  const parsed = parseJsonResponse(response.output_text);
  const result = parsed ?? {
    summary: "Model returned non-JSON output.",
    notes: [],
    changes: [],
    raw: response.output_text,
  };

  const changes = Array.isArray(result.changes) ? result.changes : [];
  const written = [];
  if (payload.apply) {
    for (const change of changes) {
      if (!change || typeof change.path !== "string" || typeof change.content !== "string") {
        continue;
      }
      const resolved = normalizePath(change.path);
      if (!resolved) {
        continue;
      }
      await fs.mkdir(path.dirname(resolved), { recursive: true });
      await fs.writeFile(resolved, change.content, "utf8");
      written.push(resolved);
    }
  }

  return json(res, 200, {
    ok: true,
    model: String(payload.model ?? DEFAULT_MODEL),
    workspace: WORKSPACE,
    files_loaded: files.length,
    written_files: written,
    result,
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "127.0.0.1"}`);

  if (req.method === "GET" && url.pathname === "/health") {
    return json(res, 200, {
      ok: true,
      bridge: "codex",
      model: DEFAULT_MODEL,
      workspace: WORKSPACE,
      has_api_key: Boolean(client),
    });
  }

  if (req.method === "POST" && url.pathname === "/assist") {
    try {
      return await handleAssist(req, res);
    } catch (error) {
      return json(res, 500, {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (req.method === "GET" && url.pathname === "/") {
    return text(
      res,
      200,
      "Lex Universalis Codex bridge is running. POST /assist or GET /health."
    );
  }

  return json(res, 404, { ok: false, error: "Not found" });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Codex bridge listening on http://127.0.0.1:${PORT}`);
  console.log(`Workspace: ${WORKSPACE}`);
  console.log(`Model: ${DEFAULT_MODEL}`);
});
