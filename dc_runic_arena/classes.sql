create table classes
(
    id   int auto_increment
        primary key,
    name varchar(191) not null,
    constraint Classes_name_key
        unique (name)
)
    collate = utf8mb4_unicode_ci;

