// components/MatchCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const statusColors = {
  scheduled: 'secondary',
  live: 'danger',
  completed: 'success',
  cancelled: 'dark',
};

const MatchCard = ({ match }) => {
  const { _id, teamA, teamB, matchDate, matchTime, venue, round, status, winner, teamAScore, teamBScore, isBye } = match;

  return (
    <div className={`card mb-3 border-${statusColors[status] || 'secondary'}`}>
      <div className="card-header d-flex justify-content-between align-items-center">
        <span className="fw-bold">{round}</span>
        <span className={`badge bg-${statusColors[status]}`}>
          {status === 'live' ? '🔴 LIVE' : status?.toUpperCase()}
        </span>
      </div>
      <div className="card-body">
        {isBye ? (
          <div className="text-center">
            <h5 className="text-muted">{teamA?.teamName} — <span className="badge bg-info">BYE</span></h5>
            <small>This team advances automatically</small>
          </div>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="text-center flex-fill">
                <h5 className="mb-0">{teamA?.teamName || 'TBD'}</h5>
                {teamAScore && <span className="badge bg-secondary">{teamAScore}</span>}
              </div>
              <div className="text-center px-3">
                <span className="badge bg-dark fs-6">VS</span>
              </div>
              <div className="text-center flex-fill">
                <h5 className="mb-0">{teamB?.teamName || 'TBD'}</h5>
                {teamBScore && <span className="badge bg-secondary">{teamBScore}</span>}
              </div>
            </div>

            {/* Winner banner */}
            {winner && (
              <div className="alert alert-success py-1 text-center mb-2">
                🏆 Winner: <strong>{winner.teamName}</strong>
              </div>
            )}

            {/* Match details */}
            <div className="text-muted small">
              {matchDate && <span><i className="bi bi-calendar me-1"></i>{new Date(matchDate).toLocaleDateString()} </span>}
              {matchTime && <span><i className="bi bi-clock me-1"></i>{matchTime} </span>}
              {venue && <span><i className="bi bi-geo-alt me-1"></i>{venue}</span>}
            </div>
          </>
        )}
      </div>
      {status === 'live' && (
        <div className="card-footer">
          <Link to={`/live-score/${_id}`} className="btn btn-danger btn-sm w-100">
            🔴 Watch Live Score
          </Link>
        </div>
      )}
    </div>
  );
};

export default MatchCard;
