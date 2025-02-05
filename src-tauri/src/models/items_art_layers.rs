use crate::{ schema::items_art_layers, models::fileitem::FileItem };
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
#[diesel(table_name = items_art_layers)]
pub struct ItemsArtLayers {
  pub id: String, // manually changed to SubItemId
  pub name: String,
  pub code_type: String,
  pub code: i32,
  pub on: i32,
  pub off: i32,
  pub default: String,
  pub change_type: String,
  pub fileitems_item_id: String, // manually changed to FileItemId
}

#[derive(Deserialize, Serialize, Default, Clone, specta::Type)]
pub struct ItemsArtLayersRequest {
  pub id: String, // manually changed to SubItemId
  #[specta(optional)]
  pub name: Option<String>,
  #[specta(optional)]
  pub code_type: Option<String>,
  #[specta(optional)]
  pub code: Option<i32>,
  #[specta(optional)]
  pub on: Option<i32>,
  #[specta(optional)]
  pub off: Option<i32>,
  #[specta(optional)]
  pub default: Option<String>,
  #[specta(optional)]
  pub change_type: Option<String>,
  #[specta(optional)]
  pub fileitems_item_id: Option<String>, // manually changed to FileItemId
}

impl ItemsArtLayers {
  pub fn update_from(&self, updates: ItemsArtLayersRequest) -> Self {
    Self {
      id: self.id.clone(), // ONLY ART_LIST_TOG AND ART_LIST_TAP CAN EXPOSE ID UPDATES
      name: updates.name.unwrap_or_else(|| self.name.clone()),
      code_type: updates.code_type.unwrap_or_else(|| self.code_type.clone()),
      code: updates.code.unwrap_or(self.code),
      on: updates.on.unwrap_or(self.on),
      off: updates.off.unwrap_or(self.off),
      default: updates.default.unwrap_or_else(|| self.default.clone()),
      change_type: updates.change_type.unwrap_or_else(||
        self.change_type.clone()
      ),
      fileitems_item_id: updates.fileitems_item_id.unwrap_or_else(||
        self.fileitems_item_id.clone()
      ),
    }
  }
}

pub fn init_art_layer(
  fileitems_item_id: String,
  new_layer_id: String
) -> ItemsArtLayers {
  ItemsArtLayers {
    id: format!("{}_AL_{}", fileitems_item_id, new_layer_id),
    name: "".to_string(),
    code_type: "/control".to_string(),
    code: 0,
    on: 127,
    off: 0,
    default: "Off".to_string(),
    change_type: "Value 2".to_string(),
    fileitems_item_id: fileitems_item_id,
  }
}
