//copy this into backendCommands.ts if it gets overwritten. the goal is to have all of the types from selectedItemContext.tsx configured on the rust side and brought in through the specta exporter.

//currently in from selectedItemContext.tsx
//export type FileItemId = `T_${number}`
//export type SubItemInnerString = 'FR' | 'AT' | 'AL' | 'FL'
//export type SubItemId<T extends FileItemId> =
//  | `${T}_${SubItemInnerString}_${number}`
//  | `${T}_notes`

//export type Settings = {
//  vep_out_settings: number
//  smp_out_settings: number
//  default_range_count: number
//  default_art_tog_count: number
//  default_art_tap_count: number
//  default_art_layer_count: number
//  default_fad_count: number
//  track_add_count: number
//  sub_item_add_count: number
//  selected_item_id: FileItemId
//  selected_sub_item_id: SubItemId<FileItemId>
//  previous_item_id?: string | null
//  next_item_id?: string | null
//}

//import { type FileItemId, type SubItemId } from '../context'
