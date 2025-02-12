use crate::services::settings_services::Settings;

#[tauri::command]
#[specta::specta]
pub fn get_settings() -> Settings {
  Settings::get()
}

#[tauri::command]
#[specta::specta]
pub fn set_settings(mut settings: Settings) {
  settings.normalize_colors();
  settings.set();
}
