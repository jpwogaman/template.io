use crate::{
  db::establish_db_connection,
  models::items_artlist_tog::{ ItemsArtListTog, ItemsArtListTogRequest },
  schema::items_artlist_tog::dsl,
};
use diesel::prelude::*;

pub fn list_items_artlist_tog(fileItemsItemId: String) -> Vec<ItemsArtListTog> {
  let connection = &mut establish_db_connection();

  dsl::items_artlist_tog
    .filter(dsl::fileItemsItemId.eq(fileItemsItemId))
    .order_by(dsl::id.asc())
    .load::<ItemsArtListTog>(connection)
    .expect("Error loading items_artlist_tog")
}

pub fn get_art_tog(id: String) -> Option<ItemsArtListTog> {
  let connection = &mut establish_db_connection();

  dsl::items_artlist_tog
    .filter(dsl::id.eq(id))
    .first::<ItemsArtListTog>(connection)
    .ok()
}

pub fn store_new_art_tog(new_art_tog: &ItemsArtListTog) {
  let connection = &mut establish_db_connection();

  diesel
    ::insert_into(dsl::items_artlist_tog)
    .values(new_art_tog)
    .execute(connection)
    .expect("Error saving new fad");
}

pub fn delete_art_tog(id: String) {
  let connection = &mut establish_db_connection();

  diesel
    ::delete(dsl::items_artlist_tog.filter(dsl::id.eq(id)))
    .execute(connection)
    .expect("Error deleting fad");
}

pub fn delete_art_tog_by_fileitem(id: String, fileItemsItemId: String) {
  let connection = &mut establish_db_connection();

  let must_have_one = dsl::items_artlist_tog
    .filter(dsl::fileItemsItemId.eq(fileItemsItemId.clone()))
    .load::<ItemsArtListTog>(connection)
    .expect("Error loading art_tog");

  if must_have_one.len() <= 1 {
    return;
  }

  diesel
    ::delete(dsl::items_artlist_tog.filter(dsl::id.eq(id)))
    .execute(connection)
    .expect("Error deleting art_tog");
}

pub fn delete_all_art_tog_for_fileitem(fileItemsItemId: String) {
  let connection = &mut establish_db_connection();

  diesel
    ::delete(
      dsl::items_artlist_tog.filter(dsl::fileItemsItemId.eq(fileItemsItemId))
    )
    .execute(connection)
    .expect("Error deleting art_tog");
}

pub fn delete_all_art_tog() {
  let connection = &mut establish_db_connection();

  diesel
    ::delete(dsl::items_artlist_tog)
    .execute(connection)
    .expect("Error deleting art_tog");
}

pub fn update_art_tog(data: ItemsArtListTogRequest) {
  let connection = &mut establish_db_connection();

  let original_art_tog = get_art_tog(data.id.clone()).unwrap();

  let must_have_one_range = |ranges: String| -> String {
    if ranges == "[]" {
      return original_art_tog.ranges.clone();
    }
    ranges
  };

  let new_art_tog = ItemsArtListTog {
    id: data.id.clone(),
    name: data.name.unwrap_or(original_art_tog.name),
    toggle: data.toggle.unwrap_or(original_art_tog.toggle),
    code_type: data.code_type.unwrap_or(original_art_tog.code_type),
    code: data.code.unwrap_or(original_art_tog.code),
    on: data.on.unwrap_or(original_art_tog.on),
    off: data.off.unwrap_or(original_art_tog.off),
    default: data.default.unwrap_or(original_art_tog.default),
    delay: data.delay.unwrap_or(original_art_tog.delay),
    change_type: data.change_type.unwrap_or(original_art_tog.change_type),
    ranges: must_have_one_range(
      data.ranges.unwrap_or(original_art_tog.ranges.clone())
    ),
    art_layers: data.art_layers.unwrap_or(original_art_tog.art_layers),
    fileItemsItemId: data.fileItemsItemId.unwrap_or(
      original_art_tog.fileItemsItemId
    ),
  };

  diesel
    ::update(dsl::items_artlist_tog.filter(dsl::id.eq(data.id)))
    .set(&new_art_tog)
    .execute(connection)
    .expect("Error updating fad");
}
