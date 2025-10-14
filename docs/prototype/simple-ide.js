// WB Component IDE - Main JavaScript

// Fallback components if directory reading fails
const FALLBACK_COMPONENTS = [
  {
    name: 'wb-button',
    description: 'A customizable button component',
    attributes: [
      { name: 'variant', default: 'primary' },
      { name: 'size', default: 'medium' }
    ]
  },
  {
    name: 'wb-card',
    description: 'A card container component',
    attributes: [
      { name: 'elevation', default: '2' },
      { name: 'padding', default: 'medium' }
    ]
  },
  {
    name: 'wb-input',
    description: 'An input field component',
    attributes: [
      { name: 'type', default: 'text' },
      { name: 'placeholder', default: 'Enter text...' }
    ]
  },
  {
    name: 'wb-modal',
    description: 'A modal dialog component',
    attributes: [
      { name: 'open', default: 'false' },
      { name: 'size', default: 'medium' }
    ]
  }
];

// State management
const state = {
  components: [],
  selectedComponent: null,
  currentMode: 'edit',
  sidebarOpen: true,
  clickTimer: null,
  clickCounts: {},
  useFallback: false
};

// DOM elements cache
const elements = {
  sidebar: null,
  componentsList: null,
  componentCount: null,
  htmlEditor: null,
  previewFrame: null,
  docsViewer: null,
  statusText: null,
  insertHint: null,
  editBtn: null,
  previewBtn: null,
  docsBtn: null,
  menuBtn: null,
  editPanel: null,
  previewPanel: null,
  docsPanel: null
};

// Initialize DOM element references
function initElements() {
  elements.sidebar = document.getElementById('sidebar');
  elements.componentsList = document.getElementById('componentsList');
  elements.componentCount = document.getElementById('componentCount');
  elements.htmlEditor = document.getElementById('htmlEditor');
  elements.previewFrame = document.getElementById('previewFrame');
  elements.docsViewer = document.getElementById('docsViewer');
  elements.statusText = document.getElementById('statusText');
  elements.insertHint = document.getElementById('insertHint');
  elements.editBtn = document.getElementById('editBtn');
  elements.previewBtn = document.getElementById('previewBtn');
  elements.docsBtn = document.getElementById('docsBtn');
  elements.menuBtn = document.getElementById('menuBtn');
  elements.editPanel = document.getElementById('editPanel');
  elements.previewPanel = document.getElementById('previewPanel');
  elements.docsPanel = document.getElementById('docsPanel');
}

// Discover components from file system
async function discoverComponents() {
  updateStatus('Discovering components...');
  // Hardcoded list of all wb-* folders in components (from workspace scan)
  const allComponentFolders = [
    'wb-base','wb-btn','wb-button','wb-card','wb-change-text','wb-color-bar','wb-color-bars','wb-color-mapper','wb-color-picker','wb-color-transformer','wb-control-panel','wb-demo','wb-dev-toolbox','wb-event-log','wb-footer','wb-header','wb-hero','wb-image-insert','wb-inject-test','wb-input','wb-keyboard-manager','wb-layout','wb-log-error','wb-log-viewer','wb-modal','wb-nav','wb-resize','wb-search','wb-select','wb-semanticElements','wb-slider','wb-status','wb-tab','wb-table','wb-theme','wb-toggle','wb-viewport'
  ];
  state.components = allComponentFolders.map(name => ({ name }));
  state.useFallback = false;
  renderComponents();
  updateStatus('Ready • Click component for docs • Double-click to insert');
  return;
}

// Probe for components by testing if files exist
async function probeForComponents() {
  updateStatus('Probing for components...');
  
  const testComponents = [
    'wb-button', 'wb-card', 'wb-color-bars', 'wb-control-panel',
    'wb-event-log', 'wb-footer', 'wb-header', 'wb-hero',
    'wb-input', 'wb-modal', 'wb-nav', 'wb-select',
    'wb-slider', 'wb-status', 'wb-table', 'wb-toggle'
  ];
  
  const availableComponents = [];
  
  // Try both relative paths
  const basePaths = ['../../components/', '../../../components/'];
  
  for (const basePath of basePaths) {
    for (const componentName of testComponents) {
      try {
        const response = await fetch(`${basePath}${componentName}/${componentName}.js`, { 
          method: 'HEAD' 
        });
        if (response.ok) {
          availableComponents.push({ name: componentName });
          break; // Found it, no need to check other paths
        }
      } catch (e) {
        // Component doesn't exist, skip
      }
    }
  }
  
  if (availableComponents.length > 0) {
    state.components = availableComponents;
    state.useFallback = false;
    renderComponents();
    updateStatus('Ready • Click component for docs • Double-click to insert');
  } else {
    // Fallback 2: Use hardcoded examples
    useFallbackComponents();
  }
}

// Use fallback components when file system is unavailable
function useFallbackComponents() {
  console.log('Using fallback components');
  state.components = FALLBACK_COMPONENTS;
  state.useFallback = true;
  renderComponents();
  updateStatus('Ready • Using example components (no components folder found)');
}

// Render component list in sidebar
function renderComponents() {
  if (state.components.length === 0) {
    elements.componentsList.innerHTML = `
      <div class="loading-state">
        <p style="margin-bottom: 0.5rem">No components found</p>
        <p style="font-size: 0.75rem">Check ../../components/ directory</p>
      </div>
    `;
    elements.componentCount.textContent = '';
    return;
  }
  
  elements.componentCount.textContent = `(${state.components.length})`;
  elements.componentsList.innerHTML = state.components
    .map(component => `
      <button 
        class="component-item ${state.selectedComponent === component.name ? 'selected' : ''}" 
        data-component="${component.name}">
        ${component.name}
      </button>
    `)
    .join('');
  
  // Attach click listeners
  elements.componentsList.querySelectorAll('.component-item').forEach(btn => {
    btn.addEventListener('click', handleComponentClick);
  });
}

// Handle component button click
function handleComponentClick(e) {
  const componentName = e.currentTarget.dataset.component;
  state.selectedComponent = componentName;
  
  // Update UI
  document.querySelectorAll('.component-item').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.component === componentName);
  });
  
  // Track clicks for single/double detection
  if (!state.clickCounts[componentName]) {
    state.clickCounts[componentName] = 0;
  }
  state.clickCounts[componentName]++;
  
  clearTimeout(state.clickTimer);
  
  if (state.clickCounts[componentName] === 1) {
    // Single click - show docs after delay
    state.clickTimer = setTimeout(() => {
      loadDocumentation(componentName);
      state.clickCounts[componentName] = 0;
    }, 300);
  } else if (state.clickCounts[componentName] === 2) {
    // Double click - insert component
    clearTimeout(state.clickTimer);
    insertComponent(componentName);
    state.clickCounts[componentName] = 0;
  }
}

// Load component documentation
async function loadDocumentation(componentName) {
  updateStatus(`Loading docs for ${componentName}...`);
  
  // Check if using fallback
  if (state.useFallback) {
    const component = state.components.find(c => c.name === componentName);
    showFallbackDocs(component);
    return;
  }
  
  try {
    // Try both relative paths
    const paths = [
      `../../components/${componentName}/${componentName}.md`,
      `../../../components/${componentName}/${componentName}.md`
    ];
    
    let markdown = null;
    for (const mdPath of paths) {
      try {
        const response = await fetch(mdPath);
        if (response.ok) {
          markdown = await response.text();
          break;
        }
      } catch (e) {
        // Try next path
      }
    }
    
    if (!markdown) {
      elements.docsViewer.innerHTML = `
        <h1>${componentName}</h1>
        <p>⚠️ Documentation not found for this component.</p>
        <p>Expected location: <code>../../components/${componentName}/${componentName}.md</code></p>
        <h2>Usage</h2>
        <pre><code>&lt;${componentName}&gt;
  Component content
&lt;/${componentName}&gt;</code></pre>
      `;
      switchMode('docs');
      updateStatus('Documentation not found');
      return;
    }
    
    const html = convertMarkdown(markdown);
    
    elements.docsViewer.innerHTML = `
      <h1>${componentName}</h1>
      ${html}
    `;
    switchMode('docs');
    updateStatus(`Viewing ${componentName} documentation`);
    
  } catch (error) {
    console.error('Documentation error:', error);
    elements.docsViewer.innerHTML = `
      <h1>${componentName}</h1>
      <p>❌ Error loading documentation: ${error.message}</p>
    `;
    switchMode('docs');
    updateStatus('Documentation error');
  }
}

// Show fallback documentation
function showFallbackDocs(component) {
  const attrs = component.attributes?.map(attr => 
    `  ${attr.name}="${attr.default}"`
  ).join('\n') || '';
  
  elements.docsViewer.innerHTML = `
    <h1>${component.name}</h1>
    <p>${component.description || 'A web component'}</p>
    
    <h2>Usage</h2>
    <pre><code>&lt;${component.name}${attrs ? '\n' + attrs : ''}&gt;
  Component content
&lt;/${component.name}&gt;</code></pre>
    
    ${component.attributes ? `
    <h2>Attributes</h2>
    <ul>
      ${component.attributes.map(attr => 
        `<li><strong>${attr.name}</strong>: Default = "${attr.default}"</li>`
      ).join('')}
    </ul>
    ` : ''}
    
    <h2>Note</h2>
    <p>This is example documentation. Place actual components in <code>../../components/</code> folder with <code>.md</code> files for full documentation.</p>
  `;
  switchMode('docs');
  updateStatus(`Viewing ${component.name} documentation`);
}

// Convert markdown to HTML
function convertMarkdown(text) {
  return text
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/```[\s\S]*?```/gim, (match) => {
      const code = match.replace(/```\w*\n?/g, '').replace(/```$/g, '');
      return `<pre><code>${code}</code></pre>`;
    })
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gim, '<p>$1</p>')
    .replace(/<p><h/g, '<h')
    .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
    .replace(/<p><pre>/g, '<pre>')
    .replace(/<\/pre><\/p>/g, '</pre>')
    .replace(/<p><li>/g, '<li>')
    .replace(/<\/li><\/p>/g, '</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
}

// Insert component into editor
async function insertComponent(componentName) {
  updateStatus(`Inserting ${componentName}...`);
  
  try {
    let componentHTML;
    // Check if using fallback
    if (state.useFallback) {
      const component = state.components.find(c => c.name === componentName);
      componentHTML = generateFallbackHTML(component);
    } else {
      // Try to load schema from both paths
      const paths = [
        `../../components/${componentName}/${componentName}.schema.json`,
        `../../../components/${componentName}/${componentName}.schema.json`
      ];
      let schema = null;
      for (const schemaPath of paths) {
        try {
          const response = await fetch(schemaPath);
          if (response.ok) {
            schema = await response.json();
            break;
          }
        } catch (e) {}
      }
      if (schema) {
        componentHTML = generateComponentHTML(componentName, schema);
      } else {
        componentHTML = `\n<!-- ${componentName} component -->\n<${componentName}>\n  Component content\n</${componentName}>\n`;
      }
    }
    // Insert as first child in <main>
    const editor = elements.htmlEditor;
    const html = editor.value;
    const mainOpen = html.indexOf('<main');
    if (mainOpen !== -1) {
      const mainStart = html.indexOf('>', mainOpen) + 1;
      const mainClose = html.indexOf('</main>', mainStart);
      if (mainStart !== -1 && mainClose !== -1) {
        const before = html.substring(0, mainStart);
        const after = html.substring(mainStart, mainClose);
        const end = html.substring(mainClose);
        editor.value = before + '\n' + componentHTML + after + end;
        editor.setSelectionRange(mainStart + componentHTML.length + 1, mainStart + componentHTML.length + 1);
      } else {
        // fallback: insert at cursor
        const cursorPos = editor.selectionStart;
        const beforeCursor = editor.value.substring(0, cursorPos);
        const afterCursor = editor.value.substring(cursorPos);
        editor.value = beforeCursor + componentHTML + afterCursor;
        editor.setSelectionRange(cursorPos + componentHTML.length, cursorPos + componentHTML.length);
      }
    } else {
      // fallback: insert at cursor
      const cursorPos = editor.selectionStart;
      const beforeCursor = editor.value.substring(0, cursorPos);
      const afterCursor = editor.value.substring(cursorPos);
      editor.value = beforeCursor + componentHTML + afterCursor;
      editor.setSelectionRange(cursorPos + componentHTML.length, cursorPos + componentHTML.length);
    }
    editor.focus();
    elements.insertHint.classList.add('show');
    setTimeout(() => elements.insertHint.classList.remove('show'), 2000);
    updateStatus(`✓ Inserted ${componentName}`);
  } catch (error) {
    console.error('Insert error:', error);
    updateStatus(`Insert failed: ${error.message}`);
  }
}

// Generate component HTML from schema
function generateComponentHTML(componentName, schema) {
  const tag = schema.tags?.[0];
  if (!tag) {
    return `\n<${componentName}></${componentName}>\n`;
  }
  
  const attributes = tag.attributes || [];
  const attrString = attributes
    .filter(attr => attr.default)
    .map(attr => `${attr.name}="${attr.default}"`)
    .join(' ');
  
  const description = tag.description || 'Component content';
  
  return `
<!-- ${componentName}: ${description} -->
<${componentName}${attrString ? ' ' + attrString : ''}>
  ${description}
</${componentName}>
`;
}

// Generate fallback HTML for example components
function generateFallbackHTML(component) {
  const attrs = component.attributes?.map(attr => 
    `${attr.name}="${attr.default}"`
  ).join(' ') || '';
  
  return `
<!-- ${component.name}: ${component.description} -->
<${component.name}${attrs ? ' ' + attrs : ''}>
  ${component.description || 'Component content'}
</${component.name}>
`;
}

// Switch between edit/preview/docs modes
function switchMode(mode) {
  state.currentMode = mode;
  
  // Update buttons
  [elements.editBtn, elements.previewBtn, elements.docsBtn].forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Update panels
  [elements.editPanel, elements.previewPanel, elements.docsPanel].forEach(panel => {
    panel.classList.remove('active');
  });
  
  if (mode === 'edit') {
    elements.editBtn.classList.add('active');
    elements.editPanel.classList.add('active');
    updateStatus('Editing mode');
  } else if (mode === 'preview') {
    elements.previewBtn.classList.add('active');
    elements.previewPanel.classList.add('active');
    elements.previewFrame.srcdoc = elements.htmlEditor.value;
    updateStatus('Preview mode');
  } else if (mode === 'docs') {
    elements.docsBtn.classList.add('active');
    elements.docsPanel.classList.add('active');
    updateStatus(state.selectedComponent ? 
      `Viewing ${state.selectedComponent} documentation` : 
      'Documentation mode'
    );
  }
}

// Update status bar message
function updateStatus(message) {
  elements.statusText.textContent = message;
}

// Setup event listeners
function setupEventListeners() {
  elements.editBtn.addEventListener('click', () => switchMode('edit'));
  elements.previewBtn.addEventListener('click', () => switchMode('preview'));
  elements.docsBtn.addEventListener('click', () => switchMode('docs'));
  
  elements.menuBtn.addEventListener('click', () => {
    state.sidebarOpen = !state.sidebarOpen;
    elements.sidebar.classList.toggle('closed', !state.sidebarOpen);
  });
  
  elements.htmlEditor.addEventListener('input', () => {
    updateStatus('Editing...');
  });
}

// Initialize the IDE
function init() {
  initElements();
  setupEventListeners();
  discoverComponents();
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
