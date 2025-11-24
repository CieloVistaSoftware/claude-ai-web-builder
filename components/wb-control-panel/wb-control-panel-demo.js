// wb-control-panel-demo.js
// Demo page logic - separate from component

// ===== SCROLL TO TOP ON PAGE LOAD =====
// Force scroll to top when page loads/refreshes
window.addEventListener('load', () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    console.log('📜 Scrolled to top on page load');
});

// Also do it immediately
window.scrollTo({ top: 0, behavior: 'instant' });

// ===== DEBUG LOGGING =====
console.log('🔍 Checking elements...');
console.log('Event log panel:', document.getElementById('event-log-panel'));
console.log('Resize handle:', document.querySelector('wb-resize-updown'));
console.log('Event log component:', document.getElementById('demo-event-log'));

// ===== RESIZE EVENT LISTENERS =====
// Listen for resize events from wb-resize-updown
document.addEventListener('wb:resize-start', (e) => {
    console.log('📏 Resize started:', e.detail);
});

document.addEventListener('wb:resize-end', (e) => {
    console.log('✅ Resize complete. Final height:', e.detail.finalHeight + 'px');
});

console.log('✅ wb-resize-updown component will handle resizing');
console.log('👆 Drag the handle at top of event log to resize');
console.log('↕️ Resize range: 100px - 600px');
console.log('💾 Height persists to localStorage');

// ===== COMPONENT INITIALIZATION =====
// Initialize demo after components load
document.addEventListener('DOMContentLoaded', async () => {
    // Get component references
    const components = {
        controlPanel: document.getElementById('control-panel'),
        nav: document.getElementById('site-nav')
    };

    // Make debug controls available globally
    window.demoControls = components;

    // ===== THEME CHANGE LISTENER =====
    // Listen for theme changes from control panel
    document.addEventListener('wb:theme-changed', (e) => {
        const theme = e.detail.theme;
        console.log('🎨 Theme change received:', theme);

        // Apply theme to html element
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);

        console.log('✅ Theme applied to page:', theme);
    });

    // ===== LAYOUT CHANGE LISTENER =====
    // Listen for layout changes from control panel
    document.addEventListener('wb:layout-changed', (e) => {
        const layout = e.detail.layout;
        console.log('🎯 Layout change received:', layout);

        // Apply layout to html element
        document.documentElement.setAttribute('data-layout', layout);
        document.body.setAttribute('data-layout', layout);
        
        // ✅ Use wb-layout component if available
        const wbLayout = document.querySelector('wb-layout');
        if (wbLayout) {
            wbLayout.setAttribute('layout', layout);
            console.log('✅ Layout applied via wb-layout component');
        } else {
            // Fallback: Apply layout classes directly
            // Remove all layout classes
            document.body.classList.remove('layout-top-nav', 'layout-left-nav', 'layout-right-nav');
            
            // Add new layout class
            document.body.classList.add(`layout-${layout}`);
            console.log(`✅ Layout class applied: layout-${layout}`);
        }

        console.log('✅ Layout applied to page:', layout);
    });
    
    // ===== FOOTER POSITION LISTENER =====
    // Listen for footer position changes
    document.addEventListener('wb:footer-position-changed', (e) => {
        const position = e.detail.position;
        console.log('👣 Footer position change received:', position);
        
        const footer = document.querySelector('footer');
        const body = document.body;
        
        if (footer) {
            // Remove any positioning first
            footer.style.position = '';
            footer.style.bottom = '';
            footer.style.zIndex = '';
            
            if (position === 'sticky') {
                // STICKY: Footer sticks to bottom of viewport (always visible)
                footer.style.position = 'fixed';
                footer.style.bottom = '0';
                footer.style.left = '0';
                footer.style.right = '0';
                footer.style.width = '100%';
                footer.style.zIndex = '50';
                
                // Add padding to body so content doesn't go under footer
                const footerHeight = footer.offsetHeight;
                body.style.paddingBottom = `${footerHeight}px`;
                
                console.log('✅ Footer set to STICKY (fixed to bottom of viewport)');
            } else {
                // NORMAL: Footer at bottom of page content (scrolls with page)
                footer.style.position = 'relative';
                footer.style.width = '100%';
                
                // Remove body padding
                body.style.paddingBottom = '0';
                
                console.log('✅ Footer set to NORMAL (bottom of page content)');
            }
        }
    });

    // ===== COLOR CHANGE LISTENER =====
    // 🎨 Listen for color changes and apply to CSS variables
    document.addEventListener('wb:color-changed', (e) => {
        const { hue, saturation, lightness, harmonyMode } = e.detail;
        console.log(`🎨 Color changed: H:${hue} S:${saturation}% L:${lightness}% Mode:${harmonyMode}`);
        
        // Apply primary color
        const root = document.documentElement;
        
        // Add smooth transition for color changes (if not already set)
        if (!root.style.getPropertyValue('--color-transition-duration')) {
            root.style.setProperty('--color-transition-duration', '0.6s');
        }
        
        root.style.setProperty('--hue-primary', hue);
        root.style.setProperty('--saturation-primary', saturation);
        root.style.setProperty('--lightness-primary', lightness);
        
        // Calculate and apply primary color
        const primaryColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        root.style.setProperty('--primary', primaryColor);
        root.style.setProperty('--primary-dark', `hsl(${hue}, ${saturation}%, ${lightness - 15}%)`);
        root.style.setProperty('--primary-light', `hsl(${hue}, ${saturation - 20}%, ${lightness + 25}%)`);
        
        // Calculate harmony colors based on harmonyMode
        // For now, use complementary as default
        const accentHue = (hue + 180) % 360;
        const accentColor = `hsl(${accentHue}, ${saturation - 10}%, ${lightness}%)`;
        root.style.setProperty('--accent', accentColor);
        root.style.setProperty('--accent-dark', `hsl(${accentHue}, ${saturation - 10}%, ${lightness - 15}%)`);
        
        const secondaryHue = (hue - 30 + 360) % 360;
        const secondaryColor = `hsl(${secondaryHue}, ${saturation - 20}%, ${lightness + 5}%)`;
        root.style.setProperty('--secondary', secondaryColor);
        root.style.setProperty('--secondary-dark', `hsl(${secondaryHue}, ${saturation - 20}%, ${lightness - 10}%)`);
        
        console.log(`✅ Colors applied with smooth transition: Primary=${primaryColor}, Accent=${accentColor}, Secondary=${secondaryColor}`);
    });

    // ===== PREMADE THEME HANDLER =====
    // 🎭 PREMADE THEMES: Apply full theme presets when theme changes
    // This handles both Named and HCS themes
    document.addEventListener('wb:theme-changed', (e) => {
        const { theme, category, data } = e.detail;
        console.log('🎭 Theme change received:', theme, 'Category:', category);

        // Apply theme to html and body
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);
        
        const root = document.documentElement;

        // ✅ HCS THEMES - Apply full color palette
        if (category === 'hcs' && data && data.colors) {
            console.log('🌊 Applying HCS theme colors:', theme);
            console.log('📊 HCS Palette:', data);
            
            // Apply all 8 colors from HCS palette
            const colors = data.colors;
            
            // ✅ PRIMARY (maps to --primary, --hue-primary, etc.)
            if (colors.primary) {
                const { hue, sat, light } = colors.primary;
                const primaryColor = `hsl(${hue}, ${sat}%, ${light}%)`;
                
                // Base primary color
                root.style.setProperty('--primary', primaryColor);
                root.style.setProperty('--hue-primary', hue);
                root.style.setProperty('--saturation-primary', sat);
                root.style.setProperty('--lightness-primary', light);
                
                // Primary variations
                root.style.setProperty('--primary-dark', `hsl(${hue}, ${sat}%, ${light - 15}%)`);
                root.style.setProperty('--primary-light', `hsl(${hue}, ${sat - 20}%, ${light + 25}%)`);
                
                console.log(`  🔵 Primary: ${primaryColor}`);
            }
            
            // ✅ SECONDARY (maps to --secondary)
            if (colors.secondary) {
                const { hue, sat, light } = colors.secondary;
                const secondaryColor = `hsl(${hue}, ${sat}%, ${light}%)`;
                
                root.style.setProperty('--secondary', secondaryColor);
                root.style.setProperty('--secondary-hue', hue);
                root.style.setProperty('--secondary-sat', sat);
                root.style.setProperty('--secondary-light', light);
                
                // Secondary variations
                root.style.setProperty('--secondary-dark', `hsl(${hue}, ${sat}%, ${light - 10}%)`);
                root.style.setProperty('--secondary-light-var', `hsl(${hue}, ${sat - 10}%, ${light + 15}%)`);
                
                console.log(`  🟣 Secondary: ${secondaryColor}`);
            }
            
            // ✅ ACCENT (maps to --accent)
            if (colors.accent) {
                const { hue, sat, light } = colors.accent;
                const accentColor = `hsl(${hue}, ${sat}%, ${light}%)`;
                
                root.style.setProperty('--accent', accentColor);
                root.style.setProperty('--accent-hue', hue);
                root.style.setProperty('--accent-sat', sat);
                root.style.setProperty('--accent-light', light);
                
                // Accent variations
                root.style.setProperty('--accent-dark', `hsl(${hue}, ${sat}%, ${light - 15}%)`);
                root.style.setProperty('--accent-light-var', `hsl(${hue}, ${sat - 15}%, ${light + 20}%)`);
                
                console.log(`  🟠 Accent: ${accentColor}`);
            }
            
            // ✅ SUCCESS (maps to --success-color)
            if (colors.success) {
                const { hue, sat, light } = colors.success;
                const successColor = `hsl(${hue}, ${sat}%, ${light}%)`;
                
                root.style.setProperty('--success-color', successColor);
                root.style.setProperty('--success-color-light', `hsl(${hue}, ${sat}%, ${light + 15}%)`);
                root.style.setProperty('--success-color-dark', `hsl(${hue}, ${sat}%, ${light - 15}%)`);
                
                console.log(`  🟢 Success: ${successColor}`);
            }
            
            // ✅ WARNING (maps to --warning-color)
            if (colors.warning) {
                const { hue, sat, light } = colors.warning;
                const warningColor = `hsl(${hue}, ${sat}%, ${light}%)`;
                
                root.style.setProperty('--warning-color', warningColor);
                root.style.setProperty('--warning-color-light', `hsl(${hue}, ${sat}%, ${light + 15}%)`);
                root.style.setProperty('--warning-color-dark', `hsl(${hue}, ${sat}%, ${light - 15}%)`);
                
                console.log(`  🟡 Warning: ${warningColor}`);
            }
            
            // ✅ DANGER (maps to --error-color, --danger-color)
            if (colors.danger) {
                const { hue, sat, light } = colors.danger;
                const dangerColor = `hsl(${hue}, ${sat}%, ${light}%)`;
                
                root.style.setProperty('--error-color', dangerColor);
                root.style.setProperty('--danger-color', dangerColor);
                root.style.setProperty('--error-color-light', `hsl(${hue}, ${sat}%, ${light + 15}%)`);
                root.style.setProperty('--error-color-dark', `hsl(${hue}, ${sat}%, ${light - 15}%)`);
                
                console.log(`  🔴 Danger/Error: ${dangerColor}`);
            }
            
            // ✅ INFO (maps to --info-color)
            if (colors.info) {
                const { hue, sat, light } = colors.info;
                const infoColor = `hsl(${hue}, ${sat}%, ${light}%)`;
                
                root.style.setProperty('--info-color', infoColor);
                root.style.setProperty('--info-color-light', `hsl(${hue}, ${sat}%, ${light + 15}%)`);
                root.style.setProperty('--info-color-dark', `hsl(${hue}, ${sat}%, ${light - 15}%)`);
                
                console.log(`  ℹ️ Info: ${infoColor}`);
            }
            
            // ✅ NEUTRAL (update neutral scale to use this hue)
            // The neutral colors use --hue-primary for their tint, so they'll auto-update
            // But we can also set a specific neutral color if needed
            if (colors.neutral) {
                const { hue, sat, light } = colors.neutral;
                const neutralColor = `hsl(${hue}, ${sat}%, ${light}%)`;
                root.style.setProperty('--neutral-color', neutralColor);
                console.log(`  ⚪ Neutral: ${neutralColor}`);
            }
            
            console.log('✅ HCS theme fully applied:', theme);
            console.log('📋 All 8 colors mapped to semantic CSS variables');
            return; // Skip named theme logic
        }

        // ✅ NAMED THEMES - Apply preset colors
        if (category === 'named') {
            console.log('🎨 Applying Named theme:', theme);
            // Named theme color logic handled by wb:color-changed event
        }

        console.log('✅ Theme applied to page:', theme);
    });

    // ===== STATUS BAR UPDATES (if exists) =====
    // Update status bar (demo page logic)
    document.addEventListener('wb:mode-changed', (e) => {
        const statusMode = document.getElementById('status-mode');
        if (statusMode) {
            statusMode.textContent = e.detail.mode.charAt(0).toUpperCase() + e.detail.mode.slice(1);
        }
    });

    document.addEventListener('wb:theme-changed', (e) => {
        const themeName = e.detail.data?.name || e.detail.theme;
        const statusTheme = document.getElementById('status-theme');
        const statusCategory = document.getElementById('status-category');
        
        if (statusTheme) {
            statusTheme.textContent = themeName;
        }
        
        if (statusCategory) {
            statusCategory.textContent = e.detail.category === 'named' ? 'Named' : 'HCS';
        }
    });

    // ===== EVENT LOG SUCCESS MESSAGE =====
    // Log success
    if (window.WBEventLog) {
        WBEventLog.logSuccess('Control Panel Demo Loaded', {
            component: 'wb-control-panel-demo'
        });
    }

    // ===== CONSOLE SUCCESS MESSAGE =====
    console.log('✅ Clean Control Panel Demo Ready!');
    console.log('🎨 Try:');
    console.log('  - Click Dark/Light button');
    console.log('  - Switch Named/HCS category');
    console.log('  - Select different themes');
    console.log('  - Adjust color sliders');
    console.log('');
    console.log('🌊 Everything updates via events - no direct DOM manipulation!');
});
