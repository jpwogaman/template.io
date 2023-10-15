export type FileData = {
  fileMetaData: FileMetaData
  items: FileItems[]
}

export type FileMetaData = {
  fileName: string
  createdOn: string | Date
  modifiedOn: string | Date
  defaultColors: string[]
  layouts: {
    label:
      | 'Tracks'
      | 'Instrument Ranges'
      | 'Articulations (Switch)'
      | 'Articulations (Toggle)'
      | 'Faders'
    title?: 'fullRange' | 'artList' | 'artListSwitch' | 'fadList'
    layout?: 'table' | 'cards'
    keys: {
      label: string
      key: string
      show: boolean
      className: string
      input?: 'text' | 'select'
      selectArray?:
        | 'setOutsList'
        | 'setNoteList'
        | 'chnMidiList'
        | 'smpTypeList'
        | 'smpOutsList'
        | 'vepOutsList'
        | 'valAddrList'
        | 'valMidiList'
        | 'valChngList'
        | 'valNoteList'
        | 'valPtchList'
        | 'valDeftList'
        | 'valNoneList'
        | 'allNoteList'
    }[]
  }[]
  vepTemplate: string
  dawTemplate: string
}

export type FileItems = {
  id: string
  locked: boolean | number
  name: string
  channel?: string | number
  baseDelay?: string | number
  avgDelay?: string | number
  color: string
  fullRange: ItemsFullRanges[]
  artListTog: ItemsArtListTog[]
  artListSwitch: ItemsArtListSwitch[]
  fadList: ItemsFadList[]
}

export type ItemsFullRanges = {
  id: string
  name: string
  low?: string | number
  high?: string | number
  whiteKeysOnly: boolean | number
}

export type ItemsArtListTog = {
  id: string
  name?: string
  toggle: boolean | number
  codeType?: string | number
  code?: string | number
  on?: string | number
  off?: string | number
  default?: string | number
  delay?: string | number
  changeType?: string | number
  ranges: ItemsFullRanges['id'][]
}

export type ItemsArtListSwitch = {
  id: string
  name?: string
  toggle: boolean | number
  codeType?: string | number
  code?: string | number
  on?: string | number
  off?: string | number
  default?: boolean | string | number
  delay?: string | number
  changeType?: string | number
  ranges: ItemsFullRanges['id'][]
}

export type ItemsFadList = {
  id: string
  name?: string
  codeType?: string | number
  code?: string | number
  default?: string | number
  changeType?: string | number
}
