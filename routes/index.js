var express = require("express"),
    Camp = require("../models/campground"),
    Comment = require("../models/comment"),
    passport = require("passport"),
    User = require("../models/user"),
    router = express.Router();
//================
//Auth routes
//================
//register routes
router.get("/register", function(req, res) {
    res.render("auth/register");
});
router.post("/register", function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/campgrounds");
        })
    });
});

//login routes
router.get("/login", function(req, res) {
    res.render("auth/login");
});

router.post("/login",passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) {
});

//logout route
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = router;