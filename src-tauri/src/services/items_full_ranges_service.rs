use crate::{
  db::establish_db_connection,
  models::items_full_ranges::{ ItemsFullRanges, ItemsFullRangesRequest },
  schema::items_full_ranges::dsl,
};
use diesel::prelude::*;


pub fn list_items_full_ranges(fileItemsItemId: String) -> Vec<ItemsFullRanges> {
  let connection = &mut establish_db_connection();

  dsl::items_full_ranges
    .filter(dsl::fileItemsItemId.eq(fileItemsItemId))
    .order_by(dsl::id.asc())
    .load::<ItemsFullRanges>(connection)
    .expect("Error loading items_full_ranges")
}

pub fn get_full_range(id: String) -> Option<ItemsFullRanges> {
  let connection = &mut establish_db_connection();

  dsl::items_full_ranges.filter(dsl::id.eq(id)).first::<ItemsFullRanges>(connection).ok()
}

pub fn store_new_full_range(new_full_range: &ItemsFullRanges) {
  let connection = &mut establish_db_connection();

  diesel
    ::insert_into(dsl::items_full_ranges)
    .values(new_full_range)
    .execute(connection)
    .expect("Error saving new fileitem");
}

pub fn delete_full_range(id: String) {
  let connection = &mut establish_db_connection();

  diesel
    ::delete(dsl::items_full_ranges.filter(dsl::id.eq(id)))
    .execute(connection)
    .expect("Error deleting fileitem");
}

pub fn update_full_range(data: ItemsFullRangesRequest) {
  let connection = &mut establish_db_connection();

  let original_full_range = get_full_range(data.id.clone()).unwrap();

  let new_full_range = ItemsFullRanges {
    id: data.id.clone(),
    name: data.name.unwrap_or(original_full_range.name),
    low: data.low.unwrap_or(original_full_range.low),
    high: data.high.unwrap_or(original_full_range.high),
    white_keys_only: data.white_keys_only.unwrap_or(original_full_range.white_keys_only),
    fileItemsItemId: data.fileItemsItemId.clone(),
  };

  diesel
    ::update(dsl::items_full_ranges.filter(dsl::id.eq(data.id)))
    .set(&new_full_range)
    .execute(connection)
    .expect("Error updating fileitem");
}
