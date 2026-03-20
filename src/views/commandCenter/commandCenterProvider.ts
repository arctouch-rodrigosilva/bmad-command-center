import * as vscode from 'vscode';

export type CommandCenterNodeId = 'root' | 'open-panel' | 'where-you-are' | 'whats-next';

export interface CommandCenterNode {
	id: CommandCenterNodeId;
	label: string;
	parentId: CommandCenterNodeId | null;
}

const ROOT_NODE: CommandCenterNode = {
	id: 'root',
	label: 'BMAD Command Center',
	parentId: null,
};

const PLACEHOLDER_DESCRIPTION = 'Placeholder — phase inference in Epic 2';

const LAUNCHER_NODE: CommandCenterNode = {
	id: 'open-panel',
	label: 'Open full Command Center',
	parentId: 'root',
};

const PLACEHOLDER_NODES: CommandCenterNode[] = [
	{ id: 'where-you-are', label: 'Where you are', parentId: 'root' },
	{ id: 'whats-next', label: 'What\'s next', parentId: 'root' },
];

export class CommandCenterProvider implements vscode.TreeDataProvider<CommandCenterNode> {
	getChildren(element?: CommandCenterNode): CommandCenterNode[] {
		if (!element) {
			return [ROOT_NODE];
		}
		if (element.id === 'root') {
			return [LAUNCHER_NODE, ...PLACEHOLDER_NODES];
		}
		return [];
	}

	getTreeItem(element: CommandCenterNode): vscode.TreeItem {
		const item = new vscode.TreeItem(element.label);
		item.id = element.id;
		item.collapsibleState =
			element.id === 'root'
				? vscode.TreeItemCollapsibleState.Expanded
				: vscode.TreeItemCollapsibleState.None;

		if (element.id === 'root') {
			item.tooltip = 'BMAD Command Center — status and actions will reflect your workspace in later epics.';
		} else if (element.id === 'open-panel') {
			item.description = 'Editor area';
			item.tooltip = 'Open the full Command Center with large action tiles (primary UI).';
			item.iconPath = new vscode.ThemeIcon('layout-sidebar-left-off');
			item.command = {
				command: 'bmadpilot.openCommandCenterPanel',
				title: 'Open Command Center',
			};
		} else {
			item.description = PLACEHOLDER_DESCRIPTION;
			item.tooltip =
				element.id === 'where-you-are'
					? 'Current phase summary will appear here after Epic 2 (artifact detection + inference).'
					: 'Recommended next BMAD step will appear here after Epic 2.';
		}

		return item;
	}
}
