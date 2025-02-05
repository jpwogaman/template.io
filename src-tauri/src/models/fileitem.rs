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

// ANY changes to ANY of the structs/types in this file will cause Specta to automatically export to the frontend
// depending on the change, template.io/src-tauri/src/bin/bindings_custom_types.rs, may need to be updated as well

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
  specta::Type
)]
#[diesel(table_name = fileitems)]
pub struct FileItem {
  pub id: String, // manually changed to FileItemId
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

#[derive(Deserialize, Serialize, Default, Clone, specta::Type)]
pub struct FileItemRequest {
  pub id: String, // manually changed to FileItemId
  #[specta(optional)]
  pub locked: Option<bool>,
  #[specta(optional)]
  pub name: Option<String>,
  #[specta(optional)]
  pub notes: Option<String>,
  #[specta(optional)]
  pub channel: Option<i32>,
  #[specta(optional)]
  pub base_delay: Option<f32>,
  #[specta(optional)]
  pub avg_delay: Option<f32>,
  #[specta(optional)]
  pub vep_out: Option<String>,
  #[specta(optional)]
  pub vep_instance: Option<String>,
  #[specta(optional)]
  pub smp_number: Option<String>,
  #[specta(optional)]
  pub smp_out: Option<String>,
  #[specta(optional)]
  pub color: Option<String>,
}

impl FileItem {
  pub fn update_from(&self, updates: FileItemRequest) -> Self {
    Self {
      id: self.id.clone(), // ONLY ART_LIST_TOG AND ART_LIST_TAP CAN EXPOSE ID UPDATES
      locked: updates.locked.unwrap_or(self.locked),
      name: updates.name.unwrap_or_else(|| self.name.clone()),
      notes: updates.notes.unwrap_or_else(|| self.notes.clone()),
      channel: updates.channel.unwrap_or(self.channel),
      base_delay: updates.base_delay.unwrap_or(self.base_delay),
      avg_delay: updates.avg_delay.unwrap_or(self.avg_delay),
      vep_out: updates.vep_out.unwrap_or_else(|| self.vep_out.clone()),
      vep_instance: updates.vep_instance.unwrap_or_else(||
        self.vep_instance.clone()
      ),
      smp_number: updates.smp_number.unwrap_or_else(|| self.smp_number.clone()),
      smp_out: updates.smp_out.unwrap_or_else(|| self.smp_out.clone()),
      color: updates.color.unwrap_or_else(|| self.color.clone()),
    }
  }
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

#[derive(Serialize, Deserialize, specta::Type)]
pub struct FullTrackForExport {
  #[serde(flatten)]
  #[specta(flatten)]
  pub fileitem: FileItem,
  pub full_ranges: Vec<ItemsFullRanges>,
  pub fad_list: Vec<ItemsFadList>,
  pub art_list_tog: Vec<ItemsArtListTog>,
  pub art_list_tap: Vec<ItemsArtListTap>,
  pub art_layers: Vec<ItemsArtLayers>,
}

#[derive(Serialize, Deserialize, specta::Type)]
pub struct FullTrackListForExport {
  pub file_meta_data: FileMetadata,
  pub items: Vec<FullTrackForExport>,
}

#[derive(Serialize, specta::Type)]
pub struct FullTrackCounts {
  pub art_list_tog: i32,
  pub art_list_tap: i32,
  pub art_layers: i32,
  pub fad_list: i32,
  pub full_ranges: i32,
}

#[derive(Serialize, specta::Type)]
pub struct FullTrackWithCounts {
  #[serde(flatten)]
  #[specta(flatten)]
  pub fileitem: FileItem,
  pub _count: FullTrackCounts,
}
