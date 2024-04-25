-- +goose Up
create table products(
    id uuid primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    name text not null,
    price int not null,
    image text not null,
    company text not null,
    description text not null,
    category text not null,
    featured boolean not null,
    shipping boolean not null
);

-- +goose Down
drop table products;