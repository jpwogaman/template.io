use crate::services::settings_services::Settings;

#[tauri::command]
#[specta::specta]
pub fn get_settings() -> Settings {
  Settings::get()
}

#[tauri::command]
#[specta::specta]
pub fn set_settings(settings: Settings) {
  settings.set();
}
