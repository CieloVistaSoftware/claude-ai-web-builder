# Claude AI Website Builder

A powerful, interactive website builder with dynamic themes, edit mode, and responsive design capabilities.

## 🚀 Features

- **Interactive Website Builder**: Create websites with a visual, drag-and-drop interface
- **Dynamic Themes**: Multiple built-in themes (Dark, Light, Cyberpunk, Ocean, Sunset, Forest)
- **Live Edit Mode**: Edit content directly on the page with real-time preview
- **Color Explorer**: Advanced color picker with hue, saturation, and lightness controls
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Layout Options**: Top navigation, left navigation, and right navigation layouts
- **Media Support**: Easy image and media integration with placeholders
- **Dynamic Pages**: Auto-generated About, Services, Portfolio, and Contact pages
- **Save Functionality**: Export your websites as complete HTML files
- **Custom Colors**: Set primary, secondary, and accent colors for your brand

## 🎨 Live Demo

- **Main Website Builder**: [wb.html](https://htmlpreview.github.io/?https://github.com/CieloVistaSoftware/claude-ai-web-builder/blob/main/wb/wb.html)
- **Documentation Hub**: [docs/index.html](https://htmlpreview.github.io/?https://github.com/CieloVistaSoftware/claude-ai-web-builder/blob/main/docs/index.html)
- **Landing Page Demo**: [index.html](https://htmlpreview.github.io/?https://github.com/CieloVistaSoftware/claude-ai-web-builder/blob/main/index.html)

## 🛠️ Quick Start

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/CieloVistaSoftware/claude-ai-web-builder.git
   cd claude-ai-web-builder
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:8000`

### Using the Website Builder

1. **Open the Builder**: Navigate to `wb/wb.html` in your browser
2. **Enable Edit Mode**: Click the "Edit Mode" button in the control panel
3. **Customize Your Site**: 
   - Change themes using the Theme dropdown
   - Adjust colors with the Color Explorer
   - Edit text by clicking on any editable element
   - Add images by clicking on media placeholders
4. **Save Your Work**: Click the "Save" button to download your website

## 📁 Project Structure

```
claude-ai-web-builder/
├── wb/                    # Main website builder application
│   ├── wb.html           # Website builder interface
│   ├── wb.css            # Builder styles
│   └── wb.js             # Builder functionality
├── docs/                 # Documentation
│   ├── index.html        # Documentation hub
│   └── *.md              # Markdown documentation files
├── components/           # Reusable UI components
├── themes/              # Theme definitions
├── images/              # Image assets
├── css/                 # Global stylesheets
└── tests/               # Test files
```

## 🎯 Key Components

### Website Builder (`wb/`)
- **wb.html**: Main builder interface with control panel
- **wb.css**: Comprehensive styling for the builder
- **wb.js**: Core functionality including edit mode, themes, and save features

### Documentation (`docs/`)
- **index.html**: Interactive documentation hub with search and filtering
- **Architecture files**: Technical documentation and specifications

### Themes
- Dark/Light modes with system preference detection
- Specialty themes: Cyberpunk, Ocean, Sunset, Forest
- Custom color system with primary, secondary, and accent colors

## 🔧 Advanced Features

### Color System
- **Color Explorer**: Interactive hue, saturation, and lightness controls
- **Custom Colors**: Set brand colors for primary, secondary, and accent
- **Theme Integration**: Colors automatically apply across all themes

### Layout System
- **Top Navigation**: Traditional horizontal navigation
- **Left Navigation**: Sidebar navigation for more content space
- **Right Navigation**: Alternative sidebar layout

### Dynamic Pages
- **Auto-Generation**: Creates About, Services, Portfolio, and Contact pages
- **Template System**: Pre-built content templates for different page types
- **Customizable**: All generated content is fully editable

## 📚 Documentation

- **[Complete Documentation](docs/index.html)**: Browse all documentation files
- **[Architecture Guide](docs/Architecture-organization.md)**: Technical architecture overview
- **[Implementation Roadmap](docs/Implementation-roadmap.md)**: Development planning
- **[Theme Documentation](docs/theme-demo-component.md)**: Theme system details

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run specific tests:
```bash
npm run test:colorBar      # Color system tests
npm run test:dynamicPages  # Dynamic page generation tests
npm run test:themeOrganization  # Theme system tests
```

## 🚀 Deployment

### GitHub Pages (Recommended)
1. Enable GitHub Pages in repository settings
2. Select "Deploy from a branch" and choose `main`
3. Your site will be available at: `https://cielovistasoftware.github.io/claude-ai-web-builder/`

### Manual Deployment
1. Build the project: `npm run build`
2. Deploy the `dist/` folder to your hosting provider

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏢 About CieloVista Software

Developed by CieloVista Software - Creating innovative web solutions with cutting-edge technology.

---

**Made with ❤️ by the CieloVista Software Team**