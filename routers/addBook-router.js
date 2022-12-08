const pug = require('pug')

const express = require('express');
let router = express.Router();

router
    .get('/', getForm)
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
            "text/html": () => {res.render("../views/pages/addBook.pug")}
        });
    }
    
    function addBook(req, res, next){
        let data = {
            'ISBN': req.body.ISBN,
            'Title': req.body.title,
            'Author': req.body.author,
            'Year published': req.body.year,
            'Genre': req.body.genre,
            'Number of pages': req.body.pageNum,
            'Price': req.body.price,
        }
        console.log(data)
    
        res.status(201).send(data)
    }
//Export the router so it can be mounted in the main app
module.exports = router;

