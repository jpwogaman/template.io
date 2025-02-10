use std::{ fs::{ File }, io::{ self, Read, Write } };
use log::{info, error};
use colored::Colorize;

pub fn replace_multiple_in_ts_file(
  file_path: &str,
  replacements: &[(String, String)]
) -> io::Result<()> {
  // Step 1: Read the contents of the file
  let mut file = File::open(file_path)?;
  let mut contents = String::new();
  file.read_to_string(&mut contents)?;

  // Step 2: Perform each replacement in the list
  let mut modified_contents = contents;
  for (to_replace, replacement) in replacements {
    modified_contents = modified_contents.replace(to_replace, replacement);
  }

  // Step 3: Write the modified contents back to the file
  let mut file = File::create(file_path)?;
  file.write_all(modified_contents.as_bytes())?;

  Ok(())
}

pub fn main() {
  let ts_file_path = "../src/components/backendCommands/backendCommands.ts"; // Example TypeScript file path

  // List of replacements (multiple pairs of "to_replace" and "replacement")
  let replacements = vec![
    ///////// Imports
    (
      "/** user-defined types **/".to_string(),
      "/** user-defined types **/\nimport { type FileItemId, type SubItemId } from '@/components/context'".to_string(),
    ),
    //////////// FileItems
    (
      "export type FileItem = { id: string".to_string(),
      "export type FileItem = { id: FileItemId".to_string(),
    ),
    (
      "export type FileItemRequest = { id: string".to_string(),
      "export type FileItemRequest = { id: FileItemId".to_string(),
    ),
    (
      "export type FullTrackForExport = ({ id: string".to_string(),
      "export type FullTrackForExport = ({ id: FileItemId".to_string(),
    ),
    (
      "export type FullTrackWithCounts = ({ id: string".to_string(),
      "export type FullTrackWithCounts = ({ id: FileItemId".to_string(),
    ),
    //////////// SubItems
    (
      "export type ItemsArtLayers = { id: string".to_string(),
      "export type ItemsArtLayers = { id: SubItemId".to_string(),
    ),
    (
      "export type ItemsArtLayersRequest = { id: string".to_string(),
      "export type ItemsArtLayersRequest = { id: SubItemId".to_string(),
    ),
    (
      "export type ItemsArtListTap = { id: string".to_string(),
      "export type ItemsArtListTap = { id: SubItemId".to_string(),
    ),
    (
      "export type ItemsArtListTapRequest = { id: string".to_string(),
      "export type ItemsArtListTapRequest = { id: SubItemId".to_string(),
    ),
    (
      "export type ItemsArtListTog = { id: string".to_string(),
      "export type ItemsArtListTog = { id: SubItemId".to_string(),
    ),
    (
      "export type ItemsArtListTogRequest = { id: string".to_string(),
      "export type ItemsArtListTogRequest = { id: SubItemId".to_string(),
    ),
    (
      "export type ItemsFadList = { id: string".to_string(),
      "export type ItemsFadList = { id: SubItemId".to_string(),
    ),
    (
      "export type ItemsFadListRequest = { id: string".to_string(),
      "export type ItemsFadListRequest = { id: SubItemId".to_string(),
    ),
    (
      "export type ItemsFullRanges = { id: string".to_string(),
      "export type ItemsFullRanges = { id: SubItemId".to_string(),
    ),
    (
      "export type ItemsFullRangesRequest = { id: string".to_string(),
      "export type ItemsFullRangesRequest = { id: SubItemId".to_string(),
    ),
    ////////////
    (
      "fileitems_item_id: string".to_string(),
      "fileitems_item_id: FileItemId".to_string(),
    ),
    (
      "fileitems_item_id?: string | null".to_string(),
      "fileitems_item_id?: FileItemId | null".to_string(),
    ),
    //////////// Settings
    (
      "selected_item_id: string".to_string(),
      "selected_item_id: FileItemId".to_string(),
    ),
    (
      "selected_sub_item_id: string".to_string(),
      "selected_sub_item_id: SubItemId".to_string(),
    ),
    (
      "previous_item_id?: string | null".to_string(),
      "previous_item_id?: FileItemId | null".to_string(),
    ),
    (
      "next_item_id?: string | null".to_string(),
      "next_item_id?: FileItemId | null".to_string(),
    )
  ];

  if let Err(e) = replace_multiple_in_ts_file(ts_file_path, &replacements) {
    error!("{}", format!("Error replacing in file: {}", e).red().bold());
  } else {
    info!("{}", format!("Replacements applied to {}", ts_file_path).cyan().bold());
  }
}
