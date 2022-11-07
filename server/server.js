// requires
const express = require('express');
const routes = require('./routes.js');
const mongoose = require('mongoose');


// create express app
const app = express();
const port = 3001;

mongoose.connect("mongodb://127.0.0.1:27017/Best2Watch", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    // listen on port
    app.listen(port,()=>{
        console.log(`running on port ${port}`);
        console.log("connected to MongoDB"); 
    }); 
}
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// forward to routes, to handle the routing.
app.use('/',routes);

