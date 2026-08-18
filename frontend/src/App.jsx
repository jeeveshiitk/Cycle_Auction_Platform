import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LiveAuction from './pages/LiveAuction';
import AddCycle from './pages/AddCycle';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auction/:id" element={<LiveAuction />} />
        <Route path="/add-cycle" element={<AddCycle />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;