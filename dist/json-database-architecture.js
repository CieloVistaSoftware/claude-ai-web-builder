"use strict";
// JSON Database Schema for Claude Website Builder
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONWebsiteDatabase = void 0;
// Example Usage and Storage Operations
class JSONWebsiteDatabase {
    constructor() {
        Object.defineProperty(this, "data", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.data = this.loadFromFile() || this.createEmpty();
    }
    // Project Operations
    createProject(metadata) {
        const id = this.generateId();
        const project = {
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
    updateProject(id, updates) {
        if (this.data.projects[id]) {
            this.data.projects[id] = {
                ...this.data.projects[id],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.saveToFile();
        }
    }
    getProject(id) {
        return this.data.projects[id] || null;
    }
    // Component Operations
    addComponent(projectId, pageId, component) {
        const project = this.data.projects[projectId];
        if (project) {
            const page = project.pages.find(p => p.id === pageId);
            if (page) {
                page.components.push(component);
                this.updateProject(projectId, project);
            }
        }
    }
    updateComponent(projectId, pageId, componentId, updates) {
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
    logClaudeInteraction(interaction) {
        this.data.interactions[interaction.id] = interaction;
        this.saveToFile();
    }
    // Asset Management
    addAsset(asset) {
        this.data.assets[asset.id] = asset;
        this.saveToFile();
    }
    // File Operations
    loadFromFile() {
        try {
            // In a real implementation, this would read from a file
            // For now, return null to create empty database
            return null;
        }
        catch (error) {
            console.error('Failed to load database:', error);
            return null;
        }
    }
    saveToFile() {
        try {
            // In a real implementation, this would save to a file
            // Using localStorage for browser demo
            if (typeof window !== 'undefined') {
                localStorage.setItem('claude-website-builder-db', JSON.stringify(this.data));
            }
        }
        catch (error) {
            console.error('Failed to save database:', error);
        }
    }
    createEmpty() {
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
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    getDefaultDesign() {
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
    getDefaultSettings() {
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
    createDefaultHomePage() {
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
exports.JSONWebsiteDatabase = JSONWebsiteDatabase;
//# sourceMappingURL=json-database-architecture.js.map