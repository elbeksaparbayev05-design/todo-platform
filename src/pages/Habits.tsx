import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, Habit, useLanguage } from '../context/AppContext';
import { Badge, Button, Modal, SectionHeader, Card } from '../components/ui';
import { RiAddLine, RiDeleteBinLine, RiFireLine, RiCheckLine } from 'react-icons/ri';

const translations = {
  uz: {
    title: 'Kunlik Odatlar',
    of: 'dan',
    completed: 'tugallandi',
    addHabit: 'Odat Qo\'sh',
    habitName: 'Odat Nomi',
    cancel: 'Bekor Qilish',
    save: 'Saqlash',
    deleteConfirm: 'O\'chirib tashlamoqchisiz?',
    delete: 'O\'chirish',
    edit: 'Tahrirlash',
    daily: 'Kunlik',
    weekly: 'Haftalik',
    frequency: 'Chastotasi',
    wellness: 'Salomatlik',
    fitness: 'Jismoniy Tarbiya',
    learning: 'Ta\'lim',
    productivity: 'Samaradorlik',
  },
  en: {
    title: 'Daily Habits',
    of: 'of',
    completed: 'completed',
    addHabit: 'Add Habit',
    habitName: 'Habit Name',
    cancel: 'Cancel',
    save: 'Save',
    deleteConfirm: 'Delete this habit?',
    delete: 'Delete',
    edit: 'Edit',
    daily: 'Daily',
    weekly: 'Weekly',
    frequency: 'Frequency',
    wellness: 'Wellness',
    fitness: 'Fitness',
    learning: 'Learning',
    productivity: 'Productivity',
  }
};

const habitEmojis = ['🧘', '💪', '📚', '💧', '📵', '📋', '🎯', '🚴', '🧠', '💆'];
const habitColors = ['#6366f1', '#10b981', '#f59e0b', '#0ea5e9', '#f43f5e', '#8b5cf6', '#ec4899', '#14b8a6', '#84cc16', '#f97316'];

const frequencies = ['daily', 'weekly'] as const;

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

const emptyHabit: Omit<Habit, 'id' | 'createdAt'> = {
  name: '',
  icon: '🎯',
  color: '#6366f1',
  frequency: 'daily',
  completedDates: [],
  streak: 0,
  category: 'wellness',
};

export default function HabitsPage() {
  const { state, dispatch } = useApp();
  const { language } = useLanguage();
  const t = translations[language];
  const [modalOpen, setModalOpen] = useState(false);
  const [editHabit, setEditHabit] = useState<Habit | null>(null);
  const [form, setForm] = useState({ ...emptyHabit });
  const today = new Date().toISOString().split('T')[0];

  const habits = state.habits;
  const activeHabits = habits.filter(h => h.completedDates.includes(today)).length;

  function openAdd() {
    setEditHabit(null);
    setForm({ ...emptyHabit });
    setModalOpen(true);
  }

  function openEdit(h: Habit) {
    setEditHabit(h);
    setForm({ name: h.name, icon: h.icon, color: h.color, frequency: h.frequency, completedDates: h.completedDates, streak: h.streak, category: h.category });
    setModalOpen(true);
  }

  function save() {
    if (!form.name.trim()) return;
    if (editHabit) {
      dispatch({ type: 'ADD_HABIT', payload: { ...editHabit, ...form } });
    } else {
      dispatch({ type: 'ADD_HABIT', payload: { id: genId(), ...form, createdAt: new Date().toISOString().split('T')[0] } });
    }
    setModalOpen(false);
  }

  function toggle(id: string) {
    dispatch({ type: 'TOGGLE_HABIT', payload: { id, date: today } });
  }

  function del(id: string) {
    dispatch({ type: 'DELETE_HABIT', payload: id });
  }

  const isCompletedToday = (h: Habit) => h.completedDates.includes(today);

  return (
    <div>
      <SectionHeader
        title="Daily Habits"
        subtitle={`${activeHabits} of ${habits.length} habits completed`}
        action={<Button onClick={openAdd} icon={<RiAddLine />}>Add Habit</Button>}
      />

      {/* Habits Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        <AnimatePresence>
          {habits.map(habit => (
            <motion.div
              key={habit.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card 
                onClick={() => toggle(habit.id)}
                style={{
                  cursor: 'pointer',
                  borderLeft: `4px solid ${habit.color}`,
                  opacity: isCompletedToday(habit) ? 1 : 0.6,
                  transform: isCompletedToday(habit) ? 'scale(1)' : 'scale(1)',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ fontSize: 32 }}>{habit.icon}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      {habit.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <RiFireLine style={{ fontSize: 14, color: habit.color }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: habit.color }}>
                        {habit.streak} day streak
                      </span>
                    </div>
                  </div>
                  {isCompletedToday(habit) && (
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: habit.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff'
                    }}>
                      <RiCheckLine style={{ fontSize: 16 }} />
                    </div>
                  )}
                </div>

                <Badge color={habit.color} size="xs">{habit.frequency}</Badge>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    del(habit.id);
                  }}
                  style={{
                    marginTop: 12,
                    width: '100%',
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: '1px solid rgba(244,63,94,0.2)',
                    background: 'rgba(244,63,94,0.06)',
                    cursor: 'pointer',
                    color: '#f43f5e',
                    fontSize: 12,
                    fontWeight: 600,
                    transition: 'all 0.2s'
                  }}
                >
                  <RiDeleteBinLine style={{ display: 'inline', marginRight: 4 }} /> Delete
                </button>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {habits.length === 0 && (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
            No habits yet
          </h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Start building good habits today
          </p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editHabit ? 'Edit Habit' : 'Add New Habit'} width={480}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Habit Name *</label>
            <input className="input-field" placeholder="e.g., Morning Meditation" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Icon</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {habitEmojis.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setForm(f => ({ ...f, icon: emoji }))}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    border: form.icon === emoji ? '2px solid #4f46e5' : '1px solid var(--border-color)',
                    background: form.icon === emoji ? 'rgba(79,70,229,0.1)' : 'var(--bg-primary)',
                    cursor: 'pointer',
                    fontSize: 20,
                    transition: 'all 0.2s'
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Color</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {habitColors.map(color => (
                <button
                  key={color}
                  onClick={() => setForm(f => ({ ...f, color }))}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: color,
                    border: form.color === color ? '2px solid #000' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Frequency</label>
            <select className="input-field" value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value as any }))}>
              {frequencies.map(f => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={!form.name.trim()}>Save Habit</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
