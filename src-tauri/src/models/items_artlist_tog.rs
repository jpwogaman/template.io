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
#[diesel(table_name = items_artlist_tog)]
pub struct ItemsArtListTog {
  pub id: String, // manually changed to SubItemId
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
  pub fileitems_item_id: String, // manually changed to FileItemId
}

#[derive(Deserialize, Serialize, specta::Type)]
pub struct ItemsArtListTogRequest {
  pub id: String, // manually changed to SubItemId
  #[specta(optional)]
  pub name: Option<String>,
  #[specta(optional)]
  pub toggle: Option<bool>,
  #[specta(optional)]
  pub code_type: Option<String>,
  #[specta(optional)]
  pub code: Option<i32>,
  #[specta(optional)]
  pub on: Option<i32>,
  #[specta(optional)]
  pub off: Option<i32>,
  #[specta(optional)]
  pub default: Option<String>,
  #[specta(optional)]
  pub delay: Option<i32>,
  #[specta(optional)]
  pub change_type: Option<String>,
  #[specta(optional)]
  pub ranges: Option<String>,
  #[specta(optional)]
  pub art_layers: Option<String>,
  #[specta(optional)]
  pub fileitems_item_id: Option<String>, // manually changed to FileItemId
}

pub fn init_art_tog(
  fileitems_item_id: String,
  new_art_tog_id: String
) -> ItemsArtListTog {
  ItemsArtListTog {
    // art_tog is T_{}_AT_0, art_tap is T_{}_AT_1
    id: format!("{}_AT_{}", fileitems_item_id, new_art_tog_id),
    name: "".to_string(),
    toggle: true,
    code_type: "/control".to_string(),
    code: 0,
    on: 127,
    off: 0,
    default: "On".to_string(),
    delay: 0,
    change_type: "Value 2".to_string(),
    ranges: format!("[\"{}_FR_0\"]", fileitems_item_id),
    art_layers: "[\"\"]".to_string(),
    fileitems_item_id: fileitems_item_id,
  }
}
