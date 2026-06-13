import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, ScheduleBlock } from '../context/AppContext';
import { Button, Modal, SectionHeader, Badge } from '../components/ui';
import { RiAddLine, RiDeleteBinLine, RiEditLine, RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { format, addDays, subDays, parseISO } from 'date-fns';

const blockTypes = ['work', 'study', 'break', 'exercise', 'meal', 'sleep', 'personal'] as const;
const typeColors: Record<string, string> = {
  work: '#4f46e5', study: '#f59e0b', break: '#10b981',
  exercise: '#f43f5e', meal: '#0ea5e9', sleep: '#8b5cf6', personal: '#6366f1',
};
const typeEmojis: Record<string, string> = {
  work: '💼', study: '📚', break: '☕', exercise: '💪', meal: '🍽️', sleep: '😴', personal: '✨',
};

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6–23

function timeToMinutes(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}
function minutesToPx(m: number, pxPerHour = 64) {
  return ((m - 360) / 60) * pxPerHour; // offset from 6:00
}
function durationPx(start: string, end: string, pxPerHour = 64) {
  return ((timeToMinutes(end) - timeToMinutes(start)) / 60) * pxPerHour;
}

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

export default function Schedule() {
  const { state, dispatch } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBlock, setEditBlock] = useState<ScheduleBlock | null>(null);
  const [form, setForm] = useState({ title: '', startTime: '09:00', endTime: '10:00', type: 'work' as typeof blockTypes[number] });

  const dayBlocks = state.scheduleBlocks
    .filter(b => b.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  function openAdd() {
    setEditBlock(null);
    setForm({ title: '', startTime: '09:00', endTime: '10:00', type: 'work' });
    setModalOpen(true);
  }
  function openEdit(b: ScheduleBlock) {
    setEditBlock(b);
    setForm({ title: b.title, startTime: b.startTime, endTime: b.endTime, type: b.type as any });
    setModalOpen(true);
  }
  function save() {
    if (!form.title.trim()) return;
    const payload: ScheduleBlock = {
      id: editBlock?.id || genId(),
      date: selectedDate, color: typeColors[form.type], ...form
    };
    dispatch({ type: editBlock ? 'UPDATE_SCHEDULE_BLOCK' : 'ADD_SCHEDULE_BLOCK', payload });
    setModalOpen(false);
  }
  function del(id: string) { dispatch({ type: 'DELETE_SCHEDULE_BLOCK', payload: id }); }

  const PX_PER_HOUR = 72;
  const totalHeight = HOURS.length * PX_PER_HOUR;
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const nowY = minutesToPx(nowMinutes, PX_PER_HOUR);
  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div>
      <SectionHeader
        title="Daily Schedule"
        subtitle={`${dayBlocks.length} time blocks for ${format(parseISO(selectedDate), 'EEEE, MMM d')}`}
        action={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={() => setSelectedDate(d => subDays(new Date(d), 1).toISOString().split('T')[0])}
              style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              <RiArrowLeftSLine />
            </button>
            <button onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'inherit' }}>Today</button>
            <button onClick={() => setSelectedDate(d => addDays(new Date(d), 1).toISOString().split('T')[0])}
              style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              <RiArrowRightSLine />
            </button>
            <Button onClick={openAdd} icon={<RiAddLine />}>Add Block</Button>
          </div>
        }
      />

      {/* Type legend */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {blockTypes.map(t => (
          <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 20, background: `${typeColors[t]}15`, border: `1px solid ${typeColors[t]}30`, fontSize: 12, fontWeight: 500, color: typeColors[t] }}>
            {typeEmojis[t]} {t}
          </span>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
        {/* Timeline */}
        <div className="card" style={{ padding: '20px', overflow: 'auto' }}>
          <div style={{ position: 'relative', height: totalHeight }}>
            {/* Hour lines */}
            {HOURS.map(h => (
              <div key={h} style={{
                position: 'absolute', top: (h - 6) * PX_PER_HOUR,
                left: 0, right: 0, display: 'flex', alignItems: 'center', gap: 12
              }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', width: 44, flexShrink: 0, textAlign: 'right' }}>
                  {h.toString().padStart(2, '0')}:00
                </span>
                <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
              </div>
            ))}

            {/* Current time line */}
            {isToday && nowY >= 0 && nowY <= totalHeight && (
              <div style={{ position: 'absolute', top: nowY, left: 56, right: 0, zIndex: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f43f5e' }} />
                <div style={{ flex: 1, height: 2, background: '#f43f5e', borderRadius: 99 }} />
              </div>
            )}

            {/* Schedule blocks */}
            <div style={{ position: 'absolute', top: 0, left: 56, right: 0, bottom: 0 }}>
              {dayBlocks.map(block => {
                const top = minutesToPx(timeToMinutes(block.startTime), PX_PER_HOUR);
                const height = Math.max(durationPx(block.startTime, block.endTime, PX_PER_HOUR), 32);
                return (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      position: 'absolute', left: 8, right: 8,
                      top, height,
                      background: `${typeColors[block.type]}18`,
                      border: `1.5px solid ${typeColors[block.type]}50`,
                      borderLeft: `4px solid ${typeColors[block.type]}`,
                      borderRadius: 10, padding: '6px 10px',
                      cursor: 'pointer', overflow: 'hidden'
                    }}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => openEdit(block)}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700, color: typeColors[block.type] }}>
                      {typeEmojis[block.type]} {block.title}
                    </div>
                    {height > 36 && (
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                        {block.startTime} – {block.endTime}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Block list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="card" style={{ padding: '18px 20px', marginBottom: 4 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Summary</div>
            {blockTypes.map(type => {
              const typeBlocks = dayBlocks.filter(b => b.type === type);
              const totalMin = typeBlocks.reduce((sum, b) => sum + (timeToMinutes(b.endTime) - timeToMinutes(b.startTime)), 0);
              if (totalMin === 0) return null;
              return (
                <div key={type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{typeEmojis[type]} {type}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: typeColors[type] }}>{Math.floor(totalMin / 60)}h {totalMin % 60}m</span>
                </div>
              );
            })}
            {dayBlocks.length === 0 && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>No blocks yet</p>}
          </div>

          <AnimatePresence>
            {dayBlocks.map(block => (
              <motion.div key={block.id} className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{typeEmojis[block.type]} {block.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{block.startTime} – {block.endTime}</div>
                    <Badge color={typeColors[block.type]} size="xs">{block.type}</Badge>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => openEdit(block)} style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}><RiEditLine /></button>
                    <button onClick={() => del(block.id)} style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid rgba(244,63,94,0.2)', background: 'rgba(244,63,94,0.06)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f43f5e', fontSize: 13 }}><RiDeleteBinLine /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editBlock ? 'Edit Block' : 'Add Time Block'} width={440}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Title *</label>
            <input className="input-field" placeholder="What are you doing?" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Start Time</label>
              <input type="time" className="input-field" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>End Time</label>
              <input type="time" className="input-field" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Type</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {blockTypes.map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                  style={{ padding: '6px 14px', borderRadius: 20, border: `1.5px solid ${form.type === t ? typeColors[t] : 'var(--border-color)'}`, background: form.type === t ? `${typeColors[t]}15` : 'var(--bg-primary)', color: form.type === t ? typeColors[t] : 'var(--text-muted)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                  {typeEmojis[t]} {t}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            {editBlock && <Button variant="danger" onClick={() => { del(editBlock.id); setModalOpen(false); }}>Delete</Button>}
            <Button onClick={save} disabled={!form.title.trim()}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
