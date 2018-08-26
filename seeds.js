var mongoose = require("mongoose");
var Camp = require("./models/campground");
var Comment = require("./models/comment");


var campgrounds = [
    {
        name: "Rock I",
        description: "blah blah blah",
        image: "http://www.seerockcity.com/images/uploads/homepage/RockCit_Leap_rev01.jpg"
    }, 
    {
        name: "Rock II",
        description: "blah blah blah",
        image: "https://apod.nasa.gov/apod/image/1801/moonsetLasCampanas_beletsky.jpg"
    }
    ]; 
function seedDB(){                
Camp.remove({}, function(err) {
    if(err) {
        console.log(err);
    } else {
        Comment.remove({}, function(err) {
            if(err) {
                console.log(err);
            } else {
                //  campgrounds.forEach(function(campground) {
                //     Camp.create(campground, function(err, newCamp) {
                //         if(err) {
                //             console.log(err);
                //         } else {
                //             Comment.create({
                //                 text: "HOHOHOHOHOHO",
                //                 author: "Harry"
                //             }, function(err, newComment) {
                //                 if(err) {
                //                     console.log(err);
                //                 } else {
                //                     newCamp.comments.push(newComment);
                //                     newCamp.save();
                //                     console.log("A new Comment Added!");
                //                 }
                //             });
                //         }
                //     }); 
                //  });
            }
        });
    }
});
}

module.exports = seedDB;