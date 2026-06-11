// components/TournamentCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// Status badge colors
const statusColors = {
  upcoming: 'secondary',
  registration_open: 'success',
  registration_closed: 'warning',
  ongoing: 'primary',
  completed: 'dark',
  cancelled: 'danger',
};

const TournamentCard = ({ tournament }) => {
  const { _id, tournamentName, sportType, venue, startDate, endDate, entryFee, maxTeams, status, prizeMoney } = tournament;

  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
        <span className="fw-bold">{tournamentName}</span>
        <span className={`badge bg-${statusColors[status] || 'secondary'}`}>
          {status?.replace(/_/g, ' ').toUpperCase()}
        </span>
      </div>
      <div className="card-body">
        <p className="mb-1"><i className="bi bi-trophy me-2 text-warning"></i><strong>Sport:</strong> {sportType}</p>
        <p className="mb-1"><i className="bi bi-geo-alt me-2 text-danger"></i><strong>Venue:</strong> {venue}</p>
        <p className="mb-1"><i className="bi bi-calendar me-2 text-primary"></i><strong>Start:</strong> {new Date(startDate).toLocaleDateString()}</p>
        <p className="mb-1"><i className="bi bi-calendar2-check me-2 text-success"></i><strong>End:</strong> {new Date(endDate).toLocaleDateString()}</p>
        <p className="mb-1"><i className="bi bi-people me-2"></i><strong>Max Teams:</strong> {maxTeams}</p>
        {entryFee > 0 && <p className="mb-1"><i className="bi bi-currency-rupee me-2"></i><strong>Entry Fee:</strong> ₹{entryFee}</p>}
        {prizeMoney > 0 && <p className="mb-1"><i className="bi bi-award me-2 text-warning"></i><strong>Prize:</strong> ₹{prizeMoney}</p>}
      </div>
      <div className="card-footer bg-white border-0 d-flex gap-2">
        <Link to={`/tournament/${_id}`} className="btn btn-primary btn-sm w-100">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default TournamentCard;
