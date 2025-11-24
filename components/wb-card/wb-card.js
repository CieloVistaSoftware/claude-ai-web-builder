// WB Card Web Component
// Website Builder card component with flexible layouts and variants

import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

// Minimal reactive store for state
function createSignal(initial) {
  let value = initial;
  const listeners = [];
  const get = () => value;
  const set = (v) => {
    value = v;
    listeners.forEach(fn => fn(value));
  };
  const subscribe = (fn) => { listeners.push(fn); };
  return [get, set, subscribe];
}

class WBCard extends HTMLElement {
  constructor() {
    super();
        this.attachShadow({ mode: 'open' });
    // Fallback config for now
    this.config = {
      classes: {
        base: 'wb-card',
        header: 'wb-card-header',
        title: 'wb-card-title',
        subtitle: 'wb-card-subtitle',
        body: 'wb-card-body',
        content: 'wb-card-content',
        media: 'wb-card-media',
        image: 'wb-card-image',
        footer: 'wb-card-footer',
        actions: 'wb-card-actions',
        variants: {
          default: '',
          elevated: 'wb-card--elevated',
          outlined: 'wb-card--outlined',
          filled: 'wb-card--filled',
          glass: 'wb-card--glass'
        },
        sizes: {
          compact: 'wb-card--compact',
          standard: 'wb-card--standard',
          large: 'wb-card--large'
        },
        states: {
          hover: 'wb-card--hover',
          active: 'wb-card--active',
          disabled: 'wb-card--disabled',
          loading: 'wb-card--loading'
        },
        layouts: {
          vertical: 'wb-card--vertical',
          horizontal: 'wb-card--horizontal',
          'media-top': 'wb-card--media-top',
          'media-left': 'wb-card--media-left',
          'media-right': 'wb-card--media-right'
        }
      },
      defaults: {
        variant: 'default',
        size: 'standard',
        layout: 'vertical',
        clickable: false,
        loading: false,
        showHeader: true,
        showFooter: false,
        showActions: false
      },
      events: {
        ready: 'wbCardReady',
        click: 'wbCardClick',
        mediaLoad: 'wbCardMediaLoad',
        actionClick: 'wbCardActionClick'
      }
    };
    // Reactive signals
    [this.getTitle, this.setTitle, this.onTitle] = createSignal(this.getAttribute('title') || '');
    [this.getSubtitle, this.setSubtitle, this.onSubtitle] = createSignal(this.getAttribute('subtitle') || '');
    [this.getBody, this.setBody, this.onBody] = createSignal(this.getAttribute('body') || '');
    [this.getVariant, this.setVariant, this.onVariant] = createSignal(this.getAttribute('variant') || this.config.defaults.variant);
    [this.getSize, this.setSize, this.onSize] = createSignal(this.getAttribute('size') || this.config.defaults.size);
    [this.getLayout, this.setLayout, this.onLayout] = createSignal(this.getAttribute('layout') || this.config.defaults.layout);
    [this.getMediaSrc, this.setMediaSrc, this.onMediaSrc] = createSignal(this.getAttribute('media-src') || '');
    [this.getFooter, this.setFooter, this.onFooter] = createSignal(this.getAttribute('footer') || '');
    [this.getLoading, this.setLoading, this.onLoading] = createSignal(this.hasAttribute('loading'));
    // Subscribe to state changes and re-render
    this.onTitle(() => this.render());
    this.onSubtitle(() => this.render());
    this.onBody(() => this.render());
    this.onVariant(() => this.render());
    this.onSize(() => this.render());
    this.onLayout(() => this.render());
    this.onMediaSrc(() => this.render());
    this.onFooter(() => this.render());
    this.onLoading(() => this.render());
  }

  async connectedCallback() {
    super.connectedCallback(); // Inherit dark mode and other base functionality
    await loadComponentCSS(this, 'wb-card.css');
    this.render();
    this.dispatchEvent(new CustomEvent('wbCardReady', { 
      bubbles: true,
      detail: { component: this, config: this.config }
    }));
  }

  render() {
    // Render the card declaratively based on state
    this.innerHTML = `
      <div class="${this.config.classes.base} ${this.config.classes.variants[this.getVariant()]} ${this.config.classes.sizes[this.getSize()]} ${this.config.classes.layouts[this.getLayout()]} ${this.getLoading() ? this.config.classes.states.loading : ''}">
        ${this.getMediaSrc() ? `<div class='${this.config.classes.media}'><img class='${this.config.classes.image}' src='${this.getMediaSrc()}' alt=''></div>` : ''}
        ${(this.getTitle() || this.getSubtitle()) ? `<div class='${this.config.classes.header}'>${this.getTitle() ? `<h3 class='${this.config.classes.title}'>${this.getTitle()}</h3>` : ''}${this.getSubtitle() ? `<p class='${this.config.classes.subtitle}'>${this.getSubtitle()}</p>` : ''}</div>` : ''}
        <div class='${this.config.classes.body}'>
          <div class='${this.config.classes.content}'>${this.getBody()}</div>
        </div>
        ${this.getFooter() ? `<div class='${this.config.classes.footer}'>${this.getFooter()}</div>` : ''}
      </div>
    `;
  }

  // Attribute reflection for reactivity
  static get observedAttributes() {
    return ['title', 'subtitle', 'body', 'variant', 'size', 'layout', 'media-src', 'footer', 'loading'];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'title':
        this.setTitle(newValue || '');
        break;
      case 'subtitle':
        this.setSubtitle(newValue || '');
        break;
      case 'body':
        this.setBody(newValue || '');
        break;
      case 'variant':
        this.setVariant(newValue || this.config.defaults.variant);
        break;
      case 'size':
        this.setSize(newValue || this.config.defaults.size);
        break;
      case 'layout':
        this.setLayout(newValue || this.config.defaults.layout);
        break;
      case 'media-src':
        this.setMediaSrc(newValue || '');
        break;
      case 'footer':
        this.setFooter(newValue || '');
        break;
      case 'loading':
        this.setLoading(this.hasAttribute('loading'));
        break;
    }
  }
}

// Register the custom element
customElements.define('wb-card', WBCard);

// Register with WBComponentRegistry if available
if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
    window.WBComponentRegistry.register('wb-card', WBCard, ['wb-event-log'], {
        version: '1.0.0',
        type: 'layout',
        role: 'ui-element',
        description: 'Flexible card component with header, body, footer sections and various styling options',
        api: {
            static: ['create'],
            events: ['card-clicked', 'card-expanded', 'card-collapsed'],
            attributes: ['title', 'subtitle', 'image', 'variant', 'size', 'expandable'],
            methods: ['render', 'setTitle', 'setContent', 'expand', 'collapse']
        },
        priority: 4 // UI component depends on infrastructure
    });
}

console.log('🃏 WB Card: Web component registered');