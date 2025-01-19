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
#[diesel(table_name = items_fadlist)]
#[ts(export, export_to = "itemsFadlist.ts")]
pub struct ItemsFadList {
  pub id: String,
  pub name: String,
  pub code_type: String,
  pub code: i32,
  pub default: i32,
  pub change_type: String,
  pub fileitems_item_id: String,
}

#[derive(Deserialize, Serialize, TS)]
#[ts(export, export_to = "itemsFadlist.ts")]
pub struct ItemsFadListRequest {
  pub id: String,
  #[ts(optional)]
  pub name: Option<String>,
  #[ts(optional)]
  pub code_type: Option<String>,
  #[ts(optional)]
  pub code: Option<i32>,
  #[ts(optional)]
  pub default: Option<i32>,
  #[ts(optional)]
  pub change_type: Option<String>,
  #[ts(optional)]
  pub fileitems_item_id: Option<String>,
}

pub fn init_fad(id: String) -> ItemsFadList {
  ItemsFadList {
    id: format!("T_{}_FL_0", id),
    name: "".to_string(),
    code_type: "/control".to_string(),
    code: 0,
    default: 0,
    change_type: "Value 2".to_string(),
    fileitems_item_id: format!("T_{}", id),
  }
}
