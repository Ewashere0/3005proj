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
    .get('/',express.json(), getUserInfo)
	.post('/', express.json(), placeOrder)



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
			getBooks(req,res,next,result)
		  }
		})
		client.release();
	})
	  
}
	  
function getBooks(req, res, next,prevResult){
	const { Pool } = require('pg')
	const pool = new Pool({
		host: 'localhost',
		port: 5432,
		user: 'postgres',
		database: 'mainDB',
		password: 'admin',
	})
	if(!req.session.loggedin){
		res.status(404).send('You must be logged in to access this page');
		return;
	}
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
			createList(req,res,next,prevResult,result)
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

function placeOrder(req, res, next){
	let billingInfo = req.body.billingInfo


	const text = 'INSERT INTO billingInfo VALUES($1, $2, $3, $4)'
    const values = [billingInfo.cardNumber, billingInfo.cardName, billingInfo.address, req.session.username]

	pool.connect((err, client, done) => {
		if (err) throw err
		client.query(text, values, (err, res) => {
		  if (err) {
			if(err.detail.includes('already exists')){
				console.log('using existing card info')
				createOrder(req.body)
			}
			else{
				res.status(406).send();
			}
		  } else {
			console.log('added billing info for user ' + req.session.username)
			createOrder(req.body)
		  }
		  client.release();
		})
	  })
	res.status(201).send()
}

function createOrder(data){
	let totalAmount = 0;
	let cart = data.cart;
	let billingInfo = data.billingInfo

	cart.forEach(element => {
		console.log(element)
		totalAmount += parseFloat(element.price.split('$')[1])*element.amount
	});

	const text = 'INSERT INTO orders(shippingAddress, orderDate, trackingInfo, totalAmount, cardNumber)\
				  VALUES($1, to_timestamp($2), $3, $4, $5) RETURNING orderNumber'
    const values = [billingInfo.address, Date.now() / 1000, 'awaiting dispatch from warehouse', totalAmount, billingInfo.cardNumber]
	pool.connect((err, client, done) => {
		if (err) throw err
		client.query(text, values, (err, res) => {
		  if (err) {
			console.log(err.stack)
			res.status(406).send();
		  } else {
			data.orderNumber = res.rows[0].ordernumber;
			console.log('Added order for ' + billingInfo.address)
			createContains(data)
		  }
		  client.release();
		})
	  })
}

function createContains(data){
	let cart = data.cart
	let modifiedCard = {}

	cart.forEach(element => {
		if(element.bookId in modifiedCard){
			modifiedCard[element.bookId] += element.amount
		}
		else{
			modifiedCard[element.bookId] = element.amount
		}
	});

	for(const key in modifiedCard){
		const text = 'INSERT INTO contains VALUES($1, $2, $3)'
		const values = [data.orderNumber, key, modifiedCard[key]]
		pool.connect((err, client, done) => {
			if (err) throw err
			client.query(text, values, (err, res) => {
			if (err) {
				console.log(err.stack)
				res.status(406).send();
			} else {
				console.log('Added contains for order number ' + data.orderNumber)
			}
			client.release();
			})
		})
	}
}
//Export the router so it can be mounted in the main app
module.exports = router;