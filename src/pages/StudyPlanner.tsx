import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, StudySubject } from '../context/AppContext';
import { Badge, Button, Modal, SectionHeader, ProgressBar, Card } from '../components/ui';
import { RiAddLine, RiDeleteBinLine, RiEditLine } from 'react-icons/ri';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

const emptySubject: Omit<StudySubject, 'id'> = {
  name: '',
  color: '#3178c6',
  icon: '⚡',
  examDate: undefined,
  totalHours: 40,
  studiedHours: 0,
};

const colors = ['#3178c6', '#f59e0b', '#10b981', '#f43f5e', '#8b5cf6', '#ec4899', '#14b8a6', '#84cc16'];
const icons = ['⚡', '📐', '⚛️', '✍️', '🎨', '🎵', '🗣️', '💻'];

export default function StudyPlannerPage() {
  const { state, dispatch } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editSubject, setEditSubject] = useState<StudySubject | null>(null);
  const [form, setForm] = useState({ ...emptySubject });

  const subjects = state.studySubjects;
  const chartData = subjects.map(s => ({
    name: s.name,
    studied: s.studiedHours,
    remaining: Math.max(0, s.totalHours - s.studiedHours)
  }));

  function openAdd() {
    setEditSubject(null);
    setForm({ ...emptySubject });
    setModalOpen(true);
  }

  function openEdit(s: StudySubject) {
    setEditSubject(s);
    setForm({ name: s.name, color: s.color, icon: s.icon, examDate: s.examDate, totalHours: s.totalHours, studiedHours: s.studiedHours });
    setModalOpen(true);
  }

  function save() {
    if (!form.name.trim()) return;
    if (editSubject) {
      dispatch({ type: 'UPDATE_STUDY_SUBJECT', payload: { ...editSubject, ...form } });
    } else {
      dispatch({ type: 'ADD_STUDY_SUBJECT', payload: { id: genId(), ...form } });
    }
    setModalOpen(false);
  }

  function del(id: string) {
    dispatch({ type: 'DELETE_HABIT', payload: id }); // Note: Use same action as habits
  }

  const totalHours = subjects.reduce((a, s) => a + s.totalHours, 0);
  const totalStudied = subjects.reduce((a, s) => a + s.studiedHours, 0);

  return (
    <div>
      <SectionHeader
        title="Study Planner"
        subtitle={`${totalStudied}/${totalHours} hours completed`}
        action={<Button onClick={openAdd} icon={<RiAddLine />}>Add Subject</Button>}
      />

      {/* Overall Progress */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Overall Progress</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#3178c6' }}>
            {totalHours > 0 ? Math.round((totalStudied / totalHours) * 100) : 0}%
          </span>
        </div>
        <ProgressBar value={totalStudied} max={Math.max(totalHours, 1)} color="#3178c6" height={10} />
      </Card>

      {/* Study Chart */}
      {chartData.length > 0 && (
        <Card style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Study Hours by Subject</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="name" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 8 }} />
              <Legend />
              <Bar dataKey="studied" fill="#3178c6" />
              <Bar dataKey="remaining" fill="var(--bg-secondary)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Subjects List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        <AnimatePresence>
          {subjects.map(subject => (
            <motion.div
              key={subject.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card style={{ borderLeft: `4px solid ${subject.color}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ fontSize: 24 }}>{subject.icon}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0, flex: 1 }}>
                    {subject.name}
                  </h3>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Progress</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: subject.color }}>
                      {subject.studiedHours}/{subject.totalHours}h
                    </span>
                  </div>
                  <ProgressBar value={subject.studiedHours} max={subject.totalHours} color={subject.color} height={8} />
                </div>

                {subject.examDate && (
                  <div style={{ padding: '8px', borderRadius: 6, background: 'var(--bg-secondary)', marginBottom: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                    📅 Exam: {subject.examDate}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(subject)} style={{
                    flex: 1, padding: '6px', borderRadius: 6, border: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)', cursor: 'pointer', fontSize: 12, fontWeight: 600
                  }}>
                    <RiEditLine style={{ display: 'inline', marginRight: 4 }} /> Edit
                  </button>
                  <button onClick={() => del(subject.id)} style={{
                    flex: 1, padding: '6px', borderRadius: 6, border: '1px solid rgba(244,63,94,0.2)',
                    background: 'rgba(244,63,94,0.06)', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#f43f5e'
                  }}>
                    <RiDeleteBinLine style={{ display: 'inline', marginRight: 4 }} /> Delete
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {subjects.length === 0 && (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
            No subjects yet
          </h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Add a subject to start planning your study
          </p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editSubject ? 'Edit Subject' : 'Add New Subject'} width={480}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Subject Name *</label>
            <input className="input-field" placeholder="e.g., Mathematics" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Icon</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {icons.map(icon => (
                <button
                  key={icon}
                  onClick={() => setForm(f => ({ ...f, icon }))}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    border: form.icon === icon ? '2px solid #3178c6' : '1px solid var(--border-color)',
                    background: form.icon === icon ? 'rgba(49,120,198,0.1)' : 'var(--bg-primary)',
                    cursor: 'pointer',
                    fontSize: 20,
                    transition: 'all 0.2s'
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Color</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {colors.map(color => (
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Total Hours</label>
              <input type="number" min="1" className="input-field" value={form.totalHours} onChange={e => setForm(f => ({ ...f, totalHours: parseInt(e.target.value) || 0 }))} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Exam Date</label>
              <input type="date" className="input-field" value={form.examDate || ''} onChange={e => setForm(f => ({ ...f, examDate: e.target.value || undefined }))} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={!form.name.trim()}>Save Subject</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
