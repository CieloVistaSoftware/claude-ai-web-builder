import React, { useState, useEffect, useCallback } from 'react';
import { Palette, Moon, Sun, Settings, Wand2, MessageCircle, ArrowRight, Plus, Eye, Code, Download, Menu, X, Layout, LayoutDashboard, PanelLeft, PanelRight, PanelTop } from 'lucide-react';

// Theme type definitions
interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    glass: string;
  };
  mode: 'light' | 'dark';
}

// Layout types
type LayoutType = 'left-nav' | 'right-nav' | 'top-nav';
type PageType = 'demo' | 'getStarted' | 'builder';
type WebsiteState = {
  layout: LayoutType;
  content: string;
  header: string;
  nav: string;
  main: string;
  footer: string;
  theme: Theme;
}

// Color generation utilities
const hexToHsl = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
};

const hslToHex = (h: number, s: number, l: number) => {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
};

const generateColorScheme = (primaryColor: string, isDark: boolean) => {
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

const EnhancedClaudeBuilder: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>({
    id: 'dark-auto',
    name: 'Auto Dark',
    colors: generateColorScheme('#6366f1', true),
    mode: 'dark'
  });
  
  const [layoutType, setLayoutType] = useState<LayoutType>('left-nav');
  const [currentPage, setCurrentPage] = useState<PageType>('demo');
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [userPrompt, setUserPrompt] = useState('');
  const [websiteName, setWebsiteName] = useState('');
  const [websiteType, setWebsiteType] = useState('');
  const [isClaudeThinking, setIsClaudeThinking] = useState(false);
  const [generatedWebsite, setGeneratedWebsite] = useState<WebsiteState>({
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
  useEffect(() => {
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

  const handlePrimaryColorChange = (color: string) => {
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

  const callClaudeAPI = async (prompt: string) => {
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
    const key = Object.keys(baseResponses).find(k => 
      promptLower.includes(k) && k !== 'default'
    ) || 'default';
    
    // Combine template response with context-aware suggestions
    const contextResponse = [
      ...baseResponses[key as keyof typeof baseResponses],
      websiteType ? `I notice this is a ${websiteType} website. Would you like specific suggestions for that type?` : null,
      currentTheme.mode === 'dark' ? "The dark theme looks great! We can adjust the contrast if needed." : null,
    ].filter(Boolean) as string[];
    
    setIsClaudeThinking(false);
    return contextResponse;
  };

  const handleAiPrompt = async () => {
    if (!userPrompt.trim()) return;
    
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
  const Navigation = () => (
    <nav className="nav-area glass-card p-4 transition-all duration-300"
         style={{ 
           backgroundColor: currentTheme.colors.surface,
           borderRight: layoutType === 'right-nav' ? 'none' : `1px solid ${currentTheme.colors.border}`,
           borderLeft: layoutType === 'right-nav' ? `1px solid ${currentTheme.colors.border}` : 'none',
           borderBottom: layoutType === 'top-nav' ? `1px solid ${currentTheme.colors.border}` : 'none'
         }}>
      
      {layoutType === 'top-nav' ? (
        // Top Navigation Layout
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Wand2 style={{ color: currentTheme.colors.primary }} size={24} />
              <span className="font-bold text-lg">Claude Builder</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentPage('demo')}
                className={`px-3 py-2 rounded-lg transition-colors ${currentPage === 'demo' ? 'glass-card' : ''}`}
                style={currentPage === 'demo' ? { color: currentTheme.colors.primary } : {}}
              >
                Demo
              </button>
              <button
                onClick={() => setCurrentPage('getStarted')}
                className={`px-3 py-2 rounded-lg transition-colors ${currentPage === 'getStarted' ? 'glass-card' : ''}`}
                style={currentPage === 'getStarted' ? { color: currentTheme.colors.primary } : {}}
              >
                Get Started
              </button>
              <button
                onClick={() => setCurrentPage('builder')}
                className={`px-3 py-2 rounded-lg transition-colors ${currentPage === 'builder' ? 'glass-card' : ''}`}
                style={currentPage === 'builder' ? { color: currentTheme.colors.primary } : {}}
              >
                Builder
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LayoutSelector />
            <ColorPicker />
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg glass-card transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      ) : (
        // Side Navigation Layout
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            {isNavOpen && (
              <div className="flex items-center gap-2">
                <Wand2 style={{ color: currentTheme.colors.primary }} size={24} />
                <span className="font-bold text-lg">Claude Builder</span>
              </div>
            )}
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="p-2 rounded-lg glass-card transition-colors"
            >
              {isNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          
          <div className="space-y-2 flex-1">
            <NavButton 
              icon={<LayoutDashboard size={20} />}
              label="Demo"
              active={currentPage === 'demo'}
              onClick={() => setCurrentPage('demo')}
            />
            <NavButton 
              icon={<Plus size={20} />}
              label="Get Started"
              active={currentPage === 'getStarted'}
              onClick={() => setCurrentPage('getStarted')}
            />
            <NavButton 
              icon={<Code size={20} />}
              label="Builder"
              active={currentPage === 'builder'}
              onClick={() => setCurrentPage('builder')}
            />
          </div>
          
          <div className="mt-auto space-y-4">
            <LayoutSelector />
            <ColorPicker />
            <button
              onClick={toggleDarkMode}
              className="w-full p-3 rounded-lg glass-card transition-colors flex items-center gap-3"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              {isNavOpen && <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
            </button>
          </div>
        </div>
      )}
    </nav>
  );

  const NavButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
  }> = ({ icon, label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full p-3 rounded-lg transition-colors flex items-center gap-3 ${
        active ? 'glass-card' : 'hover:glass-card'
      }`}
      style={active ? { 
        backgroundColor: currentTheme.colors.primary + '20',
        color: currentTheme.colors.primary 
      } : {}}
    >
      {icon}
      {isNavOpen && <span className="font-medium">{label}</span>}
    </button>
  );

  const LayoutSelector = () => (
    <div className={`${isNavOpen || layoutType === 'top-nav' ? 'w-full' : 'w-auto'}`}>
      {isNavOpen || layoutType === 'top-nav' ? (
        <div>
          <label className="block text-sm font-medium mb-2">Layout</label>
          <select
            value={layoutType}
            onChange={(e) => setLayoutType(e.target.value as LayoutType)}
            className="w-full p-2 rounded-lg glass-card border-none"
            style={{ 
              backgroundColor: currentTheme.colors.background,
              color: currentTheme.colors.text 
            }}
          >
            <option value="left-nav">Left Navigation</option>
            <option value="right-nav">Right Navigation</option>
            <option value="top-nav">Top Navigation</option>
          </select>
        </div>
      ) : (
        <button
          onClick={() => {
            const layouts: LayoutType[] = ['left-nav', 'right-nav', 'top-nav'];
            const currentIndex = layouts.indexOf(layoutType);
            const nextIndex = (currentIndex + 1) % layouts.length;
            setLayoutType(layouts[nextIndex]);
          }}
          className="p-2 rounded-lg glass-card transition-colors"
          title="Change Layout"
        >
          {layoutType === 'left-nav' ? <PanelLeft size={20} /> :
           layoutType === 'right-nav' ? <PanelRight size={20} /> :
           <PanelTop size={20} />}
        </button>
      )}
    </div>
  );

  const ColorPicker = () => (
    <div className={`${isNavOpen || layoutType === 'top-nav' ? 'w-full' : 'w-auto'}`}>
      {isNavOpen || layoutType === 'top-nav' ? (
        <div>
          <label className="block text-sm font-medium mb-2">Primary Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => handlePrimaryColorChange(e.target.value)}
              className="w-10 h-10 rounded-lg border-none cursor-pointer"
            />
            <div className="flex-1 text-sm">
              <div style={{ color: currentTheme.colors.primary }}>● Primary</div>
              <div style={{ color: currentTheme.colors.secondary }}>● Secondary</div>
              <div style={{ color: currentTheme.colors.accent }}>● Accent</div>
            </div>
          </div>
        </div>
      ) : (
        <input
          type="color"
          value={primaryColor}
          onChange={(e) => handlePrimaryColorChange(e.target.value)}
          className="w-10 h-10 rounded-lg border-none cursor-pointer"
          title="Change Primary Color"
        />
      )}
    </div>
  );

  // Header Component
  const Header = () => (
    <header className="header-area glass-card p-6"
            style={{ 
              backgroundColor: currentTheme.colors.surface,
              borderBottom: `1px solid ${currentTheme.colors.border}`
            }}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {currentPage === 'demo' && 'AI Website Builder Demo'}
            {currentPage === 'getStarted' && 'Get Started'}
            {currentPage === 'builder' && `Building: ${websiteName || 'Your Website'}`}
          </h1>
          <p style={{ color: currentTheme.colors.textSecondary }}>
            {currentPage === 'demo' && 'Experience the future of web development with Claude AI'}
            {currentPage === 'getStarted' && 'Create your professional website in minutes'}
            {currentPage === 'builder' && `${websiteType} • Glass Design • ${currentTheme.mode} Mode`}
          </p>
        </div>
        
        {layoutType !== 'top-nav' && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCustomizing(!isCustomizing)}
              className="p-3 rounded-lg glass-card transition-colors"
            >
              <Settings size={20} />
            </button>
          </div>
        )}
      </div>
    </header>
  );

  // Main Content Components
  const DemoPage = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="glass-card glass-sweep p-8 rounded-2xl">
        <div className="max-w-4xl">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Build Websites with AI
          </h2>
          <p className="text-xl mb-8" style={{ color: currentTheme.colors.textSecondary }}>
            Create professional websites using natural language. Just tell Claude what you want, 
            and watch your site come to life with stunning glass morphism design.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 rounded-xl font-semibold transition-all duration-300 glass-card glass-sweep flex items-center gap-3"
            style={{
              backgroundColor: currentTheme.colors.primary,
              color: currentTheme.colors.background
            }}
          >
            Get Started
            <ArrowRight size={24} />
          </button>
        </div>
      </section>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: <Wand2 size={28} />, title: 'AI-Powered Design', desc: 'Claude generates beautiful components instantly' },
          { icon: <Eye size={28} />, title: 'Real-time Preview', desc: 'See changes applied instantly with glass effects' },
          { icon: <Palette size={28} />, title: 'Smart Color System', desc: 'Automatic color harmony generation' },
          { icon: <Download size={28} />, title: 'Export Ready', desc: 'Download clean, production-ready code' }
        ].map((feature, index) => (
          <div
            key={index}
            className="glass-card glass-sweep p-6 rounded-xl"
          >
            <div 
              className="w-16 h-16 rounded-xl mb-4 flex items-center justify-center"
              style={{ backgroundColor: currentTheme.colors.primary + '20' }}
            >
              <div style={{ color: currentTheme.colors.primary }}>
                {feature.icon}
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
            <p style={{ color: currentTheme.colors.textSecondary }}>
              {feature.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Color Scheme Preview */}
      <section className="glass-card p-8 rounded-2xl">
        <h3 className="text-2xl font-bold mb-6">Live Color System</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl" style={{ backgroundColor: currentTheme.colors.primary }}>
            <h4 className="font-semibold text-white">Primary Color</h4>
            <p className="text-white/80">{currentTheme.colors.primary}</p>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: currentTheme.colors.secondary }}>
            <h4 className="font-semibold text-white">Secondary Color</h4>
            <p className="text-white/80">{currentTheme.colors.secondary}</p>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: currentTheme.colors.accent }}>
            <h4 className="font-semibold text-white">Accent Color</h4>
            <p className="text-white/80">{currentTheme.colors.accent}</p>
          </div>
        </div>
      </section>
    </div>
  );

  const websiteTypes = [
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'business', label: 'Business Website' },
    { id: 'ecommerce', label: 'E-commerce Store' },
    { id: 'blog', label: 'Blog' },
    { id: 'landing', label: 'Landing Page' },
    { id: 'saas', label: 'SaaS Platform' }
  ];

  const GetStartedPage = () => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="glass-card p-8 rounded-2xl">
        <h2 className="text-3xl font-bold mb-6">Create Your Website</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Website Details Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Website Name *
              </label>
              <input
                type="text"
                value={websiteName}
                onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                  const newValue = e.target.value;
                  requestAnimationFrame(() => {
                    setWebsiteName(newValue);
                  });
                }, [])}
                placeholder="e.g., Acme Inc, My Portfolio..."
                className="w-full p-3 rounded-lg glass-card border-none"
                style={{
                  backgroundColor: currentTheme.colors.background,
                  color: currentTheme.colors.text
                }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Website Type *
              </label>
              <select
                value={websiteType}
                onChange={(e) => setWebsiteType(e.target.value)}
                className="w-full p-3 rounded-lg glass-card border-none"
                style={{
                  backgroundColor: currentTheme.colors.background,
                  color: currentTheme.colors.text
                }}
              >
                <option value="">Select a type...</option>
                {websiteTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Layout Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Layout Style
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['left-nav', 'right-nav', 'top-nav'].map(layout => (
                  <button
                    key={layout}
                    onClick={() => setLayoutType(layout as LayoutType)}
                    className={`p-4 rounded-lg glass-card flex flex-col items-center gap-2 ${
                      layoutType === layout ? 'ring-2' : ''
                    }`}
                    style={{
                      backgroundColor: currentTheme.colors.surface,
                      borderColor: currentTheme.colors.border,
                      ...(layoutType === layout && {
                        ringColor: currentTheme.colors.primary
                      })
                    }}
                  >
                    {layout === 'left-nav' && <PanelLeft size={24} />}
                    {layout === 'right-nav' && <PanelRight size={24} />}
                    {layout === 'top-nav' && <PanelTop size={24} />}
                    <span className="text-sm">{
                      layout === 'left-nav' ? 'Left Nav' :
                      layout === 'right-nav' ? 'Right Nav' : 'Top Nav'
                    }</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartBuilding}
              disabled={!websiteName || !websiteType}
              className="w-full p-4 rounded-lg glass-card glass-sweep flex items-center justify-center gap-2"
              style={{
                backgroundColor: currentTheme.colors.primary,
                color: currentTheme.colors.background,
                opacity: (!websiteName || !websiteType) ? 0.5 : 1
              }}
            >
              Create Website
              <ArrowRight size={20} />
            </button>
          </div>

          {/* AI Chat Preview */}
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MessageCircle size={20} style={{ color: currentTheme.colors.primary }} />
              Claude AI Assistant
            </h3>
            
            <div className="min-h-[200px] mb-4" style={{ color: currentTheme.colors.textSecondary }}>
              {aiSuggestions.length > 0 ? (
                <div className="space-y-2">
                  {aiSuggestions.map((suggestion, i) => (
                    <p key={i}>{suggestion}</p>
                  ))}
                </div>
              ) : (
                <p>Fill in your website details and I'll help you build something amazing!</p>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Ask Claude anything..."
                className="flex-1 p-3 rounded-lg glass-card border-none"
                style={{
                  backgroundColor: currentTheme.colors.background,
                  color: currentTheme.colors.text
                }}
              />
              <button
                onClick={handleAiPrompt}
                disabled={!userPrompt.trim()}
                className="p-3 rounded-lg glass-card"
                style={{
                  backgroundColor: currentTheme.colors.primary,
                  color: currentTheme.colors.background,
                  opacity: !userPrompt.trim() ? 0.5 : 1
                }}
              >
                <MessageCircle size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Footer Component
  const Footer = () => (
    <footer className="footer-area glass-card p-6 text-center"
            style={{ 
              backgroundColor: currentTheme.colors.surface,
              borderTop: `1px solid ${currentTheme.colors.border}`
            }}>
      <div className="flex justify-between items-center">
        <p style={{ color: currentTheme.colors.textSecondary }}>
          © 2025 Claude Website Builder. Built with AI assistance.
        </p>
        <div className="flex items-center gap-4">
          <span className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
            Layout: {layoutType.replace('-', ' ')} • Mode: {isDarkMode ? 'Dark' : 'Light'}
          </span>
        </div>
      </div>
    </footer>
  );

  const BuilderPage = () => {
    const [siteChat, setSiteChat] = useState('');
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Website Preview */}
        <div className="lg:col-span-2 glass-card p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-6">Website Preview</h2>
          <div className={`glass-card p-6 rounded-xl layout-${layoutType}`} 
               style={{ backgroundColor: currentTheme.colors.background }}>
            <div className="space-y-4">
              <header className="glass-card p-4 rounded-lg header-area">
                <div dangerouslySetInnerHTML={{ 
                  __html: generatedWebsite.header || `<h3 class="font-bold text-lg">${websiteName}</h3>` 
                }} />
              </header>
              
              <nav className="glass-card p-4 rounded-lg nav-area">
                <div dangerouslySetInnerHTML={{ 
                  __html: generatedWebsite.nav || `
                    <div class="flex gap-4 text-sm">
                      <span>Home</span>
                      <span>About</span>
                      <span>Services</span>
                      <span>Contact</span>
                    </div>
                  `
                }} />
              </nav>
              
              <main className="glass-card p-6 rounded-lg main-area">
                <div dangerouslySetInnerHTML={{ 
                  __html: generatedWebsite.main || `
                    <h2 class="text-2xl font-bold mb-4">Welcome to ${websiteName}</h2>
                    <p class="mb-4">Your ${websiteType} website with beautiful glass morphism design.</p>
                    <button class="px-6 py-3 rounded-lg glass-card glass-sweep">Get Started</button>
                  `
                }} />
              </main>
              
              <footer className="glass-card p-4 rounded-lg footer-area">
                <div dangerouslySetInnerHTML={{ 
                  __html: generatedWebsite.footer || `
                    <p class="text-sm text-center">© 2025 ${websiteName}. Built with Claude AI.</p>
                  `
                }} />
              </footer>
              
              <div className="glass-card p-4 rounded-lg chat-area mt-4">
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={siteChat}
                    onChange={(e) => setSiteChat(e.target.value)}
                    className="flex-1 p-2 rounded glass-card border-none"
                    placeholder="Ask Claude about this website..."
                    style={{
                      backgroundColor: currentTheme.colors.background,
                      color: currentTheme.colors.text
                    }}
                  />
                  <button
                    onClick={() => {
                      if (siteChat.trim()) {
                        handleAiPrompt();
                        setSiteChat('');
                      }
                    }}
                    className="px-4 py-2 rounded glass-card"
                    style={{
                      backgroundColor: currentTheme.colors.primary,
                      color: currentTheme.colors.background
                    }}
                  >
                    Ask Claude
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant Panel */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MessageCircle style={{ color: currentTheme.colors.secondary }} />
              Claude AI Assistant
            </h3>
            
            <div className="space-y-4">
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Ask Claude to improve your website..."
                className="w-full p-3 rounded-lg glass-card border-none resize-none"
                rows={3}
                style={{
                  backgroundColor: currentTheme.colors.background,
                  color: currentTheme.colors.text
                }}
              />
              
              <button
                onClick={handleAiPrompt}
                disabled={!userPrompt.trim() || isClaudeThinking}
                className="w-full py-3 rounded-lg font-medium transition-all disabled:opacity-50 glass-card glass-sweep"
                style={{
                  backgroundColor: currentTheme.colors.secondary,
                  color: currentTheme.colors.background
                }}
              >
                {isClaudeThinking ? '🤖 Claude is thinking...' : 'Ask Claude AI'}
              </button>
              
              {aiSuggestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Claude's Response:</h4>
                  {aiSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg glass-card text-sm"
                      style={{
                        borderLeft: `3px solid ${currentTheme.colors.accent}`
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                'Add a hero section',
                'Create a contact form', 
                'Improve the design',
                'Add more sections'
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={() => setUserPrompt(action)}
                  className="w-full p-3 rounded-lg text-left transition-all glass-card glass-sweep"
                  style={{ backgroundColor: currentTheme.colors.background }}
                >
                  + {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`layout-${layoutType} transition-all duration-300`}
         style={{ 
           backgroundColor: currentTheme.colors.background, 
           color: currentTheme.colors.text,
           minHeight: '100vh'
         }}>
      
      <Navigation />
      <Header />
      
      <main className="main-area p-6 overflow-auto">
        {currentPage === 'demo' && <DemoPage />}
        {currentPage === 'getStarted' && <GetStartedPage />}
        {currentPage === 'builder' && <BuilderPage />}
        
        {/* Customization Panel */}
        {isCustomizing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card p-6 rounded-2xl max-w-md w-full max-h-96 overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Customize Colors</h3>
                <button
                  onClick={() => setIsCustomizing(false)}
                  className="p-2 rounded-lg glass-card"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Color</label>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => handlePrimaryColorChange(e.target.value)}
                    className="w-full h-12 rounded-lg border-none cursor-pointer"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Secondary</span>
                    <div className="w-8 h-8 rounded" style={{ backgroundColor: currentTheme.colors.secondary }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Accent</span>
                    <div className="w-8 h-8 rounded" style={{ backgroundColor: currentTheme.colors.accent }}></div>
                  </div>
                </div>
                
                <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                  Secondary and accent colors are automatically generated using color theory.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default EnhancedClaudeBuilder;