/**
 * Type definitions for WB Website Builder components
 */

// Component paths - TypeScript will validate these exist
export type ComponentPath = 
  | '@components/wb-theme/wb-theme-manager.js'
  | '@components/wb-keyboard-manager/wb-keyboard-manager.js'
  | '@components/wb-event-log/wb-event-log.js'
  | '@components/wb-control-panel/control-panel.js'
  | '@components/wb-button/wb-button.js'
  | '@components/wb-toggle/wb-toggle.js'
  | '@components/wb-slider/wb-slider.js'
  | '@components/wb-select/wb-select.js'
  | '@components/wb-color-picker/wb-color-picker.js'
  | '@components/wb-modal/wb-modal.js';

export type CSSPath = 
  | '@components/wb-theme/wb-theme-manager.css'
  | '@components/wb-keyboard-manager/wb-keyboard-manager.css'
  | '@components/wb-event-log/wb-event-log.css'
  | '@components/wb-control-panel/control-panel.css'
  | '@components/wb-button/wb-button.css'
  | '@components/wb-toggle/wb-toggle.css'
  | '@components/wb-slider/wb-slider.css'
  | '@components/wb-select/wb-select.css'
  | '@components/wb-color-picker/wb-color-picker.css'
  | '@components/wb-modal/wb-modal.css'
  | '@styles/main.css'
  | '@layouts/layouts.css';

export type ComponentPriority = 'essential' | 'high' | 'lazy';

export interface ComponentConfig {
  script: ComponentPath;
  css: CSSPath;
  priority: ComponentPriority;
  dependencies: string[];
}

export interface ComponentRegistry {
  [key: string]: ComponentConfig;
}

// Web Component base interface
export interface WBComponent extends HTMLElement {
  init?(): void | Promise<void>;
  connectedCallback(): void;
  disconnectedCallback?(): void;
  attributeChangedCallback?(name: string, oldValue: string, newValue: string): void;
}

// Website Builder configuration
export interface WBWebsiteBuilderConfig {
  theme: 'light' | 'dark';
  layout: 'top-nav' | 'side-nav';
  editMode: boolean;
  autoSave: boolean;
  components: {
    navigation: boolean;
    hero: boolean;
    features: boolean;
    gallery: boolean;
    about: boolean;
    footer: boolean;
    controlPanel: boolean;
    search: boolean;
  };
}

// Event types
export interface WBEventDetail {
  message: string;
  source?: string;
  data?: any;
}

export interface WBCustomEvent extends CustomEvent {
  detail: WBEventDetail;
}

// Utility types
export type WBEventType = 
  | 'wb:info'
  | 'wb:error' 
  | 'wb:warning'
  | 'wb-website-builder-ready'
  | 'wb-theme-changed'
  | 'wb-layout-changed'
  | 'wb-edit-mode-toggled'
  | 'wb-content-saved';

// Global declarations
declare global {
  interface Window {
    WBComponentUtils: any;
  }
  
  interface HTMLElementTagNameMap {
    'wb-website-builder': WBWebsiteBuilder;
  }
}

// Main component interface
export interface WBWebsiteBuilder extends WBComponent {
  isInitialized: boolean;
  components: Map<string, any>;
  init(): Promise<void>;
  loadCSS(): Promise<void>;
  loadCoreComponents(): Promise<void>;
  initializeWebsiteBuilder(): Promise<void>;
  initializeControlPanel(): Promise<void>;
  getTemplate(): string;
}