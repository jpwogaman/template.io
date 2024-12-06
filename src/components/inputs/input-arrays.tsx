import React, { type FC } from 'react'

const smpOutSettings = 32
const vepOutSettings = 128

const MiddleC = {
  bottom: -2,
  top: 9
}

const allNoteArray: string[] = []
for (let i = MiddleC.bottom; i < MiddleC.top; i++) {
  allNoteArray.push(
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
const chnMidiArray: number[] = []
for (let i = 1; i <= 16; i++) {
  chnMidiArray.push(i)
}

const setOutsArray: number[] = []
for (let i = 1; i <= 128; i++) {
  setOutsArray.push(i)
}
const valMidiArray: number[] = []
for (let i = 0; i <= 127; i++) {
  valMidiArray.push(i)
}
const valNoteArray: string[] = []
for (let i = 0; i <= 127; i++) {
  valNoteArray.push(i + ' / ' + allNoteArray[i])
}
const smpOutsArray: string[] = ['N/A']
for (let i = 1; i < smpOutSettings; i++) {
  if (i % 2 === 0) continue
  const j: number = i + 1
  const output: string = i + '/' + j
  smpOutsArray.push(output)
}
const vepOutsArray: string[] = ['N/A']
for (let i = 1; i < vepOutSettings; i++) {
  if (i % 2 === 0) continue
  const j: number = i + 1
  const output: string = i + '/' + j
  vepOutsArray.push(output)
}
const valPtchArray: number[] = []
for (let i = 0; i < 16384; i++) {
  valPtchArray.push(i)
}

const smpTypeArray: string[] = [
  'Native Instruments Kontakt',
  'Native Instruments Maschine',
  'Native Instruments Reaktor',
  'Native Instruments Komplete Kontrol',
  'EastWest Opus',
  'EastWest Play',
  'Orchestral Tools SINE Player',
  'Spitfire Audio LABS',
  'Spitfire Audio BBC Symphony Orchestra',
  'Vienna Synchron Player',
  'Vienna Instruments'
]

// make this user-input option
export const vepInstanceArray: string[] = [
  'N/A',
  'Strings',
  'Percussion + Pianos',
  'Brass',
  'Woodwinds'
]

const valAddrArray: string[] = [
  '/control---Control Code',
  '/note---Note',
  '/program---Program Change',
  '/pitch---Pitch Wheel',
  '/sysex---Sysex',
  '/mtc---MTC',
  '/channel_pressure---Channel Pressure',
  '/key_pressure---Polyphonic Key Pressure'
]

const valDeftArray: string[] = ['On', 'Off']

const setNoteArray: string[] = [
  'Middle C (60) = C5',
  'Middle C (60) = C4',
  'Middle C (60) = C3'
]

interface SelectListProps {
  numbers?: string[] | number[]
  valName?: string[]
}

export const SelectList: FC<SelectListProps> = ({ numbers, valName }) => {
  if (valName) {
    return (
      <>
        {valName.map((name: string) => (
          <option
            key={name.split('---')[0]}
            value={name.split('---')[0]}>
            {name.split('---')[1]}
          </option>
        ))}
      </>
    )
  }

  return (
    <>
      {numbers?.map((number: string | number) => (
        <option
          key={number}
          value={number}>
          {number}
        </option>
      ))}
    </>
  )
}

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export const selectArrays: {
  [index: string]: {
    name: string
    array?: React.JSX.Element | string[] | number[]
  }
} = {
  setOutsList: {
    name: 'setOutsList',
    array: <SelectList numbers={setOutsArray} />
  },
  setNoteList: {
    name: 'setNoteList',
    array: <SelectList numbers={setNoteArray} />
  },
  chnMidiList: {
    name: 'chnMidiList',
    array: <SelectList numbers={chnMidiArray} />
  },
  smpTypeList: {
    name: 'smpTypeList',
    array: <SelectList numbers={smpTypeArray} />
  },
  smpOutsList: {
    name: 'smpOutsList',
    array: <SelectList numbers={smpOutsArray} />
  },
  vepOutsList: {
    name: 'vepOutsList',
    array: <SelectList numbers={vepOutsArray} />
  },
  vepInstList: {
    name: 'vepInstList',
    array: <SelectList numbers={vepInstanceArray} />
  },
  valAddrList: {
    name: 'valAddrList',
    array: <SelectList valName={valAddrArray} />
  },
  valMidiList: {
    name: 'valMidiList',
    array: <SelectList numbers={valMidiArray} />
  },
  valChngList: {
    name: 'valChngList',
    array: ['Value 1', 'Value 2']
  },
  valNoteList: {
    name: 'valNoteList',
    array: <SelectList numbers={valNoteArray} />
  },
  valPtchList: {
    name: 'valPtchList',
    array: <SelectList numbers={valPtchArray} />
  },
  valDeftList: {
    name: 'valDeftList',
    array: <SelectList numbers={valDeftArray} />
  },
  valNoneList: { name: 'valNoneList', array: <option>N/A</option> },
  allNoteList: {
    name: 'allNoteList',
    array: <SelectList numbers={allNoteArray} />
  }
}
