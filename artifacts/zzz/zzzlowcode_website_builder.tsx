import React, { useState, useEffect } from 'react';
import { Palette, Layout, Type, Image, Video, Trash2, Edit3, Download, RotateCcw } from 'lucide-react';

// Define TypeScript interfaces
interface ContentBlock {
  type: string;
  content: string;
}

interface PageData {
  title: string;
  content: ContentBlock[];
}

interface PagesState {
  [key: string]: PageData;
}

interface ThemeConfig {
  name: string;
  bgPrimary: string;
  bgSecondary: string;
  textPrimary: string;
  textSecondary: string;
  borderColor: string;
  primaryColor: string;
  accentColor: string;
}

interface Themes {
  [key: string]: ThemeConfig;
}

interface DesignConfig {
  layout: string;
  navigation: string;
  bgColor: string;
  textColor: string;
  theme: string;
}

const LowCodeWebsiteBuilder = () => {
  const [design, setDesign] = useState<DesignConfig>({
    layout: 'centered',
    navigation: 'top',
    bgColor: '#ffffff',
    textColor: '#333333',
    theme: 'modern'
  });

  const [currentPage, setCurrentPage] = useState('home');
  const [pages, setPages] = useState<PagesState>({
    home: {
      title: 'Welcome to My Website',
      content: [
        { type: 'text', content: 'This is the home page content. You can edit this!' },
        { type: 'text', content: 'Add more content blocks below.' }
      ]
    }
  });

  // Theme configurations for enhanced functionality
  const themes: Themes = {
    modern: {
      name: 'Modern',
      bgPrimary: '#ffffff',
      bgSecondary: '#f8fafc',
      textPrimary: '#333333',
      textSecondary: '#64748b',
      borderColor: '#e2e8f0',
      primaryColor: '#6366f1',
      accentColor: '#10b981'
    },
    dark: {
      name: 'Dark',
      bgPrimary: '#0f172a',
      bgSecondary: '#1e293b',
      textPrimary: '#f1f5f9',
      textSecondary: '#94a3b8',
      borderColor: '#334155',
      primaryColor: '#6366f1',
      accentColor: '#10b981'
    },
    ocean: {
      name: 'Ocean',
      bgPrimary: '#0c4a6e',
      bgSecondary: '#075985',
      textPrimary: '#e0f7ff',
      textSecondary: '#7dd3fc',
      borderColor: '#0ea5e9',
      primaryColor: '#0ea5e9',
      accentColor: '#06b6d4'
    },
    sunset: {
      name: 'Sunset',
      bgPrimary: '#7c2d12',
      bgSecondary: '#9a3412',
      textPrimary: '#fed7aa',
      textSecondary: '#fdba74',
      borderColor: '#f97316',
      primaryColor: '#f97316',
      accentColor: '#fb923c'
    }
  };

  const currentTheme = themes[design.theme] || themes.modern;

  // Function to create a new page if it doesn't exist
  const createPageIfNotExists = (pageName: string): void => {
    if (!pages[pageName]) {
      const newPage: PageData = {
        title: pageName.charAt(0).toUpperCase() + pageName.slice(1),
        content: [
          { type: 'text', content: `Welcome to the ${pageName} page!` },
          { type: 'text', content: 'Start building your content here.' }
        ]
      };
      setPages(prev => ({ ...prev, [pageName]: newPage }));
    }
  };

  // Handle navigation clicks
  const handleNavClick = (pageName: string): void => {
    createPageIfNotExists(pageName);
    setCurrentPage(pageName);
  };

  // Add content to current page
  const addContent = (type: string): void => {
    if (!pages[currentPage]) {
      createPageIfNotExists(currentPage);
    }
    
    const newBlock: ContentBlock = {
      type,
      content: type === 'text' ? 'New text content' : 
               type === 'image' ? 'https://via.placeholder.com/400x200' :
               'https://www.youtube.com/embed/dQw4w9WgXcQ'
    };
    
    setPages(prev => ({
      ...prev,
      [currentPage]: {
        ...prev[currentPage],
        content: [...(prev[currentPage]?.content || []), newBlock]
      }
    }));
  };

  // Update content in current page
  const updateContent = (index: number, newBlock: ContentBlock): void => {
    if (!pages[currentPage]) {
      createPageIfNotExists(currentPage);
    }
    
    setPages(prev => ({
      ...prev,
      [currentPage]: {
        ...prev[currentPage],
        content: prev[currentPage].content.map((block, i) => 
          i === index ? newBlock : block
        )
      }
    }));
  };

  // Delete content from current page
  const deleteContent = (index: number): void => {
    if (!pages[currentPage]) return;
    
    setPages(prev => ({
      ...prev,
      [currentPage]: {
        ...prev[currentPage],
        content: prev[currentPage].content.filter((_, i) => i !== index)
      }
    }));
  };

  // Download functionality
  const downloadWebsite = () => {
    const tsxTemplate = generateTSXTemplate();
    const dataStr = "data:text/typescript;charset=utf-8," + encodeURIComponent(tsxTemplate);
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = 'lowcode-website-builder.tsx';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Generate TSX template for download
  const generateTSXTemplate = () => {
    return `import React, { useState } from 'react';

const GeneratedWebsite = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const pages = ${JSON.stringify(pages, null, 2)};

  const handleNavClick = (pageName: string) => {
    setCurrentPage(pageName);
  };

  const renderNavigation = () => {
    const navItems = ['Home', 'About', 'Services', 'Contact'];
    
    ${design.navigation === 'top' ? `
    return (
      <nav className="bg-blue-600 text-white p-4">
        <div className="flex space-x-6">
          {navItems.map(item => (
            <button
              key={item}
              onClick={() => handleNavClick(item.toLowerCase())}
              className={\`hover:text-blue-200 transition-colors \${currentPage === item.toLowerCase() ? 'font-bold bg-blue-700 px-3 py-1 rounded' : ''}\`}
            >
              {item}
            </button>
          ))}
        </div>
      </nav>
    );` : design.navigation === 'left' || design.navigation === 'right' ? `
    return (
      <nav className="bg-gray-800 text-white w-64 min-h-screen p-4">
        <div className="space-y-2">
          <h3 className="text-lg font-bold mb-4 text-gray-300">Navigation</h3>
          {navItems.map(item => (
            <button
              key={item}
              onClick={() => handleNavClick(item.toLowerCase())}
              className={\`block w-full text-left p-3 rounded-lg transition-all hover:bg-gray-700 \${
                currentPage === item.toLowerCase() ? 'bg-blue-600 shadow-lg' : ''
              }\`}
            >
              {item}
            </button>
          ))}
        </div>
      </nav>
    );` : `
    return (
      <nav className="bg-blue-600 text-white p-4 mt-auto">
        <div className="flex justify-center space-x-6">
          {navItems.map(item => (
            <button
              key={item}
              onClick={() => handleNavClick(item.toLowerCase())}
              className={\`hover:text-blue-200 transition-colors \${currentPage === item.toLowerCase() ? 'font-bold bg-blue-700 px-3 py-1 rounded' : ''}\`}
            >
              {item}
            </button>
          ))}
        </div>
      </nav>
    );`}
  };

  const renderContent = (content: any[]) => {
    return content.map((block, index) => {
      if (block.type === 'text') {
        return (
          <div key={index} className="mb-6 p-4 rounded-lg bg-gray-50">
            <p style={{ color: '${design.textColor}' }} className="text-lg leading-relaxed whitespace-pre-wrap">
              {block.content}
            </p>
          </div>
        );
      }
      
      if (block.type === 'image') {
        return (
          <div key={index} className="mb-6">
            <img 
              src={block.content} 
              alt="Content" 
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        );
      }
      
      if (block.type === 'video') {
        return (
          <div key={index} className="mb-6">
            <div className="aspect-video">
              <iframe
                src={block.content}
                className="w-full h-full rounded-lg shadow-md"
                frameBorder="0"
                allowFullScreen
                title="Video content"
              />
            </div>
          </div>
        );
      }
      
      return null;
    });
  };

  return (
    <div className="${design.navigation === 'bottom' ? 'flex flex-col min-h-screen' : 'min-h-screen'}">
      <div className="flex ${design.navigation === 'left' ? 'flex-row' : design.navigation === 'right' ? 'flex-row-reverse' : 'flex-col'} ${design.navigation === 'bottom' ? 'flex-1' : 'min-h-screen'}">
        ${design.navigation !== 'top' && design.navigation !== 'bottom' ? '{renderNavigation()}' : ''}
        
        ${design.navigation === 'top' ? '{renderNavigation()}' : ''}
        
        <main 
          className="flex-1 p-8 overflow-auto ${design.layout === 'centered' ? 'max-w-4xl mx-auto' : design.layout === 'wide' ? 'max-w-7xl mx-auto' : design.layout === 'narrow' ? 'max-w-2xl mx-auto' : ''}"
          style={{ backgroundColor: '${design.bgColor}' }}
        >
          <div className="space-y-6">
            <h1 className="text-4xl font-bold mb-6" style={{ color: '${design.textColor}' }}>
              {pages[currentPage]?.title || 'Page Title'}
            </h1>
            
            {renderContent(pages[currentPage]?.content || [])}
          </div>
        </main>
        
        ${design.navigation === 'bottom' ? '{renderNavigation()}' : ''}
      </div>
    </div>
  );
};

export default GeneratedWebsite;`;
  };

  // Content Block Component
  interface ContentBlockProps {
    block: ContentBlock;
    index: number;
    onUpdate: (block: ContentBlock) => void;
    onDelete: () => void;
    textColor: string;
  }

  const ContentBlock: React.FC<ContentBlockProps> = ({ block, index, onUpdate, onDelete, textColor }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempContent, setTempContent] = useState(block.content);

    const handleSave = () => {
      onUpdate({ ...block, content: tempContent });
      setIsEditing(false);
    };

    const handleCancel = () => {
      setTempContent(block.content);
      setIsEditing(false);
    };

    if (block.type === 'text') {
      return (
        <div className="group relative p-4 border-2 border-transparent hover:border-blue-300 rounded-lg transition-all">
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={tempContent}
                onChange={(e) => setTempContent(e.target.value)}
                className="w-full p-3 border rounded-lg resize-vertical min-h-[100px]"
                placeholder="Enter your text content..."
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ color: textColor }} className="text-lg leading-relaxed whitespace-pre-wrap">
                {block.content}
              </p>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                  title="Edit text"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => onDelete()}
                  className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                  title="Delete block"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (block.type === 'image') {
      return (
        <div className="group relative border-2 border-transparent hover:border-purple-300 rounded-lg transition-all">
          {isEditing ? (
            <div className="p-4 space-y-2">
              <label className="block text-sm font-medium text-gray-700">Image URL:</label>
              <input
                type="url"
                value={tempContent}
                onChange={(e) => setTempContent(e.target.value)}
                className="w-full p-3 border rounded-lg"
                placeholder="https://example.com/image.jpg"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <img 
                src={block.content} 
                alt="Content" 
                className="w-full h-auto rounded-lg shadow-md"
                onError={(e: any) => {
                  e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                }}
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-purple-500 text-white p-1 rounded hover:bg-purple-600"
                  title="Edit image"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => onDelete()}
                  className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                  title="Delete block"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (block.type === 'video') {
      return (
        <div className="group relative border-2 border-transparent hover:border-red-300 rounded-lg transition-all">
          {isEditing ? (
            <div className="p-4 space-y-2">
              <label className="block text-sm font-medium text-gray-700">Video Embed URL:</label>
              <input
                type="url"
                value={tempContent}
                onChange={(e) => setTempContent(e.target.value)}
                className="w-full p-3 border rounded-lg"
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="aspect-video">
                <iframe
                  src={block.content}
                  className="w-full h-full rounded-lg shadow-md"
                  frameBorder="0"
                  allowFullScreen
                  title="Video content"
                />
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                  title="Edit video"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => onDelete()}
                  className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                  title="Delete block"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  // Navigation component
  const renderNavigation = (): React.ReactNode => {
    const navItems: string[] = ['Home', 'About', 'Services', 'Contact'];
    
    if (design.navigation === 'top') {
      return (
        <nav className="bg-blue-600 text-white p-4">
          <div className="flex space-x-6">
            {navItems.map(item => (
              <button
                key={item}
                onClick={() => handleNavClick(item.toLowerCase())}
                className={`hover:text-blue-200 transition-colors ${currentPage === item.toLowerCase() ? 'font-bold bg-blue-700 px-3 py-1 rounded' : ''}`}
              >
                {item}
              </button>
            ))}
          </div>
        </nav>
      );
    }
    
    if (design.navigation === 'left') {
      return (
        <nav className="bg-gray-800 text-white w-64 min-h-screen p-4">
          <div className="space-y-2">
            <h3 className="text-lg font-bold mb-4 text-gray-300">Navigation</h3>
            {navItems.map(item => (
              <button
                key={item}
                onClick={() => handleNavClick(item.toLowerCase())}
                className={`block w-full text-left p-3 rounded-lg transition-all hover:bg-gray-700 ${
                  currentPage === item.toLowerCase() ? 'bg-blue-600 shadow-lg' : ''
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </nav>
      );
    }
    
    if (design.navigation === 'right') {
      return (
        <nav className="bg-gray-800 text-white w-64 min-h-screen p-4">
          <div className="space-y-2">
            <h3 className="text-lg font-bold mb-4 text-gray-300">Navigation</h3>
            {navItems.map(item => (
              <button
                key={item}
                onClick={() => handleNavClick(item.toLowerCase())}
                className={`block w-full text-left p-3 rounded-lg transition-all hover:bg-gray-700 ${
                  currentPage === item.toLowerCase() ? 'bg-blue-600 shadow-lg' : ''
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </nav>
      );
    }

    if (design.navigation === 'bottom') {
      return (
        <nav className="bg-blue-600 text-white p-4 mt-auto">
          <div className="flex justify-center space-x-6">
            {navItems.map(item => (
              <button
                key={item}
                onClick={() => handleNavClick(item.toLowerCase())}
                className={`hover:text-blue-200 transition-colors ${currentPage === item.toLowerCase() ? 'font-bold bg-blue-700 px-3 py-1 rounded' : ''}`}
              >
                {item}
              </button>
            ))}
          </div>
        </nav>
      );
    }
    
    return null;
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Design Panel - EXACTLY like before */}
      <div className="w-80 bg-white shadow-lg p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <Palette className="mr-2 text-blue-600" size={24} />
          Design Studio
        </h2>
        
        {/* Layout Options */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <Layout className="mr-2" size={16} />
            Page Layout
          </label>
          <select
            value={design.layout}
            onChange={(e) => setDesign(prev => ({ ...prev, layout: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="centered">Centered Content</option>
            <option value="wide">Wide Layout</option>
            <option value="narrow">Narrow Column</option>
          </select>
        </div>

        {/* Navigation Options */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Navigation Position
          </label>
          <select
            value={design.navigation}
            onChange={(e) => setDesign(prev => ({ ...prev, navigation: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="top">Top Navigation</option>
            <option value="left">Left Sidebar</option>
            <option value="right">Right Sidebar</option>
            <option value="bottom">Bottom Navigation</option>
          </select>
        </div>

        {/* Theme Selection - ENHANCED */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Theme
          </label>
          <select
            value={design.theme}
            onChange={(e) => setDesign(prev => ({ ...prev, theme: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.entries(themes).map(([key, theme]) => (
              <option key={key} value={key}>{theme.name}</option>
            ))}
          </select>
        </div>

        {/* Color Customization */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Background Color
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={design.bgColor}
              onChange={(e) => setDesign(prev => ({ ...prev, bgColor: e.target.value }))}
              className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={design.bgColor}
              onChange={(e) => setDesign(prev => ({ ...prev, bgColor: e.target.value }))}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <Type className="mr-2" size={16} />
            Text Color
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={design.textColor}
              onChange={(e) => setDesign(prev => ({ ...prev, textColor: e.target.value }))}
              className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={design.textColor}
              onChange={(e) => setDesign(prev => ({ ...prev, textColor: e.target.value }))}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Page Management */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Current Page: {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
          </label>
          <div className="text-xs text-gray-500">
            Click navigation items to create/switch pages
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Quick Actions</h3>
          <button
            onClick={() => addContent('text')}
            className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
          >
            <Type className="mr-2" size={16} />
            Add Text Block
          </button>
          <button
            onClick={() => addContent('image')}
            className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center"
          >
            <Image className="mr-2" size={16} />
            Add Image Block
          </button>
          <button
            onClick={() => addContent('video')}
            className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
          >
            <Video className="mr-2" size={16} />
            Add Video Block
          </button>
          
          {/* ENHANCED - Download and Reset */}
          <button
            onClick={downloadWebsite}
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <Download className="mr-2" size={16} />
            Download Website
          </button>
        </div>
      </div>

      {/* Website Layout - EXACTLY like before */}
      <div className={`flex-1 ${design.navigation === 'bottom' ? 'flex flex-col' : ''}`}>
        <div className={`
          flex h-full
          ${design.navigation === 'left' ? 'flex-row' : ''}
          ${design.navigation === 'right' ? 'flex-row-reverse' : ''}
          ${design.navigation === 'top' || design.navigation === 'bottom' ? 'flex-col' : ''}
        `}>
          {/* Navigation - only show if not top navigation */}
          {design.navigation !== 'top' && design.navigation !== 'bottom' && renderNavigation()}
          
          {/* Top Navigation */}
          {design.navigation === 'top' && renderNavigation()}
          
          {/* Main Content */}
          <main className={`
            flex-1 p-8 overflow-auto
            ${design.layout === 'centered' ? 'max-w-4xl mx-auto' : ''}
            ${design.layout === 'wide' ? 'max-w-7xl mx-auto' : ''}
            ${design.layout === 'narrow' ? 'max-w-2xl mx-auto' : ''}
          `} style={{ backgroundColor: design.bgColor }}>
            <div className="space-y-6">
              <h1 className="text-4xl font-bold mb-6" style={{ color: design.textColor }}>
                {pages[currentPage]?.title || 'Page Title'}
              </h1>
              
              {(pages[currentPage]?.content || []).map((block, index) => (
                <ContentBlock 
                  key={index} 
                  block={block} 
                  index={index} 
                  onUpdate={(newBlock) => updateContent(index, newBlock)}
                  onDelete={() => deleteContent(index)}
                  textColor={design.textColor}
                />
              ))}
              
              {/* Add Content Button */}
              <div className="flex space-x-2 mt-6">
                <button
                  onClick={() => addContent('text')}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Add Text
                </button>
                <button
                  onClick={() => addContent('image')}
                  className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                >
                  Add Image
                </button>
                <button
                  onClick={() => addContent('video')}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Add Video
                </button>
              </div>
            </div>
          </main>
          
          {/* Bottom Navigation */}
          {design.navigation === 'bottom' && renderNavigation()}
        </div>
      </div>
    </div>
  );
};

export default LowCodeWebsiteBuilder;