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

// ANY changes to ANY of the structs/types in this file will cause Specta to automatically export to the frontend
// depending on the change, template.io/src-tauri/src/bin/bindings_custom_types.rs, may need to be updated as well

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
  specta::Type
)]
#[diesel(belongs_to(FileItem, foreign_key = fileitems_item_id))]
#[diesel(table_name = items_full_ranges)]
pub struct ItemsFullRanges {
  pub id: String, // manually changed to SubItemId
  pub name: String,
  pub low: String,
  pub high: String,
  pub white_keys_only: bool,
  pub fileitems_item_id: String, // manually changed to FileItemId
}

#[derive(Deserialize, Serialize, specta::Type)]
pub struct ItemsFullRangesRequest {
  pub id: String, // manually changed to SubItemId
  #[specta(optional)]
  pub name: Option<String>,
  #[specta(optional)]
  pub low: Option<String>,
  #[specta(optional)]
  pub high: Option<String>,
  #[specta(optional)]
  pub white_keys_only: Option<bool>,
  #[specta(optional)]
  pub fileitems_item_id: Option<String>, // manually changed to FileItemId
}

pub fn init_full_range(
  fileitems_item_id: String,
  new_range_id: String
) -> ItemsFullRanges {
  ItemsFullRanges {
    id: format!("{}_FR_{}", fileitems_item_id,new_range_id ),
    name: "".to_string(),
    low: "C-2".to_string(),
    high: "G8".to_string(),
    white_keys_only: false,
    fileitems_item_id: fileitems_item_id,
  }
}
