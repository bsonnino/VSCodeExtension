// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	registerCommand(context, 'sortlines.sortDescending', () => sortSelection(true));
	registerCommand(context, 'sortlines.sortAscending', () => sortSelection(false));
}

function sortSelection(isDescending: boolean) {
	//get the active text editor
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}
	//get the selection start and end
	const selection = editor.selection;
	const start = selection.start;
	const end = selection.end;
	// the new selection will extend 
	// from start of the first selected line 
	// to the end of the last selected line
	const newSelection = new vscode.Selection(start.line, 0, end.line + 1, 0);
	// get the selected text
	const text = editor.document.getText(newSelection);
	// split the text into lines
	const lines = text.trim().split('\r\n');
	// sort the lines
	lines.sort((a, b) => isDescending ? b.localeCompare(a) : a.localeCompare(b));
	// replace the text with the sorted lines
	editor.edit((editBuilder) => {
		editBuilder.replace(newSelection, lines.join('\n'));
	});
	// set the new selection
	editor.selection = newSelection;
}

function registerCommand(context: vscode.ExtensionContext, command: string, func: () => void) {
	const disposable = vscode.commands.registerCommand(command, func);
	context.subscriptions.push(disposable);
}

