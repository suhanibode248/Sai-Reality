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
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const dayNum = today.getDate();
  const monthYear = today.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  // Avatar gradient colors for lead initials
  const avatarGradients = [
    'linear-gradient(135deg, #6366f1, #8b5cf6)',
    'linear-gradient(135deg, #10b981, #059669)',
    'linear-gradient(135deg, #f43f5e, #e11d48)',
    'linear-gradient(135deg, #0ea5e9, #0284c7)',
    'linear-gradient(135deg, #f59e0b, #d97706)',
    'linear-gradient(135deg, #ec4899, #db2777)',
  ];

  const getStatusClass = (status) => {
    if (status === 'New Lead') return styles.new;
    if (status === 'In Followup') return styles.followup;
    return styles.contacted;
  };

  return (
    <DashboardLayout>
      <div className={styles.dashboardWrapper}>

        {/* Floating Background Orb */}
        <div className={styles.orbThree}></div>

        {/* ── Welcome Banner ── */}
        <div className={styles.welcomeBanner}>
          <div className={styles.welcomeText}>
            <h2>👋 Good {today.getHours() < 12 ? 'Morning' : today.getHours() < 17 ? 'Afternoon' : 'Evening'}, Admin!</h2>
            <p>Here's what's happening with your Sai Reality CRM today. Let's close some deals!</p>
          </div>
          <div className={styles.welcomeDate}>
            <div className={styles.dateDay}>{dayNum}</div>
            <div className={styles.dateMonth}>{monthYear}</div>
            <div style={{ fontSize: '0.72rem', opacity: 0.7, marginTop: 2 }}>{dayName}</div>
          </div>
        </div>

        {/* ── Quick Actions Bar ── */}
        <div className={styles.quickActions}>
          <Link to="/dashboard/leads/all" className={styles.quickActionBtn}>
            <i className="ri-user-add-line" style={{ color: '#6366f1' }}></i>
            Add New Lead
          </Link>
          <Link to="/dashboard/properties" className={styles.quickActionBtn}>
            <i className="ri-building-line" style={{ color: '#f59e0b' }}></i>
            Add Property
          </Link>
          <Link to="/dashboard/transactions" className={styles.quickActionBtn}>
            <i className="ri-money-dollar-circle-line" style={{ color: '#10b981' }}></i>
            Record Payment
          </Link>
          <Link to="/dashboard/daily-report" className={styles.quickActionBtn}>
            <i className="ri-calendar-event-line" style={{ color: '#ec4899' }}></i>
            Log Site Visit
          </Link>
        </div>

        {/* ── 5 Floating Stat Cards ── */}
        <div className={styles.statsGrid}>

          {/* Visitors */}
          <div className={`${styles.statCard} ${styles.violet}`}>
            <div className={styles.statCardTop}>
              <span className={styles.statLabel}>Total Visitors</span>
              <div className={`${styles.statIconBox} ${styles.violet}`}>
                <i className="ri-team-line"></i>
              </div>
            </div>
            <div className={styles.statValue}>{n(summary?.visitors)}</div>
            <Link to="/dashboard" className={styles.statLink}>
              View Analytics <i className="ri-arrow-right-s-line"></i>
            </Link>
          </div>

          {/* Leads */}
          <div className={`${styles.statCard} ${styles.emerald}`}>
            <div className={styles.statCardTop}>
              <span className={styles.statLabel}>Total Leads</span>
              <div className={`${styles.statIconBox} ${styles.emerald}`}>
                <i className="ri-file-list-3-line"></i>
              </div>
            </div>
            <div className={styles.statValue}>{n(summary?.leads)}</div>
            <Link to="/dashboard/leads/all" className={styles.statLink}>
              View all leads <i className="ri-arrow-right-s-line"></i>
            </Link>
          </div>

          {/* Properties */}
          <div className={`${styles.statCard} ${styles.sky}`}>
            <div className={styles.statCardTop}>
              <span className={styles.statLabel}>Total Properties</span>
              <div className={`${styles.statIconBox} ${styles.sky}`}>
                <i className="ri-home-4-line"></i>
              </div>
            </div>
            <div className={styles.statValue}>{n(summary?.properties)}</div>
            <Link to="/dashboard/properties" className={styles.statLink}>
              View all properties <i className="ri-arrow-right-s-line"></i>
            </Link>
          </div>

          {/* Projects */}
          <div className={`${styles.statCard} ${styles.amber}`}>
            <div className={styles.statCardTop}>
              <span className={styles.statLabel}>Total Projects</span>
              <div className={`${styles.statIconBox} ${styles.amber}`}>
                <i className="ri-building-line"></i>
              </div>
            </div>
            <div className={styles.statValue}>{n(summary?.projects)}</div>
            <Link to="/dashboard/projects" className={styles.statLink}>
              See details <i className="ri-arrow-right-s-line"></i>
            </Link>
          </div>

          {/* Users */}
          <div className={`${styles.statCard} ${styles.rose}`}>
            <div className={styles.statCardTop}>
              <span className={styles.statLabel}>Users / Staff</span>
              <div className={`${styles.statIconBox} ${styles.rose}`}>
                <i className="ri-user-line"></i>
              </div>
            </div>
            <div className={styles.statValue}>{n(summary?.users)}</div>
            <Link to="/dashboard/users" className={styles.statLink}>
              See all users <i className="ri-arrow-right-s-line"></i>
            </Link>
          </div>

        </div>

        {/* ── Main Content Grid ── */}
        <div className={styles.contentGrid}>

          {/* LEFT: Funnel + Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

            {/* Sales Funnel Card */}
            <div className={styles.glassPanel}>
              <div className={styles.panelHeader}>
                <h4 className={styles.panelTitle}>
                  <i className="ri-line-chart-line"></i>
                  Sales | Leads Funnel
                </h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className={styles.panelBadge}>2026 YTD</span>
                  <Link to="/dashboard/leads/all" style={{
                    fontSize: '0.72rem', fontWeight: 600, color: '#64748b',
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    textDecoration: 'none', padding: '3px 10px', borderRadius: '20px',
                    background: 'rgba(241, 245, 249, 0.8)', border: '1px solid rgba(226, 232, 240, 0.5)'
                  }}>
                    <i className="ri-filter-3-line"></i> Filter
                  </Link>
                </div>
              </div>

              {/* Funnel Stats */}
              <div style={{ padding: '16px 24px 0' }}>
                <div className={styles.funnelGrid}>
                  <div className={styles.funnelItem}>
                    <div className={styles.funnelValue}>{n(summary?.funnel?.leads)}</div>
                    <div className={styles.funnelLabel}>Total Leads</div>
                  </div>
                  <div className={styles.funnelItem}>
                    <div className={styles.funnelValue}>{n(summary?.funnel?.siteVisits)}</div>
                    <div className={styles.funnelLabel}>Site Visits</div>
                  </div>
                  <div className={styles.funnelItem}>
                    <div className={styles.funnelValue}>{n(summary?.funnel?.bookings)}</div>
                    <div className={styles.funnelLabel}>Converted</div>
                  </div>
                  <div className={styles.funnelItem}>
                    <div className={`${styles.funnelValue} ${styles.success}`}>{summary?.funnel?.conversion ?? 0}%</div>
                    <div className={styles.funnelLabel}>Conversion</div>
                  </div>
                </div>
              </div>

              <div className={styles.panelBody}>
                <div className={styles.chartPlaceholder}>
                  <span>
                    <i className="ri-bar-chart-2-line" style={{ fontSize: '28px', display: 'block', marginBottom: 8, opacity: 0.5 }}></i>
                    ApexCharts Integration Ready
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Leads Table */}
            <div className={styles.glassPanel} style={{ animationDelay: '0.15s' }}>
              <div className={styles.panelHeader}>
                <h4 className={styles.panelTitle}>
                  <i className="ri-contacts-book-line"></i>
                  Recent Leads
                </h4>
                <Link to="/dashboard/leads/all" style={{
                  fontSize: '0.78rem', fontWeight: 700, color: '#6366f1',
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px'
                }}>
                  View All <i className="ri-arrow-right-s-line"></i>
                </Link>
              </div>
              <div className={styles.panelBody} style={{ padding: '0 0 8px' }}>
                <div style={{ overflowX: 'auto' }}>
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
                          <td colSpan="6" style={{ textAlign: 'center', padding: '40px 16px', color: '#94a3b8' }}>
                            <i className="ri-inbox-line" style={{ fontSize: 32, display: 'block', marginBottom: 8 }}></i>
                            No recent leads found
                          </td>
                        </tr>
                      )}
                      {leads.map((l, i) => (
                        <tr key={i}>
                          <td>
                            <Link to="/dashboard/leads/all" className={styles.leadIdLink}>
                              {l.id}
                            </Link>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <span className={styles.leadAvatar} style={{ background: avatarGradients[i % avatarGradients.length] }}>
                                {l.name.charAt(0)}
                              </span>
                              <span style={{ fontWeight: 600 }}>{l.name}</span>
                            </div>
                          </td>
                          <td>{l.phone}</td>
                          <td>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <i className="ri-map-pin-2-line" style={{ color: '#94a3b8', fontSize: 13 }}></i>
                              {l.location}
                            </span>
                          </td>
                          <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{l.date}</td>
                          <td>
                            <span className={`${styles.statusPill} ${getStatusClass(l.status)}`}>
                              {l.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: Side Panel */}
          <div className={styles.sidePanel}>

            {/* Notification 1 */}
            <div className={styles.notifCard}>
              <div className={`${styles.notifIconBox} ${styles.blue}`}>
                <i className="ri-notification-3-line"></i>
              </div>
              <div>
                <div className={styles.notifTitle}>Unread Notifications</div>
                <div className={styles.notifDesc}>You have 2 unread messages</div>
              </div>
            </div>

            {/* Notification 2 */}
            <div className={styles.notifCard}>
              <div className={`${styles.notifIconBox} ${styles.gold}`}>
                <i className="ri-mail-unread-line"></i>
              </div>
              <div>
                <div className={styles.notifTitle}>Weekly Report</div>
                <div className={styles.notifDesc}>Weekly report is ready to view</div>
              </div>
            </div>

            {/* Empty State */}
            <div className={styles.emptyState}>
              <img src="https://placehold.co/80x80/f1f5f9/94a3b8?text=✓" alt="" height="70" />
              <h5>All Caught Up! 🎉</h5>
              <p>You have no pending notifications.</p>
            </div>

            {/* Invite CTA Card */}
            <div className={styles.inviteCard}>
              <h5>✨ Invite New User</h5>
              <p>Add a new team member to your CRM dashboard</p>
              <Link to="/dashboard/users" className={styles.inviteBtn}>
                Invite Now →
              </Link>
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default DashboardOverview;
