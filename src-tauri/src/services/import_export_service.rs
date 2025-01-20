use tauri::AppHandle;
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_fs::FilePath;
use serde_json::{ Value, from_str, to_string };
use std::fs::{ read_to_string, write };
use crate::services::fileitem_service::{
  create_all_fileitems_from_json,
  delete_all_fileitems_and_relations,
  list_all_fileitems_and_relations_for_json_export,
};
use log::{ error, info };

pub fn import(app: AppHandle) {
  let file_path: Option<FilePath> = app.dialog().file().blocking_pick_file();

  if let Some(file_path) = file_path {
    let file_path_str = file_path.to_string();

    match read_to_string(file_path_str) {
      Ok(file_content) => {
        match from_str::<Value>(&file_content) {
          Ok(parsed_json) => {
            delete_all_fileitems_and_relations();
            create_all_fileitems_from_json(parsed_json);            
          }
          Err(e) => {
            error!("Failed to parse JSON: {:?}", e);
          }
        }
      }
      Err(e) => {
        error!("Failed to read file: {:?}", e);
      }
    }
  } else {
    error!("No file selected");
  }
}

pub fn export(app: AppHandle) {
  let full_track_list_for_export =
    list_all_fileitems_and_relations_for_json_export();
  let file_path: Option<FilePath> = app.dialog().file().blocking_save_file();

  if let Some(file_path) = file_path {
    let file_path_str = file_path.to_string();
    let json_string = to_string(&full_track_list_for_export).unwrap();
    match write(file_path_str, json_string) {
      Ok(_) => {
        info!("File saved successfully");
      }
      Err(e) => {
        error!("Failed to save file: {:?}", e);
      }
    }
  } else {
    error!("No file selected");
  }
}
