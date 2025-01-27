use crate::{
  db::establish_db_connection,
  models::{
    custom_errors::MyCustomError,
    items_full_ranges::{ ItemsFullRanges, ItemsFullRangesRequest },
  },
  schema::items_full_ranges::dsl,
};
use diesel::prelude::*;

pub fn list_items_full_ranges(
  fileitems_item_id: String
) -> Vec<ItemsFullRanges> {
  let connection = &mut establish_db_connection();

  let mut items_full_ranges = dsl::items_full_ranges
    .filter(dsl::fileitems_item_id.eq(fileitems_item_id))
    .load::<ItemsFullRanges>(connection)
    .expect("Error loading items_full_ranges");

  items_full_ranges.sort_by(|a, b| {
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

  items_full_ranges
}

pub fn get_full_range(id: String) -> Option<ItemsFullRanges> {
  let connection = &mut establish_db_connection();

  dsl::items_full_ranges
    .filter(dsl::id.eq(id))
    .first::<ItemsFullRanges>(connection)
    .ok()
}

pub fn store_new_full_range(new_full_range: &ItemsFullRanges) {
  let connection = &mut establish_db_connection();

  diesel
    ::insert_into(dsl::items_full_ranges)
    .values(new_full_range)
    .execute(connection)
    .expect("Error saving new range");
}

pub fn delete_full_range_by_fileitem(
  id: String,
  fileitems_item_id: String
) -> Result<(), MyCustomError> {
  let connection = &mut establish_db_connection();

  let must_have_one = dsl::items_full_ranges
    .filter(dsl::fileitems_item_id.eq(fileitems_item_id.clone()))
    .load::<ItemsFullRanges>(connection)
    .expect("Error loading range");

  if must_have_one.len() <= 1 {
    return Err(MyCustomError::MinFullRangeError);
  }

  diesel
    ::delete(dsl::items_full_ranges.filter(dsl::id.eq(id)))
    .execute(connection)
    .expect("Error deleting range");

  Ok(())
}

pub fn delete_all_full_ranges_for_fileitem(fileitems_item_id: String) {
  let connection = &mut establish_db_connection();

  diesel
    ::delete(
      dsl::items_full_ranges.filter(
        dsl::fileitems_item_id.eq(fileitems_item_id)
      )
    )
    .execute(connection)
    .expect("Error deleting range");
}

pub fn delete_all_full_ranges() {
  let connection = &mut establish_db_connection();

  diesel
    ::delete(dsl::items_full_ranges)
    .execute(connection)
    .expect("Error deleting range");
}

pub fn update_full_range(data: ItemsFullRangesRequest) {
  let connection = &mut establish_db_connection();

  let original_full_range = get_full_range(data.id.clone()).unwrap();

  let new_full_range = ItemsFullRanges {
    id: data.id.clone(),
    name: data.name.unwrap_or(original_full_range.name),
    low: data.low.unwrap_or(original_full_range.low),
    high: data.high.unwrap_or(original_full_range.high),
    white_keys_only: data.white_keys_only.unwrap_or(
      original_full_range.white_keys_only
    ),
    fileitems_item_id: data.fileitems_item_id.unwrap_or(
      original_full_range.fileitems_item_id
    ),
  };

  diesel
    ::update(dsl::items_full_ranges.filter(dsl::id.eq(data.id)))
    .set(&new_full_range)
    .execute(connection)
    .expect("Error updating range");
}
