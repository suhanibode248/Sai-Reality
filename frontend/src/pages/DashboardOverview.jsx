import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import styles from './DashboardOverview.module.css';

const DashboardOverview = () => {
  const [summary, setSummary] = useState(null);
  useEffect(() => {
    fetch('http://localhost:8000/api/dashboard/summary')
      .then(res => res.json())
      .then(data => { if (data.status === 'success') setSummary(data); })
      .catch(() => {});
  }, []);
  const leads = summary?.recentLeads || [];
  const n = (value) => (value ?? 0).toLocaleString('en-IN');

  const today = new Date();
  const hour = today.getHours();
  const greeting = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
  const greetingEmoji = hour < 12 ? '☀️' : hour < 17 ? '🌤️' : '🌙';
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const dayNum = today.getDate();
  const monthYear = today.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  const avatarGradients = [
    'linear-gradient(135deg,#6366f1,#8b5cf6)',
    'linear-gradient(135deg,#10b981,#059669)',
    'linear-gradient(135deg,#f43f5e,#e11d48)',
    'linear-gradient(135deg,#0ea5e9,#0284c7)',
    'linear-gradient(135deg,#f59e0b,#d97706)',
    'linear-gradient(135deg,#ec4899,#db2777)',
  ];

  const getStatusClass = (status) => {
    if (status === 'New Lead') return styles.statusNew;
    if (status === 'In Followup') return styles.statusFollowup;
    return styles.statusContacted;
  };

  const statCards = [
    {
      label: 'Total Visitors',
      value: n(summary?.visitors),
      icon: 'ri-user-star-line',
      color: 'violet',
      gradient: 'linear-gradient(135deg,#8b5cf6,#6d28d9)',
      glowColor: 'rgba(139,92,246,0.4)',
      link: '/dashboard',
      linkLabel: 'View Analytics',
      trend: '+12%',
      trendUp: true,
    },
    {
      label: 'Total Leads',
      value: n(summary?.leads),
      icon: 'ri-file-list-3-line',
      color: 'emerald',
      gradient: 'linear-gradient(135deg,#10b981,#059669)',
      glowColor: 'rgba(16,185,129,0.4)',
      link: '/dashboard/leads/all',
      linkLabel: 'View all leads',
      trend: '+8%',
      trendUp: true,
    },
    {
      label: 'Total Properties',
      value: n(summary?.properties),
      icon: 'ri-home-4-line',
      color: 'sky',
      gradient: 'linear-gradient(135deg,#0ea5e9,#0284c7)',
      glowColor: 'rgba(14,165,233,0.4)',
      link: '/dashboard/properties',
      linkLabel: 'View properties',
      trend: '+5%',
      trendUp: true,
    },
    {
      label: 'Active Projects',
      value: n(summary?.projects),
      icon: 'ri-building-4-line',
      color: 'amber',
      gradient: 'linear-gradient(135deg,#f59e0b,#d97706)',
      glowColor: 'rgba(245,158,11,0.4)',
      link: '/dashboard/projects',
      linkLabel: 'See details',
      trend: '+2%',
      trendUp: true,
    },
    {
      label: 'Users / Staff',
      value: n(summary?.users),
      icon: 'ri-team-line',
      color: 'rose',
      gradient: 'linear-gradient(135deg,#f43f5e,#e11d48)',
      glowColor: 'rgba(244,63,94,0.4)',
      link: '/dashboard/users',
      linkLabel: 'See all users',
      trend: '+1%',
      trendUp: true,
    },
  ];

  return (
    <DashboardLayout>
      <div className={styles.dashboardWrapper}>

        {/* ── Welcome Banner ── */}
        <div className={styles.welcomeBanner}>
          <div className={styles.welcomeLeft}>
            <div className={styles.greetingBadge}>{greetingEmoji} Good {greeting}</div>
            <h2 className={styles.welcomeTitle}>Welcome back, <span className={styles.adminHighlight}>Admin!</span></h2>
            <p className={styles.welcomeDesc}>Here's what's happening with your Sai Reality CRM today. Let's close some deals!</p>
            <div className={styles.welcomeStats}>
              <div className={styles.welcomeStat}>
                <span className={styles.welcomeStatVal}>{n(summary?.leads)}</span>
                <span className={styles.welcomeStatLabel}>Active Leads</span>
              </div>
              <div className={styles.welcomeStatDivider}></div>
              <div className={styles.welcomeStat}>
                <span className={styles.welcomeStatVal}>{n(summary?.properties)}</span>
                <span className={styles.welcomeStatLabel}>Properties</span>
              </div>
              <div className={styles.welcomeStatDivider}></div>
              <div className={styles.welcomeStat}>
                <span className={styles.welcomeStatVal}>{summary?.funnel?.conversion ?? 0}%</span>
                <span className={styles.welcomeStatLabel}>Conversion</span>
              </div>
            </div>
          </div>
          <div className={styles.welcomeRight}>
            <div className={styles.calendarWidget}>
              <div className={styles.calendarDay}>{dayNum}</div>
              <div className={styles.calendarMonth}>{monthYear}</div>
              <div className={styles.calendarWeekday}>{dayName}</div>
            </div>
          </div>
          {/* Banner decorative shapes */}
          <div className={styles.bannerShape1}></div>
          <div className={styles.bannerShape2}></div>
          <div className={styles.bannerShape3}></div>
        </div>

        {/* ── Quick Actions Bar ── */}
        <div className={styles.quickActions}>
          {[
            { to: '/dashboard/leads/all', icon: 'ri-user-add-line', label: 'Add New Lead', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
            { to: '/dashboard/properties', icon: 'ri-building-line', label: 'Add Property', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
            { to: '/dashboard/transactions', icon: 'ri-money-dollar-circle-line', label: 'Record Payment', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
            { to: '/dashboard/daily-report', icon: 'ri-calendar-event-line', label: 'Log Site Visit', color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
            { to: '/dashboard/projects', icon: 'ri-building-4-line', label: 'Add Project', color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)' },
          ].map(item => (
            <Link key={item.to} to={item.to} className={styles.quickActionBtn}>
              <span className={styles.quickActionIconWrap} style={{ background: item.bg }}>
                <i className={item.icon} style={{ color: item.color, fontSize: '16px' }}></i>
              </span>
              {item.label}
            </Link>
          ))}
        </div>

        {/* ── Stat Cards ── */}
        <div className={styles.statsGrid}>
          {statCards.map((card, i) => (
            <div key={i} className={`${styles.statCard} ${styles[card.color]}`} style={{ animationDelay: `${i * 0.07}s` }}>
              {/* Decorative gradient top strip */}
              <div className={styles.statCardStrip} style={{ background: card.gradient }}></div>
              <div className={styles.statCardInner}>
                <div className={styles.statCardTop}>
                  <span className={styles.statLabel}>{card.label}</span>
                  <div className={styles.statIconBox} style={{ background: card.gradient, boxShadow: `0 6px 18px ${card.glowColor}` }}>
                    <i className={card.icon}></i>
                  </div>
                </div>
                <div className={styles.statValue}>{card.value || '—'}</div>
                <div className={styles.statFooter}>
                  <Link to={card.link} className={styles.statLink}>
                    {card.linkLabel} <i className="ri-arrow-right-s-line"></i>
                  </Link>
                  <span className={`${styles.statTrend} ${card.trendUp ? styles.trendUp : styles.trendDown}`}>
                    <i className={card.trendUp ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}></i>
                    {card.trend}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main Content Grid ── */}
        <div className={styles.contentGrid}>

          {/* LEFT */}
          <div className={styles.leftColumn}>

            {/* Sales Funnel Card */}
            <div className={styles.glassPanel}>
              <div className={styles.panelHeader}>
                <div className={styles.panelTitleGroup}>
                  <div className={styles.panelIconWrap} style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>
                    <i className="ri-line-chart-line"></i>
                  </div>
                  <h4 className={styles.panelTitle}>Sales & Leads Funnel</h4>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className={styles.panelBadge} style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>2026 YTD</span>
                  <Link to="/dashboard/leads/all" className={styles.panelFilterBtn}>
                    <i className="ri-filter-3-line"></i> Filter
                  </Link>
                </div>
              </div>

              <div className={styles.funnelGrid}>
                {[
                  { value: n(summary?.funnel?.leads), label: 'Total Leads', color: '#6366f1', icon: 'ri-user-received-2-line' },
                  { value: n(summary?.funnel?.siteVisits), label: 'Site Visits', color: '#0ea5e9', icon: 'ri-map-pin-user-line' },
                  { value: n(summary?.funnel?.bookings), label: 'Converted', color: '#10b981', icon: 'ri-checkbox-circle-line' },
                  { value: `${summary?.funnel?.conversion ?? 0}%`, label: 'Conversion Rate', color: '#f59e0b', icon: 'ri-percent-line', highlight: true },
                ].map((item, i) => (
                  <div key={i} className={styles.funnelItem}>
                    <div className={styles.funnelItemIcon} style={{ color: item.color, background: `${item.color}18` }}>
                      <i className={item.icon}></i>
                    </div>
                    <div className={`${styles.funnelValue} ${item.highlight ? styles.funnelHighlight : ''}`} style={item.highlight ? { color: item.color } : {}}>
                      {item.value || '0'}
                    </div>
                    <div className={styles.funnelLabel}>{item.label}</div>
                  </div>
                ))}
              </div>

              <div className={styles.panelBody}>
                <div className={styles.chartPlaceholder}>
                  <i className="ri-bar-chart-2-line" style={{ fontSize: '36px', opacity: 0.3, display: 'block', marginBottom: 10 }}></i>
                  <span style={{ fontWeight: 600 }}>ApexCharts Integration Ready</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: 4, display: 'block' }}>Real-time sales analytics will appear here</span>
                </div>
              </div>
            </div>

            {/* Recent Leads Table */}
            <div className={styles.glassPanel} style={{ animationDelay: '0.12s' }}>
              <div className={styles.panelHeader}>
                <div className={styles.panelTitleGroup}>
                  <div className={styles.panelIconWrap} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                    <i className="ri-contacts-book-line"></i>
                  </div>
                  <h4 className={styles.panelTitle}>Recent Leads</h4>
                </div>
                <Link to="/dashboard/leads/all" className={styles.viewAllLink}>
                  View All <i className="ri-arrow-right-s-line"></i>
                </Link>
              </div>
              <div className={styles.tableWrapper}>
                <table className={styles.leadsTable}>
                  <thead>
                    <tr>
                      <th>Lead ID</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Location</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.length === 0 && (
                      <tr>
                        <td colSpan="6" className={styles.emptyTableCell}>
                          <i className="ri-inbox-line" style={{ fontSize: 34, display: 'block', marginBottom: 10, opacity: 0.4 }}></i>
                          No recent leads found
                        </td>
                      </tr>
                    )}
                    {leads.map((l, i) => (
                      <tr key={i}>
                        <td>
                          <Link to="/dashboard/leads/all" className={styles.leadIdLink}>{l.id}</Link>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span className={styles.leadAvatar} style={{ background: avatarGradients[i % avatarGradients.length] }}>
                              {l.name.charAt(0)}
                            </span>
                            <span style={{ fontWeight: 600, color: '#0f172a' }}>{l.name}</span>
                          </div>
                        </td>
                        <td style={{ color: '#475569' }}>{l.phone}</td>
                        <td>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#475569' }}>
                            <i className="ri-map-pin-2-line" style={{ color: '#94a3b8' }}></i>
                            {l.location}
                          </span>
                        </td>
                        <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{l.date}</td>
                        <td>
                          <span className={`${styles.statusPill} ${getStatusClass(l.status)}`}>{l.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* RIGHT — Side Panel */}
          <div className={styles.sidePanel}>

            {/* Activity Cards */}
            {[
              { icon: 'ri-notification-3-line', title: 'Unread Notifications', desc: 'You have 2 unread messages', color: '#6366f1', bg: 'rgba(99,102,241,0.1)', link: '/dashboard/leads/all' },
              { icon: 'ri-mail-unread-line', title: 'Weekly Report', desc: 'Weekly summary is ready to view', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', link: '/dashboard/finance-overview' },
              { icon: 'ri-fire-fill', title: 'Hot Leads Today', desc: '3 new leads marked as hot', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', link: '/dashboard/leads/all' },
            ].map((item, i) => (
              <Link key={i} to={item.link} className={styles.notifCard}>
                <div className={styles.notifIconBox} style={{ background: item.bg, color: item.color }}>
                  <i className={item.icon}></i>
                </div>
                <div>
                  <div className={styles.notifTitle}>{item.title}</div>
                  <div className={styles.notifDesc}>{item.desc}</div>
                </div>
                <i className="ri-arrow-right-s-line" style={{ marginLeft: 'auto', color: '#cbd5e1', fontSize: '16px' }}></i>
              </Link>
            ))}

            {/* Quick Stats Mini */}
            <div className={styles.miniStatsCard}>
              <div className={styles.miniStatsHeader}>
                <i className="ri-pie-chart-2-line"></i>
                Quick Overview
              </div>
              {[
                { label: 'This Month Revenue', value: '₹ 4.2L', icon: 'ri-money-dollar-circle-line', color: '#10b981' },
                { label: 'Pending Follow-ups', value: n(summary?.funnel?.leads), icon: 'ri-phone-line', color: '#f59e0b' },
                { label: 'Site Visits This Week', value: n(summary?.funnel?.siteVisits), icon: 'ri-map-pin-2-line', color: '#6366f1' },
              ].map((item, i) => (
                <div key={i} className={styles.miniStatRow}>
                  <div className={styles.miniStatIcon} style={{ color: item.color, background: `${item.color}18` }}>
                    <i className={item.icon}></i>
                  </div>
                  <div className={styles.miniStatLabel}>{item.label}</div>
                  <div className={styles.miniStatValue} style={{ color: item.color }}>{item.value || '0'}</div>
                </div>
              ))}
            </div>

            {/* Invite CTA Card */}
            <div className={styles.inviteCard}>
              <div className={styles.inviteIcon}>✨</div>
              <h5 className={styles.inviteTitle}>Invite New Team Member</h5>
              <p className={styles.inviteDesc}>Add a new staff member to your CRM and grow your team</p>
              <Link to="/dashboard/users" className={styles.inviteBtn}>
                <i className="ri-user-add-line"></i> Invite Now
              </Link>
              <div className={styles.inviteShape1}></div>
              <div className={styles.inviteShape2}></div>
            </div>

            {/* All Caught Up */}
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>🎉</div>
              <h5 className={styles.emptyStateTitle}>All Caught Up!</h5>
              <p className={styles.emptyStateDesc}>No pending tasks or alerts at this time.</p>
            </div>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default DashboardOverview;
