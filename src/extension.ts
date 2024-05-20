// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { HelloWorldPanel } from './helloworldPanel';
import { SidebarProvider } from './SidebarProvider';

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
			if(selection === "") {
				vscode.window.showInformationMessage("No selection has been made");
			} else {
				sidebarProvider._view?.webview.postMessage({
					type: 'code-select',
					value: selection
				});
			}
		})
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
