import * as assert from 'node:assert/strict';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { describe, it, afterEach } from 'node:test';
import { detectArtifacts } from '../index';

describe('detectArtifacts', () => {
	let tmpRoot: string | undefined;

	afterEach(() => {
		if (tmpRoot && fs.existsSync(tmpRoot)) {
			fs.rmSync(tmpRoot, { recursive: true, force: true });
		}
		tmpRoot = undefined;
	});

	function mkWorkspace(): string {
		tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'bmadpilot-artifact-'));
		return tmpRoot;
	}

	function writeRel(root: string, rel: string, content = ''): void {
		const full = path.join(root, rel);
		fs.mkdirSync(path.dirname(full), { recursive: true });
		fs.writeFileSync(full, content, 'utf8');
	}

	it('empty workspace: no BMAD layout → all false', () => {
		const root = mkWorkspace();
		assert.deepEqual(detectArtifacts(root), {
			hasPrd: false,
			hasArchitecture: false,
			hasEpics: false,
			hasStories: false,
			hasImplementationArtifacts: false,
		});
	});

	it('empty or whitespace-only workspaceRoot → all false (does not use cwd)', () => {
		const empty = {
			hasPrd: false,
			hasArchitecture: false,
			hasEpics: false,
			hasStories: false,
			hasImplementationArtifacts: false,
		};
		assert.deepEqual(detectArtifacts(''), empty);
		assert.deepEqual(detectArtifacts('   \t\n'), empty);
	});

	it('prd.md only under planning-artifacts → hasPrd true, others false', () => {
		const root = mkWorkspace();
		writeRel(root, '_bmad-output/planning-artifacts/prd.md', '# PRD');
		assert.deepEqual(detectArtifacts(root), {
			hasPrd: true,
			hasArchitecture: false,
			hasEpics: false,
			hasStories: false,
			hasImplementationArtifacts: false,
		});
	});

	it('implementation-artifacts with story-shaped md → hasImplementationArtifacts and hasStories', () => {
		const root = mkWorkspace();
		writeRel(root, '_bmad-output/implementation-artifacts/2-1-artifact-detection-module.md', '# Story');
		assert.deepEqual(detectArtifacts(root), {
			hasPrd: false,
			hasArchitecture: false,
			hasEpics: false,
			hasStories: true,
			hasImplementationArtifacts: true,
		});
	});

	it('implementation-artifacts dir without story-shaped md → hasStories false', () => {
		const root = mkWorkspace();
		writeRel(root, '_bmad-output/implementation-artifacts/sprint-status.yaml', 'x: 1');
		assert.deepEqual(detectArtifacts(root), {
			hasPrd: false,
			hasArchitecture: false,
			hasEpics: false,
			hasStories: false,
			hasImplementationArtifacts: true,
		});
	});

	it('planning: epics.md and architecture.md', () => {
		const root = mkWorkspace();
		writeRel(root, '_bmad-output/planning-artifacts/epics.md', '');
		writeRel(root, '_bmad-output/planning-artifacts/architecture.md', '');
		const r = detectArtifacts(root);
		assert.equal(r.hasEpics, true);
		assert.equal(r.hasArchitecture, true);
		assert.equal(r.hasPrd, false);
	});
});
