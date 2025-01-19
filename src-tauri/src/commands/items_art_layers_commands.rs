use crate::{
  models::items_art_layers::{ ItemsArtLayers, ItemsArtLayersRequest },
  services::items_art_layers_service,
};

#[tauri::command]
#[specta::specta]
pub fn list_items_art_layers(fileitems_item_id: String) -> Vec<ItemsArtLayers> {
  items_art_layers_service::list_items_art_layers(fileitems_item_id)
}

#[tauri::command]
#[specta::specta]
pub fn get_art_layer(id: String) -> Option<ItemsArtLayers> {
  items_art_layers_service::get_art_layer(id)
}

#[tauri::command]
#[specta::specta]
pub fn create_art_layer(fileitems_item_id: String, count: i32) {
  // id's are T_0_FR_0, T_0_FR_1, T_0_FR_2, etc. so we need to find the highest id and increment it
  let items_art_layers = items_art_layers_service::list_items_art_layers(
    fileitems_item_id.clone()
  );

  fn find_highest_id(items_art_layers: &Vec<ItemsArtLayers>) -> i32 {
    let mut highest_id = 0;
    for items_art_layer in items_art_layers {
      let id = items_art_layer.id
        .split("_")
        .nth(3)
        .unwrap()
        .parse::<i32>()
        .unwrap();
      if id > highest_id {
        highest_id = id;
      }
    }
    highest_id
  }

  let mut i = 0;
  while i < count {
    let new_id = find_highest_id(&items_art_layers) + 1 + i;

    let layer = ItemsArtLayers {
      id: format!("{}_AL_{}", fileitems_item_id.clone(), new_id),
      name: "".to_string(),
      code_type: "/control".to_string(),
      code: 0,
      on: 127,
      off: 0,
      default: "Off".to_string(),
      change_type: "Value 2".to_string(),
      fileitems_item_id: fileitems_item_id.clone(),
    };

    items_art_layers_service::store_new_art_layer(&layer);
    i += 1;
  }
}

#[tauri::command]
#[specta::specta]
pub fn delete_art_layer(id: String) {
  items_art_layers_service::delete_art_layer(id)
}

#[tauri::command]
#[specta::specta]
pub fn delete_art_layer_by_fileitem(id: String, fileitems_item_id: String) {
  items_art_layers_service::delete_art_layer_by_fileitem(id, fileitems_item_id)
}

#[tauri::command]
#[specta::specta]
pub fn update_art_layer(data: ItemsArtLayersRequest) {
  items_art_layers_service::update_art_layer(data);
}
