use crate::{db::establish_db_connection, models::fileitem::FileItem,schema::fileitems::dsl};
use diesel::prelude::*;

pub fn init() {
    let fileitems = list_fileitems();

    if fileitems.len() > 0 {
        return;
    }

    let default_fileitem =  FileItem {
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

    store_new_item(&default_fileitem);
}

pub fn list_fileitems() -> Vec<FileItem> {
    let connection = &mut establish_db_connection();

    dsl::fileitems
        .order_by(dsl::id.asc())
        .load::<FileItem>(connection)
        .expect("Error loading fileitems")
}

pub fn get_fileitem(id: String) -> Option<FileItem> {
    let connection = &mut establish_db_connection();

    dsl::fileitems
        .filter(dsl::id.eq(id))
        .first::<FileItem>(connection)
        .ok()
}

pub fn store_new_item(new_item: &FileItem) {
    let connection = &mut establish_db_connection();

    diesel::insert_into(dsl::fileitems)
        .values(new_item)
        .execute(connection)
        .expect("Error saving new fileitem");
}

pub fn delete_fileitem(id: String) {
    let connection = &mut establish_db_connection();

    diesel::delete(dsl::fileitems.filter(dsl::id.eq(id)))
        .execute(connection)
        .expect("Error deleting fileitem");
}

