// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0
// source: cartProduct.sql

package database

import (
	"context"
	"time"

	"github.com/google/uuid"
)

const createCartProduct = `-- name: CreateCartProduct :one
insert into cartProduct(id, created_at, updated_at, amount, cartID, productID)
values ($1,$2,$3,$4,$5,$6)
RETURNING id, created_at, updated_at, amount, cartid, productid
`

type CreateCartProductParams struct {
	ID        uuid.UUID
	CreatedAt time.Time
	UpdatedAt time.Time
	Amount    int32
	Cartid    uuid.UUID
	Productid uuid.UUID
}

func (q *Queries) CreateCartProduct(ctx context.Context, arg CreateCartProductParams) (Cartproduct, error) {
	row := q.db.QueryRowContext(ctx, createCartProduct,
		arg.ID,
		arg.CreatedAt,
		arg.UpdatedAt,
		arg.Amount,
		arg.Cartid,
		arg.Productid,
	)
	var i Cartproduct
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Amount,
		&i.Cartid,
		&i.Productid,
	)
	return i, err
}

const deleteCartProduct = `-- name: DeleteCartProduct :exec
delete from cartProduct
where id = $1
`

func (q *Queries) DeleteCartProduct(ctx context.Context, id uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteCartProduct, id)
	return err
}

const deleteCartProductByCartIdAndProductId = `-- name: DeleteCartProductByCartIdAndProductId :exec
delete from cartProduct
where cartid = $1 and productid = $2
`

type DeleteCartProductByCartIdAndProductIdParams struct {
	Cartid    uuid.UUID
	Productid uuid.UUID
}

func (q *Queries) DeleteCartProductByCartIdAndProductId(ctx context.Context, arg DeleteCartProductByCartIdAndProductIdParams) error {
	_, err := q.db.ExecContext(ctx, deleteCartProductByCartIdAndProductId, arg.Cartid, arg.Productid)
	return err
}

const doesUserHasProductInCart = `-- name: DoesUserHasProductInCart :one
select
 case
  when count(*) > 0 then true
  else false
end as user_cart_product
from
    cartProduct cip
    join cart c on cip.cartid = c.id
    join users u on c.userid = u.id
where u.id = $1 and cip.id = $2
`

type DoesUserHasProductInCartParams struct {
	ID   uuid.UUID
	ID_2 uuid.UUID
}

func (q *Queries) DoesUserHasProductInCart(ctx context.Context, arg DoesUserHasProductInCartParams) (bool, error) {
	row := q.db.QueryRowContext(ctx, doesUserHasProductInCart, arg.ID, arg.ID_2)
	var user_cart_product bool
	err := row.Scan(&user_cart_product)
	return user_cart_product, err
}

const doesUserHasTheProductInCart = `-- name: DoesUserHasTheProductInCart :one
select
 case
  when count(*) > 0 then true
  else false
end as user_cart_product
from
    cartProduct cip
    join cart c on cip.cartid = c.id
    join users u on c.userid = u.id
where u.id = $1 and cip.productID = $2
`

type DoesUserHasTheProductInCartParams struct {
	ID        uuid.UUID
	Productid uuid.UUID
}

func (q *Queries) DoesUserHasTheProductInCart(ctx context.Context, arg DoesUserHasTheProductInCartParams) (bool, error) {
	row := q.db.QueryRowContext(ctx, doesUserHasTheProductInCart, arg.ID, arg.Productid)
	var user_cart_product bool
	err := row.Scan(&user_cart_product)
	return user_cart_product, err
}

const getAllCartProductByCartID = `-- name: GetAllCartProductByCartID :many
select id, created_at, updated_at, amount, cartid, productid from cartProduct
where cartID = $1
`

func (q *Queries) GetAllCartProductByCartID(ctx context.Context, cartid uuid.UUID) ([]Cartproduct, error) {
	rows, err := q.db.QueryContext(ctx, getAllCartProductByCartID, cartid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Cartproduct
	for rows.Next() {
		var i Cartproduct
		if err := rows.Scan(
			&i.ID,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.Amount,
			&i.Cartid,
			&i.Productid,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getFullCartProductByCartId = `-- name: GetFullCartProductByCartId :many
select
  cp.id, cp.created_at, cp.updated_at, cp.amount, cp.cartid, cp.productid,
  p.name,
  p.price,
  p.company,
  p.image
  from
    cartProduct cp
    join products p on cp.productid = p.id 
  where cp.cartid = $1
`

type GetFullCartProductByCartIdRow struct {
	ID        uuid.UUID
	CreatedAt time.Time
	UpdatedAt time.Time
	Amount    int32
	Cartid    uuid.UUID
	Productid uuid.UUID
	Name      string
	Price     int32
	Company   string
	Image     string
}

func (q *Queries) GetFullCartProductByCartId(ctx context.Context, cartid uuid.UUID) ([]GetFullCartProductByCartIdRow, error) {
	rows, err := q.db.QueryContext(ctx, getFullCartProductByCartId, cartid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetFullCartProductByCartIdRow
	for rows.Next() {
		var i GetFullCartProductByCartIdRow
		if err := rows.Scan(
			&i.ID,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.Amount,
			&i.Cartid,
			&i.Productid,
			&i.Name,
			&i.Price,
			&i.Company,
			&i.Image,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateCartProduct = `-- name: UpdateCartProduct :one
update cartProduct
set amount = greatest(0, amount + $1)
where id = $2
RETURNING id, created_at, updated_at, amount, cartid, productid
`

type UpdateCartProductParams struct {
	Amount int32
	ID     uuid.UUID
}

func (q *Queries) UpdateCartProduct(ctx context.Context, arg UpdateCartProductParams) (Cartproduct, error) {
	row := q.db.QueryRowContext(ctx, updateCartProduct, arg.Amount, arg.ID)
	var i Cartproduct
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Amount,
		&i.Cartid,
		&i.Productid,
	)
	return i, err
}
