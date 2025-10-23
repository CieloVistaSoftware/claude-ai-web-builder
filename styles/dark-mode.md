# Dark Mode in Website Builder

## What is Dark Mode?
Dark mode is a theme option that changes the color scheme of your application to use darker backgrounds and lighter text. It reduces eye strain in low-light environments and provides a modern, visually appealing look.

## How Does It Work?
- The color system uses CSS variables for all colors.
- When dark mode is activated, the `[data-theme="dark"]` selector applies a set of dark color variables (see `main.css`).
- All components and pages using these variables update automatically—no manual changes needed.

## How to See Dark Mode in Action
1. **Switch Theme Programmatically:**
   - Add `data-theme="dark"` to your `<html>` or `<body>` tag:
     ```html
     <html data-theme="dark">
     ```
   - Or use JavaScript:
     ```js
     document.documentElement.setAttribute('data-theme', 'dark');
     ```
2. **Use Control Panel:**
   - If your app includes a theme switcher (e.g., in `wb-control-panel`), use it to toggle between light and dark modes. This will fire a `wb:mode-changed` event and update the theme automatically.
3. **Observe the Change:**
   - Backgrounds, text, borders, and surfaces will switch to dark colors.
   - All components and layouts update instantly, thanks to the reactive CSS variable system.

## Example
```css
[data-theme="dark"] {
  --bg-color: hsl(240, 50%, 8%);
  --text-primary: hsl(240, 5%, 98%);
  /* ...other variables... */
}
```

## Best Practices
- Always use CSS variables for colors in your components and styles.
- Use the theme event system for switching modes.
- Test your UI in both light and dark modes for accessibility and contrast.

## Related Files
- [main.css](main.css)
- [_variables.css](_variables.css)
- [wb-theme-listener.js](../styles/wb-theme-listener.js)

## License
MIT
