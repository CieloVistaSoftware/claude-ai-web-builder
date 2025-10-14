# Build Component Discovery Report

This document contains the output of the component discovery process, now generated in `build/component-discovery/` after running `npm run build:scripts`.

---

## discovery-metadata.json

```
{
  "scanTime": "2025-10-13T19:11:33.390Z",
  "totalComponents": 38,
  "webComponents": 32,
  "legacyComponents": 36,
  "brokenComponents": 2,
  ...
  // (Truncated for brevity. See original for full details.)
}
```

---

## component-registry.json

```
[
  { "name": "change-text", "type": "legacy", ... },
  { "name": "wb-base", "type": "web-component", ... },
  ...
  // (Truncated for brevity. See original for full details.)
]
```

---

## symbol-table.json

```
[
  { "symbol": "class\n        document", "name": "class\n        document", ... },
  { "symbol": "makeEditable", "name": "makeEditable", ... },
  ...
  // (Truncated for brevity. See original for full details.)
]
```

---

**Note:**
- This report is now located in `docs/build-component-discovery.md`.
- The original files in `build/component-discovery/` can be deleted after confirming this document is up to date.
- For full details, refer to the original JSON files or regenerate by running `npm run build:scripts`.
