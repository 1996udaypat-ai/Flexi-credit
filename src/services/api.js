// API client for LifeXP backend
const API_BASE = '/api';

export async function fetchUser() {
  const res = await fetch(`${API_BASE}/user/profile`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export async function updateUser(data) {
  const res = await fetch(`${API_BASE}/user/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
}

export async function toggleSound() {
  const res = await fetch(`${API_BASE}/user/toggle-sound`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to toggle sound');
  return res.json();
}

export async function fetchQuests(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/quests?${query}`);
  if (!res.ok) throw new Error('Failed to fetch quests');
  return res.json();
}

export async function createQuest(data) {
  const res = await fetch(`${API_BASE}/quests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create quest');
  return res.json();
}

export async function completeQuest(id) {
  const res = await fetch(`${API_BASE}/quests/${id}/complete`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to complete quest');
  return res.json();
}

export async function deleteQuest(id) {
  const res = await fetch(`${API_BASE}/quests/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete quest');
  return res.json();
}

export async function fetchSkills() {
  const res = await fetch(`${API_BASE}/skills`);
  if (!res.ok) throw new Error('Failed to fetch skills');
  return res.json();
}

export async function upgradeSkill(skillId) {
  const res = await fetch(`${API_BASE}/skills/${skillId}/upgrade`, { method: 'POST' });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to upgrade skill');
  }
  return res.json();
}

export async function fetchAchievements(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/achievements?${query}`);
  if (!res.ok) throw new Error('Failed to fetch achievements');
  return res.json();
}

export async function claimAchievement(id) {
  const res = await fetch(`${API_BASE}/achievements/${id}/claim`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to claim achievement');
  return res.json();
}

export async function fetchLeaderboard(period = 'weekly') {
  const res = await fetch(`${API_BASE}/leaderboard?period=${period}`);
  if (!res.ok) throw new Error('Failed to fetch leaderboard');
  return res.json();
}

export async function fetchStatsOverview() {
  const res = await fetch(`${API_BASE}/stats/overview`);
  if (!res.ok) throw new Error('Failed to fetch stats overview');
  return res.json();
}
