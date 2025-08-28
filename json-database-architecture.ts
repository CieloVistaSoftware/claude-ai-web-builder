// JSON Database Schema for Claude Website Builder

// Main Project Structure
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
    claudeApiKey?: string; // Encrypted
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
  scale: number; // Multiplier for base spacing
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

// Page Structure
interface Page {
  id: string;
  name: string;
  slug: string; // URL path
  title: string; // HTML title
  description?: string; // Meta description
  keywords?: string[]; // SEO keywords
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

// Component System
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
    container?: string; // Parent container ID
  };
  visibility: {
    desktop: boolean;
    tablet: boolean;
    mobile: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

type ComponentType = 
  | 'hero'
  | 'navigation'
  | 'footer'
  | 'text'
  | 'image'
  | 'button'
  | 'card'
  | 'grid'
  | 'form'
  | 'contact-form'
  | 'gallery'
  | 'testimonial'
  | 'pricing-table'
  | 'accordion'
  | 'tabs'
  | 'modal'
  | 'video'
  | 'map'
  | 'social-links'
  | 'divider'
  | 'spacer'
  | 'container'
  | 'column'
  | 'custom';

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

// Component Library
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
  schema: ComponentSchema; // For form generation
  createdAt: string;
}

interface ComponentSchema {
  props: {
    [key: string]: {
      type: 'string' | 'number' | 'boolean' | 'color' | 'image' | 'select' | 'textarea';
      label: string;
      default?: any;
      options?: string[]; // For select type
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
  preview: string; // Base64 image or URL
  tags: string[];
  industry?: string[]; // Suitable for which types of websites
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

// Project Settings
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
  sameAs?: string[]; // Social media URLs
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
    ttl: number; // Time to live in seconds
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
    password: string; // Hashed
    hint?: string;
  };
}

interface IntegrationSettings {
  claude: {
    apiKey?: string; // Encrypted
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
    apiKey?: string; // Encrypted
    fromEmail: string;
    fromName: string;
  };
  forms: {
    captcha: {
      enabled: boolean;
      provider: 'recaptcha' | 'hcaptcha';
      siteKey?: string;
      secretKey?: string; // Encrypted
    };
    notifications: {
      email: boolean;
      webhook?: string;
    };
  };
  ecommerce?: {
    provider: 'stripe' | 'paypal' | 'square';
    apiKey?: string; // Encrypted
    currency: string;
    taxEnabled: boolean;
    shippingEnabled: boolean;
  };
}

// Version History
interface VersionHistory {
  id: string;
  version: string; // Semantic version (1.0.0)
  description: string;
  changes: ChangeRecord[];
  author: string;
  createdAt: string;
  snapshot: Partial<WebsiteProject>; // Full state backup
}

interface ChangeRecord {
  type: 'component_added' | 'component_removed' | 'component_modified' | 'page_added' | 'page_removed' | 'settings_changed' | 'theme_changed';
  target: string; // ID of affected item
  description: string;
  before?: any; // Previous state
  after?: any; // New state
}

// Claude AI Integration Data
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
    confidence: number; // 0-1
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
  data?: any; // Specific data for the suggestion
}

// File Storage References (for images, etc.)
interface AssetFile {
  id: string;
  projectId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number; // bytes
  url: string; // Local or CDN URL
  thumbnails?: {
    small: string;
    medium: string;
    large: string;
  };
  alt?: string;
  tags?: string[];
  createdAt: string;
  usedIn: string[]; // Component IDs that use this asset
}

// Example JSON Database Structure
interface JSONDatabase {
  projects: { [projectId: string]: WebsiteProject };
  interactions: { [interactionId: string]: ClaudeInteraction };
  assets: { [assetId: string]: AssetFile };
  templates: { [templateId: string]: ComponentTemplate };
  presets: { [presetId: string]: PresetComponent };
  users: { [userId: string]: UserProfile };
  metadata: DatabaseMetadata;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  subscription: {
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'cancelled' | 'expired';
    expiresAt?: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    defaultProjectType: string;
    aiAssistanceLevel: 'minimal' | 'moderate' | 'maximum';
  };
  projects: string[]; // Project IDs
  createdAt: string;
  lastLoginAt: string;
}

interface DatabaseMetadata {
  version: string;
  lastBackup: string;
  totalProjects: number;
  totalUsers: number;
  features: {
    claudeIntegration: boolean;
    ecommerce: boolean;
    analytics: boolean;
  };
}

// Example Usage and Storage Operations
class JSONWebsiteDatabase {
  private data: JSONDatabase;
  
  constructor() {
    this.data = this.loadFromFile() || this.createEmpty();
  }

  // Project Operations
  createProject(metadata: ProjectMetadata): string {
    const id = this.generateId();
    const project: WebsiteProject = {
      id,
      metadata,
      design: this.getDefaultDesign(),
      pages: [this.createDefaultHomePage()],
      components: { custom: [], presets: [], templates: [] },
      settings: this.getDefaultSettings(),
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.data.projects[id] = project;
    this.saveToFile();
    return id;
  }

  updateProject(id: string, updates: Partial<WebsiteProject>): void {
    if (this.data.projects[id]) {
      this.data.projects[id] = {
        ...this.data.projects[id],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveToFile();
    }
  }

  getProject(id: string): WebsiteProject | null {
    return this.data.projects[id] || null;
  }

  // Component Operations
  addComponent(projectId: string, pageId: string, component: ComponentInstance): void {
    const project = this.data.projects[projectId];
    if (project) {
      const page = project.pages.find(p => p.id === pageId);
      if (page) {
        page.components.push(component);
        this.updateProject(projectId, project);
      }
    }
  }

  updateComponent(projectId: string, pageId: string, componentId: string, updates: Partial<ComponentInstance>): void {
    const project = this.data.projects[projectId];
    if (project) {
      const page = project.pages.find(p => p.id === pageId);
      if (page) {
        const componentIndex = page.components.findIndex(c => c.id === componentId);
        if (componentIndex !== -1) {
          page.components[componentIndex] = {
            ...page.components[componentIndex],
            ...updates,
            updatedAt: new Date().toISOString()
          };
          this.updateProject(projectId, project);
        }
      }
    }
  }

  // Claude Interaction Logging
  logClaudeInteraction(interaction: ClaudeInteraction): void {
    this.data.interactions[interaction.id] = interaction;
    this.saveToFile();
  }

  // Asset Management
  addAsset(asset: AssetFile): void {
    this.data.assets[asset.id] = asset;
    this.saveToFile();
  }

  // File Operations
  private loadFromFile(): JSONDatabase | null {
    try {
      // In a real implementation, this would read from a file
      // For now, return null to create empty database
      return null;
    } catch (error) {
      console.error('Failed to load database:', error);
      return null;
    }
  }

  private saveToFile(): void {
    try {
      // In a real implementation, this would save to a file
      // Using localStorage for browser demo
      if (typeof window !== 'undefined') {
        localStorage.setItem('claude-website-builder-db', JSON.stringify(this.data));
      }
    } catch (error) {
      console.error('Failed to save database:', error);
    }
  }

  private createEmpty(): JSONDatabase {
    return {
      projects: {},
      interactions: {},
      assets: {},
      templates: {},
      presets: {},
      users: {},
      metadata: {
        version: '1.0.0',
        lastBackup: new Date().toISOString(),
        totalProjects: 0,
        totalUsers: 0,
        features: {
          claudeIntegration: true,
          ecommerce: false,
          analytics: false
        }
      }
    };
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getDefaultDesign(): DesignSystem {
    // Return default theme and design settings
    return {
      theme: {
        id: 'default',
        name: 'Default',
        mode: 'light',
        colors: {
          primary: '#3b82f6',
          secondary: '#8b5cf6',
          accent: '#f59e0b',
          background: '#ffffff',
          surface: '#f8fafc',
          text: '#1f2937',
          textSecondary: '#6b7280',
          border: '#e5e7eb',
          error: '#ef4444',
          success: '#10b981',
          warning: '#f59e0b'
        }
      },
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter',
        fontSizes: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem'
        },
        fontWeights: {
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700
        },
        lineHeights: {
          tight: 1.25,
          normal: 1.5,
          relaxed: 1.75
        }
      },
      spacing: {
        scale: 1,
        baseUnit: 'rem',
        containerMaxWidth: '1200px',
        sectionPadding: '4rem 0'
      },
      animations: {
        duration: 'normal',
        easing: 'ease-out',
        enableTransitions: true,
        enableHoverEffects: true
      }
    };
  }

  private getDefaultSettings(): ProjectSettings {
    // Return default project settings
    return {
      general: {
        siteName: 'My Website',
        timezone: 'UTC',
        language: 'en',
        rtl: false,
        maintenance: {
          enabled: false
        }
      },
      seo: {
        sitemap: {
          enabled: true,
          frequency: 'weekly',
          priority: 0.8
        },
        robots: {
          index: true,
          follow: true
        },
        structuredData: {}
      },
      analytics: {},
      performance: {
        optimization: {
          minifyCSS: true,
          minifyJS: true,
          compressImages: true,
          lazyLoading: true,
          preloadFonts: true
        },
        caching: {
          enabled: true,
          ttl: 3600
        },
        cdn: {
          enabled: false
        }
      },
      security: {
        ssl: {
          enforceHTTPS: true,
          hstsEnabled: true
        },
        headers: {
          xFrameOptions: 'SAMEORIGIN',
          xContentTypeOptions: true
        }
      },
      integrations: {
        claude: {
          model: 'claude-3-sonnet-20240229',
          enabled: true,
          features: {
            contentGeneration: true,
            designSuggestions: true,
            seoOptimization: true,
            accessibility: true
          }
        },
        email: {
          fromEmail: 'noreply@example.com',
          fromName: 'Website Builder'
        },
        forms: {
          captcha: {
            enabled: false,
            provider: 'recaptcha'
          },
          notifications: {
            email: true
          }
        }
      }
    };
  }

  private createDefaultHomePage(): Page {
    return {
      id: this.generateId(),
      name: 'Home',
      slug: '/',
      title: 'Home',
      components: [],
      seo: {
        metaTitle: 'Welcome to My Website',
        metaDescription: 'A beautiful website built with Claude AI'
      },
      settings: {
        layout: 'full-width',
        header: {
          show: true,
          transparent: false,
          sticky: true
        },
        footer: {
          show: true
        }
      },
      isHomePage: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}

export { JSONWebsiteDatabase, type WebsiteProject, type ComponentInstance, type ClaudeInteraction };