-- name: CreateProduct :one
insert into products(id, created_at, updated_at, name, price, image, description, category, company, featured, shipping)
values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
RETURNING *;

-- name: GetAllProducts :many
select * from products;

-- name: GetProductById :one
select * from products
where id = $1;