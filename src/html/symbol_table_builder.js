// Extracted from symbol_table_builder.html
// This file should be imported as a module in the HTML

const sourceCode = `const PI = 3.14159;

function calculateArea(radius) {
  var diameter = radius * 2;
  
  if (radius > 0) {
    let circumference = 2 * PI * radius;
    const area = PI * radius * radius;
    return area;
  }
  
  return 0;
}

function processCircles(circles) {
  const results = [];
  
  for (let i = 0; i < circles.length; i++) {
    const circle = circles[i];
    const area = calculateArea(circle.radius);
    results.push({ radius: circle.radius, area });
  }
  
  return results;
}

var globalCounter = 0;

const data = processCircles([
  { radius: 5 },
  { radius: 10 }
]);`;

document.getElementById('sourceCode').textContent = sourceCode;

class Scope {
  constructor(type, parent = null) {
    this.type = type; // 'global', 'function', 'block'
    this.parent = parent;
    this.symbols = new Map();
    this.children = [];
  }

  define(name, kind, line, hoisted = false) {
    this.symbols.set(name, { name, kind, line, hoisted, references: [] });
  }

  resolve(name) {
    if (this.symbols.has(name)) {
      return { scope: this, symbol: this.symbols.get(name) };
    }
    return this.parent ? this.parent.resolve(name) : null;
  }

  addReference(name, line) {
    const resolution = this.resolve(name);
    if (resolution) {
      resolution.symbol.references.push(line);
    }
  }
}

let steps = [];
let currentStep = 0;
let globalScope;

function addStep(title, content) {
  steps.push({ title, content });
}

function buildSymbolTable() {
  steps = [];
  globalScope = new Scope('global');

  addStep('Step 1: Initialize Global Scope', 
    'Create the global scope. This is the root of our scope tree.');

  addStep('Step 2: First Pass - Hoist Function Declarations',
    'Before executing any code, JavaScript hoists function declarations to the top of their scope. We scan for function declarations and add them to the symbol table.');

  globalScope.define('calculateArea', 'function', 3, true);
  globalScope.define('processCircles', 'function', 15, true);

  addStep('Step 3: Process Global Variables (const PI)',
    'Line 1: "const PI = 3.14159" - Add PI to global scope. Unlike var, const is not hoisted (temporal dead zone).');

  globalScope.define('PI', 'const', 1);

  addStep('Step 4: Analyze calculateArea Function',
    'Line 3-13: Enter function scope for calculateArea. Create new scope with parent = global.');

  const calculateAreaScope = new Scope('function', globalScope);
  globalScope.children.push(calculateAreaScope);

  addStep('Step 5: Function Parameters',
    'Parameters are added to the function scope: radius');

  calculateAreaScope.define('radius', 'parameter', 3);

  addStep('Step 6: Hoist var in Function Scope',
    'Line 4: "var diameter" - var declarations are hoisted to function scope (not block scope).');

  calculateAreaScope.define('diameter', 'var', 4, true);

  addStep('Step 7: Block Scope Inside If Statement',
    'Line 6-10: Enter block scope for if statement. let and const are block-scoped.');

  const ifBlockScope = new Scope('block', calculateAreaScope);
  calculateAreaScope.children.push(ifBlockScope);

  ifBlockScope.define('circumference', 'let', 7);
  ifBlockScope.define('area', 'const', 8);

  addStep('Step 8: Variable References in calculateArea',
    'Track all variable usages: radius (lines 4,6,7,8), PI (lines 7,8), diameter (line 4), circumference (line 7), area (lines 8,9)');

  calculateAreaScope.addReference('radius', 4);
  calculateAreaScope.addReference('radius', 6);
  calculateAreaScope.addReference('radius', 7);
  calculateAreaScope.addReference('radius', 8);
  globalScope.addReference('PI', 7);
  globalScope.addReference('PI', 8);
  ifBlockScope.addReference('area', 9);

  addStep('Step 9: Analyze processCircles Function',
    'Line 15-26: Enter function scope for processCircles.');

  const processCirclesScope = new Scope('function', globalScope);
  globalScope.children.push(processCirclesScope);

  processCirclesScope.define('circles', 'parameter', 15);
  processCirclesScope.define('results', 'const', 16);

  addStep('Step 10: For Loop Block Scope',
    'Line 18-22: For loop creates its own block scope. Loop variable "i" is scoped to this block.');

  const forBlockScope = new Scope('block', processCirclesScope);
  processCirclesScope.children.push(forBlockScope);

  forBlockScope.define('i', 'let', 18);
  forBlockScope.define('circle', 'const', 19);
  forBlockScope.define('area', 'const', 20);

  addStep('Step 11: Variable References in processCircles',
    'Track references: circles (lines 18,19), i (lines 18,19), results (lines 21,24), calculateArea (line 20)');

  processCirclesScope.addReference('circles', 18);
  forBlockScope.addReference('circles', 19);
  forBlockScope.addReference('i', 18);
  forBlockScope.addReference('i', 18);
  forBlockScope.addReference('i', 19);
  processCirclesScope.addReference('results', 21);
  processCirclesScope.addReference('results', 24);
  globalScope.addReference('calculateArea', 20);

  addStep('Step 12: Global Variable Declarations',
    'Line 28: "var globalCounter = 0" - Added to global scope with hoisting.');

  globalScope.define('globalCounter', 'var', 28, true);

  addStep('Step 13: Final Global Const',
    'Line 30: "const data = ..." - Add data to global scope, references processCircles.');

  globalScope.define('data', 'const', 30);
  globalScope.addReference('processCircles', 30);

  addStep('Step 14: Symbol Table Complete',
    'All symbols have been identified and organized into scopes. The symbol table now contains: global scope, 2 function scopes, and 2 block scopes.');
}

function renderSymbolTable(scope, level = 0) {
  let html = `<div class="scope" style="margin-left: ${level * 20}px">`;
  html += `<div class="scope-title">${scope.type.toUpperCase()} SCOPE</div>`;
  
  for (const [name, info] of scope.symbols) {
    const refCount = info.references.length;
    const hoistedMark = info.hoisted ? ' [HOISTED]' : '';
    html += `<div class="symbol">
      <span class="name">${name}</span>: 
      <span class="kind">${info.kind}</span>
      <span class="line"> (line ${info.line}${hoistedMark}, ${refCount} refs)</span>
    </div>`;
  }
  
  for (const child of scope.children) {
    html += renderSymbolTable(child, level + 1);
  }
  
  html += '</div>';
  return html;
}

function renderSteps() {
  const stepsDiv = document.getElementById('steps');
  stepsDiv.innerHTML = '';
  
  for (let i = 0; i < steps.length && i <= currentStep; i++) {
    const step = steps[i];
    const div = document.createElement('div');
    div.className = 'step';
    div.innerHTML = `
      <div class="step-title">${step.title}</div>
      <div class="step-content">${step.content}</div>
    `;
    stepsDiv.appendChild(div);
  }
}

function runAnalysis() {
  buildSymbolTable();
  currentStep = steps.length - 1;
  renderSteps();
  document.getElementById('symbolTable').innerHTML = renderSymbolTable(globalScope);
}

function stepThrough() {
  if (currentStep === 0) {
    buildSymbolTable();
  }
  
  if (currentStep < steps.length - 1) {
    currentStep++;
    renderSteps();
    if (currentStep === steps.length - 1) {
      document.getElementById('symbolTable').innerHTML = renderSymbolTable(globalScope);
    }
  }
}

function reset() {
  currentStep = 0;
  steps = [];
  document.getElementById('symbolTable').innerHTML = '<p>Click "Run Full Analysis" or "Step Through" to begin.</p>';
  document.getElementById('steps').innerHTML = '';
}

// Initialize
reset();
