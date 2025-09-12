// HSL Color Picker JavaScript
// Get elements
      const colorDisplay = document.getElementById("colorDisplay");
      const hueSlider = document.getElementById("hueSlider");
      const saturationSlider = document.getElementById("saturationSlider");
      const lightnessSlider = document.getElementById("lightnessSlider");
      const hueValue = document.getElementById("hueValue");
      const saturationValue = document.getElementById("saturationValue");
      const lightnessValue = document.getElementById("lightnessValue");
      const hslValue = document.getElementById("hslValue");
      const rgbValue = document.getElementById("rgbValue");
      const hexValue = document.getElementById("hexValue");
      const copyNotification = document.getElementById("copyNotification");
      const themeSelect = document.getElementById("theme-select");

      let currentHue = 180;
      let currentSaturation = 100;
      let currentLightness = 50;
      let currentTheme = "default";

      // Update color display
      function updateColor() {
        const hsl = `hsl(${currentHue}, ${currentSaturation}%, ${currentLightness}%)`;

        // Update main display
        colorDisplay.style.backgroundColor = hsl;

        // Update value displays
        hueValue.textContent = Math.round(currentHue);
        saturationValue.textContent = Math.round(currentSaturation);
        lightnessValue.textContent = Math.round(currentLightness);
        hslValue.textContent = hsl;

        // Update saturation slider background
        saturationSlider.style.background = `linear-gradient(to right, 
                hsl(${currentHue}, 0%, ${currentLightness}%), 
                hsl(${currentHue}, 100%, ${currentLightness}%))`;

        // Update lightness slider background
        lightnessSlider.style.background = `linear-gradient(to right, 
                hsl(${currentHue}, ${currentSaturation}%, 0%) 0%, 
                hsl(${currentHue}, ${currentSaturation}%, 50%) 50%, 
                hsl(${currentHue}, ${currentSaturation}%, 100%) 100%)`;

        // Convert to RGB and HEX
        const rgb = hslToRgb(currentHue, currentSaturation, currentLightness);
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

        rgbValue.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        hexValue.textContent = hex;
      }

      // HSL to RGB conversion
      function hslToRgb(h, s, l) {
        h = h / 360;
        s = s / 100;
        l = l / 100;

        let r, g, b;

        if (s === 0) {
          r = g = b = l;
        } else {
          const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
          };

          const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          const p = 2 * l - q;
          r = hue2rgb(p, q, h + 1 / 3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1 / 3);
        }

        return {
          r: Math.round(r * 255),
          g: Math.round(g * 255),
          b: Math.round(b * 255),
        };
      }

      // RGB to HEX conversion
      function rgbToHex(r, g, b) {
        return (
          "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
        );
      }

      // Copy to clipboard function
      function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
          copyNotification.classList.add("show");
          setTimeout(() => {
            copyNotification.classList.remove("show");
          }, 2000);
        });
      }

      // Event listeners for sliders
      hueSlider.addEventListener("input", (e) => {
        currentHue = parseFloat(e.target.value);
        updateColor();
      });

      saturationSlider.addEventListener("input", (e) => {
        currentSaturation = parseFloat(e.target.value);
        updateColor();
      });

      lightnessSlider.addEventListener("input", (e) => {
        currentLightness = parseFloat(e.target.value);
        updateColor();
      });

      // Click to copy color values
      hslValue.addEventListener("click", () =>
        copyToClipboard(hslValue.textContent)
      );
      rgbValue.addEventListener("click", () =>
        copyToClipboard(rgbValue.textContent)
      );
      hexValue.addEventListener("click", () =>
        copyToClipboard(hexValue.textContent)
      );

      // Apply theme
      function applyTheme(theme) {
        document.body.setAttribute("data-theme", theme);
        currentTheme = theme;

        // Adjust guide boxes based on theme
        updateGuideBoxes();

        // Save theme preference
        localStorage.setItem("colorPickerTheme", theme);
      }

      // Update guide boxes based on current theme
      function updateGuideBoxes() {
        const guides = document.querySelectorAll(".guide-box");
        const colors = {
          hue: {
            default: "red",
            ocean: "#0088cc",
            sunset: "#ff7e00",
            forest: "#2d6a4f",
            cyberpunk: "#ff00ff",
            dark: "#ff00ff",
          },
          sat: {
            default: "#ff0000",
            ocean: "#0088cc",
            sunset: "#ff7e00",
            forest: "#2d6a4f",
            cyberpunk: "#ff00ff",
            dark: "#ff00ff",
          },
        };

        // Update the hue guide
        guides[0].style.background = `linear-gradient(to right, gray, ${
          colors.hue[currentTheme] || "red"
        })`;

        // Update the saturation guide
        guides[1].style.background = `linear-gradient(to right, #888, ${
          colors.sat[currentTheme] || "#ff0000"
        })`;

        // Update the lightness guide with current theme's primary color
        const computed = getComputedStyle(document.documentElement);
        const primaryColor =
          computed.getPropertyValue("--primary").trim() || "#007bff";
        guides[2].style.background = `linear-gradient(to right, black, ${primaryColor}, white)`;
      }

      // Theme selector event listener
      themeSelect.addEventListener("change", (e) => {
        applyTheme(e.target.value);
      });

      // Load saved theme
      const savedTheme = localStorage.getItem("colorPickerTheme");
      if (savedTheme) {
        themeSelect.value = savedTheme;
        applyTheme(savedTheme);
      }

      // Layout adjustment based on Golden Ratio
      function adjustLayoutUsingGoldenRatio() {
        const container = document.querySelector(".color-picker-container");
        const goldenRatio = 1.618;

        // Calculate width based on viewport
        const viewportWidth = Math.min(window.innerWidth * 0.9, 800);
        container.style.width = `${viewportWidth}px`;

        // Set height based on golden ratio
        const height = viewportWidth / goldenRatio;
        container.style.minHeight = `${height}px`;
      }

      // Apply golden ratio on resize
      window.addEventListener("resize", adjustLayoutUsingGoldenRatio);
      adjustLayoutUsingGoldenRatio();

      // Initialize
      updateColor();


// Initialize DOM elements with fallback IDs
function initializeElements() {
    const elementMap = {
        colorDisplay: ["colorDisplay"],
        hueSlider: ["hueSlider", "hue"],
        saturationSlider: ["saturationSlider", "saturation"],
        lightnessSlider: ["lightnessSlider", "lightness"],
        hueValue: ["hueValue"],
        saturationValue: ["saturationValue"],
        lightnessValue: ["lightnessValue"],
        hslValue: ["hslValue", "hsl-value"],
        rgbValue: ["rgbValue", "rgb-value"],
        hexValue: ["hexValue", "hex-value"],
        copyNotification: ["copyNotification"],
        themeSelect: ["theme-select"]
    };
    
    // Assign elements using the first available ID
    Object.keys(elementMap).forEach(key => {
        const ids = elementMap[key];
        for (const id of ids) {
            const element = document.getElementById(id);
            if (element) {
                window[key] = element;
                break;
            }
        }
    });
}

// Update color display
function updateColor() {
    const hue = hueSlider ? hueSlider.value : currentHue;
    const saturation = saturationSlider ? saturationSlider.value : currentSaturation;
    const lightness = lightnessSlider ? lightnessSlider.value : currentLightness;
    
    currentHue = parseFloat(hue);
    currentSaturation = parseFloat(saturation);
    currentLightness = parseFloat(lightness);
    
    // Update CSS custom properties for dynamic gradients
    document.documentElement.style.setProperty('--current-hue', hue);
    document.documentElement.style.setProperty('--current-saturation', saturation + '%');
    
    const hsl = `hsl(${currentHue}, ${currentSaturation}%, ${currentLightness}%)`;

    // Update main display
    if (colorDisplay) {
        colorDisplay.style.backgroundColor = hsl;
    }

    // Update value displays
    if (hueValue) hueValue.textContent = Math.round(currentHue);
    if (saturationValue) saturationValue.textContent = Math.round(currentSaturation);
    if (lightnessValue) lightnessValue.textContent = Math.round(currentLightness);
    
    if (hslValue) hslValue.textContent = hsl;

    // Update saturation slider background
    if (saturationSlider) {
        saturationSlider.style.background = `linear-gradient(to right, 
            hsl(${currentHue}, 0%, ${currentLightness}%), 
            hsl(${currentHue}, 100%, ${currentLightness}%))`;
    }

    // Update lightness slider background
    if (lightnessSlider) {
        lightnessSlider.style.background = `linear-gradient(to right, 
            hsl(${currentHue}, ${currentSaturation}%, 0%), 
            hsl(${currentHue}, ${currentSaturation}%, 50%), 
            hsl(${currentHue}, ${currentSaturation}%, 100%))`;
    }

    // Convert to RGB and HEX
    const rgb = hslToRgb(currentHue, currentSaturation, currentLightness);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

    // Update all color value displays
    updateColorValues(hsl, rgb, hex);
    
// Consolidate color value updates into a single function
function updateColorValues(hsl, rgb, hex) {
    const additionalElements = {
        'hsla-value': `hsla(${currentHue}, ${currentSaturation}%, ${currentLightness}%, 1)`,
        'rgba-value': `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
        'css-value': hsl,
        'color-preview': hsl
    };
    
    // Update main value displays
    if (hslValue) hslValue.textContent = hsl;
    if (rgbValue) rgbValue.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    if (hexValue) hexValue.textContent = hex;
    
    // Update additional elements if they exist
    Object.entries(additionalElements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            if (id === 'color-preview') {
                element.style.backgroundColor = value;
                element.textContent = value;
            } else {
                element.textContent = value;
            }
        }
    });
}
}

// HSL to RGB conversion
function hslToRgb(h, s, l) {
    h = h / 360;
    s = s / 100;
    l = l / 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

// RGB to HEX conversion
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

// Copy to clipboard function
function copyToClipboard(text) {
    if (!text) {
        text = hslValue ? hslValue.textContent : `hsl(${currentHue}, ${currentSaturation}%, ${currentLightness}%)`;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        if (copyNotification) {
            copyNotification.classList.add("show");
            setTimeout(() => copyNotification.classList.remove("show"), 2000);
        }
        
        // Fallback for copy button feedback
        const button = document.querySelector('.copy-button');
        if (button) {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 1000);
        }
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Apply theme
function applyTheme(theme) {
    document.body.setAttribute("data-theme", theme);
    currentTheme = theme;

    // Adjust guide boxes based on theme
    updateGuideBoxes();

    // Save theme preference
    localStorage.setItem("colorPickerTheme", theme);
}

// Update guide boxes based on current theme
function updateGuideBoxes() {
    const guides = document.querySelectorAll(".guide-box");
    if (guides.length === 0) return;
    
    const colors = {
        hue: {
            default: "red",
            ocean: "#0088cc",
            sunset: "#ff7e00",
            forest: "#2d6a4f",
            cyberpunk: "#ff00ff",
            dark: "#007bff",
        },
        sat: {
            default: "#ff0000",
            ocean: "#0088cc",
            sunset: "#ff7e00",
            forest: "#2d6a4f",
            cyberpunk: "#ff00ff",
            dark: "#007bff",
        },
    };

    // Update the hue guide
    if (guides[0]) {
        guides[0].style.background = `linear-gradient(to right, gray, ${
            colors.hue[currentTheme] || "red"
        })`;
    }

    // Update the saturation guide
    if (guides[1]) {
        guides[1].style.background = `linear-gradient(to right, #888, ${
            colors.sat[currentTheme] || "#ff0000"
        })`;
    }

    // Update the lightness guide with current theme's primary color
    if (guides[2]) {
        const computed = getComputedStyle(document.documentElement);
        const primaryColor =
            computed.getPropertyValue("--primary").trim() || "#007bff";
        guides[2].style.background = `linear-gradient(to right, black, ${primaryColor}, white)`;
    }
}

// Layout adjustment based on Golden Ratio
function adjustLayoutUsingGoldenRatio() {
    const container = document.querySelector(".color-picker-container");
    if (!container) return;
    
    const goldenRatio = 1.618;

    // Calculate width based on viewport
    const viewportWidth = Math.min(window.innerWidth * 0.9, 800);
    container.style.width = `${viewportWidth}px`;

    // Set height based on golden ratio
    const height = viewportWidth / goldenRatio;
    container.style.minHeight = `${height}px`;
}

// Initialize the color picker when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements
    initializeElements();
    
// Consolidated event listener setup
function setupEventListeners() {
    const sliderConfigs = [
        { element: hueSlider, property: 'hue' },
        { element: saturationSlider, property: 'saturation' },
        { element: lightnessSlider, property: 'lightness' }
    ];
    
    // Add slider event listeners
    sliderConfigs.forEach(config => {
        if (config.element) {
            config.element.addEventListener('input', updateColor);
        }
    });
    
    // Copy functionality
    const copyButton = document.getElementById('copy-button');
    if (copyButton) {
        copyButton.addEventListener('click', () => copyToClipboard());
    }
    
    // Click to copy color values
    [hslValue, rgbValue, hexValue].forEach(element => {
        if (element) {
            element.addEventListener("click", () => copyToClipboard(element.textContent));
        }
    });

    // Theme selector
    if (themeSelect) {
        themeSelect.addEventListener("change", (e) => applyTheme(e.target.value));
        
        // Load saved theme
        const savedTheme = localStorage.getItem("colorPickerTheme");
        if (savedTheme) {
            themeSelect.value = savedTheme;
            applyTheme(savedTheme);
        }
    }

    // Layout adjustment on resize
    window.addEventListener("resize", adjustLayoutUsingGoldenRatio);
}
    adjustLayoutUsingGoldenRatio();
    
    // Call the consolidated setup function
    setupEventListeners();
    
    // Initialize the color picker
    updateColor();
});