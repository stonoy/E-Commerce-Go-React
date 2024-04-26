-- +goose Up
create table orderProduct(
    id uuid primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    amount int not null,
    orderID uuid not null
    references orders(id)
    on delete cascade,
    productID uuid not null
    references products(id)
    on delete cascade,
    unique(orderID, productID)
);

-- +goose Down
drop table orderProduct;