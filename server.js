const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();

app.use(session({secret: 'key'}))

app.set("view engine", "pug");

//routers
app.use("/", require('./routers/home-router'));
app.use("/registration", require('./routers/registration-router.js'));
app.use("/login", require('./routers/login-router.js'));
app.use("/logout", require('./routers/logout-router.js'));

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
	//database
	let booksDB = new sqlite3.Database('.\SQL\books.db',sqlite3.OPEN_READWRITE, (err) => {
		if (err) {
		  console.error(err.message);
		}
		else{
			console.log('Connected to the book database.');
		}
	  });

	console.log("Server listening at http://localhost:3000");
}catch(err){
	console.log(err);
}
