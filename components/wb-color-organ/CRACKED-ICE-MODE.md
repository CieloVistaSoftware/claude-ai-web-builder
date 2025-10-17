# ❄️ Cracked Ice Mode - Feature Summary

## Overview

The **Cracked Ice** mode creates a fractured glass/acrylic effect with overlapping translucent shards that respond to audio in a mesmerizing way.

## Visual Effects

### 🔷 Glass/Acrylic Appearance
- **Translucent shards** with subtle transparency (85-100% alpha)
- **Frosted glass overlay** with gradient refraction
- **Highlight shimmer** that flashes on audio peaks
- **Depth shadows** for 3D dimensional effect
- **Border highlights** that mimic light refraction

### 🎨 Shard Properties
- **Random positioning** - Natural fractured pattern
- **Variable sizes** - 8-33vmin for organic look
- **Random rotation** - Each shard at unique angle
- **Layered effect** - Shards overlap creating depth

## Audio Reactive Behavior

### 🎵 Bass (Low Frequencies)
- **Drives hue shifts** - Colors rotate around wheel
- **Subtle rotation** - Shards gently rotate (±3°)
- Creates dramatic color changes

### 🎤 Mids (Vocals/Instruments)
- **Controls saturation** - Makes colors more vivid
- **Boosts up to 30%** saturation increase
- Adds intensity during melodic parts

### 🎼 Treble (High Frequencies)
- **Adjusts lightness** - Shimmers brighter/darker
- **Glass overlay opacity** - Increases shimmer effect
- **Highlight flashes** - Creates sparkle on peaks
- Range: 30-85% lightness

### 💥 Beat Detection
- **Pulse scaling** - All shards scale together
- **Phase-based variation** - Each shard has unique timing
- **Highlight bursts** - White flash on strong beats

## Technical Details

### Generation
```javascript
// 2.5x more shards than color count
const shardCount = colorCount * 2.5;

// Example: 8 colors = 20 shards
// Example: 16 colors = 40 shards
```

### Positioning
- Absolute positioning with % values
- Random within 0-100% of viewport
- Overlap encouraged for depth

### Performance
- Uses `will-change` for optimized transforms
- `backdrop-filter: blur(2px)` for glass effect
- Smooth 60fps animations
- Hardware accelerated transforms

## CSS Features

### Multi-layer Structure
```
.wb-color-organ-shard (main container)
  ├── ::before (frosted edge)
  ├── ::after (depth shadow)
  ├── .shard-glass-overlay (refraction)
  └── .shard-highlight (shimmer)
```

### Box Shadows
- Outer: 4px 12px blur for depth
- Inner top: White highlight
- Inner bottom: Dark shadow
- Inner inset: Depth definition

## Usage

### Activate Cracked Ice Mode
```javascript
const colorOrgan = document.querySelector('wb-color-organ');
colorOrgan.setMode('cracked-ice');
```

### With Control Panel
```html
<wb-control-panel></wb-control-panel>
<wb-color-organ></wb-color-organ>
```

User selects "❄️ Cracked Ice" from mode dropdown

### Adjust Shard Count
```javascript
// More shards = denser fractured effect
colorOrgan.setColorCount(16); // = 40 shards
```

## Demo Files

1. **demo.html** - All modes including cracked ice
2. **demo-cracked-ice.html** - Dedicated cracked ice showcase

### demo-cracked-ice.html Features
- Auto-starts in cracked ice mode
- Audio simulation enabled by default
- Interactive controls:
  - ❄️ Toggle visualization
  - 🎨 Cycle harmony modes
  - 🔢 Change shard count
  - 🎵 Toggle audio simulation

### Keyboard Shortcuts
- `SPACE` - Toggle visualization
- `H` - Change harmony mode
- `C` - Change shard count
- `A` - Toggle audio
- `ESC` - Close

## Recommended Settings

### For Dense Fracture
```javascript
colorOrgan.setColorCount(16); // 40 shards
colorOrgan.setHarmonyMode('triadic');
```

### For Sparse Elegance
```javascript
colorOrgan.setColorCount(6); // 15 shards
colorOrgan.setHarmonyMode('complementary');
```

### For Maximum Drama
```javascript
colorOrgan.setColorCount(20); // 50 shards
colorOrgan.setHarmonyMode('standingWave');
```

## Browser Compatibility

- ✅ Chrome/Edge 90+ (full effect with backdrop-filter)
- ✅ Firefox 88+ (works, slightly different glass effect)
- ✅ Safari 14+ (full support)
- ⚠️ backdrop-filter fallback provided

## Performance Notes

- **Optimal:** 15-30 shards (60 FPS solid)
- **Acceptable:** 30-50 shards (60 FPS on modern hardware)
- **Heavy:** 50+ shards (may drop to 45-50 FPS)

Uses `requestAnimationFrame` for smooth animation loop.

## Inspiration

This mode is inspired by:
- **Cracked ice acrylic** - Textured plastic sheets
- **Fractured glass art** - Shattered glass installations
- **Kaleidoscopes** - Color refraction patterns
- **Ice crystals** - Natural frozen patterns

## Comparison to Block Mode

| Feature | Blocks Mode | Cracked Ice Mode |
|---------|-------------|------------------|
| Layout | Grid-based | Random scatter |
| Count | Exact | 2.5x color count |
| Overlap | No | Yes |
| Transparency | Opaque | Translucent |
| Effects | Simple | Multi-layer |
| Visual Style | Bold, clean | Ethereal, complex |
| Best For | Clear visualization | Artistic expression |

## Future Enhancements

Potential additions:
- [ ] Crack pattern animations
- [ ] Shatter/reform transitions
- [ ] Prism/rainbow edge effects
- [ ] Particle trails on movement
- [ ] Depth-based parallax

---

**Created:** 2025-01-15
**Version:** 1.0.0
**Component:** wb-color-organ
