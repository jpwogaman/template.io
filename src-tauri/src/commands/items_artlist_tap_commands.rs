use crate::{
  models::items_artlist_tap::{ ItemsArtListTapRequest, init_art_tap },
  services::{
    items_artlist_tog_service,
    items_artlist_tap_service,
    items_artlist_service,
    settings_services::{ Settings },
  },
};

#[tauri::command]
#[specta::specta]
pub fn create_art_tap(fileitems_item_id: String) {
  let settings = Settings::get();

  // id's are T_0_FR_0, T_0_FR_1, T_0_FR_2, etc. so we need to find the highest id and increment it
  let items_artlist_tog_len = items_artlist_tog_service
    ::list_items_artlist_tog(fileitems_item_id.clone())
    .len();

  let items_artlist_tap_len = items_artlist_tap_service
    ::list_items_artlist_tap(fileitems_item_id.clone())
    .len();

  let count = if items_artlist_tap_len < 1 {
    settings.default_art_tap_count as i32
  } else {
    settings.sub_item_add_count as i32
  };

  let mut first_art_default = if items_artlist_tap_len < 1 {
    true
  } else {
    false
  };

  let mut i = 0;
  while i < count {
    let new_id = if items_artlist_tog_len < 1 && items_artlist_tap_len < 1 {
      -1 + i
    } else {
      (items_artlist_tog_len + items_artlist_tap_len + (i as usize)) as i32
    };

    let art = init_art_tap(
      fileitems_item_id.clone(),
      new_id.to_string(),
      first_art_default
    );
    items_artlist_tap_service::store_new_art_tap(&art);
    i += 1;
    first_art_default = false;
  }

  items_artlist_service::renumber_all_arts(fileitems_item_id.clone());
}

#[tauri::command]
#[specta::specta]
pub fn delete_art_tap_by_fileitem(
  id: String,
  fileitems_item_id: String
) -> Result<(), String> {
  match
    items_artlist_tap_service::delete_art_tap_by_fileitem(
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
pub fn update_art_tap(data: ItemsArtListTapRequest) {
  items_artlist_tap_service::update_art_tap(data);
}
