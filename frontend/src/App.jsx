// ============================================
// App.jsx - Main Router Setup
// ============================================

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TournamentDetails from './pages/TournamentDetails';
import Fixtures from './pages/Fixtures';
import PointsTable from './pages/PointsTable';
import LiveScore from './pages/LiveScore';

// Protected Pages
import AdminDashboard from './pages/AdminDashboard';
import CaptainDashboard from './pages/CaptainDashboard';
import CreateTournament from './pages/CreateTournament';
import RegisterTeam from './pages/RegisterTeam';
import Complaints from './pages/Complaints';

function App() {
  return (
    <Router>
      {/* Toast notifications container - shows at top-right */}
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tournament/:id" element={<TournamentDetails />} />
          <Route path="/fixtures/:tournamentId" element={<Fixtures />} />
          <Route path="/points-table/:tournamentId" element={<PointsTable />} />
          <Route path="/live-score/:matchId" element={<LiveScore />} />

          {/* Protected: Admin only */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/create-tournament" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CreateTournament />
            </ProtectedRoute>
          } />

          {/* Protected: Captain only */}
          <Route path="/captain" element={
            <ProtectedRoute allowedRoles={['captain', 'admin']}>
              <CaptainDashboard />
            </ProtectedRoute>
          } />
          <Route path="/register-team/:tournamentId" element={
            <ProtectedRoute allowedRoles={['captain', 'admin']}>
              <RegisterTeam />
            </ProtectedRoute>
          } />

          {/* Protected: Any logged-in user */}
          <Route path="/complaints/:tournamentId" element={
            <ProtectedRoute allowedRoles={['admin', 'captain', 'player']}>
              <Complaints />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
