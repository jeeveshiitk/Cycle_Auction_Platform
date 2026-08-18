import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    // State to hold the user's input
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault(); // Prevents the page from refreshing

        try {
            // Send the new user data to your backend
            const response = await fetch('https://cycle-auction-platform.onrender.com/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registration Successful! Please log in.');
                navigate('/login'); // Send them to the login page after they register
            } else {
                alert(data.message || 'Registration failed.'); // Show error if email is already used, etc.
            }
        } catch (error) {
            console.error('Error registering:', error);
            alert('Failed to connect to the server.');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
            <h2>Register for Cycle Auction</h2>
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    style={{ padding: '8px' }}
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    style={{ padding: '8px' }}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    style={{ padding: '8px' }}
                />
                <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Create Account
                </button>
            </form>
            <p>Already have an account? <span onClick={() => navigate('/login')} style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>Login here</span></p>
        </div>
    );
}