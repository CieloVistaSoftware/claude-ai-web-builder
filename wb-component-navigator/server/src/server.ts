import {
  createConnection,
  TextDocuments,
  Diagnostic,
  DiagnosticSeverity,
  ProposedFeatures,
  InitializeParams,
  DidChangeConfigurationNotification,
  CompletionItem,
  CompletionItemKind,
  TextDocumentPositionParams,
  TextDocumentSyncKind,
  InitializeResult,
  Location,
  Definition,
  Range,
  Position
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';
import * as fs from 'fs';
import * as path from 'path';

// Create a connection for the server
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;

// Component symbol index
interface ComponentSymbol {
  name: string;
  className: string;
  definitionFile: string;
  definitionLine: number;
  cssFile?: string;
  demoFile?: string;
  schemaFile?: string;
  mdFile?: string;
  usages: Location[];
}

const componentIndex = new Map<string, ComponentSymbol>();
let workspaceRoot: string = '';

connection.onInitialize((params: InitializeParams) => {
  const capabilities = params.capabilities;

  hasConfigurationCapability = !!(
    capabilities.workspace && !!capabilities.workspace.configuration
  );
  hasWorkspaceFolderCapability = !!(
    capabilities.workspace && !!capabilities.workspace.workspaceFolders
  );
  hasDiagnosticRelatedInformationCapability = !!(
    capabilities.textDocument &&
    capabilities.textDocument.publishDiagnostics &&
    capabilities.textDocument.publishDiagnostics.relatedInformation
  );

  if (params.workspaceFolders && params.workspaceFolders.length > 0) {
    // Properly decode the URI to handle Windows paths
    const uri = params.workspaceFolders[0].uri;
    workspaceRoot = decodeURIComponent(uri.replace('file:///', ''));
  }

  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        resolveProvider: true,
        triggerCharacters: ['<', '-']
      },
      definitionProvider: true,
      referencesProvider: true,
      hoverProvider: true
    }
  };

  if (hasWorkspaceFolderCapability) {
    result.capabilities.workspace = {
      workspaceFolders: {
        supported: true
      }
    };
  }

  return result;
});

connection.onInitialized(() => {
  if (hasConfigurationCapability) {
    connection.client.register(DidChangeConfigurationNotification.type, undefined);
  }
  
  // Build initial component index
  buildComponentIndex();
  
  connection.console.log('WB Component Navigator Language Server initialized');
});

// Build component index by scanning workspace
function buildComponentIndex(): void {
  componentIndex.clear();
  
  if (!workspaceRoot) {
    connection.console.log('No workspace root found');
    return;
  }

  const componentsPath = path.join(workspaceRoot, 'components');
  
  if (!fs.existsSync(componentsPath)) {
    connection.console.log(`Components directory not found: ${componentsPath}`);
    return;
  }

  connection.console.log(`Scanning components in: ${componentsPath}`);

  try {
    const entries = fs.readdirSync(componentsPath, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name.startsWith('wb-')) {
        scanComponent(componentsPath, entry.name);
      }
    }
    
    connection.console.log(`Indexed ${componentIndex.size} components`);
  } catch (error) {
    connection.console.error(`Error scanning components: ${error}`);
  }
}

// Scan a single component directory
function scanComponent(componentsPath: string, componentName: string): void {
  const componentPath = path.join(componentsPath, componentName);
  const jsFile = path.join(componentPath, `${componentName}.js`);
  
  if (!fs.existsSync(jsFile)) {
    return;
  }

  try {
    const content = fs.readFileSync(jsFile, 'utf-8');
    const lines = content.split('\n');
    
    // Find customElements.define() call
    let definitionLine = -1;
    let className = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Look for: customElements.define('wb-button', WBButton)
      const defineMatch = line.match(/customElements\.define\s*\(\s*['"]([^'"]+)['"]\s*,\s*(\w+)\s*\)/);
      if (defineMatch) {
        definitionLine = i;
        className = defineMatch[2];
        break;
      }
    }
    
    if (definitionLine >= 0) {
      const symbol: ComponentSymbol = {
        name: componentName,
        className: className,
        definitionFile: jsFile,
        definitionLine: definitionLine,
        usages: []
      };
      
      // Check for related files
      const cssFile = path.join(componentPath, `${componentName}.css`);
      if (fs.existsSync(cssFile)) {
        symbol.cssFile = cssFile;
      }
      
      const demoFile = path.join(componentPath, `${componentName}-demo.html`);
      if (fs.existsSync(demoFile)) {
        symbol.demoFile = demoFile;
      }
      
      const schemaFile = path.join(componentPath, `${componentName}.schema.json`);
      if (fs.existsSync(schemaFile)) {
        symbol.schemaFile = schemaFile;
      }
      
      const mdFile = path.join(componentPath, `${componentName}.md`);
      if (fs.existsSync(mdFile)) {
        symbol.mdFile = mdFile;
      }
      
      componentIndex.set(componentName, symbol);
      connection.console.log(`Indexed component: ${componentName} (${className})`);
    }
  } catch (error) {
    connection.console.error(`Error scanning ${componentName}: ${error}`);
  }
}

// Handle "Go to Definition" requests
connection.onDefinition((params: TextDocumentPositionParams): Definition | null => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return null;
  }

  const text = document.getText();
  const offset = document.offsetAt(params.position);
  
  // Find the component name at the cursor position
  const componentName = getComponentNameAtPosition(text, offset);
  
  if (componentName && componentIndex.has(componentName)) {
    const symbol = componentIndex.get(componentName)!;
    
    return {
      uri: `file://${symbol.definitionFile}`,
      range: Range.create(
        Position.create(symbol.definitionLine, 0),
        Position.create(symbol.definitionLine, 100)
      )
    };
  }
  
  return null;
});

// Handle "Find All References" requests
connection.onReferences((params: TextDocumentPositionParams): Location[] => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return [];
  }

  const text = document.getText();
  const offset = document.offsetAt(params.position);
  
  const componentName = getComponentNameAtPosition(text, offset);
  
  if (componentName && componentIndex.has(componentName)) {
    // Scan workspace for usages
    return findComponentUsages(componentName);
  }
  
  return [];
});

// Handle hover requests
connection.onHover((params: TextDocumentPositionParams) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return null;
  }

  const text = document.getText();
  const offset = document.offsetAt(params.position);
  
  const componentName = getComponentNameAtPosition(text, offset);
  
  if (componentName && componentIndex.has(componentName)) {
    const symbol = componentIndex.get(componentName)!;
    
    let contents = `**${componentName}**\n\n`;
    contents += `Class: \`${symbol.className}\`\n\n`;
    contents += `Definition: ${symbol.definitionFile}\n\n`;
    
    if (symbol.cssFile) contents += `CSS: ${symbol.cssFile}\n`;
    if (symbol.demoFile) contents += `Demo: ${symbol.demoFile}\n`;
    if (symbol.mdFile) contents += `Docs: ${symbol.mdFile}\n`;
    
    return {
      contents: {
        kind: 'markdown',
        value: contents
      }
    };
  }
  
  return null;
});

// Handle completion requests
connection.onCompletion((params: TextDocumentPositionParams): CompletionItem[] => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return [];
  }

  const text = document.getText();
  const offset = document.offsetAt(params.position);
  
  // Check if we're inside an HTML tag
  const beforeCursor = text.substring(0, offset);
  if (beforeCursor.endsWith('<') || beforeCursor.match(/<[\w-]*$/)) {
    // Provide component completions
    return Array.from(componentIndex.values()).map(symbol => ({
      label: symbol.name,
      kind: CompletionItemKind.Class,
      detail: symbol.className,
      documentation: `Web Component: ${symbol.name}`
    }));
  }
  
  return [];
});

// Helper: Extract component name at cursor position
function getComponentNameAtPosition(text: string, offset: number): string | null {
  // Look for <wb-component-name> pattern
  const before = text.substring(Math.max(0, offset - 50), offset);
  const after = text.substring(offset, Math.min(text.length, offset + 50));
  
  const combined = before + after;
  const match = combined.match(/<(wb-[\w-]+)/);
  
  if (match) {
    return match[1];
  }
  
  return null;
}

// Helper: Find all usages of a component in workspace
function findComponentUsages(componentName: string): Location[] {
  const usages: Location[] = [];
  
  if (!workspaceRoot) {
    return usages;
  }
  
  // Scan all HTML files in workspace
  scanDirectory(workspaceRoot, (filePath) => {
    if (filePath.endsWith('.html')) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        
        lines.forEach((line, lineNum) => {
          const regex = new RegExp(`<${componentName}[\\s>]`, 'g');
          let match;
          
          while ((match = regex.exec(line)) !== null) {
            usages.push({
              uri: `file://${filePath}`,
              range: Range.create(
                Position.create(lineNum, match.index),
                Position.create(lineNum, match.index + componentName.length + 1)
              )
            });
          }
        });
      } catch (error) {
        // Ignore read errors
      }
    }
  });
  
  return usages;
}

// Helper: Recursively scan directory
function scanDirectory(dir: string, callback: (filePath: string) => void): void {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      // Skip node_modules and hidden directories
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
        continue;
      }
      
      if (entry.isDirectory()) {
        scanDirectory(fullPath, callback);
      } else if (entry.isFile()) {
        callback(fullPath);
      }
    }
  } catch (error) {
    // Ignore directory read errors
  }
}

// Handle refresh notification from client
connection.onNotification('wb/refreshComponents', () => {
  connection.console.log('Refreshing component index...');
  buildComponentIndex();
});

// Document change handling
documents.onDidChangeContent(change => {
  // Could re-index changed files here
});

documents.listen(connection);
connection.listen();
