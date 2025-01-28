pub(crate) mod fileitem_commands;
pub(crate) mod settings_commands;
pub(crate) mod items_full_ranges_commands;
pub(crate) mod items_artlist_tap_commands;
pub(crate) mod items_artlist_tog_commands;
pub(crate) mod items_fadlist_commands;
pub(crate) mod items_art_layers_commands;

use tauri_specta::collect_commands;
use specta_typescript::Typescript;
use tauri::ipc::Invoke;
use crate::bin::bindings_custom_types;

pub fn generate_specta_bindings() {
  tauri_specta::Builder::<tauri::Wry>
    ::new()
    .commands(
      collect_commands![
        // fileitem_commands
        fileitem_commands::list_all_fileitems_and_relations_for_json_export,
        fileitem_commands::list_all_fileitems_and_relation_counts,
        fileitem_commands::get_fileitem_and_relations,
        fileitem_commands::create_fileitem,
        fileitem_commands::clear_fileitem,
        fileitem_commands::renumber_all_fileitems,
        fileitem_commands::delete_fileitem_and_relations,
        fileitem_commands::update_fileitem,
        // items_full_ranges_commands
        items_full_ranges_commands::create_full_range,
        items_full_ranges_commands::delete_full_range_by_fileitem,
        items_full_ranges_commands::update_full_range,
        // items_fadlist_commands
        items_fadlist_commands::create_fad,
        items_fadlist_commands::delete_fad_by_fileitem,
        items_fadlist_commands::update_fad,
        // items_artlist_tog_commands
        items_artlist_tog_commands::create_art_tog,
        items_artlist_tog_commands::delete_art_tog_by_fileitem,
        items_artlist_tog_commands::update_art_tog,
        // items_artlist_tap_commands
        items_artlist_tap_commands::create_art_tap,
        items_artlist_tap_commands::delete_art_tap_by_fileitem,
        items_artlist_tap_commands::update_art_tap,
        // items_art_layers_commands
        items_art_layers_commands::create_art_layer,
        items_art_layers_commands::delete_art_layer_by_fileitem,
        items_art_layers_commands::update_art_layer,
        // settings_commands
        settings_commands::get_settings,
        settings_commands::set_settings
      ]
    )
    .export(
      Typescript::default(),
      "../src/components/backendCommands/backendCommands.ts"
    )
    .expect("Failed to export typescript bindings");

  bindings_custom_types::main();
}

pub fn create_tauri_handler<R>() -> Box<
    dyn (Fn(Invoke<R>) -> bool) + Send + Sync + 'static
  >
  where R: tauri::Runtime
{
  Box::new(
    tauri::generate_handler![
      // fileitem_commands
      fileitem_commands::list_all_fileitems_and_relations_for_json_export,
      fileitem_commands::list_all_fileitems_and_relation_counts,
      fileitem_commands::get_fileitem_and_relations,
      fileitem_commands::create_fileitem,
      fileitem_commands::clear_fileitem,
      fileitem_commands::renumber_all_fileitems,
      fileitem_commands::delete_fileitem_and_relations,
      fileitem_commands::update_fileitem,
      // items_full_ranges_commands
      items_full_ranges_commands::create_full_range,
      items_full_ranges_commands::delete_full_range_by_fileitem,
      items_full_ranges_commands::update_full_range,
      // items_fadlist_commands
      items_fadlist_commands::create_fad,
      items_fadlist_commands::delete_fad_by_fileitem,
      items_fadlist_commands::update_fad,
      // items_artlist_tog_commands
      items_artlist_tog_commands::create_art_tog,
      items_artlist_tog_commands::delete_art_tog_by_fileitem,
      items_artlist_tog_commands::update_art_tog,
      // items_artlist_tap_commands
      items_artlist_tap_commands::create_art_tap,
      items_artlist_tap_commands::delete_art_tap_by_fileitem,
      items_artlist_tap_commands::update_art_tap,
      // items_art_layers_commands
      items_art_layers_commands::create_art_layer,
      items_art_layers_commands::delete_art_layer_by_fileitem,
      items_art_layers_commands::update_art_layer,
      // settings_commands
      settings_commands::get_settings,
      settings_commands::set_settings
    ]
  )
}
