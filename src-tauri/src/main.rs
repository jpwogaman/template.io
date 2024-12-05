#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod db;
mod commands;
mod models;
mod services;
mod schema;
use tauri_plugin_log;
use log::info;
mod settings;

use commands::{
  fileitem_commands::*,
  settings_commands::*,
  items_full_ranges_commands::*,
  items_fadlist_commands::*,
  items_artlist_tog_commands::*,
  items_artlist_tap_commands::*,
  items_art_layers_commands::*,
};
use services::fileitem_service;

use tauri::{
  Manager,
  Emitter,
  image::Image,
  menu::{ MenuBuilder, SubmenuBuilder },
  tray::{ MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent },
};

#[tokio::main]
async fn main() {
  info!("init");
  tauri::async_runtime::set(tokio::runtime::Handle::current());
  let context = tauri::generate_context!();

  tauri::Builder
    ::default()
    .plugin(tauri_plugin_log::Builder::new().build())
    .plugin(tauri_plugin_http::init())
    .plugin(tauri_plugin_clipboard_manager::init())
    .plugin(tauri_plugin_process::init())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_os::init())
    .plugin(tauri_plugin_notification::init())
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_global_shortcut::Builder::new().build())
    .plugin(tauri_plugin_shell::init())
    .setup(|app| {
      tokio::spawn(async move {
        db::init();
        settings::Settings::init();
        fileitem_service::init();
      });
      let file_submenu = SubmenuBuilder::new(app, "File")
        .text("import", "Import")
        .text("export", "Export")
        .separator()
        .text("delete_all", "Flush DB / Clear All")
        .text("quit", "Quit")
        .build()?;
      let help_submenu = SubmenuBuilder::new(app, "Help")
        .text("about", "About (v0.1.0)")
        .text("settings", "Settings")
        .build()?;

      let menu = MenuBuilder::new(app)
        .items(&[&file_submenu, &help_submenu])
        .build()?;
      app.set_menu(menu)?;
      app.on_menu_event(move |app, event| {
        match event.id().as_ref() {
          "import" => {
            app.emit("import", "import").unwrap();
          }
          "export" => {
            app.emit("export", "export").unwrap();
          }
          "delete_all" => {
            app.emit("delete_all", "delete_all").unwrap();
          }
          "quit" => {
            std::process::exit(0);
          }
          "about" => {
            app.emit("about", "about").unwrap();
          }
          "settings" => {
            app.emit("settings", "settings").unwrap();
          }
          _ => (),
        }
      });

      let tray_icon = Image::from_path("icons/32x32.png").expect(
        "failed to load icon"
      );

      let tray_menu = MenuBuilder::new(app).text("quit", "Quit").build()?;
      let _tray = TrayIconBuilder::new()
        .menu(&tray_menu)
        .icon(tray_icon)
        .tooltip("My awesome Tauri app")
        .on_tray_icon_event(|tray, event| {
          if
            let TrayIconEvent::Click {
              button: MouseButton::Left,
              button_state: MouseButtonState::Up,
              ..
            } = event
          {
            let app = tray.app_handle();
            if let Some(webview_window) = app.get_webview_window("main") {
              let _ = webview_window.show();
              let _ = webview_window.set_focus();
            }
          }
        })
        .build(app)?;

      Ok(())
    })
    .invoke_handler(
      tauri::generate_handler![
        // fileitem_commands
        list_fileitems,
        list_fileitems_and_relations,
        list_fileitems_and_relation_counts,
        get_fileitem,
        get_fileitem_and_relations,
        create_fileitem,
        delete_fileitem,
        clear_fileitem,
        renumber_all_fileitems,
        delete_fileitem_and_relations,
        delete_all_fileitems_and_relations,
        update_fileitem,
        // items_full_ranges_commands
        list_items_full_ranges,
        get_full_range,
        create_full_range,
        delete_full_range,
        delete_full_range_by_fileitem,
        update_full_range,
        // items_fadlist_commands
        list_items_fadlist,
        get_fad,
        create_fad,
        delete_fad,
        delete_fad_by_fileitem,
        update_fad,
        // items_artlist_tog_commands
        list_items_artlist_tog,
        get_art_tog,
        create_art_tog,
        delete_art_tog,
        delete_art_tog_by_fileitem,
        update_art_tog,
        // items_artlist_tap_commands
        list_items_artlist_tap,
        get_art_tap,
        create_art_tap,
        delete_art_tap,
        delete_art_tap_by_fileitem,
        update_art_tap,
        // items_art_layers_commands
        list_items_art_layers,
        get_art_layer,
        create_art_layer,
        delete_art_layer,
        delete_art_layer_by_fileitem,
        update_art_layer,
        // settings_commands
        get_settings,
        set_settings
      ]
    )
    .run(context)
    .expect("Error while running the application!");
}
