const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http'); // Required for WebSockets
const { Server } = require('socket.io'); // Import Socket.io
const Cycle = require('./models/Cycle'); // Import Cycle model for bidding
require('dotenv').config(); 

const app = express();
const server = http.createServer(app); // Upgrade to HTTP server

// Attach Socket.io to the server
const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// --- LINK YOUR ROUTES HERE ---
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes); 

const cycleRoutes = require('./routes/cycles');
app.use('/api/cycles', cycleRoutes); 
// -----------------------------

// --- REAL-TIME CONNECTION LOGIC ---
io.on('connection', (socket) => {
    console.log(`A user connected to the live socket: ${socket.id}`);

    // Listen for a student placing a bid
    socket.on('place_bid', async (data) => {
        try {
            const cycle = await Cycle.findById(data.cycleId);
            
            if (!cycle) {
                return socket.emit('bid_error', { message: 'Cycle not found!' });
            }
            if (new Date() > new Date(cycle.endTime)) {
                return socket.emit('bid_error', { message: 'Bidding closed! This auction has ended.' });
            }

            // Validate the bid
            if (data.bidAmount <= cycle.currentHighestBid || data.bidAmount < cycle.basePrice) {
                return socket.emit('bid_error', { message: 'Bid must be higher than current bid and base price!' });
            }

            // Update the database
            cycle.currentHighestBid = data.bidAmount;
            await cycle.save();

            // BROADCAST to everyone connected that the price went up!
            io.emit('bid_updated', {
                cycleId: cycle._id,
                newHighestBid: cycle.currentHighestBid,
                bidder: data.userName
            });

            console.log(`New bid of ₹${data.bidAmount} placed on cycle ${data.cycleId} by ${data.userName}`);

        } catch (error) {
            console.error(error);
            socket.emit('bid_error', { message: 'Server error while placing bid.' });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
// ----------------------------------

// Connect to Database
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Successfully connected to MongoDB!'))
    .catch((error) => console.error('Database connection failed:', error));

const PORT = 5000;

// IMPORTANT: We use server.listen instead of app.listen
server.listen(PORT, () => {
    console.log(`Server is running live on port ${PORT}`);
});