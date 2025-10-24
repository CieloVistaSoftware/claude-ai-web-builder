# Data-Driven Card Component Example

This example demonstrates a data-driven card component schema and explains each part of the JSON configuration.

```jsonc
{
  "name": "wb-card", // Component name
  "template": { // Template definition
    "structure": [ // Array of element definitions
      {
        "tag": "div", // Root element is a div
        "attributes": {
          "class": "wb-card"
        }, // Class for the root div
        "children": [ // Children of the root div
          { "tag": "h3", "content": "{{title}}" }, // Card title
          { "tag": "h4", "content": "{{subtitle}}", "if": "subtitle" },
          // Subtitle, if present
          {
            "tag": "img",
            "attributes": {
              "src": "{{image}}",
              "alt": "Card image"
            },
            "if": "image"
          },
          // Image, if present
          { "tag": "p", "content": "{{content}}" }, // Main content
          {
            "tag": "ul",
            "children": [
              {
                "tag": "li",
                "content": "{{tag}}",
                "for": "tags"
              }
            ],
            "if": "tags"
          },
          // List of tags, if present
          {
            "tag": "div",
            "attributes": {
              "class": "actions"
            },
            "children": [
              {
                "tag": "button",
                "content": "{{actionLabel}}",
                "for": "actions",
                "attributes": {
                  "data-action": "{{actionId}}",
                  "class": "btn btn-{{actionVariant}}"
                }
              }
            ],
            "if": "actions"
          }
          // Actions section, if present
        ]
      }
    ]
  },
  "defaults": { // Default data for the card
    "title": "Dynamic Card Title", // Default title
    "subtitle": "Created from data", // Default subtitle
    "content": "This card component is generated entirely from a JSON definition. " +
      "Change the values above to see it update in real-time!", // Default content
    "image": "", // Default image (empty)
    "variant": "elevated", // Default variant
    "tags": [
      "Data-Driven",
      "Dynamic",
      "Component"
    ], // Default tags
    "actions": [ // Default actions
      {
        "actionId": "view",
        "actionLabel": "View Details",
        "actionVariant": "primary"
      }, // View action
      {
        "actionId": "edit",
        "actionLabel": "Edit",
        "actionVariant": "secondary"
      } // Edit action
    ]
  }
}
```

