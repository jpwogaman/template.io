use crate::{ schema::items_artlist_tap, models::fileitem::FileItem };

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
#[diesel(table_name = items_artlist_tap)]
#[ts(export, export_to = "itemsArtlistTap.ts")]
pub struct ItemsArtListTap {
  pub id: String,
  pub name: String,
  pub toggle: bool,
  pub code_type: String,
  pub code: i32,
  pub on: i32,
  pub off: i32,
  pub default: bool,
  pub delay: i32,
  pub change_type: String,
  pub ranges: String,
  pub art_layers: String,
  pub fileitems_item_id: String,
}

#[derive(Deserialize, Serialize, TS, specta::Type)]
#[ts(export, export_to = "itemsArtlistTap.ts")]
pub struct ItemsArtListTapRequest {
  pub id: String,
  #[ts(optional)]
  #[specta(optional)]
  pub name: Option<String>,
  #[ts(optional)]
  #[specta(optional)]
  pub toggle: Option<bool>,
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
  pub default: Option<bool>,
  #[ts(optional)]
  #[specta(optional)]
  pub delay: Option<i32>,
  #[ts(optional)]
  #[specta(optional)]
  pub change_type: Option<String>,
  #[ts(optional)]
  #[specta(optional)]
  pub ranges: Option<String>,
  #[ts(optional)]
  #[specta(optional)]
  pub art_layers: Option<String>,
  #[ts(optional)]
  #[specta(optional)]
  pub fileitems_item_id: Option<String>,
}

pub fn init_art_tap(id: String) -> ItemsArtListTap {
  ItemsArtListTap {
    // art_tog is T_{}_AT_0, art_tap is T_{}_AT_1 
    id: format!("T_{}_AT_1", id),
    name: "".to_string(),
    toggle: false,
    code_type: "/control".to_string(),
    code: 0,
    on: 127,
    off: 0,
    default: false,
    delay: 0,
    change_type: "Value 2".to_string(),
    ranges: format!("[\"T_{}_FR_0\"]", id),
    art_layers: "[\"\"]".to_string(),
    fileitems_item_id: format!("T_{}", id),
  }
}
