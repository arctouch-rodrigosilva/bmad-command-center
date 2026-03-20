# BMADPilot

BMAD Command Center and artifact-driven launcher for Cursor.

## Requirements

- Node.js and npm
- Cursor or VS Code `^1.85.0` (see `engines.vscode` in package.json)

## Development

- `npm install` – install dependencies
- `npm run compile` – compile TypeScript
- `npm run watch` – watch and compile
- `npm run qa` – quality gate (compile; extend with lint/tests when added)
- Press **F5** in Cursor/VS Code to launch Extension Development Host and run the extension.

## Command Center (using the extension)

- **Primary UI:** Command Palette → **BMADPilot: Open BMAD Command Center** — opens the **editor-area panel** with large action tiles (Create PRD, Dev Story, BMAD Help placeholders until chat wiring lands in Epic 3).
- **Sidebar:** Explorer → **BMAD Command Center** — use the **view title** action or the **Open full Command Center** tree row for the same panel; **Where you are** / **What’s next** show Epic 2 placeholders in the tree.

## License

Proprietary. See project root for license details.
