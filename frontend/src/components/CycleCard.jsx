import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CycleCard({ cycle }) {
    const navigate = useNavigate();

    return (
        <div style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '15px',
            margin: '10px',
            width: '250px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        }}>
            <h3 style={{ margin: '0 0 10px 0' }}>{cycle.brand}</h3>
            <p><strong>Condition:</strong> {cycle.condition}</p>
            <p><strong>Seller:</strong> {cycle.seller?.name || 'Unknown'}</p>
            <p><strong>Base Price:</strong> ₹{cycle.basePrice}</p>
            <p><strong>Highest Bid:</strong> ₹{cycle.currentHighestBid > 0 ? cycle.currentHighestBid : 'No bids yet'}</p>
            
            <button 
                onClick={() => navigate(`/auction/${cycle._id}`)}
                style={{
                    backgroundColor: '#007BFF',
                    color: 'white',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '15px',
                    fontWeight: 'bold'
                }}
            >
                Join Auction
            </button>
        </div>
    );
}