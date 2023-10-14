#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{
  CustomMenuItem, 
  Menu, 
  Submenu, 
  SystemTrayMenu, 
  SystemTrayMenuItem, 
  SystemTray, 
  SystemTrayEvent
};  
use tauri::Manager;

fn main() {
  let context = tauri::generate_context!();  

  let quit = CustomMenuItem::new("quit".to_string(), "Quit");
  let close = CustomMenuItem::new("close".to_string(), "Close");
  let hide = CustomMenuItem::new("hide".to_string(), "Hide");
  let about = CustomMenuItem::new("about".to_string(), "About");  

  let file_submenu = Submenu::new(
    "File", 
    Menu::new()
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
        _ => {}
      }})
    .system_tray(system_tray)
    .on_system_tray_event(|app, event| {
      match event {
        //SystemTrayEvent::LeftClick {
        //  position: _,
        //  size: _,
        //  ..
        //} => {
        //  system_tray.display_menu().unwrap();
        //}
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

//#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

//fn main() {
//tauri::Builder::default()
//   .menu(tauri::Menu::os_default(&context.package_info().name))
//   .run(tauri::generate_context!())
//   .expect("error while running tauri application");
//}