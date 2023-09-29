# "Scratch paper" for scripts found in template-io-workfile.json 

```js
const allArtRanges = JSON.parse(get('template-io_keyRangeVar1'))
const indArtRanges = JSON.parse(get('template-io_keyRangeVar2'))
var id = get('template-io_articulationVarID')
const allNotes = get('template-io_allNotes')
const keyRangeColors = get('template-io_keyRangeColors')

var modes = []
for (var i = 1; i < 19; i++) {
    var mode = get(`artMode_${i}`)
    modes.push(mode)
}
for (let j = 0; j < 6; j++){
  set('keyRangeName_' + j, '')
}

var thisMode = modes[parseInt(id - 1)]
if (thisMode === 'toggle') return

for (let i = 0; i < allNotes.length; i++) {
    set('myKey-' + i, 0)
    set('template-io_myKey-' + i, 0)
}

let selectedRanges = []
 
indArtRanges.forEach((indRange, i)=> {

  const indSelectedRange = allArtRanges.filter((range) => range.id === indArtRanges[i])[0]
  selectedRanges.push(indSelectedRange)
  const selectedName = !indSelectedRange.name ? '' : indSelectedRange.name
  set('keyRangeName_' + Number(i+1), selectedName)

})

const blackKeys = []
for (let i = -2; i < 9; i++) {
    blackKeys.push('C#' + i, 'D#' + i, 'F#' + i, 'G#' + i, 'A#' + i)
}

Object.keys(selectedRanges).forEach((range, index)=> {
    var high = selectedRanges[range].high
    var low = selectedRanges[range].low
    var whiteKeysOnly = selectedRanges[range].whiteKeysOnly

    var indexA = allNotes.indexOf(low)
    var indexB = allNotes.indexOf(high)
    
    const rangeLeft = getProp('myKey-' + indexA, 'left')
    const rangeRight = getProp('myKey-' + indexB, 'left') + 24
    const rangeWidth = rangeRight - rangeLeft
    
    set('keyRangeLeft_' + Number(index + 1), rangeLeft)
    set('keyRangeWidth_' + Number(index + 1), rangeWidth)
    
    for (let i = 0; i < allNotes.length; i++) {
        if (i >= indexA && i <= indexB) {
            set('myKey-' + i, 1)
            set('keyColor-' + i, keyRangeColors[range])
            set('template-io_myKey-' + i, 1)
            set('template-io_keyColor-' + i, keyRangeColors[range])
        }
    }

    if (whiteKeysOnly) {
        for (let i = 0; i < blackKeys.length; i++) {
            const index = allNotes.indexOf(blackKeys[i])
            set('myKey-' + index, 0)
            set('template-io_myKey-' + index, 0)
        }
    }
})
```