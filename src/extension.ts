import * as vscode from 'vscode';
import { registerCommandCenterPanel } from './views/commandCenter/commandCenterPanel';
import { CommandCenterProvider } from './views/commandCenter/commandCenterProvider';

const VIEW_ID = 'bmadpilot.commandCenter';

export function activate(context: vscode.ExtensionContext) {
	registerCommandCenterPanel(context);

	const disposable = vscode.commands.registerCommand('bmadpilot.helloWorld', () => {
		try {
			vscode.window.showInformationMessage('Hello World from BMADPilot!');
		} catch (err) {
			console.error('bmadpilot.helloWorld failed:', err);
		}
	});

	context.subscriptions.push(disposable);

	const commandCenterProvider = new CommandCenterProvider();
	try {
		const treeView = vscode.window.createTreeView(VIEW_ID, {
			treeDataProvider: commandCenterProvider,
		});
		context.subscriptions.push(treeView);
	} catch (err) {
		console.error('bmadpilot: failed to create Command Center tree view:', err);
	}
}

export function deactivate() {}
