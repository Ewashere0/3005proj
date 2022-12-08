const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const { Pool } = require('pg')

const app = express();

app.use(session({secret: 'key'}))

app.set("view engine", "pug");

//routers
app.use("/", require('./routers/home-router'));
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

 
const DB = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  database: 'mainDB',
  password: 'admin',
})

//Start server
try{
	app.listen(3000);
	
	console.log("Server listening at http://localhost:3000");
}catch(err){
	console.log(err);
}
