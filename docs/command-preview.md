# Preview Command

Starts a local server with a web reader to preview downloaded novel files.

```bash
dragoid preview --file=<novel-file>
```

## Options

| Option | Description | Type | Default |
|-|-|-|-|
| -f, --file | Path to the novel JSON file | string | (required) |
| -p, --public | Makes the server accessible to other devices on the same network | boolean | false |
| -h, --help | Shows help for this specific command | boolean | - |
| --port | Port to bind the server | number | 3010 |

## What features does the reader offer?

In addition to offline navigation directly from the JSON file, the reader offers:
- Word substitution:
  Allows you to define lists of terms to be automatically replaced before or after Google Translate translations in Chrome.

- Layout customization:
  Adjust theme, font family, font size, line spacing, and paragraph spacing for an optimal reading experience.

- Keyboard navigation:
  Move forward and backward through chapters using only keyboard shortcuts, without clicking.

## Shortcuts
- Floating menu (mobile):
  Tap the screen 3 times quickly to open the options menu.

