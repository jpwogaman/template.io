use std::{ ffi::OsStr, fs::{ self, File }, io::Write, path::Path };

fn main() {  
  let models_dir = "./src/models";
  if !Path::new(models_dir).exists() {
    eprintln!("Directory '{}' does not exist", models_dir);
    return;
  }

  let exports: Vec<_> = fs
    ::read_dir(models_dir)
    .unwrap()
    .filter_map(Result::ok)
    .filter_map(|entry| {
      let path = entry.path();
      // Check if the file has a .ts extension
      if path.extension() == Some(OsStr::new("ts")) {
        path.file_stem().and_then(OsStr::to_str).map(String::from)
      } else {
        None
      }
    })
    .filter(|filename| filename != "index") // Exclude index.ts
    .map(|filename| format!("export * from \"./{}\";", filename))
    .collect();

  // Use the `models_dir` variable to create the path for "index.ts"
  let index_file_path = format!("{}/index.ts", models_dir);
  let mut file = File::create(&index_file_path).unwrap();
  file.write_all(exports.join("\n").as_bytes()).unwrap();

  println!("Generated {}", index_file_path); // Optional log message
}
