import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';
import { WBBaseComponent } from '../wb-base/wb-base.js';

// wb-semantic-elements.js
// Web component that injects a complete set of semantic HTML5 elements with Lorem Ipsum content
// for demonstration and testing purposes

class WBSemanticElements extends WBBaseComponent {
  constructor() {
    super();
  }

  async connectedCallback() {
    await loadComponentCSS(this, './wb-semantic-elements.css');
    this.injectSemanticElements();
    
    // REPORT WHERE THIS FILE IS BEING LOADED FROM
    const scriptElements = document.querySelectorAll('script[src*="wb-semantic-elements"]');
    if (scriptElements.length > 0) {
      console.log('🏗️ WB Semantic Elements: Component registered');
      console.log('📄 LOADED FROM:', scriptElements[0].src);
    } else {
      console.log('🏗️ WB Semantic Elements: Component registered');
      console.log('📄 LOADED FROM: inline or module import');
    }
  }

  injectSemanticElements() {
    // Create a container for all semantic elements
    const container = document.createElement('div');
    container.className = 'wb-semantic-container';
    container.setAttribute('data-wb-semantic-demo', 'true');
    
    // NAV element
    const nav = document.createElement('nav');
    nav.setAttribute('data-wb-semantic', 'true');
    nav.innerHTML = `
      <h2>Navigation</h2>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    `;
    
    // HEADER element
    const header = document.createElement('header');
    header.setAttribute('data-wb-semantic', 'true');
    header.innerHTML = `
      <h1>Lorem Ipsum Dolor Sit Amet</h1>
      <p>Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    `;
    
    // MAIN element with sections, articles, etc.
    const main = document.createElement('main');
    main.setAttribute('data-wb-semantic', 'true');
    main.innerHTML = `
      <section data-wb-semantic="true">
        <h2>Section: Introduction</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      </section>
      
      <article data-wb-semantic="true">
        <header>
          <h2>Article: Understanding Semantic HTML</h2>
          <p><time datetime="2025-10-20">October 20, 2025</time> by <strong>John Doe</strong></p>
        </header>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit.</p>
        <p>Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur.</p>
      </article>
      
      <section data-wb-semantic="true">
        <h2>Section: Features</h2>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>
        
        <figure data-wb-semantic="true">
          <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="200" fill="#6366f1" rx="8"/>
            <text x="200" y="100" text-anchor="middle" fill="white" font-size="24" font-family="Arial">
              Placeholder Image
            </text>
            <text x="200" y="130" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="16" font-family="Arial">
              400 x 200
            </text>
          </svg>
          <figcaption data-wb-semantic="true">Figure caption: Lorem ipsum dolor sit amet consectetur adipiscing elit.</figcaption>
        </figure>
      </section>
      
      <aside data-wb-semantic="true">
        <h3>Related Information</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante.</p>
        <ul>
          <li>Related Link 1</li>
          <li>Related Link 2</li>
          <li>Related Link 3</li>
        </ul>
      </aside>
      
      <details data-wb-semantic="true">
        <summary data-wb-semantic="true">Click to expand: Lorem Ipsum Details</summary>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
      </details>
    `;
    
    // FOOTER element
    const footer = document.createElement('footer');
    footer.setAttribute('data-wb-semantic', 'true');
    footer.innerHTML = `
      <p>&copy; 2025 Lorem Ipsum. All rights reserved.</p>
      <address data-wb-semantic="true">
        <a href="mailto:info@loremipsum.com">info@loremipsum.com</a><br>
        123 Lorem Street, Ipsum City, LI 12345
      </address>
    `;
    
    // Append all elements to container
    container.appendChild(nav);
    container.appendChild(header);
    container.appendChild(main);
    container.appendChild(footer);
    
    // Append container to shadow root for encapsulation and styling
    this.shadowRoot.appendChild(container);
    
    console.log('✅ Semantic elements injected with Lorem Ipsum content');
  }
}

if (!customElements.get('wb-semantic-elements')) {
  customElements.define('wb-semantic-elements', WBSemanticElements);
}
