# Icon Files for Root Color Extractor

This directory should contain the following PNG icon files for the Chrome extension:

- `icon16.png` - 16x16 pixels (toolbar icon)
- `icon32.png` - 32x32 pixels (Windows systems)  
- `icon48.png` - 48x48 pixels (extension management page)
- `icon128.png` - 128x128 pixels (Chrome Web Store)

## Creating the Icons

You can convert the provided `icon.svg` file to PNG format using:

1. **Online converters** like cloudconvert.com or convertio.co
2. **Command line tools** like ImageMagick:
   ```bash
   magick icon.svg -resize 16x16 icon16.png
   magick icon.svg -resize 32x32 icon32.png
   magick icon.svg -resize 48x48 icon48.png
   magick icon.svg -resize 128x128 icon128.png
   ```
3. **Design tools** like Figma, Sketch, or GIMP

## Icon Design

The icon features:
- Purple gradient background representing the extension theme
- White CSS code box with ":root" text
- Colorful circles representing extracted color variables
- Download arrow indicating the extraction/download functionality

## Temporary Workaround

For testing purposes, you can temporarily use any PNG files with the correct names and sizes, or copy the icon.svg file to each PNG filename (Chrome will attempt to render it).