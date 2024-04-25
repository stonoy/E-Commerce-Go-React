-- +goose Up
create table cartProduct(
    id uuid primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    amount int not null,
    cartID uuid not null
    references cart(id)
    on delete cascade,
    productID uuid not null
    references products(id)
    on delete cascade,
    unique(cartID, productID)
);

-- +goose Down
drop table cartProduct;