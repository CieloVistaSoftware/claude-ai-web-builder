import { Component, ComponentProps, BuilderState, DragDropContext, ExportOptions, ImportOptions, ValidationResult, TemplateConfig, ComponentLibrary, Plugin, BuilderEvent } from '@/types';
import { EventEmitter } from '@/utils/event-emitter';
import { HistoryManager } from '@/utils/history-manager';
import { ValidationEngine } from '@/utils/validation';

/**
 * Main Website Builder Engine
 * Handles component management, state, and core functionality
 */
export class WebsiteBuilder extends EventEmitter {
  private _state: BuilderState;
  private _components: Map<string, Component> = new Map();
  private _history: HistoryManager;
  private _validation: ValidationEngine;
  private _dragDropContext: DragDropContext | null = null;
  private _plugins: Map<string, Plugin> = new Map();
  private _isInitialized = false;

  constructor() {
    super();
    
    this._state = this.createInitialState();
    this._history = new HistoryManager(this._state.settings.undoLimit);
    this._validation = new ValidationEngine();
    
    this.setupEventHandlers();
  }

  /**
   * Initialize the builder
   */
  public async initialize(): Promise<void> {
    if (this._isInitialized) {
      console.warn('Builder already initialized');
      return;
    }

    try {
      await this.loadDefaultComponents();
      await this.loadPlugins();
      
      this._isInitialized = true;
      this.emit('builder:initialized', { builder: this });
      
      console.log('Website Builder initialized successfully');
    } catch (error) {
      console.error('Failed to initialize builder:', error);
      throw error;
    }
  }

  /**
   * Get current builder state
   */
  public get state(): BuilderState {
    return { ...this._state };
  }

  /**
   * Add component to the builder
   */
  public addComponent(component: Component, parentId?: string, index?: number): void {
    try {
      this.validateComponent(component);
      
      const newComponent = { ...component, id: component.id || this.generateId() };
      
      if (parentId) {
        const parent = this._components.get(parentId);
        if (!parent) {
          throw new Error(`Parent component ${parentId} not found`);
        }
        
        if (!parent.children) {
          parent.children = [];
        }
        
        if (index !== undefined) {
          parent.children.splice(index, 0, newComponent);
        } else {
          parent.children.push(newComponent);
        }
      }
      
      this._components.set(newComponent.id, newComponent);
      this.saveToHistory('component:added', `Added component ${newComponent.type}`);
      this.emit('component:added', newComponent);
      
    } catch (error) {
      console.error('Failed to add component:', error);
      throw error;
    }
  }

  /**
   * Remove component from builder
   */
  public removeComponent(componentId: string): void {
    const component = this._components.get(componentId);
    if (!component) {
      throw new Error(`Component ${componentId} not found`);
    }

    // Remove from parent's children
    this.removeFromParent(componentId);
    
    // Remove component and all its children
    this.removeComponentRecursive(componentId);
    
    this.saveToHistory('component:removed', `Removed component ${component.type}`);
    this.emit('component:removed', { id: componentId });
  }

  /**
   * Update component properties
   */
  public updateComponent(componentId: string, updates: Partial<Component>): void {
    const component = this._components.get(componentId);
    if (!component) {
      throw new Error(`Component ${componentId} not found`);
    }

    const updatedComponent = { ...component, ...updates };
    this.validateComponent(updatedComponent);
    
    this._components.set(componentId, updatedComponent);
    this.saveToHistory('component:updated', `Updated component ${component.type}`);
    this.emit('component:updated', updatedComponent);
  }

  /**
   * Get component by ID
   */
  public getComponent(componentId: string): Component | undefined {
    return this._components.get(componentId);
  }

  /**
   * Get all components
   */
  public getAllComponents(): Component[] {
    return Array.from(this._components.values());
  }

  /**
   * Select component(s)
   */
  public selectComponent(componentId: string | string[], append = false): void {
    const ids = Array.isArray(componentId) ? componentId : [componentId];
    
    if (!append) {
      this._state.selectedComponents = [];
    }
    
    for (const id of ids) {
      const component = this._components.get(id);
      if (component && !this._state.selectedComponents.includes(component)) {
        this._state.selectedComponents.push(component);
      }
    }
    
    this._state.activeComponent = this._state.selectedComponents[0] || null;
    this.emit('selection:changed', this._state.selectedComponents);
  }

  /**
   * Clear selection
   */
  public clearSelection(): void {
    this._state.selectedComponents = [];
    this._state.activeComponent = null;
    this.emit('selection:changed', []);
  }

  /**
   * Undo last action
   */
  public undo(): void {
    const previousState = this._history.undo();
    if (previousState) {
      this.restoreState(previousState);
      this.emit('state:changed', this._state);
    }
  }

  /**
   * Redo last undone action
   */
  public redo(): void {
    const nextState = this._history.redo();
    if (nextState) {
      this.restoreState(nextState);
      this.emit('state:changed', this._state);
    }
  }

  /**
   * Export components
   */
  public async export(options: ExportOptions): Promise<string> {
    const components = this.getAllComponents();
    const result = this._validation.validateComponents(components);
    
    if (!result.valid && options.format !== 'json') {
      throw new Error('Cannot export with validation errors');
    }

    switch (options.format) {
      case 'html':
        return this.exportToHTML(components, options);
      case 'react':
        return this.exportToReact(components, options);
      case 'vue':
        return this.exportToVue(components, options);
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }

  /**
   * Import components
   */
  public async import(data: string, options: ImportOptions): Promise<void> {
    try {
      let components: Component[];
      
      switch (options.format) {
        case 'json':
          components = JSON.parse(data);
          break;
        case 'html':
          components = await this.parseHTMLToComponents(data);
          break;
        default:
          throw new Error(`Unsupported import format: ${options.format}`);
      }

      if (options.validateComponents) {
        const result = this._validation.validateComponents(components);
        if (!result.valid) {
          throw new Error('Invalid components in import data');
        }
      }

      for (const component of components) {
        if (!options.preserveIds) {
          component.id = this.generateId();
        }
        this.addComponent(component);
      }

      this.emit('components:imported', components);
      
    } catch (error) {
      console.error('Import failed:', error);
      throw error;
    }
  }

  /**
   * Validate all components
   */
  public validate(): ValidationResult {
    const components = this.getAllComponents();
    return this._validation.validateComponents(components);
  }

  /**
   * Load template
   */
  public async loadTemplate(template: TemplateConfig): Promise<void> {
    this.clear();
    
    for (const component of template.components) {
      this.addComponent(component);
    }
    
    this.emit('template:loaded', template);
  }

  /**
   * Clear all components
   */
  public clear(): void {
    this._components.clear();
    this._state.selectedComponents = [];
    this._state.activeComponent = null;
    this.emit('builder:cleared');
  }

  /**
   * Destroy builder instance
   */
  public destroy(): void {
    this.clear();
    this.removeAllListeners();
    this._plugins.clear();
    this._isInitialized = false;
  }

  // Private methods

  private createInitialState(): BuilderState {
    return {
      activeComponent: null,
      selectedComponents: [],
      clipboard: [],
      history: [],
      historyIndex: -1,
      canvas: {
        zoom: 1,
        pan: { x: 0, y: 0 },
        gridEnabled: true,
        snapToGrid: false,
        gridSize: 10,
        backgroundColor: '#ffffff',
        dimensions: { width: 1200, height: 800 }
      },
      ui: {
        sidebarCollapsed: false,
        propertyPanelCollapsed: false,
        theme: 'light',
        activeTab: 'components',
        modalStack: []
      },
      settings: {
        autoSave: true,
        autoSaveInterval: 30000,
        undoLimit: 50,
        defaultComponentLibrary: 'default',
        enableCollaboration: false,
        keyboardShortcuts: true
      }
    };
  }

  private setupEventHandlers(): void {
    // Auto-save functionality
    if (this._state.settings.autoSave) {
      setInterval(() => {
        this.autoSave();
      }, this._state.settings.autoSaveInterval);
    }
  }

  private validateComponent(component: Component): void {
    const result = this._validation.validateComponent(component);
    if (!result.valid) {
      throw new Error(`Component validation failed: ${result.errors[0]?.message}`);
    }
  }

  private saveToHistory(action: string, description: string): void {
    this._history.saveState(this._state, action, description);
  }

  private restoreState(state: Partial<BuilderState>): void {
    this._state = { ...this._state, ...state };
  }

  private removeFromParent(componentId: string): void {
    for (const component of this._components.values()) {
      if (component.children) {
        const index = component.children.findIndex(child => child.id === componentId);
        if (index !== -1) {
          component.children.splice(index, 1);
          break;
        }
      }
    }
  }

  private removeComponentRecursive(componentId: string): void {
    const component = this._components.get(componentId);
    if (!component) return;

    // Remove children first
    if (component.children) {
      for (const child of component.children) {
        this.removeComponentRecursive(child.id);
      }
    }

    this._components.delete(componentId);
  }

  private async loadDefaultComponents(): Promise<void> {
    // Load default component library
    console.log('Loading default components...');
  }

  private async loadPlugins(): Promise<void> {
    // Load registered plugins
    console.log('Loading plugins...');
  }

  private generateId(): string {
    return `wb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async autoSave(): Promise<void> {
    try {
      const data = JSON.stringify(this.getAllComponents());
      localStorage.setItem('wb-autosave', data);
      console.log('Auto-saved builder state');
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }

  private async exportToHTML(components: Component[], options: ExportOptions): Promise<string> {
    // Implementation for HTML export
    return '<!DOCTYPE html><html><head><title>Generated Site</title></head><body></body></html>';
  }

  private async exportToReact(components: Component[], options: ExportOptions): Promise<string> {
    // Implementation for React export
    return 'import React from "react";\n\nexport default function GeneratedComponent() {\n  return <div>Generated React Component</div>;\n}';
  }

  private async exportToVue(components: Component[], options: ExportOptions): Promise<string> {
    // Implementation for Vue export
    return '<template>\n  <div>Generated Vue Component</div>\n</template>';
  }

  private async parseHTMLToComponents(html: string): Promise<Component[]> {
    // Implementation for HTML parsing
    return [];
  }
}