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
SELECT 
  *
FROM 
  products
WHERE 
  (COALESCE(array_length($1::TEXT[], 1), 0) = 0 
    OR company = ANY($1::TEXT[]))  -- Proper comparison with arrays
  AND (COALESCE(array_length($2::TEXT[], 1), 0) = 0 
    OR category = ANY($2::TEXT[]))  -- Correct handling of set-returning functions
  AND ($3::INT IS NULL OR price < $3::INT)  -- Explicit type casting to INT
  AND ($4::TEXT IS NULL OR name ILIKE '%' || $4::TEXT || '%')  -- Explicit type for ProductName
LIMIT $5  -- Define limit for pagination
OFFSET $6;  -- Define offset for pagination



