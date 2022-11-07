const express = require('express');
const fs=require('fs');
const validator=require('validator');
const path = require('path');
//MongoDB Files
const Movie=require('./models/movieModel.js');
const Actor=require("./models/actorModel");

// helper function
function sortDate(movie){
    
    //sort movie by date
    let sortedArr=movie.sort(function(a,z){
        return new Date(z.date) - new Date(a.date);
    });
    return sortedArr;
}

CRUD_ops = {

    //1. Create (POST) Movie
    createMovie: function (req, res){    
       const movie= new Movie(req.body);
         movie.save().then(() => {
            res.send(`added ${req.body.id} successfully`);
         }).catch(err => {
            if(err.name="ValidationError"){
                let errors = {};
                Object.keys(err.errors).forEach((key) => {
                errors[key] = err.errors[key].message;
                });
                res.status(400).send(errors);

            }
            else{
                res.status(400).send(err);
            }
        });
    },

    //2. Update
    updateMovie: function (req,res){
        const movieID=req.params.id;
        if(req.body.id){
            res.status(400).send("Cannot update movie ID.");
        }
        else if(req.body.actors){
            res.status(400).send("Cannot update movie actors.");
        }
        else{
            Movie.findOneAndUpdate({id: movieID}, {$set: req.body}).then((movie)=>{
                if(!movie){
                    res.status(400).send("Provided movie ID is not found!");
                }
                else{
                    res.send(`updated ${movieID} Successfully`);
                }
            }).catch((err)=>{
                res.status(400).send(err);
            });
        }           
    },
      


    //3. Create (POST) Actor
    createActor: function (req, res) {
        const actor= new Actor(req.body);
        actor.save().then(() => {
            res.send(`added ${req.body.name} successfully`);
        }).catch(err => {
            if(err.name="ValidationError"){
                let errors = {};
                Object.keys(err.errors).forEach((key) => {
                errors[key] = err.errors[key].message;
            });
                res.status(400).send(errors);
            }
            else{
                res.status(400).send(err);
            }
        });
    },
    //4. add actor to movie
    AddActorToMovie: function (req, res) {
        let movieId = req.params.movieId;
        let actorId=req.params.actorId;

        //check if actor exists
        Actor.findById(actorId).then((actor)=>{
            if(!actor){
                res.status(400).send("Actor not found!");
            }
        }).catch((err)=>{
            res.status(400).send(err);
        });

        Movie.findOne({id: movieId}).then((movie)=>{
            if(!movie){
                res.status(400).send("Movie not found!");
            }
            //check if actor exists in actors array
            else if(movie.actors.includes(actorId)){
                res.status(400).send("Actor already added to this movie");
            }
            else{
                movie.actors.push(actorId);
                movie.save().then(()=>{
                    res.send(`added actor to ${movieId} successfully`);
                }).catch((err)=>{
                    res.status(400).send(err);
                });
            }
        }).catch((err)=>{
            res.status(400).send(err);
        });        
    },
    //5. Get (spesific) Movie
    getMovie:  function (req,res){
        let movieId = req.params.id;
        Movie.findOne({id: movieId}).then((movie)=>{
            if(!movie){
                res.status(400).send("Movie not found!");
            }
            else{
            movie.populate({path: 'actors', model: 'Actor'}).then((movie)=>{
                res.send(movie);
            }).catch((err)=>{
                res.status(400).send(err);
            });
        }
        }).catch((err)=>{
            res.status(400).send(err);
        });
    },

    //6. Get (all) Movie -- sort by date.
    getMovies: function (req,res){
        Movie.find({}).then((movie)=>{
            // sort all movies by date in descending order
            let sortedArr=sortDate(movie);
            res.send(sortedArr);
        }).catch((err)=>{
            res.status(400).send(err);
        });
    },

    //7. Delete Actor From Movie
    deleteActorFromMovie: function(req,res){
        let movieId = req.params.movieId;
        let actorName = req.params.actorName;
        Actor.findOne({name: actorName}).then((actor)=>{
            if(!actor){
                res.status(400).send("Actor not found!");
            }
            else{
                Movie.findOne({id: movieId}).then((movie)=>{
                    if(!movie){
                        res.status(400).send("Movie not found!");
                    }
                    else if(!movie.actors.includes(actor.id)){
                        res.status(400).send("Actor not found in this movie!");
                    }
                    else if(movie.actors.length==1){
                        Movie.updateOne({id: movieId},{$unset: {actors: "" }}).then(()=>{
                            res.send(`deleted actor ${actorName} from ${movieId} successfully`);
                        }).catch((err)=>{
                            res.status(400).send(err);
                        });
                    }
                    else{
                        Movie.updateOne({id: movieId},{$pullAll: {actors: [actor._id]}}).then(()=>{
                            res.send(`deleted actor ${actorName} from ${movieId} successfully`);
                        }).catch((err)=>{
                            res.status(400).send(err);
                        });
                    }
                }).catch((err)=>{
                    res.status(400).send(err);
                });

                
            }
        });
    },

    //8.Delete Movie
    deleteMovie: function (req,res){
        let movieId = req.params.id;
        Movie.deleteOne({id: movieId}).then((result)=>{
            if(result.deletedCount>0){
                res.send(`deleted ${movieId} successfully`);
            }
            else{
                res.status(400).send("Movie not found!");
            }
         }).catch((err)=>{
            res.status(400).send(err);
         });
    },
    //9. Get all Actors
    getActors: function (req,res){
        Actor.find({}).then((actor)=>{
            res.send(actor);
        }).catch((err)=>{
            res.status(400).send(err);
        });
    }
};

module.exports=CRUD_ops;
