# "Scratch paper" for scripts found in template-io-workfile.json

```js
var show_codes = get('show_codes')

if (show_codes === 1) {
  hideCodes()
  set('show_codes', 1)
}

if (show_codes === 0) {
  showCodes()
  set('show_codes', 0)
}

function showCodes() {
  for (let i = 0; i < 18; i++) {
    try {
      var art_name = get(`art_name_${i + 1}`)
      if (!art_name || typeof art_name !== 'string' || art_name.trim() === '') {
        console.warn(`art_name_${i + 1} is invalid or empty`)
        continue
      }

      var parsedObj = JSON.parse(art_name)
      if (
        typeof parsedObj !== 'object' ||
        parsedObj === null ||
        Array.isArray(parsedObj)
      ) {
        console.warn(`Invalid JSON structure for art_name_${i + 1}`)
        continue
      }

      set(
        `art_name_display_${i + 1}`,
        `${parsedObj.name}\n${parsedObj.codeDisplay}\n${parsedObj.delay}\nLayers: ${parsedObj.layersCount}`
      )
    } catch (error) {
      console.error(`Error parsing JSON for art_name_${i + 1}:`, error.message)
    }
  }
}

function hideCodes() {
  for (let i = 0; i < 18; i++) {
    try {
      var art_name = get(`art_name_${i + 1}`)
      if (!art_name || typeof art_name !== 'string' || art_name.trim() === '') {
        console.warn(`art_name_${i + 1} is invalid or empty`)
        continue
      }

      var parsedObj = JSON.parse(art_name)
      if (
        typeof parsedObj !== 'object' ||
        parsedObj === null ||
        Array.isArray(parsedObj)
      ) {
        console.warn(`Invalid JSON structure for art_name_${i + 1}`)
        continue
      }

      set(
        `art_name_display_${i + 1}`,
        `${parsedObj.name}\n${parsedObj.layersCount > 0 ? `/${parsedObj.layersCount}` : ''}`
      )
    } catch (error) {
      console.error(`Error parsing JSON for art_name_${i + 1}:`, error.message)
    }
  }
}
```
