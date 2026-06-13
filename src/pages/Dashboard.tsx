import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { ProgressRing, StatCard, Card } from '../components/ui';
import { RiTodoLine, RiHeart3Line, RiFireLine, RiLeafLine, RiCalendarLine, RiRobot2Line } from 'react-icons/ri';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const quotes = [
  "The secret of getting ahead is getting started. — Mark Twain",
  "Small daily improvements lead to stunning results. — Robin Sharma",
  "Discipline is choosing between what you want now and what you want most.",
  "You don't have to be great to start, but you have to start to be great.",
  "Take care of your body. It's the only place you have to live. — Jim Rohn",
  "Success is the sum of small efforts repeated day in and day out.",
];

const weeklyData = [
  { day: 'Mon', productivity: 72, health: 65, study: 80 },
  { day: 'Tue', productivity: 85, health: 78, study: 60 },
  { day: 'Wed', productivity: 68, health: 82, study: 75 },
  { day: 'Thu', productivity: 90, health: 70, study: 88 },
  { day: 'Fri', productivity: 78, health: 85, study: 70 },
  { day: 'Sat', productivity: 60, health: 90, study: 55 },
  { day: 'Sun', productivity: 82, health: 88, study: 65 },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good morning', emoji: '☀️' };
  if (h < 17) return { text: 'Good afternoon', emoji: '🌤️' };
  return { text: 'Good evening', emoji: '🌙' };
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function Dashboard() {
  const { state } = useApp();
  const greeting = getGreeting();
  const today = new Date().toISOString().split('T')[0];
  const quote = quotes[new Date().getDay() % quotes.length];

  const todayTodos = state.todos;
  const completedTodos = todayTodos.filter(t => t.completed).length;
  const todayHabits = state.habits;
  const completedHabits = todayHabits.filter(h => h.completedDates.includes(today)).length;
  const waterLog = state.waterLogs.find(w => w.date === today);
  const waterGlasses = waterLog?.glasses || 0;
  const stepsLog = state.stepsLogs.find(s => s.date === today);
  const steps = stepsLog?.steps || 0;
  const sleepLog = state.sleepLogs.find(s => s.date === today);
  const sleepHours = sleepLog?.hours || 0;

  const productivityScore = Math.round(
    ((completedTodos / Math.max(todayTodos.length, 1)) * 40) +
    ((completedHabits / Math.max(todayHabits.length, 1)) * 40) +
    (Math.min(sleepHours / 8, 1) * 20)
  );
  const healthScore = Math.round(
    ((waterGlasses / 8) * 30) +
    ((steps / 10000) * 40) +
    (Math.min(sleepHours / 8, 1) * 30)
  );

  const todaySchedule = state.scheduleBlocks
    .filter(b => b.date === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .slice(0, 4);

  const blockColors: Record<string, string> = {
    work: '#4f46e5', study: '#f59e0b', break: '#10b981',
    exercise: '#f43f5e', meal: '#0ea5e9', sleep: '#8b5cf6', personal: '#6366f1',
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      {/* Hero greeting */}
      <motion.div variants={itemVariants} style={{ marginBottom: 28 }}>
        <div style={{
          padding: '28px 32px', borderRadius: 24,
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #9333ea 100%)',
          position: 'relative', overflow: 'hidden'
        }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'absolute', bottom: -30, right: 120, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 28 }}>{greeting.emoji}</span>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                {greeting.text}, {state.settings.name}!
              </h1>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, maxWidth: 520, lineHeight: 1.6, marginBottom: 20 }}>
              "{quote}"
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(255,255,255,0.15)', padding: '8px 16px', borderRadius: 12, backdropFilter: 'blur(8px)' }}>
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.15)', padding: '8px 16px', borderRadius: 12, backdropFilter: 'blur(8px)' }}>
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>⚡ {productivityScore}% Productivity</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Score rings */}
      <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Productivity', value: productivityScore, color: '#4f46e5', icon: '⚡' },
          { label: 'Health Score', value: healthScore, color: '#10b981', icon: '💚' },
          { label: 'Habits Done', value: Math.round((completedHabits / Math.max(todayHabits.length, 1)) * 100), color: '#f59e0b', icon: '🔥' },
          { label: 'Tasks Done', value: Math.round((completedTodos / Math.max(todayTodos.length, 1)) * 100), color: '#8b5cf6', icon: '✅' },
        ].map(({ label, value, color, icon }) => (
          <motion.div key={label} className="card" whileHover={{ y: -3 }}
            style={{ padding: '22px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <ProgressRing value={value} size={72} strokeWidth={7} color={color}
              label={`${value}%`} sublabel="score" />
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
              <div style={{ fontSize: 22, marginTop: 2 }}>{icon}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats row */}
      <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard title="Tasks" value={`${completedTodos}/${todayTodos.length}`} icon={<RiTodoLine />} color="#4f46e5" subtitle="Completed today" trend={12} />
        <StatCard title="Water" value={waterGlasses} unit="/ 8 glasses" icon={<span>💧</span>} color="#0ea5e9" subtitle="Stay hydrated" trend={waterGlasses >= 6 ? 8 : -5} />
        <StatCard title="Steps" value={steps.toLocaleString()} unit="steps" icon={<span>👟</span>} color="#10b981" subtitle={`${Math.round((steps / 10000) * 100)}% of goal`} trend={15} />
        <StatCard title="Sleep" value={sleepHours || '—'} unit="hrs" icon={<RiHeart3Line />} color="#8b5cf6" subtitle="Last night" />
        <StatCard title="Habits" value={`${completedHabits}/${todayHabits.length}`} icon={<RiFireLine />} color="#f59e0b" subtitle="Streak alive!" trend={5} />
        <StatCard title="Calories" value={
          (() => {
            const todayMeal = state.meals.find(m => m.date === today);
            if (!todayMeal) return 0;
            const all = [...todayMeal.breakfast, ...todayMeal.lunch, ...todayMeal.dinner, ...todayMeal.snacks];
            return all.reduce((s, i) => s + i.calories, 0);
          })()
        } unit="kcal" icon={<RiLeafLine />} color="#f43f5e" subtitle="Eaten today" />
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 20 }}>
        {/* Weekly chart */}
        <motion.div variants={itemVariants} className="card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Weekly Overview</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Productivity · Health · Study scores</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="studyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="productivity" stroke="#4f46e5" strokeWidth={2.5} fill="url(#prodGrad)" name="Productivity" />
              <Area type="monotone" dataKey="health" stroke="#10b981" strokeWidth={2.5} fill="url(#healthGrad)" name="Health" />
              <Area type="monotone" dataKey="study" stroke="#f59e0b" strokeWidth={2.5} fill="url(#studyGrad)" name="Study" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Today's schedule */}
        <motion.div variants={itemVariants} className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Today's Schedule</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{todaySchedule.length} blocks planned</p>
            </div>
            <RiCalendarLine style={{ fontSize: 20, color: 'var(--text-muted)' }} />
          </div>
          {todaySchedule.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: 13 }}>No schedule blocks yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {todaySchedule.map(block => (
                <div key={block.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px', borderRadius: 14,
                  background: `${blockColors[block.type]}12`,
                  border: `1px solid ${blockColors[block.type]}25`
                }}>
                  <div style={{ width: 3, height: 36, borderRadius: 99, background: blockColors[block.type], flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{block.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{block.startTime} – {block.endTime}</div>
                  </div>
                  <span className="badge" style={{ background: `${blockColors[block.type]}18`, color: blockColors[block.type], border: `1px solid ${blockColors[block.type]}25`, fontSize: 10 }}>
                    {block.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* AI tip + Habits preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* AI tip */}
        <motion.div variants={itemVariants} style={{
          padding: '22px 24px', borderRadius: 20,
          background: 'linear-gradient(135deg, rgba(79,70,229,0.08), rgba(124,58,237,0.06))',
          border: '1px solid rgba(79,70,229,0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
              <RiRobot2Line style={{ color: '#fff' }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>AI Tip of the Day</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Personalized for you</div>
            </div>
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {waterGlasses < 4
              ? `💧 You've only had ${waterGlasses} glasses of water today. Drink 2 more glasses before your next break — hydration boosts focus by up to 14%!`
              : steps < 5000
              ? `👟 You're at ${steps.toLocaleString()} steps. A quick 15-minute walk after lunch can add ~1,500 steps and boost afternoon productivity.`
              : `🎯 You're doing great! You've completed ${completedHabits} habits today. Keep your momentum — consistency is the key to lasting change.`}
          </p>
        </motion.div>

        {/* Habits preview */}
        <motion.div variants={itemVariants} className="card" style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Today's Habits</h3>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{completedHabits}/{todayHabits.filter(h => h.frequency === 'daily').length} done</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {state.habits.filter(h => h.frequency === 'daily').slice(0, 5).map(habit => {
              const done = habit.completedDates.includes(today);
              return (
                <div key={habit.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    background: done ? habit.color : 'var(--border-color)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, transition: 'background 0.3s'
                  }}>
                    {done ? '✓' : habit.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: done ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: done ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {habit.name}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 12 }}>🔥</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b' }}>{habit.streak}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
