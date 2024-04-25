-- name: CreateNewUser :one
insert into users(id, created_at, updated_at, name, role, email, password)
values ($1,$2,$3,$4,$5,$6,$7)
RETURNING *;

-- name: GetUserCount :one
SELECT COUNT(*) FROM users;

-- name: GetUserByEmail :one
select * from users
where email = $1;

-- name: GetUserByID :one
select * from users
where id = $1;