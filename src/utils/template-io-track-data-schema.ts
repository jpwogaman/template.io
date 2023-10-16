export type FileData = {
  fileMetaData: FileMetaData
  items: FileItems[]
}

export type FileMetaData = {
  fileName: string
  createdAt: Date
  updatedAt: Date
  defaultColors: string[]
  layouts: Layouts[]
  vepTemplate: string
  dawTemplate: string
}

export type Layouts = {
  label:
    | 'Tracks'
    | 'Instrument Ranges'
    | 'Articulations (Switch)'
    | 'Articulations (Toggle)'
    | 'Faders'
  title?: 'fullRange' | 'artList' | 'artListSwitch' | 'fadList'
  layout?: 'table' | 'cards'
  keys: LayoutKeys[]
}

export type LayoutKeys = {
  label?: string
  key:
    | 'itemId'
    | 'locked'
    | 'name'
    | 'channel'
    | 'baseDelay'
    | 'avgDelay'
    | 'color'
  //| 'fullRange'
  //| 'artListTog'
  //| 'artListSwitch'
  //| 'fadList'
  show: boolean
  className: string
  input?: 'text' | 'select' | 'checkbox'
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
}

export type FileItems = {
  itemId: string
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
  rangeId: string
  name: string
  low?: string | number
  high?: string | number
  whiteKeysOnly: boolean | number
}

export type ItemsArtListTog = {
  artId: string
  name?: string
  toggle: boolean | number
  codeType?: string | number
  code?: string | number
  on?: string | number
  off?: string | number
  default?: string | number
  delay?: string | number
  changeType?: string | number
  ranges: ItemsFullRanges['rangeId'][]
}

export type ItemsArtListSwitch = {
  artId: string
  name?: string
  toggle: boolean | number
  codeType?: string | number
  code?: string | number
  on?: string | number
  off?: string | number
  default?: boolean | string | number
  delay?: string | number
  changeType?: string | number
  ranges: ItemsFullRanges['rangeId'][]
}

export type ItemsFadList = {
  fadId: string
  name?: string
  codeType?: string | number
  code?: string | number
  default?: string | number
  changeType?: string | number
}
