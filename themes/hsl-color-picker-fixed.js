// HSL Color Picker with Themes
let hue = 180;
let saturation = 100;
let lightness = 50;

// Dragging, resizing, and minimize functionality
let isDragging = false;
let isResizing = false;
let dragOffset = { x: 0, y: 0 };
let resizeStart = { x: 0, y: 0, width: 0, height: 0 };

function updateColor() {
  const hslColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const rgbColor = hslToRgb(hue, saturation, lightness);
  const hexColor = rgbToHex(rgbColor.r, rgbColor.g, rgbColor.b);

  // Update preview
  const colorDisplay = document.getElementById('colorDisplay');
  if (colorDisplay) {
    colorDisplay.style.backgroundColor = hslColor;
  }

  // Update value displays
  const hueValue = document.getElementById('hueValue');
  const saturationValue = document.getElementById('saturationValue');
  const lightnessValue = document.getElementById('lightnessValue');
  const hslValue = document.getElementById('hslValue');
  const rgbValue = document.getElementById('rgbValue');
  const hexValue = document.getElementById('hexValue');

  if (hueValue) hueValue.textContent = hue;
  if (saturationValue) saturationValue.textContent = saturation;
  if (lightnessValue) lightnessValue.textContent = lightness;
  if (hslValue) hslValue.textContent = hslColor;
  if (rgbValue) rgbValue.textContent = `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`;
  if (hexValue) hexValue.textContent = hexColor;
}

function setupEventListeners() {
  const hueSlider = document.getElementById('hue');
  const saturationSlider = document.getElementById('saturationSlider');
  const lightnessSlider = document.getElementById('lightnessSlider');
  const themeToggle = document.getElementById('theme-toggle');

  if (hueSlider) {
    hueSlider.addEventListener('input', function() {
      hue = parseInt(this.value);
      updateColor();
    });
  }

  if (saturationSlider) {
    saturationSlider.addEventListener('input', function() {
      saturation = parseInt(this.value);
      updateColor();
    });
  }

  if (lightnessSlider) {
    lightnessSlider.addEventListener('input', function() {
      lightness = parseInt(this.value);
      updateColor();
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const isDark = this.classList.contains('dark');
      if (isDark) {
        this.classList.remove('dark');
        this.classList.add('light');
        this.querySelector('.toggle-text').textContent = 'Light';
        document.body.setAttribute('data-theme', 'light');
      } else {
        this.classList.remove('light');
        this.classList.add('dark');
        this.querySelector('.toggle-text').textContent = 'Dark';
        document.body.setAttribute('data-theme', 'dark');
      }
    });
  }
}

function setupDragAndMinimize() {
  const container = document.getElementById('colorPickerContainer');
  const header = document.getElementById('containerHeader');
  const minimizeBtn = document.getElementById('minimizeBtn');
  const resizeHandle = document.getElementById('resizeHandle');

  console.log('Setting up drag and minimize functionality');
  console.log('Container:', container);
  console.log('Header:', header);
  console.log('Minimize button:', minimizeBtn);
  console.log('Resize handle:', resizeHandle);

  // Minimize functionality
  if (minimizeBtn && container) {
    minimizeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      console.log('Minimize button clicked');
      const isMinimized = container.classList.toggle('minimized');
      const icon = this.querySelector('.minimize-icon');
      if (icon) {
        icon.textContent = isMinimized ? '+' : '−';
      }
      console.log('Container minimized:', isMinimized);
    });
  }

  // Resize functionality
  if (resizeHandle && container) {
    resizeHandle.addEventListener('mousedown', function(e) {
      e.stopPropagation();
      e.preventDefault();
      console.log('Resize handle mousedown');
      isResizing = true;
      container.classList.add('resizing');
      
      const rect = container.getBoundingClientRect();
      resizeStart.x = e.clientX;
      resizeStart.y = e.clientY;
      resizeStart.width = rect.width;
      resizeStart.height = rect.height;
      
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', handleResizeEnd);
    });
  }

  // Dragging functionality
  if (header && container) {
    header.addEventListener('mousedown', function(e) {
      if (e.target === minimizeBtn || e.target.parentElement === minimizeBtn || 
          e.target === resizeHandle || e.target.parentElement === resizeHandle) return;
      
      console.log('Header mousedown for dragging');
      isDragging = true;
      container.classList.add('dragging');
      
      const rect = container.getBoundingClientRect();
      dragOffset.x = e.clientX - rect.left;
      dragOffset.y = e.clientY - rect.top;
      
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleDragEnd);
    });
  }

  function handleResize(e) {
    if (!isResizing) return;
    
    const deltaX = e.clientX - resizeStart.x;
    const deltaY = e.clientY - resizeStart.y;
    
    const newWidth = Math.max(300, Math.min(window.innerWidth * 0.9, resizeStart.width + deltaX));
    const newHeight = Math.max(200, Math.min(window.innerHeight * 0.9, resizeStart.height + deltaY));
    
    container.style.width = newWidth + 'px';
    container.style.height = newHeight + 'px';
  }

  function handleResizeEnd() {
    console.log('Resize ended');
    isResizing = false;
    if (container) {
      container.classList.remove('resizing');
    }
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', handleResizeEnd);
  }

  function handleDrag(e) {
    if (!isDragging) return;
    
    const x = e.clientX - dragOffset.x;
    const y = e.clientY - dragOffset.y;
    
    // Keep container within viewport bounds
    const maxX = window.innerWidth - container.offsetWidth;
    const maxY = window.innerHeight - container.offsetHeight;
    
    const boundedX = Math.max(0, Math.min(x, maxX));
    const boundedY = Math.max(0, Math.min(y, maxY));
    
    container.style.left = boundedX + 'px';
    container.style.top = boundedY + 'px';
    container.style.transform = 'none';
  }

  function handleDragEnd() {
    console.log('Drag ended');
    isDragging = false;
    if (container) {
      container.classList.remove('dragging');
    }
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleDragEnd);
  }
}

function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = l - c / 2;

  let r, g, b;

  if (0 <= h && h < 1/6) {
    r = c; g = x; b = 0;
  } else if (1/6 <= h && h < 2/6) {
    r = x; g = c; b = 0;
  } else if (2/6 <= h && h < 3/6) {
    r = 0; g = c; b = x;
  } else if (3/6 <= h && h < 4/6) {
    r = 0; g = x; b = c;
  } else if (4/6 <= h && h < 5/6) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("").toUpperCase();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing...');
  setupEventListeners();
  setupDragAndMinimize();
  updateColor();
});