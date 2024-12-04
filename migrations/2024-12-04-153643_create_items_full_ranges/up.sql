-- Your SQL goes here
CREATE TABLE items_full_ranges (
    id VARCHAR(50) PRIMARY KEY NOT NULL,
    name VARCHAR(50) NOT NULL,
    low VARCHAR(50) NOT NULL,
    high VARCHAR(50) NOT NULL,
    white_keys_only BOOLEAN NOT NULL,
    fileItemsItemId VARCHAR(50) NOT NULL REFERENCES fileitems(id)
);