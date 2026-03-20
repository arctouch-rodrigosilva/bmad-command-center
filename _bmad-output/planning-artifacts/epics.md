---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories, step-04-final-validation]
inputDocuments:
  - prd.md
  - architecture.md
---

# BMADPilot - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for BMADPilot, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: The user can open a dedicated Command Center view that is the primary BMAD surface in the IDE.
FR2: The user can see a concise "Where you are" summary (current phase/context) in the Command Center.
FR3: The user can see a "What's next" recommendation (one suggested next action) in the Command Center.
FR4: The user can see the Command Center update after repo state changes (e.g. new or updated artifacts) when the view is refreshed or reopened.
FR5: The user can switch between the Command Center and the normal editor/explorer without losing plugin state.
FR6: The system can infer current phase/context from the workspace (e.g. presence and location of artifacts under `_bmad-output`, planning-artifacts, implementation-artifacts, config).
FR7: The system can derive a single recommended next action from the inferred phase and BMAD sequencing (e.g. suggest Create PRD when no PRD exists, suggest Dev Story when stories exist and one is next).
FR8: The system can distinguish upstream (discovery, planning, architecture) from downstream (execution: stories, dev, test) for status and recommendation.
FR9: The system can handle "empty" or non-BMAD workspaces (no or minimal BMAD layout) and still show a sensible status and recommendation (e.g. "No BMAD artifacts" and suggest Create PRD or Help).
FR10: The user can trigger BMAD workflows from the Command Center via actions (e.g. buttons or links) that map to BMAD commands (e.g. Create PRD, Create architecture, Create epics, Dev Story, Code Review, Help).
FR11: When the user triggers a BMAD action, the system opens Cursor chat (or equivalent) and runs the corresponding BMAD command so the agent executes in chat, not inside the extension UI.
FR12: The user can access all supported BMAD actions from the Command Center at all times; no action is disabled based on phase (recommend, don't block).
FR13: The user can initiate the recommended next action in one or two steps (e.g. one click from the Command Center).
FR14: The system can highlight or emphasize the recommended action while still showing the full set of actions.
FR15: The system can detect the presence of key BMAD artifacts (e.g. PRD, architecture docs, epics, stories, implementation-artifacts) via workspace paths and/or file existence.
FR16: The system can use a known BMAD folder structure (e.g. `_bmad-output`, planning-artifacts, implementation-artifacts, config) to drive phase inference and UI (which actions to show/emphasize).
FR17: The system performs artifact detection without requiring the user to declare or configure current phase manually.
FR18: The system does not write to the repo as part of phase inference or recommendation; writing happens only through user-driven workflows (e.g. chat/skills).
FR19: The user can see a clear status and suggested first action when the workspace has no or minimal BMAD artifacts (e.g. "No BMAD artifacts yet" and suggest Create PRD or Help).
FR20: The user can discover how to get started with BMAD (e.g. via a Help action or link to method basics) from the Command Center.
FR21: The user can open the Command Center and get value (status + launcher) without prior configuration of the extension for that workspace.
FR22: The user can install the plugin as a Cursor (or VS Code–compatible) extension and open the Command Center from the IDE.
FR23: The user can invoke the same BMAD actions across different workspaces; each workspace's phase is inferred independently (per-repo).
FR24: (Post-MVP) The user can set a global Model preference in the Command Center that applies to chats launched from the extension (when implemented).
FR25: (Post-MVP) The user can set a global Mode preference in the Command Center that applies to chats launched from the extension (when implemented).

### NonFunctional Requirements

NFR-P1: Artifact detection (scan of BMAD-relevant paths) completes within 2 seconds for a typical workspace so the Command Center can show status without noticeable delay.
NFR-P2: Opening or refreshing the Command Center view does not block the UI thread; detection runs asynchronously or in a way that keeps the IDE responsive.
NFR-P3: Triggering an action (e.g. clicking a BMAD button) opens chat and runs the command within 1 second under normal conditions (no prescribed implementation).
NFR-R1: The extension does not crash or hang the host IDE; failures in phase inference or recommendation degrade to a safe state (e.g. show full action list and Help) rather than breaking the extension.
NFR-R2: If workspace read or artifact detection fails (e.g. permission, missing path), the user still sees a usable Command Center (e.g. "Unable to infer phase" and full list of actions).
NFR-I1: The extension remains compatible with the public Cursor/VS Code extension API surface it uses; it does not rely on undocumented or private APIs for MVP behavior.
NFR-I2: Supported Cursor/VS Code version(s) are documented (e.g. minimum version) so users know compatibility.
NFR-S1: The extension only reads workspace files and config needed for artifact detection and recommendation; it does not transmit repo content to external services as part of phase inference or launcher behavior.
NFR-S2: No user credentials or payment data are collected or processed by the extension.

### Additional Requirements

- **Starter template:** Initialize extension with generator-code (yo code), TypeScript: `yo code --extensionType ts --extensionId bmadpilot --extensionDescription "BMAD Command Center and artifact-driven launcher for Cursor" --pkgManager npm`. This is the first implementation story (Epic 1 Story 1).
- **Phase inference:** Implement as a pure function (workspace paths + file existence → phase + recommended action); testable in isolation without VS Code API in core logic; no side effects.
- **Artifact detection:** Lightweight, synchronous path-existence checks; results cached per refresh; no heavy parsing in hot path; no VS Code API in core so unit-testable.
- **Command Center surface:** **Hybrid MVP** — primary **WebviewPanel** (editor area, tile-style launcher via `bmadpilot.openCommandCenterPanel`) plus **sidebar Tree View** (Explorer) for status placeholders and quick open (view title + tree row). Both public VS Code APIs. Epic 2–3 wire phase and BMAD actions into both surfaces as needed.
- **Chat invocation:** Use VS Code/Cursor command to open chat with predefined BMAD command string; extension does not execute BMAD workflows internally.
- **Project structure:** Follow Architecture document: `src/phaseInference/`, `src/artifactDetection/`, `src/views/commandCenter/`, `src/commands/`; single Phase and RecommendedAction types; command IDs and prompts in one place (e.g. `src/commands/prompts.ts`).
- **Error handling:** Artifact detection or inference failure must not throw; return safe state (e.g. phase `empty`, recommended action `help`); view shows "Unable to infer phase" and full action list when inference fails.
- **Minimum host:** Document minimum Cursor/VS Code version in `package.json` (engines.vscode).
- **Unit tests:** Phase inference must have unit tests; artifact detection testable in isolation. No unhandled rejections or crashes from inference/detection.

### UX Design Requirements

_No UX Design document was provided. This section is empty; UX requirements are covered by PRD and Architecture._

### FR Coverage Map

FR1: Epic 1 - Open Command Center as primary BMAD surface
FR2: Epic 2 - See "Where you are" summary
FR3: Epic 2 - See "What's next" recommendation
FR4: Epic 2 - Command Center updates on repo/refresh
FR5: Epic 1 - Switch views without losing plugin state
FR6: Epic 2 - Infer phase/context from workspace
FR7: Epic 2 - Single recommended next action from phase
FR8: Epic 2 - Upstream vs downstream distinction
FR9: Epic 2 - Sensible behavior for empty/non-BMAD workspace
FR10: Epic 3 - Trigger BMAD workflows from Command Center
FR11: Epic 3 - Action opens chat with BMAD command
FR12: Epic 3 - All actions always available
FR13: Epic 3 - Recommended action in one or two steps
FR14: Epic 3 - Recommended action highlighted
FR15: Epic 2 - Detect key BMAD artifacts
FR16: Epic 2 - Use BMAD folder structure for inference/UI
FR17: Epic 2 - No manual phase configuration
FR18: Epic 2 - No writes from inference/recommendation
FR19: Epic 4 - Clear status and first action when no/minimal artifacts
FR20: Epic 4 - Discover BMAD from Command Center (Help)
FR21: Epic 1 - Value without prior configuration
FR22: Epic 1 - Install as extension, open Command Center
FR23: Epic 1 - Per-workspace phase (no shared state)
FR24: Epic 5 - Global Model preference (Post-MVP)
FR25: Epic 5 - Global Mode preference (Post-MVP)

## Epic List

### Epic 1: Extension foundation and Command Center
User can install BMADPilot and open the Command Center as the primary BMAD surface: **full panel in the editor** (main launcher) plus a **compact sidebar tree**, without losing plugin state when switching views.
**FRs covered:** FR1, FR5, FR21, FR22, FR23

### Epic 2: Phase and context from the repo
User sees an accurate "Where you are" and "What's next" in the Command Center that reflect the current repo state, with no manual configuration.
**FRs covered:** FR2, FR3, FR4, FR6, FR7, FR8, FR9, FR15, FR16, FR17, FR18

### Epic 3: Launch BMAD workflows from the Command Center
User can trigger any BMAD workflow from the Command Center; the recommended action is highlighted and one click away; triggering opens Cursor chat with the correct BMAD command.
**FRs covered:** FR10, FR11, FR12, FR13, FR14

### Epic 4: Onboarding and resilient experience
User sees clear status and guidance when the workspace has no BMAD artifacts or when inference fails, and can discover how to get started with BMAD.
**FRs covered:** FR19, FR20; NFR-R2

### Epic 5: Global Model & Mode preferences (Post-MVP)
User can set global Model and Mode preferences in the Command Center that apply to chats launched from the extension. (Phase 2; stories may be created later.)
**FRs covered:** FR24, FR25

---

## Epic 1: Extension foundation and Command Center

User can install BMADPilot and open the Command Center as the primary BMAD surface: **editor-area webview panel** (tile launcher) and **Explorer Tree View** (status + shortcuts), without losing plugin state when switching views.

### Story 1.1: Initialize extension with generator-code (TypeScript)

As a developer,
I want the extension scaffold created with the official VS Code extension generator (yo code, TypeScript),
So that I have a standard, maintainable base to add the Command Center and BMAD logic.

**Acceptance Criteria:**

**Given** a machine with Node.js and npm installed  
**When** I run `npm install -g yo generator-code` and `yo code --extensionType ts --extensionId bmadpilot --extensionDescription "BMAD Command Center and artifact-driven launcher for Cursor" --pkgManager npm` (or equivalent interactive choices)  
**Then** a TypeScript extension project is created with `package.json`, `src/extension.ts`, `tsconfig.json`, `.vscode/launch.json`, and standard extension layout  
**And** the extension activates and runs in Extension Development Host (F5) without error  
**And** `package.json` includes `engines.vscode` with a minimum supported version (NFR-I2)

### Story 1.2: Register Command Center Tree View

As a BMAD practitioner,
I want a dedicated Command Center view in the IDE sidebar (Tree View),
So that I have a primary BMAD surface I can open from the editor.

**Acceptance Criteria:**

**Given** the extension is installed and the workspace is open  
**When** I open the Command Center view (via View menu or activity bar)  
**Then** a Tree View is displayed with a stable container (e.g. root node or placeholder nodes)  
**And** the view is registered in `package.json` under `contributes.views` with a clear view id and label  
**And** the Tree View is implemented with a TreeDataProvider (e.g. under `src/views/commandCenter/`)

### Story 1.3: Show minimal Command Center content and preserve state

As a BMAD practitioner,
I want the Command Center to show at least "Where you are" and "What's next" placeholders and to keep plugin state when I switch views,
So that I see a coherent BMAD home and don’t lose context when moving between Command Center and editor.

**Acceptance Criteria:**

**Given** the Command Center Tree View is open  
**When** the view is rendered  
**Then** at least two logical areas (or nodes) are visible: one for "Where you are" and one for "What's next" (placeholder text is acceptable)  
**And** when I switch to the editor or explorer and back to the Command Center, the view content does not reset unexpectedly (FR5)  
**And** I can use the Command Center without configuring the extension for this workspace (FR21)

---

## Epic 2: Phase and context from the repo

User sees an accurate "Where you are" and "What's next" in the Command Center that reflect the current repo state, with no manual configuration.

### Story 2.1: Artifact detection module

As a BMAD practitioner,
I want the extension to detect key BMAD artifacts (PRD, architecture, epics, stories, implementation-artifacts) from the workspace,
So that phase and recommendations can be derived without manual configuration.

**Acceptance Criteria:**

**Given** a workspace root path  
**When** the artifact detection function is called with that path  
**Then** it returns an ArtifactSet (e.g. hasPrd, hasArchitecture, hasEpics, hasStories, hasImplementationArtifacts) based on presence of files under `_bmad-output`, planning-artifacts, implementation-artifacts, and config (FR15, FR16, FR17)  
**And** the implementation uses only path existence checks (no heavy parsing); no VS Code API in the core detection logic so it is unit-testable (Additional requirement)  
**And** the module does not write to the repo (FR18)  
**And** unit tests exist that verify detection for at least two scenarios (e.g. empty workspace, workspace with prd.md only)

### Story 2.2: Phase inference module

As a BMAD practitioner,
I want the extension to infer current phase (upstream vs downstream, or empty) and a single recommended next action from the artifact set,
So that "Where you are" and "What's next" can be shown automatically.

**Acceptance Criteria:**

**Given** an ArtifactSet (or workspace root that is resolved to ArtifactSet)  
**When** the phase inference function is called  
**Then** it returns a PhaseResult with phase (e.g. empty, planning, architecture, epics, execution) and recommendedActionId (FR6, FR7, FR8)  
**And** for empty or non-BMAD workspace it returns phase `empty` and recommended action `help` (or equivalent) (FR9)  
**And** the function is pure (no side effects, no VS Code API in core); it never throws—invalid or missing input yields safe fallback (e.g. empty + help) (Additional requirement, NFR-R1)  
**And** unit tests cover at least: empty workspace, PRD only, PRD + architecture, and one downstream case

### Story 2.3: Wire phase to Command Center and refresh

As a BMAD practitioner,
I want the Command Center to display the inferred "Where you are" and "What's next" and to update when I refresh or when the repo changes,
So that I always see current status without manual configuration.

**Acceptance Criteria:**

**Given** artifact detection and phase inference are implemented  
**When** the Command Center view is opened or refreshed  
**Then** the Command Center **tree** and **webview panel** (when open) show "Where you are" and "What's next" text derived from PhaseResult (FR2, FR3)  
**And** detection/inference runs asynchronously or in a non-blocking way so the UI thread is not blocked (NFR-P2)  
**And** artifact scan completes within 2 seconds for a typical workspace (NFR-P1)  
**And** the view refreshes when the user reopens the view or when workspace/configuration change is detected, so updated artifacts are reflected (FR4)  
**And** only workspace files and config needed for detection are read; no repo content is transmitted externally (NFR-S1, NFR-S2)

---

## Epic 3: Launch BMAD workflows from the Command Center

User can trigger any BMAD workflow from the Command Center; the recommended action is highlighted and one click away; triggering opens Cursor chat with the correct BMAD command.

### Story 3.1: BMAD commands and chat invocation

As a BMAD practitioner,
I want to trigger a BMAD workflow from the Command Center and have Cursor chat open with the correct BMAD command,
So that the agent runs the workflow in chat, not inside the extension UI.

**Acceptance Criteria:**

**Given** the extension is loaded and the Command Center is available  
**When** I trigger a BMAD action (e.g. Create PRD, Create architecture, Create epics, Dev Story, Code Review, Help)  
**Then** the system opens Cursor chat (or equivalent) and runs the corresponding BMAD command so the agent executes in chat (FR10, FR11)  
**And** command IDs and prompt/command strings are defined in one place (e.g. `src/commands/prompts.ts`) (Architecture)  
**And** the extension uses only the public Cursor/VS Code extension API for opening chat (NFR-I1)  
**And** triggering an action opens chat and runs the command within 1 second under normal conditions (NFR-P3)

### Story 3.2: Command Center actions as Tree items

As a BMAD practitioner,
I want all BMAD actions (Create PRD, Create architecture, Create epics, Dev Story, Code Review, Help) visible and clickable in the Command Center,
So that I can start any workflow in one or two steps and none are disabled by phase.

**Acceptance Criteria:**

**Given** the Command Center is open  
**When** I look at the view  
**Then** all supported BMAD actions are visible as Tree items and/or **webview tiles** (or equivalent) and are clickable (FR12)  
**And** clicking an action opens chat with the correct BMAD command (FR11)  
**And** the recommended next action is reachable in one click from the Command Center (FR13)  
**And** no action is disabled based on current phase (recommend, don’t block)

### Story 3.3: Emphasize recommended action

As a BMAD practitioner,
I want the recommended next action to be visually distinct in the Command Center while still seeing all actions,
So that I can follow the suggestion quickly without losing access to other workflows.

**Acceptance Criteria:**

**Given** the Command Center shows the current phase and recommended action  
**When** the view is rendered  
**Then** the recommended action is visually emphasized (e.g. icon, label, or placement) (FR14)  
**And** all other BMAD actions remain visible and clickable

---

## Epic 4: Onboarding and resilient experience

User sees clear status and guidance when the workspace has no BMAD artifacts or when inference fails, and can discover how to get started with BMAD.

### Story 4.1: Empty state and first-action suggestion

As a BMAD practitioner with a new or empty project,
I want to see a clear status and suggested first action when there are no (or minimal) BMAD artifacts,
So that I know what to do next without reading docs.

**Acceptance Criteria:**

**Given** the workspace has no or minimal BMAD artifacts (e.g. no prd.md, no architecture)  
**When** I open the Command Center  
**Then** the status shows a clear message (e.g. "No BMAD artifacts yet" or "Where you are: Getting started") (FR19)  
**And** the recommended action is Create PRD or Help (or equivalent)  
**And** the user can act on that recommendation in one click

### Story 4.2: Help action and BMAD discovery

As a BMAD practitioner,
I want to discover how to get started with BMAD from the Command Center (e.g. Help action or link),
So that I don’t have to leave the IDE to find method basics.

**Acceptance Criteria:**

**Given** the Command Center is open  
**When** I use the Help action (or equivalent)  
**Then** I can open chat with bmad-help or access a link to BMAD method basics (FR20)  
**And** the Help action is always available in the Command Center

### Story 4.3: Graceful degradation on detection failure

As a BMAD practitioner,
I want the Command Center to remain usable when workspace read or artifact detection fails,
So that I can still use the launcher (e.g. full action list and Help) instead of a broken view.

**Acceptance Criteria:**

**Given** workspace read or artifact detection fails (e.g. permission error, missing path)  
**When** the Command Center is opened or refreshed  
**Then** the view shows a sensible message (e.g. "Unable to infer phase") and the full list of BMAD actions (NFR-R2)  
**And** the extension does not crash or hang; failures degrade to a safe state (NFR-R1)  
**And** the user can still trigger any action (e.g. Help) from the list

---

## Epic 5: Global Model & Mode preferences (Post-MVP)

User can set global Model and Mode preferences in the Command Center that apply to chats launched from the extension. Phase 2; implementation deferred.

### Story 5.1: Set global Model preference (Post-MVP)

As a BMAD practitioner,
I want to set a global Model preference in the Command Center that applies to chats launched from the extension,
So that I don’t have to choose the model every time.

**Acceptance Criteria:**

**Given** the Command Center supports global preferences (Phase 2)  
**When** I set a Model preference in the Command Center  
**Then** chats launched from the extension use that model by default  
**And** the preference is persisted across sessions (implementation details deferred)

_Note: This story is for Phase 2; acceptance criteria may be refined when the feature is scheduled._

### Story 5.2: Set global Mode preference (Post-MVP)

As a BMAD practitioner,
I want to set a global Mode preference in the Command Center that applies to chats launched from the extension,
So that I don’t have to choose the mode every time.

**Acceptance Criteria:**

**Given** the Command Center supports global preferences (Phase 2)  
**When** I set a Mode preference in the Command Center  
**Then** chats launched from the extension use that mode by default  
**And** the preference is persisted across sessions (implementation details deferred)

_Note: This story is for Phase 2; acceptance criteria may be refined when the feature is scheduled._
