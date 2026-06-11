// pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'player' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      login(data);
      toast.success('Registration successful! Welcome to TourneyHub!');
      if (data.role === 'admin') navigate('/admin');
      else if (data.role === 'captain') navigate('/captain');
      else navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow border-0">
            <div className="card-header bg-dark text-white text-center py-3">
              <h4 className="mb-0">🏆 Create Your TourneyHub Account</h4>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input type="text" name="name" className="form-control"
                    placeholder="Your full name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input type="email" name="email" className="form-control"
                    placeholder="Your email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input type="text" name="phone" className="form-control"
                    placeholder="10-digit phone number" value={form.phone} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input type="password" name="password" className="form-control"
                    placeholder="Min 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Register As</label>
                  <select name="role" className="form-select" value={form.role} onChange={handleChange}>
                    <option value="player">Player / Viewer</option>
                    <option value="captain">Team Captain</option>
                    <option value="admin">Organizer / Admin</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-dark w-100" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Register'}
                </button>
              </form>
              <hr />
              <p className="text-center mb-0">
                Already have an account? <Link to="/login">Login here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
