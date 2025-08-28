"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
// Color generation utilities
const hexToHsl = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    }
    else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
            default: h = 0;
        }
        h /= 6;
    }
    return [h * 360, s * 100, l * 100];
};
const hslToHex = (h, s, l) => {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
    }
    else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
    }
    else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
    }
    else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
    }
    else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
    }
    else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
};
const generateColorScheme = (primaryColor, isDark) => {
    const [h, s, l] = hexToHsl(primaryColor);
    // Generate secondary color (complementary + slight shift)
    const secondaryHue = (h + 150) % 360;
    const secondary = hslToHex(secondaryHue, Math.max(s * 0.8, 40), isDark ? l * 1.2 : l * 0.9);
    // Generate accent color (triadic)
    const accentHue = (h + 120) % 360;
    const accent = hslToHex(accentHue, Math.max(s * 0.9, 50), isDark ? l * 1.1 : l * 1.1);
    return {
        primary: primaryColor,
        secondary,
        accent,
        background: isDark ? '#0a0a0a' : '#ffffff',
        surface: isDark ? '#1a1a1a' : '#f8fafc',
        text: isDark ? '#ffffff' : '#1a1a1a',
        textSecondary: isDark ? '#a1a1aa' : '#64748b',
        border: isDark ? '#2a2a2a' : '#e2e8f0',
        glass: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.7)'
    };
};
const EnhancedClaudeBuilder = () => {
    const [currentTheme, setCurrentTheme] = (0, react_1.useState)({
        id: 'dark-auto',
        name: 'Auto Dark',
        colors: generateColorScheme('#6366f1', true),
        mode: 'dark'
    });
    const [layoutType, setLayoutType] = (0, react_1.useState)('left-nav');
    const [currentPage, setCurrentPage] = (0, react_1.useState)('demo');
    const [isNavOpen, setIsNavOpen] = (0, react_1.useState)(true);
    const [primaryColor, setPrimaryColor] = (0, react_1.useState)('#6366f1');
    const [isDarkMode, setIsDarkMode] = (0, react_1.useState)(true);
    const [isCustomizing, setIsCustomizing] = (0, react_1.useState)(false);
    const [aiSuggestions, setAiSuggestions] = (0, react_1.useState)([]);
    const [userPrompt, setUserPrompt] = (0, react_1.useState)('');
    const [websiteName, setWebsiteName] = (0, react_1.useState)('');
    const [websiteType, setWebsiteType] = (0, react_1.useState)('');
    const [isClaudeThinking, setIsClaudeThinking] = (0, react_1.useState)(false);
    const [generatedWebsite, setGeneratedWebsite] = (0, react_1.useState)({
        layout: 'left-nav',
        content: '',
        header: '',
        nav: '',
        main: '',
        footer: '',
        theme: {
            id: 'dark-auto',
            name: 'Auto Dark',
            colors: generateColorScheme('#6366f1', true),
            mode: 'dark'
        }
    });
    // Apply theme to CSS variables
    (0, react_1.useEffect)(() => {
        const root = document.documentElement;
        Object.entries(currentTheme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
        });
        // Add glass morphism CSS
        const style = document.createElement('style');
        style.textContent = `
      .glass-card {
        background: ${currentTheme.colors.glass};
        backdrop-filter: blur(10px);
        border: 1px solid ${currentTheme.colors.border};
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .glass-card:hover {
        background: ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)'};
        transform: translateY(-2px);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }
      .glass-sweep {
        position: relative;
        overflow: hidden;
      }
      .glass-sweep::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.6)'}, transparent);
        transition: left 0.5s;
      }
      .glass-sweep:hover::before {
        left: 100%;
      }
      .layout-${layoutType} {
        display: grid;
        min-height: 100vh;
      }
      .layout-left-nav {
        grid-template-columns: ${isNavOpen ? '280px' : '80px'} 1fr;
        grid-template-rows: auto 1fr auto;
        grid-template-areas:
          "nav header"
          "nav main"
          "nav footer";
      }
      .layout-right-nav {
        grid-template-columns: 1fr ${isNavOpen ? '280px' : '80px'};
        grid-template-rows: auto 1fr auto;
        grid-template-areas:
          "header nav"
          "main nav"
          "footer nav";
      }
      .layout-top-nav {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto 1fr auto;
        grid-template-areas:
          "nav"
          "header"
          "main"
          "footer";
      }
      .nav-area { grid-area: nav; }
      .header-area { grid-area: header; }
      .main-area { grid-area: main; }
      .footer-area { grid-area: footer; }
    `;
        const existingStyle = document.getElementById('dynamic-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
        style.id = 'dynamic-styles';
        document.head.appendChild(style);
        return () => {
            const styleToRemove = document.getElementById('dynamic-styles');
            if (styleToRemove) {
                styleToRemove.remove();
            }
        };
    }, [currentTheme, layoutType, isNavOpen, isDarkMode]);
    const handlePrimaryColorChange = (color) => {
        setPrimaryColor(color);
        const newColors = generateColorScheme(color, isDarkMode);
        setCurrentTheme(prev => ({
            ...prev,
            colors: newColors
        }));
    };
    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        const newColors = generateColorScheme(primaryColor, newDarkMode);
        setCurrentTheme(prev => ({
            ...prev,
            mode: newDarkMode ? 'dark' : 'light',
            colors: newColors
        }));
    };
    const callClaudeAPI = async (prompt) => {
        setIsClaudeThinking(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        const baseResponses = {
            'make this more modern': [
                "I suggest using a cleaner, minimalist design with more white space.",
                "Consider using micro-interactions and smooth transitions.",
                "Glass morphism effects would add a contemporary touch."
            ],
            'improve design': [
                "Your current color scheme works well with the glass morphism effects.",
                "Consider adding subtle animations to enhance user engagement.",
                "The dark mode provides excellent contrast for professional use."
            ],
            'change layout': [
                `I've analyzed your ${websiteType} layout preferences.`,
                "The current layout provides optimal navigation flow.",
                "Consider testing different navigation positions for best user experience."
            ],
            'add section': [
                "I'll help you add sections that match your website's purpose.",
                "We can incorporate dynamic content areas.",
                "Let's maintain the glass morphism design language."
            ],
            'default': [
                `Based on your ${websiteType} website "${websiteName}", I recommend:`,
                "The current glass design aesthetic is perfect for modern web applications.",
                "Your color scheme creates excellent visual hierarchy.",
                "Consider adding more interactive elements for better user engagement."
            ]
        };
        // Enhanced response logic to handle more variations of prompts
        const promptLower = prompt.toLowerCase();
        const key = Object.keys(baseResponses).find(k => promptLower.includes(k) && k !== 'default') || 'default';
        // Combine template response with context-aware suggestions
        const contextResponse = [
            ...baseResponses[key],
            websiteType ? `I notice this is a ${websiteType} website. Would you like specific suggestions for that type?` : null,
            currentTheme.mode === 'dark' ? "The dark theme looks great! We can adjust the contrast if needed." : null,
        ].filter(Boolean);
        setIsClaudeThinking(false);
        return contextResponse;
    };
    const handleAiPrompt = async () => {
        if (!userPrompt.trim())
            return;
        setAiSuggestions(['🤖 Claude is thinking...']);
        const suggestions = await callClaudeAPI(userPrompt);
        setAiSuggestions(suggestions);
        setUserPrompt('');
    };
    const handleGetStarted = () => {
        setCurrentPage('getStarted');
    };
    const handleStartBuilding = () => {
        if (websiteName && websiteType) {
            setCurrentPage('builder');
            setAiSuggestions([
                `Welcome to ${websiteName}! I'm Claude, your AI design assistant.`,
                `I see you're creating a ${websiteType} website. I'll help optimize the layout and design for your specific needs.`,
                `The current theme is ${isDarkMode ? 'dark' : 'light'} mode with a ${layoutType.replace('-', ' ')} layout.`,
                "Try asking me things like:",
                "- 'Add a hero section'",
                "- 'Improve the color scheme'",
                "- 'Change layout'",
                "- 'Add more sections'"
            ]);
        }
    };
    // Navigation Component
    const Navigation = () => ((0, jsx_runtime_1.jsx)("nav", { className: "nav-area glass-card p-4 transition-all duration-300", style: {
            backgroundColor: currentTheme.colors.surface,
            borderRight: layoutType === 'right-nav' ? 'none' : `1px solid ${currentTheme.colors.border}`,
            borderLeft: layoutType === 'right-nav' ? `1px solid ${currentTheme.colors.border}` : 'none',
            borderBottom: layoutType === 'top-nav' ? `1px solid ${currentTheme.colors.border}` : 'none'
        }, children: layoutType === 'top-nav' ? (
        // Top Navigation Layout
        (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Wand2, { style: { color: currentTheme.colors.primary }, size: 24 }), (0, jsx_runtime_1.jsx)("span", { className: "font-bold text-lg", children: "Claude Builder" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setCurrentPage('demo'), className: `px-3 py-2 rounded-lg transition-colors ${currentPage === 'demo' ? 'glass-card' : ''}`, style: currentPage === 'demo' ? { color: currentTheme.colors.primary } : {}, children: "Demo" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setCurrentPage('getStarted'), className: `px-3 py-2 rounded-lg transition-colors ${currentPage === 'getStarted' ? 'glass-card' : ''}`, style: currentPage === 'getStarted' ? { color: currentTheme.colors.primary } : {}, children: "Get Started" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setCurrentPage('builder'), className: `px-3 py-2 rounded-lg transition-colors ${currentPage === 'builder' ? 'glass-card' : ''}`, style: currentPage === 'builder' ? { color: currentTheme.colors.primary } : {}, children: "Builder" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(LayoutSelector, {}), (0, jsx_runtime_1.jsx)(ColorPicker, {}), (0, jsx_runtime_1.jsx)("button", { onClick: toggleDarkMode, className: "p-2 rounded-lg glass-card transition-colors", children: isDarkMode ? (0, jsx_runtime_1.jsx)(lucide_react_1.Sun, { size: 20 }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Moon, { size: 20 }) })] })] })) : (
        // Side Navigation Layout
        (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col h-full", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-8", children: [isNavOpen && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Wand2, { style: { color: currentTheme.colors.primary }, size: 24 }), (0, jsx_runtime_1.jsx)("span", { className: "font-bold text-lg", children: "Claude Builder" })] })), (0, jsx_runtime_1.jsx)("button", { onClick: () => setIsNavOpen(!isNavOpen), className: "p-2 rounded-lg glass-card transition-colors", children: isNavOpen ? (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 20 }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Menu, { size: 20 }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 flex-1", children: [(0, jsx_runtime_1.jsx)(NavButton, { icon: (0, jsx_runtime_1.jsx)(lucide_react_1.LayoutDashboard, { size: 20 }), label: "Demo", active: currentPage === 'demo', onClick: () => setCurrentPage('demo') }), (0, jsx_runtime_1.jsx)(NavButton, { icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { size: 20 }), label: "Get Started", active: currentPage === 'getStarted', onClick: () => setCurrentPage('getStarted') }), (0, jsx_runtime_1.jsx)(NavButton, { icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Code, { size: 20 }), label: "Builder", active: currentPage === 'builder', onClick: () => setCurrentPage('builder') })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-auto space-y-4", children: [(0, jsx_runtime_1.jsx)(LayoutSelector, {}), (0, jsx_runtime_1.jsx)(ColorPicker, {}), (0, jsx_runtime_1.jsxs)("button", { onClick: toggleDarkMode, className: "w-full p-3 rounded-lg glass-card transition-colors flex items-center gap-3", children: [isDarkMode ? (0, jsx_runtime_1.jsx)(lucide_react_1.Sun, { size: 20 }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Moon, { size: 20 }), isNavOpen && (0, jsx_runtime_1.jsx)("span", { children: isDarkMode ? 'Light Mode' : 'Dark Mode' })] })] })] })) }));
    const NavButton = ({ icon, label, active, onClick }) => ((0, jsx_runtime_1.jsxs)("button", { onClick: onClick, className: `w-full p-3 rounded-lg transition-colors flex items-center gap-3 ${active ? 'glass-card' : 'hover:glass-card'}`, style: active ? {
            backgroundColor: currentTheme.colors.primary + '20',
            color: currentTheme.colors.primary
        } : {}, children: [icon, isNavOpen && (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: label })] }));
    const LayoutSelector = () => ((0, jsx_runtime_1.jsx)("div", { className: `${isNavOpen || layoutType === 'top-nav' ? 'w-full' : 'w-auto'}`, children: isNavOpen || layoutType === 'top-nav' ? ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium mb-2", children: "Layout" }), (0, jsx_runtime_1.jsxs)("select", { value: layoutType, onChange: (e) => setLayoutType(e.target.value), className: "w-full p-2 rounded-lg glass-card border-none", style: {
                        backgroundColor: currentTheme.colors.background,
                        color: currentTheme.colors.text
                    }, children: [(0, jsx_runtime_1.jsx)("option", { value: "left-nav", children: "Left Navigation" }), (0, jsx_runtime_1.jsx)("option", { value: "right-nav", children: "Right Navigation" }), (0, jsx_runtime_1.jsx)("option", { value: "top-nav", children: "Top Navigation" })] })] })) : ((0, jsx_runtime_1.jsx)("button", { onClick: () => {
                const layouts = ['left-nav', 'right-nav', 'top-nav'];
                const currentIndex = layouts.indexOf(layoutType);
                const nextIndex = (currentIndex + 1) % layouts.length;
                setLayoutType(layouts[nextIndex]);
            }, className: "p-2 rounded-lg glass-card transition-colors", title: "Change Layout", children: layoutType === 'left-nav' ? (0, jsx_runtime_1.jsx)(lucide_react_1.PanelLeft, { size: 20 }) :
                layoutType === 'right-nav' ? (0, jsx_runtime_1.jsx)(lucide_react_1.PanelRight, { size: 20 }) :
                    (0, jsx_runtime_1.jsx)(lucide_react_1.PanelTop, { size: 20 }) })) }));
    const ColorPicker = () => ((0, jsx_runtime_1.jsx)("div", { className: `${isNavOpen || layoutType === 'top-nav' ? 'w-full' : 'w-auto'}`, children: isNavOpen || layoutType === 'top-nav' ? ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium mb-2", children: "Primary Color" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "color", value: primaryColor, onChange: (e) => handlePrimaryColorChange(e.target.value), className: "w-10 h-10 rounded-lg border-none cursor-pointer" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 text-sm", children: [(0, jsx_runtime_1.jsx)("div", { style: { color: currentTheme.colors.primary }, children: "\u25CF Primary" }), (0, jsx_runtime_1.jsx)("div", { style: { color: currentTheme.colors.secondary }, children: "\u25CF Secondary" }), (0, jsx_runtime_1.jsx)("div", { style: { color: currentTheme.colors.accent }, children: "\u25CF Accent" })] })] })] })) : ((0, jsx_runtime_1.jsx)("input", { type: "color", value: primaryColor, onChange: (e) => handlePrimaryColorChange(e.target.value), className: "w-10 h-10 rounded-lg border-none cursor-pointer", title: "Change Primary Color" })) }));
    // Header Component
    const Header = () => ((0, jsx_runtime_1.jsx)("header", { className: "header-area glass-card p-6", style: {
            backgroundColor: currentTheme.colors.surface,
            borderBottom: `1px solid ${currentTheme.colors.border}`
        }, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h1", { className: "text-3xl font-bold mb-2", children: [currentPage === 'demo' && 'AI Website Builder Demo', currentPage === 'getStarted' && 'Get Started', currentPage === 'builder' && `Building: ${websiteName || 'Your Website'}`] }), (0, jsx_runtime_1.jsxs)("p", { style: { color: currentTheme.colors.textSecondary }, children: [currentPage === 'demo' && 'Experience the future of web development with Claude AI', currentPage === 'getStarted' && 'Create your professional website in minutes', currentPage === 'builder' && `${websiteType} • Glass Design • ${currentTheme.mode} Mode`] })] }), layoutType !== 'top-nav' && ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-3", children: (0, jsx_runtime_1.jsx)("button", { onClick: () => setIsCustomizing(!isCustomizing), className: "p-3 rounded-lg glass-card transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { size: 20 }) }) }))] }) }));
    // Main Content Components
    const DemoPage = () => ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-8", children: [(0, jsx_runtime_1.jsx)("section", { className: "glass-card glass-sweep p-8 rounded-2xl", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-4xl", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent", children: "Build Websites with AI" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xl mb-8", style: { color: currentTheme.colors.textSecondary }, children: "Create professional websites using natural language. Just tell Claude what you want, and watch your site come to life with stunning glass morphism design." }), (0, jsx_runtime_1.jsxs)("button", { onClick: handleGetStarted, className: "px-8 py-4 rounded-xl font-semibold transition-all duration-300 glass-card glass-sweep flex items-center gap-3", style: {
                                backgroundColor: currentTheme.colors.primary,
                                color: currentTheme.colors.background
                            }, children: ["Get Started", (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { size: 24 })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [
                    { icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Wand2, { size: 28 }), title: 'AI-Powered Design', desc: 'Claude generates beautiful components instantly' },
                    { icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { size: 28 }), title: 'Real-time Preview', desc: 'See changes applied instantly with glass effects' },
                    { icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Palette, { size: 28 }), title: 'Smart Color System', desc: 'Automatic color harmony generation' },
                    { icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Download, { size: 28 }), title: 'Export Ready', desc: 'Download clean, production-ready code' }
                ].map((feature, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "glass-card glass-sweep p-6 rounded-xl", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 rounded-xl mb-4 flex items-center justify-center", style: { backgroundColor: currentTheme.colors.primary + '20' }, children: (0, jsx_runtime_1.jsx)("div", { style: { color: currentTheme.colors.primary }, children: feature.icon }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold mb-3", children: feature.title }), (0, jsx_runtime_1.jsx)("p", { style: { color: currentTheme.colors.textSecondary }, children: feature.desc })] }, index))) }), (0, jsx_runtime_1.jsxs)("section", { className: "glass-card p-8 rounded-2xl", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold mb-6", children: "Live Color System" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 rounded-xl", style: { backgroundColor: currentTheme.colors.primary }, children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold text-white", children: "Primary Color" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/80", children: currentTheme.colors.primary })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 rounded-xl", style: { backgroundColor: currentTheme.colors.secondary }, children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold text-white", children: "Secondary Color" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/80", children: currentTheme.colors.secondary })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 rounded-xl", style: { backgroundColor: currentTheme.colors.accent }, children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-semibold text-white", children: "Accent Color" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/80", children: currentTheme.colors.accent })] })] })] })] }));
    const websiteTypes = [
        { id: 'portfolio', label: 'Portfolio' },
        { id: 'business', label: 'Business Website' },
        { id: 'ecommerce', label: 'E-commerce Store' },
        { id: 'blog', label: 'Blog' },
        { id: 'landing', label: 'Landing Page' },
        { id: 'saas', label: 'SaaS Platform' }
    ];
    const GetStartedPage = () => ((0, jsx_runtime_1.jsx)("div", { className: "max-w-6xl mx-auto p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "glass-card p-8 rounded-2xl", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-bold mb-6", children: "Create Your Website" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium mb-2", children: "Website Name *" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: websiteName, onChange: (0, react_1.useCallback)((e) => {
                                                const newValue = e.target.value;
                                                requestAnimationFrame(() => {
                                                    setWebsiteName(newValue);
                                                });
                                            }, []), placeholder: "e.g., Acme Inc, My Portfolio...", className: "w-full p-3 rounded-lg glass-card border-none", style: {
                                                backgroundColor: currentTheme.colors.background,
                                                color: currentTheme.colors.text
                                            } })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium mb-2", children: "Website Type *" }), (0, jsx_runtime_1.jsxs)("select", { value: websiteType, onChange: (e) => setWebsiteType(e.target.value), className: "w-full p-3 rounded-lg glass-card border-none", style: {
                                                backgroundColor: currentTheme.colors.background,
                                                color: currentTheme.colors.text
                                            }, children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "Select a type..." }), websiteTypes.map(type => ((0, jsx_runtime_1.jsx)("option", { value: type.id, children: type.label }, type.id)))] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium mb-2", children: "Layout Style" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-3 gap-4", children: ['left-nav', 'right-nav', 'top-nav'].map(layout => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => setLayoutType(layout), className: `p-4 rounded-lg glass-card flex flex-col items-center gap-2 ${layoutType === layout ? 'ring-2' : ''}`, style: {
                                                    backgroundColor: currentTheme.colors.surface,
                                                    borderColor: currentTheme.colors.border,
                                                    ...(layoutType === layout && {
                                                        ringColor: currentTheme.colors.primary
                                                    })
                                                }, children: [layout === 'left-nav' && (0, jsx_runtime_1.jsx)(lucide_react_1.PanelLeft, { size: 24 }), layout === 'right-nav' && (0, jsx_runtime_1.jsx)(lucide_react_1.PanelRight, { size: 24 }), layout === 'top-nav' && (0, jsx_runtime_1.jsx)(lucide_react_1.PanelTop, { size: 24 }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: layout === 'left-nav' ? 'Left Nav' :
                                                            layout === 'right-nav' ? 'Right Nav' : 'Top Nav' })] }, layout))) })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: handleStartBuilding, disabled: !websiteName || !websiteType, className: "w-full p-4 rounded-lg glass-card glass-sweep flex items-center justify-center gap-2", style: {
                                        backgroundColor: currentTheme.colors.primary,
                                        color: currentTheme.colors.background,
                                        opacity: (!websiteName || !websiteType) ? 0.5 : 1
                                    }, children: ["Create Website", (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { size: 20 })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "glass-card p-6 rounded-xl", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-xl font-bold mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MessageCircle, { size: 20, style: { color: currentTheme.colors.primary } }), "Claude AI Assistant"] }), (0, jsx_runtime_1.jsx)("div", { className: "min-h-[200px] mb-4", style: { color: currentTheme.colors.textSecondary }, children: aiSuggestions.length > 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: aiSuggestions.map((suggestion, i) => ((0, jsx_runtime_1.jsx)("p", { children: suggestion }, i))) })) : ((0, jsx_runtime_1.jsx)("p", { children: "Fill in your website details and I'll help you build something amazing!" })) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: userPrompt, onChange: (e) => setUserPrompt(e.target.value), placeholder: "Ask Claude anything...", className: "flex-1 p-3 rounded-lg glass-card border-none", style: {
                                                backgroundColor: currentTheme.colors.background,
                                                color: currentTheme.colors.text
                                            } }), (0, jsx_runtime_1.jsx)("button", { onClick: handleAiPrompt, disabled: !userPrompt.trim(), className: "p-3 rounded-lg glass-card", style: {
                                                backgroundColor: currentTheme.colors.primary,
                                                color: currentTheme.colors.background,
                                                opacity: !userPrompt.trim() ? 0.5 : 1
                                            }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.MessageCircle, { size: 20 }) })] })] })] })] }) }));
    // Footer Component
    const Footer = () => ((0, jsx_runtime_1.jsx)("footer", { className: "footer-area glass-card p-6 text-center", style: {
            backgroundColor: currentTheme.colors.surface,
            borderTop: `1px solid ${currentTheme.colors.border}`
        }, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("p", { style: { color: currentTheme.colors.textSecondary }, children: "\u00A9 2025 Claude Website Builder. Built with AI assistance." }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-4", children: (0, jsx_runtime_1.jsxs)("span", { className: "text-sm", style: { color: currentTheme.colors.textSecondary }, children: ["Layout: ", layoutType.replace('-', ' '), " \u2022 Mode: ", isDarkMode ? 'Dark' : 'Light'] }) })] }) }));
    const BuilderPage = () => {
        const [siteChat, setSiteChat] = (0, react_1.useState)('');
        return ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "lg:col-span-2 glass-card p-8 rounded-2xl", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold mb-6", children: "Website Preview" }), (0, jsx_runtime_1.jsx)("div", { className: `glass-card p-6 rounded-xl layout-${layoutType}`, style: { backgroundColor: currentTheme.colors.background }, children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("header", { className: "glass-card p-4 rounded-lg header-area", children: (0, jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: {
                                                __html: generatedWebsite.header || `<h3 class="font-bold text-lg">${websiteName}</h3>`
                                            } }) }), (0, jsx_runtime_1.jsx)("nav", { className: "glass-card p-4 rounded-lg nav-area", children: (0, jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: {
                                                __html: generatedWebsite.nav || `
                    <div class="flex gap-4 text-sm">
                      <span>Home</span>
                      <span>About</span>
                      <span>Services</span>
                      <span>Contact</span>
                    </div>
                  `
                                            } }) }), (0, jsx_runtime_1.jsx)("main", { className: "glass-card p-6 rounded-lg main-area", children: (0, jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: {
                                                __html: generatedWebsite.main || `
                    <h2 class="text-2xl font-bold mb-4">Welcome to ${websiteName}</h2>
                    <p class="mb-4">Your ${websiteType} website with beautiful glass morphism design.</p>
                    <button class="px-6 py-3 rounded-lg glass-card glass-sweep">Get Started</button>
                  `
                                            } }) }), (0, jsx_runtime_1.jsx)("footer", { className: "glass-card p-4 rounded-lg footer-area", children: (0, jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: {
                                                __html: generatedWebsite.footer || `
                    <p class="text-sm text-center">© 2025 ${websiteName}. Built with Claude AI.</p>
                  `
                                            } }) }), (0, jsx_runtime_1.jsx)("div", { className: "glass-card p-4 rounded-lg chat-area mt-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: siteChat, onChange: (e) => setSiteChat(e.target.value), className: "flex-1 p-2 rounded glass-card border-none", placeholder: "Ask Claude about this website...", style: {
                                                        backgroundColor: currentTheme.colors.background,
                                                        color: currentTheme.colors.text
                                                    } }), (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                                                        if (siteChat.trim()) {
                                                            handleAiPrompt();
                                                            setSiteChat('');
                                                        }
                                                    }, className: "px-4 py-2 rounded glass-card", style: {
                                                        backgroundColor: currentTheme.colors.primary,
                                                        color: currentTheme.colors.background
                                                    }, children: "Ask Claude" })] }) })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "glass-card p-6 rounded-2xl", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-xl font-bold mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MessageCircle, { style: { color: currentTheme.colors.secondary } }), "Claude AI Assistant"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("textarea", { value: userPrompt, onChange: (e) => setUserPrompt(e.target.value), placeholder: "Ask Claude to improve your website...", className: "w-full p-3 rounded-lg glass-card border-none resize-none", rows: 3, style: {
                                                backgroundColor: currentTheme.colors.background,
                                                color: currentTheme.colors.text
                                            } }), (0, jsx_runtime_1.jsx)("button", { onClick: handleAiPrompt, disabled: !userPrompt.trim() || isClaudeThinking, className: "w-full py-3 rounded-lg font-medium transition-all disabled:opacity-50 glass-card glass-sweep", style: {
                                                backgroundColor: currentTheme.colors.secondary,
                                                color: currentTheme.colors.background
                                            }, children: isClaudeThinking ? '🤖 Claude is thinking...' : 'Ask Claude AI' }), aiSuggestions.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium", children: "Claude's Response:" }), aiSuggestions.map((suggestion, index) => ((0, jsx_runtime_1.jsx)("div", { className: "p-3 rounded-lg glass-card text-sm", style: {
                                                        borderLeft: `3px solid ${currentTheme.colors.accent}`
                                                    }, children: suggestion }, index)))] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "glass-card p-6 rounded-2xl", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-bold mb-4", children: "Quick Actions" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: [
                                        'Add a hero section',
                                        'Create a contact form',
                                        'Improve the design',
                                        'Add more sections'
                                    ].map((action, index) => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => setUserPrompt(action), className: "w-full p-3 rounded-lg text-left transition-all glass-card glass-sweep", style: { backgroundColor: currentTheme.colors.background }, children: ["+ ", action] }, index))) })] })] })] }));
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: `layout-${layoutType} transition-all duration-300`, style: {
            backgroundColor: currentTheme.colors.background,
            color: currentTheme.colors.text,
            minHeight: '100vh'
        }, children: [(0, jsx_runtime_1.jsx)(Navigation, {}), (0, jsx_runtime_1.jsx)(Header, {}), (0, jsx_runtime_1.jsxs)("main", { className: "main-area p-6 overflow-auto", children: [currentPage === 'demo' && (0, jsx_runtime_1.jsx)(DemoPage, {}), currentPage === 'getStarted' && (0, jsx_runtime_1.jsx)(GetStartedPage, {}), currentPage === 'builder' && (0, jsx_runtime_1.jsx)(BuilderPage, {}), isCustomizing && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "glass-card p-6 rounded-2xl max-w-md w-full max-h-96 overflow-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center mb-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-bold", children: "Customize Colors" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setIsCustomizing(false), className: "p-2 rounded-lg glass-card", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 20 }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium mb-2", children: "Primary Color" }), (0, jsx_runtime_1.jsx)("input", { type: "color", value: primaryColor, onChange: (e) => handlePrimaryColorChange(e.target.value), className: "w-full h-12 rounded-lg border-none cursor-pointer" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: "Secondary" }), (0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 rounded", style: { backgroundColor: currentTheme.colors.secondary } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: "Accent" }), (0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 rounded", style: { backgroundColor: currentTheme.colors.accent } })] })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm", style: { color: currentTheme.colors.textSecondary }, children: "Secondary and accent colors are automatically generated using color theory." })] })] }) }))] }), (0, jsx_runtime_1.jsx)(Footer, {})] }));
};
exports.default = EnhancedClaudeBuilder;
//# sourceMappingURL=enhanced-demo-with-pages.js.map