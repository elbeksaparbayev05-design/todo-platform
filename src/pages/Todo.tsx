import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useApp, Todo, useLanguage } from '../context/AppContext';
import { Badge, Button, Modal, ProgressBar, SectionHeader } from '../components/ui';
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiFilterLine, RiCheckLine } from 'react-icons/ri';

const priorities = ['low', 'medium', 'high', 'critical'] as const;
const categories = ['work', 'study', 'health', 'personal', 'other'] as const;

const translations = {
  uz: {
    title: 'Aqli Todo',
    all: 'Barchasi',
    active: 'Faol',
    completed: 'Bajarilgan',
    category: 'Kategoriya',
    filter: 'Filtr',
    noCompleted: 'Bajarilgan vazifalar yo\'q',
    allCaughtUp: 'Hamma tayyor!',
    addFirstTask: 'Boshlash uchun birinchi vazifani qo\'shish',
    changeFilter: 'Vazifalarni ko\'rish uchun filtrni o\'zgartiring',
    addTask: 'Vazifa qo\'shish',
    dailyProgress: 'Kunlik progress',
    taskTitle: 'Vazifa nomi *',
    description: 'Tavsif',
    priority: 'Muhimlik',
    dueDate: 'Yakunlash sanasi',
    cancel: 'Bekor qilish',
    saveTask: 'Saqlash',
    editTask: 'Vazifani tahrirlash',
    addNewTask: 'Yangi vazifa qo\'shish',
    overdue: 'VAQTI O\'TGAN',
    taskPlaceholder: 'Nima qilish kerak?',
    descPlaceholder: 'Batafsil ma\'lumot qo\'shing...',
    low: 'Kam',
    medium: 'O\'rta',
    high: 'Yuqori',
    critical: 'Juda Muhim',
    work: 'Ish',
    study: 'O\'qish',
    health: 'Salomatlik',
    personal: 'Shaxsiy',
    other: 'Boshqasi',
  },
  en: {
    title: 'Smart Todo',
    all: 'All',
    active: 'Active',
    completed: 'Completed',
    category: 'Category',
    filter: 'Filter',
    noCompleted: 'No completed tasks',
    allCaughtUp: 'All caught up!',
    addFirstTask: 'Add your first task to get started',
    changeFilter: 'Change the filter to see tasks',
    addTask: 'Add Task',
    dailyProgress: 'Daily Progress',
    taskTitle: 'Task Title *',
    description: 'Description',
    priority: 'Priority',
    dueDate: 'Due Date',
    cancel: 'Cancel',
    saveTask: 'Save Task',
    editTask: 'Edit Task',
    addNewTask: 'Add New Task',
    overdue: 'OVERDUE',
    taskPlaceholder: 'What needs to be done?',
    descPlaceholder: 'Add more details...',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
    work: 'Work',
    study: 'Study',
    health: 'Health',
    personal: 'Personal',
    other: 'Other',
  }
};

type Language = 'uz' | 'en';

const priorityColors: Record<string, string> = {
  low: '#10b981', medium: '#f59e0b', high: '#f97316', critical: '#f43f5e'
};
const categoryColors: Record<string, string> = {
  work: '#4f46e5', study: '#8b5cf6', health: '#10b981', personal: '#0ea5e9', other: '#94a3b8'
};
const categoryIcons: Record<string, string> = {
  work: '💼', study: '📚', health: '💚', personal: '✨', other: '📌'
};

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

const emptyTodo: Omit<Todo, 'id' | 'createdAt' | 'order'> = {
  title: '', description: '', priority: 'medium', category: 'personal', completed: false, dueDate: ''
};

export default function TodoPage() {
  const { state, dispatch } = useApp();
  const { language } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [form, setForm] = useState({ ...emptyTodo });
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  
  const t = translations[language];

  const todos = state.todos
    .filter(t => filter === 'all' ? true : filter === 'active' ? !t.completed : t.completed)
    .filter(t => categoryFilter === 'all' ? true : t.category === categoryFilter)
    .filter(t => priorityFilter === 'all' ? true : t.priority === priorityFilter)
    .sort((a, b) => a.order - b.order);

  const completed = state.todos.filter(t => t.completed).length;
  const total = state.todos.length;

  function openAdd() {
    setEditTodo(null);
    setForm({ ...emptyTodo });
    setModalOpen(true);
  }
  function openEdit(t: Todo) {
    setEditTodo(t);
    setForm({ title: t.title, description: t.description || '', priority: t.priority, category: t.category, completed: t.completed, dueDate: t.dueDate || '' });
    setModalOpen(true);
  }
  function save() {
    if (!form.title.trim()) return;
    if (editTodo) {
      dispatch({ type: 'UPDATE_TODO', payload: { ...editTodo, ...form } });
    } else {
      dispatch({ type: 'ADD_TODO', payload: { id: genId(), ...form, createdAt: new Date().toISOString().split('T')[0], order: state.todos.length } });
    }
    setModalOpen(false);
  }
  function toggle(id: string) { dispatch({ type: 'TOGGLE_TODO', payload: id }); }
  function del(id: string) { dispatch({ type: 'DELETE_TODO', payload: id }); }
  function reorder(newOrder: Todo[]) { dispatch({ type: 'REORDER_TODOS', payload: newOrder.map((t, i) => ({ ...t, order: i })) }); }

  const isOverdue = (t: Todo) => t.dueDate && !t.completed && new Date(t.dueDate) < new Date(new Date().toDateString());

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <SectionHeader
            title={t.title}
            subtitle={language === 'uz' ? `${completed} / ${total} vazifa bajarildi` : `${completed} of ${total} tasks completed`}
            action={<Button onClick={openAdd} icon={<RiAddLine />}>{t.addTask}</Button>}
          />
      </div>

      {/* Progress */}
      <div className="card" style={{ padding: '20px 24px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{t.dailyProgress}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#4f46e5' }}>{total > 0 ? Math.round((completed / total) * 100) : 0}%</span>
        </div>
        <ProgressBar value={completed} max={Math.max(total, 1)} color="#4f46e5" height={10} />
        <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
          {(['all', 'active', 'completed'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '5px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                background: filter === f ? 'rgba(79,70,229,0.12)' : 'transparent',
                color: filter === f ? '#4f46e5' : 'var(--text-muted)'
              }}>
              {t[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <RiFilterLine style={{ color: 'var(--text-muted)', fontSize: 15 }} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{t.category}:</span>
          {['all', ...categories].map(c => (
            <button key={c} onClick={() => setCategoryFilter(c)}
              style={{ padding: '4px 12px', borderRadius: 20, border: '1px solid var(--border-color)', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'inherit',
                background: categoryFilter === c ? (c === 'all' ? '#4f46e5' : categoryColors[c] || '#4f46e5') : 'var(--bg-primary)',
                color: categoryFilter === c ? '#fff' : 'var(--text-secondary)'
              }}>
              {c === 'all' ? t.all : `${categoryIcons[c]} ${c}`}
            </button>
          ))}
        </div>
      </div>

      {/* Todo list */}
      {todos.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
            {filter === 'completed' ? t.noCompleted : t.allCaughtUp}
          </h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            {filter === 'all' ? t.addFirstTask : t.changeFilter}
          </p>
          <div style={{ marginTop: 18 }}>
            <Button onClick={openAdd} icon={<RiAddLine />}>{t.addTask}</Button>
          </div>
        </div>
      ) : (
        <Reorder.Group axis="y" values={todos} onReorder={reorder} style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <AnimatePresence>
            {todos.map(todo => (
              <Reorder.Item key={todo.id} value={todo} className="todo-item" style={{ borderRadius: 16 }}>
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="card"
                  style={{
                    padding: '16px 18px',
                    borderRadius: 16,
                    borderLeft: `3px solid ${priorityColors[todo.priority]}`,
                    opacity: todo.completed ? 0.65 : 1,
                    cursor: 'default'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* <RiGripVerticalLine className="drag-handle" style={{ color: 'var(--text-muted)', fontSize: 18, cursor: 'grab' }} /> */}
                    {/* Checkbox */}
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => toggle(todo.id)}
                      style={{
                        width: 26, height: 26, borderRadius: 8, border: `2px solid ${todo.completed ? '#4f46e5' : 'var(--border-color)'}`,
                        background: todo.completed ? '#4f46e5' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s'
                      }}
                    >
                      {todo.completed && <RiCheckLine style={{ color: '#fff', fontSize: 14 }} />}
                    </motion.button>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: 14, fontWeight: 600,
                          color: 'var(--text-primary)',
                          textDecoration: todo.completed ? 'line-through' : 'none',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                        }}>
                          {todo.title}
                        </span>
                        {isOverdue(todo) && (
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#f43f5e', background: '#f43f5e18', padding: '2px 8px', borderRadius: 99 }}>{t.overdue}</span>
                        )}
                      </div>
                      {todo.description && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{todo.description}</div>}
                      <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                        <Badge color={priorityColors[todo.priority]} size="xs">{todo.priority}</Badge>
                        <Badge color={categoryColors[todo.category]} size="xs">{categoryIcons[todo.category]} {todo.category}</Badge>
                        {todo.dueDate && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>📅 {todo.dueDate}</span>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(todo)} style={{
                        width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border-color)',
                        background: 'var(--bg-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 14
                      }}><RiEditLine /></button>
                      <button onClick={() => del(todo.id)} style={{
                        width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(244,63,94,0.2)',
                        background: 'rgba(244,63,94,0.06)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f43f5e', fontSize: 14
                      }}><RiDeleteBinLine /></button>
                    </div>
                  </div>
                </motion.div>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTodo ? t.editTask : t.addNewTask} width={520}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Task Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.taskTitle}</label>
            <input 
              className="input-field" 
              placeholder={t.taskPlaceholder} 
              value={form.title} 
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              autoFocus
              style={{ fontSize: 14, fontWeight: 500 }}
            />
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.description}</label>
            <textarea 
              className="input-field" 
              placeholder={t.descPlaceholder} 
              rows={3} 
              value={form.description} 
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              style={{ resize: 'vertical', fontSize: 14 }}
            />
          </motion.div>

          {/* Priority & Category */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
          >
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.priority}</label>
              <select 
                className="input-field" 
                value={form.priority} 
                onChange={e => setForm(f => ({ ...f, priority: e.target.value as any }))}
                style={{ fontSize: 14 }}
              >
                {priorities.map(p => (
                  <option key={p} value={p}>
                    {t[p as keyof typeof t]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.category}</label>
              <select 
                className="input-field" 
                value={form.category} 
                onChange={e => setForm(f => ({ ...f, category: e.target.value as any }))}
                style={{ fontSize: 14 }}
              >
                {categories.map(c => (
                  <option key={c} value={c}>
                    {t[c as keyof typeof t]}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Due Date */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              📅 {language === 'uz' ? 'YAKUNLASH SANASI' : 'DUE DATE'}
            </label>
            <input 
              type="date" 
              className="input-field" 
              value={form.dueDate} 
              onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
              style={{ fontSize: 14 }}
            />
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border-color)' }}
          >
            <Button variant="secondary" onClick={() => setModalOpen(false)}>{t.cancel}</Button>
            <Button onClick={save} disabled={!form.title.trim()}>{t.saveTask}</Button>
          </motion.div>
        </div>
      </Modal>
    </div>
  );
}
