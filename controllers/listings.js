const Listing= require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken  = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async(req,res,next) =>{
    let allListing;
    if(req.query.search){
        const search = req.query.search;

         allListing = await Listing.find({title: {$regex: ".*" + search + ".*"}});
    }
    else if(req.query.category){
         allListing= await Listing.find({category: req.query.category});
    } else{
         allListing= await Listing.find({}); 
    }  
    res.render("listings/index.ejs", {allListing}); 
};

module.exports.renderNewForm = (req,res) =>{
    res.render("listings/new.ejs");
};

module.exports.show = async (req,res,next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({
        path:"reviews", 
        populate:{
        path: "author",
        },
    }).populate("owner");
    res.render("listings/show.ejs", {listing});
};

module.exports.postNew = async (req,res,next) =>{
    let coordinates = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()

    let url = req.file.path;
    let filename = req.file.filename;
    
    let listing = req.body.listing;
    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = coordinates.body.features[0].geometry;
    let savedListing = await newListing.save(); 
    // console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderUpdateForm = async (req,res,next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let ogImage = listing.image.url;
    ogImage = ogImage.replace("w=800", "w=300");
    ogImage = ogImage.replace("/upload", "/upload/w_300");
    res.render("listings/edit.ejs", {listing,ogImage});
};

module.exports.postUpdate = async(req,res,next) =>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    res.redirect(`/listings/${id}`);
};

module.exports.delete = async (req,res,next) =>{
    let {id} = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    // console.log(deleted);
    res.redirect("/listings");
};