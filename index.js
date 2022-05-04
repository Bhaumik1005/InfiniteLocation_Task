const express = require("express");
const mongoose = require("mongoose");
const user = require("./routes/userRoutes");
const bodyParser = require('body-parser');
const ejs = require("ejs");
const app = express();
const path = require('path');

app.use(bodyParser.urlencoded({  extended: true }));
app.use(bodyParser.json());



app.set('view engine', 'ejs');

app.use("/location",user);

mongoose.connect('mongodb://localhost/Location', {
    useNewUrlParser: true
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("opne", function() {
    console.log("Connected Successfully");
});



app.listen(3000, () => console.log("Server is running.... at 3000"));