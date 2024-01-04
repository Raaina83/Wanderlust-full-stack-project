const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const review = require("./review.js");

const listingSchema = new Schema({
    title:{
        type:String,
    },
    description:String,
    image:{
       url: String,
       filename: String,
    },
    price:Number,
    location:String,
    country:String,
    reviews: [
        {
        type: Schema.Types.ObjectId,
        ref: "Review",
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    },
    category: {
        type: String,
        enum: ["Skiing", "Boats", "Beach", "Amazing-pools", "Castles","Camping","Arctic","Iconic-cities","Bed-Bread", "Tropical", "Art", "Towers", "golf"],
    },
});

// listingSchema.post("findOneAndDelete", async(listing) =>{
//     if(listing){
//         await Review.deleteMany({_id : {$in: listing.reviews}});
//     }
// });

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;