use crate::{
  models::{
    fileitem::{ FileItem, FileItemRequest },
    items_full_ranges::ItemsFullRanges,
    items_fadlist::ItemsFadList,
    items_artlist_tog::ItemsArtListTog,
    items_artlist_tap::ItemsArtListTap,
    items_art_layers::ItemsArtLayers,
  },
  services::{
    fileitem_service,
    items_full_ranges_service,
    items_fadlist_service,
    items_artlist_tog_service,
    items_artlist_tap_service,
    items_art_layers_service,
  },
};

#[tauri::command]
pub fn list_fileitems() -> Vec<FileItem> {
  fileitem_service::list_fileitems()
}

#[tauri::command]
pub fn list_fileitems_and_relations() -> Vec<fileitem_service::FullTrackListForExport> {
  fileitem_service::list_fileitems_and_relations()
}

#[tauri::command]
pub fn list_fileitems_and_relation_counts() -> Vec<fileitem_service::FullTrackListWithCounts> {
  fileitem_service::list_fileitems_and_relation_counts()
}

#[tauri::command]
pub fn get_fileitem(id: String) -> Option<FileItem> {
  fileitem_service::get_fileitem(id)
}

#[tauri::command]
pub fn get_fileitem_and_relations(
  id: String
) -> Option<fileitem_service::FullTrackListForExport> {
  fileitem_service::get_fileitem_and_relations(id)
}

#[tauri::command]
pub fn create_fileitem(count: i32) {
  // id's are T_0, T_1, T_2, etc. so we need to find the highest id and increment it
  let fileitems = fileitem_service::list_fileitems();

  fn find_highest_id(fileitems: &Vec<FileItem>) -> i32 {
    let mut highest_id = 0;
    for fileitem in fileitems {
      let id = fileitem.id.split("_").nth(1).unwrap().parse::<i32>().unwrap();
      if id > highest_id {
        highest_id = id;
      }
    }
    highest_id
  }

  let mut i = 0;
  while i < count {
    let new_id = find_highest_id(&fileitems) + 1 + i;

    let fileitem = FileItem {
      id: format!("T_{}", new_id),
      locked: false,
      name: "".to_string(),
      notes: "".to_string(),
      channel: 1,
      base_delay: 0.0,
      avg_delay: 0.0,
      vep_out: "N/A".to_string(),
      vep_instance: "N/A".to_string(),
      smp_number: "N/A".to_string(),
      smp_out: "N/A".to_string(),
      color: "#71717A".to_string(),
    };

    fileitem_service::store_new_item(&fileitem);

    let default_full_range = ItemsFullRanges {
      id: format!("T_{}_FR_0", new_id),
      name: "".to_string(),
      low: "C-2".to_string(),
      high: "B8".to_string(),
      white_keys_only: false,
      fileItemsItemId: format!("T_{}", new_id),
    };

    items_full_ranges_service::store_new_full_range(&default_full_range);

    let default_fad = ItemsFadList {
      id: format!("T_{}_FL_0", new_id),
      name: "".to_string(),
      code_type: "/control".to_string(),
      code: 0,
      default: 0,
      change_type: "Value 2".to_string(),
      fileItemsItemId: format!("T_{}", new_id),
    };

    items_fadlist_service::store_new_fad(&default_fad);

    let default_art_tog = ItemsArtListTog {
      id: format!("T_{}_AT_0", new_id),
      name: "".to_string(),
      toggle: true,
      code_type: "/control".to_string(),
      code: 0,
      on: 127,
      off: 0,
      default: "On".to_string(),
      delay: 0,
      change_type: "Value 2".to_string(),
      ranges: format!("[\"T_{}_FR_0\"]", new_id),
      art_layers: "[\"\"]".to_string(),
      fileItemsItemId: format!("T_{}", new_id),
    };

    items_artlist_tog_service::store_new_art_tog(&default_art_tog);

    let default_art_tap = ItemsArtListTap {
      id: format!("T_{}_AT_1", new_id),
      name: "".to_string(),
      toggle: false,
      code_type: "/control".to_string(),
      code: 0,
      on: 127,
      off: 0,
      default: false,
      delay: 0,
      change_type: "Value 2".to_string(),
      ranges: format!("[\"T_{}_FR_0\"]", new_id),
      art_layers: "[\"\"]".to_string(),
      fileItemsItemId: format!("T_{}", new_id),
    };

    items_artlist_tap_service::store_new_art_tap(&default_art_tap);

    let default_art_layer = ItemsArtLayers {
      id: format!("T_{}_AL_0", new_id),
      name: "".to_string(),
      code_type: "/control".to_string(),
      code: 0,
      on: 127,
      off: 0,
      default: "Off".to_string(),
      change_type: "Value 2".to_string(),
      fileItemsItemId: format!("T_{}", new_id),
    };

    items_art_layers_service::store_new_art_layer(&default_art_layer);

    i += 1;
  }
}

#[tauri::command]
pub fn delete_fileitem(id: String) {
  fileitem_service::delete_fileitem(id)
}

#[tauri::command]
pub fn clear_fileitem(id: String) {
  fileitem_service::clear_fileitem(id);
}

#[tauri::command]
pub fn update_fileitem(data: FileItemRequest) {
  fileitem_service::update_fileitem(data);
}

#[tauri::command]
pub fn delete_fileitem_and_relations(id: String) {
  fileitem_service::delete_fileitem_and_relations(id)
}

#[tauri::command]
pub fn delete_all_fileitems_and_relations() {
  fileitem_service::delete_all_fileitems_and_relations();
}
