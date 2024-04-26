-- name: CreateOrderProduct :one
insert into orderProduct(id, created_at, updated_at, amount, orderID, productID)
values ($1,$2,$3,$4,$5,$6)
RETURNING *;

-- name: GetAllOrderProductByOrderID :many
select * from orderProduct
where orderID = $1;

-- name: GetFullOrderProductByOrderID :many
select
	op.*,
	p.name,
    p.price,
	p.image,
	p.company
from
	orderProduct op
	join products p on op.productid = p.id
where op.orderid = $1;