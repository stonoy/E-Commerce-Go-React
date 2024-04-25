-- name: CreateCartProduct :one
insert into cartProduct(id, created_at, updated_at, amount, cartID, productID)
values ($1,$2,$3,$4,$5,$6)
RETURNING *;

-- name: GetAllCartProductByCartID :many
select * from cartProduct
where cartID = $1;

-- name: UpdateCartProduct :one
update cartProduct
set amount = greatest(0, amount + $1)
where id = $2
RETURNING *;

-- name: DeleteCartProduct :exec
delete from cartProduct
where id = $1;

-- name: DoesUserHasProductInCart :one
select
 case
  when count(*) > 0 then true
  else false
end as user_cart_product
from
    cartProduct cip
    join cart c on cip.cartid = c.id
    join users u on c.userid = u.id
where u.id = $1 and cip.id = $2;

-- name: GetFullCartProductByCartId :many
select
  cp.*,
  p.name,
  p.price,
  p.company,
  p.image
  from
    cartProduct cp
    join products p on cp.productid = p.id 
  where cp.cartid = $1;