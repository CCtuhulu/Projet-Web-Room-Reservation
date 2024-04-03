const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3001; // Choose any port you want

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/room-reservations', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Define reservation schema
const reservationSchema = new mongoose.Schema({
  date: String,
  startHour: Number,
  endHour: Number,
  room: String
});

// Create reservation model
const Reservation = mongoose.model('Reservation', reservationSchema);

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

// Endpoint to handle reservation requests
app.post('/api/reserve', async (req, res) => {
  const { date, startHour, endHour, room } = req.body;

  try {
    // Check if the requested time slot is available
    const isAvailable = await isSlotAvailable(date, startHour, endHour);
    console.log(isAvailable);
    if (isAvailable) {
      // Create a new reservation
      console.log("a");
      const newReservation = new Reservation({
        date,
        startHour,
        endHour,
        room
      });

      // Save the reservation to the database
      await newReservation.save();

      res.json({ success: true, message: 'Reservation confirmed!' });
    } else {
        console.log("b");
      res.json({ success: false, message: 'The selected time slot is not available. Please choose another one.' });
    }
  } catch (error) {
    console.error('Error submitting reservation:', error);
    res.status(500).json({ success: false, message: 'An error occurred while processing your request.' });
  }
});

// Function to check if a time slot is available
async function isSlotAvailable(date, startHour, endHour) {
  // Check if the slot overlaps with any existing reservations
  const existingReservations = await Reservation.find({
    date,
    $or: [
      { startHour: { $lt: endHour }, endHour: { $gt: startHour } }, // Check if the startHour is before endHour and endHour is after startHour
      { startHour: { $gte: startHour, $lt: endHour } }, // Check if the startHour is between startHour and endHour
      { endHour: { $gt: startHour, $lte: endHour } } // Check if the endHour is between startHour and endHour
    ]
  });
  console.log(existingReservations);

  return existingReservations.length === 0;
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
