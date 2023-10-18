#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

//#[derive(Clone, serde::Serialize)]
//struct Payload {
//  message: String,
//}

use tauri::{
  CustomMenuItem, 
  Menu, 
  MenuItem,
  Submenu, 
  SystemTrayMenu, 
  //SystemTrayMenuItem, 
  SystemTray, 
  SystemTrayEvent
};  
//use tauri::Manager;

fn main() {
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