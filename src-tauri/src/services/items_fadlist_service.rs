use crate::{
  db::establish_db_connection,
  models::{
    custom_errors::MyCustomError,
    items_fadlist::{ ItemsFadList, ItemsFadListRequest },
  },
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

pub fn delete_fad_by_fileitem(
  id: String,
  fileitems_item_id: String
) -> Result<(), MyCustomError> {
  let connection = &mut establish_db_connection();

  let must_have_one = dsl::items_fadlist
    .filter(dsl::fileitems_item_id.eq(fileitems_item_id.clone()))
    .load::<ItemsFadList>(connection)
    .expect("Error loading fad");

  if must_have_one.len() <= 1 {
    return Err(MyCustomError::MinFadError);
  }

  diesel
    ::delete(dsl::items_fadlist.filter(dsl::id.eq(id)))
    .execute(connection)
    .expect("Error deleting fad");

  Ok(())
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
  let new_fad = original_fad.update_from(data.clone());

  diesel
    ::update(dsl::items_fadlist.filter(dsl::id.eq(data.id)))
    .set(&new_fad)
    .execute(connection)
    .expect("Error updating fad");
}

pub fn renumber_fadlist(fileitems_item_id: String) {
  let connection = &mut establish_db_connection();

  let items_fadlist = list_items_fadlist(fileitems_item_id.clone());

  let new_fad_list = items_fadlist
    .iter()
    .enumerate()
    .map(|(i, layer)| {
      ItemsFadList {
        id: format!("{}_FL_{}", fileitems_item_id.clone(), i),
        name: layer.name.clone(),
        code_type: layer.code_type.clone(),
        code: layer.code,
        default: layer.default.clone(),
        change_type: layer.change_type.clone(),
        fileitems_item_id: layer.fileitems_item_id.clone(),
      }
    })
    .collect::<Vec<ItemsFadList>>();

  diesel
    ::delete(
      dsl::items_fadlist.filter(
        dsl::fileitems_item_id.eq(fileitems_item_id.clone())
      )
    )
    .execute(connection)
    .expect("Error deleting items_fadlist");

  for fad in new_fad_list {
    store_new_fad(&fad);
  }
}
