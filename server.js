'use strict';
const express = require("express"),
    logger = require("morgan"),
    cookieParser = require("cookie-parser"),
    users = require("./routes/users"),
    app = express(),
    bodyParser=require("body-parser"),
    mongoose=require("mongoose"),
    RateLimit = require("express-rate-limit"),
    paginate = require('express-paginate');


app.use(paginate.middleware(10, 50));

mongoose.connect("mongodb+srv://suku:suku@cluster0-hxwdz.mongodb.net/ProjectManagement?retryWrites=true",
 {useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDB..."))
    .catch((err) => console.error("Could not connect to MongoDB..."));

app.listen(3000, () => console.log("Connected on port 3000!"));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,x-auth-token");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  next();
});
app.enable("trust proxy");

const apiLimiter = new RateLimit({
  windowMs: 15*60*1000,
  max: 100,
});


app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use("/v1/api/users", users, apiLimiter);

app.get("/", apiLimiter, function(req, res) {
  res.send({title: "Home Page"});
});


