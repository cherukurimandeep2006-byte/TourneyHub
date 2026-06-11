// pages/CreateTournament.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTournament } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const CreateTournament = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    tournamentName: '', sportType: 'Cricket', venue: '',
    startDate: '', endDate: '', entryFee: 0, maxTeams: 8,
    rules: '', prizeMoney: 0, organizerName: '', organizerPhone: '',
    upiId: '', status: 'upcoming',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await createTournament(form, token);
      toast.success('Tournament created successfully!');
      navigate(`/tournament/${data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create tournament');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card border-0 shadow">
            <div className="card-header bg-dark text-white">
              <h4 className="mb-0">➕ Create New Tournament</h4>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Tournament Name *</label>
                    <input type="text" name="tournamentName" className="form-control" placeholder="e.g. Bapatla Premier League" value={form.tournamentName} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Sport Type *</label>
                    <select name="sportType" className="form-select" value={form.sportType} onChange={handleChange}>
                      {['Cricket', 'Football', 'Kabaddi', 'Volleyball', 'Badminton', 'Chess', 'Other'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Venue *</label>
                    <input type="text" name="venue" className="form-control" placeholder="e.g. College Ground, Bapatla" value={form.venue} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Start Date *</label>
                    <input type="date" name="startDate" className="form-control" value={form.startDate} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">End Date *</label>
                    <input type="date" name="endDate" className="form-control" value={form.endDate} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Entry Fee (₹)</label>
                    <input type="number" name="entryFee" className="form-control" value={form.entryFee} onChange={handleChange} min="0" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Max Teams *</label>
                    <input type="number" name="maxTeams" className="form-control" value={form.maxTeams} onChange={handleChange} min="2" required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Prize Money (₹)</label>
                    <input type="number" name="prizeMoney" className="form-control" value={form.prizeMoney} onChange={handleChange} min="0" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Organizer Name *</label>
                    <input type="text" name="organizerName" className="form-control" value={form.organizerName} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Organizer Phone *</label>
                    <input type="text" name="organizerPhone" className="form-control" value={form.organizerPhone} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">UPI ID (for payment)</label>
                    <input type="text" name="upiId" className="form-control" placeholder="yourname@upi" value={form.upiId} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Initial Status</label>
                    <select name="status" className="form-select" value={form.status} onChange={handleChange}>
                      <option value="upcoming">Upcoming</option>
                      <option value="registration_open">Registration Open</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Rules / Description</label>
                    <textarea name="rules" className="form-control" rows="3" placeholder="Tournament rules and important information..." value={form.rules} onChange={handleChange}></textarea>
                  </div>
                </div>
                <div className="d-flex gap-2 mt-4">
                  <button type="submit" className="btn btn-dark" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Tournament'}
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/admin')}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTournament;
