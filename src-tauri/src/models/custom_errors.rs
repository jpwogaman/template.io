use thiserror::Error;

#[derive(Debug, Error)]
pub enum MyCustomError {
  #[error("There must be at least one Full Range!")]
  MinFullRangeError,
  #[error("There must be at least one Toggle Articulation!")]
  MinArtTogError,
  #[error("There must be at least one Tap Articulation!")]
  MinArtTapError,
  #[error("There must be at least one Articulation Layer!")]
  MinArtLayerError,
  #[error("There must be at least one Fader!")]
  MinFadError,
  #[error("There must be at least one default Tap Articulation!")]
  MinDefaultArtTap,
}

impl serde::Serialize for MyCustomError {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where S: serde::ser::Serializer
  {
    serializer.serialize_str(self.to_string().as_ref())
  }
}
