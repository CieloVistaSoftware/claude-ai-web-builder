// WB Layout Demo JavaScript

// Tab switching functionality
function initializeTabs() {
    document.getElementById('demo-tab-btn').addEventListener('click', () => showTab('demo'));
    document.getElementById('docs-tab-btn').addEventListener('click', () => showTab('docs'));
}

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-tab-content').classList.add('active');
    document.getElementById(tabName + '-tab-btn').classList.add('active');
}

// Component status checker - no fallback, just report status
function checkWebComponents() {
    const wbLayoutDefined = customElements.get('wb-layout');
    const wbNavDefined = customElements.get('wb-nav');
    
    console.log('Web Components Status:', {
        'wb-layout': wbLayoutDefined ? 'DEFINED' : 'NOT_DEFINED',
        'wb-nav': wbNavDefined ? 'DEFINED' : 'NOT_DEFINED'
    });
    
    const statusElement = document.getElementById('layout-status');
    if (statusElement) {
        if (wbLayoutDefined && wbNavDefined) {
            statusElement.textContent = 'Web Components Loaded ✓';
            statusElement.parentElement.style.background = '#065f46';
            statusElement.parentElement.style.color = '#6ee7b7';
        } else {
            const missing = [];
            if (!wbLayoutDefined) missing.push('wb-layout');
            if (!wbNavDefined) missing.push('wb-nav');
            statusElement.textContent = `Missing: ${missing.join(', ')}`;
            statusElement.parentElement.style.background = '#7f1d1d';
            statusElement.parentElement.style.color = '#fca5a5';
        }
    }
    
    return wbLayoutDefined && wbNavDefined;
}

// Clean layout rendering - web components only
function renderSelectedLayout() {
    const dropdown = document.getElementById('layout-dropdown');
    const layoutType = dropdown ? dropdown.value : 'top-nav';
    const container = document.getElementById('dynamic-layout-container');
    const codeContent = document.getElementById('dynamic-code-content');
    
    if (!container) {
        console.error('Container not found');
        return;
    }
    
    console.log('Rendering layout:', layoutType);
    
    // Layout configurations
    const layouts = {
        'top-nav': {
            html: `<wb-layout id="demo-layout-dynamic" layout="top-nav">
                <wb-nav id="demo-nav-dynamic" 
                        brand-text="🏠 My Website"
                        items='[
                          {"text": "Home", "href": "#home"},
                          {"text": "About", "href": "#about"},
                          {"text": "Contact", "href": "#contact"}
                        ]'>
                </wb-nav>
                <header id="demo-header-dynamic" class="wb-layout-header">
                    <h1 id="demo-heading-dynamic">Welcome to Our Website</h1>
                    <p id="demo-text-dynamic">Your trusted partner for innovative solutions</p>
                </header>
                <main id="demo-main-dynamic" class="wb-main-content">
                    <h2 id="demo-subheading-dynamic">Main Content Area</h2>
                    <p id="demo-content-dynamic">This is the main content area with top navigation. The wb-nav component is configured horizontally at the top.</p>
                </main>
                <footer id="demo-footer-dynamic" class="wb-layout-footer">
                    <p id="demo-footer-text-dynamic">&copy; 2025 My Website. All rights reserved.</p>
                </footer>
            </wb-layout>`,
            code: `&lt;wb-layout layout="top-nav"&gt;
  &lt;wb-nav brand-text="🏠 My Website"
          items='[
            {"text": "Home", "href": "#home"},
            {"text": "About", "href": "#about"},
            {"text": "Contact", "href": "#contact"}
          ]'&gt;
  &lt;/wb-nav&gt;
  
  &lt;header class="wb-layout-header"&gt;
    &lt;h1&gt;Welcome to Our Website&lt;/h1&gt;
    &lt;p&gt;Your trusted partner for innovative solutions&lt;/p&gt;
  &lt;/header&gt;
  
  &lt;main class="wb-main-content"&gt;
    &lt;h2&gt;Main Content Area&lt;/h2&gt;
    &lt;p&gt;This is the main content area with top navigation...&lt;/p&gt;
  &lt;/main&gt;
  
  &lt;footer class="wb-layout-footer"&gt;
    &lt;p&gt;&amp;copy; 2025 My Website. All rights reserved.&lt;/p&gt;
  &lt;/footer&gt;
&lt;/wb-layout&gt;`
        },
        'left-nav': {
            html: `<wb-layout id="demo-layout-dynamic" layout="left-nav">
                <wb-nav id="demo-nav-dynamic" 
                        brand-text="🗂️ Menu"
                        items='[
                          {"text": "🏠 Dashboard", "href": "#dashboard"},
                          {"text": "👤 Profile", "href": "#profile"},
                          {"text": "⚙️ Settings", "href": "#settings"},
                          {"text": "📊 Analytics", "href": "#analytics"}
                        ]'>
                </wb-nav>
                <header id="demo-header-dynamic" class="wb-layout-header">
                    <h1 id="demo-heading-dynamic">Dashboard</h1>
                    <p id="demo-text-dynamic">Manage your account and view analytics</p>
                </header>
                <main id="demo-main-dynamic" class="wb-main-content">
                    <h2 id="demo-subheading-dynamic">Dashboard Content</h2>
                    <p id="demo-content-dynamic">This layout shows a wb-nav component configured as a left vertical sidebar with the main content area taking up the remaining space.</p>
                </main>
                <footer id="demo-footer-dynamic" class="wb-layout-footer">
                    <p id="demo-footer-text-dynamic">Dashboard v2.1 | Last updated: Oct 2025</p>
                </footer>
            </wb-layout>`,
            code: `&lt;wb-layout layout="left-nav"&gt;
  &lt;wb-nav brand-text="🗂️ Menu"
          items='[
            {"text": "🏠 Dashboard", "href": "#dashboard"},
            {"text": "👤 Profile", "href": "#profile"},
            {"text": "⚙️ Settings", "href": "#settings"},
            {"text": "📊 Analytics", "href": "#analytics"}
          ]'&gt;
  &lt;/wb-nav&gt;
  
  &lt;header class="wb-layout-header"&gt;
    &lt;h1&gt;Dashboard&lt;/h1&gt;
    &lt;p&gt;Manage your account and view analytics&lt;/p&gt;
  &lt;/header&gt;
  
  &lt;main class="wb-main-content"&gt;
    &lt;h2&gt;Dashboard Content&lt;/h2&gt;
    &lt;p&gt;This layout shows a wb-nav component configured as a left vertical sidebar...&lt;/p&gt;
  &lt;/main&gt;
  
  &lt;footer class="wb-layout-footer"&gt;
    &lt;p&gt;Dashboard v2.1 | Last updated: Oct 2025&lt;/p&gt;
  &lt;/footer&gt;
&lt;/wb-layout&gt;`
        },
        'right-nav': {
            html: `<wb-layout id="demo-layout-dynamic" layout="right-nav">
                <header id="demo-header-dynamic" class="wb-layout-header">
                    <h1 id="demo-heading-dynamic">Article Title</h1>
                    <p id="demo-text-dynamic">Published on October 4, 2025 by Author Name</p>
                </header>
                <main id="demo-main-dynamic" class="wb-main-content">
                    <h2 id="demo-subheading-dynamic">Article Content</h2>
                    <p id="demo-content-dynamic">This layout is great for articles with a wb-nav component configured as a right sidebar for additional content, ads, or related links.</p>
                </main>
                <footer id="demo-footer-dynamic" class="wb-layout-footer">
                    <p id="demo-footer-text-dynamic">Share this article | Subscribe to our newsletter</p>
                </footer>
                <wb-nav id="demo-nav-dynamic" 
                        brand-text="📌 Related"
                        items='[
                          {"text": "📖 Similar Articles", "href": "#articles"},
                          {"text": "🏷️ Tags", "href": "#tags"},
                          {"text": "💬 Comments", "href": "#comments"}
                        ]'>
                    <div id="demo-extra-dynamic" slot="extra" class="wb-extra-content">Advertisement Space</div>
                </wb-nav>
            </wb-layout>`,
            code: `&lt;wb-layout layout="right-nav"&gt;
  &lt;header class="wb-layout-header"&gt;
    &lt;h1&gt;Article Title&lt;/h1&gt;
    &lt;p&gt;Published on October 4, 2025 by Author Name&lt;/p&gt;
  &lt;/header&gt;
  
  &lt;main class="wb-main-content"&gt;
    &lt;h2&gt;Article Content&lt;/h2&gt;
    &lt;p&gt;This layout is great for articles with a wb-nav component...&lt;/p&gt;
  &lt;/main&gt;
  
  &lt;footer class="wb-layout-footer"&gt;
    &lt;p&gt;Share this article | Subscribe to our newsletter&lt;/p&gt;
  &lt;/footer&gt;
  
  &lt;wb-nav brand-text="📌 Related"
          items='[
            {"text": "📖 Similar Articles", "href": "#articles"},
            {"text": "🏷️ Tags", "href": "#tags"},
            {"text": "💬 Comments", "href": "#comments"}
          ]'&gt;
    &lt;div slot="extra" class="wb-extra-content"&gt;Advertisement Space&lt;/div&gt;
  &lt;/wb-nav&gt;
&lt;/wb-layout&gt;`
        },
        'ad-layout': {
            html: `<wb-layout id="demo-layout-dynamic" layout="ad-layout">
                <wb-nav id="demo-nav-dynamic" 
                        brand-text="🚀 Premium Website"
                        items='[
                          {"text": "Home", "href": "#home"},
                          {"text": "Products", "href": "#products"},
                          {"text": "Services", "href": "#services"}
                        ]'>
                    <div id="demo-cta-dynamic" slot="cta">
                        <button id="demo-button-cta-dynamic" class="wb-cta-button">Get Started</button>
                    </div>
                </wb-nav>
                <header id="demo-header-dynamic" class="wb-layout-header">
                    <h1 id="demo-heading-dynamic">Premium Business Solutions</h1>
                    <p id="demo-text-dynamic">Transform your business with our cutting-edge services</p>
                </header>
                <main id="demo-main-dynamic" class="wb-main-content">
                    <h2 id="demo-subheading-dynamic">Main Content</h2>
                    <p id="demo-content-dynamic">This ad-optimized layout uses wb-nav with enhanced configuration including branding and CTA sections, perfect for monetized websites.</p>
                </main>
                <footer id="demo-footer-dynamic" class="wb-layout-footer">
                    <p id="demo-footer-text-dynamic">Contact us: support@premium.com | Phone: (555) 123-4567</p>
                </footer>
                <aside id="demo-aside-dynamic" class="wb-aside-ads">
                    <div id="demo-ads-title-dynamic"><strong>📢 Ads</strong></div>
                    <div id="demo-ad-1-dynamic" class="wb-ad-space">Ad Space 1</div>
                    <div id="demo-ad-2-dynamic" class="wb-ad-space">Ad Space 2</div>
                </aside>
            </wb-layout>`,
            code: `&lt;wb-layout layout="ad-layout"&gt;
  &lt;wb-nav brand-text="🚀 Premium Website"
          items='[
            {"text": "Home", "href": "#home"},
            {"text": "Products", "href": "#products"},
            {"text": "Services", "href": "#services"}
          ]'&gt;
    &lt;div slot="cta"&gt;
      &lt;button class="wb-cta-button"&gt;
        Get Started
      &lt;/button&gt;
    &lt;/div&gt;
  &lt;/wb-nav&gt;
  
  &lt;header class="wb-layout-header"&gt;
    &lt;h1&gt;Premium Business Solutions&lt;/h1&gt;
    &lt;p&gt;Transform your business with our cutting-edge services&lt;/p&gt;
  &lt;/header&gt;
  
  &lt;main class="wb-main-content"&gt;
    &lt;h2&gt;Main Content&lt;/h2&gt;
    &lt;p&gt;This ad-optimized layout uses wb-nav with enhanced configuration...&lt;/p&gt;
  &lt;/main&gt;
  
  &lt;footer class="wb-layout-footer"&gt;
    &lt;p&gt;Contact us: support@premium.com | Phone: (555) 123-4567&lt;/p&gt;
  &lt;/footer&gt;
  
  &lt;aside class="wb-aside-ads"&gt;
    &lt;div&gt;&lt;strong&gt;📢 Ads&lt;/strong&gt;&lt;/div&gt;
    &lt;div class="wb-ad-space"&gt;Ad Space 1&lt;/div&gt;
    &lt;div class="wb-ad-space"&gt;Ad Space 2&lt;/div&gt;
  &lt;/aside&gt;
&lt;/wb-layout&gt;`
        }
    };
    
    // Render layout and code
    const layoutConfig = layouts[layoutType];
    if (layoutConfig) {
        // Clear container first
        container.innerHTML = '';
        
        // Insert HTML and force re-render
        container.innerHTML = layoutConfig.html;
        
        // Force browser to process the new DOM elements
        container.offsetHeight; // Trigger reflow
        
        // Update code display
        if (codeContent) {
            codeContent.innerHTML = layoutConfig.code;
        }
        
        console.log('Layout inserted:', layoutType);
        
        // Log the actual DOM content to debug
        console.log('Container HTML after insert:', container.innerHTML);
        
        // Check if wb-layout elements are actually in the DOM
        const wbLayoutElements = container.querySelectorAll('wb-layout');
        const wbNavElements = container.querySelectorAll('wb-nav');
        console.log('Found wb-layout elements:', wbLayoutElements.length);
        console.log('Found wb-nav elements:', wbNavElements.length);
        
        // Manually trigger component initialization if needed
        if (wbLayoutElements.length > 0) {
            wbLayoutElements.forEach(element => {
                // Force custom element upgrade if not already upgraded
                if (!element.isConnected || !customElements.get('wb-layout')) {
                    console.log('wb-layout element needs manual upgrade');
                }
            });
        }
        
        if (wbNavElements.length > 0) {
            wbNavElements.forEach(element => {
                // Force custom element upgrade if not already upgraded  
                if (!element.isConnected || !customElements.get('wb-nav')) {
                    console.log('wb-nav element needs manual upgrade');
                }
            });
        }
    }
    
    // Update the main layout as well to demonstrate layout switching
    const mainLayout = document.getElementById('main-demo-layout');
    if (mainLayout && mainLayout.setLayout) {
        mainLayout.setLayout(layoutType);
    } else if (mainLayout) {
        // Fallback: set attribute and trigger manual layout update
        mainLayout.setAttribute('layout', layoutType);
        
        // Dispatch layout change event for the main layout
        const layoutChangeEvent = new CustomEvent('wb-layout-change', {
            detail: { layout: layoutType }
        });
        document.dispatchEvent(layoutChangeEvent);
    }
    
    // Update status
    const currentLayout = document.getElementById('current-layout');
    const layoutStatus = document.getElementById('layout-status');
    
    const layoutNames = {
        'top-nav': 'Top Navigation',
        'left-nav': 'Left Navigation',
        'right-nav': 'Right Navigation',
        'ad-layout': 'Advertisement Layout'
    };
    
    if (currentLayout) {
        currentLayout.textContent = layoutNames[layoutType] || layoutType;
    }
    if (layoutStatus) {
        layoutStatus.textContent = 'Layout rendered successfully';
        setTimeout(() => {
            layoutStatus.textContent = 'Ready';
        }, 2000);
    }
    
    // Component status check with delay to allow rendering
    setTimeout(() => {
        checkWebComponents();
        
        // Additional check for actual rendering
        const renderedElements = container.querySelectorAll('wb-layout, wb-nav');
        console.log('Total web components in container:', renderedElements.length);
        
        // Check if components have rendered content
        renderedElements.forEach((element, index) => {
            console.log(`Component ${index}:`, element.tagName, 'has shadowRoot:', !!element.shadowRoot, 'innerHTML length:', element.innerHTML.length);
        });
    }, 100);
}

// Wait for web components to be ready
function waitForComponents() {
    return new Promise((resolve) => {
        const checkComponents = () => {
            const wbLayoutDefined = customElements.get('wb-layout');
            const wbNavDefined = customElements.get('wb-nav');
            
            if (wbLayoutDefined && wbNavDefined) {
                console.log('✓ All web components are ready');
                resolve(true);
            } else {
                console.log('⏳ Waiting for web components...', {
                    'wb-layout': wbLayoutDefined ? 'READY' : 'LOADING',
                    'wb-nav': wbNavDefined ? 'READY' : 'LOADING'
                });
                setTimeout(checkComponents, 100);
            }
        };
        checkComponents();
    });
}

// Handle main navigation
function handleMainNavigation() {
    const mainNav = document.getElementById('main-demo-nav');
    if (mainNav) {
        mainNav.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                
                if (href === '#demo') {
                    showTab('demo');
                } else if (href === '#docs') {
                    showTab('docs');
                }
            }
        });
    }
}

// Initialize demo
document.addEventListener('DOMContentLoaded', async () => {
    console.log('WB Layout Demo initialized');
    
    // Initialize tabs
    initializeTabs();
    
    // Initialize dropdown
    const dropdown = document.getElementById('layout-dropdown');
    if (dropdown) {
        dropdown.addEventListener('change', renderSelectedLayout);
    }
    
    // Wait for web components to be ready
    console.log('Waiting for web components to load...');
    await waitForComponents();
    
    // Handle main navigation
    handleMainNavigation();
    
    // Check web components status
    checkWebComponents();
    
    // Render initial layout
    console.log('Rendering initial layout...');
    renderSelectedLayout();
    
    // Additional status check
    setTimeout(() => {
        checkWebComponents();
        console.log('Final component status check completed');
    }, 500);
});