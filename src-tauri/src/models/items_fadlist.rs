use crate::schema::items_fadlist;
use diesel::{ Insertable, Queryable, AsChangeset, Identifiable };
use serde::{ Serialize, Deserialize };

#[derive(Queryable, Serialize, Insertable, Identifiable, AsChangeset)]
#[diesel(table_name = items_fadlist)]
pub struct ItemsFadList {
  pub id: String,
  pub name: String,
  pub code_type: String,
  pub code: i32,
  pub default: i32,
  pub change_type: String,
}

#[derive(Deserialize, Serialize)]
pub struct ItemsFadListRequest {
  pub id: String,
  pub name: Option<String>,
  pub code_type: Option<String>,
  pub code: Option<i32>,
  pub default: Option<i32>,
  pub change_type: Option<String>,
}
