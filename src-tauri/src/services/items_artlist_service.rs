use crate::{
  db::establish_db_connection,
  models::{
    items_artlist_tap::{ ItemsArtListTap },
    items_artlist_tog::{ ItemsArtListTog },
  },
  schema::{
    items_artlist_tog::dsl as tog_dsl,
    items_artlist_tap::dsl as tap_dsl,
  },
  services::{ items_artlist_tog_service, items_artlist_tap_service },
};
use diesel::prelude::*;

pub fn renumber_all_arts(fileitems_item_id: String) {
  let connection = &mut establish_db_connection();

  let items_artlist_tog = items_artlist_tog_service::list_items_artlist_tog(
    fileitems_item_id.clone()
  );

  let items_artlist_tap = items_artlist_tap_service::list_items_artlist_tap(
    fileitems_item_id.clone()
  );

  let new_artlist_tog = items_artlist_tog
    .iter()
    .enumerate()
    .map(|(i, art)| {
      ItemsArtListTog {
        id: format!("{}_AT_{}", fileitems_item_id.clone(), i),
        name: art.name.clone(),
        toggle: art.toggle,
        code_type: art.code_type.clone(),
        code: art.code,
        on: art.on,
        off: art.off,
        default: art.default.clone(),
        delay: art.delay,
        change_type: art.change_type.clone(),
        ranges: art.ranges.clone(),
        art_layers: art.art_layers.clone(),
        fileitems_item_id: art.fileitems_item_id.clone(),
      }
    })
    .collect::<Vec<ItemsArtListTog>>();

  let new_artlist_tap = items_artlist_tap
    .iter()
    .enumerate()
    .map(|(i, art)| {
      ItemsArtListTap {
        id: format!(
          "{}_AT_{}",
          fileitems_item_id.clone(),
          (i as usize) + items_artlist_tog.len()
        ),
        name: art.name.clone(),
        toggle: art.toggle,
        code_type: art.code_type.clone(),
        code: art.code,
        on: art.on,
        off: art.off,
        default: art.default,
        delay: art.delay,
        change_type: art.change_type.clone(),
        ranges: art.ranges.clone(),
        art_layers: art.art_layers.clone(),
        fileitems_item_id: art.fileitems_item_id.clone(),
      }
    })
    .collect::<Vec<ItemsArtListTap>>();

  diesel
    ::delete(
      tog_dsl::items_artlist_tog.filter(
        tog_dsl::fileitems_item_id.eq(fileitems_item_id.clone())
      )
    )
    .execute(connection)
    .expect("Error deleting items_artlist_tog");

  diesel
    ::delete(
      tap_dsl::items_artlist_tap.filter(
        tap_dsl::fileitems_item_id.eq(fileitems_item_id.clone())
      )
    )

    .execute(connection)
    .expect("Error deleting items_artlist_tap");

  for art in new_artlist_tog {
    items_artlist_tog_service::store_new_art_tog(&art);
  }

  for art in new_artlist_tap {
    items_artlist_tap_service::store_new_art_tap(&art);
  }
}
