use crate::{
  db::establish_db_connection,
  models::{
    fileitem::{ FileItem, FileItemRequest },
    items_full_ranges::{ ItemsFullRanges },
    items_fadlist::{ ItemsFadList },
    items_artlist_tog::{ ItemsArtListTog },
    items_artlist_tap::{ ItemsArtListTap },
    items_art_layers::{ ItemsArtLayers },
  },
  schema::fileitems::dsl,
  services::{
    items_full_ranges_service::{
      store_new_full_range,
      list_items_full_ranges,
      delete_all_full_ranges,
      delete_all_full_ranges_for_fileitem,
    },
    items_fadlist_service::{
      store_new_fad,
      list_items_fadlist,
      delete_all_fad,
      delete_all_fad_for_fileitem,
    },
    items_artlist_tog_service::{
      store_new_art_tog,
      list_items_artlist_tog,
      delete_all_art_tog,
      delete_all_art_tog_for_fileitem,
    },
    items_artlist_tap_service::{
      store_new_art_tap,
      list_items_artlist_tap,
      delete_all_art_tap,
      delete_all_art_tap_for_fileitem,
    },
    items_art_layers_service::{
      store_new_art_layer,
      list_items_art_layers,
      delete_all_art_layers,
      delete_all_art_layers_for_fileitem,
    },
  },
};
use diesel::prelude::*;
use serde::{ Serialize };

pub fn init() {
  let fileitems = list_fileitems();

  if fileitems.len() > 0 {
    return;
  }

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

  let default_full_range = ItemsFullRanges {
    id: "T_0_FR_0".to_string(),
    name: "".to_string(),
    low: "C-2".to_string(),
    high: "B8".to_string(),
    white_keys_only: false,
    fileItemsItemId: "T_0".to_string(),
  };

  let default_fad = ItemsFadList {
    id: "T_0_FL_0".to_string(),
    name: "".to_string(),
    code_type: "/control".to_string(),
    code: 0,
    default: 0,
    change_type: "Value 2".to_string(),
    fileItemsItemId: "T_0".to_string(),
  };

  let default_art_tog = ItemsArtListTog {
    id: "T_0_AT_0".to_string(),
    name: "".to_string(),
    toggle: false,
    code_type: "/control".to_string(),
    code: 0,
    on: 127,
    off: 0,
    default: "On".to_string(),
    delay: 0,
    change_type: "Value 2".to_string(),
    ranges: "[\"T_0_FR_0\"]".to_string(),
    art_layers: "[\"\"]".to_string(),
    fileItemsItemId: "T_0".to_string(),
  };

  let default_art_tap = ItemsArtListTap {
    id: "T_0_AT_1".to_string(),
    name: "".to_string(),
    toggle: false,
    code_type: "/control".to_string(),
    code: 0,
    on: 127,
    off: 0,
    default: false,
    delay: 0,
    change_type: "Value 2".to_string(),
    ranges: "[\"T_0_FR_0\"]".to_string(),
    art_layers: "[\"\"]".to_string(),
    fileItemsItemId: "T_0".to_string(),
  };

  let default_art_layer = ItemsArtLayers {
    id: "T_0_AL_0".to_string(),
    name: "".to_string(),
    code_type: "/control".to_string(),
    code: 0,
    on: 127,
    off: 0,
    default: "Off".to_string(),
    change_type: "Value 2".to_string(),
    fileItemsItemId: "T_0".to_string(),
  };

  store_new_item(&default_fileitem);
  store_new_full_range(&default_full_range);
  store_new_fad(&default_fad);
  store_new_art_tog(&default_art_tog);
  store_new_art_tap(&default_art_tap);
  store_new_art_layer(&default_art_layer);
}

#[derive(Serialize)]
pub struct FullTrackListForExport {
  #[serde(flatten)]
  fileitem: FileItem,
  full_ranges: Vec<ItemsFullRanges>,
  fad_list: Vec<ItemsFadList>,
  art_tog: Vec<ItemsArtListTog>,
  art_tap: Vec<ItemsArtListTap>,
  art_layers: Vec<ItemsArtLayers>,
}

pub fn list_fileitems_and_relations() -> Vec<FullTrackListForExport> {
  let fileitems = list_fileitems();

  let mut fileitems_and_relations = Vec::new();

  for fileitem in fileitems {
    let full_ranges = list_items_full_ranges(fileitem.id.clone());
    let fad_list = list_items_fadlist(fileitem.id.clone());
    let art_tog = list_items_artlist_tog(fileitem.id.clone());
    let art_tap = list_items_artlist_tap(fileitem.id.clone());
    let art_layers = list_items_art_layers(fileitem.id.clone());

    fileitems_and_relations.push(FullTrackListForExport {
      fileitem: fileitem,
      full_ranges: full_ranges,
      fad_list: fad_list,
      art_tog: art_tog,
      art_tap: art_tap,
      art_layers: art_layers,
    });
  }

  fileitems_and_relations
}

#[derive(Serialize)]
pub struct FullTrackListCounts {
  art_list_tog: i32,
  art_list_tap: i32,
  art_layers: i32,
  fad_list: i32,
  full_ranges: i32,
}

#[derive(Serialize)]
pub struct FullTrackListWithCounts {
  #[serde(flatten)]
  fileitem: FileItem,
  _count: FullTrackListCounts,
}

pub fn list_fileitems_and_relation_counts() -> Vec<FullTrackListWithCounts> {
  let fileitems = list_fileitems();

  let mut fileitems_and_relations = Vec::new();

  for fileitem in fileitems {
    let full_ranges = list_items_full_ranges(fileitem.id.clone());
    let fad_list = list_items_fadlist(fileitem.id.clone());
    let art_tog = list_items_artlist_tog(fileitem.id.clone());
    let art_tap = list_items_artlist_tap(fileitem.id.clone());
    let art_layers = list_items_art_layers(fileitem.id.clone());

    fileitems_and_relations.push(FullTrackListWithCounts {
      fileitem: fileitem,
      _count: FullTrackListCounts {
        art_list_tog: art_tog.len() as i32,
        art_list_tap: art_tap.len() as i32,
        art_layers: art_layers.len() as i32,
        fad_list: fad_list.len() as i32,
        full_ranges: full_ranges.len() as i32,
      },
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

pub fn get_fileitem_and_relations(
  id: String
) -> Option<FullTrackListForExport> {
  let fileitem = get_fileitem(id.clone());

  let full_ranges = list_items_full_ranges(id.clone());
  let fad_list = list_items_fadlist(id.clone());
  let art_tog = list_items_artlist_tog(id.clone());
  let art_tap = list_items_artlist_tap(id.clone());
  let art_layers = list_items_art_layers(id.clone());

  let FullTrackListForExport: Option<FullTrackListForExport> = Some(
    FullTrackListForExport {
      fileitem: fileitem?,
      full_ranges: full_ranges,
      fad_list: fad_list,
      art_tog: art_tog,
      art_tap: art_tap,
      art_layers: art_layers,
    }
  );

  FullTrackListForExport
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

pub fn delete_all_fileitems() {
  let connection = &mut establish_db_connection();

  diesel
    ::delete(dsl::fileitems)
    .execute(connection)
    .expect("Error deleting fileitems");
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

pub fn delete_all_fileitems_and_relations() {
  let connection = &mut establish_db_connection();
  delete_all_fileitems();
  delete_all_art_layers();
  delete_all_art_tap();
  delete_all_art_tog();
  delete_all_fad();
  delete_all_full_ranges();
}

pub fn delete_fileitem_and_relations(id: String) {
  let connection = &mut establish_db_connection();

  let must_have_one = list_fileitems();

  if must_have_one.len() <= 1 {
    return;
  }

  delete_fileitem(id.clone());
  delete_all_art_layers_for_fileitem(id.clone());
  delete_all_art_tap_for_fileitem(id.clone());
  delete_all_art_tog_for_fileitem(id.clone());
  delete_all_fad_for_fileitem(id.clone());
  delete_all_full_ranges_for_fileitem(id.clone());
}

pub fn clear_fileitem(id: String) {
  let connection = &mut establish_db_connection();

  let fileitem = FileItemRequest {
    id: id.clone(),
    locked: Some(false),
    name: Some("".to_string()),
    notes: Some("".to_string()),
    channel: Some(1),
    base_delay: Some(0.0),
    avg_delay: Some(0.0),
    vep_out: Some("N/A".to_string()),
    vep_instance: Some("N/A".to_string()),
    smp_number: Some("N/A".to_string()),
    smp_out: Some("N/A".to_string()),
    color: Some("#71717A".to_string()),
  };

  update_fileitem(fileitem);

  delete_all_art_layers_for_fileitem(id.clone());
  delete_all_art_tap_for_fileitem(id.clone());
  delete_all_art_tog_for_fileitem(id.clone());
  delete_all_fad_for_fileitem(id.clone());
  delete_all_full_ranges_for_fileitem(id.clone());

  let default_full_range = ItemsFullRanges {
    id: format!("T_{}_FR_0", id.clone()),
    name: "".to_string(),
    low: "C-2".to_string(),
    high: "B8".to_string(),
    white_keys_only: false,
    fileItemsItemId: id.clone(),
  };

  store_new_full_range(&default_full_range);

  let default_fad = ItemsFadList {
    id: format!("T_{}_FL_0", id.clone()),
    name: "".to_string(),
    code_type: "/control".to_string(),
    code: 0,
    default: 0,
    change_type: "Value 2".to_string(),
    fileItemsItemId: id.clone(),
  };

  store_new_fad(&default_fad);

  let default_art_tog = ItemsArtListTog {
    id: format!("T_{}_AT_0", id.clone()),
    name: "".to_string(),
    toggle: true,
    code_type: "/control".to_string(),
    code: 0,
    on: 127,
    off: 0,
    default: "On".to_string(),
    delay: 0,
    change_type: "Value 2".to_string(),
    ranges: format!("[\"T_{}_FR_0\"]", id.clone()),
    art_layers: "[\"\"]".to_string(),
    fileItemsItemId: id.clone(),
  };

  store_new_art_tog(&default_art_tog);

  let default_art_tap = ItemsArtListTap {
    id: format!("T_{}_AT_1", id.clone()),
    name: "".to_string(),
    toggle: false,
    code_type: "/control".to_string(),
    code: 0,
    on: 127,
    off: 0,
    default: false,
    delay: 0,
    change_type: "Value 2".to_string(),
    ranges: format!("[\"T_{}_FR_0\"]", id.clone()),
    art_layers: "[\"\"]".to_string(),
    fileItemsItemId: id.clone(),
  };

  store_new_art_tap(&default_art_tap);

  let default_art_layer = ItemsArtLayers {
    id: format!("T_{}_AL_0", id.clone()),
    name: "".to_string(),
    code_type: "/control".to_string(),
    code: 0,
    on: 127,
    off: 0,
    default: "Off".to_string(),
    change_type: "Value 2".to_string(),
    fileItemsItemId: id.clone(),
  };

  store_new_art_layer(&default_art_layer);
}
