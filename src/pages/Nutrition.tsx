import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, MealItem, DayMeals } from '../context/AppContext';
import { Button, Modal, SectionHeader, ProgressRing, ProgressBar } from '../components/ui';
import { RiAddLine, RiDeleteBinLine, RiLeafLine } from 'react-icons/ri';

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';
const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snacks'];
const mealEmojis: Record<MealType, string> = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snacks: '🍎' };
const mealColors: Record<MealType, string> = { breakfast: '#f59e0b', lunch: '#f97316', dinner: '#8b5cf6', snacks: '#10b981' };

const suggestedFoods = [
  { name: 'Oatmeal', calories: 300, protein: 10, carbs: 54, fat: 6 },
  { name: 'Grilled Chicken', calories: 220, protein: 42, carbs: 0, fat: 5 },
  { name: 'Brown Rice', calories: 215, protein: 5, carbs: 45, fat: 2 },
  { name: 'Greek Yogurt', calories: 130, protein: 17, carbs: 9, fat: 4 },
  { name: 'Banana', calories: 89, protein: 1, carbs: 23, fat: 0 },
  { name: 'Avocado Toast', calories: 280, protein: 8, carbs: 32, fat: 14 },
  { name: 'Salmon Fillet', calories: 280, protein: 39, carbs: 0, fat: 13 },
  { name: 'Quinoa Bowl', calories: 350, protein: 12, carbs: 58, fat: 7 },
];

const vitamins = [
  { name: 'Vitamin D', emoji: '☀️', recommended: 'Sun exposure or supplement' },
  { name: 'Vitamin C', emoji: '🍊', recommended: 'Citrus fruits, bell peppers' },
  { name: 'Vitamin B12', emoji: '💊', recommended: 'Meat, eggs, dairy' },
  { name: 'Omega-3', emoji: '🐟', recommended: 'Fatty fish, flaxseeds' },
  { name: 'Magnesium', emoji: '🥜', recommended: 'Nuts, seeds, leafy greens' },
  { name: 'Iron', emoji: '🩸', recommended: 'Red meat, spinach, beans' },
];

export default function Nutrition() {
  const { state, dispatch } = useApp();
  const today = new Date().toISOString().split('T')[0];
  const [addOpen, setAddOpen] = useState(false);
  const [activeMeal, setActiveMeal] = useState<MealType>('breakfast');
  const [form, setForm] = useState({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [checkedVitamins, setCheckedVitamins] = useState<string[]>([]);

  const todayMeal: DayMeals = state.meals.find(m => m.date === today) || {
    date: today, breakfast: [], lunch: [], dinner: [], snacks: [], waterGlasses: 0
  };

  const allItems = [...todayMeal.breakfast, ...todayMeal.lunch, ...todayMeal.dinner, ...todayMeal.snacks];
  const totalCal = allItems.reduce((s, i) => s + i.calories, 0);
  const totalProtein = allItems.reduce((s, i) => s + i.protein, 0);
  const totalCarbs = allItems.reduce((s, i) => s + i.carbs, 0);
  const totalFat = allItems.reduce((s, i) => s + i.fat, 0);
  const calGoal = state.settings.calorieGoal;

  function addItem() {
    if (!form.name.trim()) return;
    const newItem: MealItem = { id: genId(), ...form };
    const updated: DayMeals = { ...todayMeal, [activeMeal]: [...todayMeal[activeMeal], newItem] };
    dispatch({ type: 'UPDATE_MEALS', payload: updated });
    setForm({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0 });
    setAddOpen(false);
  }

  function removeItem(mealType: MealType, id: string) {
    const updated: DayMeals = { ...todayMeal, [mealType]: todayMeal[mealType].filter(i => i.id !== id) };
    dispatch({ type: 'UPDATE_MEALS', payload: updated });
  }

  function useSuggestion(f: typeof suggestedFoods[0]) {
    setForm({ name: f.name, calories: f.calories, protein: f.protein, carbs: f.carbs, fat: f.fat });
  }

  return (
    <div>
      <SectionHeader title="Nutrition & Vitamins" subtitle={`${totalCal} / ${calGoal} kcal today`}
        action={<Button onClick={() => setAddOpen(true)} icon={<RiAddLine />}>Add Food</Button>} />

      {/* Macro rings */}
      <div className="card" style={{ padding: '24px', marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Daily Macros</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <ProgressBar value={totalCal} max={calGoal} color="#f43f5e" height={12} label="Calories" showLabel />
            <div style={{ marginTop: 12 }}><ProgressBar value={totalProtein} max={150} color="#4f46e5" height={8} label="Protein (g)" showLabel /></div>
            <div style={{ marginTop: 12 }}><ProgressBar value={totalCarbs} max={250} color="#f59e0b" height={8} label="Carbs (g)" showLabel /></div>
            <div style={{ marginTop: 12 }}><ProgressBar value={totalFat} max={65} color="#10b981" height={8} label="Fat (g)" showLabel /></div>
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { label: 'Calories', value: totalCal, max: calGoal, color: '#f43f5e', unit: 'kcal' },
              { label: 'Protein', value: totalProtein, max: 150, color: '#4f46e5', unit: 'g' },
              { label: 'Carbs', value: totalCarbs, max: 250, color: '#f59e0b', unit: 'g' },
              { label: 'Fat', value: totalFat, max: 65, color: '#10b981', unit: 'g' },
            ].map(m => (
              <div key={m.label} style={{ textAlign: 'center' }}>
                <ProgressRing value={m.value} max={m.max} size={80} strokeWidth={7} color={m.color}
                  label={`${m.value}`} sublabel={m.unit} />
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginTop: 6 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meal sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
        {mealTypes.map(meal => {
          const items = todayMeal[meal];
          const mealCal = items.reduce((s, i) => s + i.calories, 0);
          return (
            <div key={meal} className="card" style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{mealEmojis[meal]} {meal.charAt(0).toUpperCase() + meal.slice(1)}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{mealCal} kcal · {items.length} items</div>
                </div>
                <button onClick={() => { setActiveMeal(meal); setAddOpen(true); }}
                  style={{ width: 28, height: 28, borderRadius: 8, border: `1.5px solid ${mealColors[meal]}40`, background: `${mealColors[meal]}12`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: mealColors[meal], fontSize: 15 }}>
                  <RiAddLine />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <AnimatePresence>
                  {items.map(item => (
                    <motion.div key={item.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 10, background: 'var(--bg-primary)' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.calories} kcal · P:{item.protein}g C:{item.carbs}g F:{item.fat}g</div>
                      </div>
                      <button onClick={() => removeItem(meal, item.id)} style={{ width: 22, height: 22, borderRadius: 5, border: 'none', background: 'rgba(244,63,94,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f43f5e', fontSize: 11, flexShrink: 0 }}>
                        <RiDeleteBinLine />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {items.length === 0 && <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '10px 0' }}>No items yet</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Vitamins */}
      <div className="card" style={{ padding: '22px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <RiLeafLine style={{ fontSize: 18, color: '#10b981' }} />
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Vitamin & Supplement Checklist</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
          {vitamins.map(v => {
            const checked = checkedVitamins.includes(v.name);
            return (
              <motion.div key={v.name} whileHover={{ scale: 1.02 }} onClick={() => setCheckedVitamins(c => checked ? c.filter(x => x !== v.name) : [...c, v.name])}
                style={{ padding: '12px 14px', borderRadius: 12, cursor: 'pointer', border: `1.5px solid ${checked ? '#10b981' : 'var(--border-color)'}`, background: checked ? 'rgba(16,185,129,0.06)' : 'var(--bg-primary)', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{v.emoji}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: checked ? '#10b981' : 'var(--text-primary)', textDecoration: checked ? 'line-through' : 'none' }}>{v.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{v.recommended}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Add Food Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title={`Add to ${activeMeal}`} width={500}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Meal type selector */}
          <div style={{ display: 'flex', gap: 6 }}>
            {mealTypes.map(m => (
              <button key={m} onClick={() => setActiveMeal(m)}
                style={{ flex: 1, padding: '7px 8px', borderRadius: 10, border: `1.5px solid ${activeMeal === m ? mealColors[m] : 'var(--border-color)'}`, background: activeMeal === m ? `${mealColors[m]}12` : 'var(--bg-primary)', color: activeMeal === m ? mealColors[m] : 'var(--text-muted)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                {mealEmojis[m]}
              </button>
            ))}
          </div>
          {/* Quick suggestions */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>QUICK ADD</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {suggestedFoods.slice(0, 6).map(f => (
                <button key={f.name} onClick={() => useSuggestion(f)}
                  style={{ padding: '5px 12px', borderRadius: 20, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                  {f.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Food Name *</label>
            <input className="input-field" placeholder="e.g. Grilled Chicken" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {(['calories', 'protein', 'carbs', 'fat'] as const).map(macro => (
              <div key={macro}>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5, textTransform: 'capitalize' }}>{macro}</label>
                <input type="number" className="input-field" value={form[macro]} min={0}
                  onChange={e => setForm(f => ({ ...f, [macro]: +e.target.value }))} style={{ padding: '8px 10px' }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={addItem} disabled={!form.name.trim()}>Add Food</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
