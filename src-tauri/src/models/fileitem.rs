use crate::{
  schema::fileitems,
  models::{
    file_metadata::{ FileMetadata },
    items_full_ranges::{ ItemsFullRanges },
    items_fadlist::{ ItemsFadList },
    items_artlist_tog::{ ItemsArtListTog },
    items_artlist_tap::{ ItemsArtListTap },
    items_art_layers::{ ItemsArtLayers },
  },
};

use diesel::{ Insertable, Queryable, AsChangeset, Identifiable };
use serde::{ Serialize, Deserialize };
use ts_rs::TS;

#[derive(
  Queryable,
  Serialize,
  Deserialize,
  Insertable,
  Identifiable,
  AsChangeset,
  Debug,
  PartialEq,
  Clone,
  TS,
  specta::Type
)]
#[diesel(table_name = fileitems)]
#[ts(export, export_to = "fileitem.ts")]
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

#[derive(Deserialize, Serialize, TS, specta::Type)]
#[ts(export, export_to = "fileitem.ts")]
pub struct FileItemRequest {
  pub id: String,
  #[ts(optional)]
  #[specta(optional)]
  pub locked: Option<bool>,
  #[ts(optional)]
  #[specta(optional)]
  pub name: Option<String>,
  #[ts(optional)]
  #[specta(optional)]
  pub notes: Option<String>,
  #[ts(optional)]
  #[specta(optional)]
  pub channel: Option<i32>,
  #[ts(optional)]
  #[specta(optional)]
  pub base_delay: Option<f32>,
  #[ts(optional)]
  #[specta(optional)]
  pub avg_delay: Option<f32>,
  #[ts(optional)]
  #[specta(optional)]
  pub vep_out: Option<String>,
  #[ts(optional)]
  #[specta(optional)]
  pub vep_instance: Option<String>,
  #[ts(optional)]
  #[specta(optional)]
  pub smp_number: Option<String>,
  #[ts(optional)]
  #[specta(optional)]
  pub smp_out: Option<String>,
  #[ts(optional)]
  #[specta(optional)]
  pub color: Option<String>,
}

pub fn init_fileitem(id: String) -> FileItem {
  FileItem {
    id: format!("T_{}", id),
    locked: false,
    name: "".to_string(),
    notes: "".to_string(),
    channel: 1,
    base_delay: 0.0,
    avg_delay: 0.0,
    vep_out: "N/A".to_string(),
    vep_instance: "N/A".to_string(),
    smp_number: "N/A".to_string(),
    smp_out: "N/A".to_string(),
    color: "#71717A".to_string(),
  }
}

#[derive(Serialize, Deserialize, TS, specta::Type)]
#[ts(export, export_to = "fileitem.ts")]
pub struct FullTrackForExport {
  #[ts(flatten)]
  #[serde(flatten)]
  pub fileitem: FileItem,
  pub full_ranges: Vec<ItemsFullRanges>,
  pub fad_list: Vec<ItemsFadList>,
  pub art_list_tog: Vec<ItemsArtListTog>,
  pub art_list_tap: Vec<ItemsArtListTap>,
  pub art_layers: Vec<ItemsArtLayers>,
}

#[derive(Serialize, Deserialize, TS, specta::Type)]
#[ts(export, export_to = "fileitem.ts")]
pub struct FullTrackListForExport {
  pub file_meta_data: FileMetadata,
  pub items: Vec<FullTrackForExport>,
}

#[derive(Serialize, TS, specta::Type)]
#[ts(export, export_to = "fileitem.ts")]
pub struct FullTrackCounts {
  pub art_list_tog: i32,
  pub art_list_tap: i32,
  pub art_layers: i32,
  pub fad_list: i32,
  pub full_ranges: i32,
}

#[derive(Serialize, TS, specta::Type)]
#[ts(export, export_to = "fileitem.ts")]
pub struct FullTrackWithCounts {
  #[ts(flatten)]
  #[serde(flatten)]
  pub fileitem: FileItem,
  pub _count: FullTrackCounts,
}
