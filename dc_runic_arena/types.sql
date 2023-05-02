create table types
(
    id   int auto_increment
        primary key,
    name varchar(191) not null,
    constraint Types_name_key
        unique (name)
)
    collate = utf8mb4_unicode_ci;

