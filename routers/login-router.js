const pug = require('pug')

const express = require('express');
let router = express.Router();


router
    .get('/', getLogin)
	.post('/', express.json(), loginUser)

function getLogin(req, res, next){
	if(req.session.loggedin){
		res.status(403).send('You are already logged in');
		return;
	}
	res.format({
		"text/html": () => {res.render("../views/pages/login")}
	});	
}

function loginUser(req, res, next){

	const { Pool } = require('pg')
	const pool = new Pool({
		host: 'localhost',
		port: 5432,
		user: 'postgres',
		database: 'mainDB',
		password: 'admin',
	})
	
	const text='SELECT * FROM users WHERE username = $1 AND password = $2'
	const values=[req.body.username,req.body.password]

	pool.connect((err, client, done) => {
		if (err) throw err
		client.query(text, values, (err, result) => {
			if (err) {
			console.log(err.stack)
			} else {	
				if(result.rowCount===1){
					req.session.loggedin = true;
					req.session.username = req.body.username;
					if (result.rows[0].accounttype === "Owner"){
						req.session.owner = true;
					}
					else{
						req.session.owner = false;
					}
					res.status(201).send(values)
				}
				else{
					res.status(404).send('invalid username/password');
					return;
				}	
			}
		})
	})
}

//Export the router so it can be mounted in the main app
module.exports = router;