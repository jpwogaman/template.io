use crate::{
  db::establish_db_connection,
  models::{
    fileitem::{ FileItem, FileItemRequest },
    items_full_ranges::{ ItemsFullRanges },
  },
  schema::fileitems::dsl,
  services::{
    items_full_ranges_service::{ store_new_full_range, list_items_full_ranges },
  },
};
use diesel::prelude::*;
use serde::{ Serialize };

pub fn init() {
  let fileitems = list_fileitems();

  if fileitems.len() > 0 {
    return;
  }

  let default_full_range = ItemsFullRanges {
    id: "T_0_FR_0".to_string(),
    name: "".to_string(),
    low: "C-2".to_string(),
    high: "B8".to_string(),
    white_keys_only: false,
    fileItemsItemId: "T_0".to_string(),
  };

  let default_fileitem = FileItem {
    id: "T_0".to_string(),
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
  store_new_full_range(&default_full_range);
}

#[derive(Serialize)]
pub struct NewFileItem {
  #[serde(flatten)]
  fileitem: FileItem,
  full_ranges: Vec<ItemsFullRanges>,
}

pub fn list_fileitems_and_relations() -> Vec<NewFileItem> {
  let fileitems = list_fileitems();

  let mut fileitems_and_relations = Vec::new();

  for fileitem in fileitems {
    let full_ranges = list_items_full_ranges(fileitem.id.clone());

    fileitems_and_relations.push(NewFileItem {
      fileitem: fileitem,
      full_ranges: full_ranges,
    });  
  }

  fileitems_and_relations

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

  dsl::fileitems.filter(dsl::id.eq(id)).first::<FileItem>(connection).ok()
}

pub fn store_new_item(new_item: &FileItem) {
  let connection = &mut establish_db_connection();

  diesel
    ::insert_into(dsl::fileitems)
    .values(new_item)
    .execute(connection)
    .expect("Error saving new fileitem");
}

pub fn delete_fileitem(id: String) {
  let connection = &mut establish_db_connection();

  diesel
    ::delete(dsl::fileitems.filter(dsl::id.eq(id)))
    .execute(connection)
    .expect("Error deleting fileitem");
}

pub fn update_fileitem(data: FileItemRequest) {
  let connection = &mut establish_db_connection();

  let original_fileitem = get_fileitem(data.id.clone()).unwrap();

  let new_fileitem = FileItem {
    id: data.id.clone(),
    locked: data.locked.unwrap_or(original_fileitem.locked),
    name: data.name.clone().unwrap_or(original_fileitem.name),
    notes: data.notes.clone().unwrap_or(original_fileitem.notes),
    channel: data.channel.unwrap_or(original_fileitem.channel),
    base_delay: data.base_delay.unwrap_or(original_fileitem.base_delay),
    avg_delay: data.avg_delay.unwrap_or(original_fileitem.avg_delay),
    vep_out: data.vep_out.clone().unwrap_or(original_fileitem.vep_out),
    vep_instance: data.vep_instance
      .clone()
      .unwrap_or(original_fileitem.vep_instance),
    smp_number: data.smp_number.clone().unwrap_or(original_fileitem.smp_number),
    smp_out: data.smp_out.clone().unwrap_or(original_fileitem.smp_out),
    color: data.color.clone().unwrap_or(original_fileitem.color),
  };

  diesel
    ::update(dsl::fileitems.filter(dsl::id.eq(data.id)))
    .set(&new_fileitem)
    .execute(connection)
    .expect("Error updating fileitem");
}
