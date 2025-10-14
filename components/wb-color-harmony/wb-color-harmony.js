// Export the palette keys for use in demo and integration
const PALETTE_KEYS = [
  'primary',
  'secondary',
  'accent',
  'highlight',
  'background',
  'foreground',
  'border',
  'plus30',
  'plus45',
  'plus60',
  'plus90',
  'minus30',
  'minus45',
  'minus60',
  'minus90'
];
class WBColorHarmony extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    // State
    this.hue = 240;
    this.saturation = 70;
    this.lightness = 50;
    this.harmonyType = 'complementary';
    this.palette = {};
    this.updatePalette();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="wb-color-harmony.css">
      <div class="controls">
        <div class="slider-block">
          <label for="hue-slider">Hue:</label>
          <input type="range" min="0" max="360" value="${this.hue}" id="hue-slider">
          <span class="value-unit" id="hue-val">${this.hue}°</span>
        </div>
        <div class="slider-block">
          <label for="sat-slider">Saturation:</label>
          <input type="range" min="0" max="100" value="${this.saturation}" id="sat-slider">
          <span class="value-unit" id="sat-val">${this.saturation}%</span>
        </div>
        <div class="slider-block">
          <label for="light-slider">Lightness:</label>
          <input type="range" min="0" max="100" value="${this.lightness}" id="light-slider">
          <span class="value-unit" id="light-val">${this.lightness}%</span>
        </div>
        <div class="slider-block">
          <label for="harmony-type">Palette Key:</label>
          <select id="harmony-type">
            <option value="all-keys" selected>(Show All)</option>
            <option value="primary">primary</option>
            <option value="secondary">secondary</option>
            <option value="accent">accent</option>
            <option value="highlight">highlight</option>
            <option value="background">background</option>
            <option value="foreground">foreground</option>
            <option value="border">border</option>
            <option value="plus30">plus30</option>
            <option value="plus45">plus45</option>
            <option value="plus60">plus60</option>
            <option value="plus90">plus90</option>
            <option value="minus30">minus30</option>
            <option value="minus45">minus45</option>
            <option value="minus60">minus60</option>
            <option value="minus90">minus90</option>
          </select>
        </div>
      </div>
      <div class="harmony-container" id="harmony-container"></div>
    `;
    // Ensure the dropdown is set to 'all-keys' after initial render and update palette
    setTimeout(() => {
      const select = this.shadowRoot.getElementById('harmony-type');
      if (select) select.value = 'all-keys';
      this.updatePalette();
    }, 0);
    this.renderPalette();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const shadow = this.shadowRoot;
    shadow.getElementById('hue-slider').addEventListener('input', e => {
      this.hue = parseInt(e.target.value);
      shadow.getElementById('hue-val').textContent = `${this.hue}°`;
      this.updatePalette();
    });
    shadow.getElementById('sat-slider').addEventListener('input', e => {
      this.saturation = parseInt(e.target.value);
      shadow.getElementById('sat-val').textContent = `${this.saturation}%`;
      this.updatePalette();
    });
    shadow.getElementById('light-slider').addEventListener('input', e => {
      this.lightness = parseInt(e.target.value);
      shadow.getElementById('light-val').textContent = `${this.lightness}%`;
      this.updatePalette();
    });
    shadow.getElementById('harmony-type').addEventListener('change', e => {
      this.harmonyType = e.target.value;
      this.renderPalette();
    });
  }

  updatePalette() {
    const h = this.hue, s = this.saturation, l = this.lightness;
    const select = this.shadowRoot && this.shadowRoot.getElementById('harmony-type');
    const selectedKey = select ? select.value : 'all-keys';
    // Get the previous palette to preserve other colors
    const prevPalette = this._palette || {};
    // Function to compute color for a given key
    const computeColor = (key) => {
      switch (key) {
        case 'primary':
          return { name: 'Primary', hue: h, saturation: s, lightness: l };
        case 'secondary':
          return { name: 'Secondary', hue: (h + 180) % 360, saturation: s, lightness: l };
        case 'accent':
          return { name: 'Accent', hue: (h + 90) % 360, saturation: s, lightness: l };
        case 'highlight':
          return { name: 'Highlight', hue: (h + 45) % 360, saturation: s, lightness: l };
        case 'background':
          return { name: 'Background', hue: (h + 210) % 360, saturation: s, lightness: Math.max(95, l + 40) };
        case 'foreground':
          return { name: 'Foreground', hue: h, saturation: Math.max(0, s - 60), lightness: Math.min(20, l - 30) };
        case 'border':
          return { name: 'Border', hue: (h + 120) % 360, saturation: s, lightness: Math.max(30, l - 20) };
        case 'plus30':
          return { name: 'plus30', hue: (h + 30) % 360, saturation: s, lightness: l };
        case 'plus45':
          return { name: 'plus45', hue: (h + 45) % 360, saturation: s, lightness: l };
        case 'plus60':
          return { name: 'plus60', hue: (h + 60) % 360, saturation: s, lightness: l };
        case 'plus90':
          return { name: 'plus90', hue: (h + 90) % 360, saturation: s, lightness: l };
        case 'minus30':
          return { name: 'minus30', hue: (h - 30 + 360) % 360, saturation: s, lightness: l };
        case 'minus45':
          return { name: 'minus45', hue: (h - 45 + 360) % 360, saturation: s, lightness: l };
        case 'minus60':
          return { name: 'minus60', hue: (h - 60 + 360) % 360, saturation: s, lightness: l };
        case 'minus90':
          return { name: 'minus90', hue: (h - 90 + 360) % 360, saturation: s, lightness: l };
        default:
          return prevPalette[key] || null;
      }
    };
    const keys = [
      'primary','secondary','accent','highlight','background','foreground','border',
      'plus30','plus45','plus60','plus90','minus30','minus45','minus60','minus90'
    ];
    let palette = { ...prevPalette };
    if (selectedKey && selectedKey !== 'all-keys' && keys.includes(selectedKey)) {
      // Only update the selected key, keep others as before
      palette[selectedKey] = computeColor(selectedKey);
    } else {
      // Update all keys
      keys.forEach(key => {
        palette[key] = computeColor(key);
      });
    }
    this.palette = palette;
    this.renderPalette();
    this.dispatchEvent(new CustomEvent('wb:color-harmony-change', {
      detail: { palette },
      bubbles: true
    }));
  }

  renderPalette() {
    const container = this.shadowRoot.querySelector('.harmony-container');
    if (!container) return;
    const select = this.shadowRoot.getElementById('harmony-type');
    const selectedKey = select ? select.value : 'all-keys';
    const keys = [
      'primary','secondary','accent','highlight','background','foreground','border',
      'plus30','plus45','plus60','plus90','minus30','minus45','minus60','minus90'
    ];
    // Swatch rendering
    let swatchHtml = keys.map(key => {
      const color = this.palette[key];
      if (!color) return '';
      const isSelected = selectedKey !== 'all-keys' && key === selectedKey;
      return `<div class="color-swatch${isSelected ? ' selected' : ''}" id="swatch-${key}" style="background: hsl(${color.hue},${color.saturation}%,${color.lightness}%); border: ${isSelected ? '3px solid #222' : '1px solid #aaa'};">
        <span class="color-label">${color.name}</span>
      </div>`;
    }).join('');
    // Palette JSON rendering
    let paletteJson = `<pre class="palette-json" style="margin-top:1em; background:var(--bg-tertiary,#2222); padding:1em; border-radius:0.5em;">${JSON.stringify(this.palette, null, 2)}</pre>`;
    container.innerHTML = swatchHtml + paletteJson;
  }
}

if (!customElements.get('wb-color-harmony')) {
  customElements.define('wb-color-harmony', WBColorHarmony);
}
