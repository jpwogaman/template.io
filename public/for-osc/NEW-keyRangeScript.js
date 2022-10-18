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
var thisMode = modes[parseInt(id - 1)]
if (thisMode === 'toggle') return

for (let i = 0; i < allNotes.length; i++) {
    set('myKey-' + i, 0)
    set('template-io_myKey-' + i, 0)
}
let selectedRanges = []
let selectedNames = []
for (var i in indArtRanges) {
    selectedRanges.push(allArtRanges.filter((range) => range.id === indArtRanges[i])[0])
    selectedNames.push(allArtRanges.filter((range) => range.id === indArtRanges[i])[0].name)
}
set('selectedTrackKeyRanges', selectedNames)

for (var range in selectedRanges) {
    var high = selectedRanges[range].high
    var low = selectedRanges[range].low

    var indexA = allNotes.indexOf(low)
    var indexB = allNotes.indexOf(high)

    for (let i = 0; i < allNotes.length; i++) {
        if (i >= indexA && i <= indexB) {
            set('myKey-' + i, 1)
            set('keyColor-' + i, keyRangeColors[range])
            set('template-io_myKey-' + i, 1)
            set('template-io_keyColor-' + i, keyRangeColors[range])
        }
    }
}


