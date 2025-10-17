// FIX FOR wb-control-panel.js
// Replace the handleColorBarsChange and applyColorToAll methods with these versions

// ============================================================
// METHOD 1: handleColorBarsChange (around line 1450)
// ============================================================
handleColorBarsChange(e, colorType) {
    console.log(`🎨 Color bars change detected for ${colorType}:`, e.detail);
    
    const colorData = e.detail;
    
    // Update current colors tracking
    this.currentColors[colorType] = {
        hue: colorData.hue,
        saturation: colorData.saturation,
        lightness: colorData.lightness
    };
    
    // ✅ FIX: Apply color to BOTH control panel AND page (including text colors!)
    this.applyColorToAll(colorType, colorData);
    
    logEvent('info', `${colorType} color changed and applied: ${colorData.hsl}`);
    console.log(`🎨 Applied ${colorType} color to control panel and page: ${colorData.hex}`);
}

// ============================================================
// METHOD 2: handleColorBarsSelect (around line 1468)
// ============================================================
handleColorBarsSelect(e, colorType) {
    const colorData = e.detail;
    
    // Apply final color to both control panel and page
    this.applyColorToAll(colorType, colorData);
    
    // Save to localStorage for persistence
    localStorage.setItem(`wb-${colorType}-color`, JSON.stringify(colorData));
    
    logEvent('success', `${colorType} color selected and saved: ${colorData.hex}`);
    console.log(`💾 Saved ${colorType} color to localStorage and applied to all`);
}

// ============================================================
// METHOD 3: applyColorToAll (NEW - add around line 1476)
// ============================================================
/**
 * Apply colors to both control panel and page INCLUDING TEXT COLORS
 * @param {string} colorType - Type of color (primary, background)
 * @param {Object} colorData - Color data object with hsl, hex, hue, saturation, lightness
 */
applyColorToAll(colorType, colorData) {
    const { hsl, hex } = colorData;
    
    // Determine CSS variable names based on color type
    let primaryVar, secondaryVar, textVar;
    if (colorType === 'primary') {
        primaryVar = '--primary';
        secondaryVar = '--primary-rgb';
        textVar = '--text-primary'; // ✅ ADD TEXT COLOR VARIABLE
    } else if (colorType === 'background') {
        primaryVar = '--bg-primary';
        secondaryVar = '--background';
        // Background doesn't directly set text color
    }
    
    // 1️⃣ Apply to PAGE (:root / document.documentElement)
    if (primaryVar) {
        document.documentElement.style.setProperty(primaryVar, hsl);
        console.log(`✅ Applied ${hsl} to page ${primaryVar}`);
    }
    
    // 1a️⃣ Also apply to TEXT COLOR variable if this is primary color
    if (textVar) {
        document.documentElement.style.setProperty(textVar, hsl);
        console.log(`✅ Applied ${hsl} to page text color ${textVar}`);
    }
    
    // 2️⃣ Apply to CONTROL PANEL (this component's style)
    if (primaryVar) {
        this.style.setProperty(primaryVar, hsl);
        console.log(`✅ Applied ${hsl} to control panel ${primaryVar}`);
    }
    
    // 2a️⃣ Also apply text color to control panel
    if (textVar) {
        this.style.setProperty(textVar, hsl);
        console.log(`✅ Applied ${hsl} to control panel text color ${textVar}`);
    }
    
    // 3️⃣ Also set RGB format if needed (convert hex to rgb)
    if (secondaryVar && hex) {
        const rgb = this.hexToRgb(hex);
        if (rgb) {
            const rgbValue = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
            document.documentElement.style.setProperty(secondaryVar, rgbValue);
            this.style.setProperty(secondaryVar, rgbValue);
        }
    }
    
    // 4️⃣ Dispatch event for other components to react
    document.dispatchEvent(new CustomEvent('wb:color-applied', {
        detail: {
            colorType,
            colorData,
            appliedTo: ['page', 'control-panel']
        },
        bubbles: true,
        composed: true
    }));
}

// ============================================================
// INSTRUCTIONS TO APPLY THE FIX:
// ============================================================
// 1. Find handleColorBarsChange() in wb-control-panel.js (around line 1450)
// 2. Replace it with METHOD 1 above
// 
// 3. Find handleColorBarsSelect() (around line 1468)
// 4. Replace it with METHOD 2 above
//
// 5. Find or add applyColorToAll() method (around line 1476)
// 6. Replace with METHOD 3 above
//
// KEY CHANGES:
// - Added textVar = '--text-primary' for primary colors
// - Apply textVar to both document.documentElement and control panel
// - This makes text colors update when primary color hue changes!
