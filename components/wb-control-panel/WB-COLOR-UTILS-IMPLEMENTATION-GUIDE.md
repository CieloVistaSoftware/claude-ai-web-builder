# WB Color Utils - Complete Implementation Guide

## 📦 Phase 1: Create wb-color-utils Module - READY TO IMPLEMENT

This document contains all files needed to create the new wb-color-utils module.
Please create the directory `C:\Users\jwpmi\Downloads\AI\wb\components\wb-color-utils\` and add these files:

---

## FILE 1: wb-color-utils.js

[Full JavaScript code with all 4 classes - see separate artifact or previous message]

Key exports:
- WaveModulation (PM, FM, AM, combined, cascade, getWaveValue)
- AudioAnalyzer (analyzeFrequencies, mapToColor, getEnergy, hasAudio)
- Heterodyne (mix, generatePalette)
- ColorConversion (hslToHex, hslToRgb, toHslString)

---

## FILE 2: claude.md

[See previous message - comprehensive activity log]

Tracks:
- Why we created this (Option A - single source of truth)
- All exported classes and methods
- Wave formulas from yesterday
- Usage examples
- Components using this module

---

## FILE 3: wb-color-utils.schema.json

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "WB Color Utils",
  "description": "Shared utility module for wave modulation and audio analysis",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "const": "wb-color-utils"
    },
    "version": {
      "type": "string",
      "const": "1.0.0"
    },
    "exports": {
      "type": "object",
      "properties": {
        "WaveModulation": {
          "type": "object",
          "description": "Wave modulation functions for color animation",
          "properties": {
            "pm": { "type": "function", "description": "Phase Modulation" },
            "fm": { "type": "function", "description": "Frequency Modulation" },
            "am": { "type": "function", "description": "Amplitude Modulation" },
            "combined": { "type": "function", "description": "Combined modulation" },
            "getWaveValue": { "type": "function", "description": "Generate wave shapes" },
            "cascade": { "type": "function", "description": "Phase-shifted ripple effect" }
          }
        },
        "AudioAnalyzer": {
          "type": "object",
          "description": "Audio frequency analysis for color mapping",
          "properties": {
            "analyzeFrequencies": { "type": "function", "description": "Split into bass/mids/highs" },
            "mapToColor": { "type": "function", "description": "Map audio to HSL" },
            "getEnergy": { "type": "function", "description": "Overall audio intensity" },
            "hasAudio": { "type": "function", "description": "Detect audio presence" }
          }
        },
        "Heterodyne": {
          "type": "object",
          "description": "Wave mixing for color harmony",
          "properties": {
            "mix": { "type": "function", "description": "Heterodyne mix two frequencies" },
            "generatePalette": { "type": "function", "description": "Generate 8-color palette" }
          }
        },
        "ColorConversion": {
          "type": "object",
          "description": "Color format conversion utilities",
          "properties": {
            "hslToHex": { "type": "function", "description": "HSL to HEX" },
            "hslToRgb": { "type": "function", "description": "HSL to RGB" },
            "toHslString": { "type": "function", "description": "Create HSL string" }
          }
        }
      }
    },
    "usedBy": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Components that import from this module",
      "examples": ["wb-color-organ", "wb-color-harmony", "wb-control-panel"]
    }
  }
}
```

---

## FILE 4: README.md

```markdown
# WB Color Utils

Shared utility module for wave modulation, audio analysis, and color harmony.

## Purpose

Single source of truth for all wave-based color formulas used across components.

## Exports

### WaveModulation
Pure mathematical functions for PM/FM/AM wave modulation.

- `pm(baseHue, depth, waveValue)` - Phase Modulation
- `fm(baseHue, depth, time, rate)` - Frequency Modulation
- `am(baseSaturation, depth, waveValue)` - Amplitude Modulation
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
```

---

## 📋 Next Steps After Creating Files:

1. **Create directory**: `components/wb-color-utils/`
2. **Add 4 files**: wb-color-utils.js, claude.md, wb-color-utils.schema.json, README.md
3. **Phase 2**: Refactor wb-color-organ to import from wb-color-utils
4. **Phase 3**: Update wb-color-harmony to import from wb-color-utils
5. **Phase 4**: Update wb-control-panel integration

---

## ✅ Ready to Proceed

All files are documented and ready. The wb-color-utils module is the foundation for eliminating code duplication across all color components.

