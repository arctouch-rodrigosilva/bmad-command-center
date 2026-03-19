import * as vscode from 'vscode';

export type CommandCenterNodeId = 'root' | 'where-you-are' | 'whats-next';

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
			return PLACEHOLDER_NODES;
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
		return item;
	}
}
