use serde::{ Deserialize, Serialize };
use std::collections::HashSet;
use regex::Regex;

#[derive(Deserialize, Serialize, Debug, specta::Type)]
pub struct Settings {
  pub vep_out_settings: i32,
  pub smp_out_settings: i32,
  pub default_range_count: i32,
  pub default_art_tog_count: i32,
  pub default_art_tap_count: i32,
  pub default_art_layer_count: i32,
  pub default_fad_count: i32,
  pub track_add_count: i32,
  pub sub_item_add_count: i32,
  pub selected_item_id: String,
  pub selected_sub_item_id: String,
  #[specta(optional)]
  pub previous_item_id: Option<String>,
  #[specta(optional)]
  pub next_item_id: Option<String>,
  pub track_options_layouts: TrackOptionLayouts,
  pub default_colors: HashSet<String>,
}

#[derive(Deserialize, Serialize, Debug, specta::Type)]
pub struct TrackOptionLayouts {
  pub full_ranges: String,
  pub art_list_tog: String,
  pub art_list_tap: String,
  pub art_layers: String,
  pub fad_list: String,
}

pub fn init_settings() -> Settings {
  Settings {
    vep_out_settings: 128,
    smp_out_settings: 32,
    default_range_count: 1,
    default_art_tog_count: 2,
    default_art_tap_count: 4,
    default_art_layer_count: 1,
    default_fad_count: 4,
    track_add_count: 1,
    sub_item_add_count: 1,
    selected_item_id: "T_0".to_string(),
    selected_sub_item_id: "T_0_notes".to_string(),
    previous_item_id: None,
    next_item_id: None,
    track_options_layouts: TrackOptionLayouts {
      full_ranges: "table".to_string(),
      art_list_tog: "table".to_string(),
      art_list_tap: "table".to_string(),
      art_layers: "table".to_string(),
      fad_list: "table".to_string(),
    },
    default_colors: [
      "#F0D340".to_string(),
      "#58FA3D".to_string(),
      "#cd9323".to_string(),
      "#9a2151".to_string(),
      "#c034b5".to_string(),
      "#224596".to_string(),
      "#37bdb4".to_string(),
    ]
      .into_iter()
      .collect(),
  }
}

pub fn normalize_hex(color: &str) -> Option<String> {
  let re = Regex::new(r"^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$").unwrap();

  if let Some(caps) = re.captures(color) {
    let hex = caps.get(1).unwrap().as_str().to_lowercase();
    let normalized = if hex.len() == 3 {
      hex
        .chars()
        .map(|c| format!("{c}{c}"))
        .collect::<String>()
    } else {
      hex
    };
    Some(format!("#{}", normalized))
  } else {
    None
  }
}

impl Settings {
  pub fn normalize_colors(&mut self) {
        let mut normalized_colors = HashSet::new();
        for color in &self.default_colors {
            if let Some(valid_color) = normalize_hex(color) {
                normalized_colors.insert(valid_color);
            }
        }
        self.default_colors = normalized_colors;
    }
}

