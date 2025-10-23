# toc1rempad Web Component

A layout component with a header slot at the top (1rem from the top, left, and right) and all content padded 1rem from the left and right. All text inside both header and content is padded 1rem left/right.

## Usage
```html
<toc1rempad>
  <div slot="header">Header Title</div>
  <div slot="content">Main content goes here.</div>
</toc1rempad>
<script src="./components/layout/toc1rempad/toc1rempad.js"></script>
```

## Features
- Header slot with 1rem padding (top/left/right)
- Content slot with 1rem left/right/bottom padding
- All text inside header/content gets 1rem left/right padding
- Shadow DOM encapsulation
- Extends WBBaseComponent
