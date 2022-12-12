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
    .get('/:id', displayProfile)
    .get('/:id/info', displayUserInfo)
    .put('/',express.json(), addInfo)

function displayProfile(req,res,next){

    if(req.session.username==req.params.id){
        let data = pug.renderFile("views/pages/profile.pug", {
            loggedin: req.session.loggedin, 
            owner: req.session.owner,
            username:req.session.username
        });
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(data);
    }
    else{
        res.status(404).send('Not authorized to access this users page');
    }
}

function displayUserInfo(req,res,next){

    if(req.session.username==req.params.id){
        let data = pug.renderFile("views/pages/billing.pug", {
            loggedin: req.session.loggedin, 
            owner: req.session.owner,
            username:req.session.username
        });
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(data);
    }
    else{
        res.status(404).send('Not authorized to access this users page');
    }

}

function addInfo(req,res,next){
    //check if this card number is already being used by a different user 
	let data = {
		'name': req.body.name,
		'cardNum': req.body.cardNum,
		'address': req.body.address,
        'username':req.session.username
	}

	const searchText='SELECT FROM billingInfo b WHERE b.cardNumber = $1'
	const curNum=[data.cardNum]
	pool.connect((err, client, done) => {
		if (err) throw err
		client.query(searchText, curNum, (err, result) => {
		  if (err) {
			console.log(err.stack)
		  } else {
			if(result.rowCount===1){
				res.status(418).send('This username already exists')
				return;
		  	}
			insertInfo(res,data)
		  }
		  client.release();
		})
	  })
}

function insertInfo(res,data){
    const text = 'INSERT INTO billingInfo VALUES($1, $2, $3, $4)'
	const values = [data.cardNum,data.name,data.address,data.username]
	pool.connect((err, client, done) => {
		if (err) throw err
		client.query(text, values, (err, result) => {
		  if (err) {
			console.log(err.stack)
		  } else {
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