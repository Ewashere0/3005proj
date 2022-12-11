const pug = require('pug')

const express = require('express');
let router = express.Router();


router
    .get('/:id', displayProfile)
    .get('/:id/info', displayUserInfo)

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

//Export the router so it can be mounted in the main app
module.exports = router;