use crate::{models::fileitem::FileItem, services::fileitem_service};

#[tauri::command]
pub fn list_fileitems() -> Vec<FileItem> {
    fileitem_service::list_fileitems()
}

#[tauri::command]
pub fn get_fileitem(id: String) -> Option<FileItem> {
    fileitem_service::get_fileitem(id)
}

#[tauri::command]
pub fn create_fileitem() {
    let fileitem = FileItem {
        id: "1".to_string(),
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
    };
    
    fileitem_service::store_new_item(&fileitem);
}

#[tauri::command]
pub fn delete_fileitem(id: String) {
    fileitem_service::delete_fileitem(id)
}