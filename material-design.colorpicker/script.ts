export {};
// @ts-nocheck
// Theme toggle functionality
function toggleTheme(): any {
  console.log("[FLOW] toggleTheme - START");

  const body = document.body;
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "" : "dark";

  console.log("[FLOW] toggleTheme - From", currentTheme, "to", newTheme);

  // Set the theme attribute on both body and html
  body.setAttribute("data-theme", newTheme);
  document.documentElement.setAttribute("data-theme", newTheme);

  // Verify the theme was actually set
  console.log("[FLOW] toggleTheme - After setting attribute, body data-theme=", body.getAttribute("data-theme"),
    "html data-theme=", document.documentElement.getAttribute("data-theme"));

  // Update the toggle button icon
  const toggleBtn = document.querySelector(".theme-toggle span");
  toggleBtn.textContent = newTheme === "dark" ? "light_mode" : "dark_mode";

  console.log("[FLOW] toggleTheme - Theme toggled to:", newTheme);

  // Use a small timeout to ensure the attribute change is processed
  // This helps browser repaint with the new theme attribute before applying colors
  setTimeout((): any => {
    console.log("After timeout, theme is:", body.getAttribute("data-theme"));
    // Apply the current color scheme with the new theme
    const currentPrimary = hueToHex(currentHue);

    // Ensure the DOM state is properly refreshed
    document.body.classList.remove("temp-class");
    document.body.classList.add("temp-class");
    document.body.classList.remove("temp-class");

    applyColorScheme(currentPrimary, true);
  }, 50);
}

// Color manipulation utilities
function hexToHsl(hex): any {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

function hslToHex(h, s, l): any {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hueToHex(hue): any {
  // Convert hue (0-360) to RGB
  const c = 1; // Full saturation
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = 0;

  let r, g, b;
  if (hue >= 0 && hue < 60) {
    [r, g, b] = [c, x, 0];
  } else if (hue >= 60 && hue < 120) {
    [r, g, b] = [x, c, 0];
  } else if (hue >= 120 && hue < 180) {
    [r, g, b] = [0, c, x];
  } else if (hue >= 180 && hue < 240) {
    [r, g, b] = [0, x, c];
  } else if (hue >= 240 && hue < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  // Adjust for lightness and saturation to get a good primary color
  const saturation = 0.7;
  const lightness = 0.45;

  return hslToHex(hue, saturation * 100, lightness * 100);
}

// Color slider functionality
let isDragging = false;
let currentHue = 270; // Default purple hue
let isSliderFocused = false;

function initColorSlider(): any {
  const colorBar = document.getElementById("colorBar");
  const colorPointer = document.getElementById("colorPointer");

  // Make color bar focusable
  colorBar.setAttribute("tabindex", "0");
  colorBar.setAttribute("role", "slider");
  colorBar.setAttribute("aria-label", "Select primary color");
  colorBar.setAttribute("aria-valuemin", "0");
  colorBar.setAttribute("aria-valuemax", "360");

  // Set initial position for default purple
  updatePointerPosition(currentHue);
  updateAriaValue(currentHue);

  // Mouse events
  colorBar.addEventListener("mousedown", handleSliderStart);
  colorBar.addEventListener("mousemove", handleSliderMove);
  document.addEventListener("mouseup", handleSliderEnd);

  // Touch events for mobile
  colorBar.addEventListener("touchstart", handleSliderStart);
  colorBar.addEventListener("touchmove", handleSliderMove);
  document.addEventListener("touchend", handleSliderEnd);

  // Focus events
  colorBar.addEventListener("focus", (): any => {
    isSliderFocused = true;
    console.log("Color bar focused");
  });

  colorBar.addEventListener("blur", (): any => {
    isSliderFocused = false;
    console.log("Color bar blurred");
  });

  // Click to focus
  colorBar.addEventListener("click", (): any => {
    colorBar.focus();
  });

  // Keyboard events - attach directly to color bar
  colorBar.addEventListener("keydown", (e): any => {
    console.log(
      "Key pressed on color bar:",
      e.key,
      "Focused:",
      isSliderFocused
    );

    let step = 1;
    if (e.shiftKey) step = 10;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        currentHue = Math.max(0, currentHue - step);
        updateFromKeyboard();
        break;
      case "ArrowRight":
        e.preventDefault();
        currentHue = Math.min(360, currentHue + step);
        updateFromKeyboard();
        break;
      case "ArrowDown":
        e.preventDefault();
        currentHue = Math.max(0, currentHue - step);
        updateFromKeyboard();
        break;
      case "ArrowUp":
        e.preventDefault();
        currentHue = Math.min(360, currentHue + step);
        updateFromKeyboard();
        break;
      case "Home":
        e.preventDefault();
        currentHue = 0;
        updateFromKeyboard();
        break;
      case "End":
        e.preventDefault();
        currentHue = 360;
        updateFromKeyboard();
        break;
    }
  });
}

function updateFromKeyboard(): any {
  console.log("[FLOW] updateFromKeyboard - START");

  updatePointerPosition(currentHue);
  updateAriaValue(currentHue);

  const hex = hueToHex(currentHue);
  console.log("[FLOW] updateFromKeyboard - Calculated hex:", hex, "from hue:", currentHue);

  // Force a re-calculation of the color scheme based on the current theme
  // Force DOM state refresh before checking theme
  document.body.classList.remove("temp-class");
  document.body.classList.add("temp-class");
  document.body.classList.remove("temp-class");

  const isDark = document.body.getAttribute("data-theme") === "dark";
  console.log("[FLOW] updateFromKeyboard - Before applyColorScheme - isDark:", isDark);

  applyColorScheme(hex, true);

  console.log("[FLOW] updateFromKeyboard - COMPLETE - hue:", currentHue, "hex:", hex,
    "isDarkTheme:", document.body.getAttribute("data-theme") === "dark");
}

function updateAriaValue(hue): any {
  const colorBar = document.getElementById("colorBar");
  if (colorBar) {
    colorBar.setAttribute("aria-valuenow", Math.round(hue));
    colorBar.setAttribute(
      "aria-valuetext",
      `Hue ${Math.round(hue)} degrees`
    );
  }
}

function handleSliderStart(e): any {
  isDragging = true;
  updateSliderFromEvent(e);
  e.preventDefault();
}

function handleSliderMove(e): any {
  if (!isDragging) return;
  updateSliderFromEvent(e);
  e.preventDefault();
}

function handleSliderEnd(): any {
  isDragging = false;
}

function updateSliderFromEvent(e): any {
  console.log("[FLOW] updateSliderFromEvent - START");
  const colorBar = document.getElementById("colorBar");
  const rect = colorBar.getBoundingClientRect();

  // Get x position from mouse or touch
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const x = clientX - rect.left;
  const percentage = Math.max(0, Math.min(1, x / rect.width));

  // Convert percentage to hue (0-360)
  currentHue = percentage * 360;

  console.log("[FLOW] updateSliderFromEvent - currentHue set to:", currentHue);

  // Update pointer position and color
  updatePointerPosition(currentHue);

  // Generate color and apply
  const hex = hueToHex(currentHue);
  console.log("[FLOW] updateSliderFromEvent - hex calculated:", hex);
  updateColorInputs(hex);

  // Force recalculation of theme-specific colors - ensure DOM state is fresh
  document.body.classList.remove("temp-class");
  document.body.classList.add("temp-class");
  document.body.classList.remove("temp-class");

  const isDark = document.body.getAttribute("data-theme") === "dark";
  console.log("[FLOW] updateSliderFromEvent - Before applyColorScheme - isDark:", isDark, "Hue:", currentHue);
  applyColorScheme(hex, true);

  console.log("[FLOW] updateSliderFromEvent - COMPLETE");
}

function updatePointerPosition(hue): any {
  const colorPointer = document.getElementById("colorPointer");
  const percentage = hue / 360;
  colorPointer.style.left = `${percentage * 100}%`;

  // Update pointer color to match current selection
  const currentColor = hueToHex(hue);
  colorPointer.style.setProperty("--current-color", currentColor);

  // Update aria value for accessibility
  updateAriaValue(hue);
}

// This function previously handled custom color inputs that were removed
// Keeping an empty implementation for compatibility with existing calls
function updateColorInputs(hex): any {
  // No operation - inputs were removed
}

function setPrimaryColor(hex): any {
  // Convert hex to hue for slider position
  const [h] = hexToHsl(hex);
  currentHue = h;
  updatePointerPosition(currentHue);
  updateColorInputs(hex);

  // Ensure we're getting a fresh theme state before applying colors
  const isDark = document.body.getAttribute("data-theme") === "dark";
  console.log("Setting primary color in theme:", isDark ? "dark" : "light");
  applyColorScheme(hex);
}

function generateMaterialColors(primaryHex): any {
  console.log("[FLOW] generateMaterialColors - START with primaryHex:", primaryHex);

  const [h, s, l] = hexToHsl(primaryHex);
  console.log("[FLOW] generateMaterialColors - HSL values calculated:", h, s, l);

  // Get the current theme state directly from the DOM
  // This ensures we're not using a cached value
  // Force a DOM reflow to ensure we have the latest attribute value
  document.body.classList.remove("temp-class");
  document.body.classList.add("temp-class");
  document.body.classList.remove("temp-class");

  const isDark = document.body.getAttribute("data-theme") === "dark";

  console.log("[FLOW] generateMaterialColors - Data check - isDark:", isDark,
    "Theme attribute:", document.body.getAttribute("data-theme"),
    "Primary hex:", primaryHex,
    "Hue:", h);
  // Material Design 3 uses specific saturation and lightness values
  // Adjust these values for better contrast in dark mode
  const baseSaturation = isDark ? 85 : 70;
  const baseLightness = isDark ? 70 : 40;

  console.log("[FLOW] generateMaterialColors - Using baseSaturation:", baseSaturation,
    "baseLightness:", baseLightness, "for isDark:", isDark);

  const colors = {
    // Primary colors
    primary: primaryHex,
    onPrimary: isDark
      ? hslToHex(
        h,
        Math.max(baseSaturation - 20, 30),
        Math.max(baseLightness - 50, 10)
      )
      : "#FFFFFF",
    primaryContainer: isDark
      ? hslToHex(
        h,
        Math.max(baseSaturation - 30, 25),
        Math.max(baseLightness - 40, 20)
      )
      : hslToHex(
        h,
        Math.min(baseSaturation + 10, 90),
        Math.min(baseLightness + 50, 90)
      ),
    onPrimaryContainer: isDark
      ? hslToHex(
        h,
        Math.min(baseSaturation + 20, 95),
        Math.min(baseLightness + 25, 95)
      )
      : hslToHex(
        h,
        Math.max(baseSaturation - 20, 40),
        Math.max(baseLightness - 30, 10)
      ),

    // Secondary colors (complementary hue relationship)
    secondary: hslToHex(
      (h + 60) % 360,
      Math.max(baseSaturation - 30, 25),
      isDark
        ? Math.min(baseLightness + 10, 75)
        : Math.max(baseLightness - 5, 35)
    ),
    onSecondary: "#FFFFFF",
    secondaryContainer: isDark
      ? hslToHex(
        (h + 60) % 360,
        Math.max(baseSaturation - 40, 15),
        Math.max(baseLightness - 30, 25)
      )
      : hslToHex(
        (h + 60) % 360,
        Math.min(baseSaturation - 10, 70),
        Math.min(baseLightness + 45, 85)
      ),
    onSecondaryContainer: isDark
      ? hslToHex(
        (h + 60) % 360,
        Math.min(baseSaturation, 80),
        Math.min(baseLightness + 20, 90)
      )
      : hslToHex(
        (h + 60) % 360,
        Math.max(baseSaturation - 30, 30),
        Math.max(baseLightness - 25, 15)
      ),

    // Tertiary colors (triadic hue relationship)
    tertiary: hslToHex(
      (h + 120) % 360,
      Math.max(baseSaturation - 25, 30),
      isDark
        ? Math.min(baseLightness + 5, 70)
        : Math.max(baseLightness, 40)
    ),
    onTertiary: "#FFFFFF",
    tertiaryContainer: isDark
      ? hslToHex(
        (h + 120) % 360,
        Math.max(baseSaturation - 35, 20),
        Math.max(baseLightness - 25, 30)
      )
      : hslToHex(
        (h + 120) % 360,
        Math.min(baseSaturation - 5, 75),
        Math.min(baseLightness + 40, 85)
      ),
    onTertiaryContainer: isDark
      ? hslToHex(
        (h + 120) % 360,
        Math.min(baseSaturation + 5, 85),
        Math.min(baseLightness + 15, 90)
      )
      : hslToHex(
        (h + 120) % 360,
        Math.max(baseSaturation - 25, 35),
        Math.max(baseLightness - 20, 20)
      ),
  };

  return colors;
}

// Note: Custom color input functions have been removed as they reference HTML elements
// that are no longer present in the interface (colorPicker, colorHex inputs)

function applyColorScheme(primaryHex, fromUserInteraction = false): any {
  console.log("[FLOW] applyColorScheme - START with primaryHex:", primaryHex);

  // Force a fresh check of the current theme
  const isDark = document.body.getAttribute("data-theme") === "dark";
  console.log("[FLOW] applyColorScheme - isDark:", isDark, "Primary color:", primaryHex,
    "From user interaction:", fromUserInteraction);

  // Set a data attribute on the HTML element to ensure CSS can see the theme too
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "");

  // Generate colors based on the current theme state
  console.log("[FLOW] applyColorScheme - Before generateMaterialColors");
  const colors = generateMaterialColors(primaryHex);
  console.log("[FLOW] applyColorScheme - After generateMaterialColors, got colors object");

  // Extra debug to catch any state issues
  if (isDark) {
    console.log("[FLOW] DARK MODE COLOR GENERATION:",
      "Primary:", colors.primary,
      "PrimaryContainer:", colors.primaryContainer,
      "Secondary:", colors.secondary);
  }

  const root = document.documentElement;
  // Update CSS custom properties
  console.log("[FLOW] applyColorScheme - Updating CSS custom properties");
  root.style.setProperty("--md-primary", colors.primary);
  root.style.setProperty("--md-on-primary", colors.onPrimary);
  root.style.setProperty(
    "--md-primary-container",
    colors.primaryContainer
  );
  root.style.setProperty(
    "--md-on-primary-container",
    colors.onPrimaryContainer
  );

  root.style.setProperty("--md-secondary", colors.secondary);
  root.style.setProperty("--md-on-secondary", colors.onSecondary);
  root.style.setProperty(
    "--md-secondary-container",
    colors.secondaryContainer
  );
  root.style.setProperty(
    "--md-on-secondary-container",
    colors.onSecondaryContainer
  );

  root.style.setProperty("--md-tertiary", colors.tertiary);
  root.style.setProperty("--md-on-tertiary", colors.onTertiary);
  root.style.setProperty(
    "--md-tertiary-container",
    colors.tertiaryContainer
  );
  root.style.setProperty(
    "--md-on-tertiary-container",
    colors.onTertiaryContainer
  );
  // Update header text color directly
  const headerTitle = document.querySelector(".header h1");
  if (headerTitle) {
    console.log("[FLOW] applyColorScheme - Updating header text to:", colors.primary);
    headerTitle.style.color = colors.primary;
  } else {
    console.log("[FLOW] WARNING: Could not find header title element");
  }

  // Update section headings text colors
  const colorPickerHeading = document.querySelector(".color-picker-section h2");
  if (colorPickerHeading) {
    console.log("[FLOW] applyColorScheme - Updating color picker heading to:", colors.primary);
    colorPickerHeading.style.color = colors.primary;
  }

  const swatchesSectionHeading = document.querySelector(".color-swatches-section h2");
  if (swatchesSectionHeading) {
    console.log("[FLOW] applyColorScheme - Updating swatches section heading to:", colors.onSurface);
    // This heading uses the on-surface color
    swatchesSectionHeading.style.color = isDark ? "#e6e1e5" : "#1c1b1f"; // on-surface color values
  }

  // Update theme toggle button colors
  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    console.log("[FLOW] applyColorScheme - Updating theme toggle button colors");
    themeToggle.style.backgroundColor = colors.primary;
    themeToggle.style.color = colors.onPrimary;
  }

  // Update fab button colors
  const fabButton = document.querySelector(".fab");
  if (fabButton) {
    console.log("[FLOW] applyColorScheme - Updating FAB button colors");
    fabButton.style.backgroundColor = colors.primary;
    fabButton.style.color = colors.onPrimary;
  }

  // Update color swatch display values
  console.log("[FLOW] applyColorScheme - Calling updateColorSwatchValues");
  updateColorSwatchValues(colors);

  console.log("[FLOW] applyColorScheme - COMPLETE");
}

function updateColorSwatchValues(colors): any {
  console.log("[FLOW] updateColorSwatchValues - START");

  // Check if the color-swatches container exists
  const colorSwatchesContainer = document.querySelector('.color-swatches');
  if (!colorSwatchesContainer) {
    console.log("[FLOW] ERROR: No .color-swatches container found in the DOM");
    console.log("[FLOW] The HTML structure doesn't include the required color-swatches element");
    console.log("[FLOW] Please ensure the HTML includes a .color-swatches container");
    return; // Exit early if the container doesn't exist
  }

  console.log("[FLOW] Found color-swatches container, updating color values");

  const swatches = {
    ".primary-swatch .color-value": colors.primary,
    ".primary-container-swatch .color-value": colors.primaryContainer,
    ".secondary-swatch .color-value": colors.secondary,
    ".secondary-container-swatch .color-value": colors.secondaryContainer,
    ".tertiary-swatch .color-value": colors.tertiary,
    ".tertiary-container-swatch .color-value": colors.tertiaryContainer,
  };
  Object.entries(swatches).forEach(([selector, value]): any => {
    const element = document.querySelector(selector);
    console.log("[FLOW] updateColorSwatchValues - Updating", selector, "to", value);

    if (element) {
      element.textContent = value.toUpperCase();      // Also update the swatch-color background
      const swatchElement = element.closest(".color-swatch");
      if (swatchElement) {
        // Set the color on the color display element
        const colorDisplay = swatchElement.querySelector('.swatch-color');
        if (colorDisplay) {
          colorDisplay.style.backgroundColor = value;

          // Make sure the entire swatch has the right colors
          // This is critical for proper text display in both themes
          const swatchClass = swatchElement.classList[1]; // e.g., primary-swatch

          // Find the corresponding "on-color" CSS variable based on the swatch type
          let onColorVar;
          if (swatchClass === 'primary-swatch') {
            onColorVar = '--md-on-primary';
          } else if (swatchClass === 'primary-container-swatch') {
            onColorVar = '--md-on-primary-container';
          } else if (swatchClass === 'secondary-swatch') {
            onColorVar = '--md-on-secondary';
          } else if (swatchClass === 'secondary-container-swatch') {
            onColorVar = '--md-on-secondary-container';
          } else if (swatchClass === 'tertiary-swatch') {
            onColorVar = '--md-on-tertiary';
          } else if (swatchClass === 'tertiary-container-swatch') {
            onColorVar = '--md-on-tertiary-container';
          }          // Make sure the text elements get the right color
          const colorName = swatchElement.querySelector('.color-name');
          const colorValue = swatchElement.querySelector('.color-value');
          if (colorName && colorValue && onColorVar) {
            // Get the computed style value - this might not have a # prefix
            let textColor = getComputedStyle(document.documentElement).getPropertyValue(onColorVar).trim();

            // Add # if it's missing
            if (!textColor.startsWith('#')) {
              textColor = '#' + textColor;
            }

            // Apply colors directly
            colorName.style.color = textColor;
            colorValue.style.color = textColor;

            // Set the entire swatch background for better visibility
            swatchElement.style.backgroundColor = value;

            // Log for debugging
            console.log(`[FLOW] Setting text colors for ${swatchClass} to ${textColor} (${onColorVar})`);
          }
        } else {
          // Fallback if swatch-color isn't found
          swatchElement.style.backgroundColor = value;
          console.log("[FLOW] WARNING: No .swatch-color element found in", swatchElement);
        }

        // Update onclick to copy new color
        swatchElement.onclick = () => copyColor(value.toUpperCase());
      }
    } else {
      console.log("[FLOW] updateColorSwatchValues - WARNING: Element not found for selector:", selector);

      // Get the swatch class name without the dot prefix
      const swatchClass = selector.split(' ')[0].substring(1);
      const swatchContainer = document.querySelector(`.${swatchClass}`);

      if (swatchContainer) {
        console.log(`[FLOW] Found the swatch container ${swatchClass}, but missing the color-value element`);
        // Just log this issue - we've already created the proper HTML structure
        console.log(`[FLOW] This should not happen with the correct HTML structure`);
      } else {
        console.log(`[FLOW] Missing swatch container: ${swatchClass}`);
      }
    }
  });

  console.log("[FLOW] updateColorSwatchValues - COMPLETE");
}

function copyColor(colorValue): any {
  navigator.clipboard.writeText(colorValue).then((): any => {
    showNotification();
  });
}

function showNotification(): any {
  const notification = document.getElementById("notification");
  notification.classList.add("show");
  setTimeout((): any => {
    notification.classList.remove("show");
  }, 3000);
}

// Note: Tab functionality has been removed as there are no tab elements in the current UI

// Add button ripple effects
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded. Current theme:", document.body.getAttribute("data-theme") || "light");

  // Initialize the color slider
  initColorSlider();

  // Small delay to ensure all DOM elements and CSS are fully loaded
  setTimeout((): any => {
    // Check for system dark mode preference to initialize theme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // System is in dark mode and we haven't set a theme yet
      if (!document.body.hasAttribute("data-theme")) {
        document.body.setAttribute("data-theme", "dark");
        document.documentElement.setAttribute("data-theme", "dark");
        const toggleBtn = document.querySelector(".theme-toggle span");
        if (toggleBtn) {
          toggleBtn.textContent = "light_mode";
        }
        console.log("Applied system dark mode preference");
      }
    }

    // Force a direct update of color swatch background colors to match current theme
    console.log("[FLOW] DOM load - Forcing direct color swatch updates");
    const swatchTypes = [
      { selector: '.primary-swatch .swatch-color', colorVar: '--md-primary', textVar: '--md-on-primary' },
      { selector: '.primary-container-swatch .swatch-color', colorVar: '--md-primary-container', textVar: '--md-on-primary-container' },
      { selector: '.secondary-swatch .swatch-color', colorVar: '--md-secondary', textVar: '--md-on-secondary' },
      { selector: '.secondary-container-swatch .swatch-color', colorVar: '--md-secondary-container', textVar: '--md-on-secondary-container' },
      { selector: '.tertiary-swatch .swatch-color', colorVar: '--md-tertiary', textVar: '--md-on-tertiary' },
      { selector: '.tertiary-container-swatch .swatch-color', colorVar: '--md-tertiary-container', textVar: '--md-on-tertiary-container' }
    ];

    swatchTypes.forEach(swatch => {
      const element = document.querySelector(swatch.selector);
      if (element) {
        const computedColor = getComputedStyle(document.documentElement).getPropertyValue(swatch.colorVar).trim();
        element.style.backgroundColor = computedColor.startsWith('#') ? computedColor : `#${computedColor}`;

        // Also set parent background
        const swatchElement = element.closest('.color-swatch');
        if (swatchElement) {
          swatchElement.style.backgroundColor = computedColor.startsWith('#') ? computedColor : `#${computedColor}`;
        }

        console.log(`[FLOW] Initial setup - Set ${swatch.selector} to ${computedColor}`);
      }
    });

    // Apply initial color scheme - ensures colors are properly set for current theme
    const initialHex = hueToHex(currentHue);

    // Force a fresh check of the current theme with DOM refresh
    document.body.classList.remove("temp-class");
    document.body.classList.add("temp-class");
    document.body.classList.remove("temp-class");

    const isDark = document.body.getAttribute("data-theme") === "dark";
    console.log("Initializing with theme:", isDark ? "dark" : "light", "and color:", initialHex);

    applyColorScheme(initialHex, false);

    // Set up theme change listener
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      if (!document.body.hasAttribute("data-theme") || document.body.getAttribute("data-theme") === "") {
        // Only auto-switch if user hasn't manually set a theme
        const newTheme = event.matches ? "dark" : "";
        document.body.setAttribute("data-theme", newTheme);

        const toggleBtn = document.querySelector(".theme-toggle span");
        if (toggleBtn) {
          toggleBtn.textContent = newTheme === "dark" ? "light_mode" : "dark_mode";
        }

        // Reapply colors with new theme
        applyColorScheme(hueToHex(currentHue), false);
        console.log("Theme auto-switched based on system preference to:", newTheme || "light");
      }
    });
  }, 50);

  // Add ripple effects to buttons
  document.querySelectorAll(".btn").forEach((btn): any => {
    btn.addEventListener("click", function (e) {
      // Create ripple effect
      const ripple = document.createElement("div");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;

      this.style.position = "relative";
      this.style.overflow = "hidden";
      this.appendChild(ripple);

      setTimeout((): any => {
        ripple.remove();
      }, 600);
    });
  });
});
