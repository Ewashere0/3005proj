const express = require('express');
let router = express.Router();


router
    .get('/', getBooks)

function getBooks(req, res, next){
    const { Pool } = require('pg')
	const pool = new Pool({
		host: 'localhost',
		port: 5432,
		user: 'postgres',
		database: 'mainDB',
		password: 'admin',
	})
	const text='SELECT * FROM books WHERE inventory > 0;'
	pool.connect((err, client, done) => {
		if (err) throw err
		client.query(text, (err, result) => {
		  if (err) {
			console.log(err.stack)
		  } else {
            console.log(result)
			res.format({
				"text/html": () => {res.render("../views/pages/books.pug")}
			});	
		  }
		})
	  })


}

//Export the router so it can be mounted in the main app
module.exports = router;