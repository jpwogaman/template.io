import { Dispatch, SetStateAction } from 'react'
import {
  FileItem,
  ItemsFullRanges,
  ItemsArtLayers,
  ItemsArtListTap,
  ItemsArtListTog,
  ItemsFadList
} from '../backendCommands/backendCommands'

export const initFileItemNoId: Omit<FileItem, 'id'> = {
  locked: false,
  name: '',
  notes: '',
  channel: 1,
  base_delay: 0.0,
  avg_delay: 0.0,
  vep_out: 'N/A',
  vep_instance: 'N/A',
  smp_number: 'N/A',
  smp_out: 'N/A',
  color: '#71717A'
}

export type itemInitKeys = keyof Omit<FileItem, 'id'>

export const initItemsFullRangesNoId: Omit<
  ItemsFullRanges,
  'id' | 'fileitems_item_id'
> = {
  name: '',
  low: 'C-2',
  high: 'G8',
  white_keys_only: false
}

export type rangeInitKeys = keyof Omit<
  ItemsFullRanges,
  'id' | 'fileitems_item_id'
>

export const initItemsArtListTogNoId: Omit<
  ItemsArtListTog,
  'id' | 'toggle' | 'fileitems_item_id'
> = {
  name: '',
  code_type: '/control',
  code: 0,
  on: 127,
  off: 0,
  default: 'On',
  delay: 0,
  change_type: 'Value 2',
  ranges: '["T_{}_FR_0"]',
  art_layers: '[""]'
}

export type artTogInitKeys = keyof Omit<
  ItemsArtListTog,
  'id' | 'toggle' | 'fileitems_item_id'
>

export const initItemsArtListTapNoId: Omit<
  ItemsArtListTap,
  'id' | 'toggle' | 'fileitems_item_id'
> = {
  name: '',
  code_type: '/control',
  code: 0,
  on: 127,
  off: 0,
  default: false,
  delay: 0,
  change_type: 'Value 2',
  ranges: '["T_{}_FR_0"]',
  art_layers: '[""]'
}

export type artTapInitKeys = keyof Omit<
  ItemsArtListTap,
  'id' | 'toggle' | 'fileitems_item_id'
>

export const initItemsArtLayersNoId: Omit<
  ItemsArtLayers,
  'id' | 'fileitems_item_id'
> = {
  name: '',
  code_type: '/control',
  code: 0,
  on: 127,
  off: 0,
  default: 'Off',
  change_type: 'Value 2'
}

export type artLayerInitKeys = keyof Omit<
  ItemsArtLayers,
  'id' | 'fileitems_item_id'
>

export const initItemsFadListNoId: Omit<
  ItemsFadList,
  'id' | 'fileitems_item_id'
> = {
  name: '',
  code_type: '/control',
  code: 0,
  default: 0,
  change_type: 'Value 2'
}

export type fadInitKeys = keyof Omit<ItemsFadList, 'id' | 'fileitems_item_id'>

export type itemInitKeyStringOrNumber = {
  id: string
  clearState: string
  setValue: Dispatch<SetStateAction<string | number>>
}

export const itemInitKeyStringOrNumber = ({
  id,
  clearState,
  setValue
}: itemInitKeyStringOrNumber) => {
  Object.keys(initFileItemNoId).forEach((key) => {
    if (
      typeof initFileItemNoId[key as itemInitKeys] !== 'string' &&
      typeof initFileItemNoId[key as itemInitKeys] !== 'number'
    ) {
      return
    }
    if (id.includes(clearState + '_' + key)) {
      setValue(initFileItemNoId[key as itemInitKeys] as unknown as string)
    }
  })
  /////
  Object.keys(initItemsFullRangesNoId).forEach((key) => {
    if (
      typeof initItemsFullRangesNoId[key as rangeInitKeys] !== 'string' &&
      typeof initItemsFullRangesNoId[key as rangeInitKeys] !== 'number'
    ) {
      return
    }
    if (id.includes(clearState + '_FR_') && id.includes(key)) {
      setValue(
        initItemsFullRangesNoId[key as rangeInitKeys] as unknown as string
      )
    }
  })
  /////
  Object.keys(initItemsArtListTogNoId).forEach((key) => {
    if (
      typeof initItemsArtListTogNoId[key as artTogInitKeys] !== 'string' &&
      typeof initItemsArtListTogNoId[key as artTogInitKeys] !== 'number'
    ) {
      return
    }
    if (id.includes(clearState + '_AT_') && id.includes(key)) {
      setValue(
        initItemsArtListTogNoId[key as artTogInitKeys] as unknown as string
        //.replace('{}', id)
      )
    }
  })
  /////
  Object.keys(initItemsArtListTapNoId).forEach((key) => {
    if (
      typeof initItemsArtListTapNoId[key as artTapInitKeys] !== 'string' &&
      typeof initItemsArtListTapNoId[key as artTapInitKeys] !== 'number'
    ) {
      return
    }
    if (id.includes(clearState + '_AT_') && id.includes(key)) {
      setValue(
        initItemsArtListTapNoId[key as artTapInitKeys] as unknown as string
        //.replace('{}', id)
      )
    }
  })
  /////
  Object.keys(initItemsArtLayersNoId).forEach((key) => {
    if (
      typeof initItemsArtLayersNoId[key as artLayerInitKeys] !== 'string' &&
      typeof initItemsArtLayersNoId[key as artLayerInitKeys] !== 'number'
    ) {
      return
    }
    if (id.includes(clearState + '_AL_') && id.includes(key)) {
      setValue(
        initItemsArtLayersNoId[key as artLayerInitKeys] as unknown as string
      )
    }
  })
  /////
  Object.keys(initItemsFadListNoId).forEach((key) => {
    if (
      typeof initItemsFadListNoId[key as fadInitKeys] !== 'string' &&
      typeof initItemsFadListNoId[key as fadInitKeys] !== 'number'
    ) {
      return
    }
    if (id.includes(clearState + '_FL_') && id.includes(key)) {
      setValue(initItemsFadListNoId[key as fadInitKeys] as unknown as string)
    }
  })
}

export type itemInitKeyBoolean = {
  id: string
  clearState: string
  setValue: Dispatch<SetStateAction<boolean>>
}

export const itemInitKeyBoolean = ({
  id,
  clearState,
  setValue
}: itemInitKeyBoolean) => {
  Object.keys(initFileItemNoId).forEach((key) => {
    if (typeof initFileItemNoId[key as itemInitKeys] !== 'boolean') {
      return
    }
    if (id.includes(clearState + '_' + key)) {
      setValue(initFileItemNoId[key as itemInitKeys] as unknown as boolean)
    }
  })
  /////
  Object.keys(initItemsFullRangesNoId).forEach((key) => {
    if (typeof initItemsFullRangesNoId[key as rangeInitKeys] !== 'boolean') {
      return
    }
    if (id.includes(clearState + '_FR_') && id.includes(key)) {
      setValue(
        initItemsFullRangesNoId[key as rangeInitKeys] as unknown as boolean
      )
    }
  })
  /////
  Object.keys(initItemsArtListTogNoId).forEach((key) => {
    if (typeof initItemsArtListTogNoId[key as artTogInitKeys] !== 'boolean') {
      return
    }
    if (id.includes(clearState + '_AT_') && id.includes(key)) {
      setValue(
        initItemsArtListTogNoId[key as artTogInitKeys] as unknown as boolean
      )
    }
  })
  /////
  Object.keys(initItemsArtListTapNoId).forEach((key) => {
    if (typeof initItemsArtListTapNoId[key as artTapInitKeys] !== 'boolean') {
      return
    }

    if (id.includes(clearState + '_AT_') && id.includes(key)) {
      setValue(
        initItemsArtListTapNoId[key as artTapInitKeys] as unknown as boolean
      )
    }
  })
  /////
  Object.keys(initItemsArtLayersNoId).forEach((key) => {
    if (typeof initItemsArtLayersNoId[key as artLayerInitKeys] !== 'boolean') {
      return
    }
    if (id.includes(clearState + '_AL_') && id.includes(key)) {
      setValue(
        initItemsArtLayersNoId[key as artLayerInitKeys] as unknown as boolean
      )
    }
  })
  /////
  Object.keys(initItemsFadListNoId).forEach((key) => {
    if (typeof initItemsFadListNoId[key as fadInitKeys] !== 'boolean') {
      return
    }
    if (id.includes(clearState + '_FL_') && id.includes(key)) {
      setValue(initItemsFadListNoId[key as fadInitKeys] as unknown as boolean)
    }
  })
}
