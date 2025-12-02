import { test, expect } from '@playwright/test';

// Helper to capture errors
async function captureAndLogError(testName, error) {
  const errorText = `TEST: ${testName}\nERROR: ${error?.message || error}\nSTACK: ${error?.stack || 'N/A'}`;
  console.error(errorText);
  throw error;
}

test.describe('WB Color Utils', () => {

  test('WaveModulation.pm() modulates hue correctly', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/');
      
      await page.setContent(`
        <script type="module">
          (async () => {
            try {
              const mod = await import('http://localhost:3000/wb-color-utils/wb-color-utils.js');
              const { WaveModulation } = mod;
              
              // Test PM with positive wave value
              const hue1 = WaveModulation.pm(240, 15, 1);
              window.hue1 = hue1;
              
              // Test PM with negative wave value
              const hue2 = WaveModulation.pm(240, 15, -1);
              window.hue2 = hue2;
              
              // Test PM with zero wave value
              const hue3 = WaveModulation.pm(240, 15, 0);
              window.hue3 = hue3;
              
              window.testComplete = true;
            } catch (err) {
              window.scriptError = err.message;
            }
          })();
        </script>
      `);
      
      await page.waitForTimeout(1000);
      const scriptError = await page.evaluate(() => window.scriptError);
      if (scriptError) throw new Error(`Script error: ${scriptError}`);
      
      const hue1 = await page.evaluate(() => window.hue1);
      const hue2 = await page.evaluate(() => window.hue2);
      const hue3 = await page.evaluate(() => window.hue3);
      
      expect(hue1).toBe(255); // 240 + 15*1
      expect(hue2).toBe(225); // 240 + 15*(-1)
      expect(hue3).toBe(240); // 240 + 15*0
    } catch (error) {
      await captureAndLogError('WaveModulation.pm() modulates hue correctly', error);
    }
  });

  test('WaveModulation.am() modulates saturation correctly', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/');
      
      await page.setContent(`
        <script type="module">
          (async () => {
            try {
              const mod = await import('http://localhost:3000/wb-color-utils/wb-color-utils.js');
              const { WaveModulation } = mod;
              
              // Test AM modulation
              const sat1 = WaveModulation.am(70, 20, 1);
              window.sat1 = sat1;
              
              const sat2 = WaveModulation.am(70, 20, -1);
              window.sat2 = sat2;
              
              const sat3 = WaveModulation.am(70, 20, 0);
              window.sat3 = sat3;
              
              // Test clamping
              const satClamped = WaveModulation.am(95, 20, 1);
              window.satClamped = satClamped;
              
              window.testComplete = true;
            } catch (err) {
              window.scriptError = err.message;
            }
          })();
        </script>
      `);
      
      await page.waitForTimeout(1000);
      const scriptError = await page.evaluate(() => window.scriptError);
      if (scriptError) throw new Error(`Script error: ${scriptError}`);
      
      const sat1 = await page.evaluate(() => window.sat1);
      const sat2 = await page.evaluate(() => window.sat2);
      const sat3 = await page.evaluate(() => window.sat3);
      const satClamped = await page.evaluate(() => window.satClamped);
      
      expect(sat1).toBe(90); // 70 + 20*1
      expect(sat2).toBe(50); // 70 + 20*(-1)
      expect(sat3).toBe(70); // 70 + 20*0
      expect(satClamped).toBe(100); // Clamped to max 100
    } catch (error) {
      await captureAndLogError('WaveModulation.am() modulates saturation correctly', error);
    }
  });

  test('WaveModulation.getWaveValue() returns correct shapes', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/');
      
      await page.setContent(`
        <script type="module">
          (async () => {
            try {
              const mod = await import('http://localhost:3000/wb-color-utils/wb-color-utils.js');
              const { WaveModulation } = mod;
              
              // At time 0, sine should be 0
              const sine0 = WaveModulation.getWaveValue(0, 'sine');
              window.sine0 = sine0;
              
              // At π/2, sine should be ~1
              const sinePI2 = WaveModulation.getWaveValue(Math.PI / 2, 'sine');
              window.sinePI2 = sinePI2;
              
              // Square wave should return 1 or -1
              const square0 = WaveModulation.getWaveValue(0, 'square');
              window.square0 = square0;
              
              window.testComplete = true;
            } catch (err) {
              window.scriptError = err.message;
            }
          })();
        </script>
      `);
      
      await page.waitForTimeout(1000);
      const scriptError = await page.evaluate(() => window.scriptError);
      if (scriptError) throw new Error(`Script error: ${scriptError}`);
      
      const sine0 = await page.evaluate(() => window.sine0);
      const sinePI2 = await page.evaluate(() => window.sinePI2);
      const square0 = await page.evaluate(() => window.square0);
      
      expect(Math.abs(sine0)).toBeLessThan(0.01); // ~0
      expect(sinePI2).toBeGreaterThan(0.99); // ~1
      expect(Math.abs(Math.abs(square0) - 1)).toBeLessThan(0.01); // ±1
    } catch (error) {
      await captureAndLogError('WaveModulation.getWaveValue() returns correct shapes', error);
    }
  });

  test('WaveModulation.combined() returns all three modulations', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/');
      
      await page.setContent(`
        <script type="module">
          (async () => {
            try {
              const mod = await import('http://localhost:3000/wb-color-utils/wb-color-utils.js');
              const { WaveModulation } = mod;
              
              const result = WaveModulation.combined(240, 70, 50, 0.5, 15, 0.02);
              window.result = result;
              window.hasModulatedHue = 'modulatedHue' in result;
              window.hasModulatedSat = 'modulatedSat' in result;
              window.hasModulatedLight = 'modulatedLight' in result;
              
              window.testComplete = true;
            } catch (err) {
              window.scriptError = err.message;
            }
          })();
        </script>
      `);
      
      await page.waitForTimeout(1000);
      const scriptError = await page.evaluate(() => window.scriptError);
      if (scriptError) throw new Error(`Script error: ${scriptError}`);
      
      const hasHue = await page.evaluate(() => window.hasModulatedHue);
      const hasSat = await page.evaluate(() => window.hasModulatedSat);
      const hasLight = await page.evaluate(() => window.hasModulatedLight);
      
      expect(hasHue).toBe(true);
      expect(hasSat).toBe(true);
      expect(hasLight).toBe(true);
    } catch (error) {
      await captureAndLogError('WaveModulation.combined() returns all three modulations', error);
    }
  });

  test('AudioAnalyzer.analyzeFrequencies() analyzes audio data', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/');
      
      await page.setContent(`
        <script type="module">
          (async () => {
            try {
              const mod = await import('http://localhost:3000/wb-color-utils/wb-color-utils.js');
              const { AudioAnalyzer } = mod;
              
              // Create mock audio data
              const audioData = new Uint8Array(256);
              for (let i = 0; i < 256; i++) {
                audioData[i] = Math.floor(Math.random() * 255);
              }
              
              const result = AudioAnalyzer.analyzeFrequencies(audioData);
              window.hasBass = 'bass' in result;
              window.hasMids = 'mids' in result;
              window.hasHighs = 'highs' in result;
              window.result = result;
              
              window.testComplete = true;
            } catch (err) {
              window.scriptError = err.message;
            }
          })();
        </script>
      `);
      
      await page.waitForTimeout(1000);
      const scriptError = await page.evaluate(() => window.scriptError);
      if (scriptError) throw new Error(`Script error: ${scriptError}`);
      
      const hasBass = await page.evaluate(() => window.hasBass);
      const hasMids = await page.evaluate(() => window.hasMids);
      const hasHighs = await page.evaluate(() => window.hasHighs);
      
      expect(hasBass).toBe(true);
      expect(hasMids).toBe(true);
      expect(hasHighs).toBe(true);
    } catch (error) {
      await captureAndLogError('AudioAnalyzer.analyzeFrequencies() analyzes audio data', error);
    }
  });

  test('AudioAnalyzer.getEnergy() calculates energy', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/');
      
      await page.setContent(`
        <script type="module">
          (async () => {
            try {
              const mod = await import('http://localhost:3000/wb-color-utils/wb-color-utils.js');
              const { AudioAnalyzer } = mod;
              
              const audioData = { bass: 0.6, mids: 0.4, highs: 0.2 };
              const energy = AudioAnalyzer.getEnergy(audioData);
              window.energy = energy;
              window.expectedEnergy = (0.6 + 0.4 + 0.2) / 3;
              
              window.testComplete = true;
            } catch (err) {
              window.scriptError = err.message;
            }
          })();
        </script>
      `);
      
      await page.waitForTimeout(1000);
      const scriptError = await page.evaluate(() => window.scriptError);
      if (scriptError) throw new Error(`Script error: ${scriptError}`);
      
      const energy = await page.evaluate(() => window.energy);
      const expectedEnergy = await page.evaluate(() => window.expectedEnergy);
      
      expect(energy).toBeCloseTo(expectedEnergy, 5);
    } catch (error) {
      await captureAndLogError('AudioAnalyzer.getEnergy() calculates energy', error);
    }
  });

  test('AudioAnalyzer.hasAudio() detects audio presence', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/');
      
      await page.setContent(`
        <script type="module">
          (async () => {
            try {
              const mod = await import('http://localhost:3000/wb-color-utils/wb-color-utils.js');
              const { AudioAnalyzer } = mod;
              
              const audioDataHigh = { bass: 0.6, mids: 0.4, highs: 0.2 };
              const audioDataLow = { bass: 0.001, mids: 0.001, highs: 0.001 };
              
              window.hasAudioHigh = AudioAnalyzer.hasAudio(audioDataHigh);
              window.hasAudioLow = AudioAnalyzer.hasAudio(audioDataLow);
              
              window.testComplete = true;
            } catch (err) {
              window.scriptError = err.message;
            }
          })();
        </script>
      `);
      
      await page.waitForTimeout(1000);
      const scriptError = await page.evaluate(() => window.scriptError);
      if (scriptError) throw new Error(`Script error: ${scriptError}`);
      
      const hasAudioHigh = await page.evaluate(() => window.hasAudioHigh);
      const hasAudioLow = await page.evaluate(() => window.hasAudioLow);
      
      expect(hasAudioHigh).toBe(true);
      expect(hasAudioLow).toBe(false);
    } catch (error) {
      await captureAndLogError('AudioAnalyzer.hasAudio() detects audio presence', error);
    }
  });

  test('Heterodyne.mix() generates heterodyne products', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/');
      
      await page.setContent(`
        <script type="module">
          (async () => {
            try {
              const mod = await import('http://localhost:3000/wb-color-utils/wb-color-utils.js');
              const { Heterodyne } = mod;
              
              const result = Heterodyne.mix(240, 120, 50);
              window.hasCarrier = 'carrier' in result;
              window.hasModulator = 'modulator' in result;
              window.hasSum = 'sum' in result;
              window.hasDifference = 'difference' in result;
              window.hasUpperSideband = 'upperSideband' in result;
              window.hasLowerSideband = 'lowerSideband' in result;
              
              window.testComplete = true;
            } catch (err) {
              window.scriptError = err.message;
            }
          })();
        </script>
      `);
      
      await page.waitForTimeout(1000);
      const scriptError = await page.evaluate(() => window.scriptError);
      if (scriptError) throw new Error(`Script error: ${scriptError}`);
      
      const hasCarrier = await page.evaluate(() => window.hasCarrier);
      const hasSum = await page.evaluate(() => window.hasSum);
      const hasDifference = await page.evaluate(() => window.hasDifference);
      
      expect(hasCarrier).toBe(true);
      expect(hasSum).toBe(true);
      expect(hasDifference).toBe(true);
    } catch (error) {
      await captureAndLogError('Heterodyne.mix() generates heterodyne products', error);
    }
  });

  test('Heterodyne.generatePalette() creates color palette', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/');
      
      await page.setContent(`
        <script type="module">
          (async () => {
            try {
              const mod = await import('http://localhost:3000/wb-color-utils/wb-color-utils.js');
              const { Heterodyne } = mod;
              
              const palette = Heterodyne.generatePalette(240, 120, 50, 70, 50);
              window.paletteLength = palette.length;
              window.firstColor = palette[0];
              window.hasAllProperties = palette.every(c => 'hue' in c && 'saturation' in c && 'lightness' in c);
              
              window.testComplete = true;
            } catch (err) {
              window.scriptError = err.message;
            }
          })();
        </script>
      `);
      
      await page.waitForTimeout(1000);
      const scriptError = await page.evaluate(() => window.scriptError);
      if (scriptError) throw new Error(`Script error: ${scriptError}`);
      
      const paletteLength = await page.evaluate(() => window.paletteLength);
      const hasAllProps = await page.evaluate(() => window.hasAllProperties);
      
      expect(paletteLength).toBe(8); // 8 colors in heterodyne palette
      expect(hasAllProps).toBe(true);
    } catch (error) {
      await captureAndLogError('Heterodyne.generatePalette() creates color palette', error);
    }
  });

  test('ColorConversion.hslToHex() converts colors correctly', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/');
      
      await page.setContent(`
        <script type="module">
          (async () => {
            try {
              const mod = await import('http://localhost:3000/wb-color-utils/wb-color-utils.js');
              const { ColorConversion } = mod;
              
              // Pure red HSL
              const redHex = ColorConversion.hslToHex(0, 100, 50);
              window.redHex = redHex;
              
              // Check format
              window.isHexFormat = /^#[0-9a-f]{6}$/i.test(redHex);
              
              // Pure blue HSL
              const blueHex = ColorConversion.hslToHex(240, 100, 50);
              window.blueHex = blueHex;
              
              window.testComplete = true;
            } catch (err) {
              window.scriptError = err.message;
            }
          })();
        </script>
      `);
      
      await page.waitForTimeout(1000);
      const scriptError = await page.evaluate(() => window.scriptError);
      if (scriptError) throw new Error(`Script error: ${scriptError}`);
      
      const isHexFormat = await page.evaluate(() => window.isHexFormat);
      expect(isHexFormat).toBe(true);
    } catch (error) {
      await captureAndLogError('ColorConversion.hslToHex() converts colors correctly', error);
    }
  });

  test('ColorConversion.hslToRgb() converts to RGB object', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/');
      
      await page.setContent(`
        <script type="module">
          (async () => {
            try {
              const mod = await import('http://localhost:3000/wb-color-utils/wb-color-utils.js');
              const { ColorConversion } = mod;
              
              const rgb = ColorConversion.hslToRgb(240, 100, 50);
              window.hasR = 'r' in rgb;
              window.hasG = 'g' in rgb;
              window.hasB = 'b' in rgb;
              window.rInRange = rgb.r >= 0 && rgb.r <= 255;
              window.gInRange = rgb.g >= 0 && rgb.g <= 255;
              window.bInRange = rgb.b >= 0 && rgb.b <= 255;
              
              window.testComplete = true;
            } catch (err) {
              window.scriptError = err.message;
            }
          })();
        </script>
      `);
      
      await page.waitForTimeout(1000);
      const scriptError = await page.evaluate(() => window.scriptError);
      if (scriptError) throw new Error(`Script error: ${scriptError}`);
      
      const hasR = await page.evaluate(() => window.hasR);
      const hasG = await page.evaluate(() => window.hasG);
      const hasB = await page.evaluate(() => window.hasB);
      const rInRange = await page.evaluate(() => window.rInRange);
      
      expect(hasR).toBe(true);
      expect(hasG).toBe(true);
      expect(hasB).toBe(true);
      expect(rInRange).toBe(true);
    } catch (error) {
      await captureAndLogError('ColorConversion.hslToRgb() converts to RGB object', error);
    }
  });

  test('ColorConversion.toHslString() formats HSL strings', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/');
      
      await page.setContent(`
        <script type="module">
          (async () => {
            try {
              const mod = await import('http://localhost:3000/wb-color-utils/wb-color-utils.js');
              const { ColorConversion } = mod;
              
              const hslStr = ColorConversion.toHslString(240, 70, 50);
              window.hslStr = hslStr;
              // Simple validation: check if it starts with 'hsl(' and contains expected values
              window.isValidFormat = hslStr.startsWith('hsl(') && hslStr.includes('240') && hslStr.includes('70') && hslStr.includes('50');
              
              window.testComplete = true;
            } catch (err) {
              window.scriptError = err.message;
            }
          })();
        </script>
      `);
      
      await page.waitForTimeout(1000);
      const scriptError = await page.evaluate(() => window.scriptError);
      if (scriptError) throw new Error(`Script error: ${scriptError}`);
      
      const hslStr = await page.evaluate(() => window.hslStr);
      const isValidFormat = await page.evaluate(() => window.isValidFormat);
      
      expect(typeof hslStr).toBe('string');
      expect(isValidFormat).toBe(true);
    } catch (error) {
      await captureAndLogError('ColorConversion.toHslString() formats HSL strings', error);
    }
  });

});
