-- Your SQL goes here
CREATE TABLE items_art_layers (
    id VARCHAR(50) PRIMARY KEY NOT NULL,
    name VARCHAR(50) NOT NULL,
    code_type VARCHAR(50) NOT NULL,
    code INT NOT NULL,
    "on" INT NOT NULL,
    off INT NOT NULL,
    "default" VARCHAR(50) NOT NULL,
    change_type VARCHAR(50) NOT NULL,
    fileitems_item_id VARCHAR(50) NOT NULL REFERENCES fileitems(id)
);