use crate::{
  models::items_artlist_tog::{ ItemsArtListTogRequest, init_art_tog },
  services::{
    items_artlist_tog_service,
    items_artlist_tap_service,
    items_artlist_service,
    settings_services::{ Settings },
  },
};

#[tauri::command]
#[specta::specta]
pub fn create_art_tog(fileitems_item_id: String) {
  let settings = Settings::get();

  // id's are T_0_FR_0, T_0_FR_1, T_0_FR_2, etc. so we need to find the highest id and increment it
  let items_artlist_tog_len = items_artlist_tog_service
    ::list_items_artlist_tog(fileitems_item_id.clone())
    .len();

  let items_artlist_tap_len = items_artlist_tap_service
    ::list_items_artlist_tap(fileitems_item_id.clone())
    .len();

  let count = if items_artlist_tog_len < 1 {
    settings.default_art_tog_count as i32
  } else {
    settings.sub_item_add_count as i32
  };

  let mut i = 0;
  while i < count {
    let new_id = if items_artlist_tog_len < 1 && items_artlist_tap_len < 1 {
      -1 + i
    } else {
      (items_artlist_tog_len + items_artlist_tap_len + (i as usize)) as i32
    };

    let art = init_art_tog(fileitems_item_id.clone(), new_id.to_string());
    items_artlist_tog_service::store_new_art_tog(&art);
    i += 1;
  }

  items_artlist_service::renumber_all_arts(fileitems_item_id.clone());
}

#[tauri::command]
#[specta::specta]
pub fn delete_art_tog_by_fileitem(
  id: String,
  fileitems_item_id: String
) -> Result<(), String> {
  match
    items_artlist_tog_service::delete_art_tog_by_fileitem(
      id,
      fileitems_item_id.clone()
    )
  {
    Ok(_) => {
      items_artlist_service::renumber_all_arts(fileitems_item_id);
      Ok(())
    }
    Err(err) => {
      println!("Error: {}", err);
      Err(err.to_string())
    }
  }
}

#[tauri::command]
#[specta::specta]
pub fn update_art_tog(data: ItemsArtListTogRequest) {
  items_artlist_tog_service::update_art_tog(data.clone());
  let original_art_tog = items_artlist_tog_service
    ::get_art_tog(data.id.clone())
    .unwrap();

  let fileitems_item_id = original_art_tog.fileitems_item_id.clone();
  items_artlist_service::get_avg_delay(fileitems_item_id, None);
}
