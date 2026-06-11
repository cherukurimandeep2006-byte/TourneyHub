// pages/Complaints.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createComplaint, getComplaintsByTournament, getTournamentById } from '../services/api';
import { toast } from 'react-toastify';

const statusColors = {
  pending: 'warning',
  under_review: 'primary',
  resolved: 'success',
  rejected: 'danger',
};

const Complaints = () => {
  const { tournamentId } = useParams();
  const { token, user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [form, setForm] = useState({ subject: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [tournamentId]);

  const fetchData = async () => {
    try {
      const [cRes, tRes] = await Promise.all([
        getComplaintsByTournament(tournamentId, token),
        getTournamentById(tournamentId),
      ]);
      setComplaints(cRes.data);
      setTournament(tRes.data);
    } catch (e) {
      console.error('Error loading complaints:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createComplaint({ tournament: tournamentId, ...form }, token);
      toast.success('Complaint submitted successfully!');
      setForm({ subject: '', description: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border"></div></div>;

  return (
    <div className="container py-4">
      <h4 className="mb-1">📢 Complaints & Disputes</h4>
      {tournament && <p className="text-muted mb-4">{tournament.tournamentName}</p>}

      {/* Submit Complaint Form */}
      <div className="card border-0 shadow mb-4">
        <div className="card-header bg-dark text-white">
          <h6 className="mb-0">Raise a New Complaint</h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Subject *</label>
              <input
                type="text" className="form-control"
                placeholder="e.g. Wrong score entered, Player eligibility issue"
                value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description *</label>
              <textarea
                className="form-control" rows="4"
                placeholder="Describe your complaint in detail..."
                value={form.description} onChange={e => setForm({...form, description: e.target.value})} required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-dark" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </form>
        </div>
      </div>

      {/* Complaints List */}
      <h5 className="mb-3">Your Complaints ({complaints.length})</h5>
      {complaints.length === 0 ? (
        <div className="alert alert-info">No complaints submitted yet.</div>
      ) : (
        complaints.map(c => (
          <div key={c._id} className="card mb-3 border-0 shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <strong>{c.subject}</strong>
                <small className="text-muted ms-2">by {c.user?.name}</small>
              </div>
              <span className={`badge bg-${statusColors[c.status] || 'secondary'}`}>
                {c.status?.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>
            <div className="card-body">
              <p className="mb-2">{c.description}</p>
              <small className="text-muted">
                Filed on {new Date(c.createdAt).toLocaleDateString()}
              </small>
              {c.adminReply && (
                <div className="alert alert-success mt-3 mb-0 py-2">
                  <i className="bi bi-person-check me-1"></i>
                  <strong>Admin Reply:</strong> {c.adminReply}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Complaints;
