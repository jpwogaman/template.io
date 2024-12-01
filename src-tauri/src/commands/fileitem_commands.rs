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
        name: "Default FileItem".to_string(),
        notes: "Default FileItem Notes".to_string(),
        channel: Some(1),
        base_delay: Some(1.0),
        avg_delay: Some(1.0),
        vep_out: "Default VEP Out".to_string(),
        vep_instance: "Default VEP Instance".to_string(),
        smp_number: "Default SMP Number".to_string(),
        smp_out: "Default SMP Out".to_string(),
        color: "Default Color".to_string(),
    };
    
    fileitem_service::store_new_item(&fileitem);
}

#[tauri::command]
pub fn delete_fileitem(id: String) {
    fileitem_service::delete_fileitem(id)
}