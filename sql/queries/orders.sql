-- name: CreateOrder :one
insert into orders(id, created_at, updated_at, orderTotal, userID, addressID)
values ($1,$2,$3,$4,$5,$6)
RETURNING *;

-- name: GetAllOrderByUserID :many
select * from orders
where userID = $1;