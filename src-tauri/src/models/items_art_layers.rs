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
use ts_rs::TS;

#[derive(
  Queryable,
  Serialize,
  Deserialize,
  Insertable,
  AsChangeset,
  Selectable,
  Identifiable,
  Associations,
  Debug,
  PartialEq,
  Clone,
  TS,
  specta::Type
)]
#[diesel(belongs_to(FileItem, foreign_key = fileitems_item_id))]
#[diesel(table_name = items_art_layers)]
#[ts(export, export_to = "itemsArtLayers.ts")]
pub struct ItemsArtLayers {
  pub id: String,
  pub name: String,
  pub code_type: String,
  pub code: i32,
  pub on: i32,
  pub off: i32,
  pub default: String,
  pub change_type: String,
  pub fileitems_item_id: String,
}

#[derive(Deserialize, Serialize, TS, specta::Type)]
#[ts(export, export_to = "itemsArtLayers.ts")]
pub struct ItemsArtLayersRequest {
  pub id: String,
  #[ts(optional)]
  #[specta(optional)]
  pub name: Option<String>,
  #[ts(optional)]
  #[specta(optional)]
  pub code_type: Option<String>,
  #[ts(optional)]
  #[specta(optional)]
  pub code: Option<i32>,
  #[ts(optional)]
  #[specta(optional)]
  pub on: Option<i32>,
  #[ts(optional)]
  #[specta(optional)]
  pub off: Option<i32>,
  #[ts(optional)]
  #[specta(optional)]
  pub default: Option<String>,
  #[ts(optional)]
  #[specta(optional)]
  pub change_type: Option<String>,
  #[ts(optional)]
  #[specta(optional)]
  pub fileitems_item_id: Option<String>,
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
    fileitems_item_id: format!("T_{}", id),
  }
}
