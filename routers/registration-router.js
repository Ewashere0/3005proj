const pug = require('pug')

const express = require('express');
let router = express.Router();

const { Pool } = require('pg')
const pool = new Pool({
	host: 'localhost',
	port: 5432,
	user: 'postgres',
	database: 'mainDB',
	password: 'admin',
  })
  
router
    .get('/', getRegistration)
	.put('/', express.json(), registerUser)

function getRegistration(req, res, next){
	if(req.session.loggedin){
		res.status(403).send('You are already logged in');
		return;
	}
    res.format({
		"text/html": () => {res.render("../views/pages/register")}
	});
}

function registerUser(req, res, next){
	//check if username is taken and add user to db here
	let data = {
		'username': req.body.username,
		'password': req.body.password,
		'type': req.body.type,
	}
	const searchText='SELECT FROM users u WHERE u.username = $1'
	const name=[req.body.username]
	pool.connect((err, client, done) => {
		if (err) throw err
		client.query(searchText, name, (err, result) => {
		  if (err) {
			console.log(err.stack)
		  } else {
			if(result.rowCount===1){
				res.status(418).send('This username already exists')
				return;
		  	}
			insertEntry(req,res,data)
		  }
		  client.release();
		})
	  })
}

//there's probably a way to combine these querries into one, will optimize later
function insertEntry(req,res,data){
	const text = 'INSERT INTO users VALUES($1, $2, $3)'
	const values = [data.username,data.password,data.type]
	pool.connect((err, client, done) => {
		if (err) throw err
		client.query(text, values, (err, result) => {
		  if (err) {
			console.log(err.stack)
		  } else {
			req.session.loggedin = true;
			req.session.username = req.body.username;
			if (req.body.type === "Owner"){
				req.session.owner = true;
			}
			else{
				req.session.owner = false;
			}
			console.log('success!')
			console.log(data)

			res.status(201).send(data)

		  }
		  client.release();
		})
	  })
}

//Export the router so it can be mounted in the main app
module.exports = router;