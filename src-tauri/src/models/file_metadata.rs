use serde::{ Deserialize, Serialize };
use ts_rs::TS;

#[derive(Deserialize, Serialize, Debug, TS)]
#[ts(export, export_to = "fileMetadata.ts")]
pub struct FileMetadata {
  pub file_name: String,
  pub file_created_date: String,  
}
