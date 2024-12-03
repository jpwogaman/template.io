use serde::{ Deserialize, Serialize };
use std::fs;
use std::io::Write;
use std::path::Path;

#[derive(Deserialize, Serialize, Debug)]
pub struct Settings {
  pub vep_out_settings: i32,
  pub smp_out_settings: i32,
  pub default_range_count: i32,
  pub default_art_tog_count: i32,
  pub default_art_tap_count: i32,
  pub default_fad_tog_count: i32,
  pub track_add_count: i32,
  pub sub_item_add_count: i32,
}

impl Settings {
  pub fn init() {
    if !file_exists() {
      create_file();
    }
  }

  pub fn get() -> Self {
    let string_content = fs::read_to_string(get_file_path()).unwrap();

    serde_json::from_str::<Settings>(&string_content).unwrap()
  }

  pub fn set(&self) {
    fs::write(
      get_file_path(),
      serde_json::to_string_pretty(self).unwrap()
    ).ok();
  }
}

fn create_file() {
  let path = get_file_path();
  let dir = Path::new(&path).parent().unwrap();

  if !dir.exists() {
    fs::create_dir_all(dir).unwrap();
  }

  let mut file = fs::File::create(path).unwrap();

  let settings = Settings {
    vep_out_settings: 128,
    smp_out_settings: 32,
    default_range_count: 1,
    default_art_tog_count: 2,
    default_art_tap_count: 4,
    default_fad_tog_count: 4,
    track_add_count: 1,
    sub_item_add_count: 1,
  };

  file
    .write_all(serde_json::to_string_pretty(&settings).unwrap().as_bytes())
    .unwrap();
}

fn file_exists() -> bool {
  let path = get_file_path();
  Path::new(&path).exists()
}

fn get_file_path() -> String {
  let home_dir = dirs::home_dir().unwrap();
  home_dir.to_str().unwrap().to_string() + "/template.io/settings.json"
}
