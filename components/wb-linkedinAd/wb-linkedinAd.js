// wb-linkedinAd.js
import './wb-linkedinAd.css';

class WBLinkedinAd extends HTMLElement {
  static get observedAttributes() {
    return ['ad-id', 'company', 'headline', 'cta', 'dark'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const adId = this.getAttribute('ad-id') || '';
    const company = this.getAttribute('company') || 'LinkedIn';
    const headline = this.getAttribute('headline') || 'Grow your business with LinkedIn Ads!';
    const cta = this.getAttribute('cta') || 'Learn More';
    const dark = this.hasAttribute('dark');
    this.shadowRoot.innerHTML = `
      <div class="linkedin-ad${dark ? ' dark' : ''}">
        <div class="ad-header">
          <span class="company">${company}</span>
        </div>
        <div class="ad-body">
          <span class="headline">${headline}</span>
        </div>
        <div class="ad-footer">
          <button class="cta">${cta}</button>
        </div>
        <span class="ad-id">Ad ID: ${adId}</span>
      </div>
    `;
  }
}

customElements.define('wb-linkedinAd', WBLinkedinAd);
