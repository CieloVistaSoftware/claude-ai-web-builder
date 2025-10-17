# claude.md for wb-color-utils

## 📅 October 16, 2025 - Component Created

### ✅ Purpose: Single Source of Truth for Wave Formulas
Created shared utility module to eliminate code duplication across color components.

### 🎯 Architecture Decision: Option A
**Why centralize?**
- DRY Principle: Write formulas once, use everywhere
- Consistency: Same math across all components
- Maintainability: Fix bugs in one place
- Testability: Test formulas independently
- Reusability: Easy to add new components

### 📦 Exported Classes

#### 1. **WaveModulation** - Pure Math for Color Animation
- `pm(baseHue, depth, waveValue)` - Phase Modulation (modulates HUE)
- `fm(baseHue, depth, time, rate)` - Frequency Modulation (modulates RATE)
- `am(baseSaturation, depth, waveValue)` - Amplitude Modulation (modulates SATURATION)
- `combined(h, s, l, time, depth, rate)` - All three at once
- `getWaveValue(time, shape)` - Generate wave shapes (sine, triangle, sawtooth, square)
- `cascade(...)` - Phase-shifted modulation for ripple effects

#### 2. **AudioAnalyzer** - Audio → Color Mapping
- `analyzeFrequencies(audioDataArray, sensitivity)` - Split audio into bass/mids/highs
- `mapToColor(audioData, baseHue, baseSat, baseLight)` - Standard mapping:
  - Bass → Hue shifts
  - Mids → Saturation boosts
  - Highs → Lightness changes
- `getEnergy(audioData)` - Overall intensity (0-1)
- `hasAudio(audioData, threshold)` - Detect if audio is playing

#### 3. **Heterodyne** - Wave Mixing for Harmony
- `mix(carrier, modulator, depth)` - Radio wave heterodyne mixing
  - Returns: sum, difference, upper/lower sidebands, beat frequencies
- `generatePalette(carrier, modulator, depth, sat, light)` - 8-color palette from mixing

#### 4. **ColorConversion** - Format Utilities
- `hslToHex(h, s, l)` - Convert to HEX
- `hslToRgb(h, s, l)` - Convert to RGB
- `toHslString(h, s, l)` - Create HSL string

### 🔌 Components Using This Module

| Component | Uses | Purpose |
|-----------|------|---------|
| **wb-color-organ** | WaveModulation, AudioAnalyzer | Full-screen audio-reactive visualization |
| **wb-color-harmony** | Heterodyne, ColorConversion | Palette generation & export |
| **wb-control-panel** | Heterodyne (optional) | Color harmony controls |

### 📐 Wave Modulation Formulas (from yesterday's work)

**PM (Phase Modulation):**
```javascript
modulatedHue = baseHue + (depth * waveValue)
```

**FM (Frequency Modulation):**
```javascript
const fmModulator = Math.sin(time * 0.3);
const instantFreq = rate * (1 + fmModulator);
modulatedHue = baseHue + (depth * Math.sin(time * instantFreq * 5));
```

**AM (Amplitude Modulation):**
```javascript
modulatedSat = Math.max(0, Math.min(100, baseSat + (depth * waveValue)));
```

**Heterodyne Mixing:**
```javascript
sumFreq = (carrier + modulator) % 360;
diffFreq = Math.abs(carrier - modulator);
upperSideband = (carrier + diffFreq) % 360;
lowerSideband = (carrier - diffFreq + 360) % 360;
```

### 🎵 Audio → Color Mapping (Standard)
```javascript
// Bass (0-15% of frequency spectrum) → Hue shifts (±60°)
hue = baseHue + (bass * 60);

// Mids (15-50%) → Saturation boosts (+30%)
sat = baseSat + (mids * 30);

// Highs (50-100%) → Lightness changes (±10%)
light = baseLight + ((highs - 0.5) * 20);
```

### 🌊 Wave Shapes Available
1. **Sine** - Smooth, natural oscillation
2. **Triangle** - Linear up/down
3. **Sawtooth** - Ramp up, instant drop
4. **Square** - Instant transitions (on/off)

### ✅ Benefits of This Architecture

1. **Single Responsibility**: wb-color-utils = Pure math only
2. **Separation of Concerns**:
   - wb-color-organ = Visual display
   - wb-color-harmony = Palette design
   - wb-color-utils = Math formulas
3. **Tree-Shaking**: Import only what you need
4. **Easy Testing**: Test formulas in isolation
5. **No Duplication**: DRY principle enforced

### 📋 Next Steps
1. ✅ Create wb-color-utils.js with all classes
2. ✅ Create claude.md (this file)
3. ⏳ Create wb-color-utils.schema.json
4. ⏳ Create README.md
5. ⏳ Refactor wb-color-organ to import from here
6. ⏳ Update wb-color-harmony to import from here
7. ⏳ Update tests

### 🔍 Usage Examples

**Example 1: PM Modulation in color-organ**
```javascript
import { WaveModulation } from '../wb-color-utils/wb-color-utils.js';

// In animation loop
const waveValue = WaveModulation.getWaveValue(time, 'sine');
const modulatedHue = WaveModulation.pm(baseHue, 15, waveValue);
```

**Example 2: Audio Analysis in color-organ**
```javascript
import { AudioAnalyzer } from '../wb-color-utils/wb-color-utils.js';

// Analyze audio
const audio = AudioAnalyzer.analyzeFrequencies(audioDataArray, 5);
const color = AudioAnalyzer.mapToColor(audio, 240, 70, 50);

// Apply to blocks
block.style.backgroundColor = `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;
```

**Example 3: Heterodyne in color-harmony**
```javascript
import { Heterodyne } from '../wb-color-utils/wb-color-utils.js';

// Generate palette
const palette = Heterodyne.generatePalette(240, 60, 50, 70, 50);
// Returns 8 colors: carrier, modulator, sum, difference, sidebands, beats
```

### 💡 Key Insight: Behavior Injection via WBBaseComponent

The WBBaseComponent allows behavior injection (logging, events, theme handling), but **mathematical formulas should remain pure functions**. This utility module is intentionally NOT a component because:
- It's stateless (pure functions)
- No DOM interaction
- No lifecycle methods needed
- Just math that both components can use

This keeps the separation clean: WBBaseComponent for component behavior, wb-color-utils for pure calculations.

---

*Logged by Claude following the claude.md-per-folder rule for single responsibility tracking*
