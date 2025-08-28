import React, { useState, useEffect } from 'react';
import { Palette, Moon, Sun, Settings, Wand2, MessageCircle } from 'lucide-react';
import './css/custom.css';

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
  };
  mode: 'light' | 'dark';
}

// Predefined themes
const themes: Theme[] = [
  {
    id: 'light-blue',
    name: 'Ocean Blue',
    mode: 'light',
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#f59e0b',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1f2937',
      textSecondary: '#6b7280'
    }
  },
  {
    id: 'dark-purple',
    name: 'Midnight Purple',
    mode: 'dark',
    colors: {
      primary: '#a78bfa',
      secondary: '#f472b6',
      accent: '#fbbf24',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f8fafc',
      textSecondary: '#cbd5e1'
    }
  },
  {
    id: 'light-green',
    name: 'Forest Green',
    mode: 'light',
    colors: {
      primary: '#10b981',
      secondary: '#06b6d4',
      accent: '#f97316',
      background: '#ffffff',
      surface: '#f0fdf4',
      text: '#1f2937',
      textSecondary: '#6b7280'
    }
  }
];

// Mock Claude API response
const mockClaudeResponse = {
  suggestions: [
    "Try a warmer color palette for better user engagement",
    "Consider increasing contrast for better accessibility",
    "A dark mode toggle would improve user experience",
    "Your current theme works well for professional websites"
  ]
};

const ThemeSystemDemo: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAiChat, setShowAiChat] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');
  // layout mode: 'left', 'headerSide', or 'top'
  const [layoutMode, setLayoutMode] = useState<'left' | 'headerSide' | 'top'>('left');

  // Apply theme to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
    });
  }, [currentTheme]);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
  };

  const handleColorChange = (colorKey: keyof Theme['colors'], newColor: string) => {
    setCurrentTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: newColor
      }
    }));
  };

  const simulateClaudeAPI = async (prompt: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock Claude response based on prompt
    if (prompt.toLowerCase().includes('dark')) {
      return ["I recommend switching to a dark theme for better eye comfort during extended use."];
    } else if (prompt.toLowerCase().includes('color')) {
      return ["For your brand, I suggest using warmer colors to create a more welcoming feel."];
    } else {
      return mockClaudeResponse.suggestions.slice(0, 2);
    }
  };

  const handleAiPrompt = async () => {
    if (!userPrompt.trim()) return;
    
    setAiSuggestions(['Thinking...']);
    const suggestions = await simulateClaudeAPI(userPrompt);
    setAiSuggestions(suggestions);
    setUserPrompt('');
  };

  // compute grid styles based on layoutMode
  const layoutStyles: React.CSSProperties = layoutMode === 'left'
    ? { display: 'grid', gridTemplateColumns: 'var(--nav-width) 1fr', gridTemplateAreas: '"nav content"', gap: 'var(--grid-gap)' }
    : layoutMode === 'headerSide'
    ? { display: 'grid', gridTemplateColumns: 'var(--nav-width) 1fr', gridTemplateRows: 'var(--header-height) 1fr', gridTemplateAreas: '"nav header" "nav content"', gap: 'var(--grid-gap)' }
    : { display: 'grid', gridTemplateRows: 'var(--header-height) 1fr', gridTemplateAreas: '"header" "content"', gap: 'var(--grid-gap)' };

  return (
    <div 
      className="min-h-screen transition-all duration-300"
      style={{
        backgroundColor: currentTheme.colors.background,
        color: currentTheme.colors.text
      }}
    >
      {/* Header */}
      <header 
        className="p-4 shadow-lg"
        style={{ backgroundColor: currentTheme.colors.surface }}
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wand2 style={{ color: currentTheme.colors.primary }} />
            Claude Website Builder
          </h1>
          <div className="flex items-center gap-4">
            {/* Layout Selector */}
            <select
              value={layoutMode}
              onChange={e => setLayoutMode(e.target.value as any)}
              className="px-2 py-1 rounded border"
              style={{
                backgroundColor: currentTheme.colors.background,
                borderColor: currentTheme.colors.primary,
                color: currentTheme.colors.text
              }}
            >
              <option value="left">Left Nav</option>
              <option value="headerSide">Header + Side</option>
              <option value="top">Top Nav</option>
            </select>

            {/* Theme Selector */}
            <select
              value={currentTheme.id}
              onChange={(e) => handleThemeChange(themes.find(t => t.id === e.target.value)!)}
              className="px-3 py-2 rounded-lg border transition-colors"
              style={{
                backgroundColor: currentTheme.colors.background,
                borderColor: currentTheme.colors.primary,
                color: currentTheme.colors.text
              }}
            >
              {themes.map(theme => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>

            {/* Theme Controls */}
            <button
              onClick={() => setIsCustomizing(!isCustomizing)}
              className="p-2 rounded-lg transition-colors"
              style={{
                backgroundColor: currentTheme.colors.primary,
                color: currentTheme.colors.background
              }}
            >
              <Settings size={20} />
            </button>

            {/* AI Chat Toggle */}
            <button
              onClick={() => setShowAiChat(!showAiChat)}
              className="p-2 rounded-lg transition-colors relative"
              style={{
                backgroundColor: currentTheme.colors.secondary,
                color: currentTheme.colors.background
              }}
            >
              <MessageCircle size={20} />
              {aiSuggestions.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* container with dynamic layout */}
        <div className="container-fluid" style={layoutStyles}>
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6" style={{ gridArea: layoutMode === 'top' ? 'content' : 'content' }}>
            {/* Hero Section Demo */}
            <section 
              className="p-8 rounded-xl shadow-lg"
              style={{ backgroundColor: currentTheme.colors.surface }}
            >
              <h2 className="text-4xl font-bold mb-4">Welcome to Your Website</h2>
              <p 
                className="text-lg mb-6"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                This is a demo of how your website components will look with the current theme.
                The AI helps you customize everything perfectly.
              </p>
              <button
                className="px-6 py-3 rounded-lg font-semibold transition-colors"
                style={{
                  backgroundColor: currentTheme.colors.primary,
                  color: currentTheme.colors.background
                }}
              >
                Get Started
              </button>
            </section>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['AI-Powered Design', 'Real-time Preview', 'Custom Themes', 'Export Ready'].map((feature, index) => (
                <div
                  key={feature}
                  className="p-6 rounded-lg shadow-md"
                  style={{ backgroundColor: currentTheme.colors.surface }}
                >
                  <div 
                    className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
                    style={{ backgroundColor: currentTheme.colors.accent }}
                  >
                    <span className="text-xl font-bold text-white">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature}</h3>
                  <p style={{ color: currentTheme.colors.textSecondary }}>
                    Experience the power of AI-driven web development with instant results.
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar or Nav Areas */}
          <div style={{ gridArea: layoutMode === 'top' ? 'header' : layoutMode === 'headerSide' ? 'nav' : 'nav' }} className="space-y-6">
            {/* Theme Customization Panel */}
            {isCustomizing && (
              <div 
                className="p-4 rounded-lg shadow-lg"
                style={{ backgroundColor: currentTheme.colors.surface }}
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Palette size={20} style={{ color: currentTheme.colors.primary }} />
                  Customize Theme
                </h3>
                
                <div className="space-y-3">
                  {Object.entries(currentTheme.colors).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium mb-1 capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={value}
                          onChange={(e) => handleColorChange(key as keyof Theme['colors'], e.target.value)}
                          className="w-8 h-8 rounded border"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => handleColorChange(key as keyof Theme['colors'], e.target.value)}
                          className="flex-1 px-2 py-1 text-sm rounded border"
                          style={{
                            backgroundColor: currentTheme.colors.background,
                            borderColor: currentTheme.colors.primary,
                            color: currentTheme.colors.text
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Chat Interface */}
            {showAiChat && (
              <div 
                className="p-4 rounded-lg shadow-lg"
                style={{ backgroundColor: currentTheme.colors.surface }}
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MessageCircle size={20} style={{ color: currentTheme.colors.secondary }} />
                  AI Design Assistant
                </h3>
                
                <div className="space-y-3">
                  <textarea
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="Ask Claude to help with your design... (e.g., 'Make this more modern' or 'Add a dark theme')"
                    className="w-full p-3 rounded border resize-none"
                    rows={3}
                    style={{
                      backgroundColor: currentTheme.colors.background,
                      borderColor: currentTheme.colors.primary,
                      color: currentTheme.colors.text
                    }}
                  />
                  
                  <button
                    onClick={handleAiPrompt}
                    disabled={!userPrompt.trim()}
                    className="w-full py-2 rounded font-medium transition-colors disabled:opacity-50"
                    style={{
                      backgroundColor: currentTheme.colors.secondary,
                      color: currentTheme.colors.background
                    }}
                  >
                    Ask Claude AI
                  </button>
                  
                  {aiSuggestions.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">AI Suggestions:</h4>
                      <div className="space-y-2">
                        {aiSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="p-3 rounded text-sm"
                            style={{
                              backgroundColor: currentTheme.colors.background,
                              borderLeft: `3px solid ${currentTheme.colors.accent}`
                            }}
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div 
              className="p-4 rounded-lg shadow-lg"
              style={{ backgroundColor: currentTheme.colors.surface }}
            >
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleThemeChange({
                    ...currentTheme,
                    mode: currentTheme.mode === 'light' ? 'dark' : 'light',
                    colors: currentTheme.mode === 'light' ? themes[1].colors : themes[0].colors
                  })}
                  className="w-full p-2 rounded flex items-center gap-2 transition-colors"
                  style={{
                    backgroundColor: currentTheme.colors.primary,
                    color: currentTheme.colors.background
                  }}
                >
                  {currentTheme.mode === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                  Toggle {currentTheme.mode === 'light' ? 'Dark' : 'Light'} Mode
                </button>
                
                <button
                  onClick={() => setAiSuggestions(['Your theme looks great! Consider adding more interactive elements.'])}
                  className="w-full p-2 rounded transition-colors"
                  style={{
                    backgroundColor: currentTheme.colors.accent,
                    color: currentTheme.colors.background
                  }}
                >
                  Get AI Feedback
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <div 
          className="mt-8 p-4 rounded-lg border-2 border-dashed"
          style={{ borderColor: currentTheme.colors.primary }}
        >
          <p className="text-center" style={{ color: currentTheme.colors.textSecondary }}>
            <strong>Demo Note:</strong> This showcases the theme system and AI integration. 
            In the full product, Claude API would provide real-time design suggestions and generate components based on your requirements.
            <br />
            <em>Environment variables CLAUDE_API_KEY would be required for full functionality.</em>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThemeSystemDemo;