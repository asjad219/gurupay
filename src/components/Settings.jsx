import React, { useEffect, useMemo, useState } from 'react';

const tokens = {
  bgBase: '#0E0F17',
  bgSurface: '#16182A',
  bgElevated: '#1E2038',
  bgHighlight: '#252847',
  primary: '#10a34a',
  primaryGlow: 'rgba(16,163,74,0.20)',
  accentPurple: '#7C6FFF',
  accentBlue: '#3B9EFF',
  accentOrange: '#FF8C42',
  accentTeal: '#2DD4BF',
  accentRed: '#FF5E5E',
  textPrimary: '#F0F1FA',
  textSecondary: '#8B8FA8',
  textMuted: '#4B4F6B',
  border: 'rgba(255,255,255,0.06)',
  borderActive: 'rgba(16,163,74,0.40)',
};

const IconBack = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const IconSun = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M22 12h-2M4 12H2M19.07 4.93l-1.41 1.41M6.34 17.66l-1.41 1.41M19.07 19.07l-1.41-1.41M6.34 6.34L4.93 4.93" />
  </svg>
);

const IconMoon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1111.2 3 7 7 0 0021 12.79z" />
  </svg>
);

const IconChevron = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 6l6 6-6 6" />
  </svg>
);

const IconBuilding = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01" />
  </svg>
);

const IconSliders = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 6h16M7 6v8M4 18h16M17 18v-8" />
  </svg>
);

const IconPalette = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3a9 9 0 100 18c1.7 0 2.2-.8 2.2-1.7 0-.8-.5-1.5-.5-2.3 0-1.1.9-2 2-2h1.4A4.9 4.9 0 0022 10 7 7 0 0015 3h-3z" />
  </svg>
);

const IconShield = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3l7 3v6c0 5-3.4 8.8-7 10-3.6-1.2-7-5-7-10V6l7-3z" />
  </svg>
);

const IconDatabase = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <ellipse cx="12" cy="5" rx="8" ry="3" />
    <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
  </svg>
);

const IconInfo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

const IconPencil = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 20h9" />
    <path d="M16.5 3.5l4 4L7 21l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const navIcons = {
  dashboard: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  fee: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v20M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  ),
  batches: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 11h10M7 15h10M9 7h6" />
      <rect x="4" y="4" width="16" height="16" rx="3" />
    </svg>
  ),
  reports: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 20V10M12 20V4M20 20v-7" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 01-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 010-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 012.8-2.8l.1.1a1.7 1.7 0 001.8.3h.1a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5h.1a1.7 1.7 0 001.8-.3l.1-.1a2 2 0 012.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8v.1a1.7 1.7 0 001.5 1H21a2 2 0 010 4h-.1a1.7 1.7 0 00-1.5 1z" />
    </svg>
  ),
};

const Settings = ({ profile: externalProfile, setProfile: setExternalProfile, theme, setTheme }) => {
  const [activeSection, setActiveSection] = useState('business');
  const [editMode, setEditMode] = useState(false);
  const [activeNav, setActiveNav] = useState('settings');
  const [isMounted, setIsMounted] = useState(false);
  const [profile, setProfile] = useState({
    businessName: 'Sri Balaji Coaching Academy',
    gstin: '29ABCDE1234F1Z5',
    address: '12, MG Road, Bengaluru – 560001',
    phone: '9876543210',
    email: 'balaji@coaching.in',
    upiId: 'balaji@okaxis',
  });

  useEffect(() => {
    setIsMounted(true);
    if (externalProfile) {
      setProfile((prev) => ({
        ...prev,
        businessName: externalProfile.name || prev.businessName,
        gstin: externalProfile.gstin || prev.gstin,
        address: externalProfile.address || prev.address,
        phone: externalProfile.phone || prev.phone,
        email: externalProfile.email || prev.email,
        upiId: externalProfile.upiId || prev.upiId,
      }));
    }
  }, [externalProfile]);

  const sections = useMemo(
    () => [
      { id: 'business', label: 'Business Profile', sub: 'Legal and billing identity', color: '#10a34a', icon: <IconBuilding /> },
      { id: 'features', label: 'Feature Settings', sub: 'Controls and product modules', color: '#3B9EFF', icon: <IconSliders /> },
      { id: 'appearance', label: 'Appearance', sub: 'Theme and visual behaviour', color: '#2DD4BF', icon: <IconPalette /> },
      { id: 'auth', label: 'Authentication', sub: 'Security and access controls', color: '#7C6FFF', icon: <IconShield /> },
      { id: 'data', label: 'Data Management', sub: 'Backups and exports', color: '#FF8C42', icon: <IconDatabase /> },
      { id: 'about', label: 'About', sub: 'Version and legal information', color: '#8B8FA8', icon: <IconInfo /> },
    ],
    []
  );

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'fee', label: 'Fee' },
    { id: 'batches', label: 'Batches' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' },
  ];

  const activeIndex = navItems.findIndex((n) => n.id === activeNav);

  const handleSave = () => {
    setEditMode(false);
    if (setExternalProfile) {
      setExternalProfile({
        name: profile.businessName,
        gstin: profile.gstin,
        address: profile.address,
        phone: profile.phone,
        email: profile.email,
        upiId: profile.upiId,
      });
    }
  };

  const isDarkTheme = theme === 'dark';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');

        .gp-settings * { box-sizing: border-box; }
        .gp-settings {
          min-height: 100vh;
          background: ${tokens.bgBase};
          color: ${tokens.textPrimary};
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: flex;
          justify-content: center;
        }
        .gp-shell {
          width: 100%;
          max-width: 420px;
          min-height: 100vh;
          position: relative;
          padding: 0 16px 90px;
          background: ${tokens.bgBase};
          overflow: hidden;
        }
        .gp-shell::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.25) 0.55px, transparent 0.55px);
          background-size: 16px 16px;
          opacity: 0.03;
          pointer-events: none;
          z-index: 0;
        }
        .stagger {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 400ms ease-out, transform 400ms ease-out;
          position: relative;
          z-index: 1;
        }
        .stagger.show { opacity: 1; transform: translateY(0); }
        .mesh {
          background: linear-gradient(135deg, rgba(16,163,74,0.16), rgba(124,111,255,0.14), rgba(59,158,255,0.12));
          background-size: 200% 200%;
          animation: meshShift 8s ease infinite;
        }
        @keyframes meshShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .row-item { transition: background 180ms ease, transform 180ms ease; }
        .row-item:hover { background: ${tokens.bgHighlight} !important; transform: translateX(2px); }
        .left-rail {
          transform: scaleY(0);
          transform-origin: top;
          transition: transform 200ms ease;
        }
        .row-item.active .left-rail { transform: scaleY(1); }
        .save-mount { animation: slideMount 240ms ease forwards; }
        @keyframes slideMount {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .pulse { animation: pulseIn 320ms ease; }
        @keyframes pulseIn {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
      `}</style>

      <div className="gp-settings">
        <div className="gp-shell">
          <header
            className={`stagger ${isMounted ? 'show' : ''}`}
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 50,
              paddingTop: 14,
              paddingBottom: 14,
              backdropFilter: 'blur(16px)',
              background: 'rgba(14,15,23,0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button
                style={{
                  border: `1px solid ${tokens.border}`,
                  background: tokens.bgElevated,
                  color: tokens.textSecondary,
                  width: 34,
                  height: 34,
                  borderRadius: 999,
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <IconBack />
              </button>
              <div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 26, lineHeight: 1 }}>Settings</div>
                <div style={{ fontSize: 12, color: tokens.textMuted }}>GuruPay Pro</div>
              </div>
            </div>
            <button
              onClick={() => setTheme && setTheme(isDarkTheme ? 'light' : 'dark')}
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                border: `1px solid ${tokens.border}`,
                color: tokens.textSecondary,
                background: tokens.bgElevated,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              {isDarkTheme ? <IconSun /> : <IconMoon />}
            </button>
          </header>

          <section
            className={`stagger mesh ${isMounted ? 'show' : ''}`}
            style={{
              transitionDelay: '100ms',
              marginTop: 12,
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 28,
              padding: 20,
              boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
              backdropFilter: 'blur(20px)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: 'linear-gradient(135deg, #10a34a, #7C6FFF)',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 700,
                  }}
                >
                  S
                </div>
                <div style={{ marginTop: 10, fontSize: 13, fontWeight: 600 }}>{profile.email}</div>
                <div style={{ marginTop: 2, fontSize: 11, color: tokens.textSecondary }}>PRO Account</div>
              </div>
              <div
                style={{
                  borderRadius: 999,
                  padding: '6px 12px',
                  border: '1px solid transparent',
                  background: 'linear-gradient(#16182A, #16182A) padding-box, linear-gradient(135deg, #10a34a, #7C6FFF) border-box',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                PRO ✦
              </div>
            </div>
            <div style={{ marginTop: 16, fontSize: 12, color: tokens.textSecondary }}>
              <span>12 Batches</span>
              <span style={{ margin: '0 8px' }}>·</span>
              <span>340 Students</span>
              <span style={{ margin: '0 8px' }}>·</span>
              <span>₹2.4L Revenue</span>
            </div>
          </section>

          <section className={`stagger ${isMounted ? 'show' : ''}`} style={{ transitionDelay: '200ms', marginTop: 18 }}>
            <div style={{ fontSize: 10, letterSpacing: 1.2, color: tokens.textMuted, fontWeight: 700, marginBottom: 10 }}>PREFERENCES</div>
            <div
              style={{
                background: tokens.bgSurface,
                border: `1px solid ${tokens.border}`,
                borderRadius: 22,
                boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                overflow: 'hidden',
              }}
            >
              {sections.map((section, idx) => {
                const active = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    className={`row-item ${active ? 'active' : ''}`}
                    onClick={() => setActiveSection(section.id)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: active ? 'rgba(16,163,74,0.08)' : 'transparent',
                      border: 'none',
                      borderBottom: idx === sections.length - 1 ? 'none' : `1px solid ${tokens.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      position: 'relative',
                      textAlign: 'left',
                    }}
                  >
                    <div className="left-rail" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: tokens.primary }} />
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        color: section.color,
                        background: `${section.color}26`,
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {section.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: active ? tokens.primary : tokens.textPrimary }}>{section.label}</div>
                      <div style={{ fontSize: 11, color: tokens.textSecondary }}>{section.sub}</div>
                    </div>
                    <div style={{ color: active ? tokens.primary : tokens.textMuted }}>
                      <IconChevron />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className={`stagger ${isMounted ? 'show' : ''}`} style={{ transitionDelay: '300ms', marginTop: 18 }}>
            <div
              style={{
                background: tokens.bgSurface,
                border: `1px solid ${tokens.border}`,
                borderRadius: 22,
                boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                padding: 20,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      color: tokens.primary,
                      background: 'rgba(16,163,74,0.15)',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <IconBuilding />
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>Business Profile</div>
                    <div style={{ fontSize: 12, color: tokens.textSecondary }}>Coaching center details</div>
                  </div>
                </div>
                <button
                  onClick={() => (editMode ? handleSave() : setEditMode(true))}
                  style={{
                    height: 36,
                    borderRadius: 999,
                    padding: '0 12px',
                    border: editMode ? 'none' : `1px solid ${tokens.border}`,
                    background: editMode ? 'linear-gradient(135deg,#10a34a,#059669)' : 'transparent',
                    color: editMode ? '#fff' : tokens.textSecondary,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    fontWeight: 600,
                    transition: 'all .2s ease',
                  }}
                >
                  {editMode ? <IconCheck /> : <IconPencil />}
                  {editMode ? 'Save' : 'Edit'}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field
                  label="Business Name *"
                  value={profile.businessName}
                  disabled={!editMode}
                  onChange={(v) => setProfile((p) => ({ ...p, businessName: v }))}
                />
                <Field
                  label="GSTIN"
                  value={profile.gstin}
                  disabled={!editMode}
                  mono
                  onChange={(v) => setProfile((p) => ({ ...p, gstin: v }))}
                />
                <Field
                  label="Address"
                  value={profile.address}
                  disabled={!editMode}
                  textarea
                  full
                  onChange={(v) => setProfile((p) => ({ ...p, address: v }))}
                />
                <Field
                  label="Phone"
                  value={profile.phone}
                  disabled={!editMode}
                  onChange={(v) => setProfile((p) => ({ ...p, phone: v }))}
                />
                <Field
                  label="Email"
                  value={profile.email}
                  disabled={!editMode}
                  onChange={(v) => setProfile((p) => ({ ...p, email: v }))}
                />
                <Field
                  label="UPI ID"
                  value={profile.upiId}
                  disabled={!editMode}
                  mono
                  full
                  onChange={(v) => setProfile((p) => ({ ...p, upiId: v }))}
                />
              </div>

              {editMode && (
                <button
                  className="save-mount pulse"
                  onClick={handleSave}
                  style={{
                    marginTop: 14,
                    width: '100%',
                    height: 52,
                    borderRadius: 16,
                    border: 'none',
                    background: 'linear-gradient(135deg, #10a34a, #059669)',
                    boxShadow: '0 8px 32px rgba(16,163,74,0.35)',
                    color: '#fff',
                    fontFamily: 'Syne, sans-serif',
                    fontSize: 15,
                    fontWeight: 700,
                  }}
                >
                  Save Changes
                </button>
              )}
            </div>
          </section>

          <nav
            style={{
              position: 'fixed',
              bottom: 0,
              width: '100%',
              maxWidth: 420,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(14,15,23,0.95)',
              backdropFilter: 'blur(20px)',
              borderTop: `1px solid ${tokens.border}`,
              paddingTop: 10,
              paddingBottom: 20,
              display: 'flex',
              justifyContent: 'space-evenly',
              zIndex: 60,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 12,
                left: `calc(${(activeIndex * 100) / navItems.length}% + ${(100 / navItems.length) / 2}%)`,
                width: 40,
                height: 20,
                borderRadius: 999,
                background: tokens.primaryGlow,
                transform: 'translateX(-50%)',
                transition: 'left .3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            />
            {navItems.map((item) => {
              const active = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: active ? tokens.primary : tokens.textMuted,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    minWidth: 56,
                    position: 'relative',
                  }}
                >
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    {navIcons[item.id]}
                    {item.id === 'fee' && (
                      <div
                        style={{
                          position: 'absolute',
                          top: -7,
                          right: -10,
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          background: tokens.accentRed,
                          color: '#fff',
                          fontSize: 9,
                          fontWeight: 700,
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        3
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 10, color: active ? tokens.primary : tokens.textMuted, fontWeight: active ? 700 : 500 }}>{item.label}</span>
                  {active && <span style={{ width: 4, height: 4, borderRadius: 999, background: tokens.primary }} />}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

const Field = ({ label, value, onChange, disabled, full, textarea, mono }) => {
  return (
    <label style={{ gridColumn: full ? '1 / -1' : 'auto', display: 'block' }}>
      <div style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: tokens.textSecondary, marginBottom: 6, fontWeight: 600 }}>{label}</div>
      {textarea ? (
        <textarea
          rows={2}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          style={{
            width: '100%',
            resize: 'none',
            background: tokens.bgElevated,
            border: `1.5px solid ${disabled ? tokens.border : tokens.borderActive}`,
            borderRadius: 16,
            padding: '12px 14px',
            fontSize: 14,
            color: tokens.textPrimary,
            outline: 'none',
            boxShadow: disabled ? 'none' : `0 0 0 3px ${tokens.primaryGlow}`,
            opacity: disabled ? 0.6 : 1,
            cursor: disabled ? 'not-allowed' : 'text',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          style={{
            width: '100%',
            background: tokens.bgElevated,
            border: `1.5px solid ${disabled ? tokens.border : tokens.borderActive}`,
            borderRadius: 16,
            padding: '12px 14px',
            fontSize: 14,
            color: tokens.textPrimary,
            outline: 'none',
            boxShadow: disabled ? 'none' : `0 0 0 3px ${tokens.primaryGlow}`,
            opacity: disabled ? 0.6 : 1,
            cursor: disabled ? 'not-allowed' : 'text',
            fontFamily: mono ? 'JetBrains Mono, monospace' : 'Plus Jakarta Sans, sans-serif',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
        />
      )}
    </label>
  );
};

export default Settings;