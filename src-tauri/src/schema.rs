// @generated automatically by Diesel CLI.

diesel::table! {
    fileitems {
        id -> Text,
        locked -> Bool,
        name -> Text,
        notes -> Text,
        channel -> Nullable<Integer>,
        base_delay -> Nullable<Float>,
        avg_delay -> Nullable<Float>,
        vep_out -> Text,
        vep_instance -> Text,
        smp_number -> Text,
        smp_out -> Text,
        color -> Text,        
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    fileitems,
);

