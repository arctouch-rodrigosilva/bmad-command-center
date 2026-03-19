---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: []
session_topic: 'Cursor plugin to pilot BMAD method'
session_goals: 'Feature ideas, UX patterns, and ways to reduce friction when using BMAD in Cursor'
selected_approach: 'User-Selected Techniques'
techniques_used: ['Emergent Thinking']
ideas_generated: ['BMAD Command Center view', 'Phase-aware status', 'Artifact-driven UI', 'Recommend + buttons launch chat', 'Global model/mode selectors']
context_file: ''
---

# Brainstorming Session Results

**Facilitator:** Rodrigo
**Date:** 2026-03-17

## Session Overview

**Topic:** Cursor plugin to pilot BMAD method
**Goals:** Feature ideas, UX patterns, and ways to reduce friction when using BMAD in Cursor

### Context Guidance

_No context file provided for this session._

### Session Setup

Session initialized with topic and goals as provided. Ready for technique selection.

## Technique Selection

**Approach:** User-Selected Techniques
**Selected Techniques:**

- **Emergent Thinking:** Allow structure and direction to emerge from the conversation; follow what wants to surface. Fits session goal of being questioned when the user already has a strong idea.

**Selection Rationale:** User wanted to be questioned and had a clear direction; Emergent Thinking supports organic exploration without a fixed question list.

---

## Emergent Thinking — Session

### [Category 1]: BMAD Command Center
_Concept:_ A dedicated full-screen view that inverts Cursor’s default: instead of editor + file explorer as the center, the primary surface is BMAD method stages, key documents, and actions. Status check, “what’s next” (bmad-help style), task kanban, shortcuts to project definitions — all in one place. When the user needs to edit a file by hand, they switch back to the standard Cursor view.
_Novelty:_ Treats the BMAD workflow as the primary context and code as a secondary mode, rather than the other way around.

### [Category 2]: Phase-aware status and “what’s next”
_Concept:_ The command center answers two things at a glance: (1) **Where am I / what’s next?** — bmad-help style guidance. (2) **Clear status** — am I upstream (discovery, planning, architecture) or downstream (execution)? When downstream, the main loop is: draft/approve stories → develop with dev agent → test. The view reflects current phase and the next concrete action (e.g. Create Story, Dev Story, Code Review, QA).
_Novelty:_ Status is framed as upstream vs downstream and tied to the actual story lifecycle, not a generic task list.

### [Category 3]: Artifact-driven UI — read repo, highlight actions
_Concept:_ The plugin reads project directories and key files (e.g. _bmad-output, planning-artifacts, implementation-artifacts, config) to infer phase and context. The interface is set from that: which artifacts exist drives which parts of the UI are shown and which action buttons are highlighted (e.g. “Create PRD” vs “Dev Story” vs “Code Review”). No manual “I’m in phase X” — the UI follows the repo.
_Novelty:_ Context-aware actions derived from the filesystem; the command center is artifact-driven, not user-declared.

### [Category 4]: Recommend, don’t block + buttons launch chat with command
_Concept:_ (1) When context is in-between (e.g. architecture missing), the UI recommends the “next” action but never blocks: all steps remain available so the user can jump ahead if they want. (2) Action buttons don’t run work inside the command center — clicking a button opens the chat window and runs the corresponding BMAD command (e.g. bmad-help, bmad-bmm-create-prd, bmad-bmm-dev-story). Chat stays the execution surface; the command center is the launcher.
_Novelty:_ Recommendation without gatekeeping; clear mental model: command center = status + launcher, chat = where the agent runs.

### [Category 5]: One-line summary + global model and mode selectors
_Concept:_ (1) Summary: The command center is a set of clear shortcuts — drive the whole BMAD method by clicking; each action opens chat and runs the right command. (2) Add two global selectors in the command center: **Model** — choose which model is used for all invoked chats (e.g. default, GPT-4, Claude, etc.). **Mode** — choose which mode is used when opening chat (e.g. Agent, Task). So before or while using the shortcuts, the user sets “model” and “mode” once; every button-launched chat uses those settings.
_Novelty:_ Method is driven by clicks; invocation defaults (model + mode) are controlled from the command center so the user doesn’t have to change them in each chat.

---

## Session summary (Emergent Thinking)

**Vision:** BMAD Command Center — a full-screen, method-first view in Cursor that inverts the default (code + files) so BMAD workflow is the home base.

- **Status & next:** “Where am I / what’s next?” + clear upstream vs downstream; in execution: story loop (draft/approve → dev → test).
- **Artifact-driven UI:** Plugin reads repo (directories/files) to infer phase and context; action buttons and highlights follow what exists. Recommend next step, never block other actions.
- **Interaction:** Click action → chat opens + command runs. Global selectors: **Model** (for all invoked chats) and **Mode** (e.g. Agent, Task). Everything works as shortcuts to drive the BMAD method by clicking.

---

## Brainstorming complete

**Session status:** Complete. Ideas captured and summarized above.

**Next step — PRD:** Use this document as input for the Product Requirements Document. Run **`bmad-bmm-create-prd`** (BMM Create PRD workflow). When the facilitator asks for context or existing artifacts, point to this file: `_bmad-output/brainstorming/brainstorming-session-2026-03-17-1148.md`. The session summary and categories 1–5 above are the product vision and feature set for the Cursor plugin PRD.
