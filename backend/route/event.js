var express = require("express");
var router = express.Router();

const Events = require("../model/Event");

// Route to post new event data to the database
router.post('/api/events', async (req, res) => {
  const eventData = req.body;

  try {
    // Create a new event document in the database
    const newEvent = await Events.create(eventData);
    res.json(newEvent);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save event data to the database.' });
    console.log('data not submitted');
  }
});

// Route to get all event data from the database
router.get('/api/events', async (req, res) => {
    try {
      const { dateStart,dateEnd } = req.query;
  
      if (!dateStart||!dateEnd) {
        return res.status(400).json({ error: 'Date parameter is missing.' });
      }
  
      // Assuming the "date" parameter is a string in ISO format (e.g., "2023-07-19")
      const events = await Events.find({
        $and: [
          { dateStart: { $gte: new Date(`${dateStart}T00:00:00`) } }, // Events starting on or after the specified date
          { dateEnd: { $lte: new Date(`${dateEnd}T23:59:59`) } }, // Events ending on or before the specified date
        ],
      });
  
      res.json(events);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve event data from the database.' });
    }
  });

  router.get('/api/allevents', async (req, res) => {
    try {
      const events = await Events.find();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve event data from the database.' });
    }
  });

  module.exports = router;