/**
 * Claude AI Website Builder - wb.ts
 *
 * This file contains the main functionality for the Claude AI Website Builder application.
 * It provides a user-friendly interface for building, customizing, and exporting websites
 * with dynamic content, themes, layouts, and media support.
 *
 * Features:
 * - Edit mode for modifying website content
 * - Theme selection and color customization
 * - Layout switching (top, left, right navigation)
 * - Media placeholders for images, videos, and audio
 * - Dynamic page creation
 * - State management for saving/restoring website settings
 * - Export functionality for generated websites
 *
 * Used by: wb.html (main website builder interface)
 */
interface Window {
    updateStatus?: (message: string, type?: string) => void;
}
interface DragOffset {
    x: number;
    y: number;
}
interface WebsiteOptions {
    type: string;
    title: string;
    subtitle: string;
    theme: string;
    layout: string;
}
interface RGB {
    r: number;
    g: number;
    b: number;
}
interface HSL {
    h: number;
    s: number;
    l: number;
}
interface CustomColors {
    primary: string;
    secondary: string;
    accent: string;
}
interface ColorBarState {
    hue: number;
    saturation: number;
    lightness: number;
    currentColorRgb: RGB;
    currentColorHex: string;
    customColors: CustomColors;
}
interface MediaPlaceholderState {
    backgroundImage: string;
    hasMedia: boolean;
}
interface WebsiteState {
    websiteOptions: WebsiteOptions;
    colorBar: ColorBarState;
    isEditMode: boolean;
    layout: string;
    theme: string;
    editableContent: Record<string, string>;
    mediaPlaceholders: Record<string, MediaPlaceholderState>;
}
declare function applyWebsiteOptions(): void;
declare function updateStatus(message: string, type?: string): void;
declare function handleUrlParameters(): void;
declare let isEditMode: boolean;
declare let isDragging: boolean;
declare let dragOffset: DragOffset;
declare let isMinimized: boolean;
declare let websiteOptions: WebsiteOptions;
declare let colorBarState: ColorBarState;
declare let body: HTMLBodyElement;
declare let controlPanel: HTMLElement;
declare let controlPanelBody: HTMLElement;
declare let minimizeBtn: HTMLButtonElement;
declare let editModeToggle: HTMLButtonElement;
declare let layoutSelect: HTMLSelectElement;
declare let themeSelect: HTMLSelectElement;
declare let saveBtn: HTMLButtonElement;
declare let resetBtn: HTMLButtonElement;
declare let colorBar: HTMLInputElement;
declare let lightnessSlider: HTMLInputElement;
declare let saturationSlider: HTMLInputElement;
declare let primaryColorPicker: HTMLInputElement;
declare let secondaryColorPicker: HTMLInputElement;
declare let accentColorPicker: HTMLInputElement;
declare let colorIndicator: HTMLElement;
declare let colorPreviewBox: HTMLElement;
/**
 * Initialize all DOM elements needed by the website builder
 * Adds proper TypeScript type casting to avoid null issues
 */
declare function initializeElements(): void;
declare function init(): void;
declare function setupControlPanel(): void;
declare function setupEditMode(): void;
declare function setupLayoutControl(): void;
declare function setupThemeControl(): void;
declare function setupButtonActions(): void;
/**
 * Sets up media placeholders and add media functionality for all editable elements
 * - Allows clicking on media placeholders to add media
 * - Adds ability to insert media above or below any editable element
 */
declare function setupMediaPlaceholders(): void;
/**
 * Adds media to an existing placeholder
 * @param {HTMLElement} placeholder - The placeholder element to add media to
 */
declare function addMediaToPlaceholder(placeholder: any): void;
/**
 * Creates and displays a context menu for adding media around editable elements
 * @param {MouseEvent} e - The mouse event that triggered the context menu
 * @param {HTMLElement} element - The editable element to add media around
 */
declare function showMediaContextMenu(e: any, element: any): void;
/**
 * Adds media above or below an editable element
 * @param {HTMLElement} element - The element to add media near
 * @param {string} position - Whether to add media 'above' or 'below' the element
 */
declare function addMediaNearElement(element: any, position: any): void;
/**
 * Adds media controls to all editable elements
 */
declare function setupEditableElementsMediaControls(): void;
declare function initializeExistingPlaceholders(): void;
declare function updatePlaceholderVisibility(placeholder: any): void;
declare function setupDynamicPagesNavigation(): void;
declare function createDynamicPage(pageId: any, pageTitle: any): void;
/**
 * Generates the content for different types of pages
 * @param {string} pageId - The ID of the page to generate
 * @param {string} pageTitle - The title of the page
 * @param {string} websiteType - The type of website (business, portfolio, etc.)
 * @returns {string} - The HTML content for the page
 */
declare function generatePageContent(pageId: any, pageTitle: any, websiteType: any): string;
