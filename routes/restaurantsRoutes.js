const Path = require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');

const Restaurants = mongoose.model('restaurants');

module.exports = app => {
  app.get('/api/restaurants', async (req, res) => {
    const restaurants = await Restaurants.find({ });

    res.send(restaurants);
  });

  app.get('/api/restaurants/cuisines/:cuisine', async (req, res) => {
      console.log(req.params.cuisine);
      const restaurants = await Restaurants.find({ Cuisines:  { "$regex": req.params.cuisine, "$options": "i" } });
    res.send(restaurants);
  });

  app.get('/api/restaurants/name/:name', async (req, res) => {
    const restaurants = await Restaurants.find({ "Restaurant Name":  { "$regex": req.params.name, "$options": "i" } });
    res.send(restaurants);
  });

  


  app.get('/api/restaurants/sort/:sortType', async (req, res) => {
    var isDesc = req.query.desc;
    var sortType = req.params.sortType;
    var tempData = sortType.split("-");
    
    if(tempData.length > 1 && tempData[1] === "desc")
    {
        if(tempData[0] === "Cost"){
            restaurants = await Restaurants.find({ }).sort( { "Average Cost for two"  : -1});
        }else if(tempData[0] === "Rating"){
            restaurants = await Restaurants.find({ }).sort({ "Aggregate rating" : -1 });
        }else{
            restaurants = await Restaurants.find({ }).sort({ "Votes" : -1 });
        }
        
    }else{
        if(tempData[0] === "Cost"){
            restaurants = await Restaurants.find({ }).sort({"Average Cost for two": 1});
        }else if(tempData[0] === "Rating"){
            restaurants = await Restaurants.find({ }).sort({"Aggregate rating": 1});
        }else{
            restaurants = await Restaurants.find({ }).sort({"Votes" : 1});
        }
    }
    res.send(restaurants);
  });

  
  


  

  app.post('/api/restaurants', async (req, res) => {
    const { rid, rname, cuisines , avgfor2, currency , hasTableBooking , hasOnlineBooking , avgrating , ratingColor , ratingText , votes ,countryCode , city , address , locality , localityVerbose ,longitude , latitude } = req.body;

    const rest = new Restaurants({
        rid,
        rname,
        cuisines,
        avgfor2,
        currency,
        hasTableBooking,
        hasOnlineBooking,
        avgrating,
        ratingColor,
        ratingText,
        votes
    });

   
    try {
      await rest.save();
      res.send(rest);
    } catch (err) {
      res.status(400).send(err);
    }
  });
};





