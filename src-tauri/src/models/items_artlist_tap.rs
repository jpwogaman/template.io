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
#[diesel(table_name = items_artlist_tap)]
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
  pub fileItemsItemId: String,
}

#[derive(Deserialize, Serialize)]
pub struct ItemsArtListTapRequest {
  pub id: String,
  pub name: Option<String>,
  pub toggle: Option<bool>,
  pub code_type: Option<String>,
  pub code: Option<i32>,
  pub on: Option<i32>,
  pub off: Option<i32>,
  pub default: Option<bool>,
  pub delay: Option<i32>,
  pub change_type: Option<String>,
  pub ranges: Option<String>,
  pub art_layers: Option<String>,
  pub fileItemsItemId: Option<String>,
}
