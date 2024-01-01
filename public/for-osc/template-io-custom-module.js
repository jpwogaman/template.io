const allTrack_jsn = loadJSON('tracks-11.27.2023-v16.json')

const items = allTrack_jsn.items
// full schema for an item in the JSON file
//{
//  id: string
//  locked: boolean
//  name: string
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
const allNotes_loc = []
for (let i = -2; i < 9; i++) {
  allNotes_loc.push(
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
function trkUpdate() {
  send('midi', 'OSC4', '/control', 1, 127, 127)
}

const PRMUPDATE = false
// send default articulation parameters to Cubase, this does not just update the template-io UI, it actually sends the MIDI command to Cubase
function prmUpdate(x, typeJsn, codeJsn, deftJsn) {
  if (!PRMUPDATE) return
  if (x === 3) {
    send('midi', 'OSC3', typeJsn, 1, codeJsn, deftJsn)
  }
  if (x === 4) {
    send('midi', 'OSC4', typeJsn, 1, codeJsn, deftJsn)
  }
}

// toggles
let togUpdat_loc = false
let togCodes_loc = true
let togClkTr_loc = false

function toggles(arg1, arg2) {
  // auto-update on track selection
  if (arg1 === 127 && arg2 === 1) {
    togUpdat_loc = true
  }
  if (arg1 === 127 && arg2 === 0) {
    togUpdat_loc = false
  }

  // show codes in UI
  if (arg1 === 119 && arg2 === 1) {
    trkUpdate()
    togCodes_loc = true
  }
  if (arg1 === 119 && arg2 === 0) {
    trkUpdate()
    togCodes_loc = false
  }
}

function clickTrk(arg1, arg2) {
  if (arg1 === 126 && arg2 === 1) {
    togClkTr_loc = true
  }
  if (arg1 === 126 && arg2 === 0) {
    togClkTr_loc = false
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

  oscInFilter: function (data) {
    const { address, args, host, port } = data

    // this borrows from the MCU protocol to find the selected track name
    //if (address === '/sysex') {
    //  // FILTER OUT UNWANTED SYSEX

    //  if (args[0].value.includes('f0 00 00 66 14 12')) {
    //    // CUBASE TRACKS HEX TO ASCII STRING
    //    let input = args[0].value.split(' ').splice(7, 35)
    //    input.pop()
    //    input = input.join('')
    //    let sysexTrackName = ''
    //    for (let n = 0; n < input.length; n += 2) {
    //      sysexTrackName += String.fromCharCode(
    //        parseInt(input.substr(n, 2), 16)
    //      )
    //    }

    //    console.log(sysexTrackName)
    //    let debugItem

    //    for (const item of items) {
    //      if (item.name.includes(sysexTrackName)) {
    //        debugItem = 'item'
    //      } else {
    //        debugItem = 'no item'
    //      }
    //    }

    //    console.log(debugItem)
    //  }
    //}

    // these are the only two ports that should affect this module
    // for some reason the && is the only way to get this to work, but sometimes it breaks the MCU module? I don't know why, I feel like ?? should work but it doesn't

    if (port !== 'OSC2' && port !== 'OSC3') return data
    if (!args[1]) return data
    if (!args[2]) return data

    const arg1 = args[1].value
    const arg2 = args[2].value
    // these codes are sent from OSC to itself for toggling UI elements and functions
    if (port === 'OSC2' && address === '/control') {
      toggles(arg1, arg2)
    }

    // these codes are sent from Cubase upon track selection
    // Here we could say something like if sysex gives us trackname, find the track in the json file and then send the data to the template-io module
    if (port === 'OSC3' && address === '/control') {
      clickTrk(arg1, arg2)
    }

    // if we are auto-updating the track, then we set the UI in OSC to blue, otherwise red
    if (togUpdat_loc) {
      receive('/trackNameColor', '#70b7ff')
      receive('/template-io_trackNameColor', '#70b7ff')
    } else {
      receive('/trackNameColor', 'red')
      receive('/template-io_trackNameColor', 'red')
    }

    // if we are auto-updating the track, then this actually send the command to Cubase to update the track
    if (togUpdat_loc && togClkTr_loc) {
      trkUpdate()
      togClkTr_loc = false // need this to avoid infinite loop
    }

    // TODO: if I receive more than 4 in less than, maybe a half-second, then halt. this should help prevent issues when selecting all tracks, etc.
    // this is the main function of this module, it receives the track number from Cubase and then sends the appropriate data to the UI
    if (address !== '/key_pressure') return data

    const trkNumb = arg1 * 128 + arg2

    // might not need to hardcode the number of faders and articulations, but it's fine for now. in OSC we can use a matrix widget and dynamically create the number of faders and articulations based on the JSON file

    // reset all fader info in OSC
    for (let i = 0; i < 8; i++) {
      const nameOsc = '/CC_disp_' + parseInt(i + 1)
      const addrOsc = '/CC_fad__' + parseInt(i + 1)
      const codeOsc = '/CC_incr_' + parseInt(i + 1)
      receive(nameOsc, ' ')
      receive(addrOsc, 0)
      receive(codeOsc, 0)
    }
    // reset all articulation info in OSC
    for (let i = 0; i < 18; i++) {
      const nameOsc = '/artname_' + parseInt(i + 1)
      const inptOsc = '/artinpt_' + parseInt(i + 1)
      const colrOsc = '/artcolr_' + parseInt(i + 1)
      const modAOsc = '/artmodA_' + parseInt(i + 1)
      const modBOsc = '/artmodB_' + parseInt(i + 1)
      receive(nameOsc, ' ')
      receive(inptOsc, 'true')
      receive(colrOsc, '#A9A9A9')
      receive(modAOsc, 0.15)
      receive(modBOsc, 0.15)
    }

    // reset the range information in OSC
    receive('/template-io_keyRangeVar1', [])
    receive('/template-io_keyRangeVar2', [])
    receive('/template-io_keyRangeScript', 1)
    receive('/selectedTrackKeyRanges', ' ')
    receive('/selectedTrackDelays', ' ')

    if (!items[trkNumb]) {
      receive('/selectedTrackName', 'No Track Data!')
      return data
    }

    // need to rename this OSC address to something more generic, currently just using to show track number
    receive('/selectedTrackKeyRanges', trkNumb)

    const trkName = items[trkNumb].name // string
    const trkRang = items[trkNumb].fullRange // {}[]
    const baseDely = items[trkNumb].baseDelay // number | null
    const avgDely = items[trkNumb].avgDelay // number | null

    // hack to get the base delay to show positive or negative
    let sign1 = ''
    let sign2 = ''
    if (Math.sign(baseDely) === 1) {
      sign1 = '+'
    }
    if (Math.sign(avgDely) === 1) {
      sign2 = '+'
    }

    receive('/selectedTrackName', trkName)
    receive('/template-io_selectedTrackName', trkName)
    receive(
      '/selectedTrackDelays',
      `Base Delay: ${sign1}${baseDely}ms\nAvg Delay: ${sign2}${avgDely}ms`
    )

    // if there are more than 4 faders in the JSON file, then we show a red border around the fader panel so that the user knows to paginate
    if (items[trkNumb].fadList.length > 4) {
      receive('/faderPanel-color-2', '1px solid red')
    } else {
      receive('/faderPanel-color-2', '')
    }

    const fadListJsn = items[trkNumb].fadList
    for (let i = 0; i < fadListJsn.length; i++) {
      const nameOsc = '/CC_disp_' + parseInt(i + 1)
      const addrOsc = '/CC_fad__' + parseInt(i + 1)
      const codeOsc = '/CC_incr_' + parseInt(i + 1)
      const nameJsn = fadListJsn[i].name // string | null
      const typeJsn = fadListJsn[i].codeType // string | null
      const codeJsn = parseInt(fadListJsn[i].code) // number | null
      const deftJsn = parseInt(fadListJsn[i].default) // number | null
      receive(nameOsc, nameJsn) // string | null
      receive(addrOsc, deftJsn) // number | null
      receive(codeOsc, codeJsn) // number | null
      prmUpdate(4, typeJsn, codeJsn, deftJsn)
    }
    const artListJsn = [
      ...items[trkNumb].artListTap,
      ...items[trkNumb].artListTog
    ]

    const allArtLayersJsn = items[trkNumb].artLayers

    for (let i = 0; i < artListJsn.length; i++) {
      const nameOsc = '/artname_' + parseInt(i + 1)
      const typeOsc = '/arttype_' + parseInt(i + 1)
      const codeOsc = '/artcode_' + parseInt(i + 1)
      const inptOsc = '/artinpt_' + parseInt(i + 1)
      const deftOsc = '/artdeft_' + parseInt(i + 1)
      const on__Osc = '/arton___' + parseInt(i + 1)
      const off_Osc = '/artoff__' + parseInt(i + 1)
      const colrOsc = '/artcolr_' + parseInt(i + 1)
      const modAOsc = '/artmodA_' + parseInt(i + 1)
      const modBOsc = '/artmodB_' + parseInt(i + 1)
      const modeOsc = '/artMode_' + parseInt(i + 1)
      const rangOsc = '/artrang_' + parseInt(i + 1)
      const layersOsc = '/artLayers_' + parseInt(i + 1)
      const idJsn = artListJsn[i].id // string
      const nameJsn = artListJsn[i].name // string
      const typeJsn = artListJsn[i].codeType // string
      const deftJsn = artListJsn[i].default // string | number | boolean | null
      const codeJsn = parseInt(artListJsn[i].code) // number | null
      const on__Jsn = parseInt(artListJsn[i].on) // number | null
      const off_Jsn = parseInt(artListJsn[i].off) // number | null
      const rangJsn = artListJsn[i].ranges // string[]
      const delyJsn = artListJsn[i].delay // number | null
      const layersJsn = JSON.parse(artListJsn[i].artLayers) // string[]

      if (!artListJsn[i].name) {
        receive('/template-io_keyRangeVar1', trkRang) // {}[]
        receive('/template-io_keyRangeVar2', rangJsn) // string[]
        receive('/template-io_keyRangeScript', 1)
        continue
      }

      // this will display the note name or CC number, as well as it's value under the articulation button in the UI, e.g. (CC32/1), (C3/20)
      let codeDsp

      if (typeJsn === '/control') {
        codeDsp = 'CC'
      } else if (typeJsn === '/note') {
        codeDsp = `${allNotes_loc[codeJsn]}/`
      } else {
        codeDsp = ''
      }

      let sign3 = ''
      if (Math.sign(delyJsn) === 1) {
        sign3 = '+'
      }

      if (togCodes_loc && nameJsn !== '') {
        receive(
          nameOsc,
          `${nameJsn}\n(${codeDsp}${codeJsn}/${on__Jsn}${
            off_Jsn ? '/' + off_Jsn : ''
          })\n(${sign3}${delyJsn}ms)\n(Layers: ${layersJsn.length - 1})`
        )
      } else {
        receive(nameOsc, nameJsn)
      }

      //NEED TO ADD LOGIC FOR CHANGETYPE VALUE 1 VS 2

      // this populates the articulation button with the appropriate data
      receive(typeOsc, typeJsn) // string
      receive(codeOsc, codeJsn) // number | null
      receive(deftOsc, off_Jsn) // number | null
      receive(on__Osc, on__Jsn) // number | null
      receive(off_Osc, off_Jsn) // number | null
      receive(rangOsc, rangJsn) // string[]
      receive(inptOsc, 'false')
      receive(colrOsc, '#6dfdbb')

      prmUpdate(4, typeJsn, codeJsn, off_Jsn)

      const allLayersThisTrack = []

      if (layersJsn !== "['']") {
        for (const index in allArtLayersJsn) {
          const layer = allArtLayersJsn[index]

          if (layersJsn.includes(layer.id)) {
            allLayersThisTrack.push(layer)
            const layersFiltered = artListJsn[i].artLayers.replace('"",', '')
            const obj = JSON.parse(layersFiltered)
            const layersFilteredObj = obj.map((item) => {
              return item
            })

            const newObj = {
              id: idJsn,
              name: nameJsn,
              layers: layersFilteredObj
            }

            receive(layersOsc, newObj)

            //if (layer.default === 'On') {
            //  prmUpdate(4, layer.codeType, layer.code, layer.on)
            //}
            //if (layer.default === 'Off') {
            //  prmUpdate(4, layer.codeType, layer.code, layer.off)
            //}
          }
        }
      }

      receive('/template-io_artLayersVar1', allLayersThisTrack) // {}[]

      if (artListJsn[i].toggle) {
        receive(modeOsc, 'toggle')
        receive(colrOsc, '#a86739')
        receive(modBOsc, 0.75)

        if (deftJsn !== 'On') continue

        //prmUpdate(4, typeJsn, codeJsn, on__Jsn)
        receive(deftOsc, on__Jsn) // number | null
        receive('/template-io_keyRangeVar1', trkRang) // {}[]
        receive('/template-io_keyRangeVar2', rangJsn) // string[]
        receive('/template-io_keyRangeScript', 1)
      } else {
        receive(modeOsc, 'tap')

        if (!deftJsn) continue

        receive(modAOsc, 0.75)
        receive(deftOsc, on__Jsn) // number | null
        receive('/template-io_keyRangeVar1', trkRang) // {}[]
        receive('/template-io_keyRangeVar2', rangJsn) // string[]
        receive('/template-io_keyRangeScript', 1)
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
