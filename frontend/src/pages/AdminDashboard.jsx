// ============================================
// pages/AdminDashboard.jsx
// ============================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
  getAllTournaments, getTeamsByTournament, approveTeam, rejectTeam,
  generateFixtures, getMatchesByTournament, updateMatchResult,
  getPaymentsByTournament, verifyPayment, rejectPayment,
  getAllComplaints, replyToComplaint, deleteTournament,
} from '../services/api';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [payments, setPayments] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState('tournaments');
  const [loading, setLoading] = useState(false);

  // Result update form state
  const [resultForm, setResultForm] = useState({ matchId: '', winner: '', teamAScore: '', teamBScore: '', winType: '', winMargin: '', playerOfTheMatch: '' });
  // Complaint reply state
  const [replyForm, setReplyForm] = useState({ complaintId: '', adminReply: '', status: 'resolved' });

  // Fetch all tournaments on mount
  useEffect(() => {
    fetchTournaments();
    fetchAllComplaints();
  }, []);

  // When a tournament is selected, fetch its data
  useEffect(() => {
    if (selectedTournament) {
      fetchTeams();
      fetchMatches();
      fetchPayments();
    }
  }, [selectedTournament]);

  const fetchTournaments = async () => {
    try {
      const { data } = await getAllTournaments();
      setTournaments(data);
    } catch { toast.error('Failed to load tournaments'); }
  };

  const fetchTeams = async () => {
    try {
      const { data } = await getTeamsByTournament(selectedTournament);
      setTeams(data);
    } catch { toast.error('Failed to load teams'); }
  };

  const fetchMatches = async () => {
    try {
      const { data } = await getMatchesByTournament(selectedTournament);
      setMatches(data);
    } catch { toast.error('Failed to load matches'); }
  };

  const fetchPayments = async () => {
    try {
      const { data } = await getPaymentsByTournament(selectedTournament, token);
      setPayments(data);
    } catch { toast.error('Failed to load payments'); }
  };

  const fetchAllComplaints = async () => {
    try {
      const { data } = await getAllComplaints(token);
      setComplaints(data);
    } catch { toast.error('Failed to load complaints'); }
  };

  const handleApproveTeam = async (id) => {
    try {
      await approveTeam(id, token);
      toast.success('Team approved!');
      fetchTeams();
    } catch { toast.error('Failed to approve team'); }
  };

  const handleRejectTeam = async (id) => {
    try {
      await rejectTeam(id, token);
      toast.success('Team rejected');
      fetchTeams();
    } catch { toast.error('Failed to reject team'); }
  };

  const handleGenerateFixtures = async () => {
    try {
      await generateFixtures(selectedTournament, token);
      toast.success('Fixtures generated successfully!');
      fetchMatches();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate fixtures');
    }
  };

  const handleUpdateResult = async (e) => {
    e.preventDefault();
    try {
      await updateMatchResult(resultForm.matchId, {
        winner: resultForm.winner,
        teamAScore: resultForm.teamAScore,
        teamBScore: resultForm.teamBScore,
        winType: resultForm.winType,
        winMargin: resultForm.winMargin,
        playerOfTheMatch: resultForm.playerOfTheMatch,
      }, token);
      toast.success('Match result updated!');
      fetchMatches();
      setResultForm({ matchId: '', winner: '', teamAScore: '', teamBScore: '', winType: '', winMargin: '', playerOfTheMatch: '' });
    } catch { toast.error('Failed to update result'); }
  };

  const handleVerifyPayment = async (id) => {
    try {
      await verifyPayment(id, token);
      toast.success('Payment verified!');
      fetchPayments();
    } catch { toast.error('Failed to verify payment'); }
  };

  const handleRejectPayment = async (id) => {
    try {
      await rejectPayment(id, token);
      toast.success('Payment rejected');
      fetchPayments();
    } catch { toast.error('Failed to reject payment'); }
  };

  const handleReplyComplaint = async (e) => {
    e.preventDefault();
    try {
      await replyToComplaint(replyForm.complaintId, { adminReply: replyForm.adminReply, status: replyForm.status }, token);
      toast.success('Reply sent!');
      fetchAllComplaints();
      setReplyForm({ complaintId: '', adminReply: '', status: 'resolved' });
    } catch { toast.error('Failed to send reply'); }
  };

  const handleDeleteTournament = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tournament?')) return;
    try {
      await deleteTournament(id, token);
      toast.success('Tournament deleted');
      fetchTournaments();
    } catch { toast.error('Failed to delete tournament'); }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>⚙️ Admin Dashboard</h3>
        <Link to="/create-tournament" className="btn btn-dark">
          ➕ Create Tournament
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card text-white bg-primary text-center p-3">
            <h4>{tournaments.length}</h4>
            <small>Tournaments</small>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card text-white bg-warning text-center p-3">
            <h4>{teams.filter(t => t.registrationStatus === 'pending').length}</h4>
            <small>Pending Teams</small>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card text-white bg-success text-center p-3">
            <h4>{payments.filter(p => p.status === 'pending').length}</h4>
            <small>Pending Payments</small>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card text-white bg-danger text-center p-3">
            <h4>{complaints.filter(c => c.status === 'pending').length}</h4>
            <small>Pending Complaints</small>
          </div>
        </div>
      </div>

      {/* Tournament Selector */}
      <div className="mb-4">
        <label className="form-label fw-bold">Select Tournament to Manage:</label>
        <select className="form-select" value={selectedTournament} onChange={(e) => setSelectedTournament(e.target.value)}>
          <option value="">-- Select a Tournament --</option>
          {tournaments.map(t => (
            <option key={t._id} value={t._id}>{t.tournamentName} ({t.status})</option>
          ))}
        </select>
      </div>

      {/* Tab Navigation */}
      <ul className="nav nav-tabs mb-4">
        {['tournaments', 'teams', 'fixtures', 'payments', 'complaints'].map(tab => (
          <li key={tab} className="nav-item">
            <button className={`nav-link ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {/* ---- TOURNAMENTS TAB ---- */}
      {activeTab === 'tournaments' && (
        <div>
          <h5 className="mb-3">All Tournaments</h5>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Name</th><th>Sport</th><th>Status</th><th>Start</th><th>Teams</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tournaments.map(t => (
                  <tr key={t._id}>
                    <td>{t.tournamentName}</td>
                    <td>{t.sportType}</td>
                    <td><span className="badge bg-primary">{t.status}</span></td>
                    <td>{new Date(t.startDate).toLocaleDateString()}</td>
                    <td>{t.maxTeams}</td>
                    <td>
                      <Link to={`/tournament/${t._id}`} className="btn btn-sm btn-outline-primary me-1">View</Link>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteTournament(t._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---- TEAMS TAB ---- */}
      {activeTab === 'teams' && (
        <div>
          {!selectedTournament ? (
            <div className="alert alert-warning">Please select a tournament to manage teams.</div>
          ) : (
            <>
              <h5 className="mb-3">Teams ({teams.length})</h5>
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Team Name</th><th>Captain</th><th>Players</th><th>Status</th><th>Payment</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map(team => (
                      <tr key={team._id}>
                        <td>{team.teamName}</td>
                        <td>{team.captain?.name}</td>
                        <td>{team.players?.length}</td>
                        <td>
                          <span className={`badge bg-${team.registrationStatus === 'approved' ? 'success' : team.registrationStatus === 'rejected' ? 'danger' : 'warning'}`}>
                            {team.registrationStatus}
                          </span>
                        </td>
                        <td>
                          <span className={`badge bg-${team.paymentStatus === 'verified' ? 'success' : 'secondary'}`}>
                            {team.paymentStatus}
                          </span>
                        </td>
                        <td>
                          {team.registrationStatus === 'pending' && (
                            <>
                              <button className="btn btn-sm btn-success me-1" onClick={() => handleApproveTeam(team._id)}>Approve</button>
                              <button className="btn btn-sm btn-danger" onClick={() => handleRejectTeam(team._id)}>Reject</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* ---- FIXTURES TAB ---- */}
      {activeTab === 'fixtures' && (
        <div>
          {!selectedTournament ? (
            <div className="alert alert-warning">Please select a tournament first.</div>
          ) : (
            <>
              <div className="d-flex justify-content-between mb-3">
                <h5>Fixtures ({matches.length} matches)</h5>
                <button className="btn btn-dark" onClick={handleGenerateFixtures}>
                  ⚡ Generate Fixtures
                </button>
              </div>

              {/* Match Result Update Form */}
              {matches.length > 0 && (
                <div className="card mb-4 border-0 shadow-sm">
                  <div className="card-header bg-warning">Update Match Result</div>
                  <div className="card-body">
                    <form onSubmit={handleUpdateResult} className="row g-2">
                      <div className="col-md-4">
                        <select className="form-select" value={resultForm.matchId} onChange={e => setResultForm({...resultForm, matchId: e.target.value})} required>
                          <option value="">Select Match</option>
                          {matches.filter(m => !m.isBye && m.status !== 'completed').map(m => (
                            <option key={m._id} value={m._id}>
                              {m.teamA?.teamName} vs {m.teamB?.teamName} ({m.round})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <select className="form-select" value={resultForm.winner} onChange={e => setResultForm({...resultForm, winner: e.target.value})} required>
                          <option value="">Select Winner</option>
                          {resultForm.matchId && matches.find(m => m._id === resultForm.matchId) && (() => {
                            const m = matches.find(x => x._id === resultForm.matchId);
                            return [
                              <option key={m.teamA?._id} value={m.teamA?._id}>{m.teamA?.teamName}</option>,
                              <option key={m.teamB?._id} value={m.teamB?._id}>{m.teamB?.teamName}</option>,
                            ];
                          })()}
                        </select>
                      </div>
                      <div className="col-md-2">
                        <input className="form-control" placeholder="Team A Score" value={resultForm.teamAScore} onChange={e => setResultForm({...resultForm, teamAScore: e.target.value})} />
                      </div>
                      <div className="col-md-2">
                        <input className="form-control" placeholder="Team B Score" value={resultForm.teamBScore} onChange={e => setResultForm({...resultForm, teamBScore: e.target.value})} />
                      </div>
                      <div className="col-md-4">
                        <input className="form-control" placeholder="Win margin (e.g. Won by 20 runs)" value={resultForm.winMargin} onChange={e => setResultForm({...resultForm, winMargin: e.target.value})} />
                      </div>
                      <div className="col-md-4">
                        <input className="form-control" placeholder="Player of the Match" value={resultForm.playerOfTheMatch} onChange={e => setResultForm({...resultForm, playerOfTheMatch: e.target.value})} />
                      </div>
                      <div className="col-md-4">
                        <button type="submit" className="btn btn-dark w-100">Update Result</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Matches List */}
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="table-dark">
                    <tr><th>Round</th><th>Team A</th><th>Team B</th><th>Status</th><th>Winner</th><th>Score</th></tr>
                  </thead>
                  <tbody>
                    {matches.map(m => (
                      <tr key={m._id}>
                        <td>{m.round}</td>
                        <td>{m.teamA?.teamName}</td>
                        <td>{m.isBye ? <span className="badge bg-info">BYE</span> : m.teamB?.teamName}</td>
                        <td><span className={`badge bg-${m.status === 'completed' ? 'success' : 'secondary'}`}>{m.status}</span></td>
                        <td>{m.winner?.teamName || '-'}</td>
                        <td>{m.teamAScore && `${m.teamAScore} vs ${m.teamBScore}`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* ---- PAYMENTS TAB ---- */}
      {activeTab === 'payments' && (
        <div>
          {!selectedTournament ? (
            <div className="alert alert-warning">Please select a tournament first.</div>
          ) : (
            <>
              <h5 className="mb-3">Payments ({payments.length})</h5>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="table-dark">
                    <tr><th>Team</th><th>Amount</th><th>Transaction ID</th><th>Screenshot</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {payments.map(p => (
                      <tr key={p._id}>
                        <td>{p.team?.teamName}</td>
                        <td>₹{p.amount}</td>
                        <td>{p.transactionId || '-'}</td>
                        <td>
                          {p.screenshot
                            ? <a href={`/uploads/${p.screenshot}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">View</a>
                            : 'No file'}
                        </td>
                        <td><span className={`badge bg-${p.status === 'verified' ? 'success' : p.status === 'rejected' ? 'danger' : 'warning'}`}>{p.status}</span></td>
                        <td>
                          {p.status === 'pending' && (
                            <>
                              <button className="btn btn-sm btn-success me-1" onClick={() => handleVerifyPayment(p._id)}>Verify</button>
                              <button className="btn btn-sm btn-danger" onClick={() => handleRejectPayment(p._id)}>Reject</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* ---- COMPLAINTS TAB ---- */}
      {activeTab === 'complaints' && (
        <div>
          <h5 className="mb-3">All Complaints ({complaints.length})</h5>
          {complaints.map(c => (
            <div key={c._id} className="card mb-3 border-0 shadow-sm">
              <div className="card-header d-flex justify-content-between">
                <span><strong>{c.subject}</strong> — by {c.user?.name}</span>
                <span className={`badge bg-${c.status === 'resolved' ? 'success' : 'warning'}`}>{c.status}</span>
              </div>
              <div className="card-body">
                <p className="mb-1">{c.description}</p>
                <small className="text-muted">Tournament: {c.tournament?.tournamentName}</small>
                {c.adminReply && <div className="alert alert-info mt-2 mb-0 py-2"><strong>Admin:</strong> {c.adminReply}</div>}
              </div>
              {c.status === 'pending' && (
                <div className="card-footer">
                  <form onSubmit={handleReplyComplaint} className="d-flex gap-2">
                    <input type="hidden" value={c._id} onChange={() => {}} />
                    <input
                      className="form-control"
                      placeholder="Write reply..."
                      value={replyForm.complaintId === c._id ? replyForm.adminReply : ''}
                      onChange={e => setReplyForm({ complaintId: c._id, adminReply: e.target.value, status: 'resolved' })}
                    />
                    <button type="submit" className="btn btn-dark" onClick={() => setReplyForm(r => ({...r, complaintId: c._id}))}>
                      Reply
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
