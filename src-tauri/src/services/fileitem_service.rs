use crate::{
  db::establish_db_connection,
  models::{
    fileitem::{ FileItem, FileItemRequest, init_fileitem },
    items_full_ranges::{ ItemsFullRanges, init_full_range },
    items_fadlist::{ ItemsFadList, init_fad },
    items_artlist_tog::{ ItemsArtListTog, init_art_tog },
    items_artlist_tap::{ ItemsArtListTap, init_art_tap },
    items_art_layers::{ ItemsArtLayers, init_art_layer },
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

  create_fileitem(1);
}

pub fn create_fileitem(count: i32) {
  // id's are T_0, T_1, T_2, etc. so we need to find the highest id and increment it
  let fileitems = list_fileitems();

  fn find_highest_id(fileitems: &Vec<FileItem>) -> i32 {
    let mut highest_id = 0;
    for fileitem in fileitems {
      let id = fileitem.id.split("_").nth(1).unwrap().parse::<i32>().unwrap();
      if id > highest_id {
        highest_id = id;
      }
    }
    highest_id
  }

  let mut i = 0;
  while i < count {
    let new_id = find_highest_id(&fileitems) + 1 + i;

    let fileitem = init_fileitem(new_id.to_string());
    let default_full_range = init_full_range(new_id.to_string());
    let default_fad = init_fad(new_id.to_string());
    let default_art_tog = init_art_tog(new_id.to_string());
    let default_art_tap = init_art_tap(new_id.to_string());
    let default_art_layer = init_art_layer(new_id.to_string());

    store_new_item(&fileitem);
    store_new_full_range(&default_full_range);
    store_new_fad(&default_fad);
    store_new_art_tog(&default_art_tog);
    store_new_art_tap(&default_art_tap);
    store_new_art_layer(&default_art_layer);

    i += 1;
  }
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

  let default_full_range = init_full_range(id.clone());
  let default_fad = init_fad(id.clone());
  let default_art_tog = init_art_tog(id.clone());
  let default_art_tap = init_art_tap(id.clone());
  let default_art_layer = init_art_layer(id.clone());

  store_new_full_range(&default_full_range);
  store_new_fad(&default_fad);
  store_new_art_tog(&default_art_tog);
  store_new_art_tap(&default_art_tap);
  store_new_art_layer(&default_art_layer);
}
