import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CycleCard from '../components/CycleCard';

export default function Dashboard() {
    const [cycles, setCycles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName');

    // This runs automatically as soon as the Dashboard loads
    useEffect(() => {
        const fetchCycles = async () => {
            try {
                // Fetch the list of cycles from the backend catalog
                const response = await fetch('https://cycle-auction-platform.onrender.com/api/cycles/add/api/cycles');
                const data = await response.json();
                setCycles(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching cycles:", error);
                setLoading(false);
            }
        };

        fetchCycles();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        navigate('/login');
    };

    return (
        <div style={{ padding: '20px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Welcome, {userName}!</h2>
                <div>
                    <button onClick={() => navigate('/add-cycle')} style={{ padding: '5px 15px', cursor: 'pointer', marginRight: '10px', backgroundColor: '#28a745', color: 'white', border: 'none' }}>
                        + Sell a Cycle
                    </button>
                    <button onClick={handleLogout} style={{ padding: '5px 15px', cursor: 'pointer' }}>Logout</button>
                </div>
            </div>
            
            <hr />
            
            <h3>Active Cycle Auctions</h3>
            
            {loading ? (
                <p>Loading auctions...</p>
            ) : cycles.length === 0 ? (
                <p>No cycles currently listed for auction.</p>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                    {/* Loop through the cycle data and create a card for each one */}
                    {cycles.map((cycle) => (
                        <CycleCard key={cycle._id} cycle={cycle} />
                    ))}
                </div>
            )}
        </div>
    );
}