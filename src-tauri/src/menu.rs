use tauri::{
  App,
  Manager,
  Emitter,
  menu::{ MenuBuilder, SubmenuBuilder },
  tray::{ MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent },
};
use crate::services::{
  import_export_service,
  fileitem_service,
  settings_services,
}; 

pub fn setup_menu(app: &App) -> tauri::Result<()> {
  let file_submenu = SubmenuBuilder::new(app, "File")
    .text("import", "Import")
    .text("export", "Export")
    .separator()
    .text("delete_all", "Flush DB / Clear All")
    .text("quit", "Quit")
    .build()?;
  let help_submenu = SubmenuBuilder::new(app, "Help")
    .text("about", "About (v0.0.1)")
    .text("settings", "Settings")
    .build()?;

  let menu = MenuBuilder::new(app)
    .items(&[&file_submenu, &help_submenu])
    .build()?;
  app.set_menu(menu)?;

  app.on_menu_event(move |app, event| {
    match event.id().as_ref() {
      "import" => {
        import_export_service::import(app.clone());
        app.emit("refresh", "refresh").unwrap();
      }
      "export" => {
        import_export_service::export(app.clone());
      }
      "delete_all" => {
        fileitem_service::delete_all_fileitems_and_relations();
        fileitem_service::create_fileitem();
        let mut settings = settings_services::Settings::get();
        settings.selected_item_id = "T_0".to_string();
        settings.selected_sub_item_id = "T_0_notes".to_string();
        settings_services::Settings::set(&settings);
        app.emit("refresh", "refresh").unwrap();
      }
      "quit" => std::process::exit(0),
      "about" => {
        app.emit("about", "about").unwrap();
      }
      "settings" => {
        app.emit("settings", "settings").unwrap();
      }
      _ => (),
    }
  });

  Ok(())
}

pub fn setup_tray_menu(app: &App) -> tauri::Result<()> {
  let tray_menu = MenuBuilder::new(app).text("quit", "Quit").build()?;
  TrayIconBuilder::new()
    .menu(&tray_menu)
    .icon(app.default_window_icon().unwrap().clone())
    .tooltip("Template.io")
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
}
