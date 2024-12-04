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
    fileItemsItemId VARCHAR(50) NOT NULL REFERENCES fileitems(id),
    itemsArtListTapId VARCHAR(50) NOT NULL REFERENCES items_artlist_tap(id),
    itemsArtListTogId VARCHAR(50) NOT NULL REFERENCES items_artlist_tog(id)
);