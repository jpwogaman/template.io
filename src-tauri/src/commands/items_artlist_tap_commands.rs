use crate::{
  models::items_artlist_tap::{ ItemsArtListTap, ItemsArtListTapRequest },
  services::{items_artlist_tog_service, items_artlist_tap_service, items_artlist_service},
};

#[tauri::command]
pub fn list_items_artlist_tap(fileitems_item_id: String) -> Vec<ItemsArtListTap> {
  items_artlist_tap_service::list_items_artlist_tap(fileitems_item_id)
}

#[tauri::command]
pub fn get_art_tap(id: String) -> Option<ItemsArtListTap> {
  items_artlist_tap_service::get_art_tap(id)
}

#[tauri::command]
pub fn create_art_tap(fileitems_item_id: String, count: i32) {
  // id's are T_0_FR_0, T_0_FR_1, T_0_FR_2, etc. so we need to find the highest id and increment it
  let items_artlist_tog_len = items_artlist_tog_service::list_items_artlist_tog(
    fileitems_item_id.clone()
  ).len();

  let items_artlist_tap_len = items_artlist_tap_service::list_items_artlist_tap(
    fileitems_item_id.clone()
  ).len();

  let mut i = 0;
  while i < count {
    let new_id = items_artlist_tog_len + items_artlist_tap_len + i as usize;

    let art = ItemsArtListTap {
      id: format!("{}_AT_{}", fileitems_item_id.clone(), new_id),
      name: "".to_string(),
      toggle: false,
      code_type: "/control".to_string(),
      code: 0,
      on: 127,
      off: 0,
      default: false,
      delay: 0,
      change_type: "Value 2".to_string(),
      ranges: format!("[\"{}_FR_0\"]", new_id),
      art_layers: "[\"\"]".to_string(),
      fileitems_item_id: fileitems_item_id.clone(),
    };

    items_artlist_tap_service::store_new_art_tap(&art);
    i += 1;
  }

  items_artlist_service::renumber_all_arts(fileitems_item_id.clone());
}

#[tauri::command]
pub fn delete_art_tap(id: String) {
  items_artlist_tap_service::delete_art_tap(id)
}

#[tauri::command]
pub fn delete_art_tap_by_fileitem(id: String, fileitems_item_id: String) {
  items_artlist_tap_service::delete_art_tap_by_fileitem(id, fileitems_item_id)
}

#[tauri::command]
pub fn update_art_tap(data: ItemsArtListTapRequest) {
  items_artlist_tap_service::update_art_tap(data);
}
