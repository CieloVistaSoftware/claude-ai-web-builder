# 🤖 Claude Website Builder

**AI-Powered No-Code Website Builder with Real-Time Design Assistance**

Create professional websites using natural language with Claude AI integration. Simply describe what you want, and watch your website come to life instantly.

![Claude Website Builder Demo](https://via.placeholder.com/800x400/3b82f6/ffffff?text=Claude+Website+Builder+Demo)

## ✨ Key Features

- 🤖 **Claude AI Integration** - Describe your vision, get instant results
- 🎨 **Real-Time Theme System** - See changes applied instantly
- 📱 **Responsive Components** - Mobile-first design out of the box
- 🚀 **No-Code Builder** - Visual drag-and-drop interface
- 💾 **JSON Database** - File-based storage, no SQL required
- 🎯 **Professional Templates** - Industry-specific starting points
- ⚡ **Export Ready** - Download clean, production-ready code
- 🔒 **Secure API Key Management** - Environment variable protection

## 🎯 Target Market

- **Small Business Owners** - Need websites without coding knowledge
- **Freelancers & Consultants** - Quick professional sites
- **Marketing Agencies** - Rapid client website development
- **Non-profits** - Cost-effective web presence

## 🛠 Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **State Management**: Zustand
- **Build Tool**: Vite
- **AI Integration**: Claude API (Anthropic)
- **Database**: JSON-based file storage
- **Icons**: Lucide React
- **Deployment**: Vercel/Netlify ready

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Claude API key from Anthropic
- Windows environment variables setup

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/claude-website-builder.git
cd claude-website-builder

# Install dependencies
npm install

# Set up Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install additional dependencies
npm install lucide-react zustand
```

### Environment Setup

#### Windows Environment Variables (Required)

1. Press `Win + R`, type `sysdm.cpl`
2. Click "Environment Variables"
3. Add these variables:

```bash
CLAUDE_API_KEY=your_claude_api_key_here
CLAUDE_API_URL=https://api.anthropic.com/v1/messages
CLAUDE_MODEL=claude-3-sonnet-20240229
```

#### Project Environment Variables

Create `.env` file in project root:

```bash
VITE_CLAUDE_API_KEY=your_claude_api_key_here
VITE_CLAUDE_API_URL=https://api.anthropic.com/v1/messages
VITE_CLAUDE_MODEL=claude-3-sonnet-20240229
```

### Running the Application

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

## 📁 Project Structure

```
claude-website-builder/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # Reusable UI components
│   │   ├── builder/         # Builder-specific components
│   │   ├── website/         # Generated website components
│   │   └── theme/           # Theme system components
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API services (Claude integration)
│   │   └── claude.ts        # Claude API client
│   ├── stores/              # Zustand stores
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── data/                # JSON database files
│   │   ├── projects/        # Individual project files
│   │   ├── templates/       # Component templates
│   │   └── database.json    # Main database index
│   └── styles/              # Global styles and theme variables
├── public/                  # Static assets
├── docs/                    # Documentation
├── .env                     # Environment variables
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🎨 Component System

### Built-in Components

- **Navigation**: Headers, sidebars, breadcrumbs
- **Content**: Hero sections, cards, testimonials, pricing tables
- **Forms**: Contact forms, newsletters, surveys
- **Media**: Image galleries, video players, carousels
- **Interactive**: Accordions, tabs, modals, tooltips
- **Theme Controls**: Dark mode toggle, color picker, font selector

### Theme System

```typescript
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
```

### Component Instance Structure

```typescript
interface ComponentInstance {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
  styles: ComponentStyles;
  responsive: ResponsiveStyles;
  animations?: AnimationConfig;
}
```

## 🤖 Claude AI Integration

### Features

- **Component Generation**: "Create a hero section for a coffee shop"
- **Design Suggestions**: "Make this more modern and professional"
- **Content Creation**: Auto-generate copy based on business type
- **Accessibility Review**: Automated compliance checking
- **SEO Optimization**: Meta tags and structure suggestions

### API Usage

```typescript
import { generateComponent } from './services/claude';

const response = await generateComponent({
  prompt: "Create a modern hero section for a law firm",
  context: {
    theme: "professional",
    pageType: "landing",
    components: ["navigation", "footer"]
  }
});
```

### Rate Limiting

- Debounced API calls (2-second delay)
- Request caching for similar prompts
- Error handling with fallback suggestions

## 💾 JSON Database Architecture

### Storage Strategy

- **Development**: localStorage for browser storage
- **Production**: File-based JSON storage
- **Scaling**: Cloud storage (AWS S3, Firebase)

### Database Structure

```json
{
  "projects": {
    "project-123": {
      "id": "project-123",
      "metadata": { "name": "Coffee Shop", "type": "restaurant" },
      "pages": [...],
      "components": [...],
      "settings": {...}
    }
  },
  "interactions": { "claude-interactions": [...] },
  "assets": { "uploaded-files": [...] },
  "templates": { "pre-built-components": [...] }
}
```

### Data Operations

```typescript
const db = new JSONWebsiteDatabase();

// Create project
const projectId = db.createProject(metadata);

// Add component
db.addComponent(projectId, pageId, component);

// Update theme
db.updateProject(projectId, { design: newTheme });
```

## 🎯 User Flow

### 1. Demo Page
- Feature showcase
- Live theme switching
- Interactive examples

### 2. Get Started Page
- **Form**: Website name and type selection
- **Claude Consultation**: AI helps users plan their project
- **Smart Suggestions**: Auto-fill based on AI recommendations

### 3. Builder Page
- **Visual Canvas**: Real-time preview
- **Component Library**: Drag-and-drop interface
- **AI Chat**: Continuous Claude assistance
- **Property Editor**: Fine-tune components

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Drag and drop the dist/ folder to Netlify
```

### Manual Deployment

```bash
npm run build
# Upload dist/ folder to your hosting provider
```

### Environment Variables in Production

Set these in your hosting platform:

- `VITE_CLAUDE_API_KEY`
- `VITE_CLAUDE_API_URL`
- `VITE_CLAUDE_MODEL`

## 💰 Monetization Strategy

### Pricing Tiers

- **Free**: 5 websites, basic components, community templates
- **Pro ($29/month)**: Unlimited websites, advanced components, Claude integration
- **Enterprise ($99/month)**: Custom components, team collaboration, white-label

### Revenue Streams

- Monthly/annual subscriptions
- Template marketplace (revenue sharing)
- Custom component development services
- White-label licensing

## 🔧 Development

### Adding New Components

1. Create component definition in `types/components.ts`
2. Add to component registry in `components/website/`
3. Create default props and styling
4. Add to component palette

### Extending Claude Integration

1. Add new interaction types to `types/claude.ts`
2. Implement API handlers in `services/claude.ts`
3. Update UI in chat components
4. Add response processing logic

### Theme Customization

1. Extend `Theme` interface in `types/theme.ts`
2. Update CSS variable mapping
3. Add theme controls to UI
4. Test across all components

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

### Manual Testing Checklist

- [ ] Theme switching works across all components
- [ ] Claude API integration responds correctly
- [ ] Components render properly on mobile/tablet/desktop
- [ ] Export functionality generates clean code
- [ ] Environment variables are properly configured

## 📊 Success Metrics

### Technical KPIs

- Component generation accuracy (>90%)
- API response time (<2 seconds)
- Build performance (<5 seconds)
- Mobile responsiveness score (>95)

### Business KPIs

- User activation rate (created first website)
- Retention rate (30-day active users)
- Conversion rate (free to paid)
- Customer satisfaction (NPS score)

## 🔒 Security

### API Key Management

- Environment variables only
- Never commit keys to version control
- Encryption for stored user keys
- Secure transmission over HTTPS

### Data Protection

- No sensitive data stored in localStorage
- User projects encrypted in production
- GDPR compliance for EU users
- Regular security audits

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards

- TypeScript strict mode
- ESLint + Prettier formatting
- Component documentation
- Test coverage >80%

### Commit Messages

Use conventional commits:
- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation updates
- `style:` formatting changes
- `refactor:` code refactoring
- `test:` adding tests
- `chore:` maintenance tasks

## 📚 Documentation

- [Component Library](./docs/components.md)
- [Theme System](./docs/themes.md)
- [Claude Integration](./docs/claude-api.md)
- [Database Schema](./docs/database.md)
- [Deployment Guide](./docs/deployment.md)
- [API Reference](./docs/api.md)

## 🐛 Troubleshooting

### Common Issues

**Claude API not responding:**
- Check environment variables are set correctly
- Verify API key is valid
- Check network connectivity

**Components not rendering:**
- Ensure Tailwind CSS is properly configured
- Check console for JavaScript errors
- Verify component props are valid

**Theme not applying:**
- Check CSS variables are being set
- Verify theme structure matches interface
- Clear browser cache

**Build failing:**
- Check TypeScript errors
- Verify all dependencies are installed
- Check environment variables in build environment

### Getting Help

- 📧 Email: support@claude-website-builder.com
- 💬 Discord: [Join our community](https://discord.gg/claude-builder)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/claude-website-builder/issues)
- 📖 Docs: [Full Documentation](https://claude-website-builder.gitbook.io)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Anthropic](https://anthropic.com) for Claude AI API
- [Tailwind CSS](https://tailwindcss.com) for styling framework
- [Lucide](https://lucide.dev) for beautiful icons
- [React](https://reactjs.org) for UI framework
- [Vite](https://vitejs.dev) for lightning-fast development

## 🗺 Roadmap

### Version 1.0 (MVP) - Q1 2025
- [ ] Basic component library
- [ ] Claude AI integration
- [ ] Theme system
- [ ] Export functionality

### Version 1.1 - Q2 2025
- [ ] Advanced animations
- [ ] Form builder
- [ ] SEO optimization
- [ ] Template marketplace

### Version 1.2 - Q3 2025
- [ ] E-commerce components
- [ ] Team collaboration
- [ ] Version control
- [ ] API integrations

### Version 2.0 - Q4 2025
- [ ] Mobile app builder
- [ ] Advanced AI features
- [ ] White-label solution
- [ ] Enterprise features

---

**Built with ❤️ and AI assistance from Claude**

*Making website creation accessible to everyone, one conversation at a time.*