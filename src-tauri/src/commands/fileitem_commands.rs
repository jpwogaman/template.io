use crate::{
  models::{ fileitem::{ FileItem, FileItemRequest } },
  services::fileitem_service,
};

#[tauri::command]
pub fn list_fileitems() -> Vec<FileItem> {
  fileitem_service::list_fileitems()
}

#[tauri::command]
pub fn list_fileitems_and_relations() -> Vec<fileitem_service::FullTrackListForExport> {
  fileitem_service::list_fileitems_and_relations()
}

#[tauri::command]
pub fn list_fileitems_and_relation_counts() -> Vec<fileitem_service::FullTrackListWithCounts> {
  fileitem_service::list_fileitems_and_relation_counts()
}

#[tauri::command]
pub fn get_fileitem(id: String) -> Option<FileItem> {
  fileitem_service::get_fileitem(id)
}

#[tauri::command]
pub fn get_fileitem_and_relations(
  id: String
) -> Option<fileitem_service::FullTrackListForExport> {
  fileitem_service::get_fileitem_and_relations(id)
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
}
