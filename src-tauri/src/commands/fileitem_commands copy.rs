use crate::{
  models::fileitem::{
    FileItem,
    FileItemId,
    FileItemRequest,
    FullTrackForExport,
    FullTrackWithCounts,
    FullTrackListForExport,
  },
  services::fileitem_service,
};

#[tauri::command]
#[specta::specta]
pub fn renumber_all_fileitems() -> Vec<FileItem> {
  fileitem_service::renumber_all_fileitems()
}

#[tauri::command]
#[specta::specta]
pub fn list_all_fileitems_and_relation_counts() -> Vec<FullTrackWithCounts> {
  fileitem_service::list_all_fileitems_and_relation_counts()
}

#[tauri::command]
#[specta::specta]
pub fn get_fileitem_and_relations(id: FileItemId) -> Option<FullTrackForExport> {
  fileitem_service::get_fileitem_and_relations(id)
}

#[tauri::command]
#[specta::specta]
pub fn create_fileitem() {
  fileitem_service::create_fileitem()
}

#[tauri::command]
#[specta::specta]
pub fn clear_fileitem(id: FileItemId) {
  fileitem_service::clear_fileitem(id);
}

#[tauri::command]
#[specta::specta]
pub fn update_fileitem(data: FileItemRequest) {
  fileitem_service::update_fileitem(data);
}

#[tauri::command]
#[specta::specta]
pub fn delete_fileitem_and_relations(id: FileItemId) {
  fileitem_service::delete_fileitem_and_relations(id)
}

#[tauri::command]
#[specta::specta]
pub fn list_all_fileitems_and_relations_for_json_export() -> FullTrackListForExport{
  fileitem_service::list_all_fileitems_and_relations_for_json_export()
}