use crate::{
  db::establish_db_connection,
  models::{
    custom_errors::MyCustomError,
    items_artlist_tap::{ ItemsArtListTap, ItemsArtListTapRequest },
  },
  schema::items_artlist_tap::dsl,
};
use diesel::prelude::*;

pub fn list_items_artlist_tap(
  fileitems_item_id: String
) -> Vec<ItemsArtListTap> {
  let connection = &mut establish_db_connection();

  let mut items_artlist_tap = dsl::items_artlist_tap
    .filter(dsl::fileitems_item_id.eq(fileitems_item_id))
    .load::<ItemsArtListTap>(connection)
    .expect("Error loading items_artlist_tap");

  items_artlist_tap.sort_by(|a, b| {
    let a_id_number = a.id
      .split('_')
      .nth(3)
      .and_then(|num| num.parse::<i32>().ok())
      .unwrap_or(0);
    let b_id_number = b.id
      .split('_')
      .nth(3)
      .and_then(|num| num.parse::<i32>().ok())
      .unwrap_or(0);
    a_id_number.cmp(&b_id_number)
  });

  for item in &mut items_artlist_tap {
    if let Ok(mut art_layers) = serde_json::from_str::<Vec<String>>(&item.art_layers) {
      art_layers.sort_by(|a, b| {
        let a_num = a.split('_').last().and_then(|num| num.parse::<i32>().ok()).unwrap_or(0);
        let b_num = b.split('_').last().and_then(|num| num.parse::<i32>().ok()).unwrap_or(0);
        a_num.cmp(&b_num)
      });
      item.art_layers = serde_json::to_string(&art_layers).expect("Failed to serialize art_layers");
    }
  }

  items_artlist_tap
}

pub fn get_art_tap(id: String) -> Option<ItemsArtListTap> {
  let connection = &mut establish_db_connection();

  dsl::items_artlist_tap
    .filter(dsl::id.eq(id))
    .first::<ItemsArtListTap>(connection)
    .ok()
}

pub fn store_new_art_tap(new_art_tap: &ItemsArtListTap) {
  let connection = &mut establish_db_connection();

  diesel
    ::insert_into(dsl::items_artlist_tap)
    .values(new_art_tap)
    .execute(connection)
    .expect("Error saving new fad");
}

pub fn delete_art_tap_by_fileitem(
  id: String,
  fileitems_item_id: String
) -> Result<(), MyCustomError> {
  let connection = &mut establish_db_connection();

  let items_artlist_tap = list_items_artlist_tap(fileitems_item_id.clone());
  let first_art_tap = &items_artlist_tap[0];
  let second_art_tap = &items_artlist_tap[1];
  let this_art_tap = get_art_tap(id.clone()).unwrap();

  if items_artlist_tap.len() <= 1 {
    return Err(MyCustomError::MinArtTapError);
  }

  if first_art_tap.id == id.clone() && this_art_tap.default == true {
    let temp_request = ItemsArtListTapRequest {
      id: format!("{}", second_art_tap.id),
      default: Some(true),
      ..Default::default()
    };

    let _ = update_art_tap(temp_request);

  } else if first_art_tap.id != id.clone() && this_art_tap.default == true {
    let temp_request = ItemsArtListTapRequest {
      id: format!("{}", first_art_tap.id),
      default: Some(true),
      ..Default::default()
    };

    let _ = update_art_tap(temp_request);
  }

  diesel
    ::delete(dsl::items_artlist_tap.filter(dsl::id.eq(id)))
    .execute(connection)
    .expect("Error deleting art_tap");

  Ok(())
}

pub fn delete_all_art_tap_for_fileitem(fileitems_item_id: String) {
  let connection = &mut establish_db_connection();

  diesel
    ::delete(
      dsl::items_artlist_tap.filter(
        dsl::fileitems_item_id.eq(fileitems_item_id)
      )
    )
    .execute(connection)
    .expect("Error deleting art_tap");
}

pub fn delete_all_art_tap() {
  let connection = &mut establish_db_connection();

  diesel
    ::delete(dsl::items_artlist_tap)
    .execute(connection)
    .expect("Error deleting art_tap");
}

pub fn update_art_tap(
  data: ItemsArtListTapRequest
) -> Result<(), MyCustomError> {
  let connection = &mut establish_db_connection();

  let original_art_tap = get_art_tap(data.id.clone()).unwrap();
  let new_art_tap = original_art_tap.update_from(data.clone());

  //let must_have_one_range = |ranges: String| -> String {
  //  if ranges == "[]" {
  //    return original_art_tap.ranges.clone();
  //  }
  //  ranges
  //};


  let all_art_tap_for_fileitem = list_items_artlist_tap(
    original_art_tap.fileitems_item_id.clone()
  );

  if data.default == Some(true) {
    for art_tap in all_art_tap_for_fileitem {
      if art_tap.id != data.id && art_tap.default == true {
        let new_art_tap_2 = ItemsArtListTap {
          default: false,
          ..art_tap.clone()
        };

        diesel
          ::update(dsl::items_artlist_tap.filter(dsl::id.eq(art_tap.id)))
          .set(&new_art_tap_2)
          .execute(connection)
          .expect("Error updating art_tap");
      }
    }
  } else if data.default == Some(false) {
    let mut there_is_one = false;

    for art_tap in all_art_tap_for_fileitem {
      if art_tap.id != data.id && art_tap.default == true {
        there_is_one = true;
        break;
      }
    }

    if !there_is_one {
      return Err(MyCustomError::MinDefaultArtTap);
    }
  }

  diesel
    ::update(dsl::items_artlist_tap.filter(dsl::id.eq(data.id)))
    .set(&new_art_tap)
    .execute(connection)
    .expect("Error updating art_tap");

  Ok(())
}
