var express = require("express"),
    Camp = require("../models/campground"),
    Comment = require("../models/comment"),
    router = express.Router({mergeParams: true});
//==============
//comment routes
//==============
//comments new 
router.get("/new", isLoggedIn, function(req, res) {
   Camp.findById(req.params.id, function(err, campFound) {
       if(err) {
           console.log(err);
       } else {
           res.render("comment/new", {campground: campFound}); 
       }
   });
});

//comments create
router.post("/", isLoggedIn, function(req, res) {
    //find campground by id
    Camp.findById(req.params.id, function(err, campFound) {
        if(err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, newComment) {
               if(err) {
                   console.log(err);
               } else {
                   newComment.author.id = req.user._id;
                   newComment.author.username = req.user.username;
                   newComment.save();
                   
                  campFound.comments.push(newComment);
                  campFound.save();
                  console.log(newComment);
                   
                   res.redirect("/campgrounds/" + campFound._id);
               }
            });
        }
    });
    //create new comment
    //connect
    //redirect
   
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;