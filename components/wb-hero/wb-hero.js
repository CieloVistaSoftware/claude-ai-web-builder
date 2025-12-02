// wb-hero.js
class WBHero extends HTMLElement {
  static get observedAttributes() {
    return ['headline', 'subtitle', 'cta', 'bg', 'color'];
  }
  constructor() {
    super();
    // Shadow DOM removed - Light DOM architecture
    this.render();
  }
  attributeChangedCallback() {
    this.render();
  }
  render() {
    const headline = this.getAttribute('headline') || 'Your Headline Here';
    const subtitle = this.getAttribute('subtitle') || 'Your subtitle goes here.';
    const cta = this.getAttribute('cta') || '';
    const bg = this.getAttribute('bg');
    const color = this.getAttribute('color') || 'default';
    const size = this.getAttribute('size') || 'medium';
    // Set color and size class on host
    this.setAttribute('data-color', color);
    this.setAttribute('data-size', size);
    this.innerHTML = `
      <link rel="stylesheet" href="./wb-hero.css">
      ${bg ? `<img class="wb-hero-bg" src="${bg}" alt="Hero Background">` : ''}
      <div class="wb-hero-content">
        <div class="wb-hero-headline">${headline}</div>
        <div class="wb-hero-subtitle">${subtitle}</div>
        ${cta ? `<button class="wb-hero-cta">${cta}</button>` : ''}
      </div>
    `;
  }
}
customElements.define('wb-hero', WBHero);
