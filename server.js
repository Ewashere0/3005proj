const express = require('express');
const session = require('express-session');
const fs = require('fs');

const app = express();

app.use(session({secret: 'key'}))

app.set("view engine", "pug");

//routers
app.use("/", require('./routers/home-router'));
app.use("/users", require('./routers/users-router'));
app.use("/order", require('./routers/order-router.js'));
app.use("/registration", require('./routers/registration-router.js'));
app.use("/login", require('./routers/login-router.js'));
app.use("/logout", require('./routers/logout-router.js'));
app.use("/addbook", require('./routers/addBook-router.js'));

//lazy routers, make separate files if this gets too big idk
app.route('/background.jpg')
	.get(express.json(), getBackground);

function getBackground(req, res, next){
	fs.readFile("./images/background.jpg", function(err, data){
		if(err){
			send500(res);
			return;
		}
		res.setHeader("Content-Type", "img/png");
		res.status(200).send(data);
	});
}

//Start server
try{
	app.listen(3000);
	
	console.log("Server listening at http://localhost:3000");
}catch(err){
	console.log(err);
}

/*To do's ranked (subjectively) from most to least imporatant
	1. Ability to view books in the database with some HTML representation
	2. Checkout functionaility (i.e seeing what books are in stock adding it to a cart and buying it resulting in adjustment of inventory)
	3. Billing/shiping intake and attachement to users
*/