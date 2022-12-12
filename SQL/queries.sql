From 'routers\books-router.js'
SELECT publisherid FROM publishers WHERE name = $1
INSERT INTO publishers(name, email, address, bankAccount) values($1, $2, $3, $4)
SELECT publisherid FROM publishers WHERE name = $1
INSERT INTO books VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
INSERT INTO genres VALUES($1, $2)
INSERT INTO authors VALUES($1, $2)
INSERT INTO writes VALUES($1, $2)
DELETE FROM books WHERE ISBN=$1

From 'routers\login-router.js'
SELECT * FROM users WHERE username = $1 AND password = $2

From 'routers\order-router.js'
SELECT ISBN,title FROM books WHERE inventory > 0;
SELECT address,cardNumber,name FROM billingInfo WHERE username = $1;
SELECT ISBN,title,price,inventory FROM books WHERE inventory > 0;
INSERT INTO billingInfo VALUES($1, $2, $3, $4)
INSERT INTO orders(shippingAddress, orderDate, trackingInfo, totalAmount, cardNumber)\
	VALUES($1, to_timestamp($2), $3, $4, $5) RETURNING orderNumber
INSERT INTO contains VALUES($1, $2, $3)

From 'routers\registration-router.js'
INSERT INTO users VALUES($1, $2, $3)
SELECT FROM users u WHERE u.username = $1
