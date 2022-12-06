const express = require('express');
let router = express.Router();


router
    .get('/', logout)

function logout(req, res, next){
	req.session.loggedin = false;
	req.session.user = null;
	req.session.username = null;
	req.session.admin = false;
	res.redirect('../')
}

//Export the router so it can be mounted in the main app
module.exports = router;