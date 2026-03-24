import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { STORY_SHOWCASE_SCENARIO, STORY_SHOWCASE_PROGRESS } from '../client/data/story-showcase';
import { MOON_CARD_DRAFTS } from '../client/data/moon-card-drafts';
import { INITIAL_CARDS } from '../server/src/data/cards';
import { CAMPAIGN_SCENARIOS } from '../server/src/data/campaign';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'godot', 'data', 'generated');

type ExportManifest = {
  exportedAt: string;
  datasets: {
    id: string;
    file: string;
    count?: number;
    description: string;
  }[];
};

async function writeJson(fileName: string, data: unknown) {
  await writeFile(path.join(outputDir, fileName), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

async function main() {
  await mkdir(outputDir, { recursive: true });

  const battleSeed = {
    player: {
      health: 30,
      gold: 6,
      influence: 3,
      handSize: 5,
    },
    enemy: {
      health: 28,
      gold: 5,
      influence: 2,
    },
    slots: [
      { id: 'front-1', row: 'front', index: 0, title: '先锋盾阵', health: 7, maxHealth: 7, counterArmed: true },
      { id: 'front-2', row: 'front', index: 1, title: '战线中枢', health: 6, maxHealth: 6, counterArmed: false },
      { id: 'front-3', row: 'front', index: 2, title: '右翼冲锋', health: 5, maxHealth: 5, counterArmed: false },
      { id: 'back-1', row: 'back', index: 0, title: '后援火力', health: 5, maxHealth: 5, counterArmed: false },
      { id: 'back-2', row: 'back', index: 1, title: '补给线', health: 4, maxHealth: 4, counterArmed: false },
      { id: 'back-3', row: 'back', index: 2, title: '术式节点', health: 4, maxHealth: 4, counterArmed: false },
    ],
  };

  await writeJson('base-cards.json', INITIAL_CARDS);
  await writeJson('moon-card-drafts.json', MOON_CARD_DRAFTS);
  await writeJson('story-showcase.json', STORY_SHOWCASE_SCENARIO);
  await writeJson('story-progress.json', STORY_SHOWCASE_PROGRESS);
  await writeJson('campaign-scenarios.json', CAMPAIGN_SCENARIOS);
  await writeJson('battle-seed.json', battleSeed);

  const manifest: ExportManifest = {
    exportedAt: new Date().toISOString(),
    datasets: [
      {
        id: 'base-cards',
        file: 'base-cards.json',
        count: INITIAL_CARDS.length,
        description: 'Core starter cards from the current server data source.',
      },
      {
        id: 'moon-card-drafts',
        file: 'moon-card-drafts.json',
        count: MOON_CARD_DRAFTS.length,
        description: 'The harvested Moon card drafts already absorbed into the editor.',
      },
      {
        id: 'story-showcase',
        file: 'story-showcase.json',
        description: 'The front-end showcase story with sample chapters and levels.',
      },
      {
        id: 'story-progress',
        file: 'story-progress.json',
        description: 'Sample story progression state.',
      },
      {
        id: 'campaign-scenarios',
        file: 'campaign-scenarios.json',
        count: CAMPAIGN_SCENARIOS.length,
        description: 'Current scenario definitions from the backend campaign data.',
      },
      {
        id: 'battle-seed',
        file: 'battle-seed.json',
        description: 'Godot battle bootstrap data aligned to the current prototype battlefield.',
      },
    ],
  };

  await writeJson('manifest.json', manifest);
  console.log(`Exported Godot data to ${outputDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
