"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const path = require("path");
const vscode = require("vscode");
const node_1 = require("vscode-languageclient/node");
let client;
function activate(context) {
    console.log('WB Component Navigator is activating...');
    // The server is implemented in Node
    const serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));
    // Debug options for the server
    const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };
    // If launched in debug mode, use debug server options
    const serverOptions = {
        run: { module: serverModule, transport: node_1.TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: node_1.TransportKind.ipc,
            options: debugOptions
        }
    };
    // Options to control the language client
    const clientOptions = {
        // Register the server for HTML, JavaScript, and TypeScript files
        documentSelector: [
            { scheme: 'file', language: 'html' },
            { scheme: 'file', language: 'javascript' },
            { scheme: 'file', language: 'typescript' }
        ],
        synchronize: {
            // Notify the server about file changes in the workspace
            fileEvents: vscode.workspace.createFileSystemWatcher('**/*.{js,ts,html,css}')
        }
    };
    // Create the language client and start it
    client = new node_1.LanguageClient('wbComponentNavigator', 'WB Component Navigator', serverOptions, clientOptions);
    // Start the client (also launches the server)
    client.start();
    // Register component tree view
    const treeDataProvider = new WBComponentTreeProvider();
    vscode.window.registerTreeDataProvider('wbComponentTree', treeDataProvider);
    // Register refresh command
    context.subscriptions.push(vscode.commands.registerCommand('wbComponentNavigator.refreshComponents', () => {
        treeDataProvider.refresh();
        client.sendNotification('wb/refreshComponents');
    }));
    console.log('WB Component Navigator activated!');
}
function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
// Tree view provider for components
class WBComponentTreeProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    async getChildren(element) {
        if (!vscode.workspace.workspaceFolders) {
            return [];
        }
        const workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
        const config = vscode.workspace.getConfiguration('wbComponentNavigator');
        const componentsPath = config.get('componentsPath', 'components');
        const fullPath = path.join(workspaceRoot, componentsPath);
        if (!element) {
            // Root level - show all components
            try {
                const entries = await vscode.workspace.fs.readDirectory(vscode.Uri.file(fullPath));
                const components = entries
                    .filter(([name, type]) => type === vscode.FileType.Directory && name.startsWith('wb-'))
                    .map(([name]) => new ComponentItem(name, fullPath, vscode.TreeItemCollapsibleState.Collapsed));
                return components;
            }
            catch (error) {
                console.error('Error reading components directory:', error);
                return [];
            }
        }
        else {
            // Show files for this component
            const componentPath = path.join(fullPath, element.label);
            try {
                const entries = await vscode.workspace.fs.readDirectory(vscode.Uri.file(componentPath));
                return entries
                    .filter(([name]) => !name.startsWith('.'))
                    .map(([name, type]) => {
                    const filePath = path.join(componentPath, name);
                    const item = new ComponentItem(name, componentPath, vscode.TreeItemCollapsibleState.None);
                    item.command = {
                        command: 'vscode.open',
                        title: 'Open File',
                        arguments: [vscode.Uri.file(filePath)]
                    };
                    item.iconPath = type === vscode.FileType.File
                        ? new vscode.ThemeIcon('file')
                        : new vscode.ThemeIcon('folder');
                    return item;
                });
            }
            catch (error) {
                console.error('Error reading component files:', error);
                return [];
            }
        }
    }
}
class ComponentItem extends vscode.TreeItem {
    constructor(label, componentPath, collapsibleState) {
        super(label, collapsibleState);
        this.label = label;
        this.componentPath = componentPath;
        this.collapsibleState = collapsibleState;
        this.tooltip = label;
        if (collapsibleState !== vscode.TreeItemCollapsibleState.None) {
            this.iconPath = new vscode.ThemeIcon('symbol-class');
            this.contextValue = 'wbComponent';
        }
    }
}
//# sourceMappingURL=extension.js.map