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
    methodOverride = require("method-override"),
    campgroundRoutes = require("./routes/campground"),
    commentRoutes = require("./routes/comment"),
    indexRoutes = require("./routes/index");
    
//init
app.set("view engine", "ejs");
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/campgrounds_app", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
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