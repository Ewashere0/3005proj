const pug = require('pug')

const express = require('express');
let router = express.Router();


router
    .get('/', getHome)

function getHome(req, res, next){
    let data = pug.renderFile("views/pages/home.pug", {
		loggedin: req.session.loggedin, 
		id: req.session.user
	});
	res.setHeader('Content-Type', 'text/html');
	res.status(200).send(data);
	return;
}

//Export the router so it can be mounted in the main app
module.exports = router;