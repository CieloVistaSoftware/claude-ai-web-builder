// wb-semanticElements.js
// Web component that ensures all required semantic HTML5 elements exist on the page
// and creates them if missing. Elements: <nav>, <header>, <main>, <footer>

class WBSemanticElements extends HTMLElement {
  constructor() {
    super();
    this.loadCSS();
  }

  loadCSS() {
    if (!document.querySelector('link[href*="wb-semanticElements.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      // Use current script path to resolve CSS file
      const currentScript = document.currentScript || document.querySelector('script[src*="wb-semanticElements"]');
      const basePath = currentScript ? currentScript.src.replace(/\/[^\/]*$/, '/') : './';
      link.href = basePath + 'wb-semanticElements.css';
      document.head.appendChild(link);
    }
  }

  connectedCallback() {
    this.ensureSemanticElements();
  }

  ensureSemanticElements() {
    const tags = ["nav", "header", "main", "footer"];
    tags.forEach(tag => {
      if (!document.querySelector(tag)) {
        const el = document.createElement(tag);
        el.setAttribute("data-wb-semantic", "true");
        // Insert in DOM in correct order
        if (tag === "nav") {
          document.body.insertBefore(el, document.body.firstChild);
        } else if (tag === "header") {
          const nav = document.querySelector("nav");
          if (nav && nav.nextSibling) {
            document.body.insertBefore(el, nav.nextSibling);
          } else {
            document.body.appendChild(el);
          }
        } else if (tag === "main") {
          const header = document.querySelector("header");
          if (header && header.nextSibling) {
            document.body.insertBefore(el, header.nextSibling);
          } else {
            document.body.appendChild(el);
          }
        } else if (tag === "footer") {
          document.body.appendChild(el);
        }
      }
    });
  }
}

customElements.define('wb-semanticElements', WBSemanticElements);
