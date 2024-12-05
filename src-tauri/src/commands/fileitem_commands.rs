use crate::{
  models::fileitem::{
    FileItem,
    FileItemRequest,
    FullTrackForExport,
    FullTrackWithCounts,
  },
  services::fileitem_service,
};
use serde_json::Value;

#[tauri::command]
pub fn list_fileitems() -> Vec<FileItem> {
  fileitem_service::list_fileitems()
}

#[tauri::command]
pub fn renumber_all_fileitems() -> Vec<FileItem> {
  fileitem_service::renumber_all_fileitems()
}

#[tauri::command]
pub fn list_all_fileitems_and_relations() -> Vec<FullTrackForExport> {
  fileitem_service::list_all_fileitems_and_relations()
}

#[tauri::command]
pub fn list_all_fileitems_and_relation_counts() -> Vec<FullTrackWithCounts> {
  fileitem_service::list_all_fileitems_and_relation_counts()
}

#[tauri::command]
pub fn get_fileitem(id: String) -> Option<FileItem> {
  fileitem_service::get_fileitem(id)
}

#[tauri::command]
pub fn get_fileitem_and_relations(id: String) -> Option<FullTrackForExport> {
  fileitem_service::get_fileitem_and_relations(id)
}

#[tauri::command]
pub fn create_all_fileitems_from_json(full_data: Value) {
  fileitem_service::create_all_fileitems_from_json(full_data)
}

#[tauri::command]
pub fn create_fileitem(count: i32) {
  fileitem_service::create_fileitem(count)
}

#[tauri::command]
pub fn delete_fileitem(id: String) {
  fileitem_service::delete_fileitem(id)
}

#[tauri::command]
pub fn clear_fileitem(id: String) {
  fileitem_service::clear_fileitem(id);
}

#[tauri::command]
pub fn update_fileitem(data: FileItemRequest) {
  fileitem_service::update_fileitem(data);
}

#[tauri::command]
pub fn delete_fileitem_and_relations(id: String) {
  fileitem_service::delete_fileitem_and_relations(id)
}

#[tauri::command]
pub fn delete_all_fileitems_and_relations() {
  fileitem_service::delete_all_fileitems_and_relations();
  fileitem_service::create_fileitem(1);
}
