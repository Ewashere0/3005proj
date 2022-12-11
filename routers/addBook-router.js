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
    .get('/', getForm)
    .put('/', express.json(), addBook)

    function getForm(req, res, next){
        if(!req.session.loggedin){
            res.status(404).send('You must be logged in to access this page');
            return;
        }
        if(!req.session.owner){
            res.status(403).send('Users cannot access this page');
            return;
        }
        let data = pug.renderFile("views/pages/addBook.pug", {
          loggedin: req.session.loggedin, 
          username: req.session.username,
          owner: req.session.owner
        });
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(data);
        return;
    }
    
    function addBook(req, res, next){
        let data = {
            'ISBN': req.body.ISBN,
            'Title': req.body.title,
            'Author': req.body.author,
            'Year': req.body.year,
            'Publisher':req.body.publisher,
            'Genre': req.body.genre,
            'Pages': req.body.pageNum,
            'Price': req.body.price,
            'Quantity': req.body.quantity,
        }
        const text = 'INSERT INTO books VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)'
        const values = [data.ISBN,data.Title,data.Author,data.Year,data.Publisher,data.Genre,data.Pages,data.Price,data.Quantity]
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
