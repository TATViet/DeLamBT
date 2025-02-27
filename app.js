// Filename - App.js
 
const express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = 
        require("passport-local-mongoose")
const User = require("./model/User");
let app = express();
 
mongoose.connect("mongodb://localhost/27017");
 
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
}));
 
app.use(passport.initialize());
app.use(passport.session());
 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 
//=====================
// ROUTES
//=====================
 
// Showing home page
app.get("/", function (req, res) {
    res.render("home");
});
 
// Showing secret page
app.get("/secret", isLoggedIn, function (req, res) {
    res.render("secret");
});

app.get("/verysecret", function (req, res) {
  res.render("verysecret");
});
 
// Showing register form
app.get("/register", function (req, res) {
    res.render("register");
});
 
// Handling user signup
app.post("/register", async (req, res) => {
    const user = await User.create({
      username: req.body.username,
      password: req.body.password,
      IsAD:     req.body.IsAD
    });
   
    return res.redirect('/login');
  });
 
//Showing login form
app.get("/login", function (req, res) {
    res.render("login");
});
 
//Handling user login
app.post("/login", async function(req, res){
    try {
        // check if the user exists
        const user = await User.findOne({ username: req.body.username });
        if (user) {
          //check if password matches
          const result = req.body.password === user.password;
          if (result) {
            res.render("secret");
          } else {
            res.status(400).json({ error: "password doesn't match" });
          }
        } else {
          res.status(400).json({ error: "User doesn't exist" });
        }
      } catch (error) {
        res.status(400).json({ error });
      }
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/secret");
}


function isLoggedIn(req, res, next) {
if (req.isAuthenticated()) {
  if(req.user.IsAD) {
    // if gender is true (male), redirect to a specific page
    res.redirect("/verysecret");
  } else {
    // if gender is false (female), redirect to a different page
    res.redirect("/secret");
  }
} else {
  res.redirect("/login");
}
}

 
//Handling user logout 
app.get("/logout", function (req, res) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
});
 
 
 

 
let port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
});