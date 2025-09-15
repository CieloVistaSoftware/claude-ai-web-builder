// Extension functions for semantic elements popup

// Add method to create semantic content for main page display
SemanticElementsPopup.prototype.createSemanticContent = function() {
    return `
        <div class="semantic-grid">
            <div class="semantic-element" data-element="header">
                <h3>&lt;header&gt;</h3>
                <p>Represents introductory content or navigational aids</p>
                <div class="example-element">
                    <header style="background: var(--theme-primary); color: white; padding: 1rem; border-radius: 6px;">
                        <h4>Site Header Example</h4>
                        <nav>
                            <a href="#" style="color: white; margin-right: 1rem;">Home</a>
                            <a href="#" style="color: white; margin-right: 1rem;">About</a>
                            <a href="#" style="color: white;">Contact</a>
                        </nav>
                    </header>
                </div>
            </div>

            <div class="semantic-element" data-element="main">
                <h3>&lt;main&gt;</h3>
                <p>Represents the main content of the document</p>
                <div class="example-element">
                    <main style="background: var(--bg-secondary); padding: 1rem; border-radius: 6px; border-left: 4px solid var(--theme-primary);">
                        <h4>Main Content Area</h4>
                        <p>This is the primary content of the page.</p>
                    </main>
                </div>
            </div>

            <div class="semantic-element" data-element="section">
                <h3>&lt;section&gt;</h3>
                <p>Represents a distinct section of content</p>
                <div class="example-element">
                    <section style="background: var(--bg-secondary); padding: 1rem; border-radius: 6px; border-left: 4px solid var(--theme-accent);">
                        <h4>Section Title</h4>
                        <p>Content grouped by theme or purpose.</p>
                    </section>
                </div>
            </div>

            <div class="semantic-element" data-element="article">
                <h3>&lt;article&gt;</h3>
                <p>Represents a self-contained composition</p>
                <div class="example-element">
                    <article style="background: var(--bg-secondary); padding: 1rem; border-radius: 6px; border-left: 4px solid var(--theme-primary);">
                        <h4>Article Title</h4>
                        <p>Independent, self-contained content.</p>
                        <footer style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);">Published on Sept 15, 2025</footer>
                    </article>
                </div>
            </div>

            <div class="semantic-element" data-element="aside">
                <h3>&lt;aside&gt;</h3>
                <p>Represents content aside from the main content</p>
                <div class="example-element">
                    <aside style="background: var(--bg-tertiary); padding: 1rem; border-radius: 6px; border-left: 4px solid var(--theme-accent);">
                        <h4>Sidebar Content</h4>
                        <p>Supplementary information or navigation.</p>
                    </aside>
                </div>
            </div>

            <div class="semantic-element" data-element="nav">
                <h3>&lt;nav&gt;</h3>
                <p>Represents navigation links</p>
                <div class="example-element">
                    <nav style="background: var(--bg-secondary); padding: 1rem; border-radius: 6px;">
                        <ul style="list-style: none; padding: 0; margin: 0; display: flex; gap: 1rem;">
                            <li><a href="#" style="color: var(--theme-primary); text-decoration: none;">Home</a></li>
                            <li><a href="#" style="color: var(--theme-primary); text-decoration: none;">Services</a></li>
                            <li><a href="#" style="color: var(--theme-primary); text-decoration: none;">Contact</a></li>
                        </ul>
                    </nav>
                </div>
            </div>

            <div class="semantic-element" data-element="footer">
                <h3>&lt;footer&gt;</h3>
                <p>Represents footer information</p>
                <div class="example-element">
                    <footer style="background: var(--theme-primary); color: white; padding: 1rem; border-radius: 6px; text-align: center;">
                        <p>&copy; 2025 Semantic Elements Demo. All rights reserved.</p>
                    </footer>
                </div>
            </div>

            <div class="semantic-element" data-element="figure">
                <h3>&lt;figure&gt;</h3>
                <p>Represents self-contained content with optional caption</p>
                <div class="example-element">
                    <figure style="background: var(--bg-secondary); padding: 1rem; border-radius: 6px; margin: 0;">
                        <div style="width: 100%; height: 100px; background: linear-gradient(45deg, var(--theme-primary), var(--theme-accent)); border-radius: 4px; margin-bottom: 0.5rem;"></div>
                        <figcaption style="color: var(--text-secondary); font-style: italic;">Figure caption describing the content</figcaption>
                    </figure>
                </div>
            </div>
        </div>
    `;
};

// Add theme update functionality
SemanticElementsPopup.prototype.updateTheme = function(primaryColor, accentColor) {
    // Update main content showcase
    const showcase = document.getElementById('semanticElementsShowcase');
    if (showcase) {
        // Update CSS custom properties for the showcase
        showcase.style.setProperty('--theme-primary', primaryColor);
        showcase.style.setProperty('--theme-accent', accentColor);
        
        // Update all themed elements in the showcase
        const themedElements = showcase.querySelectorAll('[style*="var(--theme"]');
        themedElements.forEach(element => {
            element.style.cssText = element.style.cssText; // Force re-render
        });
    }

    // Update popup if it exists
    if (this.popup) {
        this.popup.style.setProperty('--theme-primary', primaryColor);
        this.popup.style.setProperty('--theme-accent', accentColor);

        const header = this.popup.querySelector('.popup-header');
        if (header) {
            header.style.background = `linear-gradient(135deg, ${primaryColor}, ${accentColor})`;
        }

        const elements = this.popup.querySelectorAll('.semantic-element');
        elements.forEach((element, index) => {
            const variation = this.adjustColorBrightness(primaryColor, (index % 5) * 0.1 - 0.2);
            element.style.borderLeftColor = variation;
        });
    }
};

// Utility method to adjust color brightness
SemanticElementsPopup.prototype.adjustColorBrightness = function(hex, factor) {
    hex = hex.replace('#', '');
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    const newR = Math.max(0, Math.min(255, Math.round(r + (255 * factor))));
    const newG = Math.max(0, Math.min(255, Math.round(g + (255 * factor))));
    const newB = Math.max(0, Math.min(255, Math.round(b + (255 * factor))));
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
};

// Global function to show popup with singleton pattern
function showSemanticPopup() {
    if (!window.semanticPopup) {
        window.semanticPopup = new SemanticElementsPopup();
    }
    window.semanticPopup.show();
}