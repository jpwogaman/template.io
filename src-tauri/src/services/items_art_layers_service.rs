use crate::{
  db::establish_db_connection,
  models::{
    custom_errors::MyCustomError,
    items_art_layers::{ ItemsArtLayers, ItemsArtLayersRequest },
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
    ::delete(dsl::items_art_layers.filter(dsl::id.eq(id)))
    .execute(connection)
    .expect("Error deleting layer");

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

  let new_art_layer = ItemsArtLayers {
    id: data.id.clone(),
    name: data.name.unwrap_or(original_art_layer.name),
    code_type: data.code_type.unwrap_or(original_art_layer.code_type),
    code: data.code.unwrap_or(original_art_layer.code),
    on: data.on.unwrap_or(original_art_layer.on),
    off: data.off.unwrap_or(original_art_layer.off),
    default: data.default.unwrap_or(original_art_layer.default),
    change_type: data.change_type.unwrap_or(original_art_layer.change_type),
    fileitems_item_id: data.fileitems_item_id.unwrap_or(
      original_art_layer.fileitems_item_id
    ),
  };

  diesel
    ::update(dsl::items_art_layers.filter(dsl::id.eq(data.id)))
    .set(&new_art_layer)
    .execute(connection)
    .expect("Error updating layer");
}
