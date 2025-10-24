// Color Harmony System Demo - index.js
// Live harmony card generation with real-time color updates

console.log('🌊 Wave-Based Color Harmony System Demo initialized');

// Control panel is already loaded via HTML, no need to import

// Create a harmony utility wrapper
class HarmonySystemWrapper {
    constructor() {
        this.component = new WBColorHarmony();
        console.log('✅ Harmony wrapper created with WBColorHarmony component');
    }
    
    generatePalette(hue, mode, saturation, lightness) {
        // Calculate colors based on mode directly (since component.calculateHarmony doesn't exist)
        let colors = [];
        
        switch(mode) {
            case 'complementary':
                colors = [
                    { hue, saturation, lightness, name: 'Primary', role: 'primary' },
                    { hue: (hue + 180) % 360, saturation, lightness, name: 'Complement', role: 'accent' },
                    { hue: (hue + 30) % 360, saturation: saturation - 10, lightness, name: 'Accent', role: 'secondary' }
                ];
                break;
                
            case 'splitComplementary':
                colors = [
                    { hue, saturation, lightness, name: 'Primary', role: 'primary' },
                    { hue: (hue + 150) % 360, saturation, lightness, name: 'Split 1', role: 'secondary' },
                    { hue: (hue + 210) % 360, saturation, lightness, name: 'Split 2', role: 'accent' }
                ];
                break;
                
            case 'triadic':
                colors = [
                    { hue, saturation, lightness, name: 'Primary', role: 'primary' },
                    { hue: (hue + 120) % 360, saturation, lightness, name: 'Triadic 1', role: 'secondary' },
                    { hue: (hue + 240) % 360, saturation, lightness, name: 'Triadic 2', role: 'accent' }
                ];
                break;
                
            case 'tetradic':
                colors = [
                    { hue, saturation, lightness, name: 'Primary', role: 'primary' },
                    { hue: (hue + 90) % 360, saturation, lightness, name: 'Tetradic 1', role: 'secondary' },
                    { hue: (hue + 180) % 360, saturation, lightness, name: 'Tetradic 2', role: 'accent' }
                ];
                break;
                
            case 'analogous':
                colors = [
                    { hue, saturation, lightness, name: 'Primary', role: 'primary' },
                    { hue: (hue - 30 + 360) % 360, saturation: saturation - 10, lightness, name: 'Analogous -30', role: 'secondary' },
                    { hue: (hue + 30) % 360, saturation: saturation - 10, lightness, name: 'Analogous +30', role: 'accent' }
                ];
                break;
                
            case 'beatPattern':
                // Small frequency differences create "beats"
                colors = [
                    { hue, saturation, lightness, name: 'Primary', role: 'primary' },
                    { hue: (hue + 15) % 360, saturation, lightness, name: 'Beat +15', role: 'secondary' },
                    { hue: (hue - 15 + 360) % 360, saturation, lightness, name: 'Beat -15', role: 'accent' }
                ];
                break;
                
            case 'harmonicSeries':
                // Musical ratios: 1:2:3:4 (octaves)
                colors = [
                    { hue, saturation, lightness, name: 'Fundamental', role: 'primary' },
                    { hue: (hue * 2) % 360, saturation, lightness, name: '2nd Harmonic', role: 'secondary' },
                    { hue: (hue * 3) % 360, saturation, lightness, name: '3rd Harmonic', role: 'accent' }
                ];
                break;
                
            case 'dopplerShift':
                // Smooth directional transitions
                colors = [
                    { hue, saturation, lightness, name: 'Source', role: 'primary' },
                    { hue: (hue + 45) % 360, saturation, lightness: lightness + 5, name: 'Doppler +', role: 'secondary' },
                    { hue: (hue - 45 + 360) % 360, saturation, lightness: lightness - 5, name: 'Doppler -', role: 'accent' }
                ];
                break;
                
            case 'standingWave':
                // Evenly distributed nodes
                colors = [
                    { hue, saturation, lightness, name: 'Node 1', role: 'primary' },
                    { hue: (hue + 60) % 360, saturation, lightness, name: 'Node 2', role: 'secondary' },
                    { hue: (hue + 120) % 360, saturation, lightness, name: 'Node 3', role: 'accent' }
                ];
                break;
                
            default:
                // Fallback: complementary
                colors = [
                    { hue, saturation, lightness, name: 'Primary', role: 'primary' },
                    { hue: (hue + 180) % 360, saturation, lightness, name: 'Complement', role: 'accent' },
                    { hue: (hue + 30) % 360, saturation: saturation - 10, lightness, name: 'Accent', role: 'secondary' }
                ];
        }
        
        // Return in expected format
        return colors.map(color => ({
            hue: color.hue,
            saturation: color.saturation,
            lightness: color.lightness,
            hsl: `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`,
            hex: this.hslToHex(color.hue, color.saturation, color.lightness),
            name: color.name,
            role: color.role
        }));
    }
    
    hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }
    
    getHarmonyInfo(mode) {
        const infos = {
            'complementary': {
                name: 'Complementary',
                description: 'Colors directly opposite on the wheel',
                theory: '180° opposition creates maximum contrast'
            },
            'splitComplementary': {
                name: 'Split Complementary',
                description: 'Base color plus two adjacent to complement',
                theory: 'High contrast with more sophistication'
            },
            'triadic': {
                name: 'Triadic',
                description: 'Three colors equally spaced',
                theory: '120° spacing creates balanced vibrancy'
            },
            'tetradic': {
                name: 'Tetradic',
                description: 'Four colors in two complementary pairs',
                theory: '90° spacing offers rich complexity'
            },
            'analogous': {
                name: 'Analogous',
                description: 'Adjacent colors on the wheel',
                theory: '±30° creates smooth harmony'
            },
            'beatPattern': {
                name: 'Beat Pattern',
                description: 'Similar frequencies create rhythmic variations',
                theory: 'Wave interference patterns'
            },
            'harmonicSeries': {
                name: 'Harmonic Series',
                description: 'Musical ratios applied to hue',
                theory: '1:2:3:4 ratios create natural balance'
            },
            'dopplerShift': {
                name: 'Doppler Shift',
                description: 'Directional frequency transitions',
                theory: 'Smooth progressive color shifts'
            },
            'standingWave': {
                name: 'Standing Wave',
                description: 'Stable interference patterns',
                theory: 'Evenly distributed nodes'
            }
        };
        return infos[mode] || { name: mode, description: 'Unknown mode', theory: 'N/A' };
    }
}

// Harmony mode definitions
const harmonyModes = [
    {
        id: 'beatPattern',
        name: 'Beat Pattern',
        icon: '🌊',
        type: 'wave',
        description: 'Similar frequencies create rhythmic variations. Like tuning a radio between two stations, these colors at adjacent hues create subtle visual "beats" that feel harmonious yet dynamic.'
    },
    {
        id: 'dopplerShift',
        name: 'Doppler Shift',
        icon: '🚀',
        type: 'wave',
        description: 'Smooth directional color transitions mimicking frequency shifts of moving wave sources. Perfect for creating natural-feeling gradients and progressive color changes.'
    },
    {
        id: 'harmonicSeries',
        name: 'Harmonic Series',
        icon: '🎵',
        type: 'wave',
        description: 'Musical harmonic ratios (1:2:3:4) applied to hue for mathematically perfect color relationships. Creates naturally balanced palettes that feel "in tune".'
    },
    {
        id: 'standingWave',
        name: 'Standing Wave',
        icon: '🌀',
        type: 'wave',
        description: 'Multiple waves combine to create stable, balanced interference patterns. Results in evenly-distributed colors with natural harmonic relationships.'
    },
    {
        id: 'splitComplementary',
        name: 'Split Complementary',
        icon: '🎨',
        type: 'traditional',
        description: 'Base color plus two colors adjacent to its complement. High contrast with more sophistication than pure complementary—balances tension with harmony.'
    },
    {
        id: 'analogous',
        name: 'Analogous',
        icon: '🎨',
        type: 'traditional',
        description: 'Adjacent colors on the wheel (±30°) create smooth, harmonious transitions. Classic approach for cohesive, calming designs with minimal visual tension.'
    },
    {
        id: 'complementary',
        name: 'Complementary',
        icon: '🎨',
        type: 'traditional',
        description: 'Colors directly opposite on the wheel (180°). Maximum contrast and vibrant energy. Classic color theory approach for bold designs.'
    },
    {
        id: 'triadic',
        name: 'Triadic',
        icon: '🎨',
        type: 'traditional',
        description: 'Three colors equally spaced (120°) around the wheel. Creates balanced, vibrant palettes with visual interest and harmony.'
    },
    {
        id: 'tetradic',
        name: 'Tetradic',
        icon: '🎨',
        type: 'traditional',
        description: 'Four colors in two complementary pairs (90°). Rich, complex designs with maximum variety while maintaining balance.'
    }
];

// Generate mini UI preview for a harmony mode
function generateMiniUI(mode, harmonySystem) {
    // Get current CSS variables
    const root = document.documentElement;
    const styles = getComputedStyle(root);
    const baseHue = parseInt(styles.getPropertyValue('--hue-primary') || 240);
    const baseSat = parseInt(styles.getPropertyValue('--saturation-primary') || 70);
    const baseLight = parseInt(styles.getPropertyValue('--lightness-primary') || 50);
    
    // Generate palette for this specific harmony mode
    const palette = harmonySystem.generatePalette(baseHue, mode.id, baseSat, baseLight);
    
    // Extract colors (first 3 for primary, secondary, accent)
    const primary = palette[0] || { hsl: `hsl(${baseHue}, ${baseSat}%, ${baseLight}%)`, hue: baseHue };
    const secondary = palette[1] || { hsl: `hsl(${(baseHue + 30) % 360}, ${baseSat - 10}%, ${baseLight}%)` };
    const accent = palette[2] || { hsl: `hsl(${(baseHue + 180) % 360}, ${baseSat - 5}%, ${baseLight}%)` };
    
    return `
        <div class="live-preview-header">⚡ Live Preview - ${mode.name} Mode</div>
        <div class="live-preview">
            <div class="mini-ui">
                <!-- Color Swatches Section -->
                <div class="mini-section">
                    <div class="mini-section-title">🎨 Color System</div>
                    <div class="mini-color-swatches">
                        <div class="mini-swatch" style="background: ${primary.hsl};">
                            Primary
                        </div>
                        <div class="mini-swatch" style="background: ${secondary.hsl};">
                            Secondary
                        </div>
                        <div class="mini-swatch" style="background: ${accent.hsl};">
                            Accent
                        </div>
                    </div>
                    <div class="mini-values">
                        ${primary.hue}° | ${secondary.hue}° | ${accent.hue}°
                    </div>
                </div>
                
                <!-- Semantic Messages Section -->
                <div class="mini-section">
                    <div class="mini-section-title">📩 Messages</div>
                    <div class="mini-messages">
                        <div class="mini-message" style="background: #10b981;">
                            <span>✓</span> Success: Changes saved
                        </div>
                        <div class="mini-message" style="background: #3b82f6;">
                            <span>ℹ</span> Info: System updated
                        </div>
                        <div class="mini-message" style="background: #f59e0b;">
                            <span>⚠</span> Warning: Check settings
                        </div>
                    </div>
                </div>
                
                <!-- Interactive Buttons Section -->
                <div class="mini-section">
                    <div class="mini-section-title">🔘 Buttons</div>
                    <div class="mini-buttons">
                        <div class="mini-button" style="background: ${primary.hsl};">Primary Action</div>
                        <div class="mini-button" style="background: ${secondary.hsl};">Secondary</div>
                        <div class="mini-button" style="background: ${accent.hsl};">Accent</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Generate a harmony card using wb-card element
function generateHarmonyCard(mode, harmonySystem) {
    const badgeClass = mode.type === 'wave' ? 'badge-wave' : 'badge-traditional';
    const badgeText = mode.type === 'wave' ? 'WAVE THEORY' : 'TRADITIONAL';
    
    return `
        <wb-card variant="elevated" data-mode="${mode.id}">
            <div class="harmony-card-header">
                <div class="harmony-title">
                    <span>${mode.icon}</span>
                    <span>${mode.name}</span>
                </div>
                <span class="harmony-badge ${badgeClass}">${badgeText}</span>
            </div>
            <p class="harmony-description">
                ${mode.description}
            </p>
            ${generateMiniUI(mode, harmonySystem)}
        </wb-card>
    `;
}

// Update all harmony cards
function updateHarmonyCards(harmonySystem) {
    const container = document.getElementById('live-harmony-cards');
    if (!container || !harmonySystem) return;
    
    // Add updating animation
    container.classList.add('updating');
    
    // Generate all cards
    const cardsHTML = harmonyModes.map(mode => generateHarmonyCard(mode, harmonySystem)).join('');
    container.innerHTML = cardsHTML;
    
    // Remove animation after short delay
    setTimeout(() => container.classList.remove('updating'), 300);
    
    console.log('🎨 Updated all harmony cards with current colors');
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM loaded - Color Harmony Demo ready');
    
    // Wait a bit for WBColorHarmony to load
    setTimeout(() => {
        if (window.WBColorHarmony) {
            const harmonySystem = new HarmonySystemWrapper();
            console.log('✅ Harmony system wrapper initialized!');
            
            // Generate initial cards
            updateHarmonyCards(harmonySystem);
            
            // Generate theme × harmony matrix
            generateThemeHarmonyMatrix(harmonySystem);
            
            // Update cards when colors change
            let updateTimeout;
            const observer = new MutationObserver(() => {
                // Debounce updates
                clearTimeout(updateTimeout);
                updateTimeout = setTimeout(() => {
                    updateHarmonyCards(harmonySystem);
                }, 100);
            });
            
            // Watch for style changes on root element
            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['style']
            });
            
            console.log('✅ Live harmony cards initialized - will update on color changes!');
            console.log('🌈 Theme × Harmony matrix shows 45 combinations (5 themes × 9 modes)!');
        } else {
            console.warn('⚠️ WBColorHarmony not found - cards will not be generated');
        }
    }, 1000); // Increased timeout to 1000ms
    
    // Log when wb-demo component is ready
    const demoElement = document.querySelector('wb-demo');
    if (demoElement) {
        demoElement.addEventListener('tab-changed', (e) => {
            console.log(`📑 Tab changed to: ${e.detail.tab}`);
        });
        
        console.log('✅ wb-demo component found and event listeners attached');
    } else {
        console.warn('⚠️ wb-demo component not found - check component registration');
    }
    
    // Log when control panel is ready
    const controlPanel = document.querySelector('wb-control-panel-hcs');
    if (controlPanel) {
        console.log('✅ wb-control-panel-hcs loaded - adjust colors live!');
        
        // Listen for color changes and update cards
        controlPanel.addEventListener('color-change', (e) => {
            console.log(`🎨 Color changed: ${e.detail.property} = ${e.detail.value}`);
        });
        
        controlPanel.addEventListener('mode-change', (e) => {
            console.log(`🌓 Mode changed to: ${e.detail.mode}`);
        });
        
        controlPanel.addEventListener('theme-change', (e) => {
            console.log(`🎨 Theme changed to: ${e.detail.theme}`);
        });
    } else {
        console.warn('⚠️ wb-control-panel-hcs not found');
    }
});

// Log component loading
console.log('📦 Loading WB components...');

// Export for module usage if needed
export default {
    name: 'Color Harmony System Demo',
    version: '2.0.0',
    description: 'Wave-based color harmony with live interactive cards'
};

// Theme definitions with base colors
const themePresets = [
    {
        id: 'default',
        name: 'Default',
        icon: '🟦',
        hue: 240,
        saturation: 70,
        lightness: 50,
        description: 'Classic blue theme with balanced harmony'
    },
    {
        id: 'cyberpunk',
        name: 'Cyberpunk',
        icon: '🔮',
        hue: 300,
        saturation: 75,
        lightness: 55,
        description: 'Vibrant magenta with high energy'
    },
    {
        id: 'ocean',
        name: 'Ocean',
        icon: '🌊',
        hue: 190,
        saturation: 65,
        lightness: 50,
        description: 'Calm cyan reminiscent of deep waters'
    },
    {
        id: 'sunset',
        name: 'Sunset',
        icon: '🌅',
        hue: 30,
        saturation: 80,
        lightness: 55,
        description: 'Warm orange with golden tones'
    },
    {
        id: 'forest',
        name: 'Forest',
        icon: '🌳',
        hue: 145,
        saturation: 60,
        lightness: 45,
        description: 'Natural green evoking woodland tranquility'
    }
];

// Animation state
let animationFrame = null;
let animationTime = 0;
let isAnimationRunning = true; // Track animation state
let animationSpeed = 20; // Speed in cycles per second (0.01 to 1000)
const ANIMATION_DEPTH = 40; // Larger hue shift - ±40 degrees

// Generate compact preview card for theme × harmony combination
function generateCompactCard(theme, mode, harmonySystem, animated = false) {
    // Generate palette for this specific combination
    const palette = harmonySystem.generatePalette(theme.hue, mode.id, theme.saturation, theme.lightness);
    
    const primary = palette[0] || { hsl: `hsl(${theme.hue}, ${theme.saturation}%, ${theme.lightness}%)`, hue: theme.hue };
    const secondary = palette[1] || { hsl: `hsl(${(theme.hue + 30) % 360}, ${theme.saturation - 10}%, ${theme.lightness}%)` };
    const accent = palette[2] || { hsl: `hsl(${(theme.hue + 180) % 360}, ${theme.saturation - 5}%, ${theme.lightness}%)` };
    
    const badgeClass = mode.type === 'wave' ? 'badge-wave' : 'badge-traditional';
    const badgeText = mode.type === 'wave' ? 'WAVE' : 'TRAD';
    
    const cardId = `card-${theme.id}-${mode.id}`;
    
    return `
        <div class="compact-card ${animated ? 'animated-card' : ''}" id="${cardId}" 
             data-theme-id="${theme.id}" 
             data-mode-id="${mode.id}"
             data-base-hue="${theme.hue}"
             data-saturation="${theme.saturation}"
             data-lightness="${theme.lightness}">
            <div class="compact-header">
                <div class="compact-title">
                    <span>${mode.icon}</span>
                    <span>${mode.name}</span>
                </div>
                <span class="harmony-badge ${badgeClass}" style="font-size: 0.55rem; padding: 0.25rem 0.5rem;">${badgeText}</span>
            </div>
            <div class="compact-preview">
                <div class="compact-swatches">
                    <div class="compact-swatch" style="background: ${primary.hsl};" data-role="primary">P</div>
                    <div class="compact-swatch" style="background: ${secondary.hsl};" data-role="secondary">S</div>
                    <div class="compact-swatch" style="background: ${accent.hsl};" data-role="accent">A</div>
                </div>
                <div class="compact-buttons">
                    <div class="compact-button" style="background: ${primary.hsl};" data-role="primary">Btn</div>
                    <div class="compact-button" style="background: ${secondary.hsl};" data-role="secondary">Btn</div>
                    <div class="compact-button" style="background: ${accent.hsl};" data-role="accent">Btn</div>
                </div>
                <div class="compact-values">
                    ${primary.hue}° | ${secondary.hue}° | ${accent.hue}°
                </div>
            </div>
        </div>
    `;
}

// Generate complete theme section with all harmony modes
function generateThemeSection(theme, harmonySystem) {
    const cardsHTML = harmonyModes.map(mode => 
        generateCompactCard(theme, mode, harmonySystem, true) // Enable animation
    ).join('');
    
    return `
        <div class="theme-section">
            <div class="theme-header">
                <div class="theme-title">
                    <span>${theme.icon}</span>
                    <span>${theme.name}</span>
                </div>
                <span class="theme-badge theme-${theme.id}">${theme.name.toUpperCase()}</span>
            </div>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
                ${theme.description} — <strong>Base: ${theme.hue}°</strong> hue, ${theme.saturation}% saturation
                <span style="color: var(--accent); margin-left: 1rem;">✨ Watch colors animate with sine wave</span>
            </p>
            <div class="theme-grid">
                ${cardsHTML}
            </div>
        </div>
    `;
}

// Animate all cards with sine wave
function animateCards() {
    // Convert speed (cycles/second) to radians per frame
    // At 60 FPS: radians_per_frame = (speed * 2π) / 60
    const radiansPerFrame = (animationSpeed * Math.PI * 2) / 60;
    animationTime += radiansPerFrame;
    
    const sineValue = Math.sin(animationTime);
    const hueShift = sineValue * ANIMATION_DEPTH;
    
    // Get all animated cards
    const cards = document.querySelectorAll('.animated-card');
    
    // Debug: Log animation state every 100 frames
    if (Math.floor(animationTime * 100) % 100 === 0) {
        console.log(`🌊 Animation: time=${animationTime.toFixed(2)}, sine=${sineValue.toFixed(2)}, hueShift=${hueShift.toFixed(1)}°, speed=${animationSpeed.toFixed(2)}/s, cards=${cards.length}`);
    }
    
    cards.forEach(card => {
        const baseHue = parseInt(card.dataset.baseHue);
        const saturation = parseInt(card.dataset.saturation);
        const lightness = parseInt(card.dataset.lightness);
        const modeId = card.dataset.modeId;
        
        if (!baseHue) return;
        
        // Calculate modulated hue
        const modulatedHue = (baseHue + hueShift + 360) % 360;
        
        // Get harmony system and recalculate
        if (window.harmonySystemGlobal) {
            const palette = window.harmonySystemGlobal.generatePalette(
                modulatedHue, 
                modeId, 
                saturation, 
                lightness
            );
            
            const primary = palette[0] || { hsl: `hsl(${modulatedHue}, ${saturation}%, ${lightness}%)`, hue: modulatedHue };
            const secondary = palette[1] || { hsl: `hsl(${(modulatedHue + 30) % 360}, ${saturation - 10}%, ${lightness}%)`, hue: (modulatedHue + 30) % 360 };
            const accent = palette[2] || { hsl: `hsl(${(modulatedHue + 180) % 360}, ${saturation - 5}%, ${lightness}%)`, hue: (modulatedHue + 180) % 360 };
            
            if (primary && secondary && accent) {
                // Update swatches
                const swatches = card.querySelectorAll('.compact-swatch');
                swatches.forEach(swatch => {
                    const role = swatch.dataset.role;
                    if (role === 'primary') swatch.style.background = primary.hsl;
                    if (role === 'secondary') swatch.style.background = secondary.hsl;
                    if (role === 'accent') swatch.style.background = accent.hsl;
                });
                
                // Update buttons
                const buttons = card.querySelectorAll('.compact-button');
                buttons.forEach(button => {
                    const role = button.dataset.role;
                    if (role === 'primary') button.style.background = primary.hsl;
                    if (role === 'secondary') button.style.background = secondary.hsl;
                    if (role === 'accent') button.style.background = accent.hsl;
                });
                
                // Update values
                const values = card.querySelector('.compact-values');
                if (values) {
                    values.textContent = `${Math.round(primary.hue)}° | ${Math.round(secondary.hue)}° | ${Math.round(accent.hue)}°`;
                }
            }
        }
    });
    
    animationFrame = requestAnimationFrame(animateCards);
}

// Start animation
function startAnimation() {
    if (!animationFrame) {
        isAnimationRunning = true;
        console.log('🌊 Starting sine wave animation on all cards...');
        animateCards();
        updateAnimationButton();
    }
}

// Stop animation
function stopAnimation() {
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
        isAnimationRunning = false;
        console.log('⏸️ Animation paused');
        updateAnimationButton();
    }
}

// Toggle animation
function toggleAnimation() {
    if (isAnimationRunning) {
        stopAnimation();
        // Fire custom event
        window.dispatchEvent(new CustomEvent('animation-paused', {
            detail: { timestamp: Date.now() }
        }));
    } else {
        startAnimation();
        // Fire custom event
        window.dispatchEvent(new CustomEvent('animation-resumed', {
            detail: { timestamp: Date.now() }
        }));
    }
}

// Update button appearance
function updateAnimationButton() {
    const btn = document.getElementById('animation-toggle-btn');
    const icon = document.getElementById('animation-icon');
    const text = document.getElementById('animation-text');
    
    if (btn && icon && text) {
        if (isAnimationRunning) {
            icon.textContent = '⏸️';
            text.textContent = 'Pause Animation';
            btn.style.background = 'var(--primary)';
        } else {
            icon.textContent = '▶️';
            text.textContent = 'Resume Animation';
            btn.style.background = 'var(--success-color, #10b981)';
        }
    }
}

// Generate complete theme × harmony matrix
function generateThemeHarmonyMatrix(harmonySystem) {
    const container = document.getElementById('theme-harmony-matrix');
    if (!container || !harmonySystem) return;
    
    // Store harmony system globally for animation
    window.harmonySystemGlobal = harmonySystem;
    
    console.log('🌈 Generating complete Theme × Harmony matrix (5 themes × 9 modes = 45 combinations)...');
    
    const sectionsHTML = themePresets.map(theme => 
        generateThemeSection(theme, harmonySystem)
    ).join('');
    
    container.innerHTML = sectionsHTML;
    
    console.log('✅ Theme × Harmony matrix generated successfully!');
    
    // Start sine wave animation
    setTimeout(() => {
        startAnimation();
        
        // Setup animation toggle button
        const toggleBtn = document.getElementById('animation-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggleAnimation);
            console.log('✅ Animation toggle button connected');
        }
        
        // Setup animation speed slider
        const speedSlider = document.getElementById('animation-speed');
        const speedDisplay = document.getElementById('speed-display');
        if (speedSlider && speedDisplay) {
            speedSlider.addEventListener('input', (e) => {
                animationSpeed = parseFloat(e.target.value);
                speedDisplay.textContent = `${animationSpeed.toFixed(2)}/s`;
                
                // Fire custom event for event log
                window.dispatchEvent(new CustomEvent('animation-speed-change', {
                    detail: { speed: animationSpeed }
                }));
                
                console.log(`🎸 Animation speed changed to ${animationSpeed.toFixed(2)} cycles/second`);
            });
            
            // Add keyboard controls for fine-tuning
            speedSlider.addEventListener('keydown', (e) => {
                const currentValue = parseFloat(speedSlider.value);
                let newValue = currentValue;
                
                if (e.key === 'ArrowLeft') {
                    // Decrease by 0.1
                    newValue = Math.max(0.01, currentValue - 0.1);
                    e.preventDefault();
                } else if (e.key === 'ArrowRight') {
                    // Increase by 0.1
                    newValue = Math.min(1000, currentValue + 0.1);
                    e.preventDefault();
                } else if (e.key === 'ArrowDown') {
                    // Decrease by 1.0 (larger step)
                    newValue = Math.max(0.01, currentValue - 1.0);
                    e.preventDefault();
                } else if (e.key === 'ArrowUp') {
                    // Increase by 1.0 (larger step)
                    newValue = Math.min(1000, currentValue + 1.0);
                    e.preventDefault();
                }
                
                if (newValue !== currentValue) {
                    speedSlider.value = newValue;
                    animationSpeed = newValue;
                    speedDisplay.textContent = `${animationSpeed.toFixed(2)}/s`;
                    
                    // Fire custom event
                    window.dispatchEvent(new CustomEvent('animation-speed-change', {
                        detail: { speed: animationSpeed }
                    }));
                    
                    console.log(`⏱️ Speed adjusted to ${animationSpeed.toFixed(2)}/s via keyboard`);
                }
            });
            
            // Add visual focus indicator
            speedSlider.style.outline = 'none';
            speedSlider.addEventListener('focus', () => {
                speedSlider.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.3)';
            });
            speedSlider.addEventListener('blur', () => {
                speedSlider.style.boxShadow = 'none';
            });
            
            console.log('✅ Animation speed slider connected with keyboard controls');
            console.log('⌨️ Arrow Keys: Left/Right (±0.1), Up/Down (±1.0)');
        }
    }, 500);
}
