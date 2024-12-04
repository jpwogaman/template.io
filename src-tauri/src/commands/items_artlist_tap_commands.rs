use crate::{
  models::items_artlist_tap::{ ItemsArtListTap, ItemsArtListTapRequest },
  services::items_artlist_tap_service,
};

#[tauri::command]
pub fn list_items_artlist_tap(fileItemsItemId: String) -> Vec<ItemsArtListTap> {
  items_artlist_tap_service::list_items_artlist_tap(fileItemsItemId)
}

#[tauri::command]
pub fn get_art_tap(id: String) -> Option<ItemsArtListTap> {
  items_artlist_tap_service::get_art_tap(id)
}

#[tauri::command]
pub fn create_art_tap(fileItemsItemId: String, count: i32) {
  // id's are T_0_FR_0, T_0_FR_1, T_0_FR_2, etc. so we need to find the highest id and increment it
  let items_artlist_tap = items_artlist_tap_service::list_items_artlist_tap(
    fileItemsItemId.clone()
  );

  fn find_highest_id(items_artlist_tap: &Vec<ItemsArtListTap>) -> i32 {
    let mut highest_id = 0;
    for items_art_tap in items_artlist_tap {
      let id = items_art_tap.id.split("_").nth(3).unwrap().parse::<i32>().unwrap();
      if id > highest_id {
        highest_id = id;
      }
    }
    highest_id
  }

  let mut i = 0;
  while i < count {
    let new_id = find_highest_id(&items_artlist_tap) + 1 + i;

    let art = ItemsArtListTap {
      id: format!("{}_AT_{}", fileItemsItemId.clone(), new_id),
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
      fileItemsItemId: fileItemsItemId.clone(),
    };

    items_artlist_tap_service::store_new_art_tap(&art);
    i += 1;
  }
}

#[tauri::command]
pub fn delete_art_tap(id: String) {
  items_artlist_tap_service::delete_art_tap(id)
}

#[tauri::command]
pub fn update_art_tap(data: ItemsArtListTapRequest) {
  items_artlist_tap_service::update_art_tap(data);
}
