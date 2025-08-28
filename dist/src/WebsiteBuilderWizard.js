"use strict";
/**
 * Website Builder Wizard Container
 * Main component that orchestrates the step-by-step website creation process
 *
 * @example
 * ```html
 * <website-builder-wizard></website-builder-wizard>
 * ```
 */
class WebsiteBuilderWizard extends HTMLElement {
    constructor() {
        super();
        Object.defineProperty(this, "currentStep", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "totalSteps", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 5
        });
        Object.defineProperty(this, "websiteData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }
    render() {
        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 1200px;
          margin: 0 auto;
          padding: var(--space-lg);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .wizard-container {
          background: var(--surface, #ffffff);
          border-radius: calc(var(--space-xs, 0.25rem) * 3);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          overflow: hidden;
        }

        .wizard-header {
          background: linear-gradient(135deg, var(--primary, #007bff) 0%, var(--primary-dark, #0056b3) 100%);
          color: var(--primary-contrast, #ffffff);
          padding: var(--space-lg, 1.618rem);
          text-align: center;
        }

        .wizard-title {
          margin: 0;
          font-size: var(--text-xl, 1.125rem);
          font-weight: 600;
        }

        .wizard-subtitle {
          margin: var(--space-sm, 0.5rem) 0 0 0;
          opacity: 0.9;
          font-size: var(--text-standard, 0.875rem);
        }

        .progress-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          margin-top: var(--space-lg, 1.618rem);
          border-radius: 2px;
        }

        .progress-fill {
          height: 100%;
          background: var(--accent, #28a745);
          border-radius: 2px;
          transition: width 0.3s ease;
          width: ${(this.currentStep / this.totalSteps) * 100}%;
        }

        .step-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-md, 1rem) var(--space-lg, 1.618rem);
          border-bottom: 1px solid var(--border, #e5e7eb);
        }

        .step-indicator {
          display: flex;
          gap: var(--space-sm, 0.5rem);
          align-items: center;
        }

        .step-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--neutral-300, #ced4da);
          transition: all 0.2s ease;
        }

        .step-dot.active {
          background: var(--primary, #007bff);
          transform: scale(1.2);
        }

        .step-dot.completed {
          background: var(--accent, #28a745);
        }

        .step-info {
          font-size: var(--text-medium, 0.938rem);
          color: var(--text-secondary, #6c757d);
        }

        .wizard-content {
          padding: var(--space-xl, 2.618rem);
          min-height: 500px;
        }

        .wizard-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-lg, 1.618rem);
          border-top: 1px solid var(--border, #e5e7eb);
          background: var(--neutral-50, #f8f9fa);
        }

        .btn {
          padding: var(--space-md, 1rem) var(--space-lg, 1.618rem);
          border: none;
          border-radius: calc(var(--space-xs, 0.25rem) * 2);
          font-size: var(--text-standard, 0.875rem);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: var(--space-sm, 0.5rem);
        }

        .btn-primary {
          background: var(--primary, #007bff);
          color: var(--primary-contrast, #ffffff);
        }

        .btn-primary:hover {
          background: var(--primary-dark, #0056b3);
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: var(--neutral-200, #dee2e6);
          color: var(--text-primary, #212529);
        }

        .btn-secondary:hover {
          background: var(--neutral-300, #ced4da);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        .step-content {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>

      <div class="wizard-container">
        <div class="wizard-header">
          <h1 class="wizard-title">Website Builder</h1>
          <p class="wizard-subtitle">Create your professional website in minutes</p>
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
        </div>

        <div class="step-navigation">
          <div class="step-indicator">
            ${Array.from({ length: this.totalSteps }, (_, i) => `
              <div class="step-dot ${i + 1 === this.currentStep ? 'active' : ''} ${i + 1 < this.currentStep ? 'completed' : ''}"></div>
            `).join('')}
          </div>
          <div class="step-info">
            Step ${this.currentStep} of ${this.totalSteps}: ${this.getStepTitle()}
          </div>
        </div>

        <div class="wizard-content">
          <div class="step-content">
            ${this.renderCurrentStep()}
          </div>
        </div>

        <div class="wizard-actions">
          <button class="btn btn-secondary" id="prev-btn" ${this.currentStep === 1 ? 'disabled' : ''}>
            ← Previous
          </button>
          <button class="btn btn-primary" id="next-btn">
            ${this.currentStep === this.totalSteps ? 'Create Website' : 'Next →'}
          </button>
        </div>
      </div>
    `;
    }
    getStepTitle() {
        const titles = [
            'Choose Website Type',
            'Select Template',
            'Customize Content',
            'Style & Theme',
            'Preview & Download'
        ];
        return titles[this.currentStep - 1] || '';
    }
    renderCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return this.renderWebsiteTypeStep();
            case 2:
                return this.renderTemplateStep();
            case 3:
                return this.renderContentStep();
            case 4:
                return this.renderStyleStep();
            case 5:
                return this.renderPreviewStep();
            default:
                return '<p>Unknown step</p>';
        }
    }
    renderWebsiteTypeStep() {
        return `
      <div class="step-title">
        <h2>What type of website would you like to create?</h2>
        <p>Choose the option that best describes your website's purpose.</p>
      </div>
      
      <div class="website-type-selector">
        <div class="form-group">
          <label for="website-type">Website Type</label>
          <select id="website-type" class="form-control">
            <option value="" disabled selected>Select a website type...</option>
            <option value="portfolio">Portfolio - Showcase your work and skills</option>
            <option value="business">Business - Professional website for your company</option>
            <option value="blog">Blog - Share your thoughts and expertise</option>
            <option value="landing">Landing Page - Single-page focused website</option>
          </select>
        </div>
        
        <div id="type-description" class="type-description"></div>
      </div>

      <style>
        .step-title {
          text-align: center;
          margin-bottom: var(--space-xl, 2.618rem);
        }
        
        .step-title h2 {
          color: var(--text-primary, #212529);
          margin: 0 0 var(--space-sm, 0.5rem) 0;
        }
        
        .step-title p {
          color: var(--text-secondary, #6c757d);
          margin: 0;
        }

        .website-type-selector {
          max-width: 600px;
          margin: 0 auto;
        }
        
        .form-group {
          margin-bottom: var(--space-lg, 1.618rem);
        }
        
        .form-group label {
          display: block;
          margin-bottom: var(--space-sm, 0.5rem);
          font-weight: 500;
          color: var(--text-primary, #212529);
        }
        
        .form-control {
          width: 100%;
          padding: var(--space-md, 1rem);
          border: 1px solid var(--border, #e5e7eb);
          border-radius: calc(var(--space-xs, 0.25rem) * 2);
          font-size: var(--text-medium, 0.938rem);
          color: var(--text-primary, #212529);
          background-color: var(--background, #ffffff);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        
        .form-control:focus {
          border-color: var(--primary, #007bff);
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
          outline: none;
        }
        
        .type-description {
          padding: var(--space-lg, 1.618rem);
          border-radius: calc(var(--space-xs, 0.25rem) * 2);
          background-color: var(--surface-alt, #f8f9fa);
          border-left: 4px solid var(--primary, #007bff);
          margin-top: var(--space-lg, 1.618rem);
        }
        
        .form-control option {
          padding: var(--space-sm, 0.5rem);
        }
      </style>
    `;
    }
    renderTemplateStep() {
        return `
      <div class="step-title">
        <h2>Choose a template</h2>
        <p>Select a starting point that matches your style preferences.</p>
      </div>
      <div class="templates-grid">
        <div class="template-card" data-template="minimal">
          <div class="template-preview">
            <div class="preview-placeholder">Minimal Template Preview</div>
          </div>
          <h3>Minimal</h3>
          <p>Clean and simple design</p>
        </div>
        <!-- More templates will be added here -->
      </div>
    `;
    }
    renderContentStep() {
        return `
      <div class="step-title">
        <h2>Customize your content</h2>
        <p>Add your text, images, and other content.</p>
      </div>
      <div class="content-editor">
        <p>Content editor will be implemented here</p>
      </div>
    `;
    }
    renderStyleStep() {
        return `
      <div class="step-title">
        <h2>Style your website</h2>
        <p>Choose colors, fonts, and layout options.</p>
      </div>
      <div class="style-options">
        <p>Style customization will be implemented here</p>
      </div>
    `;
    }
    renderPreviewStep() {
        return `
      <div class="step-title">
        <h2>Preview and download</h2>
        <p>Review your website and download the files.</p>
      </div>
      <div class="preview-download">
        <div class="preview-pane">
          <p>Website preview will be shown here</p>
        </div>
        <div class="download-options">
          <button class="btn btn-primary">Download ZIP</button>
        </div>
      </div>
    `;
    }
    setupEventListeners() {
        // Navigation buttons
        this.shadowRoot.getElementById('next-btn')?.addEventListener('click', () => {
            this.nextStep();
        });
        this.shadowRoot.getElementById('prev-btn')?.addEventListener('click', () => {
            this.previousStep();
        }); // Website type selection
        const websiteTypeSelect = this.shadowRoot.getElementById('website-type');
        if (websiteTypeSelect) {
            websiteTypeSelect.addEventListener('change', () => {
                const selectedType = websiteTypeSelect.value;
                this.websiteData.type = selectedType;
                // Update description based on selection
                const descriptionElement = this.shadowRoot.getElementById('type-description');
                if (descriptionElement) {
                    const descriptions = {
                        'portfolio': `
              <h3>Portfolio Website</h3>
              <p>Perfect for designers, photographers, artists, and professionals who want to showcase their work.</p>
              <ul>
                <li>Project galleries with filtering options</li>
                <li>About and skills sections</li>
                <li>Contact forms and social media integration</li>
              </ul>
            `,
                        'business': `
              <h3>Business Website</h3>
              <p>Ideal for companies, services, and local businesses that need a professional online presence.</p>
              <ul>
                <li>Services and product listings</li>
                <li>Team and about sections</li>
                <li>Testimonials and contact information</li>
              </ul>
            `,
                        'blog': `
              <h3>Blog Website</h3>
              <p>Great for writers, content creators, and thought leaders who want to share their expertise.</p>
              <ul>
                <li>Article layouts with categories</li>
                <li>Author profiles</li>
                <li>Comment sections and newsletter sign-ups</li>
              </ul>
            `,
                        'landing': `
              <h3>Landing Page</h3>
              <p>Perfect for product launches, events, or focused campaigns with a single goal.</p>
              <ul>
                <li>Call-to-action focused design</li>
                <li>Feature highlights and benefits</li>
                <li>Sign-up forms and conversion elements</li>
              </ul>
            `
                    };
                    descriptionElement.innerHTML = descriptions[selectedType] || '';
                }
            });
        }
    }
    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.render();
            this.setupEventListeners();
        }
        else {
            // Final step - create website
            this.createWebsite();
        }
    }
    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.render();
            this.setupEventListeners();
        }
    }
    createWebsite() {
        // This will call the MCP generation endpoint
        console.log('Creating website with data:', this.websiteData);
        // Dispatch event for parent to handle
        this.dispatchEvent(new CustomEvent('website-created', {
            detail: this.websiteData,
            bubbles: true
        }));
    }
}
customElements.define('website-builder-wizard', WebsiteBuilderWizard);
//# sourceMappingURL=WebsiteBuilderWizard.js.map