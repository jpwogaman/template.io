-- Your SQL goes here
CREATE TABLE items_artlist_tog (
    id VARCHAR(50) PRIMARY KEY NOT NULL,
    name VARCHAR(50) NOT NULL,
    toggle BOOLEAN NOT NULL,
    code_type VARCHAR(50) NOT NULL,
    code INT NOT NULL,
    "on" INT NOT NULL,
    off INT NOT NULL,
    "default" VARCHAR(50) NOT NULL,
    delay INT NOT NULL,
    change_type VARCHAR(50) NOT NULL,
    ranges VARCHAR(50) NOT NULL,
    art_layers_on VARCHAR(50) NOT NULL,
    art_layers_off VARCHAR(50) NOT NULL,
    fileitems_item_id VARCHAR(50) NOT NULL REFERENCES fileitems(id)
);