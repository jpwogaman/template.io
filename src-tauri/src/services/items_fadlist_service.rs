use crate::{
  db::establish_db_connection,
  models::items_fadlist::{ ItemsFadList, ItemsFadListRequest },
  schema::items_fadlist::dsl,
};
use diesel::prelude::*;

pub fn list_items_fadlist(fileItemsItemId: String) -> Vec<ItemsFadList> {
  let connection = &mut establish_db_connection();

  dsl::items_fadlist
    .filter(dsl::fileItemsItemId.eq(fileItemsItemId))
    .order_by(dsl::id.asc())
    .load::<ItemsFadList>(connection)
    .expect("Error loading items_fadlist")
}

pub fn get_fad(id: String) -> Option<ItemsFadList> {
  let connection = &mut establish_db_connection();

  dsl::items_fadlist
    .filter(dsl::id.eq(id))
    .first::<ItemsFadList>(connection)
    .ok()
}

pub fn store_new_fad(new_fad: &ItemsFadList) {
  let connection = &mut establish_db_connection();

  diesel
    ::insert_into(dsl::items_fadlist)
    .values(new_fad)
    .execute(connection)
    .expect("Error saving new fad");
}

pub fn delete_fad(id: String) {
  let connection = &mut establish_db_connection();

  diesel
    ::delete(dsl::items_fadlist.filter(dsl::id.eq(id)))
    .execute(connection)
    .expect("Error deleting fad");
}

pub fn delete_fad_by_fileitem(id: String, fileItemsItemId: String) {
  let connection = &mut establish_db_connection();

  let must_have_one = dsl::items_fadlist
    .filter(dsl::fileItemsItemId.eq(fileItemsItemId.clone()))
    .load::<ItemsFadList>(connection)
    .expect("Error loading fad");

  if must_have_one.len() <= 1 {
    return;
  }

  diesel
    ::delete(dsl::items_fadlist.filter(dsl::id.eq(id)))
    .execute(connection)
    .expect("Error deleting fad");
}

pub fn delete_all_fad_for_fileitem(fileItemsItemId: String) {
  let connection = &mut establish_db_connection();

  diesel
    ::delete(
      dsl::items_fadlist.filter(dsl::fileItemsItemId.eq(fileItemsItemId))
    )
    .execute(connection)
    .expect("Error deleting fad");
}

pub fn delete_all_fad() {
  let connection = &mut establish_db_connection();

  diesel
    ::delete(dsl::items_fadlist)
    .execute(connection)
    .expect("Error deleting fad");
}

pub fn update_fad(data: ItemsFadListRequest) {
  let connection = &mut establish_db_connection();

  let original_fad = get_fad(data.id.clone()).unwrap();

  let new_fad = ItemsFadList {
    id: data.id.clone(),
    name: data.name.unwrap_or(original_fad.name),
    code_type: data.code_type.unwrap_or(original_fad.code_type),
    code: data.code.unwrap_or(original_fad.code),
    default: data.default.unwrap_or(original_fad.default),
    change_type: data.change_type.unwrap_or(original_fad.change_type),
    fileItemsItemId: data.fileItemsItemId.unwrap_or(
      original_fad.fileItemsItemId
    ),
  };

  diesel
    ::update(dsl::items_fadlist.filter(dsl::id.eq(data.id)))
    .set(&new_fad)
    .execute(connection)
    .expect("Error updating fad");
}
