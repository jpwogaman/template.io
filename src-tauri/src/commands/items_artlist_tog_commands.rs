use crate::{
  models::items_artlist_tog::{ ItemsArtListTog, ItemsArtListTogRequest },
  services::items_artlist_tog_service,
};

#[tauri::command]
pub fn list_items_artlist_tog(fileItemsItemId: String) -> Vec<ItemsArtListTog> {
  items_artlist_tog_service::list_items_artlist_tog(fileItemsItemId)
}

#[tauri::command]
pub fn get_art_tog(id: String) -> Option<ItemsArtListTog> {
  items_artlist_tog_service::get_art_tog(id)
}

#[tauri::command]
pub fn create_art_tog(fileItemsItemId: String, count: i32) {
  // id's are T_0_FR_0, T_0_FR_1, T_0_FR_2, etc. so we need to find the highest id and increment it
  let items_artlist_tog = items_artlist_tog_service::list_items_artlist_tog(
    fileItemsItemId.clone()
  );

  fn find_highest_id(items_artlist_tog: &Vec<ItemsArtListTog>) -> i32 {
    let mut highest_id = 0;
    for items_art_tog in items_artlist_tog {
      let id = items_art_tog.id.split("_").nth(3).unwrap().parse::<i32>().unwrap();
      if id > highest_id {
        highest_id = id;
      }
    }
    highest_id
  }

  let mut i = 0;
  while i < count {
    let new_id = find_highest_id(&items_artlist_tog) + 1 + i;
    
    let art = ItemsArtListTog {
      id: format!("{}_AT_{}", fileItemsItemId.clone(), new_id),
      name: "".to_string(),
      toggle: true,
      code_type: "/control".to_string(),
      code: 0,
      on: 127,
      off: 0,
      default: "On".to_string(),
      delay: 0,
      change_type: "Value 2".to_string(),
      ranges: "".to_string(),
      art_layers: "".to_string(),
      fileItemsItemId: fileItemsItemId.clone(),
    };

    items_artlist_tog_service::store_new_art_tog(&art);
    i += 1;
  }
}

#[tauri::command]
pub fn delete_art_tog(id: String) {
  items_artlist_tog_service::delete_art_tog(id)
}

#[tauri::command]
pub fn update_art_tog(data: ItemsArtListTogRequest) {
  items_artlist_tog_service::update_art_tog(data);
}
