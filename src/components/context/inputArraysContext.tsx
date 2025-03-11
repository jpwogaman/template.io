'use client'

import React, {
  createContext,
  useContext,
  useState,
  type FC,
  type ReactNode,
  useMemo,
  type Dispatch,
  type SetStateAction,
  useLayoutEffect,
  useCallback
} from 'react'
import { useSelectedItem } from './selectedItemContext'
import { useMutations } from './mutationContext'

const generateAllNotesArray = (MiddleC: { bottom: number; top: number }) => {
  const arr = []
  for (let i = MiddleC.bottom; i < MiddleC.top; i++) {
    arr.push(
      `C${i}`,
      `C#${i}`,
      `D${i}`,
      `D#${i}`,
      `E${i}`,
      `F${i}`,
      `F#${i}`,
      `G${i}`,
      `G#${i}`,
      `A${i}`,
      `A#${i}`,
      `B${i}`
    )
  }
  return arr
}

const generateValNotesArray = (allNotesArray: string[]) => {
  const arr = []
  for (let i = 0; i <= 127; i++) {
    arr.push(i + ' / ' + allNotesArray[i])
  }
  return arr
}

const generateNumberArray = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => i + start)

const generateSmpOutsArray = (smpOutSettings: number) => {
  const arr = ['N/A']
  for (let i = 1; i < smpOutSettings; i += 2) {
    arr.push(`${i}/${i + 1}`)
  }
  return arr
}

const generateVepOutsArray = (vepOutSettings: number) => {
  const arr = ['N/A']
  for (let i = 1; i < vepOutSettings; i += 2) {
    arr.push(`${i}/${i + 1}`)
  }
  return arr
}

const smpTypeList = [
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

const vepInstList = [
  'N/A',
  'Strings',
  'Percussion + Pianos',
  'Brass',
  'Woodwinds'
]

const valAddrList = [
  '/control---Control Code',
  '/note---Note',
  '/program---Program Change',
  '/pitch---Pitch Wheel',
  '/sysex---Sysex',
  '/mtc---MTC',
  '/channel_pressure---Channel Pressure',
  '/key_pressure---Polyphonic Key Pressure'
]

const valDeftList = ['On', 'Off']
const setNoteList = [
  'Middle C (60) = C5',
  'Middle C (60) = C4',
  'Middle C (60) = C3'
]

export type SelectValuesKeys =
  | 'setOutsList'
  | 'setNoteList'
  | 'chnMidiList'
  | 'smpTypeList'
  | 'smpOutsList'
  | 'vepOutsList'
  | 'vepInstList'
  | 'valAddrList'
  | 'valMidiList'
  | 'valNoteList'
  | 'valPtchList'
  | 'valDeftList'
  | 'valChngList'
  | 'allNoteList'
  | 'valNoneList'
  | 'artRngsArray'
  | 'artLayersArray'

interface SelectArraysContextType {
  selectValues: Record<SelectValuesKeys, string[] | number[]>
  setSelectValues: Dispatch<
    SetStateAction<Record<SelectValuesKeys, string[] | number[]>>
  >
  getSelectList: (name: SelectValuesKeys) => React.JSX.Element | undefined
}

const selectArraysContextDefaultValues: SelectArraysContextType = {
  selectValues: {
    setOutsList: generateNumberArray(1, 128),
    setNoteList,
    chnMidiList: generateNumberArray(1, 16),
    smpTypeList,
    smpOutsList: generateSmpOutsArray(32),
    vepOutsList: generateVepOutsArray(128),
    vepInstList,
    valAddrList,
    valMidiList: generateNumberArray(0, 127),
    valNoteList: generateValNotesArray(
      generateAllNotesArray({ bottom: -2, top: 9 })
    ),
    valPtchList: generateNumberArray(0, 16383),
    valDeftList,
    valChngList: ['Value 1', 'Value 2'],
    allNoteList: generateAllNotesArray({ bottom: -2, top: 9 }),
    valNoneList: ['N/A'],
    artRngsArray: ['N/A'],
    artLayersArray: ['N/A']
  },
  setSelectValues: () => undefined,
  getSelectList: () => undefined
}

const SelectArraysContext = createContext<SelectArraysContextType>(
  selectArraysContextDefaultValues
)

interface SelectArraysContextProps {
  children: ReactNode
}

export const SelectArraysProvider: FC<SelectArraysContextProps> = ({
  children
}) => {
  const { settings } = useSelectedItem()
  const { selectedItem } = useMutations()

  const [selectValues, setSelectValues] = useState<
    SelectArraysContextType['selectValues']
  >(selectArraysContextDefaultValues.selectValues)

  useLayoutEffect(() => {
    setSelectValues((prev) => ({
      ...prev,
      smpOutsArray: generateSmpOutsArray(settings.smp_out_settings),
      vepOutsArray: generateVepOutsArray(settings.vep_out_settings)
    }))
  }, [settings.smp_out_settings, settings.vep_out_settings])

  useLayoutEffect(() => {
    if (!selectedItem) return
    setSelectValues((prev) => ({
      ...prev,
      artRngsArray: selectedItem.full_ranges.map((range) => range.id),
      artLayersArray: selectedItem.art_layers.map((layer) => layer.id)
    }))
  }, [selectedItem])

  const getSelectList = useCallback(
    (name: SelectValuesKeys) => {
      const values = selectValues[name]

      const shortenedSubItemId = (initialId: string) => {
        return `${initialId.split('_')[2]}_${parseInt(
          initialId.split('_')[3]!
        )}`
      }

      const useShortId = name === 'artLayersArray' || name === 'artRngsArray'

      return (
        <>
          {values?.map((value, index) => {
            return (
              <option
                key={`${value}_${index}`}
                title={value.toString()}
                value={
                  value.toString().includes('---')
                    ? value.toString().split('---')[0]
                    : value.toString()
                }>
                {value.toString().includes('---')
                  ? value.toString().split('---')[1]
                  : useShortId
                    ? shortenedSubItemId(value.toString())
                    : value}
              </option>
            )
          })}
        </>
      )
    },
    [selectValues]
  )

  const value = useMemo(
    () => ({
      selectValues,
      setSelectValues,
      getSelectList
    }),
    [selectValues, setSelectValues, getSelectList]
  )

  return (
    <SelectArraysContext.Provider value={value}>
      {children}
    </SelectArraysContext.Provider>
  )
}

export const useSelectArraysContext = () => {
  return useContext(SelectArraysContext)
}
