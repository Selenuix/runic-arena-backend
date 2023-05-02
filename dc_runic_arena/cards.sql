create table cards
(
    id       int auto_increment
        primary key,
    name     varchar(191) not null,
    image    varchar(191) not null,
    power    int          not null,
    type_id  int          not null,
    class_id int          not null,
    constraint Cards_name_key
        unique (name),
    constraint Cards_class_id_fkey
        foreign key (class_id) references classes (id)
            on update cascade,
    constraint Cards_type_id_fkey
        foreign key (type_id) references types (id)
            on update cascade
)
    collate = utf8mb4_unicode_ci;

