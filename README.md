# Auto Labeler Action

This action apply labels to pull request by rules.

## Inputs

### `token`

**Required** Number of pull request. Default `${{ github.token }}`.

### `pull_number`

**Required** Github token. Default `${{ github.event.pull_request.number }}`.

### `rules`

**Required** Path of label rules json file.

## Rules Format

```json
[
  {
    "path": "path/to/dir/**",
    "label_name": "label1"
  },
  {
    "path": "path/to/dir/**",
    "label_name": "label2"
  },
]
```


## Example usage

```yaml
uses: realglobe-Inc/auto-labeler-action@master
with:
  rules: '.github/data/label_rules.json'
```