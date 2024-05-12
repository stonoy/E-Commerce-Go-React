-- name: CreateOrder :one
insert into orders(id, created_at, updated_at, orderTotal, userID, addressID)
values ($1,$2,$3,$4,$5,$6)
RETURNING *;

-- name: GetAllOrderByUserID :many
select * from orders
where userID = $1
limit $2
offset $3;

-- name: GetAllOrderCountByUserID :one
select count(*) from orders
where userID = $1;

-- name: GetAllOrders :many
select * from orders
where created_at >= $1 and created_at < $2
limit $3
offset $4;

-- name: GetAllOrdersCount :one
select count(*) from orders
where created_at >= $1 and created_at < $2;

-- name: GetProductCountOfOrder :many
select
    p.name,
    op.productId,
    sum(op.amount) as total_quantity
from
    orderProduct op
    join products p on op.productID = p.id
group by
    op.productID,
    p.name;