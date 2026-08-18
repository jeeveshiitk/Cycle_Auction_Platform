const express = require('express');
const router = express.Router();
const Cycle = require('../models/Cycle'); // Import the cycle blueprint
const verifyToken = require('../middleware/authMiddleware'); // Import our bouncer

// --- POST A NEW CYCLE FOR AUCTION ---
// Notice how we put "verifyToken" in the middle? That's the bouncer in action!
router.post('/add', verifyToken, async (req, res) => {
    try {
        const { brand, condition, basePrice } = req.body;

        // Create the new cycle. We get the seller's ID directly from the verified token!
        const newCycle = new Cycle({
            seller: req.user.id, 
            brand,
            condition,
            basePrice
        });

        await newCycle.save();
        res.status(201).json({ message: 'Cycle listed for auction successfully!', cycle: newCycle });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
// --- GET ALL ACTIVE CYCLES ---
// Notice we DON'T use verifyToken here, because anyone should be able to browse the catalog!
router.get('/', async (req, res) => {
    try {
        // Find all cycles that are active, and fetch the seller's name too
        const cycles = await Cycle.find({ isActive: true }).populate('seller', 'name');
        res.json(cycles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;