// @ts-check
/// <reference path="./custom-module.d.ts" />

/** @type {import("@/../../src/components/backendCommands/backendCommands").FullTrackListForExport} */
const allTrack_jsn = loadJSON('tracks-11.27.2023-v29_new-export-test.json')

const items = allTrack_jsn.items

//array of all notes (Middle C == C3 == MIDI Code 60)
/** @type {string[]} */
const globalAllNotesList = []
for (let i = -2; i < 9; i++) {
  globalAllNotesList.push(
    'C' + i,
    'C#' + i,
    'D' + i,
    'D#' + i,
    'E' + i,
    'F' + i,
    'F#' + i,
    'G' + i,
    'G#' + i,
    'A' + i,
    'A#' + i,
    'B' + i
  )
}
// update current MIDI track, when a track in Cubase receives this code, it will in turn send a Key Pressure message to this module
function sendUpdateCode() {
  send('midi', 'OSC4', '/control', 1, 127, 127)
}

const SENDPARAMS = false
// send default articulation parameters to Cubase, this does not just update the template-io UI, it actually sends the MIDI command to Cubase
/**
 * @param {string} artOrFadPort
 * @param {string} artOrFadAddress
 * @param {number} artOrFadCode
 * @param {number} artOrFadDefaultValue
 */
function sendParameters(
  artOrFadPort,
  artOrFadAddress,
  artOrFadCode,
  artOrFadDefaultValue
) {
  if (!SENDPARAMS) return
  send(
    'midi',
    artOrFadPort,
    artOrFadAddress,
    1,
    artOrFadCode,
    artOrFadDefaultValue
  )
}

// toggles
let toggleAutoUpdate = false
let toggleShowCodes = true
let toggleSendUpdate = false

/**
 * @param {number} arg1_OSC2
 * @param {number} arg2_OSC2
 */
function toggles_OSC2(arg1_OSC2, arg2_OSC2) {
  // auto-update on track selection
  if (arg1_OSC2 === 127 && arg2_OSC2 === 1) {
    toggleAutoUpdate = true
  }
  if (arg1_OSC2 === 127 && arg2_OSC2 === 0) {
    toggleAutoUpdate = false
  }

  // show codes in UI
  if (arg1_OSC2 === 119 && arg2_OSC2 === 1) {
    sendUpdateCode()
    toggleShowCodes = true
  }
  if (arg1_OSC2 === 119 && arg2_OSC2 === 0) {
    sendUpdateCode()
    toggleShowCodes = false
  }
}

/**
 * @param {number} arg1_OSC3
 * @param {number} arg2_OSC3
 */
function toggles_OSC3(arg1_OSC3, arg2_OSC3) {
  if (arg1_OSC3 === 126 && arg2_OSC3 === 1) {
    toggleSendUpdate = true
  }
  if (arg1_OSC3 === 126 && arg2_OSC3 === 0) {
    toggleSendUpdate = false
  }
}

function oscReset() {
  // might not need to hardcode the number of faders and articulations, but it's fine for now. in OSC we can use a matrix widget and dynamically create the number of faders and articulations based on the JSON file
  const fadCount = 8
  const artCount = 18
  // reset all fader info in OSC
  for (let i = 0; i < fadCount; i++) {
    const index = i + 1
    receive(`/cc_${index}_text_display`, ' ')
    receive(`/cc_${index}_increment`, 0)
    receive(`/cc_${index}_fad`, 0)
  }
  // reset all articulation info in OSC
  for (let i = 0; i < artCount; i++) {
    const index = i + 1
    receive(`/art_name_${index}`, ' ')
    receive(`/art_inpt_${index}`, 'true')
    receive(`/art_colr_${index}`, '#A9A9A9')
    receive(`/art_mod_a_${index}`, 0.15)
    receive(`/art_mod_b_${index}`, 0.15)
  }
  // reset the range information in OSC
  receive('/template_io_key_range_var_1', ...[])
  receive('/template_io_key_range_var_2', ...[])
  receive('/template_io_key_range_script', 1)
  receive('/selected_track_number', ' ')
  receive('/selected_track_delays', ' ')
}

//
module.exports = {
  init: function () {
    // this assumes that Cubase is open before OSC, this will reset some of the basic settings in Cubase

    send('midi', 'OSC1', '/control', 3, 17, 1) // grid: 'whole notes'
    send('midi', 'OSC1', '/control', 3, 25, 1) // snap type: 'grid'
    send('midi', 'OSC1', '/control', 2, 9, 1) // control room monitor 1: 'A5X + SUB8'
    setTimeout(() => {
      send('midi', 'OSC1', '/control', 3, 20, 1) // grid: 'eighth notes'
    }, 100)
  },

  /** @param {OscFilterData} data */
  oscInFilter: function (data) {
    const { address, args, host, port } = data

    // GATE CHECK - OSC2 AND OSC3 ONLY
    // these are the only two ports that should affect this module
    // for some reason the && is the only way to get this to work for ports, but sometimes it breaks the MCU module? I don't know why, I feel like ?? should work but it doesn't

    if (port !== 'OSC2' && port !== 'OSC3') return data
    if (!args[1] || !args[2]) return data

    // TOGGLE CHECK - OSC2 ONLY
    // these codes are sent from OSC to itself for toggling UI elements and functions
    const arg1 = args[1].value
    const arg2 = args[2].value

    if (port === 'OSC2' && address === '/control') {
      toggles_OSC2(arg1, arg2)
      if (toggleAutoUpdate) {
        receive('/track_name_color', '#70b7ff')
        receive('/template_io_track_name_color', '#70b7ff')
      } else {
        receive('/track_name_color', 'red')
        receive('/template_io_track_name_color', 'red')
      }
      return data
    }

    // TRACK SELECTION - OSC3 ONLY
    // these codes are sent from Cubase upon track selection
    // Here we could say something like if sysex gives us trackname, find the track in the json file and then send the data to the template-io module
    // TODO: if I receive more than 4 in less than, maybe a half-second, then halt. this should help prevent issues when selecting all tracks, etc.
    if (port === 'OSC3' && address === '/control') {
      toggles_OSC3(arg1, arg2)
      if (toggleAutoUpdate && toggleSendUpdate) {
        sendUpdateCode()
        toggleSendUpdate = false // need this to avoid infinite loop
      }
    }

    // MAIN FUNCTION - OSC3 KEY PRESSURE ONLY

    // this is the main function of this module, it receives the track number from Cubase and then sends the appropriate data to the UI
    if (address !== '/key_pressure') return data
    oscReset()

    const trkNumb = arg1 * 128 + arg2
    receive('/selected_track_number', trkNumb)

    const track = items[trkNumb]

    if (!track) {
      receive('/selected_track_name', 'No Track Data!')
      return data
    }

    receive('/selected_track_name', track.name)
    receive('/selected_track_notes', track.notes)
    receive('/template_io_selected_track_name', track.name)
    receive('/template_io_selected_track_notes', track.notes)

    // hack to get the base delay to show positive or negative
    let trkBaseDelaySign = ''
    let trkAvgDelaySign = ''
    if (Math.sign(track.base_delay) === 1) {
      trkBaseDelaySign = '+'
    }
    if (Math.sign(track.avg_delay) === 1) {
      trkAvgDelaySign = '+'
    }

    receive(
      '/selected_track_delays',
      `Base Delay: ${trkBaseDelaySign}${track.base_delay}ms\nAvg Delay: ${trkAvgDelaySign}${track.avg_delay}ms`
    )

    // if there are more than 4 faders in the JSON file, then we show a red border around the fader panel so that the user knows to paginate
    if (track.fad_list.length > 4) {
      receive('/fader_panel_color_2', '1px solid red')
    } else {
      receive('/fader_panel_color_2', '')
    }

    const fadList = track.fad_list
    for (let i = 0; i < fadList.length; i++) {
      const fad = fadList[i]
      const index = i + 1

      // this populates the fader button with the appropriate data
      receive(`/cc_${index}_text_display`, fad.name) // string | null
      receive(`/cc_${index}_increment`, fad.code) // number | null
      receive(`/cc_${index}_fad`, fad.default) // number | null

      // this sends the default fader parameters to Cubase
      sendParameters('OSC4', fad.code_type, fad.code, fad.default)
    }

    /**
     * @param {import("@/../../src/components/backendCommands/backendCommands").ItemsArtListTap | import("@/../../src/components/backendCommands/backendCommands").ItemsArtListTog} art
     * @param {number} index
     * @param {"toggle" | "tap"} mode
     * @param {boolean} showCodes
     */
    function processArt(art, index, mode, showCodes) {
      if (!art.name) {
        receive('/template_io_key_range_var_1', track.full_ranges) // {}[]
        receive('/template_io_key_range_var_2', art.ranges) // string[]
        receive('/template_io_key_range_script', 1)
        return
      }

      if (showCodes) {
        let codeDisplay = ''
        if (art.code_type === '/control') {
          codeDisplay = 'CC'
        }
        if (art.code_type === '/note') {
          codeDisplay = `${globalAllNotesList[art.code]}/`
        }

        let artDelaySign = Math.sign(art.delay) === 1 ? '+' : ''
        let layersCount = ''

        if (
          mode === 'toggle' &&
          'art_layers_on' in art &&
          'art_layers_off' in art
        ) {
          layersCount = `${JSON.parse(art.art_layers_on).length}/${JSON.parse(art.art_layers_off).length}`
        } else if (mode === 'tap' && 'art_layers' in art) {
          layersCount = JSON.parse(art.art_layers).length
        }

        let offDisplay = art.off ? `/${art.off}` : ''
        let nameDisplay = `${art.name}\n(${codeDisplay}${art.code} - ${art.on}${offDisplay})\n(${artDelaySign}${art.delay}ms)\n(Layers: ${layersCount})`

        receive(`/art_name_${index}`, nameDisplay)
      } else {
        receive(`/art_name_${index}`, art.name)
      }

      receive(`/art_type_${index}`, art.code_type)
      receive(`/art_code_${index}`, art.code)
      receive(`/art_inpt_${index}`, 'false')
      receive(`/art_deft_${index}`, art.off)
      receive(`/art_on___${index}`, art.on)
      receive(`/art_off__${index}`, art.off)
      receive(`/art_rang_${index}`, art.ranges)
      receive(`/art_mode_${index}`, mode)
      receive(`/art_colr_${index}`, mode === 'toggle' ? '#a86739' : '#6dfdbb')

      if (mode === 'tap' && 'art_layers' in art) {
        receive(`/art_layers_together_${index}`, art.layers_together.toString())

        if (art.art_layers !== '[]') {
          const layersFiltered = art.art_layers.replace('"",', '')
          const obj = JSON.parse(layersFiltered)
          const layersFilteredObj = obj.map((item) => {
            const layer = {
              ...track.art_layers.find((layer) => layer.id === item)
            }
            delete layer.fileitems_item_id
            return layer
          })

          const newObj = {
            id: art.id,
            name: art.name,
            layers: layersFilteredObj
          }
          receive(`/art_layers_on_${index}`, newObj)
        } else {
          receive(`/art_layers_on_${index}`, '')
        }
      } else if (
        mode === 'toggle' &&
        'art_layers_on' &&
        'art_layers_off' in art
      ) {
        receive(`/art_layers_together_${index}`, 'true')

        if (art.art_layers_on !== '[]') {
          const layersOnFiltered = art.art_layers_on.replace('"",', '')
          const obj = JSON.parse(layersOnFiltered)
          const layersOnFilteredObj = obj.map((item) => {
            const layer = {
              ...track.art_layers.find((layer) => layer.id === item)
            }
            delete layer.fileitems_item_id
            return layer
          })

          const newObj = {
            id: art.id,
            name: art.name,
            layers: layersOnFilteredObj
          }
          receive(`/art_layers_on_${index}`, newObj)
        } else {
          receive(`/art_layers_on_${index}`, '')
        }
        if (art.art_layers_off !== '[]') {
          const layersOffFiltered = art.art_layers_off.replace('"",', '')
          const obj = JSON.parse(layersOffFiltered)
          const layersOffFilteredObj = obj.map((item) => {
            const layer = {
              ...track.art_layers.find((layer) => layer.id === item)
            }
            delete layer.fileitems_item_id
            return layer
          })

          const newObj = {
            id: art.id,
            name: art.name,
            layers: layersOffFilteredObj
          }
          receive(`/art_layers_on_${index}`, newObj)
        } else {
          receive(`/art_layers_off_${index}`, '')
        }
      }

      if (mode === 'toggle') {
        sendParameters('OSC4', art.code_type, art.code, art.off)
      }

      if (
        (mode === 'toggle' && art.default === 'On') ||
        (mode === 'tap' && art.default)
      ) {
        receive(
          mode === 'toggle' ? `/art_mod_b_${index}` : `/art_mod_a_${index}`,
          0.75
        )
        receive(`/art_deft_${index}`, art.on)
        receive('/template_io_key_range_var_1', track.full_ranges)
        receive('/template_io_key_range_var_2', art.ranges)
        receive('/template_io_key_range_script', 1)
        sendParameters('OSC4', art.code_type, art.code, art.on)

        // send layers
      }
    }

    const artListTog = track.art_list_tog
    const artListTap = track.art_list_tap

    // Process Tog Articulations
    for (let i = 0; i < artListTog.length; i++) {
      processArt(artListTog[i], i + 1, 'toggle', toggleShowCodes)
    }

    // Process Tap Articulations
    for (let i = 0; i < artListTap.length; i++) {
      let index = 0
      if (artListTog.length === 1 && artListTog[0].name === '') {
        index = i + 1
      } else {
        index = artListTog.length + i + 1
      }

      processArt(artListTap[i], index, 'tap', toggleShowCodes)
    }

    return { address, args, host, port }
  },

  /** @param {OscFilterData} data */
  oscOutFilter: function (data) {
    // this is to get an artificial track response for testing without having to open Cubase
    //send('midi', 'OSC3', '/key_pressure', 0, 1, 31)

    return data
  }
}
