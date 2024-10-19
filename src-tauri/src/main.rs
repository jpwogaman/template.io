#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

//#[derive(Clone, serde::Serialize)]
//struct Payload {
//  message: String,
//}

use tauri::{
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
