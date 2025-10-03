export {};
// @ts-nocheck
// Theme Color Formula Analyzer
// Reverse-engineer mathematical relationships from any color palette

class ThemeFormulaAnalyzer {
  constructor() {
    this.colorTheoryRules = {
      complementary: 180,    // Opposite on color wheel
      triadic: 120,         // Three equally spaced colors
      splitComplementary: [150, 210], // Complement split into two
      tetradic: [90, 180, 270],       // Four equally spaced
      analogous: [30, 60],            // Adjacent colors
      monochromatic: 0               // Same hue, different S/L
    };
  }

  // Convert hex to HSL
  hexToHSL(hex) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }


  // Analyze a color palette to discover mathematical relationships
  analyzeTheme(colorPalette, options = {}) {
    const {
      excludeNeutrals = true,
      toleranceHue = 15,        // ±15° tolerance for hue relationships
      toleranceSL = 10          // ±10% tolerance for saturation/lightness
    } = options;

    // Convert all colors to HSL
    const hslColors = {};
    const colorArray = [];

    for (const [name, hex] of Object.entries(colorPalette)) {
      const hsl = this.hexToHSL(hex);
      hslColors[name] = { hex, hsl };

      // Exclude neutrals (low saturation) if requested
      if (!excludeNeutrals || hsl.s > 15) {
        colorArray.push({ name, hex, hsl });
      }
    }

    // Find the most likely primary color (highest saturation, medium lightness)
    const primary = this.detectPrimaryColor(colorArray);

    // Analyze relationships to primary
    const relationships = this.analyzeRelationships(primary, colorArray, toleranceHue, toleranceSL);

    // Detect patterns
    const patterns = this.detectPatterns(colorArray, toleranceHue, toleranceSL);

    // Generate mathematical formulas
    const formulas = this.generateFormulas(primary, relationships, patterns);

    return {
      primary: primary,
      colors: hslColors,
      relationships: relationships,
      patterns: patterns,
      formulas: formulas,
      analysis: {
        totalColors: Object.keys(colorPalette).length,
        chromaticColors: colorArray.length,
        dominantHueRange: this.calculateHueRange(colorArray),
        saturationRange: this.calculateSaturationRange(colorArray),
        lightnessRange: this.calculateLightnessRange(colorArray)
      }
    };
  }

  // Detect the most likely primary color
  detectPrimaryColor(colorArray) {
    let bestCandidate = null;
    let maxScore = 0;

    for (const color of colorArray) {
      const { h, s, l } = color.hsl;

      // Score based on saturation (prefer high) and lightness (prefer medium)
      const saturationScore = s / 100;
      const lightnessScore = 1 - Math.abs(l - 50) / 50;
      const score = saturationScore * 0.7 + lightnessScore * 0.3;

      if (score > maxScore) {
        maxScore = score;
        bestCandidate = color;
      }
    }

    return bestCandidate;
  }

  // Analyze relationships between colors
  analyzeRelationships(primary, colorArray, toleranceHue, toleranceSL) {
    const relationships = [];

    for (const color of colorArray) {
      if (color === primary) continue;

      const relationship = this.calculateRelationship(primary.hsl, color.hsl, toleranceHue, toleranceSL);
      relationships.push({
        color: color,
        relationship: relationship
      });
    }

    return relationships;
  }

  // Calculate relationship between two colors
  calculateRelationship(primaryHSL, colorHSL, toleranceHue, toleranceSL) {
    const hueDiff = Math.abs(primaryHSL.h - colorHSL.h);
    const hueDiffAdjusted = Math.min(hueDiff, 360 - hueDiff); // Handle wraparound

    const saturationRatio = colorHSL.s / primaryHSL.s;
    const lightnessRatio = colorHSL.l / primaryHSL.l;

    // Check for known color theory relationships
    const relationship = {
      hueDifference: hueDiffAdjusted,
      saturationRatio: saturationRatio,
      lightnessRatio: lightnessRatio,
      type: 'custom'
    };

    // Identify color theory relationships
    if (hueDiffAdjusted <= toleranceHue) {
      relationship.type = 'monochromatic';
    } else if (Math.abs(hueDiffAdjusted - 180) <= toleranceHue) {
      relationship.type = 'complementary';
    } else if (Math.abs(hueDiffAdjusted - 120) <= toleranceHue || Math.abs(hueDiffAdjusted - 240) <= toleranceHue) {
      relationship.type = 'triadic';
    } else if (Math.abs(hueDiffAdjusted - 30) <= toleranceHue || Math.abs(hueDiffAdjusted - 60) <= toleranceHue) {
      relationship.type = 'analogous';
    } else if (Math.abs(hueDiffAdjusted - 150) <= toleranceHue || Math.abs(hueDiffAdjusted - 210) <= toleranceHue) {
      relationship.type = 'splitComplementary';
    }

    return relationship;
  }

  // Detect patterns in the color palette
  detectPatterns(colorArray, toleranceHue, toleranceSL) {
    const patterns = {
      hueProgression: this.detectHueProgression(colorArray, toleranceHue),
      saturationLevels: this.detectSaturationLevels(colorArray, toleranceSL),
      lightnessLevels: this.detectLightnessLevels(colorArray, toleranceSL),
      mathematicalSequences: this.detectMathematicalSequences(colorArray)
    };

    return patterns;
  }

  // Detect hue progression patterns
  detectHueProgression(colorArray, tolerance) {
    const hues = colorArray.map(c => c.hsl.h).sort((a, b) => a - b);
    const differences = [];

    for (let i = 1; i < hues.length; i++) {
      differences.push(hues[i] - hues[i - 1]);
    }

    // Check for consistent spacing
    const avgDiff = differences.reduce((a, b) => a + b, 0) / differences.length;
    const isConsistent = differences.every(diff => Math.abs(diff - avgDiff) <= tolerance);

    return {
      isProgression: isConsistent,
      averageSpacing: avgDiff,
      differences: differences,
      formula: isConsistent ? `H = BaseHue + (${avgDiff.toFixed(1)} * index)` : null
    };
  }

  // Detect saturation level patterns
  detectSaturationLevels(colorArray, tolerance) {
    const saturations = [...new Set(colorArray.map(c => c.hsl.s))].sort((a, b) => a - b);
    const levels = this.groupValuesByTolerance(saturations, tolerance);

    return {
      distinctLevels: levels.length,
      levels: levels,
      formula: levels.length <= 3 ? `S ∈ {${levels.map(l => l.toFixed(0)).join(', ')}}` : 'Variable saturation'
    };
  }

  // Detect lightness level patterns
  detectLightnessLevels(colorArray, tolerance) {
    const lightness = [...new Set(colorArray.map(c => c.hsl.l))].sort((a, b) => a - b);
    const levels = this.groupValuesByTolerance(lightness, tolerance);

    return {
      distinctLevels: levels.length,
      levels: levels,
      formula: levels.length <= 3 ? `L ∈ {${levels.map(l => l.toFixed(0)).join(', ')}}` : 'Variable lightness'
    };
  }

  // Group values by tolerance
  groupValuesByTolerance(values, tolerance) {
    const groups = [];

    for (const value of values) {
      let foundGroup = false;

      for (const group of groups) {
        if (Math.abs(value - group) <= tolerance) {
          foundGroup = true;
          break;
        }
      }

      if (!foundGroup) {
        groups.push(value);
      }
    }

    return groups;
  }

  // Detect mathematical sequences (fibonacci, golden ratio, etc.)
  detectMathematicalSequences(colorArray) {
    const sequences = {
      fibonacci: this.checkFibonacci(colorArray),
      goldenRatio: this.checkGoldenRatio(colorArray),
      geometric: this.checkGeometric(colorArray)
    };

    return sequences;
  }

  // Check for Fibonacci sequence in hue spacing
  checkFibonacci(colorArray) {
    const hues = colorArray.map(c => c.hsl.h).sort((a, b) => a - b);
    const fibonacci = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];

    // Check if hue differences follow Fibonacci pattern
    const differences = [];
    for (let i = 1; i < hues.length; i++) {
      differences.push(hues[i] - hues[i - 1]);
    }

    const isFibonacci = differences.length >= 2 &&
      differences.some((diff, i) => i < fibonacci.length && Math.abs(diff - fibonacci[i]) < 10);

    return {
      detected: isFibonacci,
      pattern: isFibonacci ? 'Fibonacci-based hue spacing' : null
    };
  }

  // Check for golden ratio relationships
  checkGoldenRatio(colorArray) {
    const goldenRatio = 1.618;
    const ratios = [];

    // Check saturation ratios
    for (let i = 1; i < colorArray.length; i++) {
      const ratio = colorArray[i].hsl.s / colorArray[i - 1].hsl.s;
      ratios.push(ratio);
    }

    const hasGoldenRatio = ratios.some(ratio => Math.abs(ratio - goldenRatio) < 0.1);

    return {
      detected: hasGoldenRatio,
      pattern: hasGoldenRatio ? 'Golden ratio in saturation levels' : null
    };
  }

  // Check for geometric progressions
  checkGeometric(colorArray) {
    const lightness = colorArray.map(c => c.hsl.l).sort((a, b) => a - b);

    if (lightness.length < 3) return { detected: false };

    const ratios = [];
    for (let i = 1; i < lightness.length; i++) {
      ratios.push(lightness[i] / lightness[i - 1]);
    }

    const avgRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length;
    const isGeometric = ratios.every(ratio => Math.abs(ratio - avgRatio) < 0.2);

    return {
      detected: isGeometric,
      pattern: isGeometric ? `Geometric progression with ratio ${avgRatio.toFixed(2)}` : null
    };
  }

  // Calculate ranges
  calculateHueRange(colorArray) {
    const hues = colorArray.map(c => c.hsl.h);
    return { min: Math.min(...hues), max: Math.max(...hues) };
  }

  calculateSaturationRange(colorArray) {
    const saturations = colorArray.map(c => c.hsl.s);
    return { min: Math.min(...saturations), max: Math.max(...saturations) };
  }

  calculateLightnessRange(colorArray) {
    const lightness = colorArray.map(c => c.hsl.l);
    return { min: Math.min(...lightness), max: Math.max(...lightness) };
  }

  // Generate mathematical formulas from analysis
  generateFormulas(primary, relationships, patterns) {
    const formulas = [];

    // Primary color formula
    formulas.push({
      name: 'Primary Color',
      formula: `HSL(${primary.hsl.h}°, ${primary.hsl.s}%, ${primary.hsl.l}%)`,
      description: 'Base color for the theme'
    });

    // Relationship-based formulas
    for (const rel of relationships) {
      if (rel.relationship.type !== 'custom') {
        formulas.push({
          name: `${rel.color.name} (${rel.relationship.type})`,
          formula: `HSL((${primary.hsl.h} + ${rel.relationship.hueDifference})°, ${primary.hsl.s} * ${rel.relationship.saturationRatio.toFixed(2)}, ${primary.hsl.l} * ${rel.relationship.lightnessRatio.toFixed(2)})`,
          description: `${rel.relationship.type} relationship to primary`
        });
      }
    }

    // Pattern-based formulas
    if (patterns.hueProgression.isProgression) {
      formulas.push({
        name: 'Hue Progression',
        formula: patterns.hueProgression.formula,
        description: 'Systematic hue spacing pattern'
      });
    }

    return formulas;
  }

  // Generate a new theme using discovered formulas
  generateThemeFromFormulas(newPrimaryHex, originalAnalysis) {
    const newPrimaryHSL = this.hexToHSL(newPrimaryHex);
    const originalPrimaryHSL = originalAnalysis.primary.hsl;

    const newTheme = {};

    // Apply discovered relationships
    for (const rel of originalAnalysis.relationships) {
      const newHue = (newPrimaryHSL.h + rel.relationship.hueDifference) % 360;
      const newSaturation = Math.min(100, newPrimaryHSL.s * rel.relationship.saturationRatio);
      const newLightness = Math.min(100, newPrimaryHSL.l * rel.relationship.lightnessRatio);

      newTheme[rel.color.name] = window.WBComponentUtils.ColorUtils.hslToHex(newHue, newSaturation, newLightness);
    }

    // Add the new primary
    newTheme[originalAnalysis.primary.name] = newPrimaryHex;

    return newTheme;
  }

  // Generate analysis report
  generateReport(analysis) {
    let report = '# Color Theme Analysis Report\n\n';

    report += `## Primary Color\n`;
    report += `**${analysis.primary.name}**: ${analysis.primary.hex} (HSL: ${analysis.primary.hsl.h}°, ${analysis.primary.hsl.s}%, ${analysis.primary.hsl.l}%)\n\n`;

    report += `## Discovered Formulas\n`;
    for (const formula of analysis.formulas) {
      report += `### ${formula.name}\n`;
      report += `**Formula**: \`${formula.formula}\`\n`;
      report += `**Description**: ${formula.description}\n\n`;
    }

    report += `## Color Theory Relationships\n`;
    for (const rel of analysis.relationships) {
      if (rel.relationship.type !== 'custom') {
        report += `- **${rel.color.name}**: ${rel.relationship.type} (${rel.relationship.hueDifference}° hue difference)\n`;
      }
    }

    report += `\n## Detected Patterns\n`;
    if (analysis.patterns.hueProgression.isProgression) {
      report += `- **Hue Progression**: ${analysis.patterns.hueProgression.formula}\n`;
    }
    if (analysis.patterns.saturationLevels.distinctLevels <= 3) {
      report += `- **Saturation Levels**: ${analysis.patterns.saturationLevels.formula}\n`;
    }
    if (analysis.patterns.lightnessLevels.distinctLevels <= 3) {
      report += `- **Lightness Levels**: ${analysis.patterns.lightnessLevels.formula}\n`;
    }

    return report;
  }
}

// Example usage with WordPress colors
const analyzer = new ThemeFormulaAnalyzer();

// Analyze WordPress default palette
const wordpressColors = {
  'black': '#000000',
  'cyan-bluish-gray': '#abb8c3',
  'white': '#ffffff',
  'pale-pink': '#f78da7',
  'vivid-red': '#cf2e2e',
  'luminous-vivid-orange': '#ff6900',
  'luminous-vivid-amber': '#fcb900',
  'light-green-cyan': '#7bdcb5',
  'vivid-green-cyan': '#00d084',
  'pale-cyan-blue': '#8ed1fc',
  'vivid-cyan-blue': '#0693e3',
  'vivid-purple': '#9b51e0'
};

console.log('=== WORDPRESS THEME ANALYSIS ===');
const wpAnalysis = analyzer.analyzeTheme(wordpressColors);
console.log('Primary Color:', wpAnalysis.primary);
console.log('Formulas:', wpAnalysis.formulas);
console.log('\n' + analyzer.generateReport(wpAnalysis));

// Generate new theme using discovered formulas
console.log('\n=== APPLYING FORMULAS TO NEW PRIMARY ===');
const newTheme = analyzer.generateThemeFromFormulas('#C41E3A', wpAnalysis);
console.log('New theme colors:', newTheme);

// Analyze other popular themes
const materialDesignColors = {
  'red': '#f44336',
  'pink': '#e91e63',
  'purple': '#9c27b0',
  'deep-purple': '#673ab7',
  'indigo': '#3f51b5',
  'blue': '#2196f3',
  'light-blue': '#03a9f4',
  'cyan': '#00bcd4',
  'teal': '#009688',
  'green': '#4caf50'
};

console.log('\n=== MATERIAL DESIGN ANALYSIS ===');
const materialAnalysis = analyzer.analyzeTheme(materialDesignColors);
console.log(analyzer.generateReport(materialAnalysis));

// Export for use
window.ThemeFormulaAnalyzer = ThemeFormulaAnalyzer;