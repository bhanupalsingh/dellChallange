const mongoose = require('mongoose');
const { Schema } = mongoose;

const restaurantSchema = new Schema({
    rid : String,
    rname : String,
    cuisines : String ,
    avgfor2 : String,
    currency : String,
    hasTableBooking : String,
    hasOnlineBooking : String,
    avgrating : String,
    ratingColor : String,
    ratingText : String,
    votes : String,
    countryCode : String,
    city : String,
    address : String,
    locality : String,
    localityVerbose : String ,
    longitude : String,
    latitude : String
});

mongoose.model('restaurants', restaurantSchema);
