// Fallback Material Color Utilities implementation
// This provides basic functionality when CDN fails

window.MaterialColorUtilities = window.MaterialColorUtilities || {
  // Basic color utilities fallback
  argbFromHex: function(hex) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return (0xff << 24) | (r << 16) | (g << 8) | b;
  },
  
  hexFromArgb: function(argb) {
    const r = (argb >> 16) & 0xff;
    const g = (argb >> 8) & 0xff;
    const b = argb & 0xff;
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  },
  
  // Basic theme generation
  themeFromSourceColor: function(sourceColor) {
    // Simplified theme generation
    return {
      source: sourceColor,
      schemes: {
        light: {
          primary: sourceColor,
          onPrimary: 0xffffffff,
          primaryContainer: sourceColor & 0x00ffffff | 0x33000000,
          onPrimaryContainer: 0xff000000,
          secondary: sourceColor,
          onSecondary: 0xffffffff,
          secondaryContainer: sourceColor & 0x00ffffff | 0x33000000,
          onSecondaryContainer: 0xff000000,
          tertiary: sourceColor,
          onTertiary: 0xffffffff,
          tertiaryContainer: sourceColor & 0x00ffffff | 0x33000000,
          onTertiaryContainer: 0xff000000,
          error: 0xffba1a1a,
          onError: 0xffffffff,
          errorContainer: 0xffffdad6,
          onErrorContainer: 0xff410002,
          background: 0xfffdfcff,
          onBackground: 0xff1c1b1f,
          surface: 0xfffdfcff,
          onSurface: 0xff1c1b1f,
          surfaceVariant: 0xffe7e0ec,
          onSurfaceVariant: 0xff49454f,
          outline: 0xff79747e,
          outlineVariant: 0xffcac4d0,
          shadow: 0xff000000,
          scrim: 0xff000000,
          inverseSurface: 0xff313033,
          inverseOnSurface: 0xfff4eff4,
          inversePrimary: 0xffd0bcff
        },
        dark: {
          primary: sourceColor | 0xff000000,
          onPrimary: 0xff000000,
          primaryContainer: sourceColor & 0x00ffffff | 0x66000000,
          onPrimaryContainer: 0xffffffff,
          secondary: sourceColor | 0xff000000,
          onSecondary: 0xff000000,
          secondaryContainer: sourceColor & 0x00ffffff | 0x66000000,
          onSecondaryContainer: 0xffffffff,
          tertiary: sourceColor | 0xff000000,
          onTertiary: 0xff000000,
          tertiaryContainer: sourceColor & 0x00ffffff | 0x66000000,
          onTertiaryContainer: 0xffffffff,
          error: 0xffffb4ab,
          onError: 0xff690005,
          errorContainer: 0xff93000a,
          onErrorContainer: 0xffffdad6,
          background: 0xff1c1b1f,
          onBackground: 0xffe6e1e5,
          surface: 0xff1c1b1f,
          onSurface: 0xffe6e1e5,
          surfaceVariant: 0xff49454f,
          onSurfaceVariant: 0xffcac4d0,
          outline: 0xff938f99,
          outlineVariant: 0xff49454f,
          shadow: 0xff000000,
          scrim: 0xff000000,
          inverseSurface: 0xffe6e1e5,
          inverseOnSurface: 0xff1c1b1f,
          inversePrimary: sourceColor
        }
      },
      palettes: {
        primary: { a1: {}, a2: {}, a3: {}, neutral: {}, neutralVariant: {} },
        secondary: { a1: {}, a2: {}, a3: {}, neutral: {}, neutralVariant: {} },
        tertiary: { a1: {}, a2: {}, a3: {}, neutral: {}, neutralVariant: {} },
        neutral: { a1: {}, a2: {}, a3: {}, neutral: {}, neutralVariant: {} },
        neutralVariant: { a1: {}, a2: {}, a3: {}, neutral: {}, neutralVariant: {} },
        error: { a1: {}, a2: {}, a3: {}, neutral: {}, neutralVariant: {} }
      }
    };
  }
};

console.log('✅ Local Material Color Utilities fallback loaded');