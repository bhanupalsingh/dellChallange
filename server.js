const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect("please enter monogo url");
require('./models/Restaurants');


const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));





require('./routes/restaurantsRoutes')(app);





app.listen(port, () => console.log(`Listening on port ${port}`));