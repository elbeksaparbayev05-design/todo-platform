import { useState, useContext } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DarkModeContext, useApp } from '../context/AppContext';
import {
  RiDashboardLine, RiTodoLine, RiCalendarLine, RiHeart3Line,
  RiLeafLine, RiMentalHealthLine, RiBookOpenLine, RiBarChartLine,
  RiSettings3Line, RiRobot2Line, RiMenuLine, RiCloseLine,
  RiMoonLine, RiSunLine, RiBellLine, RiSparklingLine
} from 'react-icons/ri';

const navItems = [
  { path: '/', icon: RiDashboardLine, label: 'Dashboard' },
  { path: '/todo', icon: RiTodoLine, label: 'Todo' },
  { path: '/schedule', icon: RiCalendarLine, label: 'Schedule' },
  { path: '/habits', icon: RiSparklingLine, label: 'Habits' },
  { path: '/nutrition', icon: RiLeafLine, label: 'Nutrition' },
  { path: '/health', icon: RiHeart3Line, label: 'Health' },
  { path: '/study', icon: RiBookOpenLine, label: 'Study' },
  { path: '/statistics', icon: RiBarChartLine, label: 'Statistics' },
  { path: '/ai', icon: RiRobot2Line, label: 'AI Assistant' },
  { path: '/settings', icon: RiSettings3Line, label: 'Settings' },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { state } = useApp();
  const location = useLocation();

  const currentPage = navItems.find(n => n.path === location.pathname)?.label || 'LifeFlow';

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
              zIndex: 35, backdropFilter: 'blur(4px)'
            }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div style={{ padding: '24px 20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(79,70,229,0.35)'
            }}>
              <span style={{ fontSize: 18 }}>⚡</span>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>LifeFlow</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>Productivity Suite</div>
            </div>
          </div>

          {/* User card */}
          <div style={{
            padding: '12px 14px', borderRadius: 14, marginBottom: 24,
            background: 'linear-gradient(135deg, rgba(79,70,229,0.1), rgba(124,58,237,0.08))',
            border: '1px solid rgba(79,70,229,0.15)',
            display: 'flex', alignItems: 'center', gap: 10
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 700, color: '#fff', flexShrink: 0
            }}>
              {state.settings.name.charAt(0)}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {getGreeting()}, {state.settings.name}!
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Premium Member</div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 8 }}>
              MAIN MENU
            </div>
            {navItems.slice(0, 8).map(item => (
              <SidebarLink key={item.path} {...item} onClick={() => setSidebarOpen(false)} />
            ))}
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '16px 0 8px', paddingLeft: 8 }}>
              OTHER
            </div>
            {navItems.slice(8).map(item => (
              <SidebarLink key={item.path} {...item} onClick={() => setSidebarOpen(false)} />
            ))}
          </nav>

          {/* Bottom actions */}
          <div style={{ paddingTop: 16, borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={toggleDarkMode}
              style={{
                width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border-color)',
                background: 'var(--bg-primary)', color: 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: 16, transition: 'all 0.2s'
              }}
            >
              {darkMode ? <RiSunLine /> : <RiMoonLine />}
            </button>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>v1.0.0</div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="main-content">
        {/* Top header */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 30,
          padding: '0 24px',
          height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-color)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              onClick={() => setSidebarOpen(s => !s)}
              className="lg-hide"
              style={{
                width: 36, height: 36, borderRadius: 10,
                border: '1px solid var(--border-color)',
                background: 'var(--bg-primary)', color: 'var(--text-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: 18
              }}
            >
              {sidebarOpen ? <RiCloseLine /> : <RiMenuLine />}
            </button>
            <div>
              <h1 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>{currentPage}</h1>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button style={{
              width: 36, height: 36, borderRadius: 10,
              border: '1px solid var(--border-color)', background: 'var(--bg-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 18, position: 'relative'
            }}>
              <RiBellLine />
              <span style={{
                position: 'absolute', top: 6, right: 6, width: 7, height: 7,
                borderRadius: '50%', background: '#f43f5e',
                border: '1.5px solid var(--bg-primary)'
              }} />
            </button>
            <button
              onClick={toggleDarkMode}
              style={{
                width: 36, height: 36, borderRadius: 10,
                border: '1px solid var(--border-color)', background: 'var(--bg-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 18
              }}
            >
              {darkMode ? <RiSunLine /> : <RiMoonLine />}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main style={{ padding: '28px 24px', maxWidth: 1280, margin: '0 auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ path, icon: Icon, label, onClick }: {
  path: string; icon: React.ElementType; label: string; onClick?: () => void
}) {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      end={path === '/'}
      style={({ isActive }) => ({
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 12px', borderRadius: 12,
        marginBottom: 3, textDecoration: 'none',
        fontWeight: isActive ? 600 : 500, fontSize: 13.5,
        color: isActive ? '#4f46e5' : 'var(--text-secondary)',
        background: isActive ? 'rgba(79,70,229,0.1)' : 'transparent',
        border: isActive ? '1px solid rgba(79,70,229,0.15)' : '1px solid transparent',
        transition: 'all 0.2s ease',
      })}
    >
      {({ isActive }) => (
        <>
          <div style={{
            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: isActive ? 'rgba(79,70,229,0.15)' : 'transparent',
            fontSize: 16, color: isActive ? '#4f46e5' : 'var(--text-muted)',
            transition: 'all 0.2s'
          }}>
            <Icon />
          </div>
          {label}
          {isActive && (
            <div style={{
              marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%',
              background: '#4f46e5'
            }} />
          )}
        </>
      )}
    </NavLink>
  );
}
