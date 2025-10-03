# WB Image Insert Component

## Component Status: Legacy - Needs Web Component Conversion

This component is currently implemented as an IIFE utility and needs to be converted to a proper Web Component following the wb- naming convention.

## ✅ FIXED: Multiple Image Support Added

The image-insert component now supports multiple images per element:

**New Features:**
- **Multiple Image Support**: Can add multiple images to any semantic element
- **Image Gallery**: Visual gallery showing all added images with thumbnails
- **Individual Image Controls**: Click any image in gallery to edit its settings
- **Drag & Drop Support**: File input supports selecting multiple images at once
- **Position Options**: Each image can have different positioning (inline, float-left, float-right, center)
- **Individual Removal**: Each image has its own remove button
- **Responsive Design**: Gallery adapts to smaller screens

**How it works:**
1. Purple tag names still appear on semantic elements
2. Double-click opens the edit overlay (now shows "Edit [ELEMENT] Images")
3. **"Add Images" button** allows selecting multiple image files
4. Images appear in a scrollable gallery with thumbnails
5. Click any gallery item to edit that specific image's settings
6. Each image can be positioned and sized independently
7. Remove images individually with the × button on each gallery item

**Technical Implementation:**
- Changed from single `selectedImage` to `selectedImages` array
- Added gallery management functions: `updateImagesGallery()`, `selectImage()`, `removeImageAtIndex()`
- Enhanced `updateElementContent()` to handle multiple images with different positioning
- Updated modal HTML to include image gallery and individual controls
- Added comprehensive CSS styling for the new gallery interface

## Known Issues

*No specific issues documented in issues.md file*

## Migration Plan

1. **Convert to Web Component**: Convert from IIFE to class extending HTMLElement
2. **Rename to wb-image-insert**: Follow wb- naming convention
3. **Add schema.json**: Create VS Code IntelliSense support
4. **Update documentation**: Convert to proper Web Component documentation format
5. **Create demo file**: Add wb-image-insert-demo.html with tabs for docs/examples