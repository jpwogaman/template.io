use crate::schema::fileitems;
use diesel::{
  Insertable,
  Queryable,
  AsChangeset,
  Identifiable,
};
use serde::{ Serialize, Deserialize };

#[derive(
  Queryable,
  Serialize,
  Insertable,
  Identifiable,
  AsChangeset,
  Debug,
  PartialEq,
  Clone
)]
#[diesel(table_name = fileitems)]
pub struct FileItem {
  pub id: String,
  pub locked: bool,
  pub name: String,
  pub notes: String,
  pub channel: i32,
  pub base_delay: f32,
  pub avg_delay: f32,
  pub vep_out: String,
  pub vep_instance: String,
  pub smp_number: String,
  pub smp_out: String,
  pub color: String,
}

#[derive(Deserialize, Serialize)]
pub struct FileItemRequest {
  pub id: String,
  pub locked: Option<bool>,
  pub name: Option<String>,
  pub notes: Option<String>,
  pub channel: Option<i32>,
  pub base_delay: Option<f32>,
  pub avg_delay: Option<f32>,
  pub vep_out: Option<String>,
  pub vep_instance: Option<String>,
  pub smp_number: Option<String>,
  pub smp_out: Option<String>,
  pub color: Option<String>,
}
