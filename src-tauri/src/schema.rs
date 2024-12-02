// @generated automatically by Diesel CLI.

diesel::table! {
    fileitems (id) {
        id -> Text,
        locked -> Bool,
        name -> Text,
        notes -> Text,
        channel -> Integer,
        base_delay -> Float,
        avg_delay -> Float,
        vep_out -> Text,
        vep_instance -> Text,
        smp_number -> Text,
        smp_out -> Text,
        color -> Text,
    }
}
