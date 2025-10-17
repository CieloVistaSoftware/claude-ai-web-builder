# WB Color Utils

Shared utility module for wave modulation, audio analysis, and color harmony.

## Purpose

Single source of truth for all wave-based color formulas used across components.

## Exports

### WaveModulation
Pure mathematical functions for PM/FM/AM wave modulation.

- `pm(baseHue, depth, waveValue)` - Phase Modulation (modulates HUE)
- `fm(baseHue, depth, time, rate)` - Frequency Modulation (modulates RATE)
- `am(baseSaturation, depth, waveValue)` - Amplitude Modulation (modulates SATURATION)
- `combined(h, s, l, time, depth, rate)` - All three at once
- `getWaveValue(time, shape)` - Generate wave shapes (sine, triangle, sawtooth, square)
- `cascade(...)` - Phase-shifted modulation for ripple effects

### AudioAnalyzer
Analyzes audio frequency data and maps to color parameters.

- `analyzeFrequencies(audioDataArray, sensitivity)` - Split audio into bass/mids/highs
- `mapToColor(audioData, baseHue, baseSat, baseLight)` - Map audio to HSL
- `getEnergy(audioData)` - Overall audio intensity
- `hasAudio(audioData, threshold)` - Detect if audio is playing

### Heterodyne
Implements radio wave heterodyne mixing for color harmony.

- `mix(carrier, modulator, depth)` - Generate sum/difference frequencies
- `generatePalette(carrier, modulator, depth, sat, light)` - 8-color palette

### ColorConversion
Helper functions for color format conversion.

- `hslToHex(h, s, l)` - Convert HSL to HEX
- `hslToRgb(h, s, l)` - Convert HSL to RGB
- `toHslString(h, s, l)` - Create HSL string

## Usage

```javascript
import { WaveModulation, AudioAnalyzer, Heterodyne } from '../wb-color-utils/wb-color-utils.js';

// Wave modulation
const waveValue = WaveModulation.getWaveValue(time, 'sine');
const hue = WaveModulation.pm(240, 15, waveValue);

// Audio analysis
const audio = AudioAnalyzer.analyzeFrequencies(audioDataArray, 5);
const color = AudioAnalyzer.mapToColor(audio, 240, 70, 50);

// Heterodyne mixing
const palette = Heterodyne.generatePalette(240, 60, 50, 70, 50);
```

## Components Using This Module

- **wb-color-organ** - Audio-reactive visualization
- **wb-color-harmony** - Palette generation
- **wb-control-panel** - Color controls

## Wave Formulas

**PM:** `modulatedHue = baseHue + (depth * waveValue)`  
**FM:** `modulatedHue = baseHue + (depth * sin(time * instantFreq * 5))`  
**AM:** `modulatedSat = baseSat + (depth * waveValue)`

## Audio Mapping

- **Bass** (0-15% freq) → Hue shifts (±60°)
- **Mids** (15-50%) → Saturation boosts (+30%)
- **Highs** (50-100%) → Lightness changes (±10%)

## Version

1.0.0
