// Core type definitions for Website Builder
export interface ComponentProps {
  [key: string]: unknown;
}

export interface ComponentMetadata {
  id: string;
  name: string;
  category: string;
  description: string;
  icon?: string;
  preview?: string;
  version: string;
  author?: string;
  tags?: string[];
}

export interface Component {
  id: string;
  type: string;
  props: ComponentProps;
  children?: Component[];
  metadata: ComponentMetadata;
  styles?: CSSStyleDeclaration | Record<string, string>;
  events?: ComponentEvents;
}

export interface ComponentEvents {
  [eventName: string]: (event: Event) => void;
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail?: string;
  components: Component[];
  globalStyles?: string;
  metadata: {
    version: string;
    author: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
  };
}

export interface BuilderState {
  activeComponent: Component | null;
  selectedComponents: Component[];
  clipboard: Component[];
  history: HistoryEntry[];
  historyIndex: number;
  canvas: CanvasState;
  ui: UIState;
  settings: BuilderSettings;
}

export interface CanvasState {
  zoom: number;
  pan: { x: number; y: number };
  gridEnabled: boolean;
  snapToGrid: boolean;
  gridSize: number;
  backgroundColor: string;
  dimensions: { width: number; height: number };
}

export interface UIState {
  sidebarCollapsed: boolean;
  propertyPanelCollapsed: boolean;
  theme: 'light' | 'dark';
  activeTab: string;
  modalStack: string[];
}

export interface BuilderSettings {
  autoSave: boolean;
  autoSaveInterval: number;
  undoLimit: number;
  defaultComponentLibrary: string;
  enableCollaboration: boolean;
  keyboardShortcuts: boolean;
}

export interface HistoryEntry {
  id: string;
  action: string;
  timestamp: number;
  beforeState: Partial<BuilderState>;
  afterState: Partial<BuilderState>;
  description: string;
}

export interface DragDropContext {
  draggedComponent: Component | null;
  draggedElement: HTMLElement | null;
  dropTarget: HTMLElement | null;
  dropZone: DropZone | null;
  dragOffset: { x: number; y: number };
  isValidDrop: boolean;
}

export interface DropZone {
  element: HTMLElement;
  component: Component;
  position: 'before' | 'after' | 'inside';
  highlight: boolean;
}

export interface ExportOptions {
  format: 'html' | 'react' | 'vue' | 'angular';
  minify: boolean;
  includeStyles: boolean;
  includeScripts: boolean;
  standalone: boolean;
  targetDirectory?: string;
  fileName?: string;
}

export interface ImportOptions {
  format: 'html' | 'json' | 'zip';
  preserveIds: boolean;
  mergeStyles: boolean;
  validateComponents: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  code: string;
  message: string;
  component?: Component;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationWarning extends ValidationError {
  suggestion?: string;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: number;
}

export interface TemplateAPIResponse extends APIResponse {
  data?: {
    templates: TemplateConfig[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface ComponentLibrary {
  id: string;
  name: string;
  description: string;
  version: string;
  components: ComponentMetadata[];
  categories: string[];
}

// Event system types
export interface BuilderEvent<T = unknown> {
  type: string;
  payload: T;
  timestamp: number;
  source: string;
}

export interface ComponentAddedEvent extends BuilderEvent<Component> {
  type: 'component:added';
}

export interface ComponentRemovedEvent extends BuilderEvent<{ id: string }> {
  type: 'component:removed';
}

export interface ComponentUpdatedEvent extends BuilderEvent<Component> {
  type: 'component:updated';
}

export interface StateChangedEvent extends BuilderEvent<Partial<BuilderState>> {
  type: 'state:changed';
}

// Plugin system types
export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  dependencies?: string[];
  activate: (context: PluginContext) => void;
  deactivate: () => void;
}

export interface PluginContext {
  builder: unknown; // Will be WebsiteBuilder instance, but avoiding circular reference
  registerComponent: (component: ComponentMetadata) => void;
  registerTool: (tool: Tool) => void;
  registerExporter: (exporter: Exporter) => void;
  addEventListener: (type: string, handler: (event: BuilderEvent) => void) => void;
}

export interface Tool {
  id: string;
  name: string;
  icon: string;
  category: string;
  action: (context: PluginContext) => void;
}

export interface Exporter {
  id: string;
  name: string;
  format: string;
  export: (components: Component[], options: ExportOptions) => Promise<string>;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type EventHandler<T = Event> = (event: T) => void;

export type ComponentType = 
  | 'text' 
  | 'image' 
  | 'button' 
  | 'container' 
  | 'form' 
  | 'input' 
  | 'video' 
  | 'audio' 
  | 'custom';

export type BuilderMode = 'design' | 'preview' | 'code';

export type ThemeMode = 'light' | 'dark' | 'auto';