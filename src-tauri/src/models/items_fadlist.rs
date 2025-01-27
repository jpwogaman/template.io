use crate::{ schema::items_fadlist, models::fileitem::FileItem };
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
#[diesel(table_name = items_fadlist)]
pub struct ItemsFadList {
  pub id: String,
  pub name: String,
  pub code_type: String,
  pub code: i32,
  pub default: i32,
  pub change_type: String,
  pub fileitems_item_id: String,
}

#[derive(Deserialize, Serialize, specta::Type)]
pub struct ItemsFadListRequest {
  pub id: String,
  #[specta(optional)]
  pub name: Option<String>,
  #[specta(optional)]
  pub code_type: Option<String>,
  #[specta(optional)]
  pub code: Option<i32>,
  #[specta(optional)]
  pub default: Option<i32>,
  #[specta(optional)]
  pub change_type: Option<String>,
  #[specta(optional)]
  pub fileitems_item_id: Option<String>,
}

pub fn init_fad(fileitems_item_id: String, new_fad_id: String) -> ItemsFadList {
  ItemsFadList {
    id: format!("{}_FL_{}", fileitems_item_id, new_fad_id),
    name: "".to_string(),
    code_type: "/control".to_string(),
    code: 0,
    default: 0,
    change_type: "Value 2".to_string(),
    fileitems_item_id: fileitems_item_id,
  }
}
