import * as vscode from 'vscode';

const PANEL_VIEW_TYPE = 'bmadpilot.commandCenterPanel';

let panel: vscode.WebviewPanel | undefined;

function getNonce(): string {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

function getWebviewHtml(webview: vscode.Webview): string {
	const nonce = getNonce();
	const csp = [
		`default-src 'none'`,
		`style-src ${webview.cspSource} 'unsafe-inline'`,
		`script-src 'nonce-${nonce}'`,
	].join('; ');

	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta http-equiv="Content-Security-Policy" content="${csp}" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>BMAD Command Center</title>
	<style>
		:root {
			color: var(--vscode-foreground);
			background: var(--vscode-editor-background);
			font-family: var(--vscode-font-family);
			font-size: var(--vscode-font-size);
		}
		body {
			margin: 0;
			padding: 2rem 2.5rem 3rem;
			box-sizing: border-box;
			min-height: 100vh;
		}
		h1 {
			font-size: 1.35rem;
			font-weight: 600;
			margin: 0 0 0.35rem;
			letter-spacing: -0.02em;
		}
		p.sub {
			margin: 0 0 2rem;
			opacity: 0.85;
			max-width: 36rem;
			line-height: 1.45;
		}
		.tiles {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
			gap: 1rem;
			max-width: 52rem;
		}
		button.tile {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			text-align: left;
			gap: 0.5rem;
			padding: 1.25rem 1.35rem;
			min-height: 5.5rem;
			border: 1px solid var(--vscode-widget-border, rgba(127,127,127,0.35));
			border-radius: 6px;
			background: var(--vscode-sideBar-background, var(--vscode-editor-background));
			color: inherit;
			cursor: pointer;
			font: inherit;
			transition: background 0.12s ease, border-color 0.12s ease;
		}
		button.tile:hover {
			background: var(--vscode-list-hoverBackground, rgba(127,127,127,0.12));
			border-color: var(--vscode-focusBorder, var(--vscode-textLink-foreground));
		}
		button.tile:focus-visible {
			outline: 1px solid var(--vscode-focusBorder);
			outline-offset: 2px;
		}
		.tile-title {
			font-weight: 600;
			font-size: 1.05rem;
		}
		.tile-desc {
			font-size: 0.85rem;
			opacity: 0.8;
			line-height: 1.35;
		}
	</style>
</head>
<body>
	<h1>BMAD Command Center</h1>
	<p class="sub">Choose a workflow. Actions will open Cursor chat with the right BMAD command when Epic 3 is wired; for now, clicks show a short confirmation.</p>
	<div class="tiles" role="group" aria-label="BMAD actions">
		<button type="button" class="tile" data-action="createPrd">
			<span class="tile-title">Create PRD</span>
			<span class="tile-desc">Start or refine your product requirements document.</span>
		</button>
		<button type="button" class="tile" data-action="devStory">
			<span class="tile-title">Dev Story</span>
			<span class="tile-desc">Implement the next story with full BMAD context.</span>
		</button>
		<button type="button" class="tile" data-action="help">
			<span class="tile-title">BMAD Help</span>
			<span class="tile-desc">Discover commands and how to use the method in Cursor.</span>
		</button>
	</div>
	<script nonce="${nonce}">
		(function () {
			const vscode = acquireVsCodeApi();
			document.querySelectorAll('button.tile').forEach(function (btn) {
				btn.addEventListener('click', function () {
					var action = btn.getAttribute('data-action');
					if (action) {
						vscode.postMessage({ type: 'tileClick', action: action });
					}
				});
			});
		})();
	</script>
</body>
</html>`;
}

export function openCommandCenterPanel(context: vscode.ExtensionContext): void {
	const { extensionUri } = context;
	const column = vscode.window.activeTextEditor
		? vscode.window.activeTextEditor.viewColumn
		: undefined;

	if (panel) {
		panel.reveal(column ?? vscode.ViewColumn.One);
		return;
	}

	panel = vscode.window.createWebviewPanel(
		PANEL_VIEW_TYPE,
		'BMAD Command Center',
		column ?? vscode.ViewColumn.One,
		{
			enableScripts: true,
			retainContextWhenHidden: true,
			localResourceRoots: [vscode.Uri.joinPath(extensionUri)],
		}
	);

	panel.webview.html = getWebviewHtml(panel.webview);

	panel.webview.onDidReceiveMessage((msg: { type?: string; action?: string }) => {
		if (msg?.type !== 'tileClick' || !msg.action) {
			return;
		}
		const labels: Record<string, string> = {
			createPrd: 'Create PRD',
			devStory: 'Dev Story',
			help: 'BMAD Help',
		};
		const label = labels[msg.action] ?? msg.action;
		void vscode.window.showInformationMessage(
			`BMADPilot: "${label}" — chat invocation will be added in Epic 3.`
		);
	});

	context.subscriptions.push(
		panel.onDidDispose(() => {
			panel = undefined;
		})
	);
}

export function registerCommandCenterPanel(context: vscode.ExtensionContext): void {
	const cmd = vscode.commands.registerCommand('bmadpilot.openCommandCenterPanel', () => {
		try {
			openCommandCenterPanel(context);
		} catch (err) {
			console.error('bmadpilot.openCommandCenterPanel failed:', err);
			void vscode.window.showErrorMessage('BMADPilot: could not open Command Center panel.');
		}
	});
	context.subscriptions.push(cmd);
}
