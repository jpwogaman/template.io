use crate::{ schema::items_artlist_tog, models::fileitem::FileItem };
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
  TS
)]
#[diesel(belongs_to(FileItem, foreign_key = fileitems_item_id))]
#[diesel(table_name = items_artlist_tog)]
#[ts(export, export_to = "itemsArtlistTog.ts")]
pub struct ItemsArtListTog {
  pub id: String,
  pub name: String,
  pub toggle: bool,
  pub code_type: String,
  pub code: i32,
  pub on: i32,
  pub off: i32,
  pub default: String,
  pub delay: i32,
  pub change_type: String,
  pub ranges: String,
  pub art_layers: String,
  pub fileitems_item_id: String,
}

#[derive(Deserialize, Serialize, TS)]
#[ts(export, export_to = "itemsArtlistTog.ts")]
pub struct ItemsArtListTogRequest {
  pub id: String,
  #[ts(optional)]
  pub name: Option<String>,
  #[ts(optional)]
  pub toggle: Option<bool>,
  #[ts(optional)]
  pub code_type: Option<String>,
  #[ts(optional)]
  pub code: Option<i32>,
  #[ts(optional)]
  pub on: Option<i32>,
  #[ts(optional)]
  pub off: Option<i32>,
  #[ts(optional)]
  pub default: Option<String>,
  #[ts(optional)]
  pub delay: Option<i32>,
  #[ts(optional)]
  pub change_type: Option<String>,
  #[ts(optional)]
  pub ranges: Option<String>,
  #[ts(optional)]
  pub art_layers: Option<String>,
  #[ts(optional)]
  pub fileitems_item_id: Option<String>,
}

pub fn init_art_tog(id: String) -> ItemsArtListTog {
  ItemsArtListTog {
    // art_tog is T_{}_AT_0, art_tap is T_{}_AT_1 
    id: format!("T_{}_AT_0", id),
    name: "".to_string(),
    toggle: true,
    code_type: "/control".to_string(),
    code: 0,
    on: 127,
    off: 0,
    default: "On".to_string(),
    delay: 0,
    change_type: "Value 2".to_string(),
    ranges: format!("[\"T_{}_FR_0\"]", id),
    art_layers: "[\"\"]".to_string(),
    fileitems_item_id: format!("T_{}", id),
  }
}