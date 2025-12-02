# WB LinkedIn Ad Component

A rich, interactive web component for displaying LinkedIn-style advertisement cards with images, logos, themed buttons, **edit mode with inline controls**, and light/dark mode support.

## Features

- **Hero Images** - Full-width images from any source (Unsplash, Pexels, etc.)
- **Company Logos** - Custom logo or auto-generated initial placeholder
- **Themed CTA Buttons** - Any color with automatic contrast text
- **Light & Dark Themes** - Toggle with the `dark` attribute
- **Edit Mode** - Built-in control panel for live customization
- **Code Generation** - Copy button generates ready-to-use code
- **Engagement Actions** - Like, Comment, Share interactions
- **Hover Effects** - Smooth lift animation on hover
- **Shadow DOM** - Fully encapsulated styles

## Installation

Automatically loaded via `main.js`:

```html
<script type="module" src="../../src/js/main.js"></script>
```

## Basic Usage

```html
<wb-linkedin-ad 
  ad-id="12345" 
  company="Acme Corp" 
  headline="Grow your business with us!" 
  cta="Learn More">
</wb-linkedin-ad>
```

## Rich Usage with Images

```html
<wb-linkedin-ad 
  ad-id="tech-001" 
  company="OpenAI" 
  headline="GPT-5 is here. Build the impossible."
  subtitle="Join 100M+ developers using our API"
  cta="🚀 Start Building"
  cta-color="#10a37f"
  image="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop"
  logo="https://example.com/openai-logo.png"
  dark>
</wb-linkedin-ad>
```

## Edit Mode

Add the `edit` attribute to enable the built-in control panel:

```html
<wb-linkedin-ad 
  ad-id="editable-001" 
  company="Your Brand" 
  headline="Edit me! Try the controls below"
  cta="🎨 Customize"
  cta-color="#667eea"
  image="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=300&fit=crop"
  edit>
</wb-linkedin-ad>
```

### Edit Mode Features

- **Company Name** - Text input to change company
- **Headline** - Edit the main ad copy
- **Subtitle** - Add/edit secondary text
- **CTA Text** - Change button text (supports emoji!)
- **Image URL** - Paste any image URL
- **Color Picker** - Choose any button color
- **Preset Colors** - Quick access to common colors
- **Theme Toggle** - Switch light/dark mode
- **Copy Code** - Generate code for current state

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `ad-id` | string | `''` | Unique identifier for tracking |
| `company` | string | `'LinkedIn'` | Company name displayed in header |
| `headline` | string | `'Grow your business...'` | Main ad copy |
| `subtitle` | string | `''` | Secondary text below headline |
| `cta` | string | `'Learn More'` | Call-to-action button text |
| `cta-color` | string | `'#0a66c2'` | Button background color (hex) |
| `image` | string | `''` | Hero image URL (600x300 recommended) |
| `logo` | string | `''` | Company logo URL (48x48) |
| `dark` | boolean | `false` | Enable dark theme |
| `edit` | boolean | `false` | Show inline editor controls |

## Free Image Sources

Use these services for free, high-quality images:

- **Unsplash**: `https://images.unsplash.com/photo-ID?w=600&h=300&fit=crop`
- **Pexels**: `https://images.pexels.com/photos/ID/pexels-photo-ID.jpeg?w=600&h=300&fit=crop`
- **Picsum**: `https://picsum.photos/600/300`

## Button Color Presets

The edit mode includes these preset colors:

| Color | Hex | Use Case |
|-------|-----|----------|
| LinkedIn Blue | `#0a66c2` | Professional, default |
| Green | `#10a37f` | Success, positive action |
| Red | `#ef4444` | Urgent, danger |
| Orange | `#f59e0b` | Warning, attention |
| Purple | `#8b5cf6` | Creative, premium |
| Pink | `#ec4899` | Fun, lifestyle |

## Programmatic Control

```javascript
// Get an ad element
const ad = document.querySelector('wb-linkedin-ad');

// Change attributes
ad.setAttribute('cta-color', '#ff5a5f');
ad.setAttribute('headline', 'New headline!');
ad.toggleAttribute('dark');

// Enable edit mode
ad.setAttribute('edit', '');
```

## Browser Support

- Chrome 67+
- Firefox 63+
- Safari 10.1+
- Edge 79+

## Related Components

- `wb-card` - Generic card container
- `wb-button` - Styled button component
- `wb-color-bar` - Color strip display
- `wb-color-bars` - Animated rainbow bars
- `wb-control-panel` - Theme/color controls
