# Color Theory for Website Builder

<style>
.color-swatch {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 3px;
  border: 1px solid #ccc;
  margin: 0 3px;
  vertical-align: middle;
}

.color-row {
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-harmony-demo {
  display: flex;
  gap: 4px;
  margin: 8px 0;
}

.color-harmony-demo .color-swatch {
  width: 30px;
  height: 30px;
  border-radius: 6px;
}

.primary-swatch {
  border: 3px solid #333 !important;
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px #333;
}
</style>

## Overview

This document explains the color theory principles implemented in the Website Builder's color components and theme system. Understanding these concepts is essential for creating harmonious color schemes and effective user interfaces.

## HSL Color Model

### What is HSL?

HSL stands for **Hue, Saturation, and Lightness** - a color model that represents colors in a way that's more intuitive for designers and developers than RGB.

- **Hue (H)**: The color type on the color wheel (0-360°)
- **Saturation (S)**: The intensity or purity of the color (0-100%)
- **Lightness (L)**: How light or dark the color is (0-100%)

### Why HSL?

HSL is superior to RGB for theme generation because:

1. **Intuitive Color Relationships**: Easy to create color variations
2. **Predictable Modifications**: Adjusting saturation/lightness maintains color harmony
3. **Accessibility**: Simple to create proper contrast ratios
4. **Theme Consistency**: Easier to maintain color relationships across themes

## Color Wheel and Relationships

### The 360° Color Wheel

Our `color-bar` component with `type="hue"` represents the full color spectrum:

<div class="color-row">
  <strong>0°/360°: Red</strong>
  <span class="color-swatch" style="background-color: hsl(0, 100%, 50%);"></span>
  <code>hsl(0, 100%, 50%)</code>
</div>

<div class="color-row">
  <strong>60°: Yellow</strong>
  <span class="color-swatch" style="background-color: hsl(60, 100%, 50%);"></span>
  <code>hsl(60, 100%, 50%)</code>
</div>

<div class="color-row">
  <strong>120°: Green</strong>
  <span class="color-swatch" style="background-color: hsl(120, 100%, 50%);"></span>
  <code>hsl(120, 100%, 50%)</code>
</div>

<div class="color-row">
  <strong>180°: Cyan</strong>
  <span class="color-swatch" style="background-color: hsl(180, 100%, 50%);"></span>
  <code>hsl(180, 100%, 50%)</code>
</div>

<div class="color-row">
  <strong>240°: Blue</strong>
  <span class="color-swatch" style="background-color: hsl(240, 100%, 50%);"></span>
  <code>hsl(240, 100%, 50%)</code>
</div>

<div class="color-row">
  <strong>300°: Magenta</strong>
  <span class="color-swatch" style="background-color: hsl(300, 100%, 50%);"></span>
  <code>hsl(300, 100%, 50%)</code>
</div>

### Color Relationships

#### Complementary Colors
Colors directly opposite each other on the color wheel (180° apart):

**Red ↔ Cyan Example:**
<div class="color-harmony-demo">
  <span class="color-swatch primary-swatch" style="background-color: hsl(0, 100%, 50%);" title="Red - Primary"></span>
  <span class="color-swatch" style="background-color: hsl(180, 100%, 50%);" title="Cyan - Complementary"></span>
</div>

**Blue ↔ Orange Example:**
<div class="color-harmony-demo">
  <span class="color-swatch primary-swatch" style="background-color: hsl(240, 100%, 50%);" title="Blue - Primary"></span>
  <span class="color-swatch" style="background-color: hsl(60, 100%, 50%);" title="Orange - Complementary"></span>
</div>

**Green ↔ Magenta Example:**
<div class="color-harmony-demo">
  <span class="color-swatch primary-swatch" style="background-color: hsl(120, 100%, 50%);" title="Green - Primary"></span>
  <span class="color-swatch" style="background-color: hsl(300, 100%, 50%);" title="Magenta - Complementary"></span>
</div>

- **Use Case**: High contrast, vibrant combinations
- **Best For**: Call-to-action buttons, emphasis

**Implementation**: Our color-bars demo uses this for accent colors.

```javascript
// Calculate complementary hue
const complementary = (primaryHue + 180) % 360;
```

#### Split-Complementary Colors
Uses the two colors adjacent to the complement (150° and 210° from primary):

**Blue + Split-Complementary Example:**
<div class="color-harmony-demo">
  <span class="color-swatch primary-swatch" style="background-color: hsl(240, 100%, 50%);" title="Blue - Primary (240°)"></span>
  <span class="color-swatch" style="background-color: hsl(30, 100%, 50%);" title="Orange-Red (30°)"></span>
  <span class="color-swatch" style="background-color: hsl(90, 100%, 50%);" title="Yellow-Green (90°)"></span>
</div>

- More subtle than pure complementary
- Still provides good contrast with less tension
- Creates a triangular relationship on the color wheel

```javascript
// Calculate split-complementary hues
const splitComp1 = (primaryHue + 150) % 360;
const splitComp2 = (primaryHue + 210) % 360;
```

#### Analogous Colors
Colors adjacent on the color wheel (within 30° of each other):

**Blue + Analogous Example:**
<div class="color-harmony-demo">
  <span class="color-swatch" style="background-color: hsl(210, 100%, 50%);" title="Blue-Green (210°)"></span>
  <span class="color-swatch primary-swatch" style="background-color: hsl(240, 100%, 50%);" title="Blue - Primary (240°)"></span>
  <span class="color-swatch" style="background-color: hsl(270, 100%, 50%);" title="Blue-Purple (270°)"></span>
</div>

- Create harmonious, low-contrast combinations
- Very pleasing to the eye, naturally occurring
- **Best For**: Backgrounds, gradients, subtle variations

```javascript
// Calculate analogous colors
const analogous1 = (primaryHue - 30 + 360) % 360;
const analogous2 = (primaryHue + 30) % 360;
```

#### Triadic Colors
Three colors evenly spaced on the color wheel (120° apart):

**Primary Triadic Example (RGB):**
<div class="color-harmony-demo">
  <span class="color-swatch primary-swatch" style="background-color: hsl(0, 100%, 50%);" title="Red - Primary (0°)"></span>
  <span class="color-swatch" style="background-color: hsl(120, 100%, 50%);" title="Green (120°)"></span>
  <span class="color-swatch" style="background-color: hsl(240, 100%, 50%);" title="Blue (240°)"></span>
</div>

**Secondary Triadic Example:**
<div class="color-harmony-demo">
  <span class="color-swatch primary-swatch" style="background-color: hsl(60, 100%, 50%);" title="Yellow - Primary (60°)"></span>
  <span class="color-swatch" style="background-color: hsl(180, 100%, 50%);" title="Cyan (180°)"></span>
  <span class="color-swatch" style="background-color: hsl(300, 100%, 50%);" title="Magenta (300°)"></span>
</div>

- Create vibrant, balanced color schemes
- High contrast while maintaining harmony
- **Best For**: Primary, secondary, and tertiary theme colors

```javascript
// Calculate triadic colors
const triadic1 = (primaryHue + 120) % 360;
const triadic2 = (primaryHue + 240) % 360;
```

#### Tetradic (Rectangle) Colors
Two pairs of complementary colors forming a rectangle:

**Tetradic Example:**
<div class="color-harmony-demo">
  <span class="color-swatch primary-swatch" style="background-color: hsl(0, 100%, 50%);" title="Red - Primary (0°)"></span>
  <span class="color-swatch" style="background-color: hsl(60, 100%, 50%);" title="Yellow (60°)"></span>
  <span class="color-swatch" style="background-color: hsl(180, 100%, 50%);" title="Cyan (180°)"></span>
  <span class="color-swatch" style="background-color: hsl(240, 100%, 50%);" title="Blue (240°)"></span>
</div>

- Four colors total, very rich color scheme
- **Best For**: Complex interfaces with many accent colors

```javascript
// Calculate tetradic colors (rectangle)
const tetradic1 = (primaryHue + 60) % 360;
const tetradic2 = (primaryHue + 180) % 360;
const tetradic3 = (primaryHue + 240) % 360;
```

#### Square Colors
Four colors evenly spaced on the color wheel (90° apart):

**Square Example:**
<div class="color-harmony-demo">
  <span class="color-swatch primary-swatch" style="background-color: hsl(0, 100%, 50%);" title="Red - Primary (0°)"></span>
  <span class="color-swatch" style="background-color: hsl(90, 100%, 50%);" title="Yellow-Green (90°)"></span>
  <span class="color-swatch" style="background-color: hsl(180, 100%, 50%);" title="Cyan (180°)"></span>
  <span class="color-swatch" style="background-color: hsl(270, 100%, 50%);" title="Blue-Purple (270°)"></span>
</div>

- Balanced but dynamic color scheme
- **Best For**: Playful, energetic designs

```javascript
// Calculate square colors
const square1 = (primaryHue + 90) % 360;
const square2 = (primaryHue + 180) % 360;
const square3 = (primaryHue + 270) % 360;
```

#### Monochromatic Colors
Different shades, tints, and tones of the same hue:

**Monochromatic Blue Example:**
<div class="color-harmony-demo">
  <span class="color-swatch" style="background-color: hsl(240, 30%, 80%);" title="Light Blue - Low Saturation, High Lightness"></span>
  <span class="color-swatch" style="background-color: hsl(240, 70%, 60%);" title="Medium Blue"></span>
  <span class="color-swatch primary-swatch" style="background-color: hsl(240, 100%, 50%);" title="True Blue - Primary"></span>
  <span class="color-swatch" style="background-color: hsl(240, 100%, 30%);" title="Dark Blue - Low Lightness"></span>
  <span class="color-swatch" style="background-color: hsl(240, 100%, 15%);" title="Navy Blue - Very Low Lightness"></span>
</div>

- Vary only saturation and lightness
- **Best For**: Minimalist designs, creating depth with one color

```javascript
// Calculate monochromatic variations
const monoLight = { hue: primaryHue, saturation: primarySat * 0.7, lightness: 80 };
const monoDark = { hue: primaryHue, saturation: primarySat * 1.2, lightness: 30 };
```

## Saturation and Lightness

### Saturation (Color Intensity)

Saturation controls how vivid or muted a color appears:

**Saturation Gradient (Blue Hue at 50% Lightness):**
<div class="color-harmony-demo">
  <span class="color-swatch" style="background-color: hsl(240, 0%, 50%);" title="0% Saturation - Grayscale"></span>
  <span class="color-swatch" style="background-color: hsl(240, 25%, 50%);" title="25% Saturation"></span>
  <span class="color-swatch" style="background-color: hsl(240, 50%, 50%);" title="50% Saturation"></span>
  <span class="color-swatch" style="background-color: hsl(240, 75%, 50%);" title="75% Saturation"></span>
  <span class="color-swatch primary-swatch" style="background-color: hsl(240, 100%, 50%);" title="100% Saturation - Pure Color"></span>
</div>

- **100% Saturation**: Pure, vivid color
- **50% Saturation**: Moderately muted
- **0% Saturation**: Grayscale (no color)

**Implementation**: Our `color-bar` with `type="saturation"` shows a gradient from grayscale to full color intensity.

### Lightness (Brightness)

Lightness controls how light or dark a color appears:

**Lightness Gradient (Blue Hue at 100% Saturation):**
<div class="color-harmony-demo">
  <span class="color-swatch" style="background-color: hsl(240, 100%, 0%);" title="0% Lightness - Black"></span>
  <span class="color-swatch" style="background-color: hsl(240, 100%, 25%);" title="25% Lightness"></span>
  <span class="color-swatch primary-swatch" style="background-color: hsl(240, 100%, 50%);" title="50% Lightness - True Color"></span>
  <span class="color-swatch" style="background-color: hsl(240, 100%, 75%);" title="75% Lightness"></span>
  <span class="color-swatch" style="background-color: hsl(240, 100%, 100%);" title="100% Lightness - White"></span>
</div>

- **100% Lightness**: White (regardless of hue/saturation)
- **50% Lightness**: True color representation
- **0% Lightness**: Black (regardless of hue/saturation)

**Implementation**: Our `color-bar` with `type="lightness"` shows a gradient from black through the true color to white.

## Color Component Implementation

### color-bar Component

The `color-bar` component implements color theory through three types:

```html
<!-- Hue spectrum (color wheel) -->
<color-bar type="hue" hue="240" saturation="70" lightness="50">
  <span slot="label">Hue</span>
</color-bar>

<!-- Saturation gradient (gray to full color) -->
<color-bar type="saturation" hue="240" saturation="70" lightness="50" value="70">
  <span slot="label">Saturation</span>
</color-bar>

<!-- Lightness gradient (black to white) -->
<color-bar type="lightness" hue="240" saturation="70" lightness="50" value="50">
  <span slot="label">Lightness</span>
</color-bar>
```

### color-bars Component

The `color-bars` component combines all three aspects for complete HSL control:

```html
<color-bars hue="240" saturation="70" lightness="50" theme="dark">
</color-bars>
```

## Theme Generation Principles

### Creating Harmonious Themes

1. **Start with a Primary Color**: Choose a hue that represents your brand or mood
2. **Generate Complementary Accent**: Use the opposite hue for contrast
3. **Create Variations**: Adjust saturation and lightness for hierarchy
4. **Maintain Relationships**: Keep consistent saturation/lightness ratios

### Predefined Theme Examples

Our color-bars demo includes these theory-based themes:

<div class="color-row">
  <strong>Material Design:</strong>
  <span class="color-swatch" style="background-color: hsl(240, 70%, 50%);" title="Material Blue"></span>
  <code>hsl(240, 70%, 50%)</code>
</div>

<div class="color-row">
  <strong>Ocean:</strong>
  <span class="color-swatch" style="background-color: hsl(200, 80%, 45%);" title="Ocean Blue"></span>
  <code>hsl(200, 80%, 45%)</code>
</div>

<div class="color-row">
  <strong>Forest:</strong>
  <span class="color-swatch" style="background-color: hsl(120, 60%, 40%);" title="Forest Green"></span>
  <code>hsl(120, 60%, 40%)</code>
</div>

<div class="color-row">
  <strong>Sunset:</strong>
  <span class="color-swatch" style="background-color: hsl(25, 85%, 55%);" title="Sunset Orange"></span>
  <code>hsl(25, 85%, 55%)</code>
</div>

<div class="color-row">
  <strong>Purple:</strong>
  <span class="color-swatch" style="background-color: hsl(280, 75%, 50%);" title="Purple"></span>
  <code>hsl(280, 75%, 50%)</code>
</div>

```javascript
const themes = {
  material: { hue: 240, saturation: 70, lightness: 50 }, // Material Blue
  ocean: { hue: 200, saturation: 80, lightness: 45 },     // Ocean Blue
  forest: { hue: 120, saturation: 60, lightness: 40 },    // Forest Green
  sunset: { hue: 25, saturation: 85, lightness: 55 },     // Sunset Orange
  purple: { hue: 280, saturation: 75, lightness: 50 }     // Purple
};
```

### Accent Color Calculation

Our current implementation uses **complementary colors** for accent generation, but could be enhanced to support multiple color harmony types:

#### Current Implementation (Complementary)
```javascript
function calculateAccentColor(primaryHue, primarySaturation, primaryLightness) {
  // Complementary hue (opposite on color wheel)
  const accentHue = (primaryHue + 180) % 360;
  
  // Harmonious saturation (slightly reduced for balance)
  const accentSaturation = Math.max(60, primarySaturation - 10);
  
  // Contrasting lightness (darker if primary is light, lighter if dark)
  const accentLightness = primaryLightness > 50 
    ? primaryLightness - 15 
    : primaryLightness + 15;
    
  return { hue: accentHue, saturation: accentSaturation, lightness: accentLightness };
}
```

#### Enhanced Multi-Harmony Implementation
```javascript
function calculateColorHarmony(primaryHue, primarySat, primaryLight, harmonyType = 'complementary') {
  const harmonies = {
    complementary: [(primaryHue + 180) % 360],
    splitComplementary: [(primaryHue + 150) % 360, (primaryHue + 210) % 360],
    analogous: [(primaryHue - 30 + 360) % 360, (primaryHue + 30) % 360],
    triadic: [(primaryHue + 120) % 360, (primaryHue + 240) % 360],
    square: [(primaryHue + 90) % 360, (primaryHue + 180) % 360, (primaryHue + 270) % 360],
    tetradic: [(primaryHue + 60) % 360, (primaryHue + 180) % 360, (primaryHue + 240) % 360]
  };
  
  return harmonies[harmonyType].map(hue => ({
    hue,
    saturation: Math.max(60, primarySat - 10),
    lightness: primaryLight > 50 ? primaryLight - 15 : primaryLight + 15
  }));
}
```

## Accessibility Considerations

### Contrast Ratios

When generating themes, ensure proper contrast ratios:

- **Normal text**: 4.5:1 minimum contrast ratio
- **Large text**: 3:1 minimum contrast ratio
- **Interactive elements**: Must meet contrast requirements

### Lightness Guidelines

For accessibility-compliant themes:

- **Dark backgrounds**: Use lightness values 0-30%
- **Light backgrounds**: Use lightness values 70-100%
- **Text on dark**: Use lightness values 80-100%
- **Text on light**: Use lightness values 0-20%

## Best Practices

### Color Selection

1. **Start with Purpose**: Choose colors that match your content's mood and purpose
2. **Test in Context**: Always preview colors in actual interface elements
3. **Consider Color Blindness**: Test with color blindness simulators
4. **Maintain Consistency**: Use the same HSL relationships across your theme

### Theme Development

1. **Use HSL Values**: Always work in HSL for easier manipulation
2. **Document Relationships**: Record the mathematical relationships between colors
3. **Test Both Themes**: Ensure designs work in both light and dark modes
4. **Progressive Enhancement**: Start with basic colors, add complexity gradually

### Component Usage

1. **Leverage Automatic Calculations**: Use our accent color generation
2. **Maintain Context**: Always update related colors when primary changes
3. **Provide Visual Feedback**: Show live previews of color changes
4. **Store Preferences**: Remember user's theme choices

## Advanced Color Theory

### Color Temperature

- **Warm Colors** (0°-60°, 300°-360°): Reds, oranges, yellows - energetic, exciting
- **Cool Colors** (120°-240°): Greens, blues, purples - calming, professional

### Color Psychology

- **Red (0°)**: Energy, passion, urgency
- **Orange (30°)**: Enthusiasm, creativity, warmth
- **Yellow (60°)**: Happiness, optimism, attention
- **Green (120°)**: Nature, growth, harmony
- **Blue (240°)**: Trust, stability, professionalism
- **Purple (280°)**: Luxury, creativity, mystery

### Semantic Color Usage

In web interfaces, colors often have semantic meaning:

- **Primary**: Main brand color, primary actions
- **Secondary**: Supporting actions, less important elements
- **Success**: Positive feedback, completed actions (usually green)
- **Warning**: Caution, attention needed (usually orange/yellow)
- **Error**: Problems, failed actions (usually red)
- **Info**: Neutral information (usually blue)

## Color Component API

### Events and Properties

Both `color-bar` and `color-bars` components emit standard events:

```javascript
// Listen for color changes
colorPicker.addEventListener('colorchange', (e) => {
  const { hue, saturation, lightness, hex, hsl, rgb } = e.detail;
  // Update your theme based on color theory principles
});
```

### Programmatic Control

```javascript
// Set colors using HSL values
colorPicker.setColor(240, 70, 50); // Blue with good saturation and medium lightness

// Get current color data
const colorData = colorPicker.color;
console.log(colorData.hsl); // "hsl(240, 70%, 50%)"
```

## Conclusion

Understanding color theory enhances the effectiveness of the Website Builder's color system. By leveraging HSL relationships, complementary color calculations, and accessibility principles, developers can create more harmonious and user-friendly interfaces.

The `color-bar` and `color-bars` components implement these theories practically, making it easier to create professional color schemes without deep color theory knowledge while still providing the flexibility for advanced users to apply sophisticated color relationships.