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
            res.render("campground/show", {campground: campFound});
        }
    });
});

//edit route
router.get("/:id/edit", checkCampOwnership, function(req, res) {
    Camp.findById(req.params.id, function(err, campFound) {
        if(err) {
            console.log(err);
        } else {
            res.render("campground/edit", {campground: campFound});
        }
    });
});

//update
router.put("/:id", checkCampOwnership, function(req, res) {
    Camp.findByIdAndUpdate(req.params.id, req.body.camp, function(err, campUpdated) {
       if(err) {
           console.log(err);
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

//delete
router.delete("/:id", checkCampOwnership, function(req, res) {
    Camp.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

function checkCampOwnership(req, res, next) {
    //check if user has logged in 
    //check if user id equals camp user id
    if(req.isAuthenticated()) {
        Camp.findById(req.params.id, function(err, campFound) {
           if(err) {
               console.log(err);
               res.redirect("back");
            } else {
               if(campFound.author.id.equals(req.user._id)) {
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