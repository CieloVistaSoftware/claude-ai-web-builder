# Control Panel UI Mockup - Mode + Named Themes

## 📐 Visual Layout

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🎨 Control Panel                ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                  ┃
┃  🌓 Mode                         ┃
┃  ┌────────────────────────┐     ┃
┃  │ 🌙 Dark Mode        ▼ │     ┃
┃  └────────────────────────┘     ┃
┃  Options: Dark Mode, Light Mode  ┃
┃                                  ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                  ┃
┃  🎭 Theme Type                   ┃
┃  ┌────────────────────────┐     ┃
┃  │ Named Theme         ▼ │     ┃
┃  └────────────────────────┘     ┃
┃  Options:                        ┃
┃    • Custom (HSL Sliders)        ┃
┃    • Named Theme                 ┃
┃                                  ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                  ┃
┃  ┌─ When "Named Theme" ─────┐   ┃
┃  │                           │   ┃
┃  │  Select a Theme:          │   ┃
┃  │                           │   ┃
┃  │  ┌─────┬─────┬─────┐     │   ┃
┃  │  │ 💼  │ 🌃  │ 🌊  │     │   ┃
┃  │  │Blue │Cyber│Ocean│     │   ┃
┃  │  └─────┴─────┴─────┘     │   ┃
┃  │  ┌─────┬─────┬─────┐     │   ┃
┃  │  │ 🌅  │ 🌲  │ 💜  │     │   ┃
┃  │  │Sun  │For  │Lav  │     │   ┃
┃  │  └─────┴─────┴─────┘     │   ┃
┃  │  ┌─────┬─────┬─────┐     │   ┃
┃  │  │ 🌸  │ 🌌  │ ✨  │     │   ┃
┃  │  │Sak  │Mid  │Neon │     │   ┃
┃  │  └─────┴─────┴─────┘     │   ┃
┃  │  ... (16 total themes)    │   ┃
┃  │                           │   ┃
┃  │  [Show More ▼]            │   ┃
┃  └───────────────────────────┘   ┃
┃                                  ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                  ┃
┃  ┌─ When "Custom" ──────────┐   ┃
┃  │                           │   ┃
┃  │  Primary Color:           │   ┃
┃  │                           │   ┃
┃  │  Hue                      │   ┃
┃  │  [====●=============] 240°│   ┃
┃  │                           │   ┃
┃  │  Saturation               │   ┃
┃  │  [===========●======]  70%│   ┃
┃  │                           │   ┃
┃  │  Lightness                │   ┃
┃  │  [========●=========]  50%│   ┃
┃  │                           │   ┃
┃  │  Harmony Mode             │   ┃
┃  │  ┌──────────────────┐    │   ┃
┃  │  │ Complementary ▼ │    │   ┃
┃  │  └──────────────────┘    │   ┃
┃  │                           │   ┃
┃  │  Preview:                 │   ┃
┃  │  ┌────┬────┬────┬────┐   │   ┃
┃  │  │Pri │Acc │Sec │BG  │   │   ┃
┃  │  └────┴────┴────┴────┘   │   ┃
┃  └───────────────────────────┘   ┃
┃                                  ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                  ┃
┃  Layout: [Top Nav ▼]             ┃
┃  Edit Mode: [Toggle]             ┃
┃                                  ┃
┃  💾 Save  📋 Clone  🔄 Reset     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

## 🎯 User Flow

### **Flow 1: Quick Theme Selection**
```
1. User selects Mode: "Dark Mode" ✓
2. User selects Theme Type: "Named Theme" ✓
3. Grid of 16 themes appears
4. User clicks "🌃 Cyberpunk"
5. Done! Colors applied instantly
```

### **Flow 2: Custom Color Design**
```
1. User selects Mode: "Light Mode" ✓
2. User selects Theme Type: "Custom" ✓
3. HSL sliders appear
4. User adjusts:
   - Hue: 180° (cyan)
   - Saturation: 85%
   - Lightness: 55%
5. User selects Harmony: "Triadic"
6. Preview updates live
7. User clicks "Apply"
8. Done! Custom colors applied
```

### **Flow 3: Mix and Match**
```
1. User starts with "Named Theme" → "Ocean" 🌊
2. Switches to "Custom"
3. Sliders show Ocean's base HSL (200°, 80%, 50%)
4. User fine-tunes: Hue to 195°
5. Changes harmony from "Analogous" to "Complementary"
6. New custom variant created!
```

## 🔧 Technical Implementation

### **Mode Changes Affect:**
```javascript
function applyMode(mode) {
    if (mode === 'dark') {
        CSS.setProperty('--bg-lightness', '10%');
        CSS.setProperty('--text-lightness', '95%');
        CSS.setProperty('--surface-lightness', '15%');
    } else {
        CSS.setProperty('--bg-lightness', '98%');
        CSS.setProperty('--text-lightness', '10%');
        CSS.setProperty('--surface-lightness', '95%');
    }
}
```

### **Theme Selection Flow:**
```javascript
function applyNamedTheme(themeName, mode) {
    // 1. Load theme config
    const theme = themes.namedThemes[themeName];
    
    // 2. Get HCS config
    const { baseHue, baseSat, baseLight, harmonyMode } = theme.hcsConfig;
    
    // 3. Calculate full palette via HCS
    const palette = HCS.calculate(baseHue, baseSat, baseLight, harmonyMode);
    
    // 4. Apply mode adjustments
    const modeConfig = themes.modes[mode];
    palette.background.lightness = modeConfig.backgroundLightness;
    palette.text.lightness = modeConfig.textLightness;
    
    // 5. Apply to control panel FIRST
    applyToControlPanel(palette);
    
    // 6. Fire event for page
    document.dispatchEvent(new CustomEvent('wb:theme-changed', {
        detail: { palette, mode, themeName, harmonyMode }
    }));
}
```

### **Reactive Updates:**
```javascript
// When mode changes
modeDropdown.addEventListener('change', (e) => {
    currentMode = e.target.value;
    
    // Re-apply current theme with new mode
    if (currentThemeType === 'namedTheme') {
        applyNamedTheme(currentTheme, currentMode);
    } else {
        applyCustomColors(currentHSL, currentHarmonyMode, currentMode);
    }
});

// When theme type changes
themeTypeDropdown.addEventListener('change', (e) => {
    if (e.target.value === 'namedTheme') {
        // Show theme grid, hide sliders
        showThemeGrid();
        hideSliders();
    } else {
        // Show sliders, hide theme grid
        showSliders();
        hideThemeGrid();
    }
});
```

## 📊 Data Structure

```javascript
// Current state
const controlPanelState = {
    mode: 'dark',                    // 'dark' | 'light'
    themeType: 'namedTheme',         // 'custom' | 'namedTheme'
    
    // If namedTheme selected:
    selectedTheme: 'cyberpunk',
    
    // If custom selected:
    customHSL: { hue: 240, sat: 70, light: 50 },
    customHarmonyMode: 'complementary',
    
    // Computed palette (from HCS)
    currentPalette: {
        primary: { h, s, l },
        accent: { h, s, l },
        secondary: { h, s, l },
        background: { h, s, l },
        text: { h, s, l },
        border: { h, s, l }
    }
};
```

## ✅ Implementation Checklist

- [ ] Update control panel config to use themes-hcs-v2.json
- [ ] Add Mode dropdown (Dark/Light)
- [ ] Add Theme Type dropdown (Custom/Named Theme)
- [ ] Create theme grid UI (16 tiles with icons)
- [ ] Show/hide sliders based on theme type
- [ ] Integrate HCS calculator
- [ ] Apply mode adjustments to palette
- [ ] Update control panel's own colors first
- [ ] Fire events for page to listen
- [ ] Save state to localStorage
- [ ] Add "Show More" pagination for themes
- [ ] Add search/filter for themes

**Ready to implement?** 🚀
