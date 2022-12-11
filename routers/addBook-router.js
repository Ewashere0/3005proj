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
    .post('/', express.json(), addBook)

function getForm(req, res, next){
    if(!req.session.loggedin){
        res.status(404).send('You must be logged in to access this page');
        return;
    }
    if(!req.session.owner){
        res.status(403).send('Users cannot access this page');
        return;
    }
    res.format({
        "text/html": () => {res.render("../views/pages/addBook.pug", {
          loggedin: req.session.loggedin, 
          username: req.session.username,
          owner: req.session.owner
        })}
    });
}

function addBook(req, res, next){
    let data = {
        'ISBN': req.body.ISBN,
        'Title': req.body.title,
        'Author': req.body.author,
        'AuthorEmail': req.body.authorEmail,
        'Year': req.body.year,
        'Publisher':req.body.publisher,
        'Genre': req.body.genre,
        'Pages': req.body.pageNum,
        'Price': req.body.price,
        'Quantity': req.body.quantity,
    }
    const text = 'SELECT publisherid FROM publishers WHERE name = $1'
    const values = [data.Publisher]

    pool.connect((err, client, done) => {
      if (err) throw err
      client.query(text, values, (err, res) => {
        if (err) {
          console.log(err.stack)
        } else {
          if (res.rowCount !== 0 ){
            console.log("found publisher id for " + data.Publisher)
            data.PublisherID = (res.rows[0].publisherid);
            insertBook(data);
          }
          else{
            insertPublisher(data);
          }
        }
        client.release();
      })
    })
}

function insertPublisher(data){
  const text = 'insert into publishers(name, email, address, bankAccount) values($1, $2, $3, $4)'
  const values = [data.Publisher, null, null, null]

  pool.connect((err, client, done) => {
    if (err) throw err
    client.query(text, values, (err, res) => {
      if (err) {
        console.log(err.stack)
      } else {
        console.log('added publisher ' + data.Publisher)    
        
        const text = 'SELECT publisherid FROM publishers WHERE name = $1'
        const values = [data.Publisher]

        pool.connect((err, client, done) => {
          if (err) throw err
          client.query(text, values, (err, res) => {
            if (err) {
              console.log(err.stack)
            } else {
              data.PublisherID = res.rows[0].publisherid
              insertBook(data);
            }
            client.release();
          })
        })
      }
      client.release();
    })
  })
}

function insertBook(data){
  text = 'INSERT INTO books VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)'
  values = [data.ISBN,data.Title,data.Year,data.Publisher,data.Pages,data.Price,data.Quantity, null, data.PublisherID]

  pool.connect((err, client, done) => {
      if (err) throw err
      client.query(text, values, (err, res) => {
        if (err) {
          console.log(err.stack)
        } else {
          console.log('added book ' + data.Title)
          insertGenre(data);
        }
        client.release();
      })
    })
}

function insertGenre(data){
  text = 'INSERT INTO genres VALUES($1, $2)'
  values = [data.ISBN, data.Genre]

  pool.connect((err, client, done) => {
      if (err) throw err
      client.query(text, values, (err, res) => {
        if (err) {
          console.log(err.stack)
        } else {
          console.log('added genre ' + data.Genre)
          insertAuthor(data);
        }
        client.release();
      })
    })
}

function insertAuthor(data){
  text = 'INSERT INTO authors VALUES($1, $2)'
  values = [data.AuthorEmail, data.Author]

  pool.connect((err, client, done) => {
      if (err) throw err
      client.query(text, values, (err, res) => {
        if (err) {
          console.log(err.stack)
        } else {
          console.log('added author ' + data.Author)
          insertWrites(data);
        }
        client.release();
      })
    })
}

function insertWrites(data){
  text = 'INSERT INTO writes VALUES($1, $2)'
  values = [data.ISBN, data.AuthorEmail]

  pool.connect((err, client, done) => {
      if (err) throw err
      client.query(text, values, (err, res) => {
        if (err) {
          console.log(err.stack)
        } else {
          console.log('added writes ' + data.AuthorEmail)
        }
        client.release();

      })
    })
}

//Export the router so it can be mounted in the main app
module.exports = router;
