use crate::{
  db::establish_db_connection,
  models::items_fadlist::{ ItemsFadList, ItemsFadListRequest },
  schema::items_fadlist::dsl,
};
use diesel::prelude::*;

pub fn list_items_fadlist(fileitems_item_id: String) -> Vec<ItemsFadList> {
  let connection = &mut establish_db_connection();

  let mut items_fadlist = dsl::items_fadlist
    .filter(dsl::fileitems_item_id.eq(fileitems_item_id))
    .load::<ItemsFadList>(connection)
    .expect("Error loading items_fadlist");

  items_fadlist.sort_by(|a, b| {
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

  items_fadlist
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

pub fn delete_fad_by_fileitem(id: String, fileitems_item_id: String) {
  let connection = &mut establish_db_connection();

  let must_have_one = dsl::items_fadlist
    .filter(dsl::fileitems_item_id.eq(fileitems_item_id.clone()))
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

pub fn delete_all_fad_for_fileitem(fileitems_item_id: String) {
  let connection = &mut establish_db_connection();

  diesel
    ::delete(
      dsl::items_fadlist.filter(dsl::fileitems_item_id.eq(fileitems_item_id))
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
    fileitems_item_id: data.fileitems_item_id.unwrap_or(
      original_fad.fileitems_item_id
    ),
  };

  diesel
    ::update(dsl::items_fadlist.filter(dsl::id.eq(data.id)))
    .set(&new_fad)
    .execute(connection)
    .expect("Error updating fad");
}
