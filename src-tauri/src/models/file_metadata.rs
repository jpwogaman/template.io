use serde::{ Deserialize, Serialize };

#[derive(Deserialize, Serialize, Debug, specta::Type)]
pub struct FileMetadata {
  pub file_name: String,
  pub file_created_date: String,  
}
