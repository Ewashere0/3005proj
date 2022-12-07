const pug = require('pug')

const express = require('express');
let router = express.Router();

router
    .get('/', getLogin)
	.put("/:uid", express.json(), loginUser);

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
	req.session.user = req.params.uid;
	req.session.loggedin = true;
	req.session.username = req.body.username;
	if (req.body.type === "Manager"){
		req.session.owner = true;
	}
	else{
		req.session.owner = false;
	}
	res.status(201).send();
}

//Export the router so it can be mounted in the main app
module.exports = router;