// Demo initialization script
document.addEventListener('DOMContentLoaded', () => {
    // Get reference to the component
    const themeGenerator = document.querySelector('theme-generator');
    
    // Apply initial theme after a short delay to ensure component is fully initialized
    setTimeout(() => {
        const initialTheme = themeGenerator.getTheme();
        applyThemeToPage(initialTheme);
    }, 100);
    
    // Function to apply theme to the entire page
    function applyThemeToPage(theme) {
        // Get CSS variables from the theme
        const cssVariables = {};
        
        // Primary & Secondary colors
        cssVariables['--primary-color'] = `hsl(${theme.primaryHue}, ${theme.saturation}%, ${theme.luminosity}%)`;
        cssVariables['--primary-color-light'] = `hsl(${theme.primaryHue}, ${theme.saturation}%, ${parseInt(theme.luminosity) + 20}%)`;
        cssVariables['--primary-color-dark'] = `hsl(${theme.primaryHue}, ${theme.saturation}%, ${parseInt(theme.luminosity) - 20}%)`;
        
        // Calculate secondary hue based on color scheme
        let secondaryHue;
        switch(theme.colorScheme) {
            case 'complementary':
                secondaryHue = (theme.primaryHue + 180) % 360;
                break;
            case 'triadic':
                secondaryHue = (theme.primaryHue + 120) % 360;
                break;
            case 'analogous':
                secondaryHue = (theme.primaryHue + 30) % 360;
                break;
            case 'splitComplementary':
                secondaryHue = (theme.primaryHue + 150) % 360;
                break;
            case 'tetradic':
                secondaryHue = (theme.primaryHue + 90) % 360;
                break;
            default: // monochromatic
                secondaryHue = theme.primaryHue;
        }
        
        cssVariables['--secondary-color'] = `hsl(${secondaryHue}, ${theme.saturation}%, ${theme.luminosity}%)`;
        
        // Light/Dark mode variables
        if (theme.isDark === 'true' || theme.isDark === true) {
            cssVariables['--text-color'] = '#f0f0f0';
            cssVariables['--background-color'] = '#222';
            cssVariables['--card-background'] = '#333';
        } else {
            cssVariables['--text-color'] = '#333';
            cssVariables['--background-color'] = '#fff';
            cssVariables['--card-background'] = '#f8f8f8';
        }
        
        // Apply variables to root
        for (const [key, value] of Object.entries(cssVariables)) {
            document.documentElement.style.setProperty(key, value);
        }
        
        console.log('Theme applied to page:', theme);
    }
    
    // Listen for theme changes
    themeGenerator.addEventListener('theme-changed', (event) => {
        const theme = event.detail;
        console.log('Theme changed event triggered');
        applyThemeToPage(theme);
        
        // Show notification that theme is applied to the whole page
        const notification = document.getElementById('theme-notification');
        if (notification) {
            notification.style.display = 'block';
            setTimeout(() => { 
                notification.style.opacity = '0';
                setTimeout(() => { 
                    notification.style.display = 'none'; 
                    notification.style.opacity = '1'; 
                }, 500);
            }, 3000);
        }
    });
    
    // Listen for theme save events
    themeGenerator.addEventListener('theme-saved', (event) => {
        console.log('Theme saved:', event.detail);
    });
});