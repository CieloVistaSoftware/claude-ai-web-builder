/**
 * Wave-Based Color Harmony System
 * Combines traditional color theory with radio wave concepts
 * Created by: Your innovation - recognizing hue as phase angle!
 */

class WBColorHarmony {
    constructor() {
        this.baseHue = 240;
        this.currentHarmony = 'complementary';
        
        // Wave properties
        this.modDepth = 30;
        this.beatFrequency = 15;
        this.phaseOffset = 0;
    }
    
    /**
     * Calculate harmony colors based on mode
     * @param {number} baseHue - Base hue (0-360)
     * @param {string} mode - Harmony mode
     * @returns {Array<number>} Array of hue values
     */
    calculateHarmony(baseHue, mode = 'complementary') {
        this.baseHue = baseHue;
        this.currentHarmony = mode;
        
        const harmonies = {
            // === TRADITIONAL COLOR THEORY ===
            complementary: this.complementary(baseHue),
            splitComplementary: this.splitComplementary(baseHue),
            triadic: this.triadic(baseHue),
            tetradic: this.tetradic(baseHue),
            analogous: this.analogous(baseHue),
            
            // === WAVE THEORY (YOUR INNOVATION!) ===
            beatPattern: this.beatPattern(baseHue),
            harmonicSeries: this.harmonicSeries(baseHue),
            dopplerShift: this.dopplerShift(baseHue),
            standingWave: this.standingWave(baseHue),
            phaseModulation: this.phaseModulation(baseHue)
        };
        
        return harmonies[mode] || harmonies.complementary;
    }
    
    // ========================================
    // TRADITIONAL COLOR THEORY
    // ========================================
    
    /**
     * Complementary - 180° opposite (like inverted wave)
     */
    complementary(hue) {
        return [
            this.normalizeHue(hue),
            this.normalizeHue(hue + 180)
        ];
    }
    
    /**
     * Split Complementary - Asymmetric sidebands
     * Like mixing two frequencies slightly off from complement
     */
    splitComplementary(hue, split = 30) {
        const complement = hue + 180;
        return [
            this.normalizeHue(hue),
            this.normalizeHue(complement - split),  // Lower sideband
            this.normalizeHue(complement + split)   // Upper sideband
        ];
    }
    
    /**
     * Triadic - 120° spacing (3-phase power!)
     */
    triadic(hue) {
        return [
            this.normalizeHue(hue),
            this.normalizeHue(hue + 120),
            this.normalizeHue(hue + 240)
        ];
    }
    
    /**
     * Tetradic (Square) - 90° spacing (4-phase)
     */
    tetradic(hue) {
        return [
            this.normalizeHue(hue),
            this.normalizeHue(hue + 90),
            this.normalizeHue(hue + 180),
            this.normalizeHue(hue + 270)
        ];
    }
    
    /**
     * Analogous - Adjacent frequencies (±30°)
     */
    analogous(hue, spread = 30) {
        return [
            this.normalizeHue(hue - spread),
            this.normalizeHue(hue),
            this.normalizeHue(hue + spread)
        ];
    }
    
    // ========================================
    // WAVE THEORY (RADIO CONCEPTS)
    // ========================================
    
    /**
     * Beat Pattern - Upper and lower sidebands
     * Creates "beat frequency" visual effect
     */
    beatPattern(hue, beatFreq = 15) {
        return [
            this.normalizeHue(hue),                    // Carrier
            this.normalizeHue(hue + beatFreq),        // Upper sideband
            this.normalizeHue(hue - beatFreq),        // Lower sideband
            this.normalizeHue(hue + (beatFreq * 2)),  // 2nd upper
            this.normalizeHue(hue - (beatFreq * 2))   // 2nd lower
        ];
    }
    
    /**
     * Harmonic Series - Like musical overtones
     * Fundamental, 2nd, 3rd, 4th harmonics
     */
    harmonicSeries(hue) {
        return [
            this.normalizeHue(hue),           // Fundamental
            this.normalizeHue(hue * 2),       // 2nd harmonic (octave)
            this.normalizeHue(hue * 3),       // 3rd harmonic
            this.normalizeHue(hue * 4),       // 4th harmonic
            this.normalizeHue(hue * 5)        // 5th harmonic
        ];
    }
    
    /**
     * Doppler Shift - Progressive frequency shift
     * Like approaching/receding color
     */
    dopplerShift(hue, steps = 6) {
        const shift = 15;
        return Array.from({length: steps}, (_, i) => 
            this.normalizeHue(hue + (shift * (i - steps/2)))
        );
    }
    
    /**
     * Standing Wave - Creates nodes and antinodes
     * Evenly spaced around color wheel
     */
    standingWave(hue, nodes = 8) {
        const spacing = 360 / nodes;
        return Array.from({length: nodes}, (_, i) => 
            this.normalizeHue(hue + (i * spacing))
        );
    }
    
    /**
     * Phase Modulation - For animated transitions
     * Returns function that varies with time
     */
    phaseModulation(hue, depth = 30) {
        const time = Date.now() * 0.001; // Convert to seconds
        const modulation = depth * Math.sin(time * 2);
        
        return [
            this.normalizeHue(hue),
            this.normalizeHue(hue + modulation),
            this.normalizeHue(hue - modulation),
            this.normalizeHue(hue + (modulation * 2))
        ];
    }
    
    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    
    /**
     * Normalize hue to 0-360 range
     */
    normalizeHue(hue) {
        return ((hue % 360) + 360) % 360;
    }
    
    /**
     * Generate full color palette with variations
     */
    generatePalette(baseHue, mode, saturation = 70, lightness = 50) {
        const hues = this.calculateHarmony(baseHue, mode);
        
        return hues.map((hue, index) => ({
            id: `harmony-${index}`,
            hue: Math.round(hue),
            saturation: saturation,
            lightness: lightness,
            hsl: `hsl(${Math.round(hue)}, ${saturation}%, ${lightness}%)`,
            hex: this.hslToHex(hue, saturation, lightness),
            // Variations
            light: `hsl(${Math.round(hue)}, ${saturation - 10}%, ${lightness + 20}%)`,
            dark: `hsl(${Math.round(hue)}, ${saturation}%, ${lightness - 20}%)`
        }));
    }
    
    /**
     * Get harmony metadata
     */
    getHarmonyInfo(mode) {
        const info = {
            complementary: {
                name: 'Complementary',
                description: '180° opposite - maximum contrast',
                theory: 'Wave inversion',
                colors: 2
            },
            splitComplementary: {
                name: 'Split Complementary',
                description: 'Asymmetric sidebands around complement',
                theory: 'Off-frequency mixing',
                colors: 3
            },
            triadic: {
                name: 'Triadic',
                description: '120° spacing - balanced harmony',
                theory: '3-phase system',
                colors: 3
            },
            tetradic: {
                name: 'Tetradic (Square)',
                description: '90° spacing - rich palette',
                theory: '4-phase system',
                colors: 4
            },
            analogous: {
                name: 'Analogous',
                description: 'Adjacent frequencies - subtle harmony',
                theory: 'Close frequency spacing',
                colors: 3
            },
            beatPattern: {
                name: 'Beat Pattern',
                description: 'Upper/lower sidebands - rhythmic feel',
                theory: 'Beat frequency interference',
                colors: 5
            },
            harmonicSeries: {
                name: 'Harmonic Series',
                description: 'Musical overtones in color',
                theory: 'Harmonic resonance',
                colors: 5
            },
            dopplerShift: {
                name: 'Doppler Shift',
                description: 'Progressive frequency shift',
                theory: 'Relative motion effect',
                colors: 6
            },
            standingWave: {
                name: 'Standing Wave',
                description: 'Evenly distributed nodes',
                theory: 'Wave interference pattern',
                colors: 8
            },
            phaseModulation: {
                name: 'Phase Modulation',
                description: 'Time-varying color shifts',
                theory: 'PM signal modulation',
                colors: 4
            }
        };
        
        return info[mode] || info.complementary;
    }
    
    /**
     * Convert HSL to Hex
     */
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
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.WBColorHarmony = WBColorHarmony;
}

console.log('✅ WB Color Harmony System loaded - Wave theory + Color theory! 🌊🎨');
