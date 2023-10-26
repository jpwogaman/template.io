#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

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

  let quit = CustomMenuItem::new("quit".to_string(), "Quit");
  let close = CustomMenuItem::new("close".to_string(), "Close");
  let about = CustomMenuItem::new("about".to_string(), "About (v0.1.0)");  
  let new = CustomMenuItem::new("new".to_string(), "New");  
  let open = CustomMenuItem::new("open".to_string(), "Open");    
  let save = CustomMenuItem::new("save".to_string(), "Save");  
  let save_as = CustomMenuItem::new("save_as".to_string(), "Save As");  

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
          }
        }
        _ => {}
      }}

    )
    .run(context)
    .expect("error while running tauri application");
}