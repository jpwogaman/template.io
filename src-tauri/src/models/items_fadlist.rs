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
  Clone
)]
#[diesel(belongs_to(FileItem, foreign_key = fileItemsItemId))]
#[diesel(table_name = items_fadlist)]
pub struct ItemsFadList {
  pub id: String,
  pub name: String,
  pub code_type: String,
  pub code: i32,
  pub default: i32,
  pub change_type: String,
  pub fileItemsItemId: String,
}

#[derive(Deserialize, Serialize)]
pub struct ItemsFadListRequest {
  pub id: String,
  pub name: Option<String>,
  pub code_type: Option<String>,
  pub code: Option<i32>,
  pub default: Option<i32>,
  pub change_type: Option<String>,
  pub fileItemsItemId: Option<String>,
}

pub fn init_fad(id: String) -> ItemsFadList {
  ItemsFadList {
    id: format!("T_{}_FL_0", id),
    name: "".to_string(),
    code_type: "/control".to_string(),
    code: 0,
    default: 0,
    change_type: "Value 2".to_string(),
    fileItemsItemId: format!("T_{}", id),
  }
}
