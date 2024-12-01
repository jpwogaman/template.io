use crate::schema::fileitems;
use diesel::{Insertable, Queryable};
use serde::Serialize;

#[derive(Queryable, Serialize, Insertable)]
#[diesel(table_name = fileitems)]
pub struct FileItem {
    pub id: String,
    pub locked: bool,
    pub name: String,
    pub notes: String,
    pub channel: Option<i32>,
    pub base_delay: Option<f32>,
    pub avg_delay: Option<f32>,
    pub vep_out: String,
    pub vep_instance: String,
    pub smp_number: String,
    pub smp_out: String,
    pub color: String,
}