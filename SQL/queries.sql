From 'routers\addBook-router.js'
SELECT publisherid FROM publishers WHERE name = $1
INSERT INTO publishers(name, email, address, bankAccount) values($1, $2, $3, $4)
SELECT publisherid FROM publishers WHERE name = $1
INSERT INTO books VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
INSERT INTO genres VALUES($1, $2)
INSERT INTO authors VALUES($1, $2)
INSERT INTO writes VALUES($1, $2)

From 'routers\login-router.js'
SELECT * FROM users WHERE username = $1 AND password = $2

From 'routers\order-router.js'
SELECT ISBN,title FROM books WHERE inventory > 0;

From 'routers\registration-router.js'
INSERT INTO users VALUES($1, $2, $3)
SELECT FROM users u WHERE u.username = $1