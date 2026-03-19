---
stepsCompleted: [step-01-init, step-02-discovery, step-02b-vision, step-02c-executive-summary, step-03-success, step-04-journeys, step-05-domain, step-06-innovation, step-07-project-type, step-08-scoping, step-09-functional, step-10-nonfunctional, step-11-polish]
inputDocuments:
  - _bmad-output/brainstorming/brainstorming-session-2026-03-17-1148.md
briefCount: 0
researchCount: 0
brainstormingCount: 1
projectDocsCount: 0
workflowType: prd
classification:
  projectType: developer_tool
  domain: general
  complexity: low
  projectContext: greenfield
---

# Product Requirements Document - BMADPilot

**Author:** Rodrigo
**Date:** 2026-03-17

## Executive Summary

**BMADPilot** is a Cursor plugin that makes the BMAD method the primary workspace instead of an afterthought. Target users are teams and solo practitioners who already use BMAD in Cursor and want "Where am I?" and "What's next?" to be obvious without leaving the editor. The plugin solves the friction of context-switching and guessing the next step by inferring phase and status from the repo and surfacing the right actions in one place.

### What Makes This Special

- **Method-first inversion:** The main surface is BMAD stages, key documents, and actions; the editor is a mode you switch into when you need to edit. Status is phase-aware (upstream vs downstream) and tied to the story lifecycle (draft/approve → dev → test).
- **Artifact-driven UI:** The plugin reads project directories and key files (`_bmad-output`, planning-artifacts, implementation-artifacts, config) to infer phase and context. Which artifacts exist drives which parts of the UI are shown and which actions are highlighted (e.g. "Create PRD" vs "Dev Story" vs "Code Review"). No manual "I'm in phase X"—the UI follows the repo.
- **Recommend, don't block:** When context is in-between (e.g. architecture missing), the UI recommends the next action but never disables others. All steps stay available so users can jump ahead when they want.
- **Clear mental model:** Action buttons don't run work inside the command center—they open chat and run the corresponding BMAD command (e.g. bmad-help, bmad-bmm-create-prd, bmad-bmm-dev-story). Chat remains the execution surface; the command center is the launcher. Global **Model** and **Mode** selectors let users set defaults once for all invoked chats.

**Core insight:** Treating the method as first-class context and deriving state from the filesystem makes "what should I do next?" answerable without extra configuration or manual phase selection.

## Project Classification

| Dimension        | Value           |
|-----------------|-----------------|
| Project type    | Developer tool  |
| Domain          | General         |
| Complexity      | Low             |
| Project context | Greenfield      |

## Success Criteria

### User Success

- Users see "Where am I?" and "What's next?" at a glance in the command center, without re-reading docs or guessing.
- Users complete the next recommended BMAD action (e.g. Create PRD, Dev Story, Code Review) in one or two clicks (button → chat with command).
- Users can override recommendations and jump to any BMAD step without being blocked.
- Users set model and mode once in the command center and have all launched chats use those defaults.

### Business Success

- BMAD practitioners using Cursor adopt the plugin as their primary way to run the method (e.g. target adoption within X months of release).
- Time-to-next-action decreases: users spend less time figuring out "what do I do next?" and more time in execution.
- The plugin serves as the reference implementation for "BMAD in Cursor," reinforcing method adoption and consistency.

### Technical Success

- Plugin correctly infers phase/context from repo state (e.g. presence of `prd.md`, architecture docs, stories, implementation-artifacts).
- Recommended next action aligns with BMAD sequencing (e.g. no "Dev Story" before PRD/architecture when in greenfield).
- Action buttons reliably open chat with the correct BMAD command; model and mode selectors apply to those chats.
- No blocking: all BMAD actions remain available regardless of current phase.

### Measurable Outcomes

- Phase detection accuracy: inferred phase matches actual project state (e.g. manual audit or spot checks).
- Recommendation relevance: when a "next step" is shown, users follow it a high % of the time (or explicitly choose another action).
- Launcher usage: meaningful % of BMAD workflows are started from command-center buttons rather than typing commands in chat.

## Product Scope

### MVP - Minimum Viable Product

Command center view; phase-aware status ("where am I / what's next"); artifact-driven highlighting of key actions; action buttons that open chat and run the right BMAD command; recommend next step without blocking others.

### Growth Features (Post-MVP)

Global Model and Mode selectors in the command center; richer phase/context (e.g. downstream story loop); polish and edge cases in artifact detection.

### Vision (Future)

Full method-first experience (e.g. kanban of stories, shortcuts to project definitions); deeper integration with Cursor UI; possible "BMAD home" as default view. (See Project Scoping & Phased Development for detailed MVP strategy, phases, and risks.)

## User Journeys

### Journey 1: Primary User — Success Path (Core Experience)

**Persona:** Alex, a developer who uses BMAD in Cursor for a greenfield product. They've run a brainstorming session and have a session file in `_bmad-output/brainstorming/`.

**Opening:** Alex opens the project in Cursor. Instead of wondering what to do next, they open the BMAD Command Center (plugin view). The UI has inferred "planning" from the repo: brainstorming exists, no `prd.md` yet. The center shows "Where you are: post-brainstorming, pre-PRD" and recommends **Create PRD** as the next step.

**Rising action:** Alex sees the Create PRD action highlighted; other actions (Dev Story, Code Review, etc.) are visible but not emphasized. They click **Create PRD**. Chat opens with the create-PRD command pre-run. They complete the PRD workflow in chat. After saving `prd.md` to planning-artifacts, they return to the command center.

**Climax:** The center now shows "Where you are: PRD done, pre-architecture" and recommends the next step (e.g. Create architecture or Create epics). Alex feels they didn't have to remember the method order or hunt for the right command—the system guided them.

**Resolution:** Alex repeats the pattern for architecture, epics, stories, and dev. Each time, the command center reflects current artifacts and suggests the next action. Their "what do I do next?" anxiety drops; the method feels like a clear path, not a checklist they have to remember.

### Journey 2: Primary User — Edge Case (Override and Recovery)

**Persona:** Sam, same profile as Alex but on a project where they want to skip ahead or fix a mistake.

**Opening:** Sam's repo has a PRD and architecture, but no epics yet. The command center recommends "Create epics and stories." Sam knows they need to do a quick UX pass first and wants to run a UX-design workflow instead.

**Rising action:** Sam looks for a "Create UX design" (or equivalent) action. It's available in the command center even though it's not the "recommended" step. They click it; chat opens with that command. No blocking, no "you must do epics first."

**Climax:** Later, Sam realizes they forgot to add a section to the PRD. They go back to the command center. Despite being "downstream" (e.g. stories exist), the center still shows **Edit PRD** (or Create PRD) as an option. They open it, make the edit, save. No gatekeeping.

**Resolution:** Sam finishes the UX flow and later continues with epics. They feel the plugin recommends but never locks them in; they can correct course or jump phases when it makes sense.

### Journey 3: Returning User — Context Recovery

**Persona:** Jordan, back to a project after a few days. They don't remember exactly where they left off.

**Opening:** Jordan opens the project and the BMAD Command Center. The plugin has read the repo: `prd.md`, architecture, and several stories exist; one story is in progress (e.g. implementation-artifacts or a story file marked in progress). The center shows "Where you are: in execution — story in progress" and surfaces "Dev Story" or "Continue story" (or the relevant next action).

**Rising action:** Jordan sees the recommended action and a short summary of current phase (e.g. "Downstream: story lifecycle"). They click the recommended action; chat opens with the right command and context. They resume work without re-reading the PRD or digging through folders.

**Climax:** The moment of value is immediate orientation: "I'm in execution, this story is next." No mental reload of the method.

**Resolution:** Jordan completes the story, and the center updates to the next story or to "Code review / QA" as appropriate. The loop (draft/approve → dev → test) is visible and actionable from the center.

### Journey 4: Team Lead / Multi-Repo User — Consistency

**Persona:** Morgan, a tech lead who uses BMAD across several Cursor projects (different repos).

**Opening:** Morgan switches between Repo A (early planning) and Repo B (execution). Each repo has different artifact sets. They open the command center in Repo A: it shows planning actions and "Create PRD" or "Create architecture." They switch to Repo B: the center shows execution actions and story-level next steps.

**Rising action:** Morgan uses the same plugin and same mental model in both repos. They don't configure "I'm in planning here" — the plugin infers from each repo. They use global Model/Mode selectors once (when available) so every launched chat uses their preferred defaults.

**Climax:** Consistency across repos: one place to look for "what's next," regardless of project phase. Reduces context-switching and method drift.

**Resolution:** Morgan can move between projects without re-learning the plugin; artifact-driven behavior scales across their projects.

### Journey Requirements Summary

| Journey | Capabilities Revealed |
|--------|------------------------|
| 1 – Success path | Command center as home; phase/context inference from repo; recommended next action; action buttons that open chat with correct BMAD command; UI updates after new artifacts (e.g. after PRD save). |
| 2 – Override/recovery | All BMAD actions always available; recommend without blocking; support "skip ahead" and "go back" (e.g. edit PRD when downstream). |
| 3 – Context recovery | Phase summary ("Where you are"); inference of "in execution" and current story; persistent visibility of story lifecycle and next action. |
| 4 – Multi-repo | Per-repo inference (no shared state); same UX across repos; global Model/Mode selectors (growth) for consistent chat defaults. |

## Innovation & Novel Patterns

### Detected Innovation Areas

- **New paradigm in the IDE:** The product inverts the usual model (editor + files first, method as secondary). Here, the BMAD workflow is the primary surface and the editor is a mode. That reframes "what am I doing?" from "editing files" to "where am I in the method?"—a different way of using an IDE for method-driven work.
- **Artifact-driven state:** Phase and "what's next" are inferred from the repo (directories, key files) instead of user-declared configuration. That makes "what should I do next?" answerable by reading the project, reducing memory load and method drift.
- **Recommend-don't-block UX:** The UI suggests the next step but never disables other steps. That keeps guidance without gatekeeping—a clear product choice that supports both guided and power-user workflows.

### Market Context & Competitive Landscape

- Existing "BMAD in Cursor" usage is command-based and chat-centric; there is no method-first home or artifact-driven launcher. The plugin would be the first reference implementation of BMAD as the primary workspace inside Cursor.
- Broader IDE/method tooling tends to be either generic task lists or rigid wizards; this combines method awareness with filesystem-derived context and non-blocking recommendations.

### Validation Approach

- **Phase inference:** Manually audit inferred phase vs actual project state across sample repos (greenfield, mid-planning, in execution).
- **Recommendation relevance:** Track when users follow the suggested next action vs choose another; tune heuristics and copy from feedback.
- **Adoption and stickiness:** Early adopters use the command center as the main entry point for BMAD workflows (e.g. launcher usage, time-to-next-action).

### Risk Mitigation

- **Inference wrong or confusing:** Fallback: always show full action set and "What's next?" (e.g. bmad-help) so users can ignore bad recommendations.
- **Cursor API or UX limits:** Design so core value (status + launcher) works within current extension surface; defer deep "BMAD home" integration until APIs or patterns are clear.
- **Method drift (BMAD changes):** Keep phase/action model and commands aligned with canonical BMAD; document assumptions so updates are traceable.

## Developer Tool Specific Requirements

### Project-Type Overview

BMADPilot is a Cursor extension (developer tool) that provides a BMAD Command Center and artifact-driven launcher. It integrates with the IDE via the extension API, invokes chat with BMAD commands, and reads repo state to infer phase and next actions. Requirements follow developer-tool concerns: runtime (Cursor/VS Code), integration surface, install/update, docs, and examples.

### Technical Architecture Considerations

- **Runtime:** Cursor (VS Code–compatible). Extension runs in the host IDE; no separate backend. State is derived from the workspace filesystem and extension host APIs.
- **Integration points:** Extension API (views, commands, workspace access); Cursor chat/agent invocation (commands that open chat with a specific prompt/command); workspace folder and file reads for artifact detection.
- **Artifact detection:** Read-only access to `_bmad-output`, `_bmad-output/planning-artifacts`, `_bmad-output/implementation-artifacts`, and config (e.g. `_bmad/bmm/config.yaml`) to infer phase and recommend next action. No writing to repo from the project-type logic beyond what the user does via existing workflows.

### Language & Runtime Matrix

| Area | Choice | Notes |
|------|--------|--------|
| Extension implementation | TypeScript/JavaScript | Standard for VS Code/Cursor extensions. |
| BMAD content / config | Markdown, YAML | PRD, stories, config as in BMAD method. |
| Packaging | npm | Extension packaged and versioned via npm; install via Cursor/VS Code extension mechanism. |

### Installation & Distribution

- **Install method:** Install as Cursor (or VS Code) extension from marketplace or from VSIX. No separate CLI or global install.
- **Updates:** Follow standard extension update flow (IDE-managed). Optional: in-extension notice when a new version is available.
- **Dependencies:** Extension depends on Cursor/VS Code APIs and workspace layout (BMAD folder structure). Document minimum Cursor/VS Code version if needed.

### API Surface (Extension & Commands)

- **Extension surface:** (1) **Views:** Command Center (primary view); optional panels for status or shortcuts. (2) **Commands:** One command per BMAD workflow (e.g. Create PRD, Create architecture, Create epics, Dev Story, Code Review, Help). Each command opens chat with the corresponding BMAD command (e.g. `bmad-bmm-create-prd`). (3) **Workspace:** Read-only access to detect artifacts and infer phase; no requirement to implement write from the extension beyond invoking user workflows (e.g. skills that write files).
- **Command contract:** Action buttons in the Command Center trigger commands that open the chat composer and run the chosen BMAD command so the agent runs in chat, not inside the extension UI.

### Code Examples & Onboarding

- **Examples:** Provide or point to at least one sample BMAD project (e.g. repo with `_bmad-output`, planning-artifacts, optional stories) so users can open it and see the Command Center and recommendations without creating a project from scratch.
- **Onboarding:** First-time or "empty project" experience: clear "Where you are" (e.g. no BMAD artifacts yet) and suggested first action (e.g. Create PRD or run bmad-help), with short in-UI or doc pointer to BMAD method basics if needed.

### Migration & Compatibility

- **Migration:** N/A for v1 (new product). Future: if BMAD folder structure or config schema changes, document compatibility and any one-time migration (e.g. config upgrade) in release notes.
- **Compatibility:** Align with canonical BMAD method (workflows, commands, artifact names). Document which BMAD version/capabilities the plugin assumes so method updates can be tracked.

### Implementation Considerations

- Use VS Code Extension API (workspace, commands, tree/views, optionally webview) within Cursor's supported surface. Avoid relying on undocumented or Cursor-only behaviors where avoidable so the extension remains maintainable.
- Phase inference logic should be testable in isolation (e.g. pure function: workspace paths + file existence → phase + recommended action). Keep inference rules documented so they can be updated when BMAD or repo layout evolves.
- Performance: artifact detection should be fast (e.g. lightweight file existence/path checks, minimal parsing). Avoid heavy scans or blocking the UI thread.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Experience MVP — the smallest set that delivers the core experience: "Where am I?" and "What's next?" at a glance, with one-click launch into the right BMAD workflow. No separate backend; extension + repo read + Cursor chat.

**Resource Requirements:** Small team (1–2) capable of Cursor/VS Code extension development (TypeScript, extension API, optional webview). BMAD method familiarity (workflows, artifact layout) required for phase inference and copy.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:** Journey 1 (success path), Journey 2 (override/recovery), Journey 3 (context recovery). Journey 4 (multi-repo) is supported in MVP at the "per-repo inference" level; global Model/Mode selectors are Phase 2.

**Must-Have Capabilities:**

- Command Center view (primary surface).
- Phase/context inference from repo (e.g. `_bmad-output`, planning-artifacts, implementation-artifacts, config).
- "Where you are" / "What's next" summary and one recommended action.
- Action buttons for key BMAD workflows that open chat and run the corresponding command (e.g. Create PRD, Create architecture, Create epics, Dev Story, Code Review, Help).
- All actions always available (recommend, don't block).
- No writing to repo from extension logic beyond what the user does via chat/skills.

### Post-MVP Features

**Phase 2 (Growth):** Global Model and Mode selectors in the Command Center; richer phase/context (e.g. downstream story loop, "story in progress"); polish and edge cases in artifact detection; optional in-extension update notice.

**Phase 3 (Expansion):** Full method-first experience (e.g. kanban of stories, shortcuts to project definitions); deeper Cursor integration ("BMAD home" as default view if APIs allow); additional BMAD workflows as commands.

### Risk Mitigation Strategy

**Technical Risks:** Phase inference is the riskiest part. Mitigate with simple, documented rules (file/folder existence), testable logic, and fallback to "full action list + bmad-help" if inference is wrong. Stay within public Cursor/VS Code extension APIs.

**Market Risks:** Risk is low adoption. Mitigate by shipping MVP to early BMAD-in-Cursor users, measuring launcher usage and time-to-next-action, and iterating on recommendation relevance.

**Resource Risks:** MVP is scoped to one extension surface and read-only inference; no backend or multi-tenant complexity. If resources shrink, cut Phase 2 (Model/Mode, polish) and keep Phase 1 (status + launcher) as the minimal shippable product.

## Functional Requirements

The following requirements form the capability contract for UX design, architecture, and implementation.

### Command Center & Status

- **FR1:** The user can open a dedicated Command Center view that is the primary BMAD surface in the IDE.
- **FR2:** The user can see a concise "Where you are" summary (current phase/context) in the Command Center.
- **FR3:** The user can see a "What's next" recommendation (one suggested next action) in the Command Center.
- **FR4:** The user can see the Command Center update after repo state changes (e.g. new or updated artifacts) when the view is refreshed or reopened.
- **FR5:** The user can switch between the Command Center and the normal editor/explorer without losing plugin state.

### Phase & Context Inference

- **FR6:** The system can infer current phase/context from the workspace (e.g. presence and location of artifacts under `_bmad-output`, planning-artifacts, implementation-artifacts, config).
- **FR7:** The system can derive a single recommended next action from the inferred phase and BMAD sequencing (e.g. suggest Create PRD when no PRD exists, suggest Dev Story when stories exist and one is next).
- **FR8:** The system can distinguish upstream (discovery, planning, architecture) from downstream (execution: stories, dev, test) for status and recommendation.
- **FR9:** The system can handle "empty" or non-BMAD workspaces (no or minimal BMAD layout) and still show a sensible status and recommendation (e.g. "No BMAD artifacts" and suggest Create PRD or Help).

### Action Launcher & BMAD Commands

- **FR10:** The user can trigger BMAD workflows from the Command Center via actions (e.g. buttons or links) that map to BMAD commands (e.g. Create PRD, Create architecture, Create epics, Dev Story, Code Review, Help).
- **FR11:** When the user triggers a BMAD action, the system opens Cursor chat (or equivalent) and runs the corresponding BMAD command so the agent executes in chat, not inside the extension UI.
- **FR12:** The user can access all supported BMAD actions from the Command Center at all times; no action is disabled based on phase (recommend, don't block).
- **FR13:** The user can initiate the recommended next action in one or two steps (e.g. one click from the Command Center).
- **FR14:** The system can highlight or emphasize the recommended action while still showing the full set of actions.

### Artifact Detection & Repo Awareness

- **FR15:** The system can detect the presence of key BMAD artifacts (e.g. PRD, architecture docs, epics, stories, implementation-artifacts) via workspace paths and/or file existence.
- **FR16:** The system can use a known BMAD folder structure (e.g. `_bmad-output`, planning-artifacts, implementation-artifacts, config) to drive phase inference and UI (which actions to show/emphasize).
- **FR17:** The system performs artifact detection without requiring the user to declare or configure current phase manually.
- **FR18:** The system does not write to the repo as part of phase inference or recommendation; writing happens only through user-driven workflows (e.g. chat/skills).

### Onboarding & Empty State

- **FR19:** The user can see a clear status and suggested first action when the workspace has no or minimal BMAD artifacts (e.g. "No BMAD artifacts yet" and suggest Create PRD or Help).
- **FR20:** The user can discover how to get started with BMAD (e.g. via a Help action or link to method basics) from the Command Center.
- **FR21:** The user can open the Command Center and get value (status + launcher) without prior configuration of the extension for that workspace.

### Installation & Extension Behavior

- **FR22:** The user can install the plugin as a Cursor (or VS Code–compatible) extension and open the Command Center from the IDE.
- **FR23:** The user can invoke the same BMAD actions across different workspaces; each workspace's phase is inferred independently (per-repo).

### Post-MVP (Phase 2 — documented for roadmap)

- **FR24:** The user can set a global Model preference in the Command Center that applies to chats launched from the extension (when implemented).
- **FR25:** The user can set a global Mode preference in the Command Center that applies to chats launched from the extension (when implemented).

## Non-Functional Requirements

### Performance

- **NFR-P1:** Artifact detection (scan of BMAD-relevant paths) completes within 2 seconds for a typical workspace so the Command Center can show status without noticeable delay.
- **NFR-P2:** Opening or refreshing the Command Center view does not block the UI thread; detection runs asynchronously or in a way that keeps the IDE responsive.
- **NFR-P3:** Triggering an action (e.g. clicking a BMAD button) opens chat and runs the command within 1 second under normal conditions (no prescribed implementation).

### Reliability

- **NFR-R1:** The extension does not crash or hang the host IDE; failures in phase inference or recommendation degrade to a safe state (e.g. show full action list and Help) rather than breaking the extension.
- **NFR-R2:** If workspace read or artifact detection fails (e.g. permission, missing path), the user still sees a usable Command Center (e.g. "Unable to infer phase" and full list of actions).

### Integration

- **NFR-I1:** The extension remains compatible with the public Cursor/VS Code extension API surface it uses; it does not rely on undocumented or private APIs for MVP behavior.
- **NFR-I2:** Supported Cursor/VS Code version(s) are documented (e.g. minimum version) so users know compatibility.

### Security

- **NFR-S1:** The extension only reads workspace files and config needed for artifact detection and recommendation; it does not transmit repo content to external services as part of phase inference or launcher behavior.
- **NFR-S2:** No user credentials or payment data are collected or processed by the extension.
