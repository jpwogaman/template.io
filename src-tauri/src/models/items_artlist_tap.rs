use crate::{ schema::items_artlist_tap, models::fileitem::FileItem };

use diesel::{
  Insertable,
  Queryable,
  AsChangeset,
  Identifiable,
  Associations,
  Selectable,
};
use serde::{ Serialize, Deserialize };

// ANY changes to ANY of the structs/types in this file will cause Specta to automatically export to the frontend
// depending on the change, template.io/src-tauri/src/bin/bindings_custom_types.rs, may need to be updated as well

#[derive(
  Queryable,
  Serialize,
  Deserialize,
  Insertable,
  AsChangeset,
  Selectable,
  Identifiable,
  Associations,
  Debug,
  PartialEq,
  Clone,
  specta::Type
)]
#[diesel(belongs_to(FileItem, foreign_key = fileitems_item_id))]
#[diesel(table_name = items_artlist_tap)]
pub struct ItemsArtListTap {
  pub id: String, // manually changed to SubItemId
  pub name: String,
  pub toggle: bool,
  pub code_type: String,
  pub code: i32,
  pub on: i32,
  pub off: i32,
  pub default: bool,
  pub delay: i32,
  pub change_type: String,
  pub ranges: String,
  pub art_layers: String,
  pub fileitems_item_id: String, // manually changed to FileItemId
}

#[derive(Deserialize, Serialize, Default, Clone, specta::Type)]
pub struct ItemsArtListTapRequest {
  pub id: String, // manually changed to SubItemId
  #[specta(optional)]
  pub name: Option<String>,
  #[specta(optional)]
  pub toggle: Option<bool>,
  #[specta(optional)]
  pub code_type: Option<String>,
  #[specta(optional)]
  pub code: Option<i32>,
  #[specta(optional)]
  pub on: Option<i32>,
  #[specta(optional)]
  pub off: Option<i32>,
  #[specta(optional)]
  pub default: Option<bool>,
  #[specta(optional)]
  pub delay: Option<i32>,
  #[specta(optional)]
  pub change_type: Option<String>,
  #[specta(optional)]
  pub ranges: Option<String>,
  #[specta(optional)]
  pub art_layers: Option<String>,
  #[specta(optional)]
  pub fileitems_item_id: Option<String>, // manually changed to FileItemId
}

impl ItemsArtListTap {
  pub fn update_from(&self, updates: ItemsArtListTapRequest) -> Self {
    Self {
      id: updates.id.clone(), // ONLY ART_LIST_TOG AND ART_LIST_TAP CAN EXPOSE ID UPDATES
      name: updates.name.unwrap_or_else(|| self.name.clone()),
      toggle: updates.toggle.unwrap_or(self.toggle),
      code_type: updates.code_type.unwrap_or_else(|| self.code_type.clone()),
      code: updates.code.unwrap_or(self.code),
      on: updates.on.unwrap_or(self.on),
      off: updates.off.unwrap_or(self.off),
      default: updates.default.unwrap_or(self.default),
      delay: updates.delay.unwrap_or(self.delay),
      change_type: updates.change_type.unwrap_or_else(||
        self.change_type.clone()
      ),
      ranges: updates.ranges.unwrap_or_else(|| self.ranges.clone()),
      art_layers: updates.art_layers.unwrap_or_else(|| self.art_layers.clone()),
      fileitems_item_id: updates.fileitems_item_id.unwrap_or_else(||
        self.fileitems_item_id.clone()
      ),
    }
  }
}

pub fn init_art_tap(
  fileitems_item_id: String,
  new_art_tap_id: String,
  art_default: bool
) -> ItemsArtListTap {
  ItemsArtListTap {
    // art_tog is T_{}_AT_0, art_tap is T_{}_AT_1
    id: format!("{}_AT_{}", fileitems_item_id, new_art_tap_id),
    name: "".to_string(),
    toggle: false,
    code_type: "/control".to_string(),
    code: 0,
    on: 127,
    off: 0,
    default: art_default,
    delay: 0,
    change_type: "Value 2".to_string(),
    ranges: format!("[\"{}_FR_0\"]", fileitems_item_id),
    art_layers: "[]".to_string(),
    fileitems_item_id: fileitems_item_id,
  }
}
