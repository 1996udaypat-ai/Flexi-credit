import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation.jsx';
import TopBar from './components/TopBar.jsx';
import LevelUpModal from './components/LevelUpModal.jsx';
import NewQuestModal from './components/NewQuestModal.jsx';

import Dashboard from './pages/Dashboard.jsx';
import Quests from './pages/Quests.jsx';
import Character from './pages/Character.jsx';
import SkillTree from './pages/SkillTree.jsx';
import Achievements from './pages/Achievements.jsx';
import Leaderboard from './pages/Leaderboard.jsx';

import { 
  fetchUser, 
  updateUser, 
  toggleSound, 
  fetchQuests, 
  createQuest, 
  completeQuest, 
  deleteQuest, 
  fetchSkills, 
  upgradeSkill, 
  fetchAchievements, 
  claimAchievement, 
  fetchLeaderboard, 
  fetchStatsOverview 
} from './services/api.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [quests, setQuests] = useState([]);
  const [skills, setSkills] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [leaderboardPeriod, setLeaderboardPeriod] = useState('weekly');

  const [loading, setLoading] = useState(true);
  const [levelUpData, setLevelUpData] = useState(null);
  const [isNewQuestOpen, setIsNewQuestOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast Helper
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Initial Data Load
  const loadAllData = async () => {
    try {
      setLoading(true);
      const [u, q, s, a, st, lb] = await Promise.all([
        fetchUser(),
        fetchQuests(),
        fetchSkills(),
        fetchAchievements(),
        fetchStatsOverview(),
        fetchLeaderboard(leaderboardPeriod)
      ]);
      setUser(u);
      setQuests(q);
      setSkills(s);
      setAchievements(a);
      setStats(st);
      setLeaderboardData(lb);
    } catch (err) {
      console.error('Failed to load LifeXP data:', err);
      addToast('Error synchronizing with LifeXP Core', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handle Leaderboard Period Switch
  const handleChangeLeaderboardPeriod = async (period) => {
    try {
      setLeaderboardPeriod(period);
      const lb = await fetchLeaderboard(period);
      setLeaderboardData(lb);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Quest Complete
  const handleCompleteQuest = async (questId) => {
    try {
      const res = await completeQuest(questId);
      if (res.success) {
        // Update user state
        setUser(res.user);
        
        // Update quest in state
        setQuests((prev) => 
          prev.map((q) => (q._id === questId ? res.quest : q))
        );

        addToast(`Directive accomplished: +${res.xpGained} XP awarded!`, 'success');

        // Check if level-up was triggered
        if (res.leveledUp) {
          setLevelUpData({
            oldLevel: res.oldLevel,
            newLevel: res.newLevel
          });
        }

        // Refresh stats
        fetchStatsOverview().then(setStats).catch(console.error);
        fetchLeaderboard(leaderboardPeriod).then(setLeaderboardData).catch(console.error);
        return res;
      }
    } catch (err) {
      addToast(err.message || 'Failed to complete quest', 'error');
      throw err;
    }
  };

  // Handle Create Quest
  const handleCreateQuest = async (questData) => {
    try {
      const newQuest = await createQuest(questData);
      setQuests((prev) => [newQuest, ...prev]);
      addToast(`New mission assigned: "${newQuest.title}"`, 'success');
      fetchStatsOverview().then(setStats).catch(console.error);
    } catch (err) {
      addToast(err.message || 'Failed to dispatch mission', 'error');
      throw err;
    }
  };

  // Handle Delete Quest
  const handleDeleteQuest = async (questId) => {
    try {
      await deleteQuest(questId);
      setQuests((prev) => prev.filter((q) => q._id !== questId));
      addToast('Directive aborted and removed.', 'info');
      fetchStatsOverview().then(setStats).catch(console.error);
    } catch (err) {
      addToast(err.message || 'Failed to delete quest', 'error');
    }
  };

  // Handle Skill Upgrade
  const handleUpgradeSkill = async (skillId) => {
    try {
      const res = await upgradeSkill(skillId);
      if (res.success) {
        setUser(res.user);
        setSkills((prev) =>
          prev.map((s) => (s.skillId === skillId ? res.skill : s))
        );
        addToast(res.message, 'success');
        fetchStatsOverview().then(setStats).catch(console.error);
      }
    } catch (err) {
      addToast(err.message || 'Prerequisites or resonance requirements not met', 'error');
      throw err;
    }
  };

  // Handle User Update
  const handleUpdateUser = async (data) => {
    try {
      const updated = await updateUser(data);
      setUser(updated);
      addToast('Operator profile saved.', 'success');
    } catch (err) {
      addToast('Failed to update operator profile', 'error');
    }
  };

  // Handle Toggle Sound
  const handleToggleSound = async () => {
    try {
      const res = await toggleSound();
      setUser((prev) => (prev ? { ...prev, soundEnabled: res.soundEnabled } : prev));
      addToast(res.soundEnabled ? 'Procedural Audio SFX Enabled' : 'Procedural Audio Muted', 'info');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      {/* Navigation Sidebar */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        user={user}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Area */}
      <div className="main-viewport">
        {/* Top Status Bar */}
        <TopBar
          user={user}
          onOpenNewQuest={() => setIsNewQuestOpen(true)}
          onToggleSound={handleToggleSound}
        />

        {/* Viewport Content */}
        <main className="page-content-wrapper">
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '16px' }}>
              <div 
                style={{
                  width: '36px',
                  height: '36px',
                  border: '2px solid rgba(167, 139, 250, 0.2)',
                  borderTopColor: 'var(--accent-primary)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}
              />
              <span className="label-caps" style={{ letterSpacing: '0.15em' }}>
                INITIALIZING LIFEXP NEURAL INTERFACE...
              </span>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  user={user}
                  quests={quests}
                  stats={stats}
                  achievements={achievements}
                  onCompleteQuest={handleCompleteQuest}
                  onDeleteQuest={handleDeleteQuest}
                  onNavigate={setActiveTab}
                  onOpenNewQuest={() => setIsNewQuestOpen(true)}
                />
              )}

              {activeTab === 'quests' && (
                <Quests
                  quests={quests}
                  onCompleteQuest={handleCompleteQuest}
                  onDeleteQuest={handleDeleteQuest}
                  onOpenNewQuest={() => setIsNewQuestOpen(true)}
                  soundEnabled={user?.soundEnabled}
                />
              )}

              {activeTab === 'character' && (
                <Character
                  user={user}
                  achievements={achievements}
                  skills={skills}
                  onUpdateUser={handleUpdateUser}
                />
              )}

              {activeTab === 'skills' && (
                <SkillTree
                  skills={skills}
                  user={user}
                  onUpgradeSkill={handleUpgradeSkill}
                  soundEnabled={user?.soundEnabled}
                />
              )}

              {activeTab === 'achievements' && (
                <Achievements
                  achievements={achievements}
                  user={user}
                  soundEnabled={user?.soundEnabled}
                />
              )}

              {activeTab === 'leaderboard' && (
                <Leaderboard
                  leaderboardData={leaderboardData}
                  period={leaderboardPeriod}
                  onChangePeriod={handleChangeLeaderboardPeriod}
                  soundEnabled={user?.soundEnabled}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Level-Up Cinematic Modal */}
      {levelUpData && (
        <LevelUpModal
          data={levelUpData}
          soundEnabled={user?.soundEnabled}
          onClose={() => setLevelUpData(null)}
        />
      )}

      {/* Dispatch New Mission Modal */}
      <NewQuestModal
        isOpen={isNewQuestOpen}
        onClose={() => setIsNewQuestOpen(false)}
        onCreateQuest={handleCreateQuest}
        soundEnabled={user?.soundEnabled}
      />

      {/* Toast Notification Container */}
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast-item">
            <span style={{ fontSize: '13px', fontWeight: 500 }}>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
