import * as fs from 'fs';
import * as path from 'path';
import type { ArtifactSet } from './types';

export type { ArtifactSet } from './types';

/** BMAD implementation story markdown: e.g. `1-1-initialize-extension.md`. */
const STORY_FILE_PATTERN = /^\d+-\d+-.+\.md$/;

function allFalse(): ArtifactSet {
	return {
		hasPrd: false,
		hasArchitecture: false,
		hasEpics: false,
		hasStories: false,
		hasImplementationArtifacts: false,
	};
}

function isFile(filePath: string): boolean {
	try {
		return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
	} catch {
		return false;
	}
}

function isDirectory(dirPath: string): boolean {
	try {
		return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
	} catch {
		return false;
	}
}

function hasArchitectureInPlanning(planningDir: string): boolean {
	if (isFile(path.join(planningDir, 'architecture.md'))) {
		return true;
	}
	if (!isDirectory(planningDir)) {
		return false;
	}
	try {
		return fs.readdirSync(planningDir).some((name) => {
			const low = name.toLowerCase();
			return low.endsWith('.md') && low.includes('architecture');
		});
	} catch {
		return false;
	}
}

function hasEpicsInPlanning(planningDir: string): boolean {
	if (isFile(path.join(planningDir, 'epics.md'))) {
		return true;
	}
	if (!isDirectory(planningDir)) {
		return false;
	}
	try {
		return fs.readdirSync(planningDir).some((name) => {
			const low = name.toLowerCase();
			return low.endsWith('.md') && low.includes('epic');
		});
	} catch {
		return false;
	}
}

function hasStoryMarkdown(implDir: string): boolean {
	try {
		return fs.readdirSync(implDir).some(
			(name) => name.endsWith('.md') && STORY_FILE_PATTERN.test(name)
		);
	} catch {
		return false;
	}
}

/**
 * Read-only artifact presence for a workspace root. Uses only Node fs/path (no VS Code API).
 * Never throws; on invalid path or permission errors returns all flags false.
 *
 * If `workspaceRoot` is not a non-empty string after trim (e.g. `""`, `"   "`), returns all
 * `false` and does not use the process current working directory. Callers should pass a real
 * workspace folder path (e.g. from `vscode.workspace`).
 */
export function detectArtifacts(workspaceRoot: string): ArtifactSet {
	if (typeof workspaceRoot !== 'string' || workspaceRoot.trim() === '') {
		return allFalse();
	}
	try {
		const root = path.resolve(workspaceRoot);
		const planningDir = path.join(root, '_bmad-output', 'planning-artifacts');
		const implDir = path.join(root, '_bmad-output', 'implementation-artifacts');
		const hasImpl = isDirectory(implDir);

		return {
			hasPrd: isFile(path.join(planningDir, 'prd.md')),
			hasArchitecture: hasArchitectureInPlanning(planningDir),
			hasEpics: hasEpicsInPlanning(planningDir),
			hasImplementationArtifacts: hasImpl,
			hasStories: hasImpl && hasStoryMarkdown(implDir),
		};
	} catch {
		return allFalse();
	}
}
