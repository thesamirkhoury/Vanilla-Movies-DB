const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator=require('validator');

const ActorSchema = new Schema({
    name: {
        type: String,
        required: [true,"Name is Not Provided!"],
        trim: true,
        unique: true
    },
    picture: {
        type: String,
        required: [true,"Picture is Not Provided!"],
        trim: true,
        validate(value) {
            if(!validator.isURL(value)){
                throw new Error("A Picture URL should be a valid URL address!");
            }
        }
    },
    site: {
        type: String,
        required: [true,"Website is Not Provided!"],
        trim: true,
        validate(value) {
            if(!validator.isURL(value)){
                throw new Error("A Website URL should be a valid URL address!");
            }
        }
    },
});

const Actor = mongoose.model('Actor', ActorSchema);
module.exports = Actor;