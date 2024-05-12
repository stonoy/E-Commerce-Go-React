-- +goose Up
alter table products
add column visits int not null default 0;

-- +goose Down
alter table products
drop column visits;