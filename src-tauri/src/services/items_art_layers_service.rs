use crate::{
  db::establish_db_connection,
  models::items_art_layers::{ ItemsArtLayers, ItemsArtLayersRequest },
  schema::items_art_layers::dsl,
};
use diesel::prelude::*;

pub fn list_items_art_layers(fileItemsItemId: String) -> Vec<ItemsArtLayers> {
  let connection = &mut establish_db_connection();

  dsl::items_art_layers
    .filter(dsl::fileItemsItemId.eq(fileItemsItemId))
    .order_by(dsl::id.asc())
    .load::<ItemsArtLayers>(connection)
    .expect("Error loading items_art_layers")
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

pub fn delete_art_layer(id: String) {
  let connection = &mut establish_db_connection();

  diesel
    ::delete(dsl::items_art_layers.filter(dsl::id.eq(id)))
    .execute(connection)
    .expect("Error deleting fad");
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
    fileItemsItemId: data.fileItemsItemId.clone(),
  };

  diesel
    ::update(dsl::items_art_layers.filter(dsl::id.eq(data.id)))
    .set(&new_art_layer)
    .execute(connection)
    .expect("Error updating fad");
}
