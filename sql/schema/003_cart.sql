-- +goose Up
create table cart(
    id uuid primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    numItemsInCart int not null,
    chargeTotal float not null,
    shipping int not null,
    tax float not null,
    orderTotal int not null,
    userID uuid not null
    references users(id)
    on delete cascade
);

-- +goose Down
drop table cart;