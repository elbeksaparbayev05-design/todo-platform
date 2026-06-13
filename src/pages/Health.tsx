import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { ProgressRing, StatCard, Card, Button, Modal, SectionHeader } from '../components/ui';
import { RiAddLine, RiWaterFlashLine, RiMoonLine, RiRunLine, RiFootprintLine } from 'react-icons/ri';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function HealthPage() {
  const { state, dispatch } = useApp();
  const [waterModalOpen, setWaterModalOpen] = useState(false);
  const [sleepModalOpen, setSleepModalOpen] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const waterLog = state.waterLogs.find(w => w.date === today) || { date: today, glasses: 0 };
  const sleepLog = state.sleepLogs.find(s => s.date === today);
  const stepsLog = state.stepsLogs.find(s => s.date === today) || { date: today, steps: 0, goal: 10000 };

  const waterGoal = state.settings.waterGoal;
  const sleepGoal = state.settings.sleepGoal;
  const stepsGoal = state.settings.stepsGoal;

  // Prepare chart data
  const chartData = state.sleepLogs.slice(-7).map(log => ({
    date: log.date.slice(-2),
    hours: log.hours,
    quality: log.quality
  }));

  function updateWater(glasses: number) {
    dispatch({ type: 'SET_WATER', payload: { date: today, glasses: Math.max(0, Math.min(glasses, 12)) } });
  }

  function addSleepLog(hours: number, quality: number) {
    dispatch({
      type: 'ADD_SLEEP_LOG',
      payload: {
        date: today,
        hours,
        quality: quality as any,
        bedtime: '22:00',
        wakeTime: '06:00'
      }
    });
    setSleepModalOpen(false);
  }

  function updateSteps(steps: number) {
    dispatch({ type: 'SET_STEPS', payload: { date: today, steps, goal: stepsGoal } });
  }

  return (
    <div>
      <SectionHeader
        title="Health Tracking"
        subtitle="Monitor your wellness metrics"
      />

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {/* Water */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <RiWaterFlashLine style={{ fontSize: 24, color: '#0ea5e9' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Daily Goal</span>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)' }}>
                {waterLog.glasses}/{waterGoal}
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>glasses of water</p>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => updateWater(waterLog.glasses - 1)} style={{ flex: 1, padding: '6px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>−</button>
              <button onClick={() => updateWater(waterLog.glasses + 1)} style={{ flex: 1, padding: '6px', borderRadius: 6, border: '1px solid #0ea5e9', background: 'rgba(14,165,233,0.1)', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#0ea5e9' }}>+</button>
            </div>
          </Card>
        </motion.div>

        {/* Sleep */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <RiMoonLine style={{ fontSize: 24, color: '#8b5cf6' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Last Night</span>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)' }}>
                {sleepLog?.hours.toFixed(1) || '—'}
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>hours sleep</p>
            </div>
            <Button onClick={() => setSleepModalOpen(true)} style={{ width: '100%', fontSize: 12, padding: '6px 0' }}>Log Sleep</Button>
          </Card>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <RiFootprintLine style={{ fontSize: 24, color: '#10b981' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Daily Goal</span>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)' }}>
                {stepsLog.steps.toLocaleString()}
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>of {stepsGoal.toLocaleString()} steps</p>
            </div>
            <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'var(--bg-secondary)', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min((stepsLog.steps / stepsGoal) * 100, 100)}%`, height: '100%', background: '#10b981', transition: 'width 0.3s' }} />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Sleep Chart */}
      {chartData.length > 0 && (
        <Card style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Last 7 Days Sleep</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 8 }}
                formatter={(v) => [`${v} hours`, 'Sleep']}
              />
              <Line type="monotone" dataKey="hours" stroke="#8b5cf6" dot={{ fill: '#8b5cf6', r: 4 }} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Sleep Modal */}
      <Modal open={sleepModalOpen} onClose={() => setSleepModalOpen(false)} title="Log Sleep" width={400}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Hours Slept</label>
            <input type="number" min="0" max="24" step="0.5" defaultValue={sleepLog?.hours || 7} className="input-field" />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Sleep Quality (1-5)</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1, 2, 3, 4, 5].map(q => (
                <button key={q} style={{ flex: 1, padding: '8px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer', fontWeight: 600 }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <Button variant="secondary" onClick={() => setSleepModalOpen(false)}>Cancel</Button>
            <Button onClick={() => addSleepLog(7, 3)}>Save Sleep Log</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
