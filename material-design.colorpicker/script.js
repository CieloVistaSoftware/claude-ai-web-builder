// Material Design Color Picker Script
// This script handles color slider interactions and theme generation

// Global variables
let currentHue = 260; // Default purple hue
let isDragging = false;

// Initialize the color picker when the page loads
document.addEventListener('DOMContentLoaded', function() {
  initializeColorPicker();
  updateColorSwatches();
  setupColorSliderEvents();
  setupSwatchClickHandlers();
});

// Initialize the color picker with default position
function initializeColorPicker() {
  const colorBar = document.getElementById('colorBar');
  const colorPointer = document.getElementById('colorPointer');
  
  if (!colorBar || !colorPointer) {
    console.error('Color picker elements not found');
    return;
  }
  
  // Set initial position based on default hue (260 degrees = purple)
  const initialPosition = (currentHue / 360) * 100;
  colorPointer.style.left = `${initialPosition}%`;
  
  // Update the current color display
  updateCurrentColor();
}

// Setup event handlers for the color slider
function setupColorSliderEvents() {
  const colorBar = document.getElementById('colorBar');
  const colorPointer = document.getElementById('colorPointer');
  
  if (!colorBar || !colorPointer) {
    console.error('Color picker elements not found');
    return;
  }
  
  // Mouse events
  colorBar.addEventListener('mousedown', handleColorBarClick);
  colorPointer.addEventListener('mousedown', startDragging);
  document.addEventListener('mousemove', handleDragging);
  document.addEventListener('mouseup', stopDragging);
  
  // Touch events for mobile
  colorBar.addEventListener('touchstart', handleColorBarTouch, { passive: false });
  colorPointer.addEventListener('touchstart', startDraggingTouch, { passive: false });
  document.addEventListener('touchmove', handleDraggingTouch, { passive: false });
  document.addEventListener('touchend', stopDragging);
  
  // Keyboard accessibility
  colorBar.addEventListener('keydown', handleKeyboardNavigation);
  colorBar.setAttribute('tabindex', '0');
  colorBar.setAttribute('role', 'slider');
  colorBar.setAttribute('aria-valuemin', '0');
  colorBar.setAttribute('aria-valuemax', '360');
  colorBar.setAttribute('aria-valuenow', currentHue.toString());
  colorBar.setAttribute('aria-label', 'Color hue selector');
}

// Handle clicks on the color bar
function handleColorBarClick(event) {
  event.preventDefault();
  const rect = event.currentTarget.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
  
  updateColorFromPercentage(percentage);
  startDragging(event);
}

// Handle touch events on the color bar
function handleColorBarTouch(event) {
  event.preventDefault();
  const touch = event.touches[0];
  const rect = event.currentTarget.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
  
  updateColorFromPercentage(percentage);
  isDragging = true;
}

// Start dragging the color pointer
function startDragging(event) {
  event.preventDefault();
  isDragging = true;
  document.body.style.userSelect = 'none';
}

// Start dragging for touch events
function startDraggingTouch(event) {
  event.preventDefault();
  isDragging = true;
  document.body.style.userSelect = 'none';
}

// Handle dragging movement
function handleDragging(event) {
  if (!isDragging) return;
  
  event.preventDefault();
  const colorBar = document.getElementById('colorBar');
  const rect = colorBar.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
  
  updateColorFromPercentage(percentage);
}

// Handle touch dragging movement
function handleDraggingTouch(event) {
  if (!isDragging) return;
  
  event.preventDefault();
  const touch = event.touches[0];
  const colorBar = document.getElementById('colorBar');
  const rect = colorBar.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
  
  updateColorFromPercentage(percentage);
}

// Stop dragging
function stopDragging() {
  isDragging = false;
  document.body.style.userSelect = '';
}

// Handle keyboard navigation
function handleKeyboardNavigation(event) {
  const step = event.shiftKey ? 10 : 1; // Larger steps with Shift
  
  switch(event.key) {
    case 'ArrowLeft':
    case 'ArrowDown':
      event.preventDefault();
      currentHue = Math.max(0, currentHue - step);
      updateColorFromHue();
      break;
    case 'ArrowRight':
    case 'ArrowUp':
      event.preventDefault();
      currentHue = Math.min(360, currentHue + step);
      updateColorFromHue();
      break;
    case 'Home':
      event.preventDefault();
      currentHue = 0;
      updateColorFromHue();
      break;
    case 'End':
      event.preventDefault();
      currentHue = 360;
      updateColorFromHue();
      break;
  }
}

// Update color from percentage position
function updateColorFromPercentage(percentage) {
  currentHue = (percentage / 100) * 360;
  updateColorFromHue();
}

// Update color from hue value
function updateColorFromHue() {
  const colorPointer = document.getElementById('colorPointer');
  const colorBar = document.getElementById('colorBar');
  
  // Update pointer position
  const percentage = (currentHue / 360) * 100;
  colorPointer.style.left = `${percentage}%`;
  
  // Update accessibility attributes
  colorBar.setAttribute('aria-valuenow', Math.round(currentHue).toString());
  
  // Update current color display
  updateCurrentColor();
  
  // Generate and apply new color palette
  generateMaterialDesignPalette();
  updateColorSwatches();
}

// Update the current color display in the pointer
function updateCurrentColor() {
  const currentColor = window.WBComponentUtils.ColorUtils.hslToHex(currentHue, 65, 50);
  document.documentElement.style.setProperty('--current-color', currentColor);
}

// Generate Material Design color palette from hue
function generateMaterialDesignPalette() {
  const primary = window.WBComponentUtils.ColorUtils.hslToHex(currentHue, 65, 50);
  const primaryContainer = window.WBComponentUtils.ColorUtils.hslToHex(currentHue, 85, 90);
  
  // Generate secondary color (offset by 30 degrees)
  const secondaryHue = (currentHue + 30) % 360;
  const secondary = window.WBComponentUtils.ColorUtils.hslToHex(secondaryHue, 45, 45);
  const secondaryContainer = window.WBComponentUtils.ColorUtils.hslToHex(secondaryHue, 65, 85);
  
  // Generate tertiary color (offset by 60 degrees)
  const tertiaryHue = (currentHue + 60) % 360;
  const tertiary = window.WBComponentUtils.ColorUtils.hslToHex(tertiaryHue, 55, 45);
  const tertiaryContainer = window.WBComponentUtils.ColorUtils.hslToHex(tertiaryHue, 75, 85);
  
  // Update CSS custom properties
  document.documentElement.style.setProperty('--md-primary', primary);
  document.documentElement.style.setProperty('--md-primary-container', primaryContainer);
  document.documentElement.style.setProperty('--md-secondary', secondary);
  document.documentElement.style.setProperty('--md-secondary-container', secondaryContainer);
  document.documentElement.style.setProperty('--md-tertiary', tertiary);
  document.documentElement.style.setProperty('--md-tertiary-container', tertiaryContainer);
  
  // Store the colors for potential use
  window.generatedColors = {
    primary,
    primaryContainer,
    secondary,
    secondaryContainer,
    tertiary,
    tertiaryContainer
  };
}

// Update color swatch displays
function updateColorSwatches() {
  const swatches = [
    { selector: '.primary-swatch', property: '--md-primary' },
    { selector: '.primary-container-swatch', property: '--md-primary-container' },
    { selector: '.secondary-swatch', property: '--md-secondary' },
    { selector: '.secondary-container-swatch', property: '--md-secondary-container' },
    { selector: '.tertiary-swatch', property: '--md-tertiary' },
    { selector: '.tertiary-container-swatch', property: '--md-tertiary-container' }
  ];
  
  swatches.forEach(({ selector, property }) => {
    const swatchElement = document.querySelector(selector);
    if (swatchElement) {
      const colorValue = getComputedStyle(document.documentElement).getPropertyValue(property).trim();
      
      // Update swatch color
      const colorDiv = swatchElement.querySelector('.swatch-color');
      if (colorDiv) {
        colorDiv.style.backgroundColor = colorValue;
      }
      
      // Update color value display
      const valueDiv = swatchElement.querySelector('.color-value');
      if (valueDiv) {
        valueDiv.textContent = colorValue.toUpperCase();
      }
    }
  });
}

// Setup click handlers for color swatches
function setupSwatchClickHandlers() {
  document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', function() {
      const colorValue = this.querySelector('.color-value');
      if (colorValue) {
        copyToClipboard(colorValue.textContent);
        showNotification(`Copied ${colorValue.textContent} to clipboard!`);
      }
    });
  });
}


// Theme toggle functionality
function toggleTheme() {
  const body = document.body;
  const currentTheme = body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  body.setAttribute('data-theme', newTheme);
  
  // Update theme toggle button text
  const themeToggle = document.querySelector('.theme-toggle span');
  if (themeToggle) {
    themeToggle.textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
  }
  
  // Save theme preference
  localStorage.setItem('preferred-theme', newTheme);
}

// Copy text to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch (err) {
      console.error('Failed to copy text:', err);
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

// Show notification
function showNotification(message = 'Color Copied!\nThe color value has been copied to your clipboard.') {
  const notification = document.getElementById('notification');
  if (notification) {
    notification.innerHTML = message.replace('\n', '<br>');
    notification.classList.add('show');
    
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }
}

// Initialize theme from saved preference
function initializeTheme() {
  const savedTheme = localStorage.getItem('preferred-theme');
  if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
    const themeToggle = document.querySelector('.theme-toggle span');
    if (themeToggle) {
      themeToggle.textContent = savedTheme === 'dark' ? 'light_mode' : 'dark_mode';
    }
  }
}

// Check for system dark mode preference (called from HTML)
function checkDarkModePref() {
  // Only set dark mode if no preference is saved
  if (!localStorage.getItem('preferred-theme')) {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.setAttribute('data-theme', 'dark');
      const themeToggle = document.querySelector('.theme-toggle span');
      if (themeToggle) {
        themeToggle.textContent = 'light_mode';
      }
    }
  } else {
    initializeTheme();
  }
}

// Export functions for global access
window.toggleTheme = toggleTheme;
window.showNotification = showNotification;
window.checkDarkModePref = checkDarkModePref;