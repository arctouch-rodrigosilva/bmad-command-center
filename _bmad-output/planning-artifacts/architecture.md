---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - planning-artifacts/prd.md
workflowType: 'architecture'
project_name: 'BMADPilot'
user_name: 'Rodrigo'
date: '2026-03-17'
lastStep: 8
status: 'complete'
completedAt: '2026-03-17'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
- **Command Center & status (FR1–5):** One primary view; "Where you are" / "What's next"; view updates on repo changes; no loss of plugin state when switching views.
- **Phase & context inference (FR6–9):** Infer phase from workspace paths and artifact presence; single recommended next action from BMAD sequencing; distinguish upstream (discovery, planning, architecture) vs downstream (execution); handle empty/non-BMAD workspaces with sensible fallback.
- **Action launcher (FR10–14):** Actions map to BMAD commands; triggering an action opens Cursor chat and runs that command (execution in chat, not in extension); all actions always available (recommend, don't block); recommended action reachable in one or two steps and visually emphasized.
- **Artifact detection (FR15–18):** Detect key BMAD artifacts via workspace paths; use known folder structure (`_bmad-output`, planning-artifacts, implementation-artifacts, config); no manual phase config; read-only—no writes from inference or recommendation.
- **Onboarding & empty state (FR19–21):** Clear status and first action when no/minimal BMAD artifacts; discover BMAD via Help/link; value without per-workspace configuration.
- **Installation & behavior (FR22–23):** Install as Cursor/VS Code extension; per-workspace phase inference (no shared state across repos).
- **Post-MVP (FR24–25):** Global Model and Mode preferences for launched chats (roadmap).

**Non-Functional Requirements:**
- **Performance:** Artifact scan &lt;2s; Command Center open/refresh must not block UI; action trigger → chat &lt;1s (NFR-P1–P3).
- **Reliability:** No crash/hang; inference failures degrade to safe state (full action list + Help); failed workspace read still shows usable Command Center (NFR-R1–R2).
- **Integration:** Use only public Cursor/VS Code extension API; document minimum host version (NFR-I1–I2).
- **Security:** Read only what's needed for detection/recommendation; no transmission of repo content for inference/launcher; no credentials or payment data (NFR-S1–S2).

**Scale & Complexity:**
- Primary domain: IDE extension (developer tool).
- Complexity level: Low.
- Estimated architectural components: Command Center view; phase-inference module; artifact-detection module; action/command layer (launch chat with BMAD command); config/workspace reader.

### Technical Constraints & Dependencies

- **Runtime:** Cursor (VS Code–compatible); extension runs in host IDE; state from workspace filesystem and extension APIs only.
- **Integration surface:** Extension API (views, commands, workspace read); Cursor chat/agent invocation (open chat with specific command); read-only access to `_bmad-output`, planning-artifacts, implementation-artifacts, and config (e.g. `_bmad/bmm/config.yaml`).
- **No backend:** All logic in extension host; no separate server or multi-tenant backend.
- **BMAD alignment:** Phase and action model must align with canonical BMAD method; document assumptions for traceability when BMAD evolves.

### Cross-Cutting Concerns Identified

- **Phase inference:** Single source of truth for "where you are" and "what's next"; must be testable (pure function: paths + existence → phase + recommendation) and documented for future BMAD/repo changes.
- **Artifact detection:** Shared by inference and UI (what to show/emphasize); must be fast and non-blocking; failure handling must not break the extension.
- **Command/chat contract:** All BMAD actions open chat with the right command; extension does not execute workflows internally—chat remains execution surface.

## Starter Template Evaluation

### Primary Technology Domain

**IDE extension (VS Code / Cursor)** — Based on project context analysis. The product is a Cursor/VS Code extension (TypeScript, extension API, npm packaging). No web app, mobile app, or backend stack; the "starter" is the official VS Code extension scaffold.

### Starter Options Considered

- **generator-code (Yo code)** — Official Microsoft Yeoman generator for VS Code extensions. Actively maintained (npm: generator-code). Supports TypeScript (`-t ts`), JavaScript, and other extension types; optional bundling (webpack/esbuild) and git init. Produces standard extension layout, `package.json`, and `.vscode/launch.json` for F5 debugging. Aligns with PRD (TypeScript, extension API, no separate backend).
- **Manual setup** — Creating `package.json` and folder structure by hand. Possible but unnecessary; generator establishes conventions and avoids version/boilerplate drift.
- **Other starters** — No widely adopted alternative for Cursor/VS Code extension; general Cursor project scaffolds target apps, not extension development.

### Selected Starter: generator-code (yo code) — TypeScript extension

**Rationale for Selection:**
- Official, maintained scaffold for VS Code (and thus Cursor) extensions.
- TypeScript support out of the box (`-t ts`), matching PRD.
- Standard layout and launch config so phase-inference and Command Center can be added on a clear base.
- Optional bundling and package manager choice support future needs (e.g. webview, tree view) without committing to them in MVP.

**Initialization Command:**

```bash
npm install -g yo generator-code
yo code --extensionType ts --extensionId bmadpilot --extensionDescription "BMAD Command Center and artifact-driven launcher for Cursor" --pkgManager npm
```

(Or run `yo code` and choose "New Extension (TypeScript)" and the rest interactively.)

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- TypeScript for extension code; Node/extension host runtime.
- Standard `package.json` with `main`, `engines.vscode`, activation events, and contribution points (commands, views when added).

**Styling Solution:**
- Not applicable for MVP (no custom UI framework). Any future webview can adopt a styling approach when that scope is added.

**Build Tooling:**
- Default: TypeScript compile. Optional `--bundle` (webpack or esbuild) available from generator for smaller install or webview; can be introduced later if needed.

**Testing Framework:**
- Not preconfigured in base generator output. Testing (e.g. phase-inference unit tests per NFR) to be added as part of implementation.

**Code Organization:**
- Extension root with main entry (e.g. `src/extension.ts`), `package.json`, `.vscode/launch.json`. Conventions for commands and (when added) tree views/webview follow VS Code extension patterns.

**Development Experience:**
- F5 launches Extension Development Host with the extension loaded. Standard VS Code/Cursor extension debug workflow; no separate backend server.

**Note:** Project initialization using the chosen command (or interactive `yo code` with TypeScript) should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Command Center surface: Tree View (MVP) so status and actions are visible without a webview; keeps MVP within public API and avoids webview complexity.
- Phase inference: Pure function (workspace paths + file existence → phase + recommended action); testable in isolation; no side effects.
- Chat invocation: Use VS Code/Cursor command to open chat with a specific prompt/command string; extension does not execute BMAD workflows internally.

**Important Decisions (Shape Architecture):**
- Artifact detection: Synchronous, lightweight path existence checks; results cached per refresh; no heavy parsing in hot path.
- BMAD action set: Fixed list of commands (e.g. Create PRD, Create architecture, Create epics, Dev Story, Code Review, Help) defined in extension; recommended action derived from phase only.
- Minimum host: Document minimum Cursor/VS Code version for `engines.vscode` in package.json.

**Deferred Decisions (Post-MVP):**
- Webview for richer Command Center UI; Tree View suffices for MVP.
- Global Model/Mode selectors (Phase 2); no extension state for chat defaults in MVP.
- Bundling (webpack/esbuild); use default TS compile for MVP unless bundle size becomes an issue.

### Data Architecture

- **No database.** All state is derived from workspace (read-only). "Data" = presence/absence of BMAD paths and optional config values (e.g. from `_bmad/bmm/config.yaml`).
- **Data validation:** Paths follow BMAD folder structure; config read is best-effort (missing or invalid config must not break inference—fallback to safe phase/recommendation).
- **Caching:** In-memory only; refresh on view focus or explicit refresh; no persistence beyond workspace files.

### Authentication & Security

- **No application auth.** Extension runs in the user's IDE with the same trust as the workspace. No login, tokens, or user identity in the extension.
- **Security:** Read-only workspace access for artifact detection; no transmission of repo content to external services (NFR-S1); no credentials or payment data (NFR-S2). Extension does not write to repo as part of inference or recommendation.

### API & Communication Patterns

- **No REST/GraphQL API.** Extension uses VS Code Extension API only (workspace, commands, views).
- **Cursor chat integration:** Actions invoke a Cursor/VS Code command that opens the chat composer with a predefined BMAD command (e.g. `bmad-create-prd`). Contract: extension passes command/prompt; chat runs the agent. No direct API to Cursor chat beyond "open with this prompt."
- **Error handling:** Workspace read or inference failures degrade to safe state: show full action list and recommend Help (NFR-R1, R2). No throwing unhandled exceptions to the host.

### Frontend Architecture

- **Command Center:** Implemented as a **Tree View** for MVP (contributions.views; TreeDataProvider). Nodes for "Where you are," "What's next," and action items; recommended action visually distinct (e.g. icon or label).
- **State management:** Single source of truth = output of phase-inference (phase + recommendedActionId). View subscribes to refresh when workspace or config may have changed (e.g. onDidChangeWorkspaceFolders, or onViewVisibility).
- **No React/Vue.** Native VS Code Tree View only for MVP. If a webview is added later, adopt a clear pattern (e.g. single webview panel, message passing).

### Infrastructure & Deployment

- **Hosting:** No backend. Extension runs in Cursor/VS Code extension host. Distribution: VSIX and/or marketplace; install via IDE extension mechanism.
- **CI/CD:** Build (compile TypeScript), lint, and unit tests (at least phase-inference tests). Optional: package VSIX in CI. No containers or cloud runtime.
- **Environment:** No env-specific backend. Optional `.env` or config for local dev only (e.g. logging); not required for MVP.
- **Monitoring:** No server-side monitoring. Extension errors surface in IDE (developer tools / extension host log). No telemetry in MVP unless explicitly added later.

### Decision Impact Analysis

**Implementation Sequence:**
1. Initialize extension with generator-code (TypeScript).
2. Implement artifact detection (path existence, BMAD layout).
3. Implement phase inference (pure function, unit-tested).
4. Register Command Center Tree View and wire to phase + actions.
5. Register BMAD commands that open chat with the correct prompt.
6. Add refresh behavior and error degradation.

**Cross-Component Dependencies:**
- Artifact detection is used only by phase inference. Phase inference is used by the Command Center view and (if needed) by command enablement. Commands do not depend on phase for availability (recommend, don't block).

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** Naming (modules, types, commands), structure (where inference vs views vs commands live), phase/recommendation shape, and error/loading behavior so all agents implement the same contracts.

### Naming Patterns

**Code Naming Conventions:**
- **TypeScript/VS Code:** camelCase for functions, variables, and methods; PascalCase for types, interfaces, and classes. File names: camelCase for modules (e.g. `phaseInference.ts`, `artifactDetection.ts`). Use **camelCase** for source files to match common VS Code extension style.
- **Commands:** Use lowercase with hyphens for command IDs in package.json (e.g. `bmad-pilot.createPrd`, `bmad-pilot.openCommandCenter`). Prefix with extension ID to avoid collisions.
- **Tree items:** Labels user-facing; use clear, short text (e.g. "Where you are: Planning", "What's next: Create architecture"). Internal IDs for actions: camelCase (e.g. `createPrd`, `devStory`).

**No database or REST API** — skip DB/API naming. Config keys: follow BMAD config as-is (e.g. `_bmad/bmm/config.yaml` keys unchanged).

### Structure Patterns

**Project Organization:**
- **Phase inference and artifact detection:** Dedicated modules under `src/` (e.g. `src/phaseInference/`, `src/artifactDetection/`). Export a single public function or small API (e.g. `inferPhase(workspaceRoot): PhaseResult`; `detectArtifacts(workspaceRoot): ArtifactSet`). Keep them dependency-free on VS Code API where possible so they are unit-testable.
- **Views:** Command Center Tree View in `src/views/commandCenter/` (or `src/commandCenter/`) with TreeDataProvider and any view-specific types. Views may depend on phase inference and commands.
- **Commands:** Register in `package.json` contributions; implement in `src/commands/` (one file per command or one file that registers all). Commands call Cursor/VS Code API to open chat with the chosen BMAD command string.
- **Tests:** Co-located or in `src/**/__tests__/` for unit tests (e.g. `phaseInference.test.ts`). Place integration or extension-host tests under `test/` or `tests/` at root if needed.

**File Structure:**
- Config: `package.json` for extension metadata and contributions; no separate app config file required for MVP. BMAD layout is read from workspace.
- Entry: `src/extension.ts` activates the extension, registers the Tree View and commands.

### Format Patterns

**Phase and recommendation (internal):**
- Define a single **Phase** type (e.g. union or enum) and a **RecommendedAction** type (e.g. command id or enum). Document the mapping from phase → recommended action in one place. All consumers use these types; no ad-hoc strings.
- **ArtifactSet:** Use a simple interface (e.g. `{ hasPrd: boolean; hasArchitecture: boolean; ... }`) or a record of path → boolean. Same shape used by phase inference and (if needed) by the view.

**Data Exchange:** No API responses. Internal only: PhaseResult = { phase, recommendedActionId, artifactSet? }. JSON only for optional config read; no custom serialization.

### Communication Patterns

**Event/State:** No event bus required. View refreshes when it receives new data. Phase inference is called on demand (and optionally cached per refresh). **State update:** Immutable: compute new PhaseResult from workspace; replace previous; view re-renders from new result. No mutable global phase state.

**Command/chat contract:** Each BMAD action is a command that invokes the Cursor/VS Code API to open chat with the chosen prompt. Command IDs and prompt strings are defined in one place (e.g. constants or config in `src/commands/`).

### Process Patterns

**Error Handling:** Artifact detection or workspace read failure: return a safe artifact set or treat as "empty" workspace; do not throw to extension host. Phase inference never throws; on invalid state return phase `'empty'` and recommended action `'help'`. View: if phase inference fails or returns empty, show "Unable to infer phase" and full action list (NFR-R2). No unhandled rejections.

**Loading States:** During refresh, show a loading message or retain previous result until new result is ready (no blocking UI). Prefer non-blocking async so the UI stays responsive (NFR-P2).

### Enforcement Guidelines

**All AI Agents MUST:**
- Use the same Phase and RecommendedAction types and phase→action mapping; do not introduce alternate phase strings or action IDs.
- Keep phase inference and artifact detection free of VS Code API dependencies in core logic so unit tests can run without the host.
- Use the documented command IDs and prompt contract for opening chat; do not hardcode prompts in multiple places.
- On any workspace or inference error, degrade to safe state (full actions + Help) and never crash the extension.

**Pattern Enforcement:** Code review and unit tests (phase inference at minimum). Document any new phase or action in the architecture doc when BMAD method changes.

### Pattern Examples

**Good:** `inferPhase(workspaceRoot: string): PhaseResult` in a file with no `vscode` import; tests call `inferPhase('/mock/root')`. Command registration in one place; open chat with one shared helper. **Anti-patterns:** Throwing from artifact detection; using different phase labels in view vs inference; duplicating prompt strings across commands.

## Project Structure & Boundaries

### Complete Project Directory Structure

```
bmadpilot/
├── README.md
├── package.json
├── tsconfig.json
├── .vscode/
│   ├── launch.json
│   └── extensions.json
├── .gitignore
├── src/
│   ├── extension.ts
│   ├── phaseInference/
│   │   ├── index.ts
│   │   ├── types.ts
│   │   └── __tests__/
│   │       └── phaseInference.test.ts
│   ├── artifactDetection/
│   │   ├── index.ts
│   │   └── types.ts
│   ├── views/
│   │   └── commandCenter/
│   │       ├── commandCenterView.ts
│   │       ├── commandCenterProvider.ts
│   │       └── types.ts
│   └── commands/
│       ├── index.ts
│       ├── prompts.ts
│       └── openChat.ts
├── test/
│   └── extension/
│       └── extension.test.ts
└── CHANGELOG.md
```

### Architectural Boundaries

**Component Boundaries:**
- **artifactDetection:** Input: workspace root path. Output: ArtifactSet. No VS Code API in core; used only by phaseInference.
- **phaseInference:** Input: workspace root (or ArtifactSet). Output: PhaseResult. No VS Code API in core; used by commandCenterView and (optionally) commands.
- **views/commandCenter:** TreeDataProvider; subscribes to refresh; calls phaseInference and renders TreeItems; handles loading/error state.
- **commands:** Register with extension context; call openChat with prompt from prompts.ts; no phase-based enablement (all actions always available).

**Service Boundaries:** No backend services. External boundary: Cursor/VS Code host (workspace API, commands API, view API). Chat is invoked via host command, not in-process.

**Data Boundaries:** No database. Workspace is read-only. In-memory: PhaseResult cache per view refresh. No cross-workspace state.

### Requirements to Structure Mapping

**FR Categories → Locations:**
- Command Center & status (FR1–5): `src/views/commandCenter/`, `src/extension.ts` (view registration).
- Phase & context inference (FR6–9): `src/phaseInference/`.
- Action launcher & BMAD commands (FR10–14): `src/commands/`, `package.json` contributions.
- Artifact detection (FR15–18): `src/artifactDetection/`.
- Onboarding & empty state (FR19–21): Handled in commandCenterView (empty phase + Help recommendation).
- Installation & behavior (FR22–23): `package.json` (engine, activation events), no shared state across workspaces.

**Cross-Cutting:** Phase inference and artifact detection are shared; both are pure and testable. Error degradation is in view and in inference (safe return values).

### Integration Points

**Internal:** View requests PhaseResult from phaseInference (which uses artifactDetection). Commands use shared openChat + prompts. No event bus.

**External:** Workspace (read-only), Cursor/VS Code command to open chat. No other external integrations for MVP.

**Data Flow:** Workspace paths → artifactDetection → ArtifactSet → phaseInference → PhaseResult → commandCenterView (TreeItems). User click on action → command → openChat(prompt) → host opens chat.

### File Organization Patterns

**Configuration:** `package.json` for extension id, commands, views, activation events; `tsconfig.json` for TypeScript. BMAD layout read from workspace, not from extension config.

**Source:** `src/` by concern (phaseInference, artifactDetection, views, commands). Entry: `src/extension.ts`.

**Tests:** Unit tests co-located under `src/phaseInference/__tests__/`; optional `test/extension/` for extension-host tests.

**Assets:** No static assets required for MVP (Tree View only). If webview added later, use a `media/` or `webview/` folder.

### Development Workflow Integration

**Development:** F5 runs Extension Development Host (launch.json). Changes require reload of Extension Development Host. Phase inference testable via Node/unit tests without IDE.

**Build:** `npm run compile` (TypeScript). Optional `npm run package` for VSIX. Lint and test in CI.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:** Technology choices are consistent: TypeScript, VS Code extension API, Tree View for Command Center, pure phase inference, no backend. Starter (generator-code) aligns with all decisions. No version or pattern conflicts.

**Pattern Consistency:** Naming (camelCase/PascalCase, command IDs), structure (phaseInference, artifactDetection, views, commands), and process (error degradation, no throw from inference) are aligned across the document.

**Structure Alignment:** Directory structure supports the defined boundaries; artifactDetection and phaseInference are separate; views and commands consume phase output; entry point registers all contributions.

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:** All FR categories are mapped to components: Command Center (views), phase inference (phaseInference), artifact detection (artifactDetection), action launcher (commands), onboarding/empty (phase 'empty' + Help), per-workspace behavior (no shared state). FR24–25 deferred to post-MVP.

**Non-Functional Requirements Coverage:** Performance (NFR-P): async/non-blocking refresh, lightweight detection. Reliability (NFR-R): degrade to safe state, no throw. Integration (NFR-I): public API only; min version in package.json. Security (NFR-S): read-only, no transmit, no credentials.

### Implementation Readiness Validation ✅

**Decision Completeness:** Critical decisions (Tree View, pure inference, chat invocation) and important ones (artifact detection approach, BMAD action set, min host) are documented. Deferred items (webview, Model/Mode, bundling) are called out.

**Structure Completeness:** Full project tree with src/phaseInference, src/artifactDetection, src/views/commandCenter, src/commands, tests. Entry and contributions are specified.

**Pattern Completeness:** Naming, structure, format (Phase/PhaseResult/ArtifactSet), communication (immutable state, single prompt source), and process (error/loading) patterns are defined with enforcement guidelines and examples.

### Gap Analysis Results

**Critical Gaps:** None. Implementation can start with the first story (scaffold extension).

**Important Gaps:** Exact Cursor command for "open chat with prompt" should be verified during implementation (API may be `cursor.chat.open` or similar). Phase enum and BMAD action list should be kept in sync with canonical BMAD workflows.

**Nice-to-Have:** Optional integration test that runs extension in Extension Development Host and asserts Tree View content for a mock workspace. Document BMAD version/capabilities assumed.

### Validation Issues Addressed

No blocking issues. Recommendation: implement phase inference and artifact detection first with unit tests; then wire view and commands so that inference is the single source of truth.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented with rationale
- [x] Technology stack and starter specified
- [x] Integration patterns (extension ↔ host, chat) defined
- [x] Performance and reliability addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication and process patterns specified
- [x] Enforcement guidelines and examples documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points and data flow mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High — validation shows coherent decisions, full FR/NFR coverage, and clear structure and patterns for AI agents.

**Key Strengths:** Single source of truth for phase; testable inference and detection; clear boundaries; no backend or auth complexity; recommend-don't-block preserved in structure.

**Areas for Future Enhancement:** Webview for richer UI; Global Model/Mode; optional bundling; integration tests in Extension Development Host.

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented.
- Use implementation patterns consistently (naming, structure, Phase/PhaseResult, error degradation).
- Respect project structure and boundaries (artifactDetection → phaseInference → view/commands).
- Refer to this document for all architectural questions.

**First Implementation Priority:** Initialize the extension with the starter: `npm install -g yo generator-code` then `yo code --extensionType ts --extensionId bmadpilot --extensionDescription "BMAD Command Center and artifact-driven launcher for Cursor" --pkgManager npm` (or interactive `yo code`). Then implement artifact detection, phase inference (with unit tests), Command Center Tree View, and BMAD commands in that order.
