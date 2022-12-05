const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();

const app = express();

app.use(session({secret: 'key'}))

app.set("view engine", "pug");

//routers
app.use("/", require('./routers/home-router'));
app.use("/registration", require('./routers/registration-router.js'));
app.use("/login", require('./routers/login-router.js'));
app.use("/logout", require('./routers/logout-router.js'));

//Start server
try{
	app.listen(3000);
	//database
	let DB = new sqlite3.Database('.\SQL\mainData.db',sqlite3.OPEN_READWRITE, (err) => {
		if (err) {
		  console.error(err.message);
		}
		else{
		  console.log('Connected to the database.');
		}
	  });

	console.log("Server listening at http://localhost:3000");
}catch(err){
	console.log(err);
}
