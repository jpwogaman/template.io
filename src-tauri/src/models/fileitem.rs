use crate::schema::fileitems;
use diesel::{ Insertable, Queryable };
use serde::Serialize;

#[derive(Queryable, Serialize, Insertable)]
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
