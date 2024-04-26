-- +goose Up
create table address(
    id uuid primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    name text not null,
    location text not null,
    landmark text not null,
    city text not null,
    country text not null,
    pin int not null,
    userID uuid not null
    references users(id)
);

-- +goose Down
drop table address;