use crate::{
  models::items_fadlist::{ ItemsFadList, ItemsFadListRequest },
  services::{ items_fadlist_service, settings_services::{ Settings } },
};

#[tauri::command]
#[specta::specta]
pub fn create_fad(fileitems_item_id: String) {
  let settings = Settings::get();

  // id's are T_0_FR_0, T_0_FR_1, T_0_FR_2, etc. so we need to find the highest id and increment it
  let items_fadlist = items_fadlist_service::list_items_fadlist(
    fileitems_item_id.clone()
  );

  fn find_highest_id(items_fadlist: &Vec<ItemsFadList>) -> i32 {
    let mut highest_id = 0;

    if items_fadlist.len() < 1 {
      return -1;
    }
    for items_fad in items_fadlist {
      let id = items_fad.id.split("_").nth(3).unwrap().parse::<i32>().unwrap();
      if id > highest_id {
        highest_id = id;
      }
    }
    highest_id
  }

  let count = if items_fadlist.len() < 1 {
    settings.default_fad_count as i32
  } else {
    settings.sub_item_add_count as i32
  };

  let mut i = 0;
  while i < count {
    println!("{}", count.to_string());
    let new_id = find_highest_id(&items_fadlist) + 1 + i;

    let fad = ItemsFadList {
      id: format!("{}_FL_{}", fileitems_item_id.clone(), new_id),
      name: "".to_string(),
      code_type: "/control".to_string(),
      code: 0,
      default: 0,
      change_type: "Value 2".to_string(),
      fileitems_item_id: fileitems_item_id.clone(),
    };

    items_fadlist_service::store_new_fad(&fad);
    i += 1;
  }
}

#[tauri::command]
#[specta::specta]
pub fn delete_fad_by_fileitem(id: String, fileitems_item_id: String) {
  items_fadlist_service::delete_fad_by_fileitem(id, fileitems_item_id)
}

#[tauri::command]
#[specta::specta]
pub fn update_fad(data: ItemsFadListRequest) {
  items_fadlist_service::update_fad(data);
}
