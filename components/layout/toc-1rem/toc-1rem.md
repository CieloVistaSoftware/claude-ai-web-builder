# toc-1rem Web Component

A layout component with a header slot at the top (1rem from the top, left, and right) and all content padded 1rem from the left and right. The header is always at the top, and content follows below.

## Usage
```html
<toc-1rem>
  <div slot="header">Header Title</div>
  <div slot="content">Main content goes here.</div>
</toc-1rem>
<script src="./components/layout/toc-1rem/toc-1rem.js"></script>
```

## Features
- Header slot with 1rem padding (top/left/right)
- Content slot with 1rem left/right/bottom padding
- Shadow DOM encapsulation
- Extends WBBaseComponent
