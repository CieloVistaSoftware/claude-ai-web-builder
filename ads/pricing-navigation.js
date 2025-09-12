// Add this to your firstAd.js file - Pricing CTA Navigation Handler

// Handle pricing CTA navigation
function setupPricingNavigation() {
    const freePricingCTA = document.querySelector('.pricing-cta.free');
    if (freePricingCTA) {
        freePricingCTA.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'dist/wb/wb.html';
        });
    }
}

// Call this function when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupPricingNavigation();
});

// Alternative: Direct approach - add this anywhere in your DOMContentLoaded event listener
const freePricingCTA = document.querySelector('.pricing-cta.free');
if (freePricingCTA) {
    freePricingCTA.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'dist/wb/wb.html';
    });
}