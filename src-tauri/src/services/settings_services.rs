use std::fs;
use std::io::Write;
use std::path::Path;
pub use crate::models::{ settings::{ Settings, init_settings } };

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

  let settings = init_settings();

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
