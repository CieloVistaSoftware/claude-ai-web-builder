# WB Color Organ 🎵🎨

Audio-reactive full-screen color visualization component for the Website Builder system.

## Features

- 🎵 **Audio Reactive** - Responds to real-time audio input (browser tab or microphone)
- 🎨 **Color Harmony** - Integrates with WBColorHarmony system for beautiful color combinations
- 🌊 **Wave Theory** - Uses both traditional color theory and radio wave concepts
- ⚡ **High Performance** - Smooth 60fps animations using requestAnimationFrame
- 📱 **Responsive** - Works on desktop, tablet, and mobile devices
- ♿ **Accessible** - Respects prefers-reduced-motion and high-contrast preferences
- ⌨️ **Keyboard Control** - ESC to close, full keyboard navigation

## Installation

### 1. Include Files

```html
<!-- CSS -->
<link rel="stylesheet" href="styles/wb-color-organ.css">

<!-- JavaScript -->
<script src="components/wb-color-harmony/wb-color-harmony.js"></script>
<script src="components/wb-color-organ/wb-color-organ.js"></script>
```

### 2. Add Component to HTML

```html
<wb-color-organ></wb-color-organ>
```

## Usage

### Basic Usage

```javascript
// Get component
const colorOrgan = document.querySelector('wb-color-organ');

// Show color organ
colorOrgan.show();

// Hide color organ
colorOrgan.hide();
```

### With Control Panel Integration

The component automatically listens for events from `wb-control-panel`:

```html
<!-- Control panel will fire events -->
<wb-control-panel></wb-control-panel>

<!-- Color organ listens and responds -->
<wb-color-organ></wb-color-organ>
```

When the user enables "Color Organ" in the control panel:
1. Audio permissions are requested
2. Audio analysis begins
3. Color organ activates automatically
4. Colors animate in sync with audio

### Programmatic Control

```javascript
const colorOrgan = document.querySelector('wb-color-organ');

// Set visualization mode
colorOrgan.setMode('blocks');     // blocks, gradient, pulse, wave

// Set color harmony algorithm
colorOrgan.setHarmonyMode('triadic');

// Set number of color blocks
colorOrgan.setColorCount(12);

// Get current state
const state = colorOrgan.getState();
console.log(state);
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `mode` | string | `"blocks"` | Visualization mode: blocks, gradient, pulse, wave |
| `harmony-mode` | string | `"complementary"` | Color harmony algorithm |
| `color-count` | number | `8` | Number of color blocks (2-16) |
| `base-hue` | number | `240` | Base hue for colors (0-360) |
| `saturation` | number | `70` | Color saturation (0-100) |
| `lightness` | number | `50` | Color lightness (0-100) |

## Events

### Events Emitted

| Event | Detail | Description |
|-------|--------|-------------|
| `wb:color-organ-shown` | `{ mode: string }` | Fired when color organ becomes visible |
| `wb:color-organ-hidden` | `{}` | Fired when color organ is hidden |
| `wb:color-organ-ready` | `{ component }` | Fired when component is initialized |

### Events Listened

| Event | Source | Description |
|-------|--------|-------------|
| `wb:color-organ-toggle` | `wb-control-panel` | Enable/disable color organ |
| `wb:audio-data` | `wb-control-panel` | Real-time audio data (bass, mids, treble) |
| `wb:color-beat` | `wb-control-panel` | Beat detection events |
| `colorchange` | `wb-color-bars` | Color updates from control panel |

## Methods

### `show()`
Display the color organ full screen.

```javascript
colorOrgan.show();
```

### `hide()`
Hide the color organ.

```javascript
colorOrgan.hide();
```

### `setMode(mode: string)`
Set visualization mode.

```javascript
colorOrgan.setMode('pulse');
```

**Valid modes:** `blocks`, `gradient`, `pulse`, `wave`

### `setHarmonyMode(mode: string)`
Set color harmony algorithm.

```javascript
colorOrgan.setHarmonyMode('triadic');
```

**Valid modes:** 
- Traditional: `complementary`, `splitComplementary`, `triadic`, `tetradic`, `analogous`
- Wave Theory: `beatPattern`, `harmonicSeries`, `dopplerShift`, `standingWave`

### `setColorCount(count: number)`
Set number of color blocks (2-16).

```javascript
colorOrgan.setColorCount(12);
```

### `getState()`
Get current component state.

```javascript
const state = colorOrgan.getState();
console.log(state.enabled, state.mode, state.audioData);
```

## Audio Reactive Features

### How It Works

The color organ analyzes audio input in real-time:

1. **Bass (Low Frequencies 0-15%)** → Drives **HUE** shifts
   - Makes colors rotate around the color wheel
   - Creates dramatic color changes

2. **Mids (Mid Frequencies 15-50%)** → Controls **SATURATION**
   - Vocals and instruments make colors more intense
   - Adds vibrancy on melodic elements

3. **Treble (High Frequencies 50-100%)** → Adjusts **LIGHTNESS**
   - High-pitched sounds make colors brighter
   - Creates sparkle and brightness variations

4. **Beat Detection** → Triggers pulse effects
   - Strong bass hits cause momentary scaling
   - Creates rhythmic visual feedback

### Audio Sources

#### Browser Tab Audio (Recommended)
Captures audio directly from another browser tab:

```javascript
// User selects tab in permission dialog
// Best for music players like Spotify, YouTube, etc.
```

**Pros:**
- Clean audio signal
- No ambient noise
- Perfect for music visualization

**Cons:**
- Requires Chrome/Edge (not supported in Firefox)
- User must grant screen sharing permission

#### Microphone
Captures audio from system microphone:

```javascript
// Standard microphone access
// Works with speaking, singing, or environmental sounds
```

**Pros:**
- Works in all browsers
- Great for live performances
- Can visualize ambient sounds

**Cons:**
- Picks up background noise
- Audio quality depends on mic

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `ESC` | Close color organ |
| `Ctrl + O` | Toggle (when control panel present) |

## Styling

The component uses CSS variables from the main design system:

```css
/* Override default styles */
wb-color-organ {
    --organ-transition-speed: 0.05s;
    --organ-scale-effect: 0.1;
}
```

### Color Block Customization

```css
.wb-color-organ-block {
    /* Customize individual blocks */
    border-radius: 8px;
    transition: all 0.1s;
}
```

### Control Overlay

```css
.wb-color-organ-controls {
    /* Reposition controls */
    top: 1rem;
    right: 1rem;
}
```

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ⚠️ Tab Audio only works in Chrome/Edge

## Performance

- **60 FPS** smooth animations
- **Low CPU usage** (~5-10% on modern hardware)
- **Optimized rendering** using requestAnimationFrame
- **Memory efficient** with proper cleanup

## Examples

### Example 1: Standalone

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="styles/wb-color-organ.css">
</head>
<body>
    <button onclick="document.querySelector('wb-color-organ').show()">
        Launch Color Organ
    </button>
    
    <wb-color-organ></wb-color-organ>
    
    <script src="components/wb-color-harmony/wb-color-harmony.js"></script>
    <script src="components/wb-color-organ/wb-color-organ.js"></script>
</body>
</html>
```

### Example 2: With Control Panel

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/wb-color-organ.css">
</head>
<body>
    <!-- Control panel provides audio input -->
    <wb-control-panel></wb-control-panel>
    
    <!-- Color organ visualizes audio -->
    <wb-color-organ></wb-color-organ>
    
    <script src="components/wb-control-panel/wb-color-harmony.js"></script>
    <script src="components/wb-control-panel/wb-control-panel.js"></script>
    <script src="components/wb-color-organ/wb-color-organ.js"></script>
</body>
</html>
```

### Example 3: Custom Configuration

```html
<wb-color-organ 
    mode="pulse"
    harmony-mode="triadic"
    color-count="12"
    base-hue="180"
    saturation="80"
    lightness="55">
</wb-color-organ>

<script>
    const organ = document.querySelector('wb-color-organ');
    
    // Listen for ready
    document.addEventListener('wb:color-organ-ready', () => {
        console.log('Color organ ready!');
    });
    
    // Custom event handling
    document.addEventListener('wb:color-organ-shown', () => {
        console.log('Now showing!');
    });
</script>
```

## Demo

See `demo.html` for a complete working example with simulated audio.

## Integration Guide

### Step 1: Add to Page

```html
<wb-color-organ></wb-color-organ>
```

### Step 2: Enable in Control Panel

User clicks "Enable Color Organ" toggle in control panel.

### Step 3: Grant Audio Permission

User grants audio permission when prompted.

### Step 4: Play Music

Audio reactive visualization begins automatically!

## Troubleshooting

### Colors not animating?
- Check that audio permissions were granted
- Verify audio is actually playing (check browser tab audio indicator)
- Try adjusting sensitivity in control panel

### Performance issues?
- Reduce number of colors (4-6 instead of 12-16)
- Use 'blocks' mode instead of 'gradient' or 'wave'
- Check browser developer tools for errors

### Tab audio not working?
- Tab audio only works in Chrome/Edge
- Must select "Share audio" checkbox in permission dialog
- Switch to microphone input as alternative

## License

Part of the Website Builder component library.

## Version

1.0.0 - Initial release with full audio-reactive features

---

**Built with ❤️ using Web Audio API and Canvas**
