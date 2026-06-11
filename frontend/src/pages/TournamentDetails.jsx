// pages/TournamentDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTournamentById, getTeamsByTournament } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TournamentDetails = () => {
  const { id } = useParams();
  const { isLoggedIn, isCaptain, isAdmin } = useAuth();
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tRes, teamsRes] = await Promise.all([
          getTournamentById(id),
          getTeamsByTournament(id),
        ]);
        setTournament(tRes.data);
        setTeams(teamsRes.data);
      } catch (error) {
        console.error('Error fetching tournament:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="text-center py-5"><div className="spinner-border"></div></div>;
  if (!tournament) return <div className="container py-4"><div className="alert alert-danger">Tournament not found.</div></div>;

  return (
    <div className="container py-4">
      {/* Tournament Header */}
      <div className="card border-0 shadow mb-4">
        <div className="card-header bg-dark text-white d-flex justify-content-between">
          <h4 className="mb-0">🏆 {tournament.tournamentName}</h4>
          <span className="badge bg-success fs-6">{tournament.status?.replace(/_/g, ' ').toUpperCase()}</span>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <p><strong>Sport:</strong> {tournament.sportType}</p>
              <p><strong>Venue:</strong> {tournament.venue}</p>
              <p><strong>Start Date:</strong> {new Date(tournament.startDate).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(tournament.endDate).toLocaleDateString()}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Entry Fee:</strong> ₹{tournament.entryFee}</p>
              <p><strong>Max Teams:</strong> {tournament.maxTeams}</p>
              <p><strong>Prize Money:</strong> ₹{tournament.prizeMoney}</p>
              <p><strong>Organizer:</strong> {tournament.organizerName} ({tournament.organizerPhone})</p>
            </div>
          </div>
          {tournament.rules && (
            <div className="mt-2">
              <strong>Rules:</strong>
              <p className="text-muted">{tournament.rules}</p>
            </div>
          )}
          {tournament.upiId && (
            <div className="alert alert-info">
              <strong>Payment UPI ID:</strong> {tournament.upiId}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        <Link to={`/fixtures/${id}`} className="btn btn-primary">📅 View Fixtures</Link>
        <Link to={`/points-table/${id}`} className="btn btn-success">📊 Points Table</Link>
        {isLoggedIn && (
          <Link to={`/complaints/${id}`} className="btn btn-warning">📢 Complaints</Link>
        )}
        {(isCaptain || isAdmin) && tournament.status === 'registration_open' && (
          <Link to={`/register-team/${id}`} className="btn btn-dark">
            ➕ Register Your Team
          </Link>
        )}
      </div>

      {/* Teams List */}
      <h5 className="mb-3">Registered Teams ({teams.length})</h5>
      {teams.length === 0 ? (
        <div className="alert alert-info">No teams registered yet.</div>
      ) : (
        <div className="row g-3">
          {teams.map((team) => (
            <div key={team._id} className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="fw-bold">{team.teamName}</h6>
                  <p className="text-muted mb-1 small">Captain: {team.captain?.name}</p>
                  <p className="mb-1 small">Players: {team.players?.length}</p>
                  <div className="d-flex gap-2">
                    <span className={`badge bg-${team.registrationStatus === 'approved' ? 'success' : team.registrationStatus === 'rejected' ? 'danger' : 'warning'}`}>
                      {team.registrationStatus}
                    </span>
                    <span className={`badge bg-${team.paymentStatus === 'verified' ? 'success' : team.paymentStatus === 'rejected' ? 'danger' : 'secondary'}`}>
                      💰 {team.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TournamentDetails;
