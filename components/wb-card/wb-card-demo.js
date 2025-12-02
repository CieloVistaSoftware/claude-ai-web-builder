/**
 * WB Card Demo - Copy Button Functionality
 */

document.addEventListener('DOMContentLoaded', function () {
    initializeCopyButtons();
});

/**
 * Initialize copy buttons
 */
function initializeCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            copyCode(this);
        });
    });
}

/**
 * Copy code to clipboard
 * @param {HTMLElement} button - The copy button element
 */
function copyCode(button) {
    const code = button.getAttribute('data-code');
    
    if (!code) {
        console.error('No code to copy');
        return;
    }

    // Use modern clipboard API
    navigator.clipboard.writeText(code)
        .then(() => {
            showCopySuccess(button);
        })
        .catch(err => {
            console.error('Failed to copy:', err);
            showCopyError(button);
        });
}

/**
 * Show success feedback
 * @param {HTMLElement} button - The copy button element
 */
function showCopySuccess(button) {
    const originalText = button.textContent;
    const originalColor = button.style.backgroundColor;

    button.textContent = '✓ Copied!';
    button.style.backgroundColor = '#10b981';
    button.disabled = true;

    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = originalColor;
        button.disabled = false;
    }, 2000);
}

/**
 * Show error feedback
 * @param {HTMLElement} button - The copy button element
 */
function showCopyError(button) {
    const originalText = button.textContent;
    const originalColor = button.style.backgroundColor;

    button.textContent = '❌ Error';
    button.style.backgroundColor = '#ef4444';
    button.disabled = true;

    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = originalColor;
        button.disabled = false;
    }, 2000);
}