import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Card, SectionHeader, ProgressRing } from '../components/ui';
import { RiCheckLine, RiFireLine, RiBarChart2Line } from 'react-icons/ri';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function StatisticsPage() {
  const { state } = useApp();
  const today = new Date().toISOString().split('T')[0];

  // Calculate statistics
  const totalTodos = state.todos.length;
  const completedTodos = state.todos.filter(t => t.completed).length;
  const todayHabits = state.habits.filter(h => h.completedDates.includes(today)).length;
  const totalHabits = state.habits.length;
  
  const totalWaterToday = state.waterLogs.find(w => w.date === today)?.glasses || 0;
  const waterGoal = state.settings.waterGoal;
  
  const sleepToday = state.sleepLogs.find(s => s.date === today)?.hours || 0;
  const sleepGoal = state.settings.sleepGoal;
  
  const stepsToday = state.stepsLogs.find(s => s.date === today)?.steps || 0;
  const stepsGoal = state.settings.stepsGoal;

  // Prepare chart data
  const sleepChartData = state.sleepLogs.slice(-14).map(log => ({
    date: log.date.slice(-2),
    hours: log.hours,
    quality: log.quality
  }));

  const habitData = state.habits.map(h => ({
    name: h.name,
    streak: h.streak
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div>
      <SectionHeader
        title="Statistics & Insights"
        subtitle="Track your progress and achievements"
      />

      {/* Key Metrics */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}
      >
        <motion.div variants={itemVariants}>
          <Card style={{ textAlign: 'center', padding: '24px 16px' }}>
            <RiCheckLine style={{ fontSize: 32, color: '#4f46e5', marginBottom: 12 }} />
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              {completedTodos}/{totalTodos}
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Tasks Completed</p>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card style={{ textAlign: 'center', padding: '24px 16px' }}>
            <RiFireLine style={{ fontSize: 32, color: '#f43f5e', marginBottom: 12 }} />
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              {todayHabits}/{totalHabits}
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Habits Today</p>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card style={{ textAlign: 'center', padding: '24px 16px' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>💧</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              {totalWaterToday}/{waterGoal}
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Water Intake</p>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card style={{ textAlign: 'center', padding: '24px 16px' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>😴</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              {sleepToday.toFixed(1)}/{sleepGoal}h
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Sleep Hours</p>
          </Card>
        </motion.div>
      </motion.div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
        {/* Sleep Chart */}
        {sleepChartData.length > 0 && (
          <Card>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
              Sleep Trends (Last 14 Days)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sleepChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 8 }} />
                <Line type="monotone" dataKey="hours" stroke="#8b5cf6" dot={{ fill: '#8b5cf6', r: 4 }} strokeWidth={2} name="Hours" />
                <Line type="monotone" dataKey="quality" stroke="#10b981" strokeWidth={2} name="Quality" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Habits Streak */}
        {habitData.length > 0 && (
          <Card>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
              Habit Streaks
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={habitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 8 }} />
                <Bar dataKey="streak" fill="#f43f5e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      {/* Progress Rings */}
      {(completedTodos > 0 || sleepToday > 0 || totalWaterToday > 0) && (
        <Card style={{ marginTop: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
            Daily Goals Overview
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ProgressRing
                value={completedTodos}
                max={Math.max(totalTodos, 1)}
                size={100}
                strokeWidth={6}
                color="#4f46e5"
              />
              <span style={{ marginTop: 12, fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Tasks</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ProgressRing
                value={totalWaterToday}
                max={waterGoal}
                size={100}
                strokeWidth={6}
                color="#0ea5e9"
              />
              <span style={{ marginTop: 12, fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Water</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ProgressRing
                value={sleepToday}
                max={sleepGoal}
                size={100}
                strokeWidth={6}
                color="#8b5cf6"
              />
              <span style={{ marginTop: 12, fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Sleep</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
