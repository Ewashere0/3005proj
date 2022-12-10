const pug = require('pug')

const express = require('express');
let router = express.Router();

let nextId = 0

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
	.post('/', express.json(), registerUser)

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
		'id': nextId++
	}
	const text = 'INSERT INTO users VALUES($1, $2, $3, $4)'
	const values = [data.id,data.username,data.password,data.type]
	pool.connect((err, client, done) => {
		if (err) throw err
		client.query(text, values, (err, res) => {
		  if (err) {
			console.log(err.stack)
		  } else {
			console.log('success!')
		  }
		})
	  })
	
	console.log(data)

	res.status(201).send(data)
}

//Export the router so it can be mounted in the main app
module.exports = router;