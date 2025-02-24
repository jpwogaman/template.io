# "Scratch paper" for scripts found in template-io-workfile.json 

```js
/////////////// This script is in every articulation button

var ranges = get('art_rang_1') // _2, _3, etc
var bypassInput = get('art_inpt_1') // _2, _3, etc
if (bypassInput) {
    set('art_mod_b_1', 0.15) // _2, _3, etc ALPHA FILL ON
    set('art_mod_a_1', 0.15) // _2, _3, etc ALPHA FILL OFF
    return
}
set('template_io_articulation_var_id', 1) // 2, 3, etc
set('template_io_articulation_script', 1)
set('template_io_key_range_var_2', ranges)
set('template_io_key_range_script', 1)

var layersOn = get('art_layers_on_1') // _2, _3, etc
var layersOff = get('art_layers_off_1') // _2, _3, etc
var layersTogether = get('art_layers_together_1') // _2, _3, etc
var allLayers = get('template_io_art_layers_var_1')

console.log(layersOn)
console.log(layersOff)
console.log(layersTogether)
console.log(allLayers)
/////////////// 'template_io_articulation_script'

var id = get('template_io_articulation_var_id')

var modes = []
for (var i = 1; i < 19; i++) {
    var mode = get(`art_mode_${i}`)
    modes.push(mode)
}

var thisMode = modes[parseInt(id - 1)]

if (thisMode === 'toggle') {
    set(`art_mod_b_${id}`, 0.75)
    set(`art_mod_a_${id}`, 0.15)
}
if (thisMode === 'tap') {
    for (var i = 0; i < modes.length; i++) {
        if (modes[i] === 'toggle') {
            continue
        }
        if (i === id) {
            set(`art_mod_a_${id}`, 0.75)
            set(`art_mod_b_${id}`, 0.75)
            continue
        }
        set(`art_mod_a_${i}`, 0.15)
        set(`art_mod_b_${i}`, 0.15)
    }
}
```