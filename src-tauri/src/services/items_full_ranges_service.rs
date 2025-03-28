use crate::{
  db::establish_db_connection,
  models::{
    custom_errors::MyCustomError,
    items_full_ranges::{ ItemsFullRanges, ItemsFullRangesRequest },
    items_artlist_tap::{ ItemsArtListTapRequest },
    items_artlist_tog::{ ItemsArtListTogRequest },
  },
  services::{
    items_artlist_tap_service::{ list_items_artlist_tap, update_art_tap },
    items_artlist_tog_service::{ list_items_artlist_tog, update_art_tog },
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
    ::delete(dsl::items_full_ranges.filter(dsl::id.eq(id.clone())))
    .execute(connection)
    .expect("Error deleting range");

  let _ = delete_range_id_from_art_taps_and_art_togs(id, fileitems_item_id);
  Ok(())
}

pub fn delete_range_id_from_art_taps_and_art_togs(
  id: String,
  fileitems_item_id: String
) -> Result<(), MyCustomError> {
  let items_artlist_tap = list_items_artlist_tap(fileitems_item_id.clone());
  let items_artlist_tog = list_items_artlist_tog(fileitems_item_id.clone());

  for tap in items_artlist_tap {
    let mut new_tap = tap.clone();

    match serde_json::from_str::<Vec<String>>(&tap.ranges) {
      Ok(ranges) => {
        let new_ranges: Vec<_> = ranges
          .into_iter()
          .filter(|range_id| range_id != &id)
          .collect();

        new_tap.ranges = serde_json
          ::to_string(&new_ranges)
          .expect("Failed to serialize ranges");

        let temp_request = ItemsArtListTapRequest {
          id: format!("{}", tap.id),
          ranges: Some(new_tap.ranges),
          ..Default::default()
        };
        let _ = update_art_tap(temp_request);
      }
      Err(e) => {
        println!("Error deserializing ranges: {:?}", e);
      }
    }
  }

  for tog in items_artlist_tog {
    let mut new_tog = tog.clone();
    
    match serde_json::from_str::<Vec<String>>(&tog.ranges) {
      Ok(ranges) => {
        let new_ranges: Vec<_> = ranges
          .into_iter()
          .filter(|range_id| range_id != &id)
          .collect();

        new_tog.ranges = serde_json
          ::to_string(&new_ranges)
          .expect("Failed to serialize ranges");
        
        let temp_request = ItemsArtListTogRequest {
          id: format!("{}", tog.id),
          ranges: Some(new_tog.ranges),
          ..Default::default()
        };
        let _ = update_art_tog(temp_request);
      }
      Err(e) => {
        println!("Error deserializing ranges: {:?}", e);
      }
    }
  }

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
  let new_full_range = original_full_range.update_from(data.clone());

  diesel
    ::update(dsl::items_full_ranges.filter(dsl::id.eq(data.id)))
    .set(&new_full_range)
    .execute(connection)
    .expect("Error updating range");
}

pub fn renumber_full_ranges(fileitems_item_id: String) {
  let connection = &mut establish_db_connection();

  let items_full_ranges = list_items_full_ranges(
    fileitems_item_id.clone()
  );

  let new_full_ranges = items_full_ranges
    .iter()
    .enumerate()
    .map(|(i, layer)| {
      ItemsFullRanges {
        id: format!("{}_FR_{}", fileitems_item_id.clone(), i),
        name: layer.name.clone(),
        low: layer.low.clone(),
        high: layer.high.clone(),
        white_keys_only: layer.white_keys_only,
        fileitems_item_id: layer.fileitems_item_id.clone(),
      }
    })
    .collect::<Vec<ItemsFullRanges>>();

  diesel
    ::delete(
      dsl::items_full_ranges.filter(
        dsl::fileitems_item_id.eq(fileitems_item_id.clone())
      )
    )
    .execute(connection)
    .expect("Error deleting items_full_ranges");

  for range in new_full_ranges {
    store_new_full_range(&range);
  }
}
