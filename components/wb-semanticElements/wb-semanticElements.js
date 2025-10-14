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
    var tags = [
      "nav", "header", "main", "footer",
      "section", "article", "aside", "figure", "figcaption",
      "details", "summary", "mark", "time", "address"
    ];
    var localContainer = this.querySelector('.wb-semantic-demo-area');
    var target = localContainer || document.body;
    tags.forEach(function(tag) {
      if (!target.querySelector(tag)) {
        var el = document.createElement(tag);
        el.setAttribute("data-wb-semantic", "true");
        var info = '', mdn = '';
        switch(tag) {
          case 'nav':
            info = 'Defines navigation links for the site.';
            mdn = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav';
            break;
          case 'header':
            info = 'Introductory content, typically site or section heading.';
            mdn = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/header';
            break;
          case 'main':
            info = 'Main content unique to this page.';
            mdn = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/main';
            break;
          case 'footer':
            info = 'Footer for its nearest sectioning content or root.';
            mdn = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer';
            break;
          case 'section':
            info = 'A standalone section of related content.';
            mdn = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section';
            break;
          case 'article':
            info = 'A self-contained composition in a document.';
            mdn = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article';
            break;
          case 'aside':
            info = 'Content tangentially related to the main content.';
            mdn = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside';
            break;
          case 'figure':
            info = 'Illustration, diagram, photo, code listing, etc.';
            mdn = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure';
            break;
          case 'figcaption':
            info = 'Caption or legend for a figure.';
            mdn = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figcaption';
            break;
          case 'details':
            info = 'Disclosure widget for additional information.';
            mdn = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details';
            break;
          case 'summary':
            info = 'Summary, heading for a details element.';
            mdn = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/summary';
            break;
          case 'mark':
            info = 'Highlights text for reference or relevance.';
            mdn = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/mark';
            break;
          case 'time':
            info = 'Represents a specific period in time.';
            mdn = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time';
            break;
          case 'address':
            info = 'Contact information for a person or organization.';
            mdn = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/address';
            break;
        }
        el.innerHTML = `<span class=\"wb-sem-label\">&lt;${tag}&gt; (auto)</span><br><span class=\"wb-sem-info\">${info} <a href=\"${mdn}\" target=\"_blank\" rel=\"noopener\" class=\"wb-sem-mdn\">[MDN]</a></span>`;
        target.appendChild(el);
      }
    });
  }
}
if (!customElements.get('wb-semantic-elements')) {
  customElements.define('wb-semantic-elements', WBSemanticElements);
}


