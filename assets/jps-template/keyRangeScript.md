# "Scratch paper" for scripts found in template-io-workfile.json 

```js
const allart_Ranges = JSON.parse(get('template_io_key_range_var_1'))
const indart_Ranges = JSON.parse(get('template_io_key_range_var_2'))
var id = get('template_io_articulation_var_id')
const all_notes = get('template_io_all_notes')
const key_range_colors = get('template_io_key_range_colors')

var modes = []
for (var i = 1; i < 19; i++) {
    var mode = get(`art_mode_${i}`)
    modes.push(mode)
}
for (let j = 0; j < 6; j++){
  set('key_range_name_' + j, '')
}

var thisMode = modes[parseInt(id - 1)]
if (thisMode === 'toggle') return

for (let i = 0; i < all_notes.length; i++) {
    set('my_key_' + i, 0)
    set('template_io_my_key_' + i, 0)
}

let selectedRanges = []
if (!indart_Ranges) return
indart_Ranges.forEach((indRange, i)=> {

  const indSelectedRange = allart_Ranges.filter((range) => range.id === indart_Ranges[i])[0]
  selectedRanges.push(indSelectedRange)
  const selectedName = !indSelectedRange.name ? '' : indSelectedRange.name
  set('key_range_name_' + Number(i+1), selectedName)

  if (selectedName === '') {
    set('key_range_name_color_' + Number(i+1), 0)
  } else {
    set('key_range_name_color_' + Number(i+1), 0.6)
  }

})

const blackKeys = []
for (let i = -2; i < 9; i++) {
    blackKeys.push('C#' + i, 'D#' + i, 'F#' + i, 'G#' + i, 'A#' + i)
}

Object.keys(selectedRanges).forEach((range, index)=> {
    var high = selectedRanges[range].high
    var low = selectedRanges[range].low
    var whiteKeysOnly = selectedRanges[range].whiteKeysOnly

    var indexA = all_notes.indexOf(low)
    var indexB = all_notes.indexOf(high)
    
    const rangeLeft = getProp('my_key_' + indexA, 'left')
    const rangeRight = getProp('my_key_' + indexB, 'left') + 24
    const rangeWidth = rangeRight - rangeLeft
    
    set('key_range_left_' + Number(index + 1), rangeLeft)
    set('key_range_width_' + Number(index + 1), rangeWidth)
    
    for (let i = 0; i < all_notes.length; i++) {
        if (i >= indexA && i <= indexB) {
            set('my_key_' + i, 1)
            set('key_color_' + i, key_range_colors[range])
            set('template_io_my_key_' + i, 1)
            set('template_io_key_color_' + i, key_range_colors[range])
        }
    }

    if (whiteKeysOnly) {
        for (let i = 0; i < blackKeys.length; i++) {
            const index = all_notes.indexOf(blackKeys[i])
            set('my_key_' + index, 0)
            set('template_io_my_key_' + index, 0)
        }
    }
})
```