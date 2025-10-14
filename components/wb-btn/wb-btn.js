class WBBtn extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host {
          display: inline-block;
          padding: 0.5em 1.2em;
          border-radius: 4px;
          background: var(--btn-bg, #6366f1);
          color: var(--btn-color, #fff);
          font-family: inherit;
          font-size: 1em;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }
        :host(:hover) {
          background: var(--btn-bg-hover, #4f46e5);
        }
        :host([variant="secondary"]) {
          background: var(--btn-bg-secondary, #22223b);
          color: var(--btn-color-secondary, #fff);
        }
        :host([variant="secondary"]:hover) {
          background: var(--btn-bg-secondary-hover, #393960);
        }
        @media (prefers-color-scheme: dark) {
          :host {
            background: var(--btn-bg-dark, #393960);
            color: var(--btn-color-dark, #fff);
          }
          :host(:hover) {
            background: var(--btn-bg-dark-hover, #6366f1);
          }
          :host([variant="secondary"]) {
            background: var(--btn-bg-secondary-dark, #22223b);
            color: var(--btn-color-secondary-dark, #fff);
          }
          :host([variant="secondary"]:hover) {
            background: var(--btn-bg-secondary-dark-hover, #4f46e5);
          }
        }
      </style>
      <slot></slot>
    `;
  }
}
customElements.define('wb-btn', WBBtn);
