-- name: CreateCart :one
insert into cart(id, created_at, updated_at, numItemsInCart,chargeTotal,shipping,tax,orderTotal,userID)
values ($1,$2,$3,$4,$5,$6,$7,$8,$9)
RETURNING *;

-- name: GetNumOfCart :one
select count(*) from cart
where userID = $1;

-- name: GetCartByUserId :one
select * from cart
where userID = $1;

-- name: UpdateCart :one
update cart
set updated_at = NOW(),
numItemsInCart = $1,
chargeTotal = $2,
shipping = $3,
tax = $4,
orderTotal = $5
where userID = $6
RETURNING *;

-- name: DeleteCartByUserId :exec
delete from cart
where userID = $1;

-- name: GetProductCountOfCart :many
select
    p.name,
    cp.productID,
    sum(cp.amount) as total_quantity
from
 cartProduct cp
 join products p on cp.productID = p.id
 group by
    cp.productID,
    p.name;