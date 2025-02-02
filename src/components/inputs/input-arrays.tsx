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

export const selectArrays = {
  setOutsList: <SelectList numbers={setOutsArray} />,
  setNoteList: <SelectList numbers={setNoteArray} />,
  chnMidiList: <SelectList numbers={chnMidiArray} />,
  smpTypeList: <SelectList numbers={smpTypeArray} />,
  smpOutsList: <SelectList numbers={smpOutsArray} />,
  vepOutsList: <SelectList numbers={vepOutsArray} />,
  vepInstList: <SelectList numbers={vepInstanceArray} />,
  valAddrList: <SelectList valName={valAddrArray} />,
  valMidiList: <SelectList numbers={valMidiArray} />,
  valChngList: ['Value 1', 'Value 2'],
  valNoteList: <SelectList numbers={valNoteArray} />,
  valPtchList: <SelectList numbers={valPtchArray} />,
  valDeftList: <SelectList numbers={valDeftArray} />,
  valNoneList: <option>N/A</option>,
  allNoteList: <SelectList numbers={allNoteArray} />,
  artRngsArray: <option>FIX ME</option>,
  artLayersArray: <option>FIX ME</option>
} as const

export type selectArray = typeof selectArrays