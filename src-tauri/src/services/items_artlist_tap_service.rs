use crate::{
  db::establish_db_connection,
  models::items_artlist_tap::{ ItemsArtListTap, ItemsArtListTapRequest },
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

pub fn delete_art_tap_by_fileitem(id: String, fileitems_item_id: String) {
  let connection = &mut establish_db_connection();

  let must_have_one = dsl::items_artlist_tap
    .filter(dsl::fileitems_item_id.eq(fileitems_item_id.clone()))
    .load::<ItemsArtListTap>(connection)
    .expect("Error loading art_tap");

  if must_have_one.len() <= 1 {
    return;
  }

  diesel
    ::delete(dsl::items_artlist_tap.filter(dsl::id.eq(id)))
    .execute(connection)
    .expect("Error deleting art_tap");
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

pub fn update_art_tap(data: ItemsArtListTapRequest) {
  let connection = &mut establish_db_connection();

  let original_art_tap = get_art_tap(data.id.clone()).unwrap();

  let must_have_one_range = |ranges: String| -> String {
    if ranges == "[]" {
      return original_art_tap.ranges.clone();
    }
    ranges
  };

  let all_art_tap_for_fileitem = list_items_artlist_tap(
    original_art_tap.fileitems_item_id.clone()
  );

  let one_art_must_be_default = |default: bool| -> bool {
    if default == true {
      for art_tap in all_art_tap_for_fileitem {
        if art_tap.id != data.id && art_tap.default == true {
          let new_art_tap = ItemsArtListTap {
            default: false,
            ..art_tap.clone()
          };

          diesel
            ::update(dsl::items_artlist_tap.filter(dsl::id.eq(art_tap.id)))
            .set(&new_art_tap)
            .execute(connection)
            .expect("Error updating art_tap");
        }
      }
    }
    default
  };

  let new_art_tap = ItemsArtListTap {
    id: data.id.clone(),
    name: data.name.unwrap_or(original_art_tap.name),
    toggle: data.toggle.unwrap_or(original_art_tap.toggle),
    code_type: data.code_type.unwrap_or(original_art_tap.code_type),
    code: data.code.unwrap_or(original_art_tap.code),
    on: data.on.unwrap_or(original_art_tap.on),
    off: data.off.unwrap_or(original_art_tap.off),
    default: one_art_must_be_default(
      data.default.unwrap_or(original_art_tap.default)
    ),
    delay: data.delay.unwrap_or(original_art_tap.delay),
    change_type: data.change_type.unwrap_or(original_art_tap.change_type),
    ranges: must_have_one_range(
      data.ranges.unwrap_or(original_art_tap.ranges.clone())
    ),
    art_layers: data.art_layers.unwrap_or(original_art_tap.art_layers),
    fileitems_item_id: data.fileitems_item_id.unwrap_or(
      original_art_tap.fileitems_item_id
    ),
  };

  diesel
    ::update(dsl::items_artlist_tap.filter(dsl::id.eq(data.id)))
    .set(&new_art_tap)
    .execute(connection)
    .expect("Error updating fad");
}
