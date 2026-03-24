# Story 2.1: Artifact detection module

Status: done

<!-- Ultimate context engine analysis completed — comprehensive developer guide created. -->

## Story

As a BMAD practitioner,
I want the extension to detect key BMAD artifacts (PRD, architecture, epics, stories, implementation-artifacts) from the workspace,
so that phase and recommendations can be derived without manual configuration.

## Acceptance Criteria

1. **Given** a workspace root path  
   **When** the artifact detection function is called with that path  
   **Then** it returns an `ArtifactSet` with at least: `hasPrd`, `hasArchitecture`, `hasEpics`, `hasStories`, `hasImplementationArtifacts` — each boolean reflects presence of the corresponding BMAD layout under that root (FR15, FR16, FR17)

2. **And** the implementation uses only path / file existence checks (no heavy parsing); **no `vscode` import or VS Code API** in the core detection module so it is unit-testable under Node (Additional requirement from epics)

3. **And** the module does not write to the repo or workspace (FR18)

4. **And** unit tests exist that verify detection for **at least two scenarios**: e.g. empty / non-BMAD workspace (all flags false or safe equivalent), and workspace with `prd.md` only under planning-artifacts (`hasPrd` true, others false unless rules below say otherwise)

## Tasks / Subtasks

- [x] Task 1: Define types and public API (AC: #1–#3)
  - [x] 1.1 Add `src/artifactDetection/types.ts` with an `ArtifactSet` interface matching the five booleans above (names and meanings documented in code comment).
  - [x] 1.2 Add `src/artifactDetection/index.ts` exporting e.g. `detectArtifacts(workspaceRoot: string): ArtifactSet` (exact name up to you; keep one clear entry point per architecture).
- [x] Task 2: Implement detection rules (AC: #1, #2, #3)
  - [x] 2.1 Resolve paths with `path.join` from `workspaceRoot`; use only Node built-ins (`fs`, `path`) — **no `vscode`** in `artifactDetection/`.
  - [x] 2.2 Encode **concrete** rules aligned with this repo and PRD paths [Source: prd.md — `_bmad-output`, `planning-artifacts`, `implementation-artifacts`, config]:
    - **hasPrd:** file exists at `_bmad-output/planning-artifacts/prd.md` (case-sensitive as on disk; this project uses lowercase `prd.md`).
    - **hasArchitecture:** file exists at `_bmad-output/planning-artifacts/architecture.md` **or** any `*architecture*.md` in `_bmad-output/planning-artifacts/` (choose one documented rule; prefer matching current monolith file `architecture.md`).
    - **hasEpics:** file exists at `_bmad-output/planning-artifacts/epics.md` **or** any `*epic*.md` in that folder (document which; this repo uses `epics.md`).
    - **hasImplementationArtifacts:** directory `_bmad-output/implementation-artifacts` exists and is a directory.
    - **hasStories:** at least one `.md` file under `_bmad-output/implementation-artifacts/` whose name matches BMAD story files used in this project: `^\d+-\d+-.+\.md$` (e.g. `1-1-initialize-extension-with-generator-code-typescript.md`). Document if you treat other `.md` files as stories for leniency.
  - [x] 2.3 On filesystem errors (permission, invalid path), **do not throw** — return a safe `ArtifactSet` (e.g. all `false`) so callers never crash the host (aligns with architecture error handling; NFR-R2 groundwork).
- [x] Task 3: Unit tests (AC: #4)
  - [x] 3.1 Add tests under `src/artifactDetection/__tests__/` (or architecture-preferred path) runnable without the VS Code host.
  - [x] 3.2 **Scenario A:** empty temp directory → expect no artifacts detected.
  - [x] 3.3 **Scenario B:** create `_bmad-output/planning-artifacts/prd.md` only → `hasPrd === true`, other flags `false` per rules in 2.2.
  - [x] 3.4 Wire `npm test` (or a dedicated script) so CI/local can run unit tests after compile; keep `typescript` / `engines` consistent with `package.json`.
- [x] Task 4: Verify build (AC: #2–#4)
  - [x] 4.1 `npm run compile` passes; tests pass.
  - [x] 4.2 **Do not** wire detection into `CommandCenterProvider` or `extension.ts` in this story (Story 2.3 owns UI wiring).

## Dev Notes

### Scope boundaries

- **In scope:** Pure `ArtifactSet` detection from a filesystem root string; types; unit tests; Node-only core.
- **Out of scope:** Phase inference (`PhaseResult`, recommended action) — Story 2.2. Command Center / webview updates — Story 2.3. Reading or parsing file contents beyond existence (e.g. no YAML/PRD parsing). Chat commands.

### Technical requirements

- **Isolation:** `src/artifactDetection/**` must not import `vscode`. Callers in later stories will pass `workspaceRoot` from `vscode.workspace` as needed.
- **Performance:** Sync `fs.existsSync` / `readdirSync` acceptable for Story 2.1 (architecture: lightweight path checks). Keep implementation O(number of checked paths), not full tree walks except one shallow read for `hasStories` if needed.
- **Immutability:** Return a plain new object each call; no module-level mutable cache in this story (caching is a Story 2.3 concern if required).

### Architecture compliance

- **Location:** `src/artifactDetection/` with `index.ts`, `types.ts`, and tests per [Source: architecture.md — Project Structure & Boundaries].
- **Boundary:** artifactDetection output is consumed only by phaseInference in later work; views must not duplicate detection logic.
- **Naming:** camelCase module files (`artifactDetection.ts` or `index.ts` export), PascalCase types — [Source: architecture.md — Naming Patterns].

### Library and framework requirements

- **TypeScript** + `@types/node` + `@types/vscode` as already in project; no new runtime dependencies required for detection logic.
- **Tests:** Prefer Node built-in `node:test` + `node:assert/strict` after `tsc` emit, or add minimal devDependencies (e.g. `mocha`) if the team standardizes otherwise — document choice in Dev Agent Record.

### File structure requirements

- **Add:** `src/artifactDetection/types.ts`, `src/artifactDetection/index.ts`, `src/artifactDetection/__tests__/*.ts` (or `.test.ts` beside module per team convention).
- **Do not modify:** `src/views/commandCenter/*`, `extension.ts` for wiring (defer to 2.3).
- **Optional:** Re-export types from `index.ts` only; avoid barrel files outside this folder until needed.

### Testing requirements

- Minimum: two scenarios as in AC #4; prefer also a third case with a fake story file matching `N-N-*.md` under `implementation-artifacts` asserting `hasStories` and `hasImplementationArtifacts`.
- Tests should create and tear down temp directories under `os.tmpdir()` to avoid coupling to this repo’s real `_bmad-output`.

### Prior epic context (Epic 1 — continuity)

- Command Center lives in `src/views/commandCenter/`; `CommandCenterProvider` uses stable tree IDs (`where-you-are`, `whats-next`, etc.) and placeholders until Epic 2 wiring.
- Story 1.3 explicitly deferred `src/artifactDetection/` — this story introduces it [Source: 1-3-show-minimal-command-center-content-and-preserve-state.md — Dev Notes].
- Hybrid UI: tree + `commandCenterPanel.ts`; Epic 2.3 will feed both from `PhaseResult`.

### Project context reference

- No `project-context.md` in repo. Use this story, `epics.md`, `architecture.md`, and `prd.md` as authoritative.

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 2, Story 2.1]
- [Source: _bmad-output/planning-artifacts/architecture.md — artifactDetection boundary, structure, error handling, implementation sequence]
- [Source: _bmad-output/planning-artifacts/prd.md — FR15–FR18, artifact paths]
- [Source: _bmad-output/implementation-artifacts/1-3-show-minimal-command-center-content-and-preserve-state.md — deferral of detection]

## Dev Agent Record

### Agent Model Used

GPT-5.1 (Cursor agent)

### Implementation Plan

- Add `ArtifactSet` + JSDoc on `types.ts`; export `detectArtifacts` and type re-export from `index.ts`.
- Implement rules with `path.join` / `fs.existsSync` / `readdirSync` / `statSync`; wrap in try/catch returning all-false on failure.
- **hasStories:** only `.md` files matching `^\d+-\d+-.+\.md$` (other `.md` in implementation-artifacts do not set `hasStories`).
- Tests with `node:test` on compiled output; `npm test` = compile + `node --test` on the test file.
- No changes to Command Center or `extension.ts` (Task 4.2).

### Debug Log References

- `npm test` — 6 tests passed after code-review follow-up (2026-03-24).

### Completion Notes List

- Implemented read-only `detectArtifacts(workspaceRoot)` with no `vscode` usage under `src/artifactDetection/`.
- Unit tests: empty workspace; prd-only; story file under implementation-artifacts; non-story file in implementation-artifacts; epics + architecture planning files.
- `package.json` `test` script now runs compile + unit tests.
- Code review: empty or whitespace-only `workspaceRoot` returns all-`false` (does not resolve to cwd); JSDoc + unit test added.

### File List

- `src/artifactDetection/types.ts` (new)
- `src/artifactDetection/index.ts` (new)
- `src/artifactDetection/__tests__/detectArtifacts.test.ts` (new)
- `package.json` (modified — `test` script)
- `out/artifactDetection/types.js` + `.map` (generated)
- `out/artifactDetection/index.js` + `.map` (generated)
- `out/artifactDetection/__tests__/detectArtifacts.test.js` + `.map` (generated)

## Change Log

- 2026-03-20: Story created (create-story workflow); status `ready-for-dev`.
- 2026-03-20: Implemented artifact detection module + `node:test` suite; status `review` (dev-story workflow).
- 2026-03-24: Code review follow-up (empty/whitespace root guard); status `done`; sprint closed.
