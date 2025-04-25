#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod commands;
mod db;
mod menu;
mod models;
mod schema;
mod services;

use commands::{create_tauri_handler, generate_specta_bindings};
use services::{fileitem_service, resize_service, settings_services};
use tauri::Wry;
use tauri_plugin_log;

#[tokio::main]
async fn main() {
    tauri::async_runtime::set(tokio::runtime::Handle::current());
    let context = tauri::generate_context!();

    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        /////
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        /////
        .setup(|app| setup_app(app).map_err(|e| e.into()))
        .invoke_handler(create_tauri_handler::<Wry>())
        .run(context)
        .expect("Error while running the application!");
}

pub fn setup_app(app: &tauri::App) -> tauri::Result<()> {
    tokio::spawn(async move {
        db::init();
        settings_services::Settings::init();
        fileitem_service::init();
    });

    generate_specta_bindings();

    menu::setup_menu(app)?;
    menu::setup_tray_menu(app)?;
    resize_service::init(app)?;

    Ok(())
}
