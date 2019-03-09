var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image:String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

//Campground.create(
// {
//   name:"Granite Hill",
//   image:"https://farm4.staticflickr.com/3290/3753652230_8139b7c717.jpg",
//   description:"This is a huge granite hill, no bathroom. No water. Beautiful granite!!!"
//   }, function(err,campground){
//       if(err){
//               console.log(err);
//         } else{
//                console.log("NEWLY CREATED CAMPGROUND:");
//                  console.log(campground);
//               }
//  });


app.get("/", function(req, res){
   res.render("landing");
});

// IINDEX --show all campgrounds
app.get("/campgrounds", function(req, res){
    //Get all the campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("Index", {campgrounds:allCampgrounds});
        }
    });
});


// CREATE --add new route to DB
app.post("/campgrounds", function(req, res){
   //get data from form and add to the campground array
   var name  = req.body.name;
   var image = req.body.image;
   var desc  = req.body.description;
   var newCampground = {name: name, image: image, description: desc};
   // Create the new campground and save to the DB
   Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       }else{
            //redirect back to the campground page
           res.redirect("/campgrounds");
       }
   });
});


// NEW --show form to create new campground
app.get("/campgrounds/new", function(req, res) {
    res.render("new.ejs");
});

//SHOW -- shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
    res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server has started");
});