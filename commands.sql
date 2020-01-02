-- users
drop table if exists users cascade;
create table users (
    id serial primary key,
    email text not null,
    username text not null,
    password text not null,
    UNIQUE (email),
    UNIQUE (username)
);
CREATE UNIQUE INDEX users_id_idx ON users (id);

drop procedure if exists add_user;
CREATE PROCEDURE add_user(e text, u text, p text)
LANGUAGE SQL
AS $$
INSERT INTO users (email, username, password) VALUES (e, u, p)
$$;

CALL add_user('asdf@adsf.com', 'asdf', '');
CALL add_user('a@a.com', 'a', '$argon2i$v=19$m=4096,t=3,p=1$c2dwcm9sb2d1ZQ$ICgLh7ngttvk+ZQNwaDvcSCosAu6q8xbycq3AE3mBxA');

-- INSERT INTO users (email, username, pw)
-- SELECT $1, $2, $3
-- WHERE NOT EXISTS (SELECT email FROM users WHERE email = $1);

-- INSERT INTO users (email, username, pw)
-- SELECT 'bb', 'bb', 'bb'
-- WHERE NOT EXISTS (SELECT email FROM users WHERE email = 'bb');
