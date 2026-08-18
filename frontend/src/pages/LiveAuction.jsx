import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('https://cycle-auction-platform.onrender.com');

export default function LiveAuction() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [cycle, setCycle] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const [messages, setMessages] = useState([]);
    
    // NEW: State to hold the ticking clock
    const [timeLeft, setTimeLeft] = useState('Calculating...'); 
    const userName = localStorage.getItem('userName');

    useEffect(() => {
        fetch('https://cycle-auction-platform.onrender.com/api/cycles/add/api/cycles')
            .then(res => res.json())
            .then(data => {
                const currentCycle = data.find(c => c._id === id);
                setCycle(currentCycle);
            });

        socket.on('bid_updated', (data) => {
            if (data.cycleId === id) {
                setCycle(prev => ({ ...prev, currentHighestBid: data.newHighestBid }));
                setMessages(prev => [...prev, `${data.bidder} just bid ₹${data.newHighestBid}!`]);
            }
        });

        socket.on('bid_error', (data) => {
            alert(data.message);
        });

        return () => {
            socket.off('bid_updated');
            socket.off('bid_error');
        };
    }, [id]);

    // NEW: The Timer Logic
    useEffect(() => {
        // If the cycle hasn't loaded yet, do nothing
        if (!cycle || !cycle.endTime) return;

        // Run this chunk of code every 1 second (1000ms)
        const timerInterval = setInterval(() => {
            const now = new Date().getTime();
            const end = new Date(cycle.endTime).getTime();
            const distance = end - now;

            // If the countdown is over, stop the clock and update the text
            if (distance <= 0) {
                clearInterval(timerInterval);
                setTimeLeft('Auction Ended');
            } else {
                // Math to convert milliseconds into Hours, Minutes, and Seconds
                const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((distance % (1000 * 60)) / 1000);
                setTimeLeft(`${h}h ${m}m ${s}s`);
            }
        }, 1000);

        // Cleanup: Stop the clock if the user leaves the page
        return () => clearInterval(timerInterval);
    }, [cycle]);

    const handleBid = (e) => {
        e.preventDefault();
        socket.emit('place_bid', {
            cycleId: id,
            bidAmount: Number(bidAmount),
            userName: userName
        });
        setBidAmount('');
    };

    if (!cycle) return <h2>Loading Live Auction...</h2>;

    // NEW: A quick check to see if we should disable the bidding buttons
    const isEnded = timeLeft === 'Auction Ended'; 

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', cursor: 'pointer' }}>
                ⬅ Back to Dashboard
            </button>
            
            <div style={{ border: '3px solid red', padding: '20px', borderRadius: '10px', backgroundColor: '#fff9f9' }}>
                <h2>🔴 LIVE AUCTION: {cycle.brand}</h2>
                <p><strong>Base Price:</strong> ₹{cycle.basePrice}</p>
                
                {/* NEW: Display the ticking clock */}
                <h3 style={{ color: isEnded ? 'gray' : '#d9534f' }}>
                    ⏱ Time Remaining: {timeLeft}
                </h3>
                
                <h3 style={{ color: 'green' }}>
                    Current Highest Bid: ₹{cycle.currentHighestBid > 0 ? cycle.currentHighestBid : cycle.basePrice}
                </h3>

                {/* NEW: Disable the input and button if the auction is ended */}
                <form onSubmit={handleBid} style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <input 
                        type="number" 
                        placeholder="Enter amount..." 
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        required
                        disabled={isEnded} 
                        style={{ padding: '10px', flex: 1, fontSize: '16px', backgroundColor: isEnded ? '#eee' : 'white' }}
                    />
                    <button 
                        type="submit" 
                        disabled={isEnded} 
                        style={{ padding: '10px 20px', backgroundColor: isEnded ? 'gray' : 'red', color: 'white', fontWeight: 'bold', border: 'none', cursor: isEnded ? 'not-allowed' : 'pointer' }}
                    >
                        {isEnded ? 'CLOSED' : 'PLACE BID'}
                    </button>
                </form>
            </div>

            <div style={{ marginTop: '30px', backgroundColor: '#f4f4f4', padding: '15px', borderRadius: '5px' }}>
                <h4>Live Bidding Activity</h4>
                {messages.length === 0 ? <p style={{ color: '#666' }}>No bids yet. Be the first!</p> : null}
                {messages.map((msg, index) => (
                    <p key={index} style={{ margin: '8px 0', paddingBottom: '8px', borderBottom: '1px solid #ddd' }}>
                        🔔 {msg}
                    </p>
                ))}
            </div>
        </div>
    );
}