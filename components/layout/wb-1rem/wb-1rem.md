# wb-1rem Web Component

A simple container-only web component that applies a 1rem padding to the top, left, and right (north, east, west) sides of its content. No padding is applied to the bottom (south).

## Usage
```html
<wb-1rem>
  <p>Your content here</p>
</wb-1rem>
<script src="./components/layout/wb-1rem/wb-1rem.js"></script>
```

## Features
- 1rem padding on top, left, and right
- No padding on bottom
- Shadow DOM encapsulation
- Container only (no extra logic)
- Extends WBBase for consistency with other components
