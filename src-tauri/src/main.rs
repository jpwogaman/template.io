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
  let import = CustomMenuItem::new("import".to_string(), "Import");    
  let export = CustomMenuItem::new("export".to_string(), "Export");  

  let file_submenu = Submenu::new(
    "File", 
    Menu::new()    
    .add_item(import)
    .add_item(export)
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
        "import" => {
          event.window().emit("open", Some("open")).unwrap();
        }
        "export" => {
          event.window().emit("export", Some("export")).unwrap();
        }
        "about" => {
          event.window().emit("about", Some("about")).unwrap();
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