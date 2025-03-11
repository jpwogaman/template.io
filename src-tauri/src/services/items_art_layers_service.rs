use crate::{
  db::establish_db_connection,
  models::{
    custom_errors::MyCustomError,
    items_art_layers::{ ItemsArtLayers, ItemsArtLayersRequest },
    items_artlist_tap::{ ItemsArtListTapRequest },
    items_artlist_tog::{ ItemsArtListTogRequest },
  },
  services::{
    items_artlist_tap_service::{ list_items_artlist_tap, update_art_tap },
    items_artlist_tog_service::{ list_items_artlist_tog, update_art_tog },
  },
  schema::items_art_layers::dsl,
};
use diesel::prelude::*;

pub fn list_items_art_layers(fileitems_item_id: String) -> Vec<ItemsArtLayers> {
  let connection = &mut establish_db_connection();

  let mut items_art_layers = dsl::items_art_layers
    .filter(dsl::fileitems_item_id.eq(fileitems_item_id))
    .load::<ItemsArtLayers>(connection)
    .expect("Error loading items_art_layers");

  items_art_layers.sort_by(|a, b| {
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

  items_art_layers
}

pub fn get_art_layer(id: String) -> Option<ItemsArtLayers> {
  let connection = &mut establish_db_connection();

  dsl::items_art_layers
    .filter(dsl::id.eq(id))
    .first::<ItemsArtLayers>(connection)
    .ok()
}

pub fn store_new_art_layer(new_art_layer: &ItemsArtLayers) {
  let connection = &mut establish_db_connection();

  diesel
    ::insert_into(dsl::items_art_layers)
    .values(new_art_layer)
    .execute(connection)
    .expect("Error saving new fad");
}

pub fn delete_art_layer_by_fileitem(
  id: String,
  fileitems_item_id: String
) -> Result<(), MyCustomError> {
  let connection = &mut establish_db_connection();

  let must_have_one = dsl::items_art_layers
    .filter(dsl::fileitems_item_id.eq(fileitems_item_id.clone()))
    .load::<ItemsArtLayers>(connection)
    .expect("Error loading layer");

  if must_have_one.len() <= 1 {
    return Err(MyCustomError::MinArtLayerError);
  }

  diesel
    ::delete(dsl::items_art_layers.filter(dsl::id.eq(id.clone())))
    .execute(connection)
    .expect("Error deleting layer");

  let _ = delete_layer_id_from_art_taps_and_art_togs(id, fileitems_item_id);
  Ok(())
}

pub fn delete_layer_id_from_art_taps_and_art_togs(
  id: String,
  fileitems_item_id: String
) -> Result<(), MyCustomError> {
  let items_artlist_tap = list_items_artlist_tap(fileitems_item_id.clone());
  let items_artlist_tog = list_items_artlist_tog(fileitems_item_id.clone());

  for tap in items_artlist_tap {
    let mut new_tap = tap.clone();

    match serde_json::from_str::<Vec<String>>(&tap.art_layers) {
      Ok(art_layers) => {
        let new_layers: Vec<_> = art_layers
          .into_iter()
          .filter(|layer_id| layer_id != &id)
          .collect();

        new_tap.art_layers = serde_json
          ::to_string(&new_layers)
          .expect("Failed to serialize art_layers");

        let temp_request = ItemsArtListTapRequest {
          id: format!("{}", tap.id),
          art_layers: Some(new_tap.art_layers),
          ..Default::default()
        };
        let _ = update_art_tap(temp_request);
      }
      Err(e) => {
        println!("Error deserializing art_layers: {:?}", e);
      }
    }
  }

  for tog in items_artlist_tog {
    let mut new_tog = tog.clone();

    match serde_json::from_str::<Vec<String>>(&tog.art_layers_on) {
      Ok(art_layers_on) => {
        let new_layers_on: Vec<_> = art_layers_on
          .into_iter()
          .filter(|layer_id| layer_id != &id)
          .collect();

        new_tog.art_layers_on = serde_json
          ::to_string(&new_layers_on)
          .expect("Failed to serialize art_layers_on");

        let temp_request = ItemsArtListTogRequest {
          id: format!("{}", tog.id),
          art_layers_on: Some(new_tog.art_layers_on),
          ..Default::default()
        };
        let _ = update_art_tog(temp_request);
      }
      Err(e) => {
        println!("Error deserializing art_layers_on: {:?}", e);
      }
    }
    match serde_json::from_str::<Vec<String>>(&tog.art_layers_off) {
      Ok(art_layers_off) => {
        let new_layers_off: Vec<_> = art_layers_off
          .into_iter()
          .filter(|layer_id| layer_id != &id)
          .collect();

        new_tog.art_layers_off = serde_json
          ::to_string(&new_layers_off)
          .expect("Failed to serialize art_layers_off");

        let temp_request = ItemsArtListTogRequest {
          id: format!("{}", tog.id),
          art_layers_off: Some(new_tog.art_layers_off),
          ..Default::default()
        };
        let _ = update_art_tog(temp_request);
      }
      Err(e) => {
        println!("Error deserializing art_layers_off: {:?}", e);
      }
    }
  }
  Ok(())
}

pub fn delete_all_art_layers_for_fileitem(fileitems_item_id: String) {
  let connection = &mut establish_db_connection();

  diesel
    ::delete(
      dsl::items_art_layers.filter(dsl::fileitems_item_id.eq(fileitems_item_id))
    )
    .execute(connection)
    .expect("Error deleting layer");
}

pub fn delete_all_art_layers() {
  let connection = &mut establish_db_connection();

  diesel
    ::delete(dsl::items_art_layers)
    .execute(connection)
    .expect("Error deleting layer");
}

pub fn update_art_layer(data: ItemsArtLayersRequest) {
  let connection = &mut establish_db_connection();

  let original_art_layer = get_art_layer(data.id.clone()).unwrap();
  let new_art_layer = original_art_layer.update_from(data.clone());

  diesel
    ::update(dsl::items_art_layers.filter(dsl::id.eq(data.id)))
    .set(&new_art_layer)
    .execute(connection)
    .expect("Error updating layer");
}

pub fn renumber_art_layers(fileitems_item_id: String) {
  let connection = &mut establish_db_connection();

  let items_art_layers = list_items_art_layers(fileitems_item_id.clone());

  let new_art_layers = items_art_layers
    .iter()
    .enumerate()
    .map(|(i, layer)| {
      ItemsArtLayers {
        id: format!("{}_AL_{}", fileitems_item_id.clone(), i),
        name: layer.name.clone(),
        code_type: layer.code_type.clone(),
        code: layer.code,
        on: layer.on,
        fileitems_item_id: layer.fileitems_item_id.clone(),
      }
    })
    .collect::<Vec<ItemsArtLayers>>();

  diesel
    ::delete(
      dsl::items_art_layers.filter(
        dsl::fileitems_item_id.eq(fileitems_item_id.clone())
      )
    )
    .execute(connection)
    .expect("Error deleting items_art_layers");

  for layer in new_art_layers {
    store_new_art_layer(&layer);
  }
}
