var express = require("express"),
    router = express.Router(),
    Camp = require("../models/campground"),
    passport = require("passport");
//============
//Basic routes
//============
//index page
router.get("/", function(req, res) {
    Camp.find({}, function(err, camps) {
        if(err) {
            console.log(err);
            res.redirect("/");
        } else {
          res.render("campground/index", {campgrounds: camps, user: req.user});  
        }
    });
});

// new 
router.get("/new", isLoggedIn, function(req, res){
   res.render("campground/new"); 
});

//create
router.post("/", isLoggedIn, function(req, res) {
  Camp.create(req.body.camp, function(err, newCamp) {
      if(err) {
          console.log(err);
      } else {
          newCamp.author.id = req.user._id;
          newCamp.author.username = req.user.username;
          newCamp.save();
          res.redirect("/campgrounds");
      }
  });
});//body-parser is needed to parse the req.body

//show
router.get("/:id", function(req, res) {//right now the associated comments only have id displayed in the camp obj, so here 
// we need the populate.exec to fill the comment content with actual text
    Camp.findById(req.params.id).populate("comments").exec(function(err, campFound) {
        if(err) {
            console.log(err);
        } else {
            console.log(campFound.author);
            res.render("campground/show", {campground: campFound});
        }
    });
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;