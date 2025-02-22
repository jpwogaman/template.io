-- Your SQL goes here
CREATE TABLE items_artlist_tap (
    id VARCHAR(50) PRIMARY KEY NOT NULL,
    name VARCHAR(50) NOT NULL,
    toggle BOOLEAN NOT NULL,
    code_type VARCHAR(50) NOT NULL,
    code INT NOT NULL,
    "on" INT NOT NULL,
    off INT NOT NULL,
    "default" BOOLEAN NOT NULL,
    delay INT NOT NULL,
    change_type VARCHAR(50) NOT NULL,
    ranges VARCHAR(50) NOT NULL,
    art_layers VARCHAR(50) NOT NULL,
    layers_together BOOLEAN NOT NULL,
    fileitems_item_id VARCHAR(50) NOT NULL REFERENCES fileitems(id)
);