#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

#[allow(warnings, unused)]
mod db;

use db::*;
use serde::Deserialize;
use specta::{ Type };
use specta_typescript::Typescript;
use std::sync::Arc;
use tauri_specta::{ collect_commands, Builder };
use tauri::{
  Manager,
  Emitter,
  State,
  image::Image,
  menu::{ MenuBuilder, SubmenuBuilder },
  tray::{ MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent },
};

type DbState<'a> = State<'a, Arc<PrismaClient>>;

#[tauri::command]
#[specta::specta]
async fn get_posts(db: DbState<'_>) -> Result<Vec<post::Data>, ()> {
  db.post()
    .find_many(vec![])
    .exec().await
    .map_err(|_| ())
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
    .exec().await
    .map_err(|_| ())
}

#[tauri::command]
#[specta::specta] // < You must annotate your commands
fn hello_world(my_name: String) -> String {
  format!("Hello, {my_name}! You've been greeted from Rust!")
}

#[tokio::main]
async fn main() {
  let db = PrismaClient::_builder().build().await.unwrap();

  //let invoke_handler = {
  let mut builder = Builder::<tauri::Wry>
    ::new()
    .commands(collect_commands![hello_world, get_posts, create_post]);

  #[cfg(debug_assertions)]
  builder
    .export(Typescript::default(), "../src/bindings.ts")
    .expect("Failed to export typescript bindings");

  //builder.build().unwrap()
  //};

  #[cfg(debug_assertions)]
  db._db_push().await.unwrap();

  let context = tauri::generate_context!();

  tauri::Builder
    ::default()
    .invoke_handler(builder.invoke_handler())
    .plugin(tauri_plugin_http::init())
    .plugin(tauri_plugin_clipboard_manager::init())
    .plugin(tauri_plugin_process::init())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_os::init())
    .plugin(tauri_plugin_notification::init())
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_global_shortcut::Builder::new().build())
    .plugin(tauri_plugin_shell::init())
    .setup(move |app| {
      builder.mount_events(app);

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

      let menu = MenuBuilder::new(app).items(&[&file_submenu, &help_submenu]).build()?;
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
