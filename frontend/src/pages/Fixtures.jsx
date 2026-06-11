// pages/Fixtures.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMatchesByTournament, getTournamentById } from '../services/api';
import MatchCard from '../components/MatchCard';

const Fixtures = () => {
  const { tournamentId } = useParams();
  const [matches, setMatches] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mRes, tRes] = await Promise.all([
          getMatchesByTournament(tournamentId),
          getTournamentById(tournamentId),
        ]);
        setMatches(mRes.data);
        setTournament(tRes.data);
      } catch (e) {
        console.error('Error loading fixtures:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tournamentId]);

  const filtered = filter === 'all' ? matches : matches.filter(m => m.status === filter);

  if (loading) return <div className="text-center py-5"><div className="spinner-border"></div></div>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4>📅 Fixtures</h4>
          {tournament && <p className="text-muted mb-0">{tournament.tournamentName}</p>}
        </div>
        <div className="d-flex gap-2">
          <Link to={`/tournament/${tournamentId}`} className="btn btn-outline-dark btn-sm">← Back</Link>
          <Link to={`/points-table/${tournamentId}`} className="btn btn-success btn-sm">Points Table</Link>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="d-flex gap-2 mb-3 flex-wrap">
        {['all', 'scheduled', 'live', 'completed'].map(s => (
          <button key={s} className={`btn btn-sm ${filter === s ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setFilter(s)}>
            {s === 'live' ? '🔴 Live' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="row g-2 mb-4">
        <div className="col-4 text-center">
          <div className="bg-primary text-white rounded p-2">
            <strong>{matches.length}</strong><br /><small>Total</small>
          </div>
        </div>
        <div className="col-4 text-center">
          <div className="bg-danger text-white rounded p-2">
            <strong>{matches.filter(m => m.status === 'live').length}</strong><br /><small>Live</small>
          </div>
        </div>
        <div className="col-4 text-center">
          <div className="bg-success text-white rounded p-2">
            <strong>{matches.filter(m => m.status === 'completed').length}</strong><br /><small>Done</small>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="alert alert-info">
          {matches.length === 0 ? 'Fixtures not yet generated. Please check back later.' : 'No matches found for this filter.'}
        </div>
      ) : (
        filtered.map(match => <MatchCard key={match._id} match={match} />)
      )}
    </div>
  );
};

export default Fixtures;
