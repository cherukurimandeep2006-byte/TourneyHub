// ============================================
// pages/Home.jsx
// ============================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllTournaments } from '../services/api';
import TournamentCard from '../components/TournamentCard';

const Home = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const { data } = await getAllTournaments();
        setTournaments(data);
      } catch (error) {
        console.error('Failed to fetch tournaments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  // Filter tournaments based on selected status
  const filtered = filter === 'all'
    ? tournaments
    : tournaments.filter((t) => t.status === filter);

  return (
    <div>
      {/* Hero Banner */}
      <div className="bg-dark text-white py-5 text-center">
        <div className="container">
          <h1 className="display-4 fw-bold">🏆 TourneyHub</h1>
          <p className="lead">Transparent Local Sports Tournament Management Platform</p>
          <p className="text-muted">Cricket • Football • Kabaddi • Volleyball • Badminton</p>
          <Link to="/register" className="btn btn-warning btn-lg me-2">Get Started</Link>
          <Link to="/login" className="btn btn-outline-light btn-lg">Login</Link>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-primary text-white py-3">
        <div className="container">
          <div className="row text-center">
            <div className="col-4">
              <h4>{tournaments.length}</h4>
              <small>Total Tournaments</small>
            </div>
            <div className="col-4">
              <h4>{tournaments.filter(t => t.status === 'ongoing').length}</h4>
              <small>Live Now</small>
            </div>
            <div className="col-4">
              <h4>{tournaments.filter(t => t.status === 'registration_open').length}</h4>
              <small>Open for Registration</small>
            </div>
          </div>
        </div>
      </div>

      {/* Tournaments Section */}
      <div className="container py-4">
        <h2 className="mb-3">All Tournaments</h2>

        {/* Filter Buttons */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          {['all', 'registration_open', 'ongoing', 'upcoming', 'completed'].map((s) => (
            <button
              key={s}
              className={`btn btn-sm ${filter === s ? 'btn-dark' : 'btn-outline-dark'}`}
              onClick={() => setFilter(s)}
            >
              {s === 'all' ? 'All' : s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Loading tournaments...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="alert alert-info">No tournaments found.</div>
        ) : (
          <div className="row g-4">
            {filtered.map((t) => (
              <div key={t._id} className="col-md-6 col-lg-4">
                <TournamentCard tournament={t} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
