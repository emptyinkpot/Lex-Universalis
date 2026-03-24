# Godot Migration Checklist

## Goal

Move `Lex Universalis` from an Expo/Web-first prototype to a Godot desktop game without losing the current card, story, and battle design work.

## Migration Order

1. Freeze the current Web/Expo version as a checkpoint.
2. Extract cards, story, and battle seed data into engine-agnostic JSON.
3. Create a standalone Godot desktop project under [`E:\Lex Universalis\godot`](/E:/Lex%20Universalis/godot).
4. Build a fixed-viewport PC shell first, not mobile-style pages.
5. Recreate the main loop in Godot:
   - Main menu
   - Story mode
   - Battle scene
   - Card/deck workspace
6. Move rules logic out of UI assumptions and into reusable data/services.
7. Replace temporary prototype visuals with Godot-native scene composition and animation.

## What Can Be Reused

- Card data and draft archive
- Story/showcase scenario data
- Existing faction/card taxonomy
- Battle interaction ideas and flow
- Docs and worldbuilding content

## What Must Be Rebuilt

- Screen/router structure
- React component tree
- Reanimated/gesture-based animation layer
- Expo/Electron/Web startup path
- UI layout assumptions based on scrolling pages

## Immediate Deliverables In This Phase

- `godot/` project scaffold
- Godot-readable JSON export pipeline
- Desktop viewport baseline scene
- Migration notes for the next implementation phase

## Next Engine Tasks

1. Build a fixed `16:9` main shell scene.
2. Load story JSON and render chapter/level selection inside one viewport.
3. Load card JSON and render card instances with consistent size rules.
4. Rebuild battle scene as a single-screen desktop battlefield.
5. Port combat resolution state out of the current front-end-only interaction layer.
