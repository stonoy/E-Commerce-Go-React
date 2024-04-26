-- +goose Up
create table orders(
    id uuid primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    orderTotal float not null,
    userID uuid not null
    references users(id)
    on delete cascade,
    addressID uuid not null
    references address(id)
);

-- +goose Down
drop table orders;