use crate::{
  db::establish_db_connection,
  models::items_artlist_tap::{ ItemsArtListTap, ItemsArtListTapRequest },
  schema::items_artlist_tap::dsl,
};
use diesel::prelude::*;

pub fn list_items_artlist_tap(fileItemsItemId: String) -> Vec<ItemsArtListTap> {
  let connection = &mut establish_db_connection();

  dsl::items_artlist_tap
    .filter(dsl::fileItemsItemId.eq(fileItemsItemId))
    .order_by(dsl::id.asc())
    .load::<ItemsArtListTap>(connection)
    .expect("Error loading items_artlist_tap")
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

pub fn delete_art_tap(id: String) {
  let connection = &mut establish_db_connection();

  diesel
    ::delete(dsl::items_artlist_tap.filter(dsl::id.eq(id)))
    .execute(connection)
    .expect("Error deleting fad");
}

pub fn update_art_tap(data: ItemsArtListTapRequest) {
  let connection = &mut establish_db_connection();

  let original_art_tap = get_art_tap(data.id.clone()).unwrap();

  let new_art_tap = ItemsArtListTap {
    id: data.id.clone(),
    name: data.name.unwrap_or(original_art_tap.name),
    toggle: data.toggle.unwrap_or(original_art_tap.toggle),
    code_type: data.code_type.unwrap_or(original_art_tap.code_type),
    code: data.code.unwrap_or(original_art_tap.code),
    on: data.on.unwrap_or(original_art_tap.on),
    off: data.off.unwrap_or(original_art_tap.off),
    default: data.default.unwrap_or(original_art_tap.default),
    delay: data.delay.unwrap_or(original_art_tap.delay),
    change_type: data.change_type.unwrap_or(original_art_tap.change_type),
    ranges: data.ranges.unwrap_or(original_art_tap.ranges),
    art_layers: data.art_layers.unwrap_or(original_art_tap.art_layers),
    fileItemsItemId: data.fileItemsItemId.clone(),
  };

  diesel
    ::update(dsl::items_artlist_tap.filter(dsl::id.eq(data.id)))
    .set(&new_art_tap)
    .execute(connection)
    .expect("Error updating fad");
}