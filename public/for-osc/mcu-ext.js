/*

from https://github.com/jean-emmanuel/open-stage-control-mcu/tree/master
MCU <-> OSC translation layer
Based on https://github.com/NicoG60/OscMackieControl

*/

const DEBUG = false

const MIDI_DEVICE_NAME = 'osc_mcu'
const MIDI_DEVICE_NAME_EXT = 'osc_mcu_2'

const NOTES_TO_ACTIONS = {
    // VPOT ASSIGN
    40: 'assign_track',
    41: 'assign_send',
    42: 'assign_pan',
    43: 'assign_plugin',
    44: 'assign_eq',
    45: 'assign_instrument',

    // FADER BANKS
    46: 'bank_left',
    47: 'bank_right',
    48: 'bank_channel_left',
    49: 'bank_channel_right',
    50: 'bank_flip',
    51: 'bank_global',

    // DISPLAY
    52: 'display_name_value',
    53: 'display_smpte_beats',

    // FUNCTION SELECT
    54: 'f1',
    55: 'f2',
    56: 'f3',
    57: 'f4',
    58: 'f5',
    59: 'f6',
    60: 'f7',
    61: 'f8',

    // GLOBAL VIEW
    62: 'view_midi_tracks',
    63: 'view_inputs',
    64: 'view_audio_tracks',
    65: 'view_audio_instruments',
    66: 'view_aux',
    67: 'view_busses',
    68: 'view_outputs',
    69: 'view_user',

    // MODIFIERS
    70: 'mod_shift',
    71: 'mod_option',
    72: 'mod_control',
    73: 'mod_alt',

    // AUTOMATION
    74: 'automation_read',
    75: 'automation_write',
    76: 'automation_trim',
    77: 'automation_touch',
    78: 'automation_latch',
    79: 'automation_group',

    // UTILITIES
    80: 'save',
    81: 'undo',
    82: 'cancel',
    83: 'enter',

    // MISC
    84: 'markers',
    85: 'nudge',
    86: 'cycle',
    87: 'drop',
    88: 'replace', //for some reason, this is triggering "go to previous marker" in Cubase
    89: 'click',
    90: 'global_solo', //for some reason, this is triggering "go to next marker" in Cubase

    // TRANSPORT
    91: 'rewind',
    92: 'forward',
    93: 'stop',
    94: 'play',
    95: 'record',
    96: 'up',
    97: 'down',
    98: 'left',
    99: 'right',
    100: 'zoom',
    101: 'scrub',

    // LEDS
    113: 'led_smpte',
    114: 'led_beats',
    115: 'led_solo'
}
const ACTIONS_TO_NOTES = {}
for (let k in NOTES_TO_ACTIONS) {
    ACTIONS_TO_NOTES[NOTES_TO_ACTIONS[k]] = parseInt(k)
}

function mcuToOsc(host, port, address, args) {
  let inArgs = args.map((x) => x.value),
    outArgs = [],
    action = ''

  let numberHelper
  if (port === MIDI_DEVICE_NAME_EXT) {
    numberHelper = 9
  } else if (port === MIDI_DEVICE_NAME) {
    numberHelper = 1
  }

  // NOTE
  if (address === '/note') {
    const [channel, note, value] = inArgs

    if (channel === 1) {
      if (note < 8) {
        action = 'rec'
        outArgs.push((note % 8) + numberHelper)
      } else if (note < 16) {
        action = 'solo'
        outArgs.push((note % 8) + numberHelper)
      } else if (note < 24) {
        action = 'mute'
        outArgs.push((note % 8) + numberHelper)
      } else if (note < 32) {
        action = 'sel'
        outArgs.push((note % 8) + numberHelper)
      } else if (note < 40) {
        action = 'vpot_click'
        outArgs.push((note % 8) + numberHelper)
      } else if (NOTES_TO_ACTIONS[note]) {
        action = NOTES_TO_ACTIONS[note]
      }
    }

    outArgs.push(value / 127)

    // CONTROL CHANGE
  } else if (address === '/control') {
    const [channel, control, value] = inArgs //NOSONAR

    //if (channel === 1) { //for some reason, Cubase is sending channel 16 for the time code/bars & beats
    if (control > 15 && control < 24) {
      action = 'vpot_rotate'
      outArgs.push((control % 8) + numberHelper)
      outArgs.push(value === 1 ? -1 : 1)
    } else if (control > 47 && control < 56) {
      action = 'vpot_led'
      outArgs.push((control % 8) + numberHelper)

      let ctl = value >> 4,
        firstLed = ctl >> 2,
        mode = ctl & 3,
        ledRaw = value & 0xf,
        leds = Array(11).fill(0)

      if (ledRaw) {
        if (mode === 0) {
          // single led
          leds[ledRaw - 9] = 1
        } else if (mode === 1) {
          // pan
          const pan = ledRaw - 6
          if (pan < 0) {
            for (let i = pan; i <= 0; i++) {
              leds[i + 5] = 1
            }
          } else {
            for (let i = pan; i >= 0; i--) {
              leds[i - 5] = 1
            }
          }
        } else if (mode === 2) {
          // level
          for (let i = 0; i < ledRaw; i++) {
            leds[i] = 1
          }
        } else if (mode === 3) {
          // spread
          leds[5] = 1
          if (ledRaw > 6) ledRaw = 6
          for (let i = 1; i < ledRaw; i++) {
            const offset = i - ledRaw
            leds[5 + offset] = 1
            leds[5 - offset] = 1
          }
        }
      }

      outArgs.push(firstLed, ...leds)
    } else if (control > 63 && control < 74) {
      let msb = value >> 4,
        val = value & 0xf

      if (msb >> 2) val += '.'
      if (!(msb & (1 << 1))) val = ''

      action = 'timecode'
      outArgs.push(73 - control, val)
    }

    // } else if (channel === 1 && control === 60) {
    //     // nothing to update
    //     action = 'scrub_wheel'
    //     outArgs.push(value === 1 ? -1 : 1)
    //}

    // CHANNEL PRESSURE
  } else if (address === '/channel_pressure') {
    const [channel, value] = inArgs

    if (channel === 1) {
      action = 'vu_meter'
      outArgs.push((value >> 4) + numberHelper) // msb: track number
      outArgs.push((value & 0xf) / 12) // lsb: meter value
    }

    // PITCHBEND
  } else if (address === '/pitch') {
    const [channel, value] = inArgs

    if (channel < 10) {
      action = 'fader'
      outArgs.push(channel + numberHelper - 1) // channel: track number
      outArgs.push(value / 16383) // pitch: fader value
    }

    // SYSEX
  } else if (address === '/sysex') {
    const [value] = inArgs

    if (value.includes('f0 00 00 66 14 12')) {
      // mackie lcd text

      let d = value
          .split(' ')
          .slice(6)
          .map((x) => parseInt(x, 16)), // hex to int
        pos = d[0], // first byte -> position
        text = d.slice(1).map((x) => String.fromCharCode(x)) // rest -> updated characters

      text.pop() // drop sysex closing byte

      if (port === MIDI_DEVICE_NAME) {
        action = 'lcd'
      } else if (port === MIDI_DEVICE_NAME_EXT) {
        action = 'lcd_ext'
      }

      outArgs.push(pos, ...text)
    } else if (value.includes('f0 00 00 66 14 20')) {
      // meter mode

      let d = value
          .split(' ')
          .slice(6)
          .map((x) => parseInt(x, 16)), // hex to int
        channel = d[0] + 1,
        mode = d[1]

      action = 'vu_meter_mode'
      outArgs.push(channel, mode & (1 << 2) ? 1 : 0)

      if (port === MIDI_DEVICE_NAME) {
        receive(
          'midi',
          MIDI_DEVICE_NAME,
          '/led_signal',
          channel,
          mode & 1 ? 1 : 0
        )
      } else if (port === MIDI_DEVICE_NAME_EXT) {
        receive(
          'midi',
          MIDI_DEVICE_NAME_EXT,
          '/led_signal',
          channel,
          mode & 1 ? 1 : 0
        )
      }
    }
  }

  if (action) {
    if (port === MIDI_DEVICE_NAME) {
      receive('midi', MIDI_DEVICE_NAME, '/' + action, ...outArgs)
    } else if (port === MIDI_DEVICE_NAME_EXT) {
      receive('midi', MIDI_DEVICE_NAME_EXT, '/' + action, ...outArgs)
    }
    if (DEBUG) console.log('mcu in: ', action, outArgs)
    return true
  } else if (DEBUG) {
    console.log('Unparsed mcu in: ', address, args)
  }
}

function oscToMcu(host, port, address, args) {
  let inArgs = args.map((x) => x.value),
    action = address.substr(1),
    outAddress = '',
    outArgs = []

  let numberHelper
  if (port === MIDI_DEVICE_NAME_EXT) {
    numberHelper = 9
  } else if (port === MIDI_DEVICE_NAME) {
    numberHelper = 1
  }

  // NOTE
  if (action === 'rec') {
    outAddress = '/note'
    outArgs.push(1, inArgs[0] - numberHelper, inArgs[1] * 127)
  } else if (action === 'solo') {
    outAddress = '/note'
    outArgs.push(1, 8 + inArgs[0] - numberHelper, inArgs[1] * 127)
  } else if (action === 'mute') {
    outAddress = '/note'
    outArgs.push(1, 16 + inArgs[0] - numberHelper, inArgs[1] * 127)
  } else if (action === 'sel') {
    outAddress = '/note'
    outArgs.push(1, 24 + inArgs[0] - numberHelper, inArgs[1] * 127)
  } else if (action === 'vpot') {
    outAddress = '/note'
    outArgs.push(1, 32 + inArgs[0] - numberHelper, inArgs[1] * 127)
  } else if (ACTIONS_TO_NOTES[action]) {
    outAddress = '/note'
    outArgs.push(1, ACTIONS_TO_NOTES[action], inArgs[0] * 127)
  } else if (action === 'fader_touch') {
    outAddress = '/note'
    outArgs.push(1, 103 + inArgs[0], inArgs[1] * 127)
  }

  // CONTROL CHANGE
  else if (action === 'vpot_rotate') {
    outAddress = '/control'
    outArgs.push(1, 16 + inArgs[0] - numberHelper, inArgs[1] === 1 ? 1 : 65)
  } else if (action === 'scrub_wheel') {
    outAddress = '/control'
    outArgs.push(1, 60, inArgs[0] === 1 ? 1 : 65)
  }

  // PITCHBEND
  else if (action === 'fader') {
    outAddress = '/pitch'
    outArgs.push(inArgs[0] + numberHelper - 1, inArgs[1] * 16383)
  }

  if (outAddress) {
    if (port === MIDI_DEVICE_NAME) {
      send('midi', MIDI_DEVICE_NAME, outAddress, ...outArgs)
    } else if (port === MIDI_DEVICE_NAME_EXT) {
      send('midi', MIDI_DEVICE_NAME_EXT, outAddress, ...outArgs)
    }
    if (DEBUG) console.log('mcu out: ', outAddress, outArgs)
    return true
  } else if (DEBUG) {
    console.log('Unparsed mcu out: ', address, inArgs)
  }
}

/*

Custom module

*/

// check midi settings
const midi = (settings.read('midi') || []).join('')
if (!midi) {
  console.warn('(WARNING, MCU) "midi" option not set')
} else {
  if (!midi.includes('sysex')) {
    console.warn('(WARNING, MCU) "midi" sysex option not set')
  }
  if (!midi.includes(MIDI_DEVICE_NAME)) {
    console.warn(
      `(WARNING, MCU) "midi" device "${MIDI_DEVICE_NAME}" not declared`
    )
  }
  if (!midi.includes(MIDI_DEVICE_NAME_EXT)) {
    console.warn(
      `(WARNING, MCU) "midi" device "${MIDI_DEVICE_NAME_EXT}" not declared`
    )
  }
}

// set midi target in interface
app.on('sessionOpened', () => {
  receive('/SET', 'midi_target', 'midi:' + MIDI_DEVICE_NAME)
  receive('/SET', 'midi_target_ext', 'midi:' + MIDI_DEVICE_NAME_EXT)
})

module.exports = {
  oscOutFilter: function (data) {
    const { host, port, address, args } = data

    if (
      host !== 'midi' ?? //NOSONAR
      port !== MIDI_DEVICE_NAME ?? //NOSONAR
      port !== MIDI_DEVICE_NAME_EXT //NOSONAR
    )
      return data

    if (oscToMcu(host, port, address, args)) return

    return data
  },

  oscInFilter: function (data) {
    const { host, port, address, args } = data

    if (
      host !== 'midi' ?? //NOSONAR
      port !== MIDI_DEVICE_NAME ?? //NOSONAR
      port !== MIDI_DEVICE_NAME_EXT //NOSONAR
    )
      return data //NOSONAR

    if (mcuToOsc(host, port, address, args)) return

    return data
  }
}
