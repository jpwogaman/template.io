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

/////

use serde::{ Serialize, Deserialize };

use diesel::{ Insertable, Queryable, AsChangeset, Identifiable, Selectable };
use diesel::sql_types::{ Text };
use diesel::expression::AsExpression;
use diesel::deserialize::{ FromSql, FromSqlRow };
use diesel::serialize::{ ToSql, IsNull, Output };
use diesel::sqlite::{ Sqlite };
use diesel::backend::Backend;
use std::hash::{ Hash };

////////

#[derive(
  Queryable,
  Serialize,
  Deserialize,
  Insertable,
  Selectable,
  Identifiable,
  AsChangeset,
  Debug,
  PartialEq,
  Clone,
  specta::Type
)]
#[diesel(table_name = fileitems)]
pub struct FileItem {
  pub id: FileItemId,
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


#[derive(
  Debug,
  PartialEq,
  Eq,
  AsExpression,
  Clone,
  Serialize,
  FromSqlRow,
  Deserialize,
  Hash,
  specta::Type
)]
#[diesel(sql_type = Text)]
pub struct FileItemId(pub String);

impl FileItemId {
  // Constructor to ensure it always follows the 'T_{number}' format
  pub fn new(id: u32) -> Self {
    FileItemId(format!("T_{}", id))
  }

  // A method to extract the number from the 'T_{number}' format
  pub fn number(&self) -> Option<u32> {
    self.0.strip_prefix("T_").and_then(|s| s.parse::<u32>().ok())
  }
}

// Implementing `ToSql` for `FileItemId` where `Text` is the SQL type
impl ToSql<Text, Sqlite> for FileItemId {
  fn to_sql<'b>(
    &'b self,
    out: &mut Output<'b, '_, Sqlite>
  ) -> diesel::serialize::Result {
    // Convert the FileItemId into a string, e.g., "T_1234"
    let value = format!("T_{}", self.0);
    out.set_value(value);
    Ok(IsNull::No)
  }
}

// Deserialize FileItemId from SQL (from TEXT)
impl<DB> FromSql<Text, DB>
  for FileItemId
  where
    DB: Backend,
    String: FromSql<Text, DB> // Use String (or &str) for deserialization
{
  fn from_sql(bytes: DB::RawValue<'_>) -> diesel::deserialize::Result<Self> {
    let value = String::from_sql(bytes)?; // Convert the raw value to a String

    // Validate the format 'T_{number}'
    if
      let Some(num) = value
        .strip_prefix("T_")
        .and_then(|s| s.parse::<u32>().ok())
    {
      Ok(FileItemId(format!("T_{}", num))) // Return the FileItemId
    } else {
      Err("Invalid FileItemId format".into()) // Return an error if format is invalid
    }
  }
}

pub fn init_fileitem(id_number: u32) -> FileItem {
  FileItem {
    id: FileItemId::new(id_number),
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



/////

#[derive(Deserialize, Serialize, specta::Type)]
pub struct FileItemRequest {
  pub id: FileItemId,
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

//////////
