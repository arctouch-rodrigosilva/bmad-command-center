# Story 1.3: Show minimal Command Center content and preserve state

Status: done

<!-- Ultimate context engine analysis completed — comprehensive developer guide created. -->

### Specification supplement (2026-03-19)

The Command Center is **hybrid**: a **WebviewPanel** in the editor (`bmadpilot.openCommandCenterPanel`, `src/views/commandCenter/commandCenterPanel.ts`) is the **primary** launcher (tile UI); the **Explorer Tree View** remains the **sidebar companion**, including an **“Open full Command Center”** row and **view/title** action. Story acceptance criteria below refer to the **tree** surface; the panel uses `retainContextWhenHidden` on the **webview** (valid there), not on `TreeViewOptions`. See [`architecture.md`](../planning-artifacts/architecture.md) and [`README.md`](../../README.md).

## Story

As a BMAD practitioner,
I want the Command Center to show at least "Where you are" and "What's next" placeholders and to keep plugin state when I switch views,
so that I see a coherent BMAD home and don’t lose context when moving between Command Center and editor.

## Acceptance Criteria

1. **Given** the Command Center **sidebar Tree View** is open  
   **When** the view is rendered  
   **Then** at least two logical areas (or nodes) are visible: one for "Where you are" and one for "What's next" (placeholder text is acceptable)

2. **Given** the Command Center **tree** is showing its minimal content  
   **When** I switch to the editor or another sidebar view and back to the Command Center tree  
   **Then** the tree content does not reset unexpectedly (FR5)

3. **Given** any workspace with no BMAD-specific extension settings  
   **When** I use the Command Center **tree and/or open-panel command**  
   **Then** both surfaces work without requiring per-workspace configuration (FR21)

## Tasks / Subtasks

- [x] Task 1: Make "Where you are" / "What's next" unambiguous as sections (AC: #1)
  - [x] 1.1 Keep two distinct child nodes under the root (or equivalent two logical areas); labels must clearly name each section (e.g. primary label "Where you are", "What's next").
  - [x] 1.2 Add user-visible placeholder copy (acceptable per epic) — prefer `TreeItem.description` and/or `tooltip` so each row reads as a section with stub status (e.g. description: "Placeholder — phase inference in Epic 2"). Do not implement real phase inference here (Epic 2).
- [x] Task 2: Preserve Command Center / extension state across view switches (AC: #2, FR5)
  - [x] 2.1 Keep a single `CommandCenterProvider` instance for the activation lifetime (already pattern from Story 1.2); do not recreate the provider on visibility changes.
  - [x] 2.2 Confirm `createTreeView` options against the public API: `retainContextWhenHidden` is **not** on `TreeViewOptions` (it applies to webviews). Do not pass unsupported options; meet FR5 via 2.1 and 2.3 instead.
  - [x] 2.3 Avoid unnecessary `onDidChangeTreeData` fires or dispose/re-register cycles tied to `onDidChangeVisibility` unless you have a documented reason (reduces surprise resets). If you subscribe to visibility, document behavior in Dev Agent Record.
  - [x] 2.4 Manual verify: F5 → open BMAD Command Center → expand root → switch to another sidebar view (e.g. Explorer) → return → structure and expansion remain as expected (no empty tree, no collapsed root unless user collapsed it).
- [x] Task 3: Zero required workspace configuration (AC: #3, FR21)
  - [x] 3.1 Do not add `configuration` contributions or required settings for this story.
  - [x] 3.2 Command Center must render with only default workspace open (no `.vscode/settings` or BMAD config required for the placeholders).
- [x] Task 4: Verify build and host (AC: #1–#3)
  - [x] 4.1 `npm run compile` (and lint if the project uses it) passes.
  - [x] 4.2 Extension Development Host: no errors in debug console for view open/hide/open cycle.

## Dev Notes

### Scope boundaries

- **In scope:** Minimal Command Center **tree** UX (two sections + placeholder copy), stable tree behavior when switching sidebars, no workspace settings. **Follow-up (hybrid):** primary tiles live in the webview panel; Epic 2–3 should update **both** surfaces from `PhaseResult`.
- **Out of scope:** Artifact detection, phase inference, wiring real "Where you are" / "What's next" from repo (Epic 2, Stories 2.1–2.3). No BMAD action commands or chat invocation (Epic 3).

### Technical requirements

- **API:** Public VS Code Extension API only for the tree (`TreeDataProvider`, `TreeItem`, `TreeItem.description`, `TreeItem.tooltip`, `window.createTreeView`). `TreeViewOptions` does **not** include `retainContextWhenHidden`; use a long-lived provider for FR5 on the tree. The **webview panel** (added after this story’s tree work) may use `retainContextWhenHidden` on `WebviewPanel` options — different API surface.
- **State:** Treat the provider as the in-memory source of truth for tree structure until Epic 2 replaces placeholder content. No `Memento` or `WorkspaceState` required for this story unless you add optional future hooks — prefer none for FR21.
- **IDs:** Keep stable `TreeItem.id` values (`root`, `open-panel`, `where-you-are`, `whats-next`) so the host can reconcile items across updates (`open-panel` = launcher row for the hybrid UI).

### Architecture compliance

- **Command Center:** **Hybrid MVP** per current architecture: webview panel (primary) + sidebar `TreeDataProvider` (companion). This story’s deliverable focuses on the tree placeholders; panel is documented in supplement.
- **State management (forward-looking):** Architecture describes single source of truth from phase inference later; for Story 1.3, static placeholders are acceptable — structure the provider so Epic 2 can swap in `PhaseResult` without rewriting registration in `extension.ts`.
- **Location:** Continue using `src/views/commandCenter/commandCenterProvider.ts` (and add `types.ts` only if types grow beyond this file).

### Library and framework requirements

- **TypeScript** and **`@types/vscode`** aligned with `package.json` (`engines.vscode` ^1.85.0). No new runtime dependencies for this story.

### File structure requirements

- **Touch:** `src/views/commandCenter/commandCenterProvider.ts` (labels/descriptions/tooltips; optional small refactor into constants).
- **Touch:** `src/extension.ts` — register `createTreeView` only with supported `TreeViewOptions` (no `retainContextWhenHidden` on the tree). Follow-up: same file registers `bmadpilot.openCommandCenterPanel` and `commandCenterPanel.ts`.
- **Do not:** Add `src/phaseInference/` or `src/artifactDetection/` yet unless purely unused stubs (avoid — YAGNI).

### Testing requirements

- No new unit-test harness required solely for placeholder strings; if the repo later adds VS Code test runner, extension tests could assert tree labels — optional for this story.
- **Manual:** F5 verification checklist in Task 2.4 and 4.2 is the acceptance path for FR5.

### Previous story intelligence (Story 1.2)

- **View id:** `bmadpilot.commandCenter`; registered in Explorer sidebar; `activationEvents`: `onView:bmadpilot.commandCenter`.
- **Pattern:** `CommandCenterProvider` constructed once in `activate()`, passed to `createTreeView`, `treeView` pushed to `context.subscriptions`. `createTreeView` wrapped in try/catch with `console.error` on failure.
- **Current tree:** Root "BMAD Command Center" expanded; children include **Open full Command Center** (hybrid), then "Where you are" and "What's next" — descriptions/tooltips on placeholders per Story 1.3. Do not add `retainContextWhenHidden` to `createTreeView`.
- **Preserve:** Hello World command and existing `package.json` contributions unless a story explicitly changes them.

### Previous story intelligence (Story 1.1)

- Extension root = repo root; `main`: `./out/extension.js`; compile via `tsc -p ./`.

### Project context reference

- No `project-context.md` found in the repo. Use this story + `_bmad-output/planning-artifacts/architecture.md` + `epics.md` as source of truth.

### References

- [Source: _bmad-output/planning-artifacts/epics.md] Epic 1, Story 1.3 acceptance criteria
- [Source: _bmad-output/planning-artifacts/architecture.md] Frontend Architecture (hybrid webview + Tree View), State management, Project Structure (`src/views/commandCenter/`)
- [Source: _bmad-output/planning-artifacts/prd.md] FR5 (no loss of plugin state when switching views), FR21 (value without prior configuration)
- [VS Code Tree View API](https://code.visualstudio.com/api/extension-guides/tree-view) — `TreeItem.description`, `createTreeView` / `TreeViewOptions`
- [VS Code Webview API](https://code.visualstudio.com/api/extension-guides/webview) — panel, CSP, `postMessage`, `retainContextWhenHidden` (webview)

## Dev Agent Record

### Agent Model Used

Auto (Cursor agent)

### Implementation Plan

- Extend `getTreeItem` to set `description` and `tooltip` on section rows; keep stable `TreeItem.id` values.
- Preserve FR5 with one `CommandCenterProvider` per activation and no `onDidChangeTreeData` / visibility subscriptions (unchanged from Story 1.2).
- **Task 2.2 correction:** `TreeViewOptions` in the public VS Code API does **not** include `retainContextWhenHidden` (that option applies to webviews / `WebviewOptions`, not `createTreeView`). Implementation therefore does not pass it; state preservation follows 2.1 and 2.3.

### Debug Log References

- `npm run compile` — pass (after removing invalid `retainContextWhenHidden` from `createTreeView` options).

### Completion Notes List

- Placeholder sections: both child items use `description: "Placeholder — phase inference in Epic 2"` and distinct tooltips for “Where you are” vs “What’s next”; root has an explanatory tooltip.
- FR5: No provider recreation; no visibility-driven refresh; tree structure is static from the provider’s perspective (same as Story 1.2 pattern).
- FR21: No `configuration` contributions added; `package.json` unchanged aside from story-unrelated files (none).
- Automated tests: per story Dev Notes, none added; verification path is `npm run compile` + manual F5 (2.4 / 4.2) for host behavior.
- **Supplement:** Hybrid UI — `commandCenterPanel.ts`, `bmadpilot.openCommandCenterPanel`, `view/title` menu, launcher tree row, and webview `retainContextWhenHidden` documented for Epic 2–3 wiring.

### File List

- `src/views/commandCenter/commandCenterProvider.ts` (modified — placeholders; later launcher row)
- `src/views/commandCenter/commandCenterPanel.ts` (added — hybrid primary UI; post–story follow-up)
- `src/extension.ts` (modified — tree + panel registration)
- `package.json` (modified — command, menus, activationEvents)
- `out/views/commandCenter/commandCenterProvider.js` (generated)
- `out/views/commandCenter/commandCenterProvider.js.map` (generated)
- `out/views/commandCenter/commandCenterPanel.js` (generated)
- `out/views/commandCenter/commandCenterPanel.js.map` (generated)

## Change Log

- 2026-03-19: Story 1.3 — placeholder descriptions/tooltips on Command Center tree; documented TreeView vs webview `retainContextWhenHidden`; compile verified.
- 2026-03-19: Specification supplement — hybrid Command Center; AC/Dev Notes/File List aligned with webview panel + sidebar tree; README/architecture cross-references.
- 2026-03-24: Sprint tracking set to `done` after review closure (aligned with story status).
