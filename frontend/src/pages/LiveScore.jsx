// pages/LiveScore.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMatchById, getScore, createScore, updateScore } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const LiveScore = () => {
  const { matchId } = useParams();
  const { isAdmin, token } = useAuth();
  const [match, setMatch] = useState(null);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Admin score update form
  const [scoreForm, setScoreForm] = useState({
    innings: 1, runs: 0, wickets: 0, overs: 0, balls: 0,
    extras: 0, target: 0, currentBatsman: '', currentBowler: '',
  });
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 15 seconds for live score
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [matchId]);

  const fetchData = async () => {
    try {
      const mRes = await getMatchById(matchId);
      setMatch(mRes.data);
      try {
        const sRes = await getScore(matchId);
        setScores(sRes.data);
        setIsStarted(true);
        // Pre-fill form with latest innings data
        if (sRes.data.length > 0) {
          const latest = sRes.data[sRes.data.length - 1];
          setScoreForm({
            innings: latest.innings,
            runs: latest.runs, wickets: latest.wickets,
            overs: latest.overs, balls: latest.balls,
            extras: latest.extras, target: latest.target,
            currentBatsman: latest.currentBatsman,
            currentBowler: latest.currentBowler,
          });
        }
      } catch {
        setIsStarted(false);
      }
    } catch (e) {
      console.error('Error loading match:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleStartScoring = async (e) => {
    e.preventDefault();
    try {
      await createScore(matchId, {
        battingTeam: scoreForm.innings === 1 ? match?.teamA?._id : match?.teamB?._id,
        bowlingTeam: scoreForm.innings === 1 ? match?.teamB?._id : match?.teamA?._id,
        innings: scoreForm.innings,
        target: scoreForm.target,
      }, token);
      toast.success('Scoring started!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start scoring');
    }
  };

  const handleUpdateScore = async (e) => {
    e.preventDefault();
    try {
      await updateScore(matchId, scoreForm, token);
      toast.success('Score updated!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update score');
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border"></div></div>;
  if (!match) return <div className="container py-4"><div className="alert alert-danger">Match not found.</div></div>;

  return (
    <div className="container py-4">
      {/* Match Header */}
      <div className="card border-0 shadow mb-4">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            {match.teamA?.teamName} vs {match.teamB?.teamName}
          </h5>
          <span className={`badge ${match.status === 'live' ? 'bg-danger' : 'bg-secondary'} fs-6`}>
            {match.status === 'live' ? '🔴 LIVE' : match.status?.toUpperCase()}
          </span>
        </div>
        <div className="card-body">
          <p className="mb-1"><strong>Round:</strong> {match.round}</p>
          <p className="mb-1"><strong>Venue:</strong> {match.venue || match.tournament?.venue}</p>
          {match.matchDate && <p className="mb-1"><strong>Date:</strong> {new Date(match.matchDate).toLocaleDateString()}</p>}
        </div>
      </div>

      {/* Live Score Display */}
      {scores.length > 0 ? (
        <div>
          {scores.map((score, idx) => (
            <div key={idx} className={`card mb-3 ${idx === scores.length - 1 ? 'border-danger' : 'border-secondary'}`}>
              <div className={`card-header ${idx === scores.length - 1 ? 'bg-danger text-white' : 'bg-secondary text-white'}`}>
                Innings {score.innings} — {score.battingTeam?.teamName} batting
                {idx === scores.length - 1 && match.status === 'live' && <span className="ms-2">🔴 Live</span>}
              </div>
              <div className="card-body text-center">
                {/* Main Score Display */}
                <div className="display-4 fw-bold mb-2">
                  {score.runs}/{score.wickets}
                </div>
                <div className="fs-5 text-muted mb-3">
                  {score.overs}.{score.balls} overs
                </div>
                {/* Target info */}
                {score.target > 0 && (
                  <div className="alert alert-warning py-2">
                    Target: <strong>{score.target}</strong> &nbsp;|&nbsp;
                    Need: <strong>{score.target - score.runs}</strong> runs from{' '}
                    <strong>{Math.max(0, ((20 - score.overs) * 6) - score.balls)}</strong> balls
                  </div>
                )}
                {/* Current players */}
                <div className="row text-start">
                  {score.currentBatsman && (
                    <div className="col-6">
                      <small className="text-muted">🏏 Batsman</small>
                      <p className="fw-bold mb-0">{score.currentBatsman}</p>
                    </div>
                  )}
                  {score.currentBowler && (
                    <div className="col-6">
                      <small className="text-muted">⚾ Bowler</small>
                      <p className="fw-bold mb-0">{score.currentBowler}</p>
                    </div>
                  )}
                </div>
                {score.extras > 0 && <p className="text-muted mt-2 small">Extras: {score.extras}</p>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-secondary text-center">
          <h5>Scoring hasn't started yet</h5>
          <p className="text-muted">Check back once the match begins.</p>
        </div>
      )}

      {/* Admin Scoring Controls */}
      {isAdmin && (
        <div className="card mt-4 border-warning">
          <div className="card-header bg-warning fw-bold">⚙️ Admin: Score Management</div>
          <div className="card-body">
            {!isStarted ? (
              // Start Scoring Form
              <div>
                <h6>Start Scoring for this Match</h6>
                <form onSubmit={handleStartScoring} className="row g-2">
                  <div className="col-md-3">
                    <select className="form-select" value={scoreForm.innings} onChange={e => setScoreForm({...scoreForm, innings: Number(e.target.value)})}>
                      <option value={1}>1st Innings</option>
                      <option value={2}>2nd Innings</option>
                    </select>
                  </div>
                  {scoreForm.innings === 2 && (
                    <div className="col-md-3">
                      <input type="number" className="form-control" placeholder="Target runs" value={scoreForm.target} onChange={e => setScoreForm({...scoreForm, target: Number(e.target.value)})} />
                    </div>
                  )}
                  <div className="col-md-3">
                    <button type="submit" className="btn btn-danger w-100">🔴 Start Scoring</button>
                  </div>
                </form>
              </div>
            ) : (
              // Update Score Form
              <div>
                <h6>Update Live Score</h6>
                <form onSubmit={handleUpdateScore} className="row g-2">
                  <div className="col-md-2">
                    <label className="form-label small">Innings</label>
                    <select className="form-select" value={scoreForm.innings} onChange={e => setScoreForm({...scoreForm, innings: Number(e.target.value)})}>
                      <option value={1}>1st</option>
                      <option value={2}>2nd</option>
                    </select>
                  </div>
                  <div className="col-md-1">
                    <label className="form-label small">Runs</label>
                    <input type="number" className="form-control" value={scoreForm.runs} onChange={e => setScoreForm({...scoreForm, runs: Number(e.target.value)})} min="0" />
                  </div>
                  <div className="col-md-1">
                    <label className="form-label small">Wkts</label>
                    <input type="number" className="form-control" value={scoreForm.wickets} onChange={e => setScoreForm({...scoreForm, wickets: Number(e.target.value)})} min="0" max="10" />
                  </div>
                  <div className="col-md-1">
                    <label className="form-label small">Overs</label>
                    <input type="number" className="form-control" value={scoreForm.overs} onChange={e => setScoreForm({...scoreForm, overs: Number(e.target.value)})} min="0" />
                  </div>
                  <div className="col-md-1">
                    <label className="form-label small">Balls</label>
                    <input type="number" className="form-control" value={scoreForm.balls} onChange={e => setScoreForm({...scoreForm, balls: Number(e.target.value)})} min="0" max="5" />
                  </div>
                  <div className="col-md-1">
                    <label className="form-label small">Extras</label>
                    <input type="number" className="form-control" value={scoreForm.extras} onChange={e => setScoreForm({...scoreForm, extras: Number(e.target.value)})} min="0" />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label small">Batsman</label>
                    <input type="text" className="form-control" placeholder="Name" value={scoreForm.currentBatsman} onChange={e => setScoreForm({...scoreForm, currentBatsman: e.target.value})} />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label small">Bowler</label>
                    <input type="text" className="form-control" placeholder="Name" value={scoreForm.currentBowler} onChange={e => setScoreForm({...scoreForm, currentBowler: e.target.value})} />
                  </div>
                  <div className="col-md-12">
                    <button type="submit" className="btn btn-warning fw-bold">Update Score</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-3">
        <Link to={`/fixtures/${match.tournament?._id || match.tournament}`} className="btn btn-outline-dark">← Back to Fixtures</Link>
      </div>
    </div>
  );
};

export default LiveScore;
