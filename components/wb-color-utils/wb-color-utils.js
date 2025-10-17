/**
 * WB Color Utils
 * Shared utility module for all color-related wave modulation and audio analysis
 * Single source of truth for wave formulas used across components
 * 
 * Components using this module:
 * - wb-color-organ (visual display + audio integration)
 * - wb-color-harmony (palette generation + optional animation)
 * - wb-control-panel (color controls)
 * 
 * @module wb-color-utils
 * @version 1.0.0
 */

/**
 * Wave Modulation Class
 * Pure mathematical functions for PM/FM/AM wave modulation
 * Used to create animated color effects based on wave theory
 */
export class WaveModulation {
    /**
     * PM (Phase Modulation) - Modulates HUE
     * Shifts the hue value based on a wave oscillation
     * 
     * @param {number} baseHue - Base hue value (0-360)
     * @param {number} depth - Modulation depth in degrees
     * @param {number} waveValue - Wave value from getWaveValue() (-1 to 1)
     * @returns {number} Modulated hue value
     * 
     * @example
     * const hue = WaveModulation.pm(240, 15, Math.sin(time));
     */
    static pm(baseHue, depth, waveValue) {
        return baseHue + (depth * waveValue);
    }
    
    /**
     * FM (Frequency Modulation) - Modulates RATE OF CHANGE
     * Creates sweeping effects by varying the frequency over time
     * 
     * @param {number} baseHue - Base hue value (0-360)
     * @param {number} depth - Modulation depth in degrees
     * @param {number} time - Animation time (from animationTime)
     * @param {number} rate - Base modulation rate
     * @returns {number} Modulated hue value
     * 
     * @example
     * const hue = WaveModulation.fm(240, 15, animationTime, 0.02);
     */
    static fm(baseHue, depth, time, rate) {
        // FM: frequency changes over time
        const fmModulator = Math.sin(time * 0.3); // Slow modulation of frequency
        const instantFreq = rate * (1 + fmModulator);
        return baseHue + (depth * Math.sin(time * instantFreq * 5));
    }
    
    /**
     * AM (Amplitude Modulation) - Modulates SATURATION
     * Creates pulsing saturation effects
     * 
     * @param {number} baseSaturation - Base saturation value (0-100)
     * @param {number} depth - Modulation depth in percentage points
     * @param {number} waveValue - Wave value from getWaveValue() (-1 to 1)
     * @returns {number} Modulated saturation value (clamped 0-100)
     * 
     * @example
     * const sat = WaveModulation.am(70, 20, Math.sin(time));
     */
    static am(baseSaturation, depth, waveValue) {
        return Math.max(0, Math.min(100, baseSaturation + (depth * waveValue)));
    }
    
    /**
     * Combined Modulation - All three at once (PM + FM + AM)
     * Creates complex, multi-dimensional color animations
     * 
     * @param {number} h - Base hue (0-360)
     * @param {number} s - Base saturation (0-100)
     * @param {number} l - Base lightness (0-100)
     * @param {number} time - Animation time
     * @param {number} depth - Modulation depth
     * @param {number} rate - Modulation rate
     * @returns {Object} Object with modulatedHue, modulatedSat, modulatedLight
     * 
     * @example
     * const result = WaveModulation.combined(240, 70, 50, animationTime, 15, 0.02);
     */
    static combined(h, s, l, time, depth, rate) {
        const waveValue = Math.sin(time);
        
        // PM on hue
        const modulatedHue = h + (depth * 0.7 * waveValue);
        
        // AM on saturation
        const modulatedSat = Math.max(0, Math.min(100, s + (15 * Math.sin(time * 1.3))));
        
        // FM effect on lightness
        const fmEffect = Math.sin(time * 0.5);
        const modulatedLight = Math.max(20, Math.min(80, l + (10 * Math.sin(time * (1 + fmEffect)))));
        
        return {
            modulatedHue: (modulatedHue + 360) % 360,
            modulatedSat,
            modulatedLight
        };
    }
    
    /**
     * Get wave value for different wave shapes
     * 
     * @param {number} time - Current time in the wave cycle
     * @param {string} shape - Wave shape: 'sine', 'triangle', 'sawtooth', 'square'
     * @returns {number} Wave value between -1 and 1
     */
    static getWaveValue(time, shape) {
        const t = time % (2 * Math.PI);
        
        switch(shape) {
            case 'sine':
                return Math.sin(t);
                
            case 'triangle':
                return (2 / Math.PI) * Math.asin(Math.sin(t));
                
            case 'sawtooth':
                return 2 * (t / (2 * Math.PI) - Math.floor(t / (2 * Math.PI) + 0.5));
                
            case 'square':
                return Math.sin(t) >= 0 ? 1 : -1;
                
            default:
                return Math.sin(t);
        }
    }
    
    /**
     * Cascade Effect - Apply phase-shifted modulation across multiple swatches
     */
    static cascade(baseValue, depth, time, swatchIndex, phaseShift = Math.PI / 4, shape = 'sine', modulationType = 'pm', rate = 0.02) {
        const phaseShiftedTime = time - (swatchIndex * phaseShift);
        const cascadeWaveValue = this.getWaveValue(phaseShiftedTime, shape);
        
        switch(modulationType) {
            case 'pm':
                return baseValue + (depth * cascadeWaveValue);
            case 'fm':
                const fmMod = Math.sin(phaseShiftedTime * 0.3);
                const instFreq = rate * (1 + fmMod);
                return baseValue + (depth * Math.sin(phaseShiftedTime * instFreq * 5));
            case 'am':
                return Math.max(0, Math.min(100, baseValue + (20 * cascadeWaveValue)));
            default:
                return baseValue + (depth * cascadeWaveValue);
        }
    }
}

/**
 * Audio Analyzer Class
 */
export class AudioAnalyzer {
    static analyzeFrequencies(audioDataArray, sensitivity = 5) {
        if (!audioDataArray || audioDataArray.length === 0) {
            return { bass: 0, mids: 0, highs: 0 };
        }
        
        const bufferLength = audioDataArray.length;
        const bassEnd = Math.floor(bufferLength * 0.15);
        const midsEnd = Math.floor(bufferLength * 0.5);
        
        let bassSum = 0, midsSum = 0, highsSum = 0;
        
        for (let i = 0; i < bufferLength; i++) {
            const value = audioDataArray[i];
            if (i < bassEnd) bassSum += value;
            else if (i < midsEnd) midsSum += value;
            else highsSum += value;
        }
        
        const bass = (bassSum / (bassEnd * 255)) * sensitivity / 5;
        const mids = (midsSum / ((midsEnd - bassEnd) * 255)) * sensitivity / 5;
        const highs = (highsSum / ((bufferLength - midsEnd) * 255)) * sensitivity / 5;
        
        return { 
            bass: Math.min(1, bass), 
            mids: Math.min(1, mids), 
            highs: Math.min(1, highs) 
        };
    }
    
    static mapToColor(audioData, baseHue, baseSat, baseLight) {
        const bassHueShift = audioData.bass * 60;
        const hue = (baseHue + bassHueShift) % 360;
        const midsSatShift = audioData.mids * 30;
        const saturation = Math.max(0, Math.min(100, baseSat + midsSatShift));
        const highsLightShift = (audioData.highs - 0.5) * 20;
        const lightness = Math.max(20, Math.min(80, baseLight + highsLightShift));
        
        return { hue, saturation, lightness };
    }
    
    static getEnergy(audioData) {
        return (audioData.bass + audioData.mids + audioData.highs) / 3;
    }
    
    static hasAudio(audioData, threshold = 0.01) {
        return this.getEnergy(audioData) > threshold;
    }
}

/**
 * Heterodyne Mixing Class
 */
export class Heterodyne {
    static mix(carrier, modulator, depth = 50) {
        const mixRatio = depth / 100;
        const sumFreq = (carrier + modulator) % 360;
        const diffFreq = Math.abs(carrier - modulator);
        const upperSideband = (carrier + diffFreq) % 360;
        const lowerSideband = (carrier - diffFreq + 360) % 360;
        const beatFreq = Math.abs(carrier - modulator) / 12;
        const beat1 = (carrier + beatFreq) % 360;
        const beat2 = (carrier - beatFreq + 360) % 360;
        
        return {
            carrier, modulator, sum: sumFreq, difference: diffFreq,
            upperSideband, lowerSideband, beat1, beat2, mixRatio
        };
    }
    
    static generatePalette(carrier, modulator, depth, saturation, lightness) {
        const het = this.mix(carrier, modulator, depth);
        
        return [
            { name: 'Carrier', hue: het.carrier, saturation, lightness, role: 'Primary frequency' },
            { name: 'Modulator', hue: het.modulator, saturation: saturation * 0.8, lightness, role: 'Mixing frequency' },
            { name: 'Sum (C+M)', hue: het.sum, saturation: saturation * het.mixRatio, lightness: lightness * 1.1, role: 'Upper product' },
            { name: 'Difference |C-M|', hue: het.difference, saturation: saturation * het.mixRatio, lightness: lightness * 0.9, role: 'Lower product' },
            { name: 'Upper Sideband', hue: het.upperSideband, saturation: saturation * (0.5 + het.mixRatio * 0.5), lightness: lightness * 1.05, role: 'C + diff' },
            { name: 'Lower Sideband', hue: het.lowerSideband, saturation: saturation * (0.5 + het.mixRatio * 0.5), lightness: lightness * 0.95, role: 'C - diff' },
            { name: 'Beat 1', hue: het.beat1, saturation: saturation * (0.3 + het.mixRatio * 0.4), lightness, role: 'Beat freq +' },
            { name: 'Beat 2', hue: het.beat2, saturation: saturation * (0.3 + het.mixRatio * 0.4), lightness, role: 'Beat freq -' }
        ];
    }
}

/**
 * Color Conversion Utilities
 */
export class ColorConversion {
    static hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        const a = s * Math.min(l, 1 - l);
        const f = n => {
            const k = (n + h / (1/12)) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color);
        };
        
        const r = f(0), g = f(8), b = f(4);
        return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
    }
    
    static hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        const a = s * Math.min(l, 1 - l);
        const f = n => {
            const k = (n + h / (1/12)) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color);
        };
        
        return { r: f(0), g: f(8), b: f(4) };
    }
    
    static toHslString(h, s, l) {
        return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
    }
}

export default { WaveModulation, AudioAnalyzer, Heterodyne, ColorConversion };

// Compositional Namespace
if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.utils.WaveModulation = WaveModulation;
window.WB.utils.AudioAnalyzer = AudioAnalyzer;
window.WB.utils.Heterodyne = Heterodyne;
window.WB.utils.ColorConversion = ColorConversion;

// Also expose globally for backward compatibility
if (typeof window !== 'undefined') {
    window.WaveModulation = WaveModulation;
    window.AudioAnalyzer = AudioAnalyzer;
    window.Heterodyne = Heterodyne;
    window.ColorConversion = ColorConversion;
}

console.log('✅ wb-color-utils loaded - Shared wave modulation & audio analysis utilities');
