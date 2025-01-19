use crate::{ schema::items_full_ranges, models::fileitem::FileItem };
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
#[diesel(table_name = items_full_ranges)]
#[ts(export, export_to = "itemsFullRanges.ts")]
pub struct ItemsFullRanges {
  pub id: String,
  pub name: String,
  pub low: String,
  pub high: String,
  pub white_keys_only: bool,
  pub fileitems_item_id: String,
}

#[derive(Deserialize, Serialize, TS, specta::Type)]
#[ts(export, export_to = "itemsFullRanges.ts")]
pub struct ItemsFullRangesRequest {
  pub id: String,
  #[ts(optional)]
  #[specta(optional)]
  pub name: Option<String>,
  #[ts(optional)]
  #[specta(optional)]
  pub low: Option<String>,
  #[ts(optional)]
  #[specta(optional)]
  pub high: Option<String>,
  #[ts(optional)]
  #[specta(optional)]
  pub white_keys_only: Option<bool>,
  #[ts(optional)]
  #[specta(optional)]
  pub fileitems_item_id: Option<String>,
}

pub fn init_full_range(id: String) -> ItemsFullRanges {
  ItemsFullRanges {
    id: format!("T_{}_FR_0", id),
    name: "".to_string(),
    low: "C-2".to_string(),
    high: "G8".to_string(),
    white_keys_only: false,
    fileitems_item_id: format!("T_{}", id),
  }
}
