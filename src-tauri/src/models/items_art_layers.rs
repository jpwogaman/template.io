use crate::{ schema::items_art_layers, models::fileitem::FileItem };
use diesel::{
  Insertable,
  Queryable,
  AsChangeset,
  Identifiable,
  Associations,
  Selectable,
};
use serde::{ Serialize, Deserialize };

#[derive(
  Queryable,
  Serialize,
  Insertable,
  AsChangeset,
  Selectable,
  Identifiable,
  Associations,
  Debug,
  PartialEq,
  Clone
)]
#[diesel(belongs_to(FileItem, foreign_key = fileItemsItemId))]
#[diesel(table_name = items_art_layers)]
pub struct ItemsArtLayers {
  pub id: String,
  pub name: String,
  pub code_type: String,
  pub code: i32,
  pub on: i32,
  pub off: i32,
  pub default: String,
  pub change_type: String,
  pub fileItemsItemId: String,
}

#[derive(Deserialize, Serialize)]
pub struct ItemsArtLayersRequest {
  pub id: String,
  pub name: Option<String>,
  pub code_type: Option<String>,
  pub code: Option<i32>,
  pub on: Option<i32>,
  pub off: Option<i32>,
  pub default: Option<String>,
  pub change_type: Option<String>,
  pub fileItemsItemId: Option<String>,
}

pub fn init_art_layer(id: String) -> ItemsArtLayers {
  ItemsArtLayers {
    id: format!("T_{}_AL_0", id),
    name: "".to_string(),
    code_type: "/control".to_string(),
    code: 0,
    on: 127,
    off: 0,
    default: "Off".to_string(),
    change_type: "Value 2".to_string(),
    fileItemsItemId: format!("T_{}", id),
  }
}
