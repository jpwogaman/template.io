const allTrack_jsn = loadJSON('tracks-11.27.2023-v22.json')

const items = allTrack_jsn.items
// full schema for an item in the JSON file
//{
//  id: string
//  locked: boolean
//  name: string
//  notes: string
//  channel: number | null
//  baseDelay: number | null
//  avgDelay: number | null
//  vepOut: string
//  vepInstance: string
//  smpNumber: string
//  smpOut: string
//  color: string
//  fullRange:  {
//      id: string;
//      name: string | null;
//      low: string | null;
//      high: string | null;
//      whiteKeysOnly: boolean | null;
//      fileItemsItemId: string | null;
//  }[]
//  artListTog: {
//      id: string;
//      name: string | null;
//      toggle: boolean;
//      codeType: string | null;
//      code: number | null;
//      on: number | null;
//      off: number | null;
//      default: string | null;
//      delay: number | null;
//      changeType: string | null;
//      ranges: string | null; // actually a string[], parsed in OSC
//      artLayers: string | null; // actually a string[], parsed in OSC
//      fileItemsItemId: string | null;
//  }[]
//  artListTap: {
//      id: string;
//      name: string | null;
//      toggle: boolean;
//      codeType: string | null;
//      code: number | null;
//      on: number | null;
//      off: number | null;
//      default: boolean | null;
//      delay: number | null;
//      changeType: string | null;
//      ranges: string | null; // actually a string[], parsed in OSC
//      artLayers: string | null; // actually a string[], parsed in OSC
//      fileItemsItemId: string | null;
//  }[]
//  artLayers: {
//      id: string;
//      name: string | null;
//      codeType: string | null;
//      code: number | null;
//      on: number | null;
//      off: number | null;
//      default: string;
//      changeType: string | null;
//      fileItemsItemId: string | null;
//      itemsArtListTogId: string | null;
//      itemsArtListTapId: string | null;
//  }[]
//  fadList:  {
//      id: string;
//      name: string | null;
//      codeType: string | null;
//      code: number | null;
//      default: number | null;
//      changeType: string | null;
//      fileItemsItemId: string | null;
//  }[]
//}

//array of all notes (Middle C == C3 == MIDI Code 60)
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
    const fadNameAddress = '/cc_' + parseInt(i + 1) + '_text_display'
    const fadCodeAddress = '/cc_' + parseInt(i + 1) + '_increment'
    const fadDefaultValueAddress = '/cc_' + parseInt(i + 1) + '_fad'
    receive(fadNameAddress, ' ')
    receive(fadDefaultValueAddress, 0)
    receive(fadCodeAddress, 0)
  }
  // reset all articulation info in OSC
  for (let i = 0; i < artCount; i++) {
    const artNameAddress = '/art_name_' + parseInt(i + 1)
    const artInputBypassAddress = '/art_inpt_' + parseInt(i + 1)
    const artColorAddress = '/art_colr_' + parseInt(i + 1)
    const artAlphaFillOnAddress = '/art_mod_a_' + parseInt(i + 1)
    const artAlphaFillOffAddress = '/art_mod_b_' + parseInt(i + 1)
    receive(artNameAddress, ' ')
    receive(artInputBypassAddress, 'true')
    receive(artColorAddress, '#A9A9A9')
    receive(artAlphaFillOnAddress, 0.15)
    receive(artAlphaFillOffAddress, 0.15)
  }
  // reset the range information in OSC
  receive('/template_io_key_range_var_1', [])
  receive('/template_io_key_range_var_2', [])
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

    if (!items[trkNumb]) {
      receive('/selected_track_name', 'No Track Data!')
      return data
    }

    const trkName = items[trkNumb].name // string
    const trkNotes = items[trkNumb].notes // string

    receive('/selected_track_name', trkName)
    receive('/selected_track_notes', trkNotes)
    receive('/template_io_selected_track_name', trkName)
    receive('/template_io_selected_track_notes', trkNotes)

    const trkBaseDelay = items[trkNumb].baseDelay // number | null
    const trkAvgDelay = items[trkNumb].avgDelay // number | null
    // hack to get the base delay to show positive or negative
    let trkBaseDelaySign = ''
    let trkAvgDelaySign = ''
    if (Math.sign(trkBaseDelay) === 1) {
      trkBaseDelaySign = '+'
    }
    if (Math.sign(trkAvgDelay) === 1) {
      trkAvgDelaySign = '+'
    }

    receive(
      '/selected_track_delays',
      `Base Delay: ${trkBaseDelaySign}${trkBaseDelay}ms\nAvg Delay: ${trkAvgDelaySign}${trkAvgDelay}ms`
    )

    // if there are more than 4 faders in the JSON file, then we show a red border around the fader panel so that the user knows to paginate
    if (items[trkNumb].fadList.length > 4) {
      receive('/fader_panel_color_2', '1px solid red')
    } else {
      receive('/fader_panel_color_2', '')
    }

    const fadListJsn = items[trkNumb].fadList
    for (let i = 0; i < fadListJsn.length; i++) {
      const fadNameAddress = '/cc_' + parseInt(i + 1) + '_text_display'
      const fadCodeAddress = '/cc_' + parseInt(i + 1) + '_increment'
      const fadDefaultValueAddress = '/cc_' + parseInt(i + 1) + '_fad'
      const fadName = fadListJsn[i].name // string | null
      const fadAddress = fadListJsn[i].codeType // string | null
      const fadCode = parseInt(fadListJsn[i].code) // number | null
      const fadDefaultValue = parseInt(fadListJsn[i].default) // number | null

      // this populates the fader button with the appropriate data
      receive(fadNameAddress, fadName) // string | null
      receive(fadCodeAddress, fadCode) // number | null
      receive(fadDefaultValueAddress, fadDefaultValue) // number | null

      // this sends the default fader parameters to Cubase
      sendParameters('OSC4', fadAddress, fadCode, fadDefaultValue)
    }
    const artListJsn = [
      ...items[trkNumb].artListTap,
      ...items[trkNumb].artListTog
    ]

    const trkAllArtLayersJsn = items[trkNumb].artLayers // {}[]
    const trkAllRanges = items[trkNumb].fullRange // {}[]

    for (let i = 0; i < artListJsn.length; i++) {
      const artNameAddress = '/art_name_' + parseInt(i + 1)
      const artAddressAddress = '/art_type_' + parseInt(i + 1)
      const artCodeAddress = '/art_code_' + parseInt(i + 1)
      const artInputBypassAddress = '/art_inpt_' + parseInt(i + 1)
      const artDefaultValueAddress = '/art_deft_' + parseInt(i + 1)
      const artOnValueAddress = '/art_on___' + parseInt(i + 1)
      const artOffValueAddress = '/art_off__' + parseInt(i + 1)
      const artColorAddress = '/art_colr_' + parseInt(i + 1)
      const artAlphaFillOnAddress = '/art_mod_a_' + parseInt(i + 1)
      const artAlphaFillOffAddress = '/art_mod_b_' + parseInt(i + 1)
      const artModeAddress = '/art_mode_' + parseInt(i + 1)
      const artRangeAddress = '/art_rang_' + parseInt(i + 1)
      const artLayersAddress = '/art_layers_' + parseInt(i + 1)
      const artId = artListJsn[i].id // string
      const artName = artListJsn[i].name // string
      const artAddress = artListJsn[i].codeType // string
      const artMode = artListJsn[i].toggle // boolean
      const artDefaultValue = artListJsn[i].default // string | number | boolean | null
      const artCode = parseInt(artListJsn[i].code) // number | null
      const artOnValue = parseInt(artListJsn[i].on) // number | null
      const artOffValue = parseInt(artListJsn[i].off) // number | null
      const artDelayValue = artListJsn[i].delay // number | null
      const artRangeList = artListJsn[i].ranges // string[]
      const artLayersList = JSON.parse(artListJsn[i].artLayers) // string[]

      if (!artName) {
        receive('/template_io_key_range_var_1', trkAllRanges) // {}[]
        receive('/template_io_key_range_var_2', artRangeList) // string[]
        receive('/template_io_key_range_script', 1)
        continue
      }

      // this will display the note name or CC number, as well as it's value under the articulation button in the UI, e.g. (CC32/1), (C3/20)
      if (toggleShowCodes) {
        let codeDisplay = ''
        if (artAddress === '/control') {
          codeDisplay = 'CC'
        }
        if (artAddress === '/note') {
          codeDisplay = `${globalAllNotesList[artCode]}/`
        }

        let artDelaySign = ''
        if (Math.sign(artDelayValue) === 1) {
          artDelaySign = '+'
        }

        receive(
          artNameAddress,
          `${artName}\n(${codeDisplay}${artCode}/${artOnValue}${
            artOffValue ? '/' + artOffValue : ''
          })\n(${artDelaySign}${artDelayValue}ms)\n(Layers: ${artLayersList.length - 1})`
        )
      } else {
        receive(artNameAddress, artName)
      }

      //NEED TO ADD LOGIC FOR CHANGETYPE VALUE 1 VS 2

      // this populates the articulation button with the appropriate data
      receive(artAddressAddress, artAddress) // string
      receive(artCodeAddress, artCode) // number | null
      receive(artDefaultValueAddress, artOffValue) // number | null
      receive(artOnValueAddress, artOnValue) // number | null
      receive(artOffValueAddress, artOffValue) // number | null
      receive(artRangeAddress, artRangeList) // string[]
      receive(artInputBypassAddress, 'false')
      receive(artColorAddress, '#6dfdbb')

      // this sends the articulation OFF parameters to Cubase for ALL articulations
      sendParameters('OSC4', artAddress, artCode, artOffValue)

      const allLayersThisTrack = []

      if (artLayersList !== "['']") {
        for (const index in trkAllArtLayersJsn) {
          const layer = trkAllArtLayersJsn[index]

          if (artLayersList.includes(layer.id)) {
            allLayersThisTrack.push(layer)
            const layersFiltered = artListJsn[i].artLayers.replace('"",', '')
            const obj = JSON.parse(layersFiltered)
            const layersFilteredObj = obj.map((item) => {
              return item
            })

            const newObj = {
              id: artId,
              name: artName,
              layers: layersFilteredObj
            }

            receive(artLayersAddress, newObj)

            //if (layer.default === 'On') {
            //  prmUpdate(4, layer.codeType, layer.code, layer.on)
            //}
            //if (layer.default === 'Off') {
            //  prmUpdate(4, layer.codeType, layer.code, layer.off)
            //}
          }
        }
      }

      receive('/template_io_art_layers_var_1', allLayersThisTrack) // {}[]

      if (artMode === true) {
        receive(artModeAddress, 'toggle') // toggle, push, momentary, tap
        receive(artColorAddress, '#a86739')
        receive(artAlphaFillOffAddress, 0.75)

        if (artDefaultValue !== 'On') continue

        receive(artDefaultValueAddress, artOnValue) // number | null
        receive('/template_io_key_range_var_1', trkAllRanges) // {}[]
        receive('/template_io_key_range_var_2', artRangeList) // string[]
        receive('/template_io_key_range_script', 1)

        // this sends the articulation ON parameters to Cubase for ALL toggle articulations with a default of 'On'
        sendParameters('OSC4', artAddress, artCode, artOnValue)
      } else {
        receive(artModeAddress, 'tap') // toggle, push, momentary, tap

        if (!artDefaultValue) continue

        receive(artAlphaFillOnAddress, 0.75)
        receive(artDefaultValueAddress, artOnValue) // number | null
        receive('/template_io_key_range_var_1', trkAllRanges) // {}[]
        receive('/template_io_key_range_var_2', artRangeList) // string[]
        receive('/template_io_key_range_script', 1)

        // this sends the articulation ON parameters to Cubase for ONLY the default tap articulation
        sendParameters('OSC4', artAddress, artCode, artOnValue)
      }
    }

    return { address, args, host, port }
  },

  oscOutFilter: function (data) {
    // this is to get an artificial track response for testing without having to open Cubase
    //send('midi', 'OSC3', '/key_pressure', 0, 1, 31)

    return data
  }
}
