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

//comment edit route
router.get("/:commentId/edit", checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.commentId, function(err, commentFound) {
        if(err) {
            console.log(err);
        } else {
            res.render("./comment/edit", {campground_id: req.params.id, comment: commentFound});
        }
    });
});

//comment update route
router.put("/:commentId", checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, commentUpdated) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//comment destroy
router.delete("/:commentId", checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.commentId, function(err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campground/" + req.params.id);
        }
    });
});

function checkCommentOwnership(req, res, next) {
    if(req.isAuthenticated) {
        Comment.findById(req.params.commentId, function(err, commentFound) {
            if(err) {
                console.log(err);
                res.redirect("back");
            } else {
                if(commentFound.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;