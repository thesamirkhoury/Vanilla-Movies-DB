const express = require('express');
const crud = require('./crud.js');
const path=require('path');
var router = express.Router();

//redirect default url to list
router.get('/', function(req, res){
    res.redirect(301,'/list');
});

//redirect index to list
router.get('/index', function(req, res){
    res.redirect(301,'/list');
});

router.use('/JS',express.static(path.join(__dirname,'../Client/JS')));
router.use('/CSS',express.static(path.join(__dirname,'../Client/CSS')));
router.use('/list',express.static(path.join(__dirname,'../Client/list.html')));


// movies CRUD.
router.post('/movie', crud.createMovie);
router.get('/movie', crud.getMovies);
router.get('/movie/:id', crud.getMovie);
router.put('/movie/:id', crud.updateMovie);
router.delete('/movie/:id', crud.deleteMovie);

// actors CRUD.
router.post('/movie/:movieId/actor/:actorId', crud.AddActorToMovie);
router.post('/actor', crud.createActor);
router.delete('/movie/:movieId/actor/:actorName', crud.deleteActorFromMovie);
router.get('/actors', crud.getActors);

module.exports = router;