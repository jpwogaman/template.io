use crate::{schema::items_full_ranges, models::fileitem::FileItem};
use diesel::{ Insertable, Queryable, AsChangeset, Identifiable, Associations, Selectable };
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
#[diesel(table_name = items_full_ranges)]
pub struct ItemsFullRanges {
  pub id: String,
  pub name: String,
  pub low: String,
  pub high: String,
  pub white_keys_only: bool,
  pub fileItemsItemId: String,
}

#[derive(Deserialize, Serialize)]
pub struct ItemsFullRangesRequest {
  pub id: String,
  pub name: Option<String>,
  pub low: Option<String>,
  pub high: Option<String>,
  pub white_keys_only: Option<bool>,
  pub fileItemsItemId: String,
}
