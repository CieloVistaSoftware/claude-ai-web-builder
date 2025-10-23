// Professional-Developer-HCS-System.js
// JavaScript for the Professional Developer HCS System demo

// Set initial view to 'code'
document.body.setAttribute('data-view', 'code');

// Audio modulation system - CONSIDER MOVING TO wb-audio-modulation COMPONENT
let audioContext = null;
let analyser = null;
let audioStream = null;
let animationFrameId = null;
let audioEnabled = false;
// Gain multipliers (default 1.0)
let inputGain = 1.0;
let bassGain = 1.0;
let midsGain = 1.0;
let trebleGain = 1.0;

function startAudioModulation() {
  if (!animationFrameId) {
    animateWithAudio();
  }
}

function stopAudioModulation() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

function analyzeAudio() {
  if (!analyser) return { bass: 0, mids: 0, treble: 0 };
  
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);
  
  const bufferLength = dataArray.length;
  const bassEnd = Math.floor(bufferLength * 0.15);
  const midsEnd = Math.floor(bufferLength * 0.5);
  
  let bassSum = 0, midsSum = 0, trebleSum = 0;
  
  for (let i = 0; i < bufferLength; i++) {
    if (i < bassEnd) bassSum += dataArray[i];
    else if (i < midsEnd) midsSum += dataArray[i];
    else trebleSum += dataArray[i];
  }
  
  // Normalize and apply gain multipliers
  const rawBass = Math.min(1, (bassSum / (bassEnd * 255)) * 2) * inputGain * bassGain;
  const rawMids = Math.min(1, (midsSum / ((midsEnd - bassEnd) * 255)) * 2) * inputGain * midsGain;
  const rawTreble = Math.min(1, (trebleSum / ((bufferLength - midsEnd) * 255)) * 2) * inputGain * trebleGain;

  // Clamp to 0..1 after gain
  return {
    bass: Math.max(0, Math.min(1, rawBass)),
    mids: Math.max(0, Math.min(1, rawMids)),
    treble: Math.max(0, Math.min(1, rawTreble))
  };
}

function animateWithAudio() {
  if (!audioEnabled) return;
  
  const audio = analyzeAudio();
  const root = document.documentElement;
  
  // Get current HCS values
  const baseHue = parseInt(getComputedStyle(root).getPropertyValue('--hue-primary') || 240);
  const baseSat = parseInt(getComputedStyle(root).getPropertyValue('--saturation-primary') || 70);
  const baseLight = parseInt(getComputedStyle(root).getPropertyValue('--lightness-primary') || 50);
  
  // Modulate based on audio
  const newHue = (baseHue + (audio.bass * 60 - 30) + 360) % 360;
  const newSat = Math.max(30, Math.min(100, baseSat + (audio.mids * 40 - 20)));
  const newLight = Math.max(30, Math.min(70, baseLight + (audio.treble * 30 - 15)));
  
  // Apply modulated values
  root.style.setProperty('--hue-primary', Math.round(newHue));
  root.style.setProperty('--saturation-primary', Math.round(newSat));
  root.style.setProperty('--lightness-primary', Math.round(newLight));
  
  animationFrameId = requestAnimationFrame(animateWithAudio);
}

async function captureTabAudio() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      }
    });
    
    // Stop video track immediately
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.stop();
      stream.removeTrack(videoTrack);
    }
    
    audioStream = stream;
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    
    analyser.fftSize = 256;
    source.connect(analyser);
    
    audioEnabled = true;
    startAudioModulation();
    
    const statusEl = document.getElementById('audio-status');
    if (statusEl) {
      statusEl.style.display = 'block';
      statusEl.textContent = '✅ Audio modulation active';
      statusEl.style.color = 'var(--success-color)';
    }
    
    logEvent('🎵', 'Tab audio captured - colors modulating!');
    
  } catch (error) {
    console.error('Audio capture failed:', error);
    const statusEl = document.getElementById('audio-status');
    if (statusEl) {
      statusEl.style.display = 'block';
      statusEl.textContent = '❌ Failed to capture audio';
      statusEl.style.color = 'var(--error-color)';
    }
    logEvent('❌', 'Audio capture failed', error.message);
  }
}

function stopTabAudio() {
  audioEnabled = false;
  stopAudioModulation();
  
  if (audioStream) {
    audioStream.getTracks().forEach(track => track.stop());
    audioStream = null;
  }
  
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
  
  analyser = null;
  
  const statusEl = document.getElementById('audio-status');
  if (statusEl) {
    statusEl.style.display = 'none';
  }
  
  logEvent('⏸️', 'Audio modulation stopped');
}

// Update body background color to match theme
function updateBodyBackground() {
  const root = document.documentElement;
  const computed = getComputedStyle(root);
  const bgColor = computed.getPropertyValue('--background').trim();
  if (bgColor) {
    document.body.style.backgroundColor = bgColor;
  }
}

// Event logging utility
function logEvent(emoji, message, data = null) {
  try {
    console.log(`${emoji} ${message}`, data || '');
    const detail = { emoji, message, data, timestamp: new Date().toISOString() };
    document.dispatchEvent(new CustomEvent('wb:event', { detail, bubbles: true, composed: true }));
  } catch (err) {
    console.log(emoji, message, data || '', err);
  }
}

// Theme configurations
const themes = {
  default: { hue: 240, sat: 70, light: 50 },
  cyberpunk: { hue: 320, sat: 100, light: 50 },
  ocean: { hue: 200, sat: 80, light: 50 },
  sunset: { hue: 25, sat: 90, light: 55 },
  forest: { hue: 140, sat: 60, light: 45 },
  lavender: { hue: 270, sat: 65, light: 60 },
  sakura: { hue: 340, sat: 70, light: 70 },
  midnight: { hue: 230, sat: 85, light: 35 },
  neonDreams: { hue: 280, sat: 95, light: 55 },
  retroWave: { hue: 330, sat: 85, light: 60 },
  arctic: { hue: 190, sat: 75, light: 65 },
  desert: { hue: 35, sat: 65, light: 60 },
  emerald: { hue: 150, sat: 75, light: 45 },
  ruby: { hue: 0, sat: 80, light: 50 },
  amber: { hue: 45, sat: 85, light: 55 },
  slate: { hue: 210, sat: 25, light: 45 }
};

// Apply theme function - ONLY SETS BASE HCS VALUES, CSS handles the rest
function applyTheme(themeId) {
  const theme = themes[themeId];
  if (!theme) {
    logEvent('❌', `Theme not found: ${themeId}`);
    return;
  }
  
  const root = document.documentElement;
  
  // Check if static colors mode is enabled
  const isStatic = root.classList.contains('static-colors');
  
  // CRITICAL: Set ONLY the base HSL values - CSS HCS calculates everything else!
  root.style.setProperty('--hue-primary', theme.hue);
  root.style.setProperty('--saturation-primary', theme.sat);
  root.style.setProperty('--lightness-primary', theme.light);
  
  // NOTE: All derived colors (--primary, --secondary, --accent, --plus30, --minus30, etc.)
  // are auto-calculated by the HCS system in _variables.css when --hue-primary changes
  
  // IMPORTANT: If static mode is enabled, DON'T override --background, --foreground, --border
  // The CSS .static-colors class handles this
  if (!isStatic) {
    logEvent('🌈', `Applied theme: ${themeId} (dynamic HCS mode)`, theme);
  } else {
    logEvent('🔒', `Applied theme: ${themeId} (static mode - bg/fg/border unchanged)`, theme);
  }
  
  setTimeout(() => updateBodyBackground(), 100);
}

// Load and render markdown documentation
async function loadDocumentation() {
  try {
    const response = await fetch('docs/wave-based-color-harmony-article.md');
    const markdown = await response.text();
    const html = marked.parse(markdown);
    const el = document.getElementById('markdown-content');
    if (el) {
      el.innerHTML = html;
      logEvent('📚', 'Documentation loaded successfully');
    }
  } catch (error) {
    const el = document.getElementById('markdown-content');
    if (el) {
      el.innerHTML = `<div style="padding: 2rem; text-align: center; color: var(--text-secondary);"><h2>❌ Failed to load documentation</h2><p>Error: ${error.message}</p></div>`;
    }
    logEvent('❌', 'Failed to load documentation', { error: error.message });
  }
}

// Initialize sidebar nav buttons
function initNavButtons() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  // Listen on document since wb-nav dispatches on document
  document.addEventListener('wbNavItemClick', (e) => {
    // Only handle events from our nav component
    if (e.detail.nav !== nav) return;
    
    const item = e.detail.item;
    const link = e.detail.link;
    const id = e.detail.id; // Use the id from event detail, not item.id

    // Handle different button types
    if (item.dataset && item.dataset.mode) {
      const mode = item.dataset.mode;
      document.body.setAttribute('data-mode', mode);
      document.body.setAttribute('data-theme', mode);
      document.documentElement.setAttribute('data-mode', mode);
      document.documentElement.setAttribute('data-theme', mode);
      nav.setActiveItem(item);
      logEvent('🌓', `Mode switched to: ${mode}`);
    } else if (item.dataset && item.dataset.view) {
      const v = item.dataset.view;
      const demo = document.getElementById('demo-section');
      const docs = document.getElementById('docs-section');
      if (!demo || !docs) return;

      if (v === 'code') {
        demo.style.display = 'block';
        docs.style.display = 'none';
        demo.setAttribute('aria-hidden', 'false');
        docs.setAttribute('aria-hidden', 'true');
        nav.setActiveItem(item);
        logEvent('🔁', 'View switched to: code');
      } else if (v === 'docs') {
        demo.style.display = 'none';
        docs.style.display = 'block';
        demo.setAttribute('aria-hidden', 'true');
        docs.setAttribute('aria-hidden', 'false');
        loadDocumentation();
        nav.setActiveItem(item);
        logEvent('🔁', 'View switched to: docs');
      }
    } else if (id === 'audio-modulation-toggle') {
      const audioControls = document.getElementById('audio-controls');
      if (audioControls) {
        const isVisible = audioControls.style.display !== 'none';
        audioControls.style.display = isVisible ? 'none' : 'block';
        link.textContent = isVisible ? '🎸 Enable Audio' : '🔇 Disable Audio';
        if (isVisible && audioEnabled) {
          stopTabAudio();
        }
      }
    } else if (item.dataset && item.dataset.theme) {
      const t = item.dataset.theme;
      applyTheme(t);
      nav.setActiveItem(item);
      logEvent('🎨', `Theme button: ${t}`);
    }
  });
}

// Initialize on DOM ready
function init() {
  // Apply default theme
  applyTheme('default');
  
  // Initialize nav buttons
  initNavButtons();
  
  // Initialize static colors toggle
  initStaticColorsToggle();
  
  // Show computed HSL values on swatches
  displayComputedColors();
  
  // Set default view
  const demo = document.getElementById('demo-section');
  const docs = document.getElementById('docs-section');
  if (demo && docs) {
    demo.style.display = 'block';
    docs.style.display = 'none';
    demo.setAttribute('aria-hidden', 'false');
    docs.setAttribute('aria-hidden', 'true');
  }

  // Set initial active mode/theme buttons based on document attributes
  function setInitialActiveStates() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;

    const root = document.documentElement;
    const initialMode = (root.getAttribute('data-mode') || document.body.getAttribute('data-mode') || '').trim();
    if (initialMode) {
      const item = nav.querySelector(`[data-mode="${initialMode}"]`);
      if (item) {
        nav.setActiveItem(item);
      }
      // Ensure body/document reflect it
      document.body.setAttribute('data-mode', initialMode);
      document.documentElement.setAttribute('data-mode', initialMode);
    }

    const initialTheme = (root.getAttribute('data-theme') || document.body.getAttribute('data-theme') || '').trim();
    if (initialTheme) {
      const item = nav.querySelector(`[data-theme="${initialTheme}"]`);
      if (item) {
        nav.setActiveItem(item);
      }
      // Apply theme so UI matches immediately
      applyTheme(initialTheme);
    }

    // Set initial view to code
    const viewItem = nav.querySelector('[data-view="code"]');
    if (viewItem) {
      nav.setActiveItem(viewItem);
    }
  }

  setInitialActiveStates();
  
  // Wire gain slider inputs (if present)
  const inputGainEl = document.getElementById('input-gain');
  const bassGainEl = document.getElementById('bass-gain');
  const midsGainEl = document.getElementById('mids-gain');
  const trebleGainEl = document.getElementById('treble-gain');

  function formatGain(v){ return parseFloat(v).toFixed(2); }

  if (inputGainEl) {
    inputGainEl.addEventListener('input', (e) => {
      inputGain = parseFloat(e.target.value) || 1.0;
      const el = document.getElementById('input-gain-value'); if (el) el.textContent = formatGain(inputGain);
    });
  }

  if (bassGainEl) {
    bassGainEl.addEventListener('input', (e) => {
      bassGain = parseFloat(e.target.value) || 1.0;
      const el = document.getElementById('bass-gain-value'); if (el) el.textContent = formatGain(bassGain);
    });
  }

  if (midsGainEl) {
    midsGainEl.addEventListener('input', (e) => {
      midsGain = parseFloat(e.target.value) || 1.0;
      const el = document.getElementById('mids-gain-value'); if (el) el.textContent = formatGain(midsGain);
    });
  }

  if (trebleGainEl) {
    trebleGainEl.addEventListener('input', (e) => {
      trebleGain = parseFloat(e.target.value) || 1.0;
      const el = document.getElementById('treble-gain-value'); if (el) el.textContent = formatGain(trebleGain);
    });
  }
  
  logEvent('🚀', 'Page loaded', { mode: 'dark', theme: 'default' });
}

// Display computed HSL values on color swatches
function displayComputedColors() {
  const swatches = [
    { id: 'bg-var-name', variable: '--background' },
    { id: 'fg-var-name', variable: '--foreground' },
    { id: 'border-var-name', variable: '--border' }
  ];
  
  swatches.forEach(swatch => {
    const element = document.getElementById(swatch.id);
    if (!element) return;
    
    const computed = getComputedStyle(document.documentElement).getPropertyValue(swatch.variable).trim();
    const currentText = element.textContent;
    
    // Extract mode indicator if present
    const modeMatch = currentText.match(/\[(static|dynamic)\]/);
    const mode = modeMatch ? ` ${modeMatch[0]}` : '';
    
    element.textContent = `${swatch.variable}${mode}`;
    element.title = `Computed: ${computed}`;
    
    // Add HSL display below
    let hslDisplay = element.nextElementSibling;
    if (!hslDisplay || !hslDisplay.classList.contains('hsl-display')) {
      hslDisplay = document.createElement('div');
      hslDisplay.className = 'hsl-display';
      hslDisplay.style.cssText = 'font-size: 0.7rem; color: var(--text-muted); margin-top: 0.25rem; font-family: monospace;';
      element.parentNode.insertBefore(hslDisplay, element.nextSibling);
    }
    hslDisplay.textContent = computed;
  });
}

// Initialize static colors toggle
function initStaticColorsToggle() {
  const toggle = document.getElementById('static-colors-toggle');
  if (!toggle) return;
  
  toggle.addEventListener('change', (e) => {
    const useStatic = e.target.checked;
    const root = document.documentElement;
    const body = document.body;
    
    // Update variable names in UI
    const bgName = document.getElementById('bg-var-name');
    const fgName = document.getElementById('fg-var-name');
    const borderName = document.getElementById('border-var-name');
    
    if (useStatic) {
      // Add static-colors class to trigger CSS override
      root.classList.add('static-colors');
      body.classList.add('static-colors');
      
      // Update displayed variable names
      if (bgName) bgName.textContent = 'var(--fixed-background) [static]';
      if (fgName) fgName.textContent = 'var(--fixed-foreground) [static]';
      if (borderName) borderName.textContent = 'var(--fixed-border) [static]';
      
      logEvent('🔒', 'Static colors enabled - CSS class applied');
    } else {
      // Remove static-colors class to restore dynamic colors
      root.classList.remove('static-colors');
      body.classList.remove('static-colors');
      
      // Restore original variable names
      if (bgName) bgName.textContent = 'var(--background) [dynamic]';
      if (fgName) fgName.textContent = 'var(--foreground) [dynamic]';
      if (borderName) borderName.textContent = 'var(--border) [dynamic]';
      
      logEvent('🌈', 'Dynamic colors enabled - HCS calculations active');
    }
    
    setTimeout(() => {
      updateBodyBackground();
      displayComputedColors(); // Refresh HSL values
    }, 100);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
