// wb-linkedinAd.js
import { WBBaseComponent } from '../wb-base/wb-base.js';

class WBLinkedinAd extends WBBaseComponent {
  static get observedAttributes() {
    return ['ad-id', 'company', 'headline', 'cta', 'dark', 'image', 'logo', 'cta-color', 'subtitle', 'edit'];
  }

  constructor() {
    super();
    // Shadow root is created by WBBaseComponent
  }

  connectedCallback() {
    this.render();
    this.setupEditListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot && oldValue !== newValue) {
      this.render();
      if (name === 'edit') {
        this.setupEditListeners();
      }
    }
  }

  setupEditListeners() {
    if (!this.hasAttribute('edit')) return;
    
    // Wait for render to complete
    setTimeout(() => {
      const controls = this.shadowRoot.querySelector('.edit-controls');
      if (!controls) return;

      // Theme toggle
      controls.querySelector('.theme-toggle')?.addEventListener('click', () => {
        this.toggleAttribute('dark');
      });

      // CTA Color picker
      controls.querySelector('.cta-color-input')?.addEventListener('input', (e) => {
        this.setAttribute('cta-color', e.target.value);
      });

      // Company input
      controls.querySelector('.company-input')?.addEventListener('input', (e) => {
        this.setAttribute('company', e.target.value);
      });

      // Headline input
      controls.querySelector('.headline-input')?.addEventListener('input', (e) => {
        this.setAttribute('headline', e.target.value);
      });

      // Subtitle input
      controls.querySelector('.subtitle-input')?.addEventListener('input', (e) => {
        this.setAttribute('subtitle', e.target.value);
      });

      // CTA text input
      controls.querySelector('.cta-input')?.addEventListener('input', (e) => {
        this.setAttribute('cta', e.target.value);
      });

      // Image URL input
      controls.querySelector('.image-input')?.addEventListener('input', (e) => {
        this.setAttribute('image', e.target.value);
      });

      // Copy code button
      controls.querySelector('.copy-code-btn')?.addEventListener('click', () => {
        const code = this.generateCode();
        navigator.clipboard.writeText(code).then(() => {
          const btn = controls.querySelector('.copy-code-btn');
          const originalText = btn.textContent;
          btn.textContent = '✅ Copied!';
          setTimeout(() => btn.textContent = originalText, 2000);
        });
      });

      // Preset buttons
      controls.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const color = btn.dataset.color;
          this.setAttribute('cta-color', color);
          controls.querySelector('.cta-color-input').value = color;
        });
      });
    }, 0);
  }

  generateCode() {
    const attrs = [];
    if (this.getAttribute('ad-id')) attrs.push(`ad-id="${this.getAttribute('ad-id')}"`);
    if (this.getAttribute('company')) attrs.push(`company="${this.getAttribute('company')}"`);
    if (this.getAttribute('headline')) attrs.push(`headline="${this.getAttribute('headline')}"`);
    if (this.getAttribute('subtitle')) attrs.push(`subtitle="${this.getAttribute('subtitle')}"`);
    if (this.getAttribute('cta')) attrs.push(`cta="${this.getAttribute('cta')}"`);
    if (this.getAttribute('cta-color')) attrs.push(`cta-color="${this.getAttribute('cta-color')}"`);
    if (this.getAttribute('image')) attrs.push(`image="${this.getAttribute('image')}"`);
    if (this.getAttribute('logo')) attrs.push(`logo="${this.getAttribute('logo')}"`);
    if (this.hasAttribute('dark')) attrs.push('dark');
    
    return `<wb-linkedin-ad\n  ${attrs.join('\n  ')}>\n</wb-linkedin-ad>`;
  }

  render() {
    const adId = this.getAttribute('ad-id') || '';
    const company = this.getAttribute('company') || 'LinkedIn';
    const headline = this.getAttribute('headline') || 'Grow your business with LinkedIn Ads!';
    const subtitle = this.getAttribute('subtitle') || '';
    const cta = this.getAttribute('cta') || 'Learn More';
    const ctaColor = this.getAttribute('cta-color') || '#0a66c2';
    const dark = this.hasAttribute('dark');
    const image = this.getAttribute('image') || '';
    const logo = this.getAttribute('logo') || '';
    const editMode = this.hasAttribute('edit');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }
        
        .ad-wrapper {
          position: relative;
        }
        
        .linkedin-ad {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          overflow: hidden;
          max-width: 380px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .linkedin-ad:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }
        
        .linkedin-ad.dark {
          background: #1d2226;
          color: #ffffff;
        }
        
        .ad-image {
          width: 100%;
          height: 180px;
          object-fit: cover;
          display: block;
        }
        
        .ad-content {
          padding: 1rem;
        }
        
        .ad-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }
        
        .company-logo {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          object-fit: cover;
          background: #f3f3f3;
        }
        
        .company-logo-placeholder {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          background: linear-gradient(135deg, #0077b5 0%, #00a0dc 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 1.25rem;
        }
        
        .dark .company-logo-placeholder {
          background: linear-gradient(135deg, #00a0dc 0%, #70c6e8 100%);
        }
        
        .company-info { flex: 1; }
        
        .company-name {
          font-weight: 600;
          font-size: 0.95rem;
          color: #000000;
          margin: 0;
        }
        
        .dark .company-name { color: #ffffff; }
        
        .promoted {
          font-size: 0.75rem;
          color: #666666;
          margin: 0;
        }
        
        .dark .promoted { color: #b0b0b0; }
        
        .headline {
          font-size: 1rem;
          font-weight: 500;
          line-height: 1.4;
          color: #000000;
          margin: 0 0 0.5rem 0;
        }
        
        .dark .headline { color: #ffffff; }
        
        .subtitle {
          font-size: 0.875rem;
          color: #666666;
          margin: 0 0 1rem 0;
          line-height: 1.4;
        }
        
        .dark .subtitle { color: #b0b0b0; }
        
        .cta-button {
          display: inline-block;
          padding: 0.625rem 1.25rem;
          border: none;
          border-radius: 24px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .cta-button:hover {
          filter: brightness(1.1);
          transform: scale(1.02);
        }
        
        .ad-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 0.75rem;
          border-top: 1px solid #e0e0e0;
          margin-top: 0.75rem;
        }
        
        .dark .ad-footer { border-top-color: #38434f; }
        
        .ad-id {
          font-size: 0.7rem;
          color: #999999;
        }
        
        .dark .ad-id { color: #666666; }
        
        .engagement {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;
          color: #666666;
        }
        
        .dark .engagement { color: #b0b0b0; }
        
        .engagement span {
          cursor: pointer;
          transition: color 0.2s;
        }
        
        .engagement span:hover { color: #0a66c2; }

        /* Edit Controls */
        .edit-controls {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 12px;
          padding: 1rem;
          margin-top: 1rem;
          max-width: 380px;
        }
        
        .edit-controls h4 {
          margin: 0 0 1rem 0;
          color: #fff;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .control-group {
          margin-bottom: 0.75rem;
        }
        
        .control-group label {
          display: block;
          font-size: 0.75rem;
          color: #a0a0a0;
          margin-bottom: 0.25rem;
        }
        
        .control-group input[type="text"],
        .control-group input[type="url"] {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #3a3a5a;
          border-radius: 6px;
          background: #2a2a4a;
          color: #fff;
          font-size: 0.85rem;
          box-sizing: border-box;
        }
        
        .control-group input:focus {
          outline: none;
          border-color: #667eea;
        }
        
        .control-row {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .color-picker-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .cta-color-input {
          width: 40px;
          height: 32px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          padding: 0;
        }
        
        .preset-btn {
          width: 28px;
          height: 28px;
          border: 2px solid transparent;
          border-radius: 50%;
          cursor: pointer;
          transition: transform 0.2s, border-color 0.2s;
        }
        
        .preset-btn:hover {
          transform: scale(1.15);
          border-color: #fff;
        }
        
        .theme-toggle {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .theme-toggle.light {
          background: #fff;
          color: #333;
        }
        
        .theme-toggle.dark-btn {
          background: #333;
          color: #fff;
        }
        
        .copy-code-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .copy-code-btn:hover {
          transform: scale(1.02);
          filter: brightness(1.1);
        }
        
        .presets-label {
          font-size: 0.7rem;
          color: #888;
          margin-right: 0.25rem;
        }
      </style>
      
      <div class="ad-wrapper">
        <div class="linkedin-ad${dark ? ' dark' : ''}">
          ${image ? `<img class="ad-image" src="${image}" alt="${headline}" onerror="this.style.display='none'">` : ''}
          
          <div class="ad-content">
            <div class="ad-header">
              ${logo ? 
                `<img class="company-logo" src="${logo}" alt="${company}" onerror="this.outerHTML='<div class=\\'company-logo-placeholder\\'>${company.charAt(0)}</div>'">` : 
                `<div class="company-logo-placeholder">${company.charAt(0)}</div>`}
              <div class="company-info">
                <p class="company-name">${company}</p>
                <p class="promoted">Promoted</p>
              </div>
            </div>
            
            <p class="headline">${headline}</p>
            ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
            
            <button class="cta-button" style="background: ${ctaColor}; color: ${this.getContrastColor(ctaColor)};">
              ${cta}
            </button>
            
            <div class="ad-footer">
              <div class="engagement">
                <span>👍 Like</span>
                <span>💬 Comment</span>
                <span>↗️ Share</span>
              </div>
              <span class="ad-id">${adId}</span>
            </div>
          </div>
        </div>
        
        ${editMode ? `
        <div class="edit-controls">
          <h4>🎨 Ad Editor</h4>
          
          <div class="control-group">
            <label>Company Name</label>
            <input type="text" class="company-input" value="${company}" placeholder="Company name">
          </div>
          
          <div class="control-group">
            <label>Headline</label>
            <input type="text" class="headline-input" value="${headline}" placeholder="Ad headline">
          </div>
          
          <div class="control-group">
            <label>Subtitle</label>
            <input type="text" class="subtitle-input" value="${subtitle}" placeholder="Optional subtitle">
          </div>
          
          <div class="control-group">
            <label>CTA Button Text</label>
            <input type="text" class="cta-input" value="${cta}" placeholder="Button text">
          </div>
          
          <div class="control-group">
            <label>Image URL</label>
            <input type="url" class="image-input" value="${image}" placeholder="https://images.unsplash.com/...">
          </div>
          
          <div class="control-group">
            <label>Button Color & Theme</label>
            <div class="control-row">
              <div class="color-picker-wrap">
                <input type="color" class="cta-color-input" value="${ctaColor}">
              </div>
              <span class="presets-label">Presets:</span>
              <button class="preset-btn" data-color="#0a66c2" style="background: #0a66c2;" title="LinkedIn Blue"></button>
              <button class="preset-btn" data-color="#10a37f" style="background: #10a37f;" title="Green"></button>
              <button class="preset-btn" data-color="#ef4444" style="background: #ef4444;" title="Red"></button>
              <button class="preset-btn" data-color="#f59e0b" style="background: #f59e0b;" title="Orange"></button>
              <button class="preset-btn" data-color="#8b5cf6" style="background: #8b5cf6;" title="Purple"></button>
              <button class="preset-btn" data-color="#ec4899" style="background: #ec4899;" title="Pink"></button>
            </div>
          </div>
          
          <div class="control-row" style="margin-top: 1rem;">
            <button class="theme-toggle ${dark ? 'light' : 'dark-btn'}">${dark ? '☀️ Light' : '🌙 Dark'}</button>
            <button class="copy-code-btn">📋 Copy Code</button>
          </div>
        </div>
        ` : ''}
      </div>
    `;
  }
  
  getContrastColor(hexColor) {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }
}

customElements.define('wb-linkedin-ad', WBLinkedinAd);
