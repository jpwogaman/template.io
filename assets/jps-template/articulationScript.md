# "Scratch paper" for scripts found in template-io-workfile.json 

```js
/////////////// This script is in every articulation button
var id = id
set('articulations_script_1', parseInt(id.split('_')[1]))
//////////////// articulations_script_1
var val = value

var ranges = get(`art_rang_${val}`)
var bypassInput = get(`art_inpt_${val}`)
if (bypassInput) {
    set(`art_mod_b_${val}`, 0.15) // ALPHA FILL ON
    set(`art_mod_a_${val}`, 0.15) // ALPHA FILL OFF
    return
}
set('template_io_articulation_var_id', parseInt(val))
set('template_io_articulation_script', 1)
set('template_io_key_range_var_2', ranges)
set('template_io_key_range_script', 1)

var artName = get(`art_name_${val}`)
var layersOn = get(`art_layers_on_${val}`)
var layersOff = get(`art_layers_off_${val}`)
var allLayers = get('template_io_art_layers_var_1')
var layersTogether = get(`art_layers_together_${val}`)
var active_art_tap = get('active_art_tap')
var mode = get(`art_mode_${val}`)
var active_layer_index = parseInt(get('active_layer_index'))

if (mode === 'tap' && !layersOn){
  set('active_art_tap', null)
  set('active_art_tap_info_var', `Active Art Tap: ${artName.split('\n')[0]}\nActive Layer:  N/A`)
  return
} 

if (mode === 'tap' && ((layersOn && !active_art_tap) || (JSON.parse(active_art_tap).id !== JSON.parse(layersOn).id))) {
  set('active_art_tap', layersOn)
  set('active_layer_index', 0)
  set('active_art_tap_info_var', `Active Art Tap: ${JSON.parse(layersOn).name}\nActive Layer:  ${JSON.parse(layersOn).layers[0].name}`)
  
  if (layersTogether === 'true') {
    fireLayersOn(0, true)
  } else {
    fireLayersOn(0, false)
  }
  return
}

if (mode === 'tap') {
  if (layersTogether === 'true') {
    fireLayersOn(0, true)
  } else {
    fireLayersOn(active_layer_index, false)
  }
  return
}

function fireLayersOn(index, together){
  let layer
  
  if (layersTogether === 'true'){
    for (let i = 0; i < JSON.parse(layersOn).layers.length; i++){
      layer = JSON.parse(layersOn).layers[i]
      console.log(`send('midi', 'OSC4', ${layer.code_type}, 1, ${layer.code}, ${layer.on})`)
    }
  } else {
    layer = JSON.parse(layersOn).layers[index]
    console.log(`send('midi', 'OSC4', ${layer.code_type}, 1, ${layer.code}, ${layer.on})`)
  }
}
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