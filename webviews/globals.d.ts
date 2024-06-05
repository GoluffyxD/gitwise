import * as _vscode from "vscode"

declare global {
    const tsvscode: {
        postMessage: ({type: string, value: any}) => void;
    }
}

export interface CodeSelectionInfo {
    code_selected: string;
    filePath: string;
    lineNumber: number;
}

export interface OutputMessage {
    explanation: string;
    pullRequestUrl: string;
}