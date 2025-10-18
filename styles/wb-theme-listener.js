/**
 * WB Theme Event Listener
 * Listens to control panel events and applies theme changes to CSS variables
 * Include this AFTER main.css to automatically handle theme changes
 * 
 * Usage:
 * <link rel="stylesheet" href="../../styles/main.css">
 * <script src="../../styles/wb-theme-listener.js"></script>
 */

(function() {
    'use strict';
    
    console.log('🎨 WB Theme Listener initialized');
    
    // ============================================
    // MODE CHANGED (Dark/Light)
    // ============================================
    document.addEventListener('wb:mode-changed', (e) => {
        const { mode } = e.detail;
        console.log(`🌓 Mode changed to: ${mode}`);
        
        // Apply to document
        document.body.setAttribute('data-theme', mode);
        document.documentElement.setAttribute('data-theme', mode);
    });
    
    // ============================================
    // THEME CHANGED (Named or HCS)
    // ============================================
    document.addEventListener('wb:theme-changed', (e) => {
        const { theme, category, data } = e.detail;
        console.log(`🎨 Theme changed: ${theme} (${category})`, data);
        
        if (category === 'named') {
            // Named theme: single color with harmony
            applyNamedTheme(data);
        } else if (category === 'hcs') {
            // HCS theme: complete palette
            applyHCSTheme(data);
        }
    });
    
    // ============================================
    // COLOR CHANGED (Manual slider adjustment)
    // ============================================
    document.addEventListener('wb:color-changed', (e) => {
        const { hue, saturation, lightness } = e.detail;
        console.log(`🎨 Color changed: H:${hue} S:${saturation}% L:${lightness}%`);
        
        // Apply primary color
        const root = document.documentElement;
        root.style.setProperty('--hue-primary', hue);
        root.style.setProperty('--saturation-primary', saturation);
        root.style.setProperty('--lightness-primary', lightness);
        root.style.setProperty('--primary', `hsl(${hue}, ${saturation}%, ${lightness}%)`);
        root.style.setProperty('--primary-dark', `hsl(${hue}, ${saturation}%, ${lightness - 10}%)`);
        root.style.setProperty('--primary-light', `hsl(${hue}, ${saturation - 15}%, ${lightness + 15}%)`);
    });
    
    // ============================================
    // HARMONY CHANGED
    // ============================================
    document.addEventListener('wb:harmony-changed', (e) => {
        const { mode } = e.detail;
        console.log(`🌊 Harmony mode changed to: ${mode}`);
        // Harmony calculation will be handled by wb-color-harmony component
        // or we can calculate here if needed
    });
    
    // ============================================
    // LAYOUT CHANGED
    // ============================================
    document.addEventListener('wb:layout-changed', (e) => {
        const { layout } = e.detail;
        console.log(`📐 Layout changed to: ${layout}`);
        
        document.body.setAttribute('data-layout', layout);
        document.documentElement.setAttribute('data-layout', layout);
    });
    
    // ============================================
    // THEME APPLICATION FUNCTIONS
    // ============================================
    
    function applyNamedTheme(data) {
        const root = document.documentElement;
        const { hue, sat, light } = data;
        
        // Primary color
        root.style.setProperty('--hue-primary', hue);
        root.style.setProperty('--saturation-primary', sat);
        root.style.setProperty('--lightness-primary', light);
        root.style.setProperty('--primary', `hsl(${hue}, ${sat}%, ${light}%)`);
        root.style.setProperty('--primary-dark', `hsl(${hue}, ${sat}%, ${light - 10}%)`);
        root.style.setProperty('--primary-light', `hsl(${hue}, ${sat - 15}%, ${light + 15}%)`);
        
        // Calculate complementary (accent)
        const accentHue = (hue + 180) % 360;
        root.style.setProperty('--accent', `hsl(${accentHue}, ${sat - 10}%, ${light}%)`);
        root.style.setProperty('--accent-dark', `hsl(${accentHue}, ${sat - 10}%, ${light - 10}%)`);
        root.style.setProperty('--accent-light', `hsl(${accentHue}, ${sat - 25}%, ${light + 15}%)`);
        
        // Calculate analogous (secondary)
        const secondaryHue = (hue - 30 + 360) % 360;
        root.style.setProperty('--secondary', `hsl(${secondaryHue}, ${sat - 20}%, ${light + 5}%)`);
        root.style.setProperty('--secondary-dark', `hsl(${secondaryHue}, ${sat - 20}%, ${light - 5}%)`);
        root.style.setProperty('--secondary-light', `hsl(${secondaryHue}, ${sat - 35}%, ${light + 20}%)`);
        
        console.log(`✅ Named theme applied: Primary=${hue}°, Accent=${accentHue}°, Secondary=${secondaryHue}°`);
    }
    
    function applyHCSTheme(data) {
        const root = document.documentElement;
        const { colors } = data;
        
        // Primary
        root.style.setProperty('--hue-primary', colors.primary.hue);
        root.style.setProperty('--saturation-primary', colors.primary.sat);
        root.style.setProperty('--lightness-primary', colors.primary.light);
        root.style.setProperty('--primary', `hsl(${colors.primary.hue}, ${colors.primary.sat}%, ${colors.primary.light}%)`);
        root.style.setProperty('--primary-dark', `hsl(${colors.primary.hue}, ${colors.primary.sat}%, ${colors.primary.light - 10}%)`);
        root.style.setProperty('--primary-light', `hsl(${colors.primary.hue}, ${colors.primary.sat - 15}%, ${colors.primary.light + 15}%)`);
        
        // Secondary
        root.style.setProperty('--secondary', `hsl(${colors.secondary.hue}, ${colors.secondary.sat}%, ${colors.secondary.light}%)`);
        root.style.setProperty('--secondary-dark', `hsl(${colors.secondary.hue}, ${colors.secondary.sat}%, ${colors.secondary.light - 10}%)`);
        root.style.setProperty('--secondary-light', `hsl(${colors.secondary.hue}, ${colors.secondary.sat - 15}%, ${colors.secondary.light + 15}%)`);
        
        // Accent
        root.style.setProperty('--accent', `hsl(${colors.accent.hue}, ${colors.accent.sat}%, ${colors.accent.light}%)`);
        root.style.setProperty('--accent-dark', `hsl(${colors.accent.hue}, ${colors.accent.sat}%, ${colors.accent.light - 10}%)`);
        root.style.setProperty('--accent-light', `hsl(${colors.accent.hue}, ${colors.accent.sat - 15}%, ${colors.accent.light + 15}%)`);
        
        // Semantic colors
        root.style.setProperty('--success', `hsl(${colors.success.hue}, ${colors.success.sat}%, ${colors.success.light}%)`);
        root.style.setProperty('--warning', `hsl(${colors.warning.hue}, ${colors.warning.sat}%, ${colors.warning.light}%)`);
        root.style.setProperty('--danger', `hsl(${colors.danger.hue}, ${colors.danger.sat}%, ${colors.danger.light}%)`);
        root.style.setProperty('--info', `hsl(${colors.info.hue}, ${colors.info.sat}%, ${colors.info.light}%)`);
        root.style.setProperty('--neutral', `hsl(${colors.neutral.hue}, ${colors.neutral.sat}%, ${colors.neutral.light}%)`);
        
        console.log(`✅ HCS theme applied with complete palette`);
    }
    
    console.log('✅ WB Theme Listener ready - listening for control panel events');
})();
