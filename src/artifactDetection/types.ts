/**
 * Presence flags for BMAD layout under a workspace root (path / existence only; no parsing).
 *
 * - hasPrd: `_bmad-output/planning-artifacts/prd.md` exists.
 * - hasArchitecture: `architecture.md` in planning-artifacts, or any `*architecture*.md` there.
 * - hasEpics: `epics.md` in planning-artifacts, or any `*epic*.md` there (filename match).
 * - hasImplementationArtifacts: `_bmad-output/implementation-artifacts` exists as a directory.
 * - hasStories: at least one `N-N-slug.md` under implementation-artifacts (BMAD story file pattern).
 */
export interface ArtifactSet {
	hasPrd: boolean;
	hasArchitecture: boolean;
	hasEpics: boolean;
	hasStories: boolean;
	hasImplementationArtifacts: boolean;
}
