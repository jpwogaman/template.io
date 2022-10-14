var ranges = get('template-io_keyRangeVar1')

var allNotes = get('template-io_allNotes')
var keyRangeColors = get('template-io_keyRangeColors')

for (let j = 0; j < 128; j++) {
    set('myKey-' + j, 0)
    set('template-io_myKey-' + j, 0)
}

var high = ranges[0].high
var low = ranges[0].low

var indexA = allNotes.indexOf(low)
var indexB = allNotes.indexOf(high)

for (let i = 0; i < allNotes.length; i++) {
    if (i >= indexA && i <= indexB) {
        set('myKey-' + i, 1)
        set('keyColor-' + i, keyRangeColors[0])
        set('template-io_myKey-' + i, 1)
        set('template-io_keyColor-' + i, keyRangeColors[0])
    }
}


