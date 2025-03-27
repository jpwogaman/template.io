// @ts-check
/// <reference path="./custom-module.d.ts" />

/** @type {import("@/../../src/components/backendCommands/backendCommands").FullTrackListForExport} */
const allTrack_jsn = loadJSON('tracks-11.27.2023-v33_new-export-test.json')

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

// toggles
let SENDPARAMS = true
let toggleAutoUpdate = false
let toggleSendUpdate = false

/**
 * @param {127 | 126 | 125} arg1_OSC2
 * @param {0 | 1} arg2_OSC2
 */
function toggles_OSC2(arg1_OSC2, arg2_OSC2) {
  // auto-update on track selection
  if (arg1_OSC2 === 127 && arg2_OSC2 === 1) {
    toggleAutoUpdate = true
    receive('/track_name_color', '#70b7ff')
    receive('/template_io_track_name_color', '#70b7ff')
  }
  if (arg1_OSC2 === 127 && arg2_OSC2 === 0) {
    toggleAutoUpdate = false
    receive('/track_name_color', 'red')
    receive('/template_io_track_name_color', 'red')
  }

  // call oscReset()
  if (arg1_OSC2 === 126 && arg2_OSC2 === 1) {
    oscFullReset()
  }

  // SEND PARAMS
  if (arg1_OSC2 === 125 && arg2_OSC2 === 1) {
    SENDPARAMS = true
  }
  if (arg1_OSC2 === 125 && arg2_OSC2 === 0) {
    SENDPARAMS = false
  }
}

/**
 * @param {126} arg1_OSC3
 * @param {0 | 1} arg2_OSC3
 */
function toggles_OSC3(arg1_OSC3, arg2_OSC3) {
  if (arg1_OSC3 === 126 && arg2_OSC3 === 1) {
    toggleSendUpdate = true
  }
  if (arg1_OSC3 === 126 && arg2_OSC3 === 0) {
    toggleSendUpdate = false
  }
}

// update current MIDI track, when a track in Cubase receives this code, it will in turn send a Key Pressure message to this module
function sendUpdateCode() {
  send('midi', 'OSC4', '/control', 1, 127, 127)
}

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

function oscFullReset() {
  toggles_OSC2(127, 0)
  oscResetFads(0, 8)
  oscResetArts(0, 18)
  receive('/template_io_key_range_var_1', ...[])
  receive('/template_io_key_range_var_2', ...[])
  receive('/template_io_key_range_script', 1)
  receive('/selected_track_number', 'Track No.')
  receive('/selected_track_name', 'Track Name')
  receive('/selected_track_delays', 'Delays')
  receive('/selected_track_notes', ' ')
}

/**
 *
 * @param {number} start
 * @param {number} fadCount
 */

function oscResetFads(start, fadCount) {
  for (let i = start; i < fadCount; i++) {
    const index = i + 1
    receive(`/cc_${index}_text_display`, ' ')
    receive(`/cc_${index}_increment`, 0)
    receive(`/cc_${index}_fad`, 0)
  }
}

/**
 *
 * @param {number} start
 * @param {number} artCount
 */

function oscResetArts(start, artCount) {
  for (let i = start; i < artCount; i++) {
    const index = i + 1
    receive(`/art_name_${index}`, ' ')
    receive(`/art_name_display_${index}`, ' ')
    receive(`/art_inpt_${index}`, 'true')
    receive(`/art_colr_${index}`, '#A9A9A9')
    receive(`/art_mod_a_${index}`, 0.15)
    receive(`/art_mod_b_${index}`, 0.15)
    receive(`/art_type_${index}`, ' ')
    receive(`/art_code_${index}`, ' ')
    receive(`/art_deft_${index}`, ' ')
    receive(`/art_on___${index}`, ' ')
    receive(`/art_off__${index}`, ' ')
    receive(`/art_rang_${index}`, ' ')
    receive(`/art_mode_${index}`, 'tap')
    receive(`/art_layers_on_${index}`, ' ')
    receive(`/art_layers_off_${index}`, ' ')
  }
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

    const trkNumb = arg1 * 128 + arg2
    receive('/selected_track_number', trkNumb)

    const track = items[trkNumb]

    if (!track || trkNumb !== parseInt(track.id.split('_')[1])) {
      receive('/selected_track_name', 'No Track Data!')
      receive('/selected_track_delays', ' ')
      receive('/selected_track_notes', ' ')
      oscResetFads(0, 8)
      oscResetArts(0, 18)
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

    oscResetFads(fadList.length, 8)

    /**
     * @param {import("@/../../src/components/backendCommands/backendCommands").ItemsArtListTap | import("@/../../src/components/backendCommands/backendCommands").ItemsArtListTog} art
     * @param {number} index
     * @param {"toggle" | "tap"} mode
     */
    function processArt(art, index, mode) {
      if (!art.name || art.name === '') {
        receive('/template_io_key_range_var_1', track.full_ranges) // {}[]
        receive('/template_io_key_range_var_2', art.ranges) // string[]
        receive('/template_io_key_range_script', 1)
        receive(`/art_name_${index}`, ' ')
        return
      }

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

      const newNameObj = {
        name: art.name,
        codeDisplay: `(${codeDisplay}${art.code} - ${art.on}${offDisplay})`,
        delay: `(${artDelaySign}${art.delay}ms)`,
        layersCount: parseInt(layersCount)
      }

      receive(`/art_name_${index}`, newNameObj)
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
          /**
           * @type {Array<`T_${number}_AL_${number}`>}
           * */
          const obj = JSON.parse(art.art_layers)

          const layersFilteredObj = obj.map((layerId) => {
            const layer = {
              ...track.art_layers.find((layer) => layer.id === layerId)
            }

            delete layer.fileitems_item_id
            return /** @type {Omit<import("@/../../src/components/backendCommands/backendCommands").ItemsArtLayers, "fileitems_item_id">} */ (
              layer
            )
          })

          layersFilteredObj.sort(
            /**
             * @returns {number}
             */
            (a, b) => {
              const aMatch = a.id.match(/T_\d+_AL_(\d+)/)
              const bMatch = b.id.match(/T_\d+_AL_(\d+)/)

              const aNum = aMatch ? parseInt(aMatch[1], 10) : 0
              const bNum = bMatch ? parseInt(bMatch[1], 10) : 0

              return aNum - bNum
            }
          )

          const newObj = {
            id: art.id,
            name: art.name,
            defaultLayer: art.default_layer,
            layers: layersFilteredObj
          }
          const indexOfDefaultLayer = layersFilteredObj.findIndex(
            (layer) => layer.id === art.default_layer
          )
          receive(`/art_layers_on_${index}`, newObj)

          if (art.default) {
            receive('/active_layer_index', indexOfDefaultLayer)
            receive('/active_art_tap', newObj)
            receive('/active_art_tap_number', index)

            if (indexOfDefaultLayer === 0) {
              receive('/active_tap_art_layers_prev_color', '#A9A9A9')
            } else {
              receive('/active_tap_art_layers_prev_color', '#70b7ff')
            }
            if (indexOfDefaultLayer === newObj.layers.length - 1) {
              receive('/active_tap_art_layers_next_color', '#A9A9A9')
            } else {
              receive('/active_tap_art_layers_next_color', '#70b7ff')
            }

            receive(
              '/active_art_tap_info_var',
              `Active Art Tap: ${newObj.name}\nActive Layer:  ${newObj.layers[indexOfDefaultLayer].name}`
            )
          }
        } else {
          receive(`/art_layers_on_${index}`, '')
          if (art.default) {
            receive('/active_art_tap', '')
            receive('/active_layer_index', 0)
            receive('/active_tap_art_layers_prev_color', '#A9A9A9')
            receive('/active_tap_art_layers_next_color', '#A9A9A9')
            receive('/active_art_tap_info_var', 'No Additional Layers')
          }
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

        if (
          mode === 'tap' &&
          'art_layers' in art &&
          art.art_layers !== '[]' &&
          !art.layers_together &&
          art.default_layer !== ''
        ) {
          const layerId = art.default_layer
          const defaultLayer = track.art_layers.find(
            (layer) => layer.id === layerId
          )

          if (!defaultLayer) return
          sendParameters(
            'OSC4',
            defaultLayer.code_type,
            defaultLayer.code,
            defaultLayer.on
          )
        } else if (
          mode === 'tap' &&
          'art_layers' in art &&
          art.art_layers !== '[]' &&
          !art.layers_together &&
          art.default_layer === ''
        ) {
          const firstLayer = track.art_layers[0]

          if (!firstLayer) return
          sendParameters(
            'OSC4',
            firstLayer.code_type,
            firstLayer.code,
            firstLayer.on
          )
        }
      } else {
        receive(`/art_mod_a_${index}`, 0.15)
        receive(`/art_mod_b_${index}`, 0.15)
      }
    }

    const artListTog = track.art_list_tog
    const artListTap = track.art_list_tap

    // Process Tog Articulations
    for (let i = 0; i < artListTog.length; i++) {
      if (artListTog.length === 1 && artListTog[0].name === '') {
        oscResetArts(0, 1)
      } else {
        processArt(artListTog[i], i + 1, 'toggle')
      }
    }

    // Process Tap Articulations
    for (let i = 0; i < artListTap.length; i++) {
      let index = 0
      if (artListTog.length === 1 && artListTog[0].name === '') {
        index = i + 1
      } else {
        index = artListTog.length + i + 1
      }

      if (artListTap.length === 1 && artListTap[0].name === '') {
        oscResetArts(artListTog.length - 1, 2)
        receive('/active_art_tap', 'empty')
        receive('/active_layer_index', 0)
        receive('/active_tap_art_layers_prev_color', '#A9A9A9')
        receive('/active_tap_art_layers_next_color', '#A9A9A9')
        receive('/active_art_tap_info_var', 'No Additional Layers')
      } else {
        processArt(artListTap[i], index, 'tap')
      }
    }
    receive('/show_codes_script', 1)
    oscResetArts(artListTog.length + artListTap.length, 18)

    return { address, args, host, port }
  },

  /** @param {OscFilterData} data */
  oscOutFilter: function (data) {
    // this is to get an artificial track response for testing without having to open Cubase
    //send('midi', 'OSC3', '/key_pressure', 0, 1, 31)

    return data
  }
}
