use crate::{
  db::establish_db_connection,
  models::{
    fileitem::{
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
    settings::{ normalize_hex, init_settings },
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
use std::collections::HashSet;

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

  fn find_highest_id(fileitems: &Vec<FileItem>) -> i32 {
    let mut highest_id = 0;
    if fileitems.len() < 1 {
      return -1;
    }
    for fileitem in fileitems {
      let id = fileitem.id.split("_").nth(1).unwrap().parse::<i32>().unwrap();
      if id > highest_id {
        highest_id = id;
      }
    }
    highest_id
  }

  let mut i = 0;
  while i < settings.track_add_count {
    let new_id = (find_highest_id(&fileitems) + 1 + i).to_string();

    let fileitem = init_fileitem(new_id.clone());
    let new_fileitem_id = fileitem.id.clone();

    store_new_item(&fileitem);

    create_full_range(new_fileitem_id.clone());
    create_art_tog(new_fileitem_id.clone());
    create_art_tap(new_fileitem_id.clone());
    create_art_layer(new_fileitem_id.clone());
    create_fad(new_fileitem_id.clone());
    i += 1;
  }
}

pub fn create_all_fileitems_from_json(full_data: Value) {
  // Step 1: Transform old schema fields if necessary
  let mut transformed_data = full_data.clone();

  println!("---------BEGIN SCHEMA CHECK--------");

  if
    let Some(items) = transformed_data
      .get_mut("items")
      .and_then(|i| i.as_array_mut())
  {
    for item in items {
      if
        let Some(art_list_tog) = item
          .get_mut("art_list_tog")
          .and_then(|tog| tog.as_array_mut())
      {
        for tog in art_list_tog {
          if let Some(art_layers) = tog.get("art_layers") {
            // Convert to new schema
            let original = art_layers.clone();
            let art_layers_on = original.clone();
            let art_layers_off = Value::String("[]".to_string()); // Empty array as string replacement

            // Apply changes
            tog
              .as_object_mut()
              .unwrap()
              .insert("art_layers_on".to_string(), art_layers_on);
            tog
              .as_object_mut()
              .unwrap()
              .insert("art_layers_off".to_string(), art_layers_off);
            tog.as_object_mut().unwrap().remove("art_layers"); // Remove old field

            println!(
              "Transformed tog {}: art_layers -> art_layers_on: {:?}, art_layers_off: []\n-----",
              tog.get("id").unwrap_or(&Value::String("unknown".to_string())),
              original
            );
          } else {
            println!("---------TOG PASSED--------");
          }
        }
      }
      if
        let Some(art_list_tap) = item
          .get_mut("art_list_tap")
          .and_then(|tap| tap.as_array_mut())
      {
        for tap in art_list_tap {
          if let Some(tap_obj) = tap.as_object_mut() {
            if !tap_obj.contains_key("layers_together") {
              tap_obj.insert("layers_together".to_string(), false.into());

              println!(
                "Transformed tap {}: Added layers_together: false\n-----",
                tap_obj
                  .get("id")
                  .unwrap_or(&Value::String("unknown".to_string()))
              );
            }
            if !tap_obj.contains_key("default_layer") {
              tap_obj.insert(
                "default_layer".to_string(),
                Value::String("".to_string())
              );

              println!(
                "Transformed tap {}: Added default_layer: \"\"\n-----",
                tap_obj
                  .get("id")
                  .unwrap_or(&Value::String("unknown".to_string()))
              );
            }

            if
              tap_obj.contains_key("default_layer") &&
              tap_obj.contains_key("layers_together")
            {
              println!("---------TAP PASSED--------");
            }
          }
        }
      }
      if
        let Some(art_layers) = item
          .get_mut("art_layers")
          .and_then(|layer| layer.as_array_mut())
      {
        for layer in art_layers {
          let layer_obj = layer.as_object_mut().unwrap();
          let mut removed_fields = Vec::new();

          if layer_obj.remove("off").is_some() {
            removed_fields.push("off");
          }
          if layer_obj.remove("default").is_some() {
            removed_fields.push("default");
          }
          if layer_obj.remove("change_type").is_some() {
            removed_fields.push("change_type");
          }

          if !removed_fields.is_empty() {
            println!(
              "Transformed layer {}: Removed fields: {:?}\n-----",
              layer_obj
                .get("id")
                .unwrap_or(&Value::String("unknown".to_string())),
              removed_fields
            );
          } else {
            println!("---------LAYER PASSED--------");
          }
        }
      }
    }
  }

  println!("---------END SCHEMA CHECK--------");
  // Step 2: Now deserialize the cleaned-up JSON into the new schema
  match serde_json::from_value::<FullTrackListForExport>(transformed_data) {
    Ok(json) => {
      delete_all_fileitems_and_relations();

      let mut settings = Settings::get();
      let default_colors = init_settings().default_colors;
      settings.default_colors = default_colors;
      settings.set();

      let mut new_colors: HashSet<String> = HashSet::new();

      for full_track in json.items {
        let fileitem = full_track.fileitem;
        let full_ranges = full_track.full_ranges;
        let fad_list = full_track.fad_list;
        let art_list_tog = full_track.art_list_tog;
        let art_list_tap = full_track.art_list_tap;
        let art_layers = full_track.art_layers;

        // Collect colors from the current track and normalize them
        collect_colors_from_track(&fileitem, &mut new_colors);

        // Store other track data
        store_new_item(&fileitem);

        // Collect valid layer IDs into a HashSet for fast lookup
        let valid_layer_ids: HashSet<String> = art_layers
          .clone()
          .into_iter()
          .map(|layer| layer.id)
          .collect();

        // Collect valid range IDs into a HashSet for fast lookup
        let valid_range_ids: HashSet<String> = full_ranges
          .clone()
          .into_iter()
          .map(|range| range.id)
          .collect();

        for full_range in full_ranges {
          store_new_full_range(&full_range);
        }

        for mut tog in art_list_tog {
          filter_and_log_ids(
            &mut tog.art_layers_on,
            &valid_layer_ids,
            &tog.id,
            "tog",
            "art_layers_on"
          );
          filter_and_log_ids(
            &mut tog.art_layers_off,
            &valid_layer_ids,
            &tog.id,
            "tog",
            "art_layers_off"
          );
          filter_and_log_ids(
            &mut tog.ranges,
            &valid_range_ids,
            &tog.id,
            "tog",
            "ranges"
          );

          store_new_art_tog(&tog);
        }

        for mut tap in art_list_tap {
          filter_and_log_ids(
            &mut tap.art_layers,
            &valid_layer_ids,
            &tap.id,
            "tap",
            "art_layers"
          );
          filter_and_log_default_layer(
            &mut tap.default_layer,
            &valid_layer_ids,
            &tap.id,
            "tap",
            "default_layer"
          );
          filter_and_log_ids(
            &mut tap.ranges,
            &valid_range_ids,
            &tap.id,
            "tap",
            "ranges"
          );

          store_new_art_tap(&tap);
        }

        for layer in art_layers {
          store_new_art_layer(&layer);
        }

        for fad in fad_list {
          store_new_fad(&fad);
        }
      }

      // Update the settings with the new colors
      add_colors_to_settings(new_colors);
    }
    Err(e) => {
      eprintln!("JSON does not match schema: {:?}", e);
    }
  }
}

fn filter_and_log_ids(
  ids: &mut String,
  valid_ids: &HashSet<String>,
  id: &str,
  label: &str,
  field: &str
) {
  if ids == "[\"\"]" {
    *ids = "[]".to_string();
    return;
  }

  match serde_json::from_str::<Vec<String>>(ids) {
    Ok(mut parsed_ids) => {
      let original_ids = parsed_ids.clone();

      // Retain only valid IDs
      parsed_ids.retain(|item_id| valid_ids.contains(item_id));

      // Log what was removed
      if parsed_ids != original_ids {
        let removed_ids: Vec<_> = original_ids
          .into_iter()
          .filter(|item_id| !parsed_ids.contains(item_id))
          .collect();

        if !removed_ids.is_empty() {
          println!(
            "Edited {} {}: Removed {:?} from {} \nNew Value {:?}\n----------",
            label,
            id,
            removed_ids,
            field,
            serde_json::to_string(&parsed_ids).unwrap_or("[]".to_string())
          );
        }
      }

      // Update the stringified array
      *ids = serde_json::to_string(&parsed_ids).unwrap_or("[]".to_string());
    }
    Err(e) =>
      eprintln!("Failed to parse {} for {} {}: {}", field, label, id, e),
  }
}

fn filter_and_log_default_layer( 
  id: &mut String,
  valid_ids: &HashSet<String>,
  item_id: &str,
  label: &str,
  field: &str
) {
  if id.is_empty() || id == "[\"\"]" {    
    *id = "".to_string();
    return;
  }

  if !valid_ids.contains(id) {
    println!(
      "Edited {} {}: Removed invalid {} from {} \nNew Value \"\"\n----------",
      label,
      item_id,
      id,
      field
    );
    *id = "".to_string();
  }
}

fn collect_colors_from_track(
  fileitem: &FileItem,
  new_colors: &mut HashSet<String>
) {
  if let Some(valid_color) = normalize_hex(&fileitem.color) {
    new_colors.insert(valid_color);
  }
}

fn add_colors_to_settings(new_colors: HashSet<String>) {
  let mut settings = Settings::get();
  // Add the new colors to the settings, ensuring no duplicates
  for color in new_colors {
    settings.default_colors.insert(color);
  }

  settings.normalize_colors();
  settings.set();
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

pub fn get_fileitem_and_relations(id: String) -> Option<FullTrackForExport> {
  let fileitem = get_fileitem(id.clone());

  let full_ranges = list_items_full_ranges(id.clone());
  let fad_list = list_items_fadlist(id.clone());
  let art_list_tog = list_items_artlist_tog(id.clone());
  let art_list_tap = list_items_artlist_tap(id.clone());
  let art_layers = list_items_art_layers(id.clone());

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
    .load::<FileItem>(connection)
    .expect("Error loading fileitems");

  fileitems.sort_by(|a, b| {
    let a_id_number = a.id
      .split('_')
      .nth(1)
      .and_then(|num| num.parse::<i32>().ok())
      .unwrap_or(0);
    let b_id_number = b.id
      .split('_')
      .nth(1)
      .and_then(|num| num.parse::<i32>().ok())
      .unwrap_or(0);
    a_id_number.cmp(&b_id_number)
  });

  fileitems
}

pub fn get_fileitem(id: String) -> Option<FileItem> {
  let connection = &mut establish_db_connection();

  fileitems_dsl::fileitems
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

pub fn delete_fileitem(id: String) {
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
  let new_fileitem = original_fileitem.update_from(data.clone());

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

pub fn delete_fileitem_and_relations(id: String) {
  let must_have_one = list_fileitems();

  if must_have_one.len() <= 1 {
    return;
  }

  delete_all_art_layers_for_fileitem(id.clone());
  delete_all_art_tap_for_fileitem(id.clone());
  delete_all_art_tog_for_fileitem(id.clone());
  delete_all_fad_for_fileitem(id.clone());
  delete_all_full_ranges_for_fileitem(id.clone());
  delete_fileitem(id.clone());
}

pub fn clear_fileitem(id: String) {
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

  delete_all_full_ranges_for_fileitem(id.clone());
  delete_all_art_tog_for_fileitem(id.clone());
  delete_all_art_tap_for_fileitem(id.clone());
  delete_all_art_layers_for_fileitem(id.clone());
  delete_all_fad_for_fileitem(id.clone());

  create_full_range(id.clone());
  create_art_tog(id.clone());
  create_art_tap(id.clone());
  create_art_layer(id.clone());
  create_fad(id.clone());
}

pub fn renumber_all_fileitems() -> Vec<FileItem> {
  let connection = &mut establish_db_connection();

  let mut fileitems = list_fileitems();

  // id's are T_0, T_1, T_2, etc.
  fn split_item_id(id: &str) -> i32 {
    id.split("_").nth(1).unwrap().parse::<i32>().unwrap()
  }

  // sub id's are T_0_FR_0, T_0_FR_1, T_0_FR_2, etc.
  fn split_sub_item_id(id: &str) -> i32 {
    id.split("_").nth(3).unwrap().parse::<i32>().unwrap()
  }

  fn sort_by_id(a: &FileItem, b: &FileItem) -> std::cmp::Ordering {
    split_item_id(&a.id).cmp(&split_item_id(&b.id))
  }

  fileitems.sort_by(sort_by_id);

  let mut i = 0;
  for fileitem in fileitems {
    let full_ranges = list_items_full_ranges(fileitem.id.clone());
    let fad_list = list_items_fadlist(fileitem.id.clone());
    let art_list_tog = list_items_artlist_tog(fileitem.id.clone());
    let art_list_tap = list_items_artlist_tap(fileitem.id.clone());
    let art_layers = list_items_art_layers(fileitem.id.clone());

    let new_fileitem = FileItem {
      id: format!("T_{}", i),
      ..fileitem
    };

    diesel
      ::update(
        fileitems_dsl::fileitems.filter(
          fileitems_dsl::id.eq(fileitem.id.clone())
        )
      )

      .set(&new_fileitem)
      .execute(connection)
      .expect("Error updating fileitem");

    for full_range in full_ranges {
      let range_id = split_sub_item_id(&full_range.id);
      let new_full_range = ItemsFullRanges {
        id: format!("T_{}_FR_{}", i, range_id),
        fileitems_item_id: format!("T_{}", i),
        ..full_range
      };

      diesel
        ::update(
          ranges_dsl::items_full_ranges.filter(
            ranges_dsl::id.eq(full_range.id.clone())
          )
        )
        .set(&new_full_range)
        .execute(connection)
        .expect("Error updating range");
    }

    for fad in fad_list {
      let fad_id = split_sub_item_id(&fad.id);
      let new_fad = ItemsFadList {
        id: format!("T_{}_FL_{}", i, fad_id),
        fileitems_item_id: format!("T_{}", i),
        ..fad
      };

      diesel
        ::update(
          fadlist_dsl::items_fadlist.filter(fadlist_dsl::id.eq(fad.id.clone()))
        )
        .set(&new_fad)
        .execute(connection)
        .expect("Error updating fad");
    }

    for tog in &art_list_tog {
      let tog_id = split_sub_item_id(&tog.id);
      let new_tog = ItemsArtListTog {
        id: format!("T_{}_AT_{}", i, tog_id),
        fileitems_item_id: format!("T_{}", i),
        ..tog.clone()
      };

      diesel
        ::update(
          artlist_tog_dsl::items_artlist_tog.filter(
            artlist_tog_dsl::id.eq(tog.id.clone())
          )
        )
        .set(&new_tog)
        .execute(connection)
        .expect("Error updating tog");
    }

    for tap in art_list_tap {
      let tap_id = split_sub_item_id(&tap.id) + (art_list_tog.len() as i32);
      let new_tap = ItemsArtListTap {
        id: format!("T_{}_AT_{}", i, tap_id),
        fileitems_item_id: format!("T_{}", i),
        ..tap
      };

      diesel
        ::update(
          artlist_tap_dsl::items_artlist_tap.filter(
            artlist_tap_dsl::id.eq(tap.id.clone())
          )
        )
        .set(&new_tap)
        .execute(connection)
        .expect("Error updating tap");
    }

    for layer in art_layers {
      let layer_id = split_sub_item_id(&layer.id);
      let new_layer = ItemsArtLayers {
        id: format!("T_{}_AL_{}", i, layer_id),
        fileitems_item_id: format!("T_{}", i),
        ..layer
      };

      diesel
        ::update(
          art_layers_dsl::items_art_layers.filter(
            art_layers_dsl::id.eq(layer.id.clone())
          )
        )
        .set(&new_layer)
        .execute(connection)
        .expect("Error updating layer");
    }

    i += 1;
  }

  list_fileitems()
}
