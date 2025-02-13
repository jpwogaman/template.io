export * from './input-checkbox-switch'
export * from './input-checkbox'
export * from './input-select-multiple'
export * from './input-select-single'
export * from './input-text'
export * from './input-text-rich'
export * from './input-color-picker'

import { type ReactNode, type ChangeEvent } from 'react'

import {
  type FullTrackForExport,
  type FullTrackCounts,
  type ItemsFullRanges,
  type ItemsArtLayers,
  type ItemsArtListTap,
  type ItemsArtListTog,
  type ItemsFadList,
  type FileItem
} from '@/components/backendCommands/backendCommands'

import {
  type FileItemId,
  type SubItemId,
  type SelectValuesKeys
} from '@/components/context'

export type layoutDataArray =
  | ItemsFullRanges[]
  | ItemsArtListTog[]
  | ItemsArtListTap[]
  | ItemsArtLayers[]
  | ItemsFadList[]

export type layoutDataSingle =
  | ItemsFullRanges
  | ItemsArtListTog
  | ItemsArtListTap
  | ItemsArtLayers
  | ItemsFadList

export type layoutDataSingleKeys =
  | keyof ItemsFullRanges
  | keyof ItemsArtLayers
  | keyof ItemsArtListTap
  | keyof ItemsArtListTog
  | keyof ItemsFadList

export type LayoutDataSingleHelper<T extends keyof FullTrackCounts> =
  T extends keyof FullTrackForExport
    ? FullTrackForExport[T] extends Array<infer U>
      ? keyof U
      : keyof FullTrackForExport[T]
    : never

export type ChangeEventHelper = ChangeEvent<
  HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement
>
export type OnChangeHelperArgsType = {
  newValue?: string | number | boolean
  layoutDataSingleId?: FileItemId | SubItemId
  key: layoutDataSingleKeys | keyof FileItem
  label?: keyof FullTrackCounts
}

export type InputComponentProps = {
  id: string
  toggle?: boolean
  codeDisabled?: boolean
  codeFullLocked: boolean
  defaultValue?: string | number | boolean
  placeholder?: string | number
  options?: SelectValuesKeys
  children?: ReactNode
  isSelectedItem?: boolean
  onChangeFunction: (event: ChangeEventHelper) => void
}
