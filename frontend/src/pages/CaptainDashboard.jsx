// pages/CaptainDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyTeams, getPaymentByTeam } from '../services/api';
import { toast } from 'react-toastify';

const CaptainDashboard = () => {
  const { token } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyTeams();
  }, []);

  const fetchMyTeams = async () => {
    try {
      const { data } = await getMyTeams(token);
      setTeams(data);
    } catch {
      toast.error('Failed to load your teams');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border"></div></div>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>👤 Captain Dashboard</h3>
        <Link to="/" className="btn btn-outline-dark">Browse Tournaments</Link>
      </div>

      <h5 className="mb-3">My Registered Teams ({teams.length})</h5>

      {teams.length === 0 ? (
        <div className="alert alert-info">
          You haven't registered any teams yet.
          <Link to="/" className="alert-link ms-2">Browse tournaments to register!</Link>
        </div>
      ) : (
        <div className="row g-3">
          {teams.map(team => (
            <div key={team._id} className="col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-dark text-white d-flex justify-content-between">
                  <span className="fw-bold">{team.teamName}</span>
                  <span className={`badge bg-${team.registrationStatus === 'approved' ? 'success' : team.registrationStatus === 'rejected' ? 'danger' : 'warning'}`}>
                    {team.registrationStatus}
                  </span>
                </div>
                <div className="card-body">
                  <p className="mb-1"><strong>Tournament:</strong> {team.tournament?.tournamentName}</p>
                  <p className="mb-1"><strong>Status:</strong> {team.tournament?.status}</p>
                  <p className="mb-1"><strong>Players:</strong> {team.players?.length}</p>
                  <p className="mb-1">
                    <strong>Payment:</strong>{' '}
                    <span className={`badge bg-${team.paymentStatus === 'verified' ? 'success' : team.paymentStatus === 'rejected' ? 'danger' : 'warning'}`}>
                      {team.paymentStatus}
                    </span>
                  </p>

                  {/* Players List */}
                  {team.players?.length > 0 && (
                    <div className="mt-2">
                      <strong className="small">Players:</strong>
                      <ul className="list-group list-group-flush mt-1">
                        {team.players.map((p, i) => (
                          <li key={i} className="list-group-item py-1 px-0 small border-0">
                            {i + 1}. {p.playerName} — {p.role} {p.jerseyNumber ? `(#${p.jerseyNumber})` : ''}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="card-footer bg-white d-flex gap-2">
                  <Link to={`/fixtures/${team.tournament?._id}`} className="btn btn-sm btn-outline-primary">View Fixtures</Link>
                  <Link to={`/points-table/${team.tournament?._id}`} className="btn btn-sm btn-outline-success">Points Table</Link>
                  <Link to={`/complaints/${team.tournament?._id}`} className="btn btn-sm btn-outline-warning">Complaints</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CaptainDashboard;
