use serde::{ Deserialize, Serialize };
use ts_rs::TS;

#[derive(Deserialize, Serialize, Debug, TS, specta::Type)]
#[ts(export, export_to = "settings.ts")]
pub struct Settings {
  pub vep_out_settings: i32,
  pub smp_out_settings: i32,
  pub default_range_count: i32,
  pub default_art_tog_count: i32,
  pub default_art_tap_count: i32,
  pub default_fad_tog_count: i32,
  pub track_add_count: i32,
  pub sub_item_add_count: i32,
  pub selected_item_id: String,
  pub selected_sub_item_id: String,
  #[ts(optional)]
  #[specta(optional)]
  pub previous_item_id: Option<String>,
  pub next_item_id: String,
}

pub fn init_settings() -> Settings {
  Settings {
    vep_out_settings: 128,
    smp_out_settings: 32,
    default_range_count: 1,
    default_art_tog_count: 2,
    default_art_tap_count: 4,
    default_fad_tog_count: 4,
    track_add_count: 1,
    sub_item_add_count: 1,
    selected_item_id: "T_0".to_string(),
    selected_sub_item_id: "T_0_notes".to_string(),
    previous_item_id: None,
    next_item_id: "T_1".to_string(),
  }
}