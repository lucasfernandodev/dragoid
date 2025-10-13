# Download Command

Downloads an entire novel or a specific chapter and saves it in the format chosen by the user.

```bash
dragoid download [options]
```

## Options

| Option | Description | Type | Default |
|-|-|-|-|
| -m, --mode | Download mode: "novel" (entire novel) or "chapter" (single chapter) | string | (required) |
| -u, --url | URL of the novel or chapter to be downloaded | string | (required) |
| -o, --format | Output format: `json`, `epub`, `txt`, etc. | string | (required) |
| -p, --path | Destination folder where the file will be saved | string | - |
| -l, --limit | Limits the total number of chapters to be downloaded | number | - |
| -s, --skip | Starts downloading from the specified chapter number | number | - |
| --list-crawlers | Lists all supported websites and crawlers | boolean | false |
| --list-output-formats | Lists all supported output formats | boolean | false |
| -h, --help | Shows help for this specific command | boolean | - |
