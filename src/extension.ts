// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { HelloWorldPanel } from './helloworldPanel';
import { SidebarProvider } from './SidebarProvider';
import { getGitBlame, getGitStatus } from './git-commands';

interface CodeSelectionInfo {
    code_selected: string;
    filePath: string;
    lineNumber: number;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const sidebarProvider = new SidebarProvider(context.extensionUri);

	const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
	item.text = "$(github-action) Gitwise Explain";
	item.command = "gitwise.explain";
	item.show();

	context.subscriptions.push(
	  vscode.window.registerWebviewViewProvider(
		"gitwise-sidebar",
		sidebarProvider
	  )
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('gitwise.helloWorld', () => {
		HelloWorldPanel.createOrShow(context.extensionUri);
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('gitwise.refresh', async () => {
		await vscode.commands.executeCommand("workbench.action.closeSidebar");
		await vscode.commands.executeCommand("workbench.view.extension.gitwise-sidebar-view");
		// vscode.commands.executeCommand("workbench.action.webview.openDeveloperTools");
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand("gitwise.explain", () => {
			const {activeTextEditor} = vscode.window;
			if (!activeTextEditor){
				vscode.window.showInformationMessage("No active text editor");
				return;
			}
			const selection = activeTextEditor.document.getText(activeTextEditor.selection);
			const filePath = activeTextEditor.document.uri.fsPath;
			const lineNumber = activeTextEditor.selection.active.line + 1;
			const lineSelectionsFrom = activeTextEditor.selection.start.line + 1;
			const lineSelectionsTo = activeTextEditor.selection.end.line + 1;
			const code_selection_info: CodeSelectionInfo = {
				code_selected: selection,
				filePath: filePath,
				lineNumber: lineNumber
			};
			console.log(code_selection_info);
			if(selection === "") {
				vscode.window.showInformationMessage("No selection has been made");
			} else {
				// Send message to WebView
				sidebarProvider._view?.webview.postMessage({
					type: 'code-select',
					value: JSON.stringify(code_selection_info)
				});

				getGitBlame(filePath).then((output) => {
					console.log(output);
					sidebarProvider._view?.webview.postMessage({
						type: 'code-explain',
						value: JSON.stringify(output)
					});
				  }).catch((error) => {
					console.error('Error:', error);
				  });
			}
		})
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
