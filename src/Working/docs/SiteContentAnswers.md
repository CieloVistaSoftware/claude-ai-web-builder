# Website Customization Guide - answers.md

## Overview
This document explains how to use the `site-content.json` file to customize every aspect of your website and how to leverage Claude AI for intelligent content assistance.

## Understanding site-content.json

The `site-content.json` file is the central configuration file that controls all customizable aspects of your website. It uses a structured JSON format that maps to different sections and elements of your site.

### File Structure

```json
{
  "sections": {
    "hero": {
      "title": "Your Amazing Website",
      "subtitle": "Build something beautiful today",
      "button": {
        "text": "Get Started",
        "action": "scroll-to-features"
      }
    },
    "features": {
      "title": "Features",
      "items": [
        {
          "icon": "🚀",
          "title": "Lightning Fast",
          "description": "Built for speed and performance..."
        }
      ]
    }
  },
  "navigation": {
    "items": [
      { "text": "Home", "href": "#home" },
      { "text": "About", "href": "#about" }
    ]
  },
  "footer": {
    "copyright": "© 2024 Your Company. All rights reserved.",
    "links": [
      { "text": "Privacy Policy", "href": "#privacy" }
    ]
  }
}
```

## What You Can Customize

### 1. Hero Section
- **Title**: Main heading displayed prominently
- **Subtitle**: Supporting text below the title
- **Button**: Call-to-action button text and behavior

```json
"hero": {
  "title": "Welcome to My Business",
  "subtitle": "Professional services you can trust",
  "button": {
    "text": "Contact Us",
    "action": "scroll-to-contact"
  }
}
```

### 2. Navigation Menu
- **Menu Items**: Add/remove navigation links
- **Link Text**: Customize what appears in the menu
- **Destinations**: Set where each link goes

```json
"navigation": {
  "items": [
    { "text": "Home", "href": "#home" },
    { "text": "Services", "href": "#services" },
    { "text": "Portfolio", "href": "#portfolio" },
    { "text": "Contact", "href": "#contact" }
  ]
}
```

### 3. Content Sections
Each major section can be customized:

#### Features Section
```json
"features": {
  "title": "Why Choose Us",
  "items": [
    {
      "icon": "⭐",
      "title": "Quality Service",
      "description": "We deliver exceptional results every time"
    },
    {
      "icon": "🤝",
      "title": "Trusted Partner",
      "description": "Your success is our priority"
    }
  ]
}
```

#### About Section
```json
"about": {
  "title": "About Our Company",
  "content": "Tell your story here. Share your mission, values, and what makes you unique.",
  "subsections": [
    {
      "icon": "👥",
      "title": "Our Team",
      "description": "Meet the experts behind our success"
    }
  ]
}
```

#### Services Section
```json
"services": {
  "title": "Our Services",
  "description": "Comprehensive solutions for your needs",
  "items": [
    {
      "icon": "💼",
      "title": "Consulting",
      "description": "Expert advice tailored to your business"
    }
  ]
}
```

#### Portfolio Section
```json
"portfolio": {
  "title": "Our Work",
  "description": "See what we've accomplished for our clients",
  "projects": [
    {
      "icon": "🎨",
      "title": "Project Alpha",
      "description": "Innovative solution that exceeded expectations"
    }
  ]
}
```

#### Contact Section
```json
"contact": {
  "title": "Get In Touch",
  "description": "Ready to start your project? Let's talk!",
  "methods": [
    {
      "icon": "📧",
      "title": "Email Us",
      "details": "hello@yourcompany.com"
    },
    {
      "icon": "📞",
      "title": "Call Us",
      "details": "+1 (555) 123-4567"
    }
  ]
}
```

### 4. Footer Configuration
```json
"footer": {
  "copyright": "© 2024 Your Business Name. All rights reserved.",
  "links": [
    { "text": "Privacy Policy", "href": "#privacy" },
    { "text": "Terms of Service", "href": "#terms" },
    { "text": "Contact", "href": "#contact" }
  ]
}
```

## Using Claude AI for Content Assistance

### Setting Up Claude AI
1. **Environment Variable**: Set the `CLAUDE_API_KEY` environment variable with your Claude API key
2. **Automatic Detection**: The system automatically detects and uses this environment variable
3. **Graceful Fallback**: If no API key is set, Claude features are disabled without breaking the site

### How to Use Claude AI

#### 1. Content Generation
Ask Claude to help generate content for any section:

**Example Questions:**
- "Write a professional hero section for a law firm"
- "Create 4 feature items for a web design agency"
- "Generate contact information for a local restaurant"

#### 2. Content Improvement
Get suggestions for improving existing content:

**Example Questions:**
- "Make this hero title more engaging: [your current title]"
- "Rewrite this service description to be more compelling"
- "Suggest better call-to-action button text"

#### 3. Complete Section Generation
Request entire sections:

**Example Questions:**
- "Create a complete about section for a consulting business"
- "Generate a services section for a photography studio"
- "Write portfolio project descriptions for a marketing agency"

#### 4. Format-Specific Requests
Ask for content in the exact JSON format needed:

**Example Question:**
```
"Generate a features section in JSON format for a fitness gym with 4 features including icons, titles, and descriptions"
```

**Claude Response:**
```json
{
  "features": {
    "title": "Why Train With Us",
    "items": [
      {
        "icon": "💪",
        "title": "Expert Trainers",
        "description": "Certified professionals to guide your fitness journey"
      },
      {
        "icon": "🏋️",
        "title": "Modern Equipment",
        "description": "State-of-the-art machines and free weights"
      },
      {
        "icon": "📊",
        "title": "Progress Tracking",
        "description": "Monitor your improvements with detailed analytics"
      },
      {
        "icon": "🤝",
        "title": "Community Support",
        "description": "Join a motivated community of fitness enthusiasts"
      }
    ]
  }
}
```

### Best Practices for Claude Queries

#### 1. Be Specific About Your Business
- Include your industry/business type
- Mention your target audience
- Specify the tone you want (professional, casual, friendly, etc.)

#### 2. Request Proper Format
- Always ask for JSON format when you need structured data
- Specify the exact structure you need
- Include icon preferences (emoji, text, etc.)

#### 3. Iterative Improvement
- Start with a basic request
- Ask for refinements: "Make it more professional" or "Add more technical details"
- Request alternatives: "Give me 3 different versions of this title"

#### 4. Content-Specific Requests
- **For Heroes**: "Write a compelling hero section for [business type] targeting [audience]"
- **For Features**: "List key benefits of [service/product] with engaging descriptions"
- **For About**: "Write an about section that builds trust for [business type]"
- **For Services**: "Describe [service] in a way that highlights value and expertise"

## Implementation Steps

### 1. Edit site-content.json
1. Open the `site-content.json` file in your editor
2. Modify the sections you want to change
3. Ensure proper JSON syntax (use a JSON validator if needed)
4. Save the file

### 2. Test Your Changes
1. Refresh your website
2. Check that content updates appear correctly
3. Verify all links and buttons work as expected

### 3. Use Claude for Enhancement
1. Identify sections that need improvement
2. Ask Claude for suggestions or complete rewrites
3. Copy the generated JSON into your file
4. Test and refine as needed

## Troubleshooting

### Common Issues
1. **JSON Syntax Errors**: Use a JSON validator to check your file
2. **Missing Sections**: Ensure all required sections are present
3. **Broken Links**: Verify all href values are correct
4. **Claude Not Working**: Check that `CLAUDE_API_KEY` environment variable is set

### Validation Tips
- Use online JSON validators before saving
- Test one section at a time when making large changes
- Keep backups of working configurations
- Preview changes in a test environment when possible

## Advanced Customization

### Custom Icons
You can use:
- Emoji icons (🚀, 💼, 📧)
- Text-based icons (★, →, ✓)
- Unicode symbols
- Custom CSS classes (if you've added custom styles)

### Dynamic Content
The JSON structure supports:
- Conditional sections
- Variable button actions
- Flexible navigation structures
- Responsive content organization

### Integration with Themes
Your content works seamlessly with all built-in themes:
- Default
- Cyberpunk
- Ocean
- Sunset
- Forest

The content structure remains the same while the visual presentation changes based on the selected theme.

## Examples by Industry

### Law Firm Example
```json
{
  "hero": {
    "title": "Experienced Legal Counsel",
    "subtitle": "Protecting your rights with dedicated advocacy",
    "button": {
      "text": "Free Consultation",
      "action": "scroll-to-contact"
    }
  },
  "services": {
    "title": "Practice Areas",
    "items": [
      {
        "icon": "⚖️",
        "title": "Personal Injury",
        "description": "Fighting for maximum compensation"
      },
      {
        "icon": "🏠",
        "title": "Real Estate",
        "description": "Smooth property transactions"
      }
    ]
  }
}
```

### Restaurant Example
```json
{
  "hero": {
    "title": "Authentic Italian Cuisine",
    "subtitle": "Fresh ingredients, traditional recipes, unforgettable flavors",
    "button": {
      "text": "View Menu",
      "action": "scroll-to-services"
    }
  },
  "contact": {
    "title": "Visit Us Today",
    "methods": [
      {
        "icon": "📍",
        "title": "Location",
        "details": "123 Main Street, Downtown"
      },
      {
        "icon": "📞",
        "title": "Reservations",
        "details": "(555) 123-FOOD"
      }
    ]
  }
}
```

This guide provides everything you need to customize your website content and leverage Claude AI for professional, engaging content creation.

## Creating and Navigating to New Sections

### Adding a Completely New Section

While the template includes standard sections (hero, features, about, etc.), you might need to create entirely new section types. Here's how to add custom sections:

#### 1. Define the New Section in site-content.json

Add your new section to the "sections" object with a unique key:

```json
"sections": {
  "hero": { /* existing hero section */ },
  "features": { /* existing features section */ },
  
  "testimonials": {
    "title": "What Our Clients Say",
    "description": "Real feedback from satisfied customers",
    "items": [
      {
        "quote": "This service transformed our business operations!",
        "author": "Jane Smith",
        "company": "Acme Corp",
        "image": "jane-smith.jpg"
      },
      {
        "quote": "Incredible results with minimal effort required.",
        "author": "John Doe",
        "company": "XYZ Industries",
        "image": "john-doe.jpg"
      }
    ]
  }
}
```

#### 2. Create HTML Template for the New Section

Add a corresponding HTML template in your templates folder (e.g., `templates/testimonials.html`):

```html
<section id="testimonials" class="section testimonials-section">
  <div class="container">
    <h2 class="section-title">{{title}}</h2>
    <p class="section-description">{{description}}</p>
    
    <div class="testimonials-grid">
      {{#items}}
        <div class="testimonial-card">
          <div class="quote">"{{quote}}"</div>
          <div class="author-info">
            {{#image}}<img src="images/{{image}}" alt="{{author}}">{{/image}}
            <div class="author-name">{{author}}</div>
            <div class="author-company">{{company}}</div>
          </div>
        </div>
      {{/items}}
    </div>
  </div>
</section>
```

#### 3. Add CSS Styles for the New Section

Create or update your CSS to style the new section:

```css
.testimonials-section {
  background-color: var(--bg-secondary);
  padding: var(--section-padding);
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.testimonial-card {
  background-color: var(--bg-primary);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow);
}

.quote {
  font-style: italic;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  line-height: 1.5;
}

.author-info {
  display: flex;
  align-items: center;
  margin-top: 1rem;
}

.author-info img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
}

.author-name {
  font-weight: bold;
}

.author-company {
  font-size: 0.9rem;
  opacity: 0.8;
}
```

#### 4. Register the Section Type in Section Renderer

Ensure your section renderer (e.g., `section-renderer.js`) recognizes the new section type:

```javascript
function renderSection(sectionType, sectionData) {
  const sectionTemplates = {
    hero: renderHeroSection,
    features: renderFeaturesSection,
    about: renderAboutSection,
    services: renderServicesSection,
    testimonials: renderTestimonialsSection, // Add your new section
    contact: renderContactSection
  };
  
  if (sectionTemplates[sectionType]) {
    return sectionTemplates[sectionType](sectionData);
  }
  
  // Generic renderer for unknown section types
  return renderGenericSection(sectionType, sectionData);
}

function renderTestimonialsSection(data) {
  // Implement your testimonials section rendering logic
  // or use a template loader to load the testimonials.html template
}
```

### Adding Navigation to New Sections

Once you've created a new section, you'll need to add navigation to it:

#### 1. Update the Navigation Items in site-content.json

```json
"navigation": {
  "items": [
    { "text": "Home", "href": "#home" },
    { "text": "Features", "href": "#features" },
    { "text": "Testimonials", "href": "#testimonials" },
    { "text": "Contact", "href": "#contact" }
  ]
}
```

#### 2. Handling Navigation Limitations

As you add more sections, you may encounter space limitations in your navigation menu. Here are strategies to manage growing navigation needs:

##### Option A: Categorize Related Sections with Dropdown Menus

```json
"navigation": {
  "items": [
    { "text": "Home", "href": "#home" },
    { 
      "text": "Services",
      "children": [
        { "text": "Web Design", "href": "#web-design" },
        { "text": "SEO", "href": "#seo" },
        { "text": "Content Writing", "href": "#content" }
      ]
    },
    {
      "text": "About",
      "children": [
        { "text": "Our Team", "href": "#team" },
        { "text": "Testimonials", "href": "#testimonials" },
        { "text": "History", "href": "#history" }
      ]
    },
    { "text": "Contact", "href": "#contact" }
  ]
}
```

##### Option B: Create a "More" Menu for Less Critical Sections

```json
"navigation": {
  "items": [
    { "text": "Home", "href": "#home" },
    { "text": "Services", "href": "#services" },
    { "text": "About", "href": "#about" },
    { 
      "text": "More",
      "children": [
        { "text": "Testimonials", "href": "#testimonials" },
        { "text": "FAQ", "href": "#faq" },
        { "text": "Resources", "href": "#resources" },
        { "text": "Blog", "href": "#blog" }
      ]
    },
    { "text": "Contact", "href": "#contact" }
  ]
}
```

##### Option C: Implement a Content Explorer or Search Feature

For sites with numerous sections, implement a search or content explorer:

1. **Add a Search Button to Navigation**:

```json
"navigation": {
  "items": [
    { "text": "Home", "href": "#home" },
    { "text": "Services", "href": "#services" },
    { "text": "About", "href": "#about" },
    { "text": "Contact", "href": "#contact" },
    { "text": "Search", "action": "open-search", "icon": "🔍" }
  ]
}
```

2. **Create a Search Implementation**:

```javascript
// search.js
function initializeSearch() {
  // Index all sections and content
  const contentIndex = [];
  
  // For each section in site-content.json
  Object.entries(siteContent.sections).forEach(([sectionKey, sectionData]) => {
    contentIndex.push({
      id: sectionKey,
      title: sectionData.title || sectionKey,
      content: JSON.stringify(sectionData), // Index all content
      href: `#${sectionKey}`
    });
    
    // Index subsections if they exist
    if (sectionData.items && Array.isArray(sectionData.items)) {
      sectionData.items.forEach((item, index) => {
        contentIndex.push({
          id: `${sectionKey}-item-${index}`,
          title: item.title || `${sectionKey} item ${index}`,
          content: JSON.stringify(item),
          href: `#${sectionKey}`,
          parentSection: sectionKey
        });
      });
    }
  });
  
  return {
    search: function(query) {
      const results = contentIndex.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.content.toLowerCase().includes(query.toLowerCase())
      );
      return results;
    },
    
    // Navigate to the search result
    navigateTo: function(resultId) {
      const result = contentIndex.find(item => item.id === resultId);
      if (result && result.href) {
        window.location.hash = result.href.replace('#', '');
      }
    }
  };
}

// Initialize search when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.querySelector('[data-action="open-search"]');
  if (searchButton) {
    const search = initializeSearch();
    
    searchButton.addEventListener('click', () => {
      // Open search modal
      const searchModal = document.createElement('div');
      searchModal.className = 'search-modal';
      searchModal.innerHTML = `
        <div class="search-container">
          <input type="text" class="search-input" placeholder="Search content...">
          <div class="search-results"></div>
          <button class="close-search">Close</button>
        </div>
      `;
      
      document.body.appendChild(searchModal);
      
      // Focus search input
      const searchInput = searchModal.querySelector('.search-input');
      searchInput.focus();
      
      // Handle search input
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        if (query.length < 2) return;
        
        const results = search.search(query);
        const resultsContainer = searchModal.querySelector('.search-results');
        
        resultsContainer.innerHTML = results.length > 0 
          ? results.map(r => `<div class="search-result" data-id="${r.id}">${r.title}</div>`).join('')
          : '<div class="no-results">No results found</div>';
          
        // Add click handlers to results
        resultsContainer.querySelectorAll('.search-result').forEach(el => {
          el.addEventListener('click', () => {
            search.navigateTo(el.dataset.id);
            searchModal.remove();
          });
        });
      });
      
      // Close search modal
      searchModal.querySelector('.close-search').addEventListener('click', () => {
        searchModal.remove();
      });
    });
  }
});
```

3. **Add CSS for the Search Feature**:

```css
.search-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-container {
  width: 80%;
  max-width: 600px;
  background-color: var(--bg-primary);
  border-radius: var(--border-radius);
  padding: 2rem;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  border: 2px solid var(--primary);
  border-radius: var(--border-radius);
  margin-bottom: 1rem;
}

.search-results {
  max-height: 400px;
  overflow-y: auto;
}

.search-result {
  padding: 0.75rem;
  cursor: pointer;
  border-bottom: 1px solid var(--border);
}

.search-result:hover {
  background-color: var(--primary-light);
}

.no-results {
  padding: 1rem;
  text-align: center;
  color: var(--text-secondary);
}

.close-search {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
}
```

##### Option D: Create a Site Map Section

Add a dedicated site map section that lists all content:

```json
"sections": {
  "hero": { /* existing hero */ },
  
  "sitemap": {
    "title": "Site Map",
    "description": "Find all content on our website",
    "categories": [
      {
        "title": "Main Sections",
        "links": [
          { "text": "Home", "href": "#home" },
          { "text": "Services", "href": "#services" },
          { "text": "About Us", "href": "#about" }
        ]
      },
      {
        "title": "Products & Services",
        "links": [
          { "text": "Product A", "href": "#product-a" },
          { "text": "Product B", "href": "#product-b" },
          { "text": "Service X", "href": "#service-x" }
        ]
      },
      {
        "title": "Resources",
        "links": [
          { "text": "Blog", "href": "#blog" },
          { "text": "Testimonials", "href": "#testimonials" },
          { "text": "FAQ", "href": "#faq" }
        ]
      }
    ]
  }
}
```

### Implementation Example: Adding a New FAQ Section

Let's walk through a complete example of adding an FAQ section and its navigation:

#### 1. Add to site-content.json

```json
"sections": {
  "hero": { /* existing hero */ },
  "features": { /* existing features */ },
  
  "faq": {
    "title": "Frequently Asked Questions",
    "description": "Find answers to common questions about our services",
    "items": [
      {
        "question": "How long does the process take?",
        "answer": "Our typical project takes 2-4 weeks depending on complexity and requirements. We provide a detailed timeline during our initial consultation."
      },
      {
        "question": "What is your pricing structure?",
        "answer": "We offer transparent pricing based on project scope. Small projects start at $X, while larger implementations range from $Y to $Z. Contact us for a custom quote."
      },
      {
        "question": "Do you offer ongoing support?",
        "answer": "Yes, we provide comprehensive support packages to ensure your solution continues to function optimally. Our support plans include regular updates, troubleshooting, and feature enhancements."
      }
    ]
  }
}
```

#### 2. Add to navigation

Since you may be limited on navigation space, add it to a dropdown:

```json
"navigation": {
  "items": [
    { "text": "Home", "href": "#home" },
    { "text": "Services", "href": "#services" },
    { 
      "text": "Resources",
      "children": [
        { "text": "FAQ", "href": "#faq" },
        { "text": "Blog", "href": "#blog" }
      ]
    },
    { "text": "Contact", "href": "#contact" }
  ]
}
```

#### 3. Create HTML template (templates/faq.html)

```html
<section id="faq" class="section faq-section">
  <div class="container">
    <h2 class="section-title">{{title}}</h2>
    <p class="section-description">{{description}}</p>
    
    <div class="faq-list">
      {{#items}}
        <div class="faq-item">
          <div class="faq-question">
            <h3>{{question}}</h3>
            <div class="faq-toggle">+</div>
          </div>
          <div class="faq-answer">
            <p>{{answer}}</p>
          </div>
        </div>
      {{/items}}
    </div>
  </div>
</section>
```

#### 4. Add CSS for FAQ section

```css
.faq-section {
  background-color: var(--bg-secondary);
  padding: var(--section-padding);
}

.faq-list {
  margin-top: 2rem;
}

.faq-item {
  margin-bottom: 1rem;
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  overflow: hidden;
}

.faq-question {
  padding: 1rem;
  background-color: var(--bg-primary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.faq-question h3 {
  margin: 0;
  font-size: 1.1rem;
}

.faq-toggle {
  font-size: 1.5rem;
  transition: transform 0.3s ease;
}

.faq-item.active .faq-toggle {
  transform: rotate(45deg);
}

.faq-answer {
  padding: 0;
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
  background-color: var(--bg-primary-light);
}

.faq-item.active .faq-answer {
  padding: 1rem;
  max-height: 500px;
}
```

#### 5. Add JavaScript for FAQ functionality

```javascript
// Initialize FAQ functionality
document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      // Toggle current FAQ item
      item.classList.toggle('active');
      
      // Optional: Close other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });
    });
  });
});
```

By following these patterns, you can add any number of custom sections to your website while effectively managing navigation constraints through dropdowns, search functionality, and proper organization.