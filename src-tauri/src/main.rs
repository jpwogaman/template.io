#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

#[allow(warnings, unused)]
mod db;

use db::*;
use serde::Deserialize;
use specta::{collect_types, Type};
use std::sync::Arc;
use tauri::State;
use tauri_specta::ts;


type DbState<'a> = State<'a, Arc<PrismaClient>>;

#[tauri::command]
#[specta::specta]
async fn get_posts(db: DbState<'_>) -> Result<Vec<post::Data>, ()> {
    db.post().find_many(vec![]).exec().await.map_err(|_| ())
}

#[derive(Deserialize, Type)]
struct CreatePostData {
    title: String,
    content: String,
}

#[tauri::command]
#[specta::specta]
async fn create_post(db: DbState<'_>, data: CreatePostData) -> Result<post::Data, ()> {
    db.post()
        .create(data.title, data.content, vec![])
        .exec()
        .await
        .map_err(|_| ())
}

use tauri::{
<<<<<<< HEAD
  CustomMenuItem, 
  Menu, 
  MenuItem,
  Submenu, 
  SystemTrayMenu, 
  SystemTray, 
  SystemTrayEvent
};  

#[tokio::main]
async fn main() {
    let db = PrismaClient::_builder().build().await.unwrap();

    #[cfg(debug_assertions)]
    ts::export(collect_types![get_posts, create_post], "../src/bindings.ts").unwrap();

    #[cfg(debug_assertions)]
    db._db_push().await.unwrap();

  let context = tauri::generate_context!();  
=======
  Manager,
  Emitter,
  image::Image,
  menu::{
    MenuBuilder,
    SubmenuBuilder
  },
  tray::{ MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent },
};

fn main() {
  let context = tauri::generate_context!();
>>>>>>> main

  tauri::Builder
    ::default()
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

<<<<<<< HEAD
  let file_submenu = Submenu::new(
    "File", 
    Menu::new()    
    .add_item(new)
    .add_item(open)
    .add_item(save)
    .add_item(save_as)
    .add_native_item(MenuItem::Separator)
    .add_item(quit.clone())
    .add_item(close)
  );

  let help_submenu = Submenu::new(
    "Help", 
    Menu::new()
    .add_item(about)
  );

  let menu = Menu::new()
  .add_submenu(file_submenu)
  .add_submenu(help_submenu);

  let tray_menu = SystemTrayMenu::new()
  .add_item(quit);

  let system_tray = SystemTray::new()
  .with_menu(tray_menu);
  
  tauri::Builder::default()
  .invoke_handler(tauri::generate_handler![get_posts, create_post])
  .manage(Arc::new(db))
    .menu(menu)
    .on_menu_event(|event| {
      match event.menu_item_id() {
        "quit" => {
          std::process::exit(0);
        }
        "close" => {
          event.window().close().unwrap();
        }
        "open" => {
          event.window().emit("open", Some("open")).unwrap();
        }
        "save" => {
          event.window().emit("save", Some("save")).unwrap();
        }
        "save_as" => {
          event.window().emit("save_as", Some("save_as")).unwrap();
        }
        _ => {}
      }})
    .system_tray(system_tray)
    .on_system_tray_event(|_app, event| {
      match event {
        SystemTrayEvent::MenuItemClick { id, .. } => {
          match id.as_str() {
            "quit" => {
              std::process::exit(0);
            }
            _ => {}
=======
      let menu = MenuBuilder::new(app).items(&[&file_submenu, &help_submenu]).build()?;
      app.set_menu(menu)?;
      app.on_menu_event(move |app, event| {
        match event.id().as_ref() {
          "import" => {
            app.emit("import", "import").unwrap();
>>>>>>> main
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

      let tray_icon = Image::from_path("icons/32x32.png").expect("failed to load icon");

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
    .run(context)
    .expect("Error while running the application!");
}
