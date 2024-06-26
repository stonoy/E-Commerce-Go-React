// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0
// source: users.sql

package database

import (
	"context"
	"time"

	"github.com/google/uuid"
)

const createNewUser = `-- name: CreateNewUser :one
insert into users(id, created_at, updated_at, name, role, email, password)
values ($1,$2,$3,$4,$5,$6,$7)
RETURNING id, created_at, updated_at, name, role, email, password
`

type CreateNewUserParams struct {
	ID        uuid.UUID
	CreatedAt time.Time
	UpdatedAt time.Time
	Name      string
	Role      string
	Email     string
	Password  string
}

func (q *Queries) CreateNewUser(ctx context.Context, arg CreateNewUserParams) (User, error) {
	row := q.db.QueryRowContext(ctx, createNewUser,
		arg.ID,
		arg.CreatedAt,
		arg.UpdatedAt,
		arg.Name,
		arg.Role,
		arg.Email,
		arg.Password,
	)
	var i User
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Name,
		&i.Role,
		&i.Email,
		&i.Password,
	)
	return i, err
}

const getUserByEmail = `-- name: GetUserByEmail :one
select id, created_at, updated_at, name, role, email, password from users
where email = $1
`

func (q *Queries) GetUserByEmail(ctx context.Context, email string) (User, error) {
	row := q.db.QueryRowContext(ctx, getUserByEmail, email)
	var i User
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Name,
		&i.Role,
		&i.Email,
		&i.Password,
	)
	return i, err
}

const getUserByID = `-- name: GetUserByID :one
select id, created_at, updated_at, name, role, email, password from users
where id = $1
`

func (q *Queries) GetUserByID(ctx context.Context, id uuid.UUID) (User, error) {
	row := q.db.QueryRowContext(ctx, getUserByID, id)
	var i User
	err := row.Scan(
		&i.ID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Name,
		&i.Role,
		&i.Email,
		&i.Password,
	)
	return i, err
}

const getUserCount = `-- name: GetUserCount :one
SELECT COUNT(*) FROM users
`

func (q *Queries) GetUserCount(ctx context.Context) (int64, error) {
	row := q.db.QueryRowContext(ctx, getUserCount)
	var count int64
	err := row.Scan(&count)
	return count, err
}
