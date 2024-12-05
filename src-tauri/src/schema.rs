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

diesel::table! {
    items_art_layers (id) {
        id -> Text,
        name -> Text,
        code_type -> Text,
        code -> Integer,
        on -> Integer,
        off -> Integer,
        default -> Text,
        change_type -> Text,
        fileitems_item_id -> Text,
    }
}

diesel::table! {
    items_artlist_tap (id) {
        id -> Text,
        name -> Text,
        toggle -> Bool,
        code_type -> Text,
        code -> Integer,
        on -> Integer,
        off -> Integer,
        default -> Bool,
        delay -> Integer,
        change_type -> Text,
        ranges -> Text,
        art_layers -> Text,
        fileitems_item_id -> Text,
    }
}

diesel::table! {
    items_artlist_tog (id) {
        id -> Text,
        name -> Text,
        toggle -> Bool,
        code_type -> Text,
        code -> Integer,
        on -> Integer,
        off -> Integer,
        default -> Text,
        delay -> Integer,
        change_type -> Text,
        ranges -> Text,
        art_layers -> Text,
        fileitems_item_id -> Text,
    }
}

diesel::table! {
    items_fadlist (id) {
        id -> Text,
        name -> Text,
        code_type -> Text,
        code -> Integer,
        default -> Integer,
        change_type -> Text,
        fileitems_item_id -> Text,
    }
}

diesel::table! {
    items_full_ranges (id) {
        id -> Text,
        name -> Text,
        low -> Text,
        high -> Text,
        white_keys_only -> Bool,
        fileitems_item_id -> Text,
    }
}

diesel::joinable!(items_art_layers -> fileitems (fileitems_item_id));
diesel::joinable!(items_artlist_tap -> fileitems (fileitems_item_id));
diesel::joinable!(items_artlist_tog -> fileitems (fileitems_item_id));
diesel::joinable!(items_fadlist -> fileitems (fileitems_item_id));
diesel::joinable!(items_full_ranges -> fileitems (fileitems_item_id));

diesel::allow_tables_to_appear_in_same_query!(
    fileitems,
    items_art_layers,
    items_artlist_tap,
    items_artlist_tog,
    items_fadlist,
    items_full_ranges,
);
