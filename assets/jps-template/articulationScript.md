# "Scratch paper" for scripts found in template-io-workfile.json

```js
/////////////// This script is in every articulation button
var id = id
var value = parseInt(id.split('_')[1])
set('articulations_script_1', value)
set('active_art_tap_number', value)
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

if (mode === 'tap' && !layersOn) {
  set('active_art_tap', null)
  set('active_art_tap_info_var', 'No Additional Layers')
  set('active_tap_art_layers_prev_color', '#A9A9A9')
  set('active_tap_art_layers_next_color', '#A9A9A9')
  return
}

if (
  mode === 'tap' &&
  ((layersOn && !active_art_tap) ||
    JSON.parse(active_art_tap).id !== JSON.parse(layersOn).id)
) {
  set('active_art_tap', layersOn)

  var layersOnLayers = JSON.parse(layersOn).layers
  var layersOnName = JSON.parse(layersOn).name
  var defaultLayerId = JSON.parse(layersOn).defaultLayer

  let defaultIndex = 0
  if (defaultLayerId) {
    var defaultLayerFull = layersOnLayers.find(
      (layer) => layer.id === defaultLayerId
    )
    defaultIndex = layersOnLayers.indexOf(defaultLayerFull)
  }

  set('active_layer_index', defaultIndex)
  set(
    'active_art_tap_info_var',
    `Active Art Tap: ${layersOnName}\nActive Layer:  ${layersOnLayers[defaultIndex].name}`
  )

  if (defaultIndex === 0) {
    set('active_tap_art_layers_prev_color', '#A9A9A9')
  } else {
    set('active_tap_art_layers_prev_color', '#70b7ff')
  }
  if (defaultIndex === layersOnLayers.length - 1) {
    set('active_tap_art_layers_next_color', '#A9A9A9')
  } else {
    set('active_tap_art_layers_next_color', '#70b7ff')
  }

  if (layersTogether === 'true') {
    fireLayersOn(defaultIndex, true)
  } else {
    fireLayersOn(defaultIndex, false)
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

function fireLayersOn(index, together) {
  let layer

  if (layersTogether === 'true') {
    for (let i = 0; i < JSON.parse(layersOn).layers.length; i++) {
      layer = JSON.parse(layersOn).layers[i]
      console.log(
        `send('midi:OSC4', ${layer.code_type}, 1, ${layer.code}, ${layer.on})`
      )
    }
  } else {
    layer = JSON.parse(layersOn).layers[index]
    send('midi:OSC4', layer.code_type, 1, layer.code, layer.on)
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

/////////////// 'punch_articulation'
function punchArticulations() {
  var active_art_tap = get('active_art_tap')
  var active_layer_index = parseInt(get('active_layer_index'))

  let active_layer
  if (active_art_tap) {
    var active_layers = JSON.parse(active_art_tap).layers
    active_layer = active_layers[active_layer_index]
  }

  for (let i = 0; i < 19; i++) {
    var art = get(`art_${i}`)
    var code = get(`art_code_${i}`)
    var type = get(`art_type_${i}`)
    var on = get(`art_on___${i}`)
    var off = get(`art_off__${i}`)
    var mode = get(`art_mode_${i}`)
    var mod = get(`art_mod_a_${i}`)

    if (mode === 'toggle' && art === on) {
      send('midi:OSC4', type, 1, code, on)
    } else if (mode === 'toggle' && art === off) {
      send('midi:OSC4', type, 1, code, off)
    } else if (mode === 'tap' && mod === 0.75) {
      send('midi:OSC4', type, 1, code, on)

      if (active_layer) {
        send(
          'midi:OSC4',
          active_layer.code_type,
          1,
          active_layer.code,
          active_layer.on
        )
      }
    }
  }
  send('midi:OSC1', '/control', 2, 14, 127)
}

send('midi:OSC1', '/control', 2, 13, 127)
setTimeout(punchArticulations, 1000)
/////////////// 'punch_faders'
function punchFaders() {
  for (let i = 0; i < 9; i++) {
    var display = get(`cc_${i}_display`)
    var increment = get(`cc_${i}_increment`)

    if (display && display !== 0) {
      send('midi:OSC4', '/control', 1, display, increment)
    }
  }
  send('midi:OSC1', '/control', 2, 14, 127)
}

send('midi:OSC1', '/control', 2, 13, 127)
setTimeout(punchFaders, 1000)
/////////////// 'punch_all'
function punchAll() {
  var active_art_tap = get('active_art_tap')
  var active_layer_index = parseInt(get('active_layer_index'))

  let active_layer
  if (active_art_tap) {
    var active_layers = JSON.parse(active_art_tap).layers
    active_layer = active_layers[active_layer_index]
  }

  for (let i = 0; i < 19; i++) {
    var art = get(`art_${i}`)
    var code = get(`art_code_${i}`)
    var type = get(`art_type_${i}`)
    var on = get(`art_on___${i}`)
    var off = get(`art_off__${i}`)
    var mode = get(`art_mode_${i}`)
    var mod = get(`art_mod_a_${i}`)

    if (mode === 'toggle' && art === on) {
      send('midi:OSC4', type, 1, code, on)
    } else if (mode === 'toggle' && art === off) {
      send('midi:OSC4', type, 1, code, off)
    } else if (mode === 'tap' && mod === 0.75) {
      send('midi:OSC4', type, 1, code, on)

      if (active_layer) {
        send(
          'midi:OSC4',
          active_layer.code_type,
          1,
          active_layer.code,
          active_layer.on
        )
      }
    }
  }
  for (let i = 0; i < 9; i++) {
    var display = get(`cc_${i}_display`)
    var increment = get(`cc_${i}_increment`)

    if (display !== null && display !== 0) {
      send('midi:OSC4', '/control', 1, display, increment)
    }
  }
  send('midi:OSC1', '/control', 2, 14, 127)
}
send('midi:OSC1', '/control', 2, 13, 127)
setTimeout(punchAll, 1000)
```
