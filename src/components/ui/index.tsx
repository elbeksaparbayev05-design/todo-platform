// Shared UI components barrel export

// ─── ProgressRing ─────────────────────────────────────────────────────────────
export function ProgressRing({
  value, max = 100, size = 80, strokeWidth = 8, color = '#4f46e5',
  trackColor, label, sublabel, children
}: {
  value: number; max?: number; size?: number; strokeWidth?: number;
  color?: string; trackColor?: string; label?: string; sublabel?: string;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const offset = circumference * (1 - pct);

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} className="progress-ring">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={trackColor || 'var(--border-color)'}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 6px ${color}55)` }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center'
      }}>
        {children || (
          <>
            {label && <div style={{ fontSize: size < 80 ? 13 : 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>{label}</div>}
            {sublabel && <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>{sublabel}</div>}
          </>
        )}
      </div>
    </div>
  );
}

// ─── ProgressBar ──────────────────────────────────────────────────────────────
export function ProgressBar({
  value, max = 100, color = '#4f46e5', height = 8, radius = 99, showLabel = false, label
}: {
  value: number; max?: number; color?: string; height?: number; radius?: number;
  showLabel?: boolean; label?: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ width: '100%' }}>
      {(showLabel || label) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          {label && <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>}
          {showLabel && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{Math.round(pct)}%</span>}
        </div>
      )}
      <div style={{
        width: '100%', height, borderRadius: radius,
        background: 'var(--border-color)', overflow: 'hidden'
      }}>
        <div style={{
          width: `${pct}%`, height: '100%', borderRadius: radius,
          background: color,
          transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: `0 2px 8px ${color}55`
        }} />
      </div>
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
import { motion } from 'framer-motion';
import React from 'react';

export function StatCard({ title, value, unit, icon, color = '#4f46e5', trend, subtitle, gradient }: {
  title: string; value: string | number; unit?: string;
  icon?: React.ReactNode; color?: string; trend?: number;
  subtitle?: string; gradient?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: 'var(--shadow-lg)' }}
      className="card"
      style={{ padding: '20px 22px' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            {title}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</span>
            {unit && <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{unit}</span>}
          </div>
          {subtitle && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{subtitle}</div>}
        </div>
        {icon && (
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: gradient || `linear-gradient(135deg, ${color}22, ${color}11)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, border: `1px solid ${color}25`, color
          }}>
            {icon}
          </div>
        )}
      </div>
      {trend !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: trend >= 0 ? '#10b981' : '#f43f5e' }}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>vs yesterday</span>
        </div>
      )}
    </motion.div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ children, color = '#4f46e5', size = 'sm' }: {
  children: React.ReactNode; color?: string; size?: 'xs' | 'sm' | 'md';
}) {
  const sizes = { xs: { padding: '1px 7px', fontSize: 10 }, sm: { padding: '3px 10px', fontSize: 11 }, md: { padding: '4px 12px', fontSize: 12 } };
  return (
    <span className="badge" style={{
      ...sizes[size],
      background: `${color}18`,
      color,
      border: `1px solid ${color}30`,
    }}>
      {children}
    </span>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────
export function Button({ children, onClick, variant = 'primary', size = 'md', disabled, style: extraStyle, icon }: {
  children?: React.ReactNode; onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg'; disabled?: boolean;
  style?: React.CSSProperties; icon?: React.ReactNode;
}) {
  const variants = {
    primary: { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', border: 'none', boxShadow: '0 4px 14px rgba(79,70,229,0.35)' },
    secondary: { background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1.5px solid var(--border-color)' },
    ghost: { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid transparent' },
    danger: { background: 'linear-gradient(135deg, #e11d48, #f43f5e)', color: '#fff', border: 'none' },
  };
  const sizes = {
    sm: { padding: '7px 14px', fontSize: 12, borderRadius: 10 },
    md: { padding: '10px 20px', fontSize: 13.5, borderRadius: 12 },
    lg: { padding: '13px 28px', fontSize: 15, borderRadius: 14 },
  };
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={disabled ? undefined : onClick}
      style={{
        ...variants[variant], ...sizes[size],
        fontFamily: 'inherit', fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1, display: 'inline-flex', alignItems: 'center',
        gap: 7, transition: 'all 0.2s', ...extraStyle
      }}
    >
      {icon && <span style={{ fontSize: '1.1em' }}>{icon}</span>}
      {children}
    </motion.button>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
import { AnimatePresence } from 'framer-motion';
import ReactDOM from 'react-dom';

export function Modal({ open, onClose, title, children, width = 500 }: {
  open: boolean; onClose: () => void; title?: string;
  children: React.ReactNode; width?: number;
}) {
  if (!open) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              zIndex: 9998
            }}
          />

          {/* Content container - centered */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              pointerEvents: 'none'
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                pointerEvents: 'auto',
                width: typeof window !== 'undefined' ? Math.min(width, window.innerWidth - 40) : width,
                maxHeight: '90vh',
                background: 'var(--bg-secondary)',
                borderRadius: 24,
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-color)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Header */}
              {title && (
                <div
                  style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexShrink: 0
                  }}
                >
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Body - scrollable */}
              <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, style, hover = true, padding = 24, onClick }: {
  children: React.ReactNode; style?: React.CSSProperties; hover?: boolean;
  padding?: number; onClick?: () => void;
}) {
  return (
    <motion.div
      className="card"
      whileHover={hover ? { y: -2, boxShadow: 'var(--shadow-lg)' } : undefined}
      onClick={onClick}
      style={{ padding, cursor: onClick ? 'pointer' : undefined, ...style }}
    >
      {children}
    </motion.div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action }: {
  title: string; subtitle?: string; action?: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 3, letterSpacing: '-0.02em' }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
