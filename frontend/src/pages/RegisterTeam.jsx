// pages/RegisterTeam.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerTeam, getTournamentById, uploadPayment } from '../services/api';
import { toast } from 'react-toastify';

const emptyPlayer = { playerName: '', age: '', phone: '', role: 'Batsman', battingStyle: '', bowlingStyle: '', jerseyNumber: '' };

const RegisterTeam = () => {
  const { tournamentId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [players, setPlayers] = useState([{ ...emptyPlayer }]);
  const [loading, setLoading] = useState(false);
  // Payment state
  const [paymentFile, setPaymentFile] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [registeredTeamId, setRegisteredTeamId] = useState(null);
  const [step, setStep] = useState(1); // Step 1: Team details, Step 2: Payment

  useEffect(() => {
    getTournamentById(tournamentId).then(r => setTournament(r.data)).catch(() => {});
  }, [tournamentId]);

  const addPlayer = () => setPlayers([...players, { ...emptyPlayer }]);
  const removePlayer = (i) => setPlayers(players.filter((_, idx) => idx !== i));
  const updatePlayer = (i, field, value) => {
    const updated = [...players];
    updated[i][field] = value;
    setPlayers(updated);
  };

  // Step 1: Register team
  const handleRegisterTeam = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await registerTeam({ teamName, tournament: tournamentId, players }, token);
      setRegisteredTeamId(data._id);
      toast.success('Team registered! Now upload payment proof.');
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register team');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Upload payment screenshot
  const handleUploadPayment = async (e) => {
    e.preventDefault();
    if (!registeredTeamId) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('team', registeredTeamId);
      formData.append('tournament', tournamentId);
      formData.append('amount', tournament?.entryFee || 0);
      formData.append('transactionId', transactionId);
      if (paymentFile) formData.append('screenshot', paymentFile);

      await uploadPayment(formData, token);
      toast.success('Payment uploaded! Waiting for admin verification.');
      navigate('/captain');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-9">
          {/* Progress Steps */}
          <div className="d-flex mb-4 gap-3">
            <div className={`badge px-3 py-2 fs-6 ${step === 1 ? 'bg-dark' : 'bg-secondary'}`}>Step 1: Team Details</div>
            <div className={`badge px-3 py-2 fs-6 ${step === 2 ? 'bg-dark' : 'bg-secondary'}`}>Step 2: Payment</div>
          </div>

          {tournament && (
            <div className="alert alert-info mb-3">
              Registering for: <strong>{tournament.tournamentName}</strong> — Entry Fee: ₹{tournament.entryFee}
              {tournament.upiId && <span className="ms-3">UPI: <strong>{tournament.upiId}</strong></span>}
            </div>
          )}

          {/* Step 1: Team + Players */}
          {step === 1 && (
            <div className="card border-0 shadow">
              <div className="card-header bg-dark text-white">
                <h5 className="mb-0">Register Your Team</h5>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleRegisterTeam}>
                  <div className="mb-4">
                    <label className="form-label fw-bold">Team Name *</label>
                    <input type="text" className="form-control" placeholder="Enter team name" value={teamName} onChange={e => setTeamName(e.target.value)} required />
                  </div>

                  <h6 className="fw-bold mb-3">Players ({players.length})</h6>
                  {players.map((player, i) => (
                    <div key={i} className="card mb-3 border-secondary">
                      <div className="card-header d-flex justify-content-between align-items-center py-2">
                        <span>Player {i + 1}</span>
                        {players.length > 1 && (
                          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removePlayer(i)}>Remove</button>
                        )}
                      </div>
                      <div className="card-body">
                        <div className="row g-2">
                          <div className="col-md-4">
                            <input className="form-control" placeholder="Player Name *" value={player.playerName} onChange={e => updatePlayer(i, 'playerName', e.target.value)} required />
                          </div>
                          <div className="col-md-2">
                            <input className="form-control" placeholder="Age" type="number" value={player.age} onChange={e => updatePlayer(i, 'age', e.target.value)} />
                          </div>
                          <div className="col-md-3">
                            <input className="form-control" placeholder="Phone" value={player.phone} onChange={e => updatePlayer(i, 'phone', e.target.value)} />
                          </div>
                          <div className="col-md-3">
                            <input className="form-control" placeholder="Jersey #" type="number" value={player.jerseyNumber} onChange={e => updatePlayer(i, 'jerseyNumber', e.target.value)} />
                          </div>
                          <div className="col-md-4">
                            <select className="form-select" value={player.role} onChange={e => updatePlayer(i, 'role', e.target.value)}>
                              {['Batsman', 'Bowler', 'All-rounder', 'Wicket Keeper', 'Other'].map(r => (
                                <option key={r} value={r}>{r}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-4">
                            <select className="form-select" value={player.battingStyle} onChange={e => updatePlayer(i, 'battingStyle', e.target.value)}>
                              <option value="">Batting Style</option>
                              <option value="Right Hand">Right Hand</option>
                              <option value="Left Hand">Left Hand</option>
                            </select>
                          </div>
                          <div className="col-md-4">
                            <select className="form-select" value={player.bowlingStyle} onChange={e => updatePlayer(i, 'bowlingStyle', e.target.value)}>
                              <option value="">Bowling Style</option>
                              <option value="Right Arm Fast">Right Arm Fast</option>
                              <option value="Right Arm Spin">Right Arm Spin</option>
                              <option value="Left Arm Fast">Left Arm Fast</option>
                              <option value="Left Arm Spin">Left Arm Spin</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button type="button" className="btn btn-outline-secondary mb-3" onClick={addPlayer}>
                    ➕ Add Another Player
                  </button>

                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-dark" disabled={loading}>
                      {loading ? 'Registering...' : 'Register Team →'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Step 2: Payment Upload */}
          {step === 2 && (
            <div className="card border-0 shadow">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">💰 Upload Payment Proof</h5>
              </div>
              <div className="card-body p-4">
                <div className="alert alert-success">
                  ✅ Team registered successfully! Please upload your payment screenshot.
                  <br />Entry Fee: <strong>₹{tournament?.entryFee}</strong>
                  {tournament?.upiId && <><br />UPI ID: <strong>{tournament.upiId}</strong></>}
                </div>
                <form onSubmit={handleUploadPayment}>
                  <div className="mb-3">
                    <label className="form-label">Transaction / Reference ID</label>
                    <input type="text" className="form-control" placeholder="UPI transaction ID" value={transactionId} onChange={e => setTransactionId(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Payment Screenshot *</label>
                    <input type="file" className="form-control" accept="image/*" onChange={e => setPaymentFile(e.target.files[0])} required />
                    <small className="text-muted">Upload a screenshot of your payment (JPG, PNG, max 5MB)</small>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success" disabled={loading}>
                      {loading ? 'Uploading...' : 'Upload Payment'}
                    </button>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/captain')}>
                      Skip for Now
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterTeam;
