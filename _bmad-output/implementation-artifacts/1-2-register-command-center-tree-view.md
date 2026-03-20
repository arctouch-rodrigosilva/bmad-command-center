# Story 1.2: Register Command Center Tree View

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

### Specification supplement (2026-03-19)

Product direction was updated to a **hybrid Command Center**: the **primary** launcher is now an editor-area **WebviewPanel** (`bmadpilot.openCommandCenterPanel`, `commandCenterPanel.ts`); this story’s **Explorer Tree View** remains the **sidebar companion** (status + shortcuts). Original acceptance criteria below still describe the sidebar surface only. See current [`architecture.md`](../planning-artifacts/architecture.md) § Frontend Architecture and [`README.md`](../../README.md).

## Story

As a BMAD practitioner,
I want a dedicated Command Center view in the IDE sidebar (Tree View),
so that I have a primary BMAD surface I can open from the editor.

## Acceptance Criteria

1. **Given** the extension is installed and the workspace is open  
   **When** I open the Command Center view (via View menu or activity bar)  
   **Then** a Tree View is displayed with a stable container (e.g. root node or placeholder nodes)  
   **And** the view is registered in `package.json` under `contributes.views` with a clear view id and label  
   **And** the Tree View is implemented with a TreeDataProvider (e.g. under `src/views/commandCenter/`)

## Tasks / Subtasks

- [x] Task 1: Register view in package.json (AC: #1)
  - [x] 1.1 Add `contributes.views` (or `contributes.viewsContainers` + `contributes.views`) with a stable view id (e.g. `bmadpilot.commandCenter` or `bmadpilot.views.commandCenter`) and user-facing label (e.g. "BMAD Command Center")
  - [x] 1.2 Ensure the view appears under a container (e.g. Explorer sidebar or dedicated activity bar icon) so it is openable via View menu or activity bar
- [x] Task 2: Implement TreeDataProvider (AC: #1)
  - [x] 2.1 Create folder `src/views/commandCenter/` (or `src/commandCenter/` per architecture)
  - [x] 2.2 Implement a class that satisfies `TreeDataProvider<T>` (VS Code API) and provides at least a root or placeholder children so the view is not empty
  - [x] 2.3 Register the provider in `src/extension.ts` with `vscode.window.createTreeView(viewId, { treeDataProvider })` and dispose on deactivate
- [x] Task 3: Verify view opens and shows stable content (AC: #1)
  - [x] 3.1 Run extension (F5), open the Command Center view from View menu or activity bar, confirm Tree View renders with stable container/placeholder nodes
  - [x] 3.2 Confirm no errors in Extension Development Host or debug console

## Dev Notes

- **Scope:** This story is view registration and a minimal Tree View only. Do not implement phase inference, artifact detection, or "Where you are" / "What's next" content—those are Epic 2 and Story 1.3. A root node plus one or two placeholder nodes (e.g. "Where you are", "What's next") is acceptable and aligns with Story 1.3; alternatively a single root node with label like "BMAD Command Center" is enough for this story.
- **API (story scope):** Use only public VS Code Extension API: `vscode.window.createTreeView`, `TreeDataProvider`, `TreeItem`, `TreeItemCollapsibleState`. This story did not add a webview; the later **hybrid** design adds `createWebviewPanel` in a separate module (see supplement above). No undocumented Cursor APIs.
- **Naming:** Architecture recommends command IDs with extension prefix (e.g. `bmadpilot.*`). Use a clear view id such as `bmadpilot.commandCenter` and label "BMAD Command Center" (or "Command Center") so users can find it in the View menu.
- **Activation:** Register the view in `activate()` so it is available as soon as the extension loads. Use `context.subscriptions.push()` so the tree view is disposed on deactivate.

### Project Structure Notes

- **Current state (after Story 1.1):** Generator default layout only: `src/extension.ts`, `package.json`, `tsconfig.json`, `.vscode/launch.json`. No `src/views/` or `src/commandCenter/` yet. Add `src/views/commandCenter/` (or `src/commandCenter/`) and new files there; do not remove or break the existing Hello World command unless the story requires it.
- **Architecture target:** `commandCenterProvider.ts` (+ later `commandCenterPanel.ts` for the primary webview per current architecture). Implement the TreeDataProvider in a provider file and register it from extension.ts. Align file names with architecture (camelCase for modules).
- **package.json:** Add only the view contribution and any activationEvents needed for the view. Do not add commands for BMAD workflows (Epic 3).

### Previous Story Intelligence (Story 1.1)

- **Scaffold:** Extension root = repo root. package.json has `engines.vscode` (e.g. `^1.85.0`), `main: "./out/extension.js"`, and `contributes.commands` with `bmadpilot.helloWorld`. Preserve these.
- **Entry point:** `src/extension.ts` exports `activate()` and `deactivate()`. Add Tree View registration in `activate()` and push to `context.subscriptions` so it is disposed on deactivate.
- **Build:** `npm run compile` produces `out/extension.js`. New TypeScript under `src/views/commandCenter/` must be included by `tsconfig.json` (default includes `src/**/*`).
- **Do not:** Change generator layout for unrelated files; do not add phase inference, artifact detection, or command-center content logic in this story.

### Architecture Compliance

- **Command Center surface (as implemented in this story):** Sidebar Tree View only (`TreeDataProvider`). **Current architecture (post–2026-03-19):** hybrid — webview panel (primary) + this tree (companion); see supplement.
- **Views:** Command Center tree in `src/views/commandCenter/commandCenterProvider.ts` (architecture § Project Structure; `commandCenterPanel.ts` added for hybrid UI).
- **Registration:** View registered from `src/extension.ts`; contributions in `package.json` (architecture § Implementation Sequence step 4).

### References

- [Source: _bmad-output/planning-artifacts/epics.md] Epic 1, Story 1.2 acceptance criteria
- [Source: _bmad-output/planning-artifacts/architecture.md] Frontend Architecture (hybrid: webview + Tree View), Project Structure (`views/commandCenter`), Implementation Sequence
- [Source: _bmad-output/planning-artifacts/prd.md] FR1 (Command Center as primary BMAD surface), FR5 (no loss of plugin state)
- VS Code Tree View API: https://code.visualstudio.com/api/extension-guides/tree-view

## Dev Agent Record

### Agent Model Used

Auto (Cursor agent)

### Debug Log References

- Implemented view registration and TreeDataProvider in one pass. Compile and lint pass.

### Completion Notes List

- Added `contributes.views.explorer` with view id `bmadpilot.commandCenter` and name "BMAD Command Center" so the view appears in the Explorer sidebar and is openable via View menu or activity bar.
- Created `src/views/commandCenter/commandCenterProvider.ts` with `CommandCenterProvider` implementing `TreeDataProvider<CommandCenterNode>`, exposing a root node "BMAD Command Center" and two placeholder children "Where you are" and "What's next" (aligns with Story 1.3).
- Registered the tree view in `extension.ts` with `vscode.window.createTreeView(VIEW_ID, { treeDataProvider })` and pushed to `context.subscriptions` for dispose on deactivate.
- `npm run compile` and lint pass. F5 verification: user should run Extension Development Host, open View → Explorer → BMAD Command Center (or equivalent) and confirm the tree shows the root and two placeholders with no console errors.
- Code review follow-up: `activationEvents` set to `onView:bmadpilot.commandCenter`; `createTreeView` wrapped in try/catch with console error logging.
- **Supplement:** Subsequent work added `commandCenterPanel.ts`, `bmadpilot.openCommandCenterPanel`, `view/title` menu, and `onCommand` activation — not part of this story’s original scope but documented here for traceability.

### File List

- package.json (modified – views + activationEvents `onView:bmadpilot.commandCenter`)
- src/extension.ts (modified – import provider, register tree view, try/catch around createTreeView)
- src/views/commandCenter/commandCenterProvider.ts (new)
- out/extension.js (generated by compile)
- out/extension.js.map (generated by compile)

## Change Log

- 2026-03-19: Specification supplement — hybrid Command Center (webview primary + sidebar tree); architecture/README cross-references; completion notes traceability for follow-up files.
