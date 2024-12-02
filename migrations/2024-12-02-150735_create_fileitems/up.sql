-- Your SQL goes here
CREATE TABLE fileitems (
    id VARCHAR(50) PRIMARY KEY NOT NULL,
    locked BOOLEAN NOT NULL,
    name VARCHAR(255) NOT NULL,
    notes TEXT NOT NULL,
    channel INTEGER NOT NULL,
    base_delay FLOAT NOT NULL,
    avg_delay FLOAT NOT NULL,
    vep_out VARCHAR(255) NOT NULL,
    vep_instance VARCHAR(255) NOT NULL,
    smp_number VARCHAR(255) NOT NULL,
    smp_out VARCHAR(255) NOT NULL,
    color VARCHAR(255) NOT NULL
);