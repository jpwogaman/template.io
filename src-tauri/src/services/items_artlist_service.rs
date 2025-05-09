use crate::{
  db::establish_db_connection,
  models::{
    items_artlist_tap::{ ItemsArtListTap, ItemsArtListTapRequest },
    items_artlist_tog::{ ItemsArtListTog, ItemsArtListTogRequest },
    fileitem::{ FileItemRequest },
  },
  schema::{
    items_artlist_tog::dsl as tog_dsl,
    items_artlist_tap::dsl as tap_dsl,
  },
  services::{
    items_artlist_tog_service,
    items_artlist_tap_service,
    fileitem_service,
  },
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
      let request = ItemsArtListTogRequest {
        id: format!("{}_AT_{}", fileitems_item_id.clone(), i),
        ..Default::default()
      };

      art.update_from(request)
    })
    .collect::<Vec<ItemsArtListTog>>();

  let new_artlist_tap = items_artlist_tap
    .iter()
    .enumerate()
    .map(|(i, art)| {
      let request = ItemsArtListTapRequest {
        id: format!(
          "{}_AT_{}",
          fileitems_item_id.clone(),
          (i as usize) + items_artlist_tog.len()
        ),
        ..Default::default()
      };

      art.update_from(request)
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

pub fn get_avg_delay(fileitems_item_id: String, base_delay: Option<f32>) {
  let new_base_delay = base_delay.unwrap_or_else(|| {
    fileitem_service
      ::get_fileitem(fileitems_item_id.clone())
      .unwrap().base_delay
  });

  println!("New base delay: {}", new_base_delay);

  let items_artlist_tog = items_artlist_tog_service::list_items_artlist_tog(
    fileitems_item_id.clone()
  );

  let items_artlist_tap = items_artlist_tap_service::list_items_artlist_tap(
    fileitems_item_id.clone()
  );

  let mut total_delay = new_base_delay;
  let mut count = 0;

  for art in items_artlist_tog {
    total_delay += art.delay as f32;
    count += 1;
  }

  for art in items_artlist_tap {
    total_delay += art.delay as f32;
    count += 1;
  }

  let avg_delay = if count > 0 {
    total_delay / (count as f32)
  } else {
    new_base_delay
  };

  let data = FileItemRequest {
    id: fileitems_item_id,
    avg_delay: Some(avg_delay),
    ..Default::default()
  };

  println!("Avg delay: {}", avg_delay);

  fileitem_service::update_fileitem(data);
}
