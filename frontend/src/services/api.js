// ============================================
// services/api.js - All API Calls (Axios)
// ============================================

import axios from 'axios';

const BASE_URL = '/api'; // Vite proxy forwards this to http://localhost:5000/api

// Helper: get auth header with JWT token
const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// ---- AUTH APIs ----
export const registerUser = (data) => axios.post(`${BASE_URL}/auth/register`, data);
export const loginUser = (data) => axios.post(`${BASE_URL}/auth/login`, data);
export const getProfile = (token) => axios.get(`${BASE_URL}/auth/profile`, authHeader(token));

// ---- TOURNAMENT APIs ----
export const getAllTournaments = () => axios.get(`${BASE_URL}/tournaments`);
export const getTournamentById = (id) => axios.get(`${BASE_URL}/tournaments/${id}`);
export const createTournament = (data, token) =>
  axios.post(`${BASE_URL}/tournaments`, data, authHeader(token));
export const updateTournament = (id, data, token) =>
  axios.put(`${BASE_URL}/tournaments/${id}`, data, authHeader(token));
export const deleteTournament = (id, token) =>
  axios.delete(`${BASE_URL}/tournaments/${id}`, authHeader(token));

// ---- TEAM APIs ----
export const registerTeam = (data, token) =>
  axios.post(`${BASE_URL}/teams/register`, data, authHeader(token));
export const getMyTeams = (token) =>
  axios.get(`${BASE_URL}/teams/my-teams`, authHeader(token));
export const getTeamsByTournament = (tournamentId) =>
  axios.get(`${BASE_URL}/teams/tournament/${tournamentId}`);
export const getTeamById = (id) => axios.get(`${BASE_URL}/teams/${id}`);
export const approveTeam = (id, token) =>
  axios.put(`${BASE_URL}/teams/${id}/approve`, {}, authHeader(token));
export const rejectTeam = (id, token) =>
  axios.put(`${BASE_URL}/teams/${id}/reject`, {}, authHeader(token));
export const updatePlayers = (id, players, token) =>
  axios.put(`${BASE_URL}/teams/${id}/players`, { players }, authHeader(token));

// ---- MATCH APIs ----
export const generateFixtures = (tournamentId, token) =>
  axios.post(`${BASE_URL}/matches/generate-fixtures/${tournamentId}`, {}, authHeader(token));
export const getMatchesByTournament = (tournamentId) =>
  axios.get(`${BASE_URL}/matches/tournament/${tournamentId}`);
export const getPointsTable = (tournamentId) =>
  axios.get(`${BASE_URL}/matches/points-table/${tournamentId}`);
export const getMatchById = (id) => axios.get(`${BASE_URL}/matches/${id}`);
export const updateMatchResult = (id, data, token) =>
  axios.put(`${BASE_URL}/matches/${id}/result`, data, authHeader(token));
export const scheduleMatch = (id, data, token) =>
  axios.put(`${BASE_URL}/matches/${id}/schedule`, data, authHeader(token));

// ---- SCORE APIs ----
export const createScore = (matchId, data, token) =>
  axios.post(`${BASE_URL}/scores/${matchId}`, data, authHeader(token));
export const getScore = (matchId) => axios.get(`${BASE_URL}/scores/${matchId}`);
export const updateScore = (matchId, data, token) =>
  axios.put(`${BASE_URL}/scores/${matchId}`, data, authHeader(token));

// ---- PAYMENT APIs ----
export const uploadPayment = (formData, token) =>
  axios.post(`${BASE_URL}/payments/upload`, formData, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
  });
export const getPaymentsByTournament = (tournamentId, token) =>
  axios.get(`${BASE_URL}/payments/tournament/${tournamentId}`, authHeader(token));
export const getPaymentByTeam = (teamId, token) =>
  axios.get(`${BASE_URL}/payments/team/${teamId}`, authHeader(token));
export const verifyPayment = (id, token) =>
  axios.put(`${BASE_URL}/payments/${id}/verify`, {}, authHeader(token));
export const rejectPayment = (id, token) =>
  axios.put(`${BASE_URL}/payments/${id}/reject`, {}, authHeader(token));

// ---- COMPLAINT APIs ----
export const createComplaint = (data, token) =>
  axios.post(`${BASE_URL}/complaints`, data, authHeader(token));
export const getComplaintsByTournament = (tournamentId, token) =>
  axios.get(`${BASE_URL}/complaints/tournament/${tournamentId}`, authHeader(token));
export const getAllComplaints = (token) =>
  axios.get(`${BASE_URL}/complaints/all`, authHeader(token));
export const replyToComplaint = (id, data, token) =>
  axios.put(`${BASE_URL}/complaints/${id}/reply`, data, authHeader(token));
