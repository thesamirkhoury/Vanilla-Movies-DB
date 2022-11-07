const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator=require('validator');
const uniqueValidator = require('mongoose-unique-validator');

const MovieSchema = new Schema({
    id:{
        type: String,
        required: [true,"ID is Not Provided!"],
        trim: true,
        unique: true,
        validate(value) {
            if(!validator.isAlphanumeric(value)){
                throw new Error("ID Should be letters or number only!");
            }
        }
    },
    name:{
        type: String,
        required: [true,"Name is Not Provided!"],
        trim: true
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
    director: {
        type: String,
        required: [true,"Director Name is Not Provided!"],
        trim: true,
        validate(value) {
            if(!validator.isAlpha(value,"en-US",{ ignore: ' -' })){
                throw new Error("Director Name should be letters only!");
            }
        }
    },
    date: {
        type: String,
        required: [true,"Production Date is Not Provided!"],
        trim: true,
        validate(value) {
            if(!validator.isDate(value,"YYYY/MM/DD")){
                throw new Error("Production Date should be a valid date!");
            }
        }
    },
    rating: {
        type: Number,
        required: [true,"Rating is Not Provided!"],
        min:[1,"Rating should be between 1 and 5!"],
        max:[5,"Rating should be between 1 and 5!"],
        trim: true,
    },
    isSeries: {
        type: Boolean,
        required: [true,"Is Series is Not Provided!"],
    },
    series_details: {
        type: [],
        required: function isRequired(){
            return this.isSeries;
        }
    },
    actors:{
        type: [{type: mongoose.Types.ObjectId, ref:"Actor"}],
    }
},{timestamps:true});
MovieSchema.set('autoIndex', false);
MovieSchema.plugin(uniqueValidator,{message: "This ID already exists!"});


const Movie = mongoose.model('Movie',MovieSchema);
module.exports = Movie;