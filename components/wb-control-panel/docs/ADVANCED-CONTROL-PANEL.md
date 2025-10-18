# 🎨 Advanced Control Panel

**Two-tab system with 20+ dynamic themes and Harmonic Color System integration**

## ✨ Features

### 🎯 Core Features
- **Two-Tab Interface**: Separate Mode and Theme tabs for organized control
- **Mode-Specific Themes**: Different theme libraries for Dark and Light mode
- **20+ Named Themes**: Curated color palettes across multiple categories
- **Smart Theme Switching**: Themes adapt when you change modes
- **HCS Integration**: Full Harmonic Color System support
- **Live Updates**: See changes in real-time across your application
- **Persistent Settings**: All preferences saved to localStorage

### 🌓 Mode Tab
- **Dark Mode** 🌙 - Modern dark interface
- **Light Mode** ☀️ - Clean light interface
- **Layout Selector** - Choose navigation layout (Top/Left/Right)

### 🎨 Theme Tab

#### Dark Mode Themes (14 themes)
| Theme | Hue | Description |
|-------|-----|-------------|
| Default Dark | 240° | Classic blue theme |
| Cyberpunk | 320° | Neon pink/purple |
| Neon City | 180° | Electric cyan |
| Midnight | 240° | Deep blue night |
| Deep Ocean | 200° | Ocean depths |
| Forest Night | 140° | Dark green forest |
| Volcanic | 10° | Red/orange lava |
| Aurora | 160° | Northern lights |
| Purple Haze | 280° | Deep purple |
| Emerald | 150° | Dark green gem |
| Ruby | 350° | Dark red gem |
| Sapphire | 220° | Deep blue gem |
| Onyx | 0° | Pure monochrome |
| Mystic | 270° | Mysterious purple |

#### Light Mode Themes (14 themes)
| Theme | Hue | Description |
|-------|-----|-------------|
| Default Light | 210° | Soft blue |
| Sky Blue | 200° | Clear sky |
| Mint Fresh | 160° | Fresh mint green |
| Sunrise | 30° | Warm orange |
| Golden Hour | 45° | Golden yellow |
| Spring | 110° | Fresh green |
| Summer | 190° | Bright blue |
| Autumn | 25° | Warm orange |
| Winter | 200° | Cool blue |
| Coral | 10° | Soft coral pink |
| Lavender | 270° | Soft purple |
| Peach | 20° | Warm peach |
| Sage | 120° | Muted green |
| Cream | 40° | Soft warm neutral |

### 🌊 Color Harmony System

**Traditional Modes:**
- Complementary (180°)
- Split Complementary
- Triadic (120°)
- Tetradic (90°)
- Analogous (±30°)

**Wave Theory Modes:**
- Beat Pattern
- Harmonic Series
- Doppler Shift
- Standing Wave

### 🎛️ Fine-Tune Controls
- **Hue Slider**: 0-360° color selection
- **Saturation Slider**: 0-100% intensity control
- **Lightness Slider**: 0-100% brightness control
- **Live Preview**: See your color in real-time

## 🚀 Usage

### Basic Setup
```html
<!-- Include WBColorHarmony (optional, for harmony features) -->
<script src="path/to/wb-color-harmony.js"></script>

<!-- Include Advanced Control Panel -->
<script src="path/to/wb-control-panel-advanced.js"></script>

<script>
  // Create control panel
  const panel = document.createElement('wb-control-panel-advanced');
  document.body.appendChild(panel);
</script>
```

### CSS Variables Setup
```css
:root {
  --hue-primary: 240;
  --saturation-primary: 70;
  --lightness-primary: 50;
  
  --primary: hsl(var(--hue-primary), var(--saturation-primary), var(--lightness-primary));
  --accent: hsl(60, 60%, 50%);
  --secondary: hsl(210, 50%, 55%);
}
```

### Listening to Events
```javascript
// Mode changes
document.addEventListener('wb:mode-changed', (e) => {
  console.log('Mode:', e.detail.mode); // 'dark' or 'light'
});

// Theme changes
document.addEventListener('wb:theme-changed', (e) => {
  console.log('Theme:', e.detail.theme);
  console.log('Theme Data:', e.detail.themeData);
});

// Layout changes
document.addEventListener('wb:layout-changed', (e) => {
  console.log('Layout:', e.detail.layout);
});
```

## 🎯 How It Works

### Tab System
1. **Mode Tab**: Select your base appearance (Dark/Light) and layout
2. **Theme Tab**: Choose from mode-specific themes and fine-tune colors

### Smart Theme Switching
- Switch to Dark mode → See 14 dark themes
- Switch to Light mode → See 14 light themes
- Each mode has its own curated theme library

### Color Application
1. Select a theme → Colors automatically applied to CSS variables
2. Adjust sliders → Fine-tune the selected theme
3. Change harmony mode → Accent and secondary colors recalculate

### Persistence
All settings saved to localStorage:
- `wb-mode` - Current mode (dark/light)
- `wb-theme` - Current theme name
- `wb-harmony-mode` - Harmony calculation mode
- `wb-hue-primary` - Current hue value
- `wb-sat-primary` - Current saturation value
- `wb-light-primary` - Current lightness value

## 🎨 Theme Categories

### 🌿 Nature Themes
Perfect for organic, natural designs
- Ocean, Forest, Desert, Aurora, Emerald

### 🏙️ Urban Themes
Modern, tech-forward aesthetics
- Cyberpunk, Neon City, Onyx, Sapphire

### ⏰ Time-Based Themes
Capture different times of day
- Sunrise, Golden Hour, Midnight, Dawn

### 🎭 Mood Themes
Express different emotions
- Calm (Sage), Energetic (Neon), Warm (Peach), Mysterious (Mystic)

### 🍂 Seasonal Themes
Match the seasons
- Spring, Summer, Autumn, Winter

## 💡 Best Practices

### For Designers
1. Start with a **Mode** that matches your brand
2. Browse **Themes** in that mode for inspiration
3. Use **Fine-Tune** sliders to perfect the colors
4. Experiment with different **Harmony Modes**

### For Developers
1. Use CSS variables for all color references
2. Listen to theme change events for custom logic
3. Test your design in both Dark and Light modes
4. Integrate with WBColorHarmony for advanced features

## 🔧 Configuration

### Adding Custom Themes
Edit the `getThemesForMode()` method in `wb-control-panel-advanced.js`:

```javascript
dark: {
  'my-theme': { 
    name: 'My Custom Theme', 
    hue: 180, 
    sat: 75, 
    light: 50 
  },
  // ... other themes
}
```

### Customizing Appearance
Modify the Shadow DOM styles in the `render()` method to match your design system.

## 🎯 Integration Examples

### With Your Design System
```javascript
// Apply theme to your custom components
document.addEventListener('wb:theme-changed', (e) => {
  const { hue, sat, light } = e.detail.themeData;
  
  // Update your design system
  myDesignSystem.setPrimaryColor(hue, sat, light);
});
```

### With React/Vue/Angular
```javascript
// React example
useEffect(() => {
  const handleThemeChange = (e) => {
    setTheme(e.detail.theme);
  };
  
  document.addEventListener('wb:theme-changed', handleThemeChange);
  
  return () => {
    document.removeEventListener('wb:theme-changed', handleThemeChange);
  };
}, []);
```

## 📊 Technical Details

### Component Name
`wb-control-panel-advanced`

### Browser Support
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support  
- Safari: ✅ Full support (14+)

### Dependencies
- Optional: `WBColorHarmony` for advanced harmony calculations
- Uses Shadow DOM for style encapsulation
- Uses localStorage for persistence

### File Size
- **JS**: ~15KB (uncompressed)
- **No external dependencies** (except optional WBColorHarmony)

## 🐛 Troubleshooting

### Themes not appearing
- Ensure you're on the **Theme tab**
- Check that mode is set correctly
- Verify `getThemesForMode()` returns themes

### Colors not applying
- Check CSS variable names match your stylesheet
- Verify `:root` selector is used for variables
- Ensure no inline styles override variables

### Settings not persisting
- Check localStorage is enabled in browser
- Verify no browser extensions block localStorage
- Check browser console for errors

## 🚀 Future Enhancements
- [ ] Custom theme builder
- [ ] Theme import/export
- [ ] Color palette generator
- [ ] Accessibility checker
- [ ] Theme preview mode
- [ ] Animation controls
- [ ] More harmony modes

## 📝 Changelog

### Version 1.0.0 (Current)
- ✨ Initial release
- 🎨 Two-tab interface
- 🌓 Mode-specific themes (20+ themes)
- 🌊 HCS integration
- 💾 Full persistence
- 🎛️ Fine-tune controls

## 📄 License
MIT License - Use freely in your projects!

---

**Built with ❤️ for the Website Builder system**
