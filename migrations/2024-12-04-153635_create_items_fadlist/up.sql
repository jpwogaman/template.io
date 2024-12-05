-- Your SQL goes here
CREATE TABLE items_fadlist (
    id VARCHAR(50) PRIMARY KEY NOT NULL,
    name VARCHAR(50) NOT NULL,
    code_type VARCHAR(50) NOT NULL,
    code INT NOT NULL,
    "default" INT NOT NULL,
    change_type VARCHAR(50) NOT NULL,
    fileitems_item_id VARCHAR(50) NOT NULL REFERENCES fileitems(id)
);