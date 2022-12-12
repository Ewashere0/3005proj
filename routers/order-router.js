const pug = require('pug')
const express = require('express');
let router = express.Router();


router
    .get('/', getUserInfo)


function getUserInfo(req, res, next){
	const { Pool } = require('pg')
	const pool = new Pool({
		host: 'localhost',
		port: 5432,
		user: 'postgres',
		database: 'mainDB',
		password: 'admin',
	})
	const query = {
		text:'SELECT address,cardNumber,name FROM billingInfo WHERE username = $1;',
		values: [req.session.username],
		rowMode: 'array',
	  }
	pool.connect((err, client, done) => {
		if (err) throw err
		client.query(query, (err, result) => {
		  if (err) {
			console.log(err.stack)
		  } else {
			getBooks(res,req,result)
		  }
		})
		client.release();
	  })
}

	function getBooks(req, res, prevResult){
    const { Pool } = require('pg')
	const pool = new Pool({
		host: 'localhost',
		port: 5432,
		user: 'postgres',
		database: 'mainDB',
		password: 'admin',
	})
	const query = {
		text:'SELECT ISBN,title,price,inventory FROM books WHERE inventory > 0;',
		rowMode: 'array',
	  }
	pool.connect((err, client, done) => {
		if (err) throw err
		client.query(query, (err, result) => {
		  if (err) {
			console.log(err.stack)
		  } else {
			createList(res,req,prevResult,result)
		  }
		})
		client.release();
	  })
}
function createList(req,res,prevResult,results){
	ISBNs=[]
	Titles=[]
	Prices=[]
	Inventories=[]
	Addresses=[]
	CardNums=[]
	Names=[]
	for (let i = 0; i<results.rowCount;i++){
		ISBNs.push(results.rows[i][0])
		Titles.push(results.rows[i][1])
		Prices.push(results.rows[i][2])
		Inventories.push(results.rows[i][3])
	}

	for (let i = 0; i<prevResult.rowCount;i++){
		CardNums.push(prevResult.rows[i][0])
		Names.push(prevResult.rows[i][1])
		Addresses.push(prevResult.rows[i][2])
	}

	let data = pug.renderFile("views/pages/books.pug", {
		loggedin: req.session.loggedin, 
		username: req.session.username,
		owner: req.session.owner,
		ISBNs: ISBNs,
		Titles: Titles,
		Prices:Prices,
		Inventories:Inventories,
		Addresses:Addresses,
		CardNums:CardNums,
		Names:Names
	});
	res.setHeader('Content-Type', 'text/html');
	res.status(200).send(data);
}

//Export the router so it can be mounted in the main app
module.exports = router;