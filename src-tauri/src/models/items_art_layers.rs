use crate::schema::items_art_layers;
use diesel::{ Insertable, Queryable, AsChangeset, Identifiable };
use serde::{ Serialize, Deserialize };

#[derive(Queryable, Serialize, Insertable, Identifiable, AsChangeset)]
#[diesel(table_name = items_art_layers)]
pub struct ItemsArtLayers {
  pub id: String,
  pub name: String,
  pub code_type: String,
  pub code: i32,
  pub on: i32,
  pub off: i32,
  pub default: String,
  pub change_type: String,
}

#[derive(Deserialize, Serialize)]
pub struct ItemsArtLayersRequest {
  pub id: String,
  pub name: Option<String>,
  pub code_type: Option<String>,
  pub code: Option<i32>,
  pub on: Option<i32>,
  pub off: Option<i32>,
  pub default: Option<String>,
  pub change_type: Option<String>,
}
