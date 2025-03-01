use crate::{
  db::establish_db_connection,
  models::{
    fileitem::{
      FileItemId,
      FileItem,
      FileItemRequest,
      FullTrackForExport,
      FullTrackListForExport,
      FullTrackWithCounts,
      FullTrackCounts,
      init_fileitem,
    },
    file_metadata::{ FileMetadata },
    items_full_ranges::{ ItemsFullRanges },
    items_fadlist::{ ItemsFadList },
    items_artlist_tog::{ ItemsArtListTog },
    items_artlist_tap::{ ItemsArtListTap },
    items_art_layers::{ ItemsArtLayers },
  },
  schema::{
    fileitems::dsl as fileitems_dsl,
    items_full_ranges::dsl as ranges_dsl,
    items_fadlist::dsl as fadlist_dsl,
    items_artlist_tog::dsl as artlist_tog_dsl,
    items_artlist_tap::dsl as artlist_tap_dsl,
    items_art_layers::dsl as art_layers_dsl,
  },
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
    settings_services::{ Settings },
  },
  commands::{
    items_artlist_tap_commands::{ create_art_tap },
    items_artlist_tog_commands::{ create_art_tog },
    items_art_layers_commands::{ create_art_layer },
    items_fadlist_commands::{ create_fad },
    items_full_ranges_commands::{ create_full_range },
  },
};
use diesel::{ prelude::* };
use serde_json::Value;

pub fn init() {
  let fileitems = list_fileitems();

  if fileitems.len() > 0 {
    return;
  }

  create_fileitem();
}

pub fn create_fileitem() {
  let settings = Settings::get();

  // id's are T_0, T_1, T_2, etc. so we need to find the highest id and increment it
  let fileitems = list_fileitems();

  fn find_highest_id(fileitems: &Vec<FileItem>) -> u32 {
    let mut highest_id = 0;
    for fileitem in fileitems {
      let id = fileitem.id.number().unwrap_or(0); // Default to 0 if None
      if id > highest_id {
        highest_id = id;
      }
    }
    highest_id
  }

  let mut i = 0;
  while i < settings.track_add_count {
    let new_id = find_highest_id(&fileitems) + 1 + (i as u32);

    let fileitem = init_fileitem(new_id.clone().try_into().unwrap());
    //let new_fileitem_id = fileitem.id.clone();

    store_new_item(&fileitem);

    //create_full_range(new_fileitem_id.clone());
    //create_art_tog(new_fileitem_id.clone());
    //create_art_tap(new_fileitem_id.clone());
    //create_art_layer(new_fileitem_id.clone());
    //create_fad(new_fileitem_id.clone());
    i += 1;
  }
}

pub fn create_all_fileitems_from_json(full_data: Value) {
  match serde_json::from_value::<FullTrackListForExport>(full_data) {
    Ok(json) => {
      delete_all_fileitems_and_relations();

      for full_track in json.items {
        let fileitem = full_track.fileitem;
        let full_ranges = full_track.full_ranges;
        let fad_list = full_track.fad_list;
        let art_list_tog = full_track.art_list_tog;
        let art_list_tap = full_track.art_list_tap;
        let art_layers = full_track.art_layers;

        store_new_item(&fileitem);

        for full_range in full_ranges {
          store_new_full_range(&full_range);
        }

        for fad in fad_list {
          store_new_fad(&fad);
        }

        for tog in art_list_tog {
          store_new_art_tog(&tog);
        }

        for tap in art_list_tap {
          store_new_art_tap(&tap);
        }

        for layer in art_layers {
          store_new_art_layer(&layer);
        }
      }
    }
    Err(e) => {
      eprintln!("JSON does not match schema: {:?}", e);
    }
  }
}

pub fn list_all_fileitems_and_relations_for_json_export() -> FullTrackListForExport {
  let fileitems_and_relations = list_all_fileitems_and_relations();

  FullTrackListForExport {
    file_meta_data: FileMetadata {
      file_name: "".to_string(),
      file_created_date: "".to_string(),
    },
    items: fileitems_and_relations,
  }
}

pub fn list_all_fileitems_and_relations() -> Vec<FullTrackForExport> {
  let fileitems = list_fileitems();

  let mut fileitems_and_relations = Vec::new();

  for fileitem in fileitems {
    get_fileitem_and_relations(fileitem.id.clone()).map(|full_track| {
      fileitems_and_relations.push(full_track);
    });
  }

  fileitems_and_relations
}

pub fn list_all_fileitems_and_relation_counts() -> Vec<FullTrackWithCounts> {
  let fileitems = list_fileitems();

  let mut fileitems_and_relations_counts = Vec::new();

  for fileitem in fileitems {
    get_fileitem_and_relations(fileitem.id.clone()).map(|full_track| {
      let full_track_with_counts = FullTrackWithCounts {
        fileitem: full_track.fileitem,
        _count: FullTrackCounts {
          full_ranges: full_track.full_ranges.len() as i32,
          fad_list: full_track.fad_list.len() as i32,
          art_list_tog: full_track.art_list_tog.len() as i32,
          art_list_tap: full_track.art_list_tap.len() as i32,
          art_layers: full_track.art_layers.len() as i32,
        },
      };

      fileitems_and_relations_counts.push(full_track_with_counts);
    });
  }

  fileitems_and_relations_counts
}

pub fn get_fileitem_and_relations(
  id: FileItemId
) -> Option<FullTrackForExport> {
  let fileitem = get_fileitem(id.clone());

  let full_ranges = list_items_full_ranges(format!("{:?}", id.clone()));
  let fad_list = list_items_fadlist(format!("{:?}", id.clone()));
  let art_list_tog = list_items_artlist_tog(format!("{:?}", id.clone()));
  let art_list_tap = list_items_artlist_tap(format!("{:?}", id.clone()));
  let art_layers = list_items_art_layers(format!("{:?}", id.clone()));

  let full_track_for_export: Option<FullTrackForExport> = Some(
    FullTrackForExport {
      fileitem: fileitem?,
      full_ranges: full_ranges,
      fad_list: fad_list,
      art_list_tog: art_list_tog,
      art_list_tap: art_list_tap,
      art_layers: art_layers,
    }
  );

  full_track_for_export
}

pub fn list_fileitems() -> Vec<FileItem> {
  let connection = &mut establish_db_connection();

  let mut fileitems = fileitems_dsl::fileitems
    .select(FileItem::as_select())
    .load::<FileItem>(connection)
    .expect("Error loading fileitems");

  fileitems.sort_by(|a, b| {
    let a_id_number = a.id.number();
    let b_id_number = b.id.number();
    a_id_number.cmp(&b_id_number)
  });

  fileitems
}

pub fn get_fileitem(id: FileItemId) -> Option<FileItem> {
  let connection = &mut establish_db_connection();

  fileitems_dsl::fileitems
    .select(FileItem::as_select())
    .filter(fileitems_dsl::id.eq(id))
    .first::<FileItem>(connection)
    .ok()
}

pub fn store_new_item(new_item: &FileItem) {
  let connection = &mut establish_db_connection();

  diesel
    ::insert_into(fileitems_dsl::fileitems)
    .values(new_item)
    .execute(connection)
    .expect("Error saving new fileitem");
}

pub fn delete_fileitem(id: FileItemId) {
  let connection = &mut establish_db_connection();

  diesel
    ::delete(fileitems_dsl::fileitems.filter(fileitems_dsl::id.eq(id)))
    .execute(connection)
    .expect("Error deleting fileitem");
}

pub fn delete_all_fileitems() {
  let connection = &mut establish_db_connection();

  diesel
    ::delete(fileitems_dsl::fileitems)
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
    ::update(fileitems_dsl::fileitems.filter(fileitems_dsl::id.eq(data.id)))

    .set(&new_fileitem)
    .execute(connection)
    .expect("Error updating fileitem");
}

pub fn delete_all_fileitems_and_relations() {
  delete_all_art_layers();
  delete_all_art_tap();
  delete_all_art_tog();
  delete_all_fad();
  delete_all_full_ranges();
  delete_all_fileitems();
}

pub fn delete_fileitem_and_relations(id: FileItemId) {
  let must_have_one = list_fileitems();

  if must_have_one.len() <= 1 {
    return;
  }

  //delete_all_art_layers_for_fileitem(id.clone());
  //delete_all_art_tap_for_fileitem(id.clone());
  //delete_all_art_tog_for_fileitem(id.clone());
  //delete_all_fad_for_fileitem(id.clone());
  //delete_all_full_ranges_for_fileitem(id.clone());
  delete_fileitem(id.clone());
}

pub fn clear_fileitem(id: FileItemId) {
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

  //delete_all_art_layers_for_fileitem(id.clone());
  //delete_all_art_tap_for_fileitem(id.clone());
  //delete_all_art_tog_for_fileitem(id.clone());
  //delete_all_fad_for_fileitem(id.clone());
  //delete_all_full_ranges_for_fileitem(id.clone());

  //create_full_range(id.clone());
  //create_art_tog(id.clone());
  //create_art_tap(id.clone());
  //create_art_layer(id.clone());
  //create_fad(id.clone());
}

pub fn renumber_all_fileitems() -> Vec<FileItem> {
  let connection = &mut establish_db_connection();

  let mut fileitems = list_fileitems();

  // id's are T_0, T_1, T_2, etc.
  //fn split_item_id(id: FileItemId) -> i32 {
  //id.split("_").nth(1).unwrap().parse::<i32>().unwrap()
  //}

  // sub id's are T_0_FR_0, T_0_FR_1, T_0_FR_2, etc.
  //fn split_sub_item_id(id: &str) -> i32 {
  //  id.split("_").nth(3).unwrap().parse::<i32>().unwrap()
  //}

  fn sort_by_id(a: &FileItem, b: &FileItem) -> std::cmp::Ordering {
    a.id.number().cmp(&b.id.number())
  }

  fileitems.sort_by(sort_by_id);

  //let mut i = 0;
  //for fileitem in fileitems {
  //  let full_ranges = list_items_full_ranges(fileitem.id.clone());
  //  let fad_list = list_items_fadlist(fileitem.id.clone());
  //  let art_list_tog = list_items_artlist_tog(fileitem.id.clone());
  //  let art_list_tap = list_items_artlist_tap(fileitem.id.clone());
  //  let art_layers = list_items_art_layers(fileitem.id.clone());

  //  let new_fileitem = FileItem {
  //    id: format!("T_{}", i),
  //    ..fileitem
  //  };

  //  diesel
  //    ::update(
  //      fileitems_dsl::fileitems.filter(
  //        fileitems_dsl::id.eq(fileitem.id.clone())
  //      )
  //    )

  //    .set(&new_fileitem)
  //    .execute(connection)
  //    .expect("Error updating fileitem");

  //  for full_range in full_ranges {
  //    let range_id = split_sub_item_id(&full_range.id);
  //    let new_full_range = ItemsFullRanges {
  //      id: format!("T_{}_FR_{}", i, range_id),
  //      fileitems_item_id: format!("T_{}", i),
  //      ..full_range
  //    };

  //    diesel
  //      ::update(
  //        ranges_dsl::items_full_ranges.filter(
  //          ranges_dsl::id.eq(full_range.id.clone())
  //        )
  //      )
  //      .set(&new_full_range)
  //      .execute(connection)
  //      .expect("Error updating range");
  //  }

  //  for fad in fad_list {
  //    let fad_id = split_sub_item_id(&fad.id);
  //    let new_fad = ItemsFadList {
  //      id: format!("T_{}_FL_{}", i, fad_id),
  //      fileitems_item_id: format!("T_{}", i),
  //      ..fad
  //    };

  //    diesel
  //      ::update(
  //        fadlist_dsl::items_fadlist.filter(fadlist_dsl::id.eq(fad.id.clone()))
  //      )
  //      .set(&new_fad)
  //      .execute(connection)
  //      .expect("Error updating fad");
  //  }

  //  for tog in &art_list_tog {
  //    let tog_id = split_sub_item_id(&tog.id);
  //    let new_tog = ItemsArtListTog {
  //      id: format!("T_{}_AT_{}", i, tog_id),
  //      fileitems_item_id: format!("T_{}", i),
  //      ..tog.clone()
  //    };

  //    diesel
  //      ::update(
  //        artlist_tog_dsl::items_artlist_tog.filter(
  //          artlist_tog_dsl::id.eq(tog.id.clone())
  //        )
  //      )
  //      .set(&new_tog)
  //      .execute(connection)
  //      .expect("Error updating tog");
  //  }

  //  for tap in art_list_tap {
  //    let tap_id = split_sub_item_id(&tap.id) + (art_list_tog.len() as i32);
  //    let new_tap = ItemsArtListTap {
  //      id: format!("T_{}_AT_{}", i, tap_id),
  //      fileitems_item_id: format!("T_{}", i),
  //      ..tap
  //    };

  //    diesel
  //      ::update(
  //        artlist_tap_dsl::items_artlist_tap.filter(
  //          artlist_tap_dsl::id.eq(tap.id.clone())
  //        )
  //      )
  //      .set(&new_tap)
  //      .execute(connection)
  //      .expect("Error updating tap");
  //  }

  //  for layer in art_layers {
  //    let layer_id = split_sub_item_id(&layer.id);
  //    let new_layer = ItemsArtLayers {
  //      id: format!("T_{}_AL_{}", i, layer_id),
  //      fileitems_item_id: format!("T_{}", i),
  //      ..layer
  //    };

  //    diesel
  //      ::update(
  //        art_layers_dsl::items_art_layers.filter(
  //          art_layers_dsl::id.eq(layer.id.clone())
  //        )
  //      )
  //      .set(&new_layer)
  //      .execute(connection)
  //      .expect("Error updating layer");
  //  }

  //  i += 1;
  //}

  list_fileitems()
}
