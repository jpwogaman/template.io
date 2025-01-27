use crate::{
  models::items_full_ranges::{ ItemsFullRanges, ItemsFullRangesRequest, init_full_range },
  services::{ items_full_ranges_service, settings_services::{ Settings } },
};

#[tauri::command]
#[specta::specta]
pub fn create_full_range(fileitems_item_id: String) {
  let settings = Settings::get();
  // id's are T_0_FR_0, T_0_FR_1, T_0_FR_2, etc. so we need to find the highest id and increment it
  let items_full_ranges = items_full_ranges_service::list_items_full_ranges(
    fileitems_item_id.clone()
  );

  fn find_highest_id(items_full_ranges: &Vec<ItemsFullRanges>) -> i32 {
    let mut highest_id = 0;
    if items_full_ranges.len() < 1 {
      return -1;
    }

    for items_full_range in items_full_ranges {
      let id = items_full_range.id
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

  let count = if items_full_ranges.len() < 1 {
    settings.default_range_count as i32
  } else {
    settings.sub_item_add_count as i32
  };

  let mut i = 0;
  while i < count {
    let new_id = find_highest_id(&items_full_ranges) + 1 + i;
    let full_range = init_full_range(fileitems_item_id.clone(), new_id.to_string());
    items_full_ranges_service::store_new_full_range(&full_range);

    i += 1;
  }
}

#[tauri::command]
#[specta::specta]
pub fn delete_full_range_by_fileitem(id: String, fileitems_item_id: String) {
  items_full_ranges_service::delete_full_range_by_fileitem(
    id,
    fileitems_item_id
  )
}

#[tauri::command]
#[specta::specta]
pub fn update_full_range(data: ItemsFullRangesRequest) {
  items_full_ranges_service::update_full_range(data);
}
