import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddCycle() {
    const [brand, setBrand] = useState('');
    const [condition, setCondition] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [duration, setDuration] = useState('24');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Get the token we saved during login
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('[https://cycle-auction-platform.onrender.com](https://cycle-auction-platform.onrender.com)/api/cycles/add', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Showing our VIP wristband!
                },
                body: JSON.stringify({ brand, condition, basePrice: Number(basePrice),durationHours: Number(duration) })
            });

            if (response.ok) {
                alert('Cycle listed successfully!');
                navigate('/dashboard'); // Send them back to see their new listing
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to add cycle');
            }
        } catch (error) {
            console.error('Error adding cycle:', error);
            alert('Server error.');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
            <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', cursor: 'pointer' }}>
                ⬅ Back to Dashboard
            </button>
            
            <h2>List a Cycle for Auction</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="text" 
                    placeholder="Cycle Brand (e.g., Hero Sprint)" 
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required 
                    style={{ padding: '8px' }}
                />
                <input 
                    type="text" 
                    placeholder="Condition (e.g., Good, 6 months old)" 
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    required 
                    style={{ padding: '8px' }}
                />
                <input 
                    type="number" 
                    placeholder="Base Price (₹)" 
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    required 
                    style={{ padding: '8px' }}
                />
                <input 
                    type="number" 
                    placeholder="Auction Duration (Hours)" 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required 
                    min="1"
                    style={{ padding: '8px' }}
                />
                <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                    Post Cycle
                </button>
            </form>
        </div>
    );
}