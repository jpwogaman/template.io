type Prettify<T> = { [K in keyof T]: T[K] } & object

type FileItem = {
  id: string
  locked: boolean
  name: string
  notes: string
  channel: number
  base_delay: number
  avg_delay: number
  vep_out: string
  vep_instance: string
  smp_number: string
  smp_out: string
  color: string
}

type FileItemRequest = {
  id: string
  locked?: boolean
  name?: string
  notes?: string
  channel?: number
  base_delay?: number
  avg_delay?: number
  vep_out?: string
  vep_instance?: string
  smp_number?: string
  smp_out?: string
  color?: string
}

// old getSingleItem
type FullTrackForExport = Prettify<
  FileItem & {
    full_ranges: Items_Full_Ranges[]
    art_list_tog: Items_ArtList_Tog[]
    art_list_tap: Items_ArtList_Tap[]
    art_layers: Items_Art_Layers[]
    fad_list: Items_FadList[]
  }
>

type FullTrackListForExport = {
  file_meta_data: any
  items: FullTrackForExport[]
}

type FullTrackCounts = {
  art_list_tog: number
  art_list_tap: number
  art_layers: number
  fad_list: number
  full_ranges: number
}

// old getAllItems = FullTrackWithCounts[]
type FullTrackWithCounts = Prettify<FileItem & { _count: FullTrackCounts }>
