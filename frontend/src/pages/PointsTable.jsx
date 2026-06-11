// pages/PointsTable.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPointsTable, getTournamentById } from '../services/api';

const PointsTable = () => {
  const { tournamentId } = useParams();
  const [table, setTable] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, tRes] = await Promise.all([
          getPointsTable(tournamentId),
          getTournamentById(tournamentId),
        ]);
        setTable(pRes.data);
        setTournament(tRes.data);
      } catch (e) {
        console.error('Error loading points table:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tournamentId]);

  if (loading) return <div className="text-center py-5"><div className="spinner-border"></div></div>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4>📊 Points Table</h4>
          {tournament && <p className="text-muted mb-0">{tournament.tournamentName}</p>}
        </div>
        <div className="d-flex gap-2">
          <Link to={`/tournament/${tournamentId}`} className="btn btn-outline-dark btn-sm">← Back</Link>
          <Link to={`/fixtures/${tournamentId}`} className="btn btn-primary btn-sm">Fixtures</Link>
        </div>
      </div>

      {/* Points legend */}
      <div className="alert alert-info py-2 small">
        <strong>Scoring:</strong> Win = 2 pts &nbsp;|&nbsp; Loss = 0 pts &nbsp;|&nbsp; Tie = 1 pt
      </div>

      {table.length === 0 ? (
        <div className="alert alert-warning">No completed matches yet. Points table will appear after matches are played.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th className="text-start">Team</th>
                <th>M</th>
                <th>W</th>
                <th>L</th>
                <th>T</th>
                <th>Pts</th>
              </tr>
            </thead>
            <tbody>
              {table.map((row, index) => (
                <tr key={row.team._id} className={index === 0 ? 'table-success' : ''}>
                  <td>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </td>
                  <td className="text-start fw-bold">{row.team.teamName}</td>
                  <td>{row.matchesPlayed}</td>
                  <td className="text-success fw-bold">{row.won}</td>
                  <td className="text-danger">{row.lost}</td>
                  <td>{row.tied}</td>
                  <td>
                    <span className="badge bg-dark fs-6">{row.points}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PointsTable;
