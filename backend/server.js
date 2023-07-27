const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();
const bodyparser = require('body-parser');
const cors = require('cors');

// Load environment variables from .env file
require("dotenv").config();

// route for API requests
var eventRoute = require("./route/event");

const port = 5000;

// middleware
app.use(cors());

// using body-parser module for parsing the body to components
app.use(bodyparser.json({limit : "50mb"}))
app.use(bodyparser.urlencoded({limit: '50mb' , extended: true}))

// Connect to your MongoDB database (replace 'your_mongodb_connection_string' with your actual MongoDB connection string)
mongoose.set('strictQuery' , false)
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection established!'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

  //API endpoints
app.use("/event" , eventRoute);
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
