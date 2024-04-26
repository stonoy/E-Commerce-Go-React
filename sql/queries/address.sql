-- name: CreateAddress :one
insert into address(id, created_at, updated_at,name,location,landmark, city,country,pin,userID)
values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
RETURNING *;

-- name: GetAllAddressByUserID :many
select * from address
where userID = $1;

-- name: GetAddressByOrder :one
select
    add.*
from
    orders o
    join address add on o.addressID = add.id
where o.id = $1;