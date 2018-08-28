var Camp = require("../models/campground");
var Comment = require("../models/comment");
var middleware = {};

middleware.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to log in!");
    res.redirect("/login");
};

middleware.checkCampOwnership = function(req, res, next) {
    //check if user has logged in 
    //check if user id equals camp user id
    if(req.isAuthenticated()) {
        Camp.findById(req.params.id, function(err, campFound) {
           if(err || !campFound) {
               req.flash("error", "Camp not found!");
               res.redirect("back");
            } else {
               if(campFound.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Permisson Denied!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to log in!");
        res.redirect("back");
    }
};

middleware.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated) {
        Comment.findById(req.params.commentId, function(err, commentFound) {
            if(err || !commentFound) {
                req.flash("error", "Comment not found!");
                res.redirect("back");
            } else {
                if(commentFound.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Permisson Denied!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to log in!");
        res.redirect("back");
    }
};

module.exports = middleware;