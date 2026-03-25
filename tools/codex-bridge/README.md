# Lex Universalis Codex Bridge

This local Node service exposes a simple HTTP bridge for the Godot AI Assistant page.

## Start

```bat
E:\Lex Universalis\start-codex-bridge.bat
```

## Endpoints

- `GET /health`
- `POST /assist`

## Environment

- Copy `.env.example` to `.env` if you want the batch launcher to load variables automatically.
- `OPENAI_API_KEY` - required for model calls
- `CODEX_WORKSPACE` - defaults to `E:\Lex Universalis`
- `CODEX_BRIDGE_PORT` - defaults to `43987`
- `CODEX_MODEL` - defaults to `gpt-5.2-codex`

## Notes

- The bridge can read files inside the workspace.
- If `apply` is set in the request payload, it can write returned file contents back to disk.
