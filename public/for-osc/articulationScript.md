# "Scratch paper" for scripts found in template-io-workfile.json 

```js
/////////////// This script is in every articulation button

var ranges = get('artrang_1') // _2, _3, etc
var bypassInput = get('artinpt_1') // _2, _3, etc
if (bypassInput) {
    set('artmodB_1', 0.15) // _2, _3, etc ALPHA FILL ON
    set('artmodA_1', 0.15) // _2, _3, etc ALPHA FILL OFF
    return
}
set('template-io_articulationVarID', 1) // 2, 3, etc
set('template-io_articulationScript', 1)
set('template-io_keyRangeVar2', ranges)
set('template-io_keyRangeScript', 1)

var layers = get('artLayers_1')
var allLayers = get('template-io_artLayersVar1')
console.log(layers)
console.log(allLayers)
/////////////// 'template-io_articulationScript'

var id = get('template-io_articulationVarID')

var modes = []
for (var i = 1; i < 19; i++) {
    var mode = get(`artMode_${i}`)
    modes.push(mode)
}

var thisMode = modes[parseInt(id - 1)]

if (thisMode === 'toggle') {
    set(`artmodB_${id}`, 0.75)
    set(`artmodA_${id}`, 0.15)
}
if (thisMode === 'tap') {
    for (var i = 0; i < modes.length; i++) {
        if (modes[i] === 'toggle') {
            continue
        }
        if (i === id) {
            set(`artmodA_${id}`, 0.75)
            set(`artmodB_${id}`, 0.75)
            continue
        }
        set(`artmodA_${i}`, 0.15)
        set(`artmodB_${i}`, 0.15)
    }
}
```