import { useState } from 'react';
import { useApp, useLanguage, useLanguage as useLanguageContext } from '../context/AppContext';
import { Button, SectionHeader, Card } from '../components/ui';
import { RiSaveLine, RiMoonLine, RiSunLine } from 'react-icons/ri';
import { useDarkMode } from '../context/AppContext';

export default function SettingsPage() {
  const { state, dispatch } = useApp();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { language, setLanguage } = useLanguage();
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: state.settings.name,
    calorieGoal: state.settings.calorieGoal,
    waterGoal: state.settings.waterGoal,
    stepsGoal: state.settings.stepsGoal,
    sleepGoal: state.settings.sleepGoal,
    notifications: state.settings.notifications
  });

  function handleSave() {
    dispatch({ type: 'UPDATE_SETTINGS', payload: formData });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <SectionHeader
        title="Settings"
        subtitle="Customize your LifeFlow experience"
      />

      {/* Profile Settings */}
      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Profile</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Full Name</label>
            <input
              className="input-field"
              type="text"
              value={formData.name}
              onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
            />
          </div>
        </div>
      </Card>

      {/* Daily Goals */}
      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Daily Goals</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>💧 Water Goal (glasses)</label>
            <input
              className="input-field"
              type="number"
              min="1"
              max="20"
              value={formData.waterGoal}
              onChange={e => setFormData(f => ({ ...f, waterGoal: parseInt(e.target.value) || 8 }))}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>😴 Sleep Goal (hours)</label>
            <input
              className="input-field"
              type="number"
              min="1"
              max="12"
              step="0.5"
              value={formData.sleepGoal}
              onChange={e => setFormData(f => ({ ...f, sleepGoal: parseInt(e.target.value) || 8 }))}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>🚶 Steps Goal</label>
            <input
              className="input-field"
              type="number"
              min="1000"
              step="1000"
              value={formData.stepsGoal}
              onChange={e => setFormData(f => ({ ...f, stepsGoal: parseInt(e.target.value) || 10000 }))}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>🍽️ Calorie Goal</label>
            <input
              className="input-field"
              type="number"
              min="1000"
              step="100"
              value={formData.calorieGoal}
              onChange={e => setFormData(f => ({ ...f, calorieGoal: parseInt(e.target.value) || 2000 }))}
            />
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Appearance</h3>
        
        {/* Dark Mode */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {darkMode ? (
              <RiMoonLine style={{ fontSize: 20, color: '#8b5cf6' }} />
            ) : (
              <RiSunLine style={{ fontSize: 20, color: '#f59e0b' }} />
            )}
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
              Dark Mode
            </span>
          </div>
          <button
            onClick={toggleDarkMode}
            style={{
              width: 50,
              height: 28,
              borderRadius: 14,
              border: 'none',
              background: darkMode ? '#4f46e5' : '#d1d5db',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.3s'
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: '#fff',
                position: 'absolute',
                top: 2,
                left: darkMode ? 24 : 2,
                transition: 'left 0.3s'
              }}
            />
          </button>
        </div>

        {/* Language */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>{language === 'uz' ? '🇺🇿' : '🇺🇸'}</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
              Language
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setLanguage('uz')}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: language === 'uz' ? '2px solid #4f46e5' : '1px solid var(--border-color)',
                background: language === 'uz' ? 'rgba(79,70,229,0.1)' : 'var(--bg-primary)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 12,
                color: language === 'uz' ? '#4f46e5' : 'var(--text-secondary)',
                transition: 'all 0.2s'
              }}
            >
              O'zbek
            </button>
            <button
              onClick={() => setLanguage('en')}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: language === 'en' ? '2px solid #4f46e5' : '1px solid var(--border-color)',
                background: language === 'en' ? 'rgba(79,70,229,0.1)' : 'var(--bg-primary)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 12,
                color: language === 'en' ? '#4f46e5' : 'var(--text-secondary)',
                transition: 'all 0.2s'
              }}
            >
              English
            </button>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Notifications</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
            Enable Notifications
          </span>
          <button
            onClick={() => setFormData(f => ({ ...f, notifications: !f.notifications }))}
            style={{
              width: 50,
              height: 28,
              borderRadius: 14,
              border: 'none',
              background: formData.notifications ? '#4f46e5' : '#d1d5db',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.3s'
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: '#fff',
                position: 'absolute',
                top: 2,
                left: formData.notifications ? 24 : 2,
                transition: 'left 0.3s'
              }}
            />
          </button>
        </div>
      </Card>

      {/* Save Button */}
      <div style={{ display: 'flex', gap: 12 }}>
        <Button
          onClick={handleSave}
          icon={<RiSaveLine />}
          style={{
            background: saved ? '#10b981' : '#4f46e5',
            transition: 'background 0.3s'
          }}
        >
          {saved ? '✓ Saved' : 'Save Changes'}
        </Button>
      </div>

      {/* About */}
      <Card style={{ marginTop: 32, textAlign: 'center', padding: '32px 24px' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>LifeFlow</h3>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
          v1.0.0 — Your personal life management companion
        </p>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 12 }}>
          Built with React, TypeScript & ❤️
        </p>
      </Card>
    </div>
  );
}
