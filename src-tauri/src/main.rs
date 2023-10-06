#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

fn main() {
  let context = tauri::generate_context!();
  tauri::Builder::default()  
    .menu(tauri::Menu::os_default(&context.package_info().name))
    .run(context)
    .expect("error while running tauri application");
}

//#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

//fn main() {
//tauri::Builder::default()
//   .run(tauri::generate_context!())
//   .expect("error while running tauri application");
//}