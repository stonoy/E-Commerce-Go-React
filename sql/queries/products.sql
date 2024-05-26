-- name: CreateProduct :one
insert into products(id, created_at, updated_at, name, price, image, description, category, company, featured, shipping)
values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
RETURNING *;

-- name: GetAllProducts :many
select * from products;

-- name: GetFeaturedProducts :many
select * from products
where featured = true;

-- name: GetProductById :one
select * from products
where id = $1;

-- name: GetCompanyAndCategory :many
select distinct company,category from products;

-- name: GetFilteredProducts :many
select * from products
where (name like $1)
and (price < $2)
and (company = any($3::text[]))
and (category = any($4::text[]))
limit $5
offset $6;

-- name: GetFilteredProductsCount :one
select count(*) from products
where (name like $1)
and (price < $2)
and (company = any($3::text[]))
and (category = any($4::text[]));

-- name: GetFilteredProductsComanyandCategory :many
select distinct company,category from products
where (name like $1)
and (price < $2)
and (company = any($3::text[]))
and (category = any($4::text[]));


-- name: UpdateProduct :one
update products
set updated_at = NOW(),
name = $1,
price = $2,
description = $3,
company = $4,
category = $5,
image = $6,
featured = $7,
shipping = $8
where id = $9
RETURNING *;

-- name: IncrementProductVisitById :exec
update products
set updated_at = NOW(),
visits = visits + 1
where id = $1;

-- name: GetVisitsOfProducts :many
select id,name,visits from products;

