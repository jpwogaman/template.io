use crate::{
  models::{
    fileitem::{ FileItem, FileItemRequest },
    items_full_ranges::ItemsFullRanges,
    items_fadlist::ItemsFadList,
  },
  services::{
    fileitem_service,
    items_full_ranges_service,
    items_fadlist_service,
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
pub fn get_fileitem(id: String) -> Option<FileItem> {
  fileitem_service::get_fileitem(id)
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
      low: "".to_string(),
      high: "".to_string(),
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

    i += 1;
  }
}

#[tauri::command]
pub fn delete_fileitem(id: String) {
  fileitem_service::delete_fileitem(id)
}

#[tauri::command]
pub fn update_fileitem(data: FileItemRequest) {
  fileitem_service::update_fileitem(data);
}
