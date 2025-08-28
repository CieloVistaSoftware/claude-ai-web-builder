interface WebsiteProject {
    id: string;
    metadata: ProjectMetadata;
    design: DesignSystem;
    pages: Page[];
    components: ComponentLibrary;
    settings: ProjectSettings;
    history: VersionHistory[];
    createdAt: string;
    updatedAt: string;
}
interface ProjectMetadata {
    name: string;
    type: 'business' | 'portfolio' | 'ecommerce' | 'blog' | 'restaurant' | 'agency' | 'nonprofit';
    description?: string;
    owner: {
        name: string;
        email?: string;
        claudeApiKey?: string;
    };
    status: 'draft' | 'published' | 'archived';
    domain?: string;
    favicon?: string;
}
interface DesignSystem {
    theme: Theme;
    typography: TypographySettings;
    spacing: SpacingSettings;
    animations: AnimationSettings;
    customCSS?: string;
}
interface Theme {
    id: string;
    name: string;
    mode: 'light' | 'dark' | 'auto';
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
        border: string;
        error: string;
        success: string;
        warning: string;
    };
}
interface TypographySettings {
    headingFont: string;
    bodyFont: string;
    fontSizes: {
        xs: string;
        sm: string;
        base: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
    };
    fontWeights: {
        normal: number;
        medium: number;
        semibold: number;
        bold: number;
    };
    lineHeights: {
        tight: number;
        normal: number;
        relaxed: number;
    };
}
interface SpacingSettings {
    scale: number;
    baseUnit: 'rem' | 'px';
    containerMaxWidth: string;
    sectionPadding: string;
}
interface AnimationSettings {
    duration: 'fast' | 'normal' | 'slow';
    easing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
    enableTransitions: boolean;
    enableHoverEffects: boolean;
}
interface Page {
    id: string;
    name: string;
    slug: string;
    title: string;
    description?: string;
    keywords?: string[];
    components: ComponentInstance[];
    seo: SEOSettings;
    settings: PageSettings;
    isHomePage: boolean;
    createdAt: string;
    updatedAt: string;
}
interface SEOSettings {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    ogTitle?: string;
    ogDescription?: string;
    twitterCard?: 'summary' | 'summary_large_image';
    canonicalUrl?: string;
    noIndex?: boolean;
    noFollow?: boolean;
}
interface PageSettings {
    layout: 'full-width' | 'contained' | 'sidebar-left' | 'sidebar-right';
    header: {
        show: boolean;
        transparent: boolean;
        sticky: boolean;
    };
    footer: {
        show: boolean;
    };
    customCSS?: string;
    customJS?: string;
}
interface ComponentInstance {
    id: string;
    type: ComponentType;
    props: Record<string, any>;
    children?: ComponentInstance[];
    styles: ComponentStyles;
    responsive: ResponsiveStyles;
    animations?: AnimationConfig;
    position: {
        order: number;
        container?: string;
    };
    visibility: {
        desktop: boolean;
        tablet: boolean;
        mobile: boolean;
    };
    createdAt: string;
    updatedAt: string;
}
type ComponentType = 'hero' | 'navigation' | 'footer' | 'text' | 'image' | 'button' | 'card' | 'grid' | 'form' | 'contact-form' | 'gallery' | 'testimonial' | 'pricing-table' | 'accordion' | 'tabs' | 'modal' | 'video' | 'map' | 'social-links' | 'divider' | 'spacer' | 'container' | 'column' | 'custom';
interface ComponentStyles {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    borderWidth?: string;
    borderRadius?: string;
    padding?: string;
    margin?: string;
    fontSize?: string;
    fontWeight?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    boxShadow?: string;
    opacity?: number;
    transform?: string;
    customCSS?: string;
}
interface ResponsiveStyles {
    mobile?: Partial<ComponentStyles>;
    tablet?: Partial<ComponentStyles>;
    desktop?: Partial<ComponentStyles>;
}
interface AnimationConfig {
    entrance?: {
        type: 'fade' | 'slide' | 'zoom' | 'bounce';
        direction?: 'up' | 'down' | 'left' | 'right';
        duration: number;
        delay: number;
    };
    hover?: {
        transform?: string;
        backgroundColor?: string;
        scale?: number;
        duration: number;
    };
    scroll?: {
        parallax?: number;
        sticky?: boolean;
    };
}
interface ComponentLibrary {
    custom: CustomComponent[];
    presets: PresetComponent[];
    templates: ComponentTemplate[];
}
interface CustomComponent {
    id: string;
    name: string;
    description?: string;
    type: ComponentType;
    defaultProps: Record<string, any>;
    defaultStyles: ComponentStyles;
    schema: ComponentSchema;
    createdAt: string;
}
interface ComponentSchema {
    props: {
        [key: string]: {
            type: 'string' | 'number' | 'boolean' | 'color' | 'image' | 'select' | 'textarea';
            label: string;
            default?: any;
            options?: string[];
            required?: boolean;
            description?: string;
        };
    };
    styles: {
        [key: string]: {
            type: 'color' | 'spacing' | 'size' | 'border' | 'shadow';
            label: string;
            category: 'layout' | 'appearance' | 'typography' | 'effects';
        };
    };
}
interface PresetComponent {
    id: string;
    name: string;
    category: 'hero' | 'about' | 'services' | 'contact' | 'footer' | 'navigation';
    component: ComponentInstance;
    preview: string;
    tags: string[];
    industry?: string[];
}
interface ComponentTemplate {
    id: string;
    name: string;
    description: string;
    components: ComponentInstance[];
    preview: string;
    category: 'section' | 'page' | 'layout';
    industry?: string[];
}
interface ProjectSettings {
    general: GeneralSettings;
    seo: GlobalSEOSettings;
    analytics: AnalyticsSettings;
    performance: PerformanceSettings;
    security: SecuritySettings;
    integrations: IntegrationSettings;
}
interface GeneralSettings {
    siteName: string;
    timezone: string;
    language: string;
    rtl: boolean;
    maintenance: {
        enabled: boolean;
        message?: string;
        allowedIPs?: string[];
    };
}
interface GlobalSEOSettings {
    sitemap: {
        enabled: boolean;
        frequency: 'daily' | 'weekly' | 'monthly';
        priority: number;
    };
    robots: {
        index: boolean;
        follow: boolean;
        customRules?: string;
    };
    structuredData: {
        organization?: OrganizationData;
        website?: WebsiteData;
    };
}
interface OrganizationData {
    name: string;
    url: string;
    logo?: string;
    sameAs?: string[];
    address?: {
        streetAddress: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    phone?: string;
    email?: string;
}
interface WebsiteData {
    name: string;
    url: string;
    description: string;
    inLanguage: string;
    copyrightYear: number;
    copyrightHolder: string;
}
interface AnalyticsSettings {
    googleAnalytics?: {
        trackingId: string;
        enabled: boolean;
    };
    googleTagManager?: {
        containerId: string;
        enabled: boolean;
    };
    facebookPixel?: {
        pixelId: string;
        enabled: boolean;
    };
    customScripts?: {
        header?: string;
        footer?: string;
    };
}
interface PerformanceSettings {
    optimization: {
        minifyCSS: boolean;
        minifyJS: boolean;
        compressImages: boolean;
        lazyLoading: boolean;
        preloadFonts: boolean;
    };
    caching: {
        enabled: boolean;
        ttl: number;
    };
    cdn: {
        enabled: boolean;
        provider?: 'cloudflare' | 'aws' | 'custom';
        customDomain?: string;
    };
}
interface SecuritySettings {
    ssl: {
        enforceHTTPS: boolean;
        hstsEnabled: boolean;
    };
    headers: {
        contentSecurityPolicy?: string;
        xFrameOptions: 'DENY' | 'SAMEORIGIN' | 'ALLOW-FROM';
        xContentTypeOptions: boolean;
    };
    passwordProtection?: {
        enabled: boolean;
        password: string;
        hint?: string;
    };
}
interface IntegrationSettings {
    claude: {
        apiKey?: string;
        model: string;
        enabled: boolean;
        features: {
            contentGeneration: boolean;
            designSuggestions: boolean;
            seoOptimization: boolean;
            accessibility: boolean;
        };
    };
    email: {
        provider?: 'sendgrid' | 'mailgun' | 'smtp';
        apiKey?: string;
        fromEmail: string;
        fromName: string;
    };
    forms: {
        captcha: {
            enabled: boolean;
            provider: 'recaptcha' | 'hcaptcha';
            siteKey?: string;
            secretKey?: string;
        };
        notifications: {
            email: boolean;
            webhook?: string;
        };
    };
    ecommerce?: {
        provider: 'stripe' | 'paypal' | 'square';
        apiKey?: string;
        currency: string;
        taxEnabled: boolean;
        shippingEnabled: boolean;
    };
}
interface VersionHistory {
    id: string;
    version: string;
    description: string;
    changes: ChangeRecord[];
    author: string;
    createdAt: string;
    snapshot: Partial<WebsiteProject>;
}
interface ChangeRecord {
    type: 'component_added' | 'component_removed' | 'component_modified' | 'page_added' | 'page_removed' | 'settings_changed' | 'theme_changed';
    target: string;
    description: string;
    before?: any;
    after?: any;
}
interface ClaudeInteraction {
    id: string;
    projectId: string;
    sessionId: string;
    timestamp: string;
    request: {
        type: 'component_generation' | 'design_suggestion' | 'content_creation' | 'optimization' | 'general_chat';
        prompt: string;
        context: {
            currentPage?: string;
            selectedComponent?: string;
            projectType: string;
            theme: string;
        };
    };
    response: {
        text: string;
        suggestions?: ClaudeSuggestion[];
        generatedComponent?: ComponentInstance;
        confidence: number;
    };
    userFeedback?: {
        rating: 1 | 2 | 3 | 4 | 5;
        applied: boolean;
        notes?: string;
    };
}
interface ClaudeSuggestion {
    id: string;
    type: 'component' | 'style' | 'content' | 'seo' | 'accessibility';
    title: string;
    description: string;
    impact: 'low' | 'medium' | 'high';
    effort: 'easy' | 'moderate' | 'complex';
    category: string;
    actionable: boolean;
    autoApplyable: boolean;
    data?: any;
}
interface AssetFile {
    id: string;
    projectId: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    thumbnails?: {
        small: string;
        medium: string;
        large: string;
    };
    alt?: string;
    tags?: string[];
    createdAt: string;
    usedIn: string[];
}
declare class JSONWebsiteDatabase {
    private data;
    constructor();
    createProject(metadata: ProjectMetadata): string;
    updateProject(id: string, updates: Partial<WebsiteProject>): void;
    getProject(id: string): WebsiteProject | null;
    addComponent(projectId: string, pageId: string, component: ComponentInstance): void;
    updateComponent(projectId: string, pageId: string, componentId: string, updates: Partial<ComponentInstance>): void;
    logClaudeInteraction(interaction: ClaudeInteraction): void;
    addAsset(asset: AssetFile): void;
    private loadFromFile;
    private saveToFile;
    private createEmpty;
    private generateId;
    private getDefaultDesign;
    private getDefaultSettings;
    private createDefaultHomePage;
}
export { JSONWebsiteDatabase, type WebsiteProject, type ComponentInstance, type ClaudeInteraction };
