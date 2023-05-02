create table _prisma_migrations
(
    id                  varchar(36)                               not null
        primary key,
    checksum            varchar(64)                               not null,
    finished_at         datetime(3)                               null,
    migration_name      varchar(255)                              not null,
    logs                text                                      null,
    rolled_back_at      datetime(3)                               null,
    started_at          datetime(3)  default CURRENT_TIMESTAMP(3) not null,
    applied_steps_count int unsigned default 0                    not null
)
    collate = utf8mb4_unicode_ci;

