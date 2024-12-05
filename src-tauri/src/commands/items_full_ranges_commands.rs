use crate::{
  models::items_full_ranges::{ ItemsFullRanges, ItemsFullRangesRequest },
  services::items_full_ranges_service,
};

#[tauri::command]
pub fn list_items_full_ranges(fileitems_item_id: String) -> Vec<ItemsFullRanges> {
  items_full_ranges_service::list_items_full_ranges(fileitems_item_id)
}

#[tauri::command]
pub fn get_full_range(id: String) -> Option<ItemsFullRanges> {
  items_full_ranges_service::get_full_range(id)
}

#[tauri::command]
pub fn create_full_range(fileitems_item_id: String, count: i32) {
  // id's are T_0_FR_0, T_0_FR_1, T_0_FR_2, etc. so we need to find the highest id and increment it
  let items_full_ranges = items_full_ranges_service::list_items_full_ranges(
    fileitems_item_id.clone()
  );

  fn find_highest_id(items_full_ranges: &Vec<ItemsFullRanges>) -> i32 {
    let mut highest_id = 0;
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

  let mut i = 0;
  while i < count {
    let new_id = find_highest_id(&items_full_ranges) + 1 + i;

    let full_range = ItemsFullRanges {
      id: format!("{}_FR_{}", fileitems_item_id.clone(), new_id),
      name: "".to_string(),
      low: "C-2".to_string(),
      high: "B8".to_string(),
      white_keys_only: false,
      fileitems_item_id: fileitems_item_id.clone(),
    };

    items_full_ranges_service::store_new_full_range(&full_range);
    i += 1;
  }
}

#[tauri::command]
pub fn delete_full_range(id: String) {
  items_full_ranges_service::delete_full_range(id)
}

#[tauri::command]
pub fn delete_full_range_by_fileitem(id: String, fileitems_item_id: String) {
  items_full_ranges_service::delete_full_range_by_fileitem(id, fileitems_item_id)
}

#[tauri::command]
pub fn update_full_range(data: ItemsFullRangesRequest) {
  items_full_ranges_service::update_full_range(data);
}
