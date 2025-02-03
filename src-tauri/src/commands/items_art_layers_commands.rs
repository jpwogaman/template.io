use crate::{
  models::items_art_layers::{
    ItemsArtLayers,
    ItemsArtLayersRequest,
    init_art_layer,
  },
  services::{ items_art_layers_service, settings_services::{ Settings } },
};

#[tauri::command]
#[specta::specta]
pub fn create_art_layer(fileitems_item_id: String) {
  let settings = Settings::get();

  // id's are T_0_FR_0, T_0_FR_1, T_0_FR_2, etc. so we need to find the highest id and increment it
  let items_art_layers = items_art_layers_service::list_items_art_layers(
    fileitems_item_id.clone()
  );

  fn find_highest_id(items_art_layers: &Vec<ItemsArtLayers>) -> i32 {
    let mut highest_id = 0;
    if items_art_layers.len() < 1 {
      return -1;
    }
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

  let count = if items_art_layers.len() < 1 {
    settings.default_art_layer_count as i32
  } else {
    settings.sub_item_add_count as i32
  };

  let mut i = 0;
  while i < count {
    let new_id = find_highest_id(&items_art_layers) + 1 + i;
    let layer = init_art_layer(fileitems_item_id.clone(), new_id.to_string());
    items_art_layers_service::store_new_art_layer(&layer);
    i += 1;
  }
}

#[tauri::command]
#[specta::specta]
pub fn delete_art_layer_by_fileitem(
  id: String,
  fileitems_item_id: String
) -> Result<(), String> {
  match
    items_art_layers_service::delete_art_layer_by_fileitem(
      id.clone(),
      fileitems_item_id.clone()
    )
  {
    Ok(_) => { 
      items_art_layers_service::renumber_art_layers(fileitems_item_id);
      Ok(()) }
    Err(err) => {
      println!("Error: {}", err);
      Err(err.to_string())
    }
  }
}

#[tauri::command]
#[specta::specta]
pub fn update_art_layer(data: ItemsArtLayersRequest) {
  items_art_layers_service::update_art_layer(data);
}
