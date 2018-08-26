// var express = require("express"), 
//     app = express(),
//     mongoose = require("mongoose"),
//     bodyParser = require("body-parser"),
//     seedDB = require("./seeds"),
//     User = require("./models/user"),
//     passport = require("passport"),
//     LocalStrategy = require("passport-local"),
//     passportLocalMongoose = require("passport-local-mongoose"),
//     Camp = require("./models/campground"),
//     Comment = require("./models/comment");
    
// //init
// app.set("view engine", "ejs");
// mongoose.connect("mongodb://localhost:27017/campgrounds_app", { useNewUrlParser: true });
// app.use(bodyParser.urlencoded({extended: true}));
// seedDB();//refresh the db every time the server started.
// app.use(require("express-session")({
//     secret: "i dont know",
//     resave: false,
//     saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
// app.use(function(req, res, next) {
//   res.locals.user = req.user;
//   next();
// });



// app.get("/", function(req, res) {
//   res.redirect("/campgrounds");
// });

// //============
// //Basic routes
// //============
// //index page
// app.get("/campgrounds", function(req, res) {
//     Camp.find({}, function(err, camps) {
//         if(err) {
//             console.log(err);
//             res.redirect("/");
//         } else {
//           res.render("campground/index", {campgrounds: camps, user: req.user});  
//         }
//     });
// });

// // new 
// app.get("/campgrounds/new", function(req, res){
//   res.render("campground/new"); 
// });

// //create
// app.post("/campgrounds", function(req, res) {
//   Camp.create(req.body.camp, function(err, newCamp) {
//       if(err) {
//           console.log(err);
//       } else {
//           res.redirect("/campgrounds");
//       }
//   });
// });//body-parser is needed to parse the req.body

// //show
// app.get("/campgrounds/:id", function(req, res) {//right now the associated comments only have id displayed in the camp obj, so here 
// // we need the populate.exec to fill the comment content with actual text
//     Camp.findById(req.params.id).populate("comments").exec(function(err, campFound) {
//         if(err) {
//             console.log(err);
//         } else {
//             //console.log(campFound);
//             res.render("campground/show", {campground: campFound});
//         }
//     });
// });

// //==============
// //comment routes
// //==============
// //comments new 
// app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
//   Camp.findById(req.params.id, function(err, campFound) {
//       if(err) {
//           console.log(err);
//       } else {
//           res.render("comment/new", {campground: campFound}); 
//       }
//   });
// });

// //comments create
// app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
//     //find campground by id
//     Camp.findById(req.params.id, function(err, campFound) {
//         if(err) {
//             console.log(err);
//         } else {
//             Comment.create(req.body.comment, function(err, newComment) {
//               if(err) {
//                   console.log(err);
//               } else {
//                   campFound.comments.push(newComment);
//                   campFound.save();
//                   console.log(campFound);
                   
//                   res.redirect("/campgrounds/" + campFound._id);
//               }
//             });
//         }
//     });
//     //create new comment
//     //connect
//     //redirect
   
// });

// //================
// //Auth routes
// //================
// //register routes
// app.get("/register", function(req, res) {
//     res.render("auth/register");
// });
// app.post("/register", function(req, res) {
//     User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
//         if(err) {
//             console.log(err);
//             return res.redirect("/register");
//         }
//         passport.authenticate("local")(req, res, function() {
//             res.redirect("/campgrounds");
//         })
//     });
// });

// //login routes
// app.get("/login", function(req, res) {
//     res.render("auth/login");
// });

// app.post("/login",passport.authenticate("local", {
//     successRedirect: "/campgrounds",
//     failureRedirect: "/login"
// }), function(req, res) {
// });

// //logout route
// app.get("/logout", function(req, res) {
//     req.logout();
//     res.redirect("/campgrounds");
// });

// function isLoggedIn(req, res, next) {
//     if(req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect("/login");
// };


// app.listen(process.env.PORT, process.env.IP, function() {
//     console.log("Server Started!!");
// })

var express = require("express"), 
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    seedDB = require("./seeds"),
    User = require("./models/user"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    Camp = require("./models/campground"),
    Comment = require("./models/comment"),
    campgroundRoutes = require("./routes/campground"),
    commentRoutes = require("./routes/comment"),
    indexRoutes = require("./routes/index");
    
//init
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/campgrounds_app", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
//seedDB();//refresh the db every time the server started.
app.use(require("express-session")({
    secret: "i dont know",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
   res.locals.user = req.user;
   next();
});



app.get("/", function(req, res) {
   res.redirect("/campgrounds");
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server Started!!");
})