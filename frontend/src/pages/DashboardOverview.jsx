import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

const DashboardOverview = () => {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ total: 14863, new: 10026, inProgress: 1226, converted: 39 });
  const [selectedLead, setSelectedLead] = useState(null);
  const [editingLead, setEditingLead] = useState(null);
  const [activeTimeFilter, setActiveTimeFilter] = useState('month');

  const mockLeads = [
    { 
      id: '2022016488', 
      full_name: 'Rahul Sharma', 
      avatar: '/static/dashboard/assets/images/users/avatar-1.jpg', 
      phone: '+91 9518701503', 
      email: 'rahul.sharma@gmail.com', 
      property_name: 'Lodha Kharadi Luxury Towers 3BHK', 
      prop_img: '/media/dashboard/images/gallery/1000607247.jpg',
      visit_date: 'Oct 6, 2026', 
      status: 'NEW LEAD', 
      budget: '₹ 1.45 CR', 
      source: 'MagicBricks', 
      city: 'Kharadi, Pune',
      notes: 'Interested in 18th floor east-facing 3BHK with mountain view. Requested weekend site visit.'
    },
    { 
      id: '2022016489', 
      full_name: 'Priya Patel', 
      avatar: '/static/dashboard/assets/images/users/avatar-2.jpg', 
      phone: '+91 9812345678', 
      email: 'priya.p@techcorp.in', 
      property_name: 'Goel Ganga Newtown Dhanori 2BHK', 
      prop_img: '/media/dashboard/images/gallery/1000607248.jpg',
      visit_date: 'Oct 5, 2026', 
      status: 'IN FOLLOWUP', 
      budget: '₹ 65 LACS', 
      source: 'Direct Call', 
      city: 'Dhanori, Pune',
      notes: 'Site visit completed on 4th Oct. Looking for HDFC bank loan pre-approval assistance.'
    },
    { 
      id: '2022016490', 
      full_name: 'Amit Deshmukh', 
      avatar: '/static/dashboard/assets/images/users/avatar-3.jpg', 
      phone: '+91 9988776655', 
      email: 'amit.d@yahoo.com', 
      property_name: 'Bramha F-Residences Wagholi 2.5BHK', 
      prop_img: '/media/dashboard/images/gallery/1000607249.jpg',
      visit_date: 'Oct 7, 2026', 
      status: 'SITE VISIT', 
      budget: '₹ 78 LACS', 
      source: 'Sai Reality Web', 
      city: 'Wagholi, Pune',
      notes: 'Family visit scheduled for Sunday 11:00 AM. Token booking expected.'
    },
    { 
      id: '2022016491', 
      full_name: 'Sneha Kulkarni', 
      avatar: '/static/dashboard/assets/images/users/avatar-4.jpg', 
      phone: '+91 9765432109', 
      email: 'sneha.k@gmail.com', 
      property_name: 'Collector NA Plots Lohegaon Plot 14', 
      prop_img: '/media/dashboard/images/gallery/1000607250.jpg',
      visit_date: 'Oct 4, 2026', 
      status: 'BOOKINGS/ EOI', 
      budget: '₹ 40 LACS', 
      source: '99acres', 
      city: 'Lohegaon, Pune',
      notes: 'Agreement registered at Haveli Sub-Registrar. Token amount ₹1,00,000 cleared.'
    },
    { 
      id: '2022016492', 
      full_name: 'Vikram Verma', 
      avatar: '/static/dashboard/assets/images/users/avatar-5.jpg', 
      phone: '+91 9123456789', 
      email: 'vikram.v@ventures.com', 
      property_name: 'VTP Township Kharadi Showroom', 
      prop_img: '/media/dashboard/images/gallery/1000607251.jpg',
      visit_date: 'Oct 8, 2026', 
      status: 'NEW LEAD', 
      budget: '₹ 95 LACS', 
      source: 'Google Ads', 
      city: 'Viman Nagar, Pune',
      notes: 'Looking for 1,200 sq.ft ground floor commercial showroom for organic cafe chain.'
    }
  ];

  const upcomingVisits = [
    { time: '11:00 AM', client: 'Rahul Sharma', project: 'Lodha Kharadi (3BHK)', exec: 'Amit Executive', status: 'Confirmed' },
    { time: '02:30 PM', client: 'Deepak Joshi', project: 'Ganga Newtown (2BHK)', exec: 'Pooja Sales', status: 'Pending Call' },
    { time: '04:45 PM', client: 'Anita Roy', project: 'NA Plots Lohegaon', exec: 'Raj Manager', status: 'Confirmed' }
  ];

  useEffect(() => {
    setLeads(mockLeads);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getBadgeStyle = (status) => {
    switch (status) {
      case 'NEW LEAD': return { bg: '#e0f2fe', color: '#0284c7', border: '#bae6fd' };
      case 'IN FOLLOWUP': return { bg: '#fef3c7', color: '#d97706', border: '#fde68a' };
      case 'SITE VISIT': return { bg: '#ede9fe', color: '#7c3aed', border: '#ddd6fe' };
      case 'BOOKINGS/ EOI': return { bg: '#dcfce7', color: '#16a34a', border: '#bbf7d0' };
      default: return { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };
    }
  };

  return (
    <DashboardLayout>
      <div className="container-fluid p-0">
        
        {/* ── Welcome Hero Banner ── */}
        <div 
          className="card border-0 shadow-sm mb-4" 
          style={{ 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
            color: '#fff',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Background Accent Pattern */}
          <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0, 210, 211, 0.25) 0%, rgba(0, 210, 211, 0) 70%)', pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', right: '160px', bottom: '-60px', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(2, 132, 199, 0.2) 0%, rgba(2, 132, 199, 0) 70%)', pointerEvents: 'none' }}></div>

          <div className="card-body p-4 position-relative z-1">
            <div className="row align-items-center g-3">
              <div className="col-lg-8">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="badge" style={{ backgroundColor: 'rgba(0, 210, 211, 0.2)', color: '#00d2d3', border: '1px solid rgba(0, 210, 211, 0.4)', fontWeight: '700', fontSize: '11px', letterSpacing: '0.5px' }}>
                    REAL ESTATE EXECUTIVE SUITE
                  </span>
                  <span className="text-white-50" style={{ fontSize: '12px' }}>
                    • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="fw-bold mb-2 text-white" style={{ fontSize: '24px' }}>
                  {getGreeting()}, Administrator 👋
                </h3>
                <p className="mb-3 text-white-50" style={{ fontSize: '13.5px', maxWidth: '650px', lineHeight: '1.5' }}>
                  Welcome to the Sai Reality Central Control Desk. Your real-time inventory spans <strong>808 Verified Properties</strong>, <strong>48 Builder Townships</strong>, and <strong>14,863 Inquiries</strong> across Pune.
                </p>
                
                {/* Fast Action Buttons */}
                <div className="d-flex gap-2 flex-wrap">
                  <Link to="/dashboard/leads/all" className="btn btn-sm shadow-sm" style={{ background: 'linear-gradient(135deg, #00b894 0%, #00947a 100%)', color: '#fff', fontWeight: '700', borderRadius: '8px', padding: '6px 16px', border: 'none' }}>
                    <i className="ri-user-add-line me-1"></i> + New Lead Entry
                  </Link>
                  <Link to="/dashboard/properties" className="btn btn-sm shadow-sm" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: '#fff', fontWeight: '700', borderRadius: '8px', padding: '6px 16px', border: 'none' }}>
                    <i className="ri-building-line me-1"></i> + Add Property
                  </Link>
                  <Link to="/dashboard/daily-report" className="btn btn-sm btn-outline-light" style={{ fontWeight: '600', borderRadius: '8px', padding: '6px 14px' }}>
                    <i className="ri-file-download-line me-1"></i> Download Calling Sheet
                  </Link>
                </div>
              </div>

              {/* Right Side Quick Stat Widget */}
              <div className="col-lg-4 text-lg-end d-none d-lg-block">
                <div style={{ display: 'inline-block', padding: '16px 20px', borderRadius: '14px', backgroundColor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.12)', textAlign: 'left', minWidth: '220px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.6px' }}>MONTHLY CONVERSIONS</div>
                  <div style={{ fontSize: '26px', fontWeight: '800', color: '#00d2d3', margin: '4px 0' }}>₹ 38.4 CR</div>
                  <div style={{ fontSize: '11.5px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <i className="ri-checkbox-circle-fill text-success"></i> 39 Verified Registrations
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 4 Glassmorphism Metric Cards ── */}
        <div className="row g-3 mb-4">
          
          {/* 1. Total Inquiries */}
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '14px', background: '#ffffff', borderTop: '4px solid #0284c7', transition: 'transform 0.2s' }}>
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <span className="text-uppercase fw-bold text-muted" style={{ fontSize: '11px', letterSpacing: '0.6px' }}>TOTAL INQUIRIES</span>
                    <h3 className="mb-0 fw-bold mt-1" style={{ color: '#0f172a', fontSize: '28px' }}>14,863</h3>
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7', fontSize: '24px' }}>
                    <i className="ri-contacts-book-2-fill"></i>
                  </div>
                </div>

                {/* Sparkline Visual Simulation */}
                <div className="d-flex align-items-end gap-1 mt-3" style={{ height: '18px' }}>
                  {[40, 55, 35, 60, 75, 50, 65, 80, 70, 90, 85, 100].map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${h}%`, backgroundColor: i === 11 ? '#0284c7' : '#bae6fd', borderRadius: '2px' }}></div>
                  ))}
                </div>

                <div className="d-flex align-items-center justify-content-between mt-3 pt-2 border-top" style={{ fontSize: '12px' }}>
                  <span className="text-success fw-bold d-flex align-items-center gap-1">
                    <i className="ri-arrow-up-line"></i> +16.24%
                  </span>
                  <Link to="/dashboard/leads/all" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: '700' }}>View All Leads &rarr;</Link>
                </div>
              </div>
            </div>
          </div>

          {/* 2. New Fresh Leads */}
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '14px', background: '#ffffff', borderTop: '4px solid #ea580c' }}>
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <span className="text-uppercase fw-bold text-muted" style={{ fontSize: '11px', letterSpacing: '0.6px' }}>NEW FRESH LEADS</span>
                    <h3 className="mb-0 fw-bold mt-1" style={{ color: '#0f172a', fontSize: '28px' }}>10,026</h3>
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c', fontSize: '24px' }}>
                    <i className="ri-fire-fill"></i>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="d-flex justify-content-between text-muted" style={{ fontSize: '11px', marginBottom: '4px' }}>
                    <span>Portal Intake</span>
                    <span className="fw-bold text-dark">67.4% Unassigned</span>
                  </div>
                  <div className="progress" style={{ height: '6px', borderRadius: '3px' }}>
                    <div className="progress-bar" style={{ width: '67.4%', backgroundColor: '#ea580c' }}></div>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between mt-3 pt-2 border-top" style={{ fontSize: '12px' }}>
                  <span className="text-warning fw-bold d-flex align-items-center gap-1">
                    <i className="ri-arrow-up-line"></i> +8.5% this week
                  </span>
                  <span className="text-muted">MagicBricks &amp; 99acres</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. In Active Followup */}
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '14px', background: '#ffffff', borderTop: '4px solid #f59e0b' }}>
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <span className="text-uppercase fw-bold text-muted" style={{ fontSize: '11px', letterSpacing: '0.6px' }}>IN ACTIVE FOLLOWUP</span>
                    <h3 className="mb-0 fw-bold mt-1" style={{ color: '#0f172a', fontSize: '28px' }}>1,226</h3>
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', fontSize: '24px' }}>
                    <i className="ri-phone-fill"></i>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="d-flex justify-content-between text-muted" style={{ fontSize: '11px', marginBottom: '4px' }}>
                    <span>Telecalling Queue</span>
                    <span className="fw-bold text-warning">18 Scheduled Today</span>
                  </div>
                  <div className="progress" style={{ height: '6px', borderRadius: '3px' }}>
                    <div className="progress-bar" style={{ width: '45%', backgroundColor: '#f59e0b' }}></div>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between mt-3 pt-2 border-top" style={{ fontSize: '12px' }}>
                  <span className="text-warning fw-bold d-flex align-items-center gap-1">
                    <i className="ri-time-line"></i> Site Visits: 3,050
                  </span>
                  <Link to="/dashboard/daily-report" style={{ color: '#d97706', textDecoration: 'none', fontWeight: '700' }}>Desk Logs &rarr;</Link>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Confirmed Bookings */}
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '14px', background: '#ffffff', borderTop: '4px solid #10b981' }}>
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <span className="text-uppercase fw-bold text-muted" style={{ fontSize: '11px', letterSpacing: '0.6px' }}>CLOSED DEALS / BOOKINGS</span>
                    <h3 className="mb-0 fw-bold mt-1" style={{ color: '#0f172a', fontSize: '28px' }}>39</h3>
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', fontSize: '24px' }}>
                    <i className="ri-checkbox-circle-fill"></i>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="d-flex justify-content-between text-muted" style={{ fontSize: '11px', marginBottom: '4px' }}>
                    <span>Target Achievement</span>
                    <span className="fw-bold text-success">92% of Q3 Target</span>
                  </div>
                  <div className="progress" style={{ height: '6px', borderRadius: '3px' }}>
                    <div className="progress-bar" style={{ width: '92%', backgroundColor: '#10b981' }}></div>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between mt-3 pt-2 border-top" style={{ fontSize: '12px' }}>
                  <span className="text-success fw-bold d-flex align-items-center gap-1">
                    ₹ 38.4 Cr Turnover
                  </span>
                  <Link to="/dashboard/transactions" style={{ color: '#16a34a', textDecoration: 'none', fontWeight: '700' }}>Ledgers &rarr;</Link>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── Interactive Charts & Performance Section ── */}
        <div className="row g-3 mb-4">
          
          {/* Monthly Inquiries vs Site Visits Chart */}
          <div className="col-xl-8">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '14px' }}>
              <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <h5 className="card-title mb-0 fw-bold" style={{ fontSize: '15px', color: '#1e293b' }}>
                    Lead Inflow &amp; Site Visit Trends (2026)
                  </h5>
                  <small className="text-muted">Monthly performance across Pune residential &amp; commercial zones</small>
                </div>
                <div className="btn-group btn-group-sm">
                  <button onClick={() => setActiveTimeFilter('month')} className={`btn ${activeTimeFilter === 'month' ? 'btn-primary' : 'btn-light border'}`} style={{ fontWeight: '600' }}>Monthly</button>
                  <button onClick={() => setActiveTimeFilter('quarter')} className={`btn ${activeTimeFilter === 'quarter' ? 'btn-primary' : 'btn-light border'}`} style={{ fontWeight: '600' }}>Quarterly</button>
                  <button onClick={() => setActiveTimeFilter('year')} className={`btn ${activeTimeFilter === 'year' ? 'btn-primary' : 'btn-light border'}`} style={{ fontWeight: '600' }}>2026 YTD</button>
                </div>
              </div>
              <div className="card-body p-4">
                
                {/* SVG Visual Bar Chart */}
                <div style={{ height: '220px', width: '100%', position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: '30px', borderBottom: '1px solid #e2e8f0' }}>
                  {[
                    { month: 'Jan', leads: 820, visits: 180 },
                    { month: 'Feb', leads: 1050, visits: 240 },
                    { month: 'Mar', leads: 1350, visits: 310 },
                    { month: 'Apr', leads: 1200, visits: 290 },
                    { month: 'May', leads: 1600, visits: 380 },
                    { month: 'Jun', leads: 1450, visits: 340 },
                    { month: 'Jul', leads: 1750, visits: 410 },
                    { month: 'Aug', leads: 1900, visits: 480 },
                    { month: 'Sep', leads: 2100, visits: 530 },
                    { month: 'Oct', leads: 1640, visits: 420 },
                  ].map((data, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}>
                      <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '170px' }}>
                        {/* Leads Bar */}
                        <div 
                          title={`${data.month}: ${data.leads} Leads`}
                          style={{ 
                            width: '14px', 
                            height: `${(data.leads / 2200) * 100}%`, 
                            background: 'linear-gradient(180deg, #0284c7 0%, #0369a1 100%)', 
                            borderRadius: '4px 4px 0 0',
                            transition: 'height 0.3s ease'
                          }}
                        ></div>
                        {/* Site Visits Bar */}
                        <div 
                          title={`${data.month}: ${data.visits} Site Visits`}
                          style={{ 
                            width: '14px', 
                            height: `${(data.visits / 2200) * 100}%`, 
                            background: 'linear-gradient(180deg, #00d2d3 0%, #00b894 100%)', 
                            borderRadius: '4px 4px 0 0',
                            transition: 'height 0.3s ease'
                          }}
                        ></div>
                      </div>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', position: 'absolute', bottom: '6px' }}>
                        {data.month}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Chart Legend & Summary */}
                <div className="d-flex justify-content-between align-items-center mt-3 pt-1 flex-wrap gap-2">
                  <div className="d-flex gap-4">
                    <div className="d-flex align-items-center gap-2" style={{ fontSize: '12.5px' }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#0284c7' }}></span>
                      <span className="fw-semibold text-dark">Portal Inquiries</span>
                    </div>
                    <div className="d-flex align-items-center gap-2" style={{ fontSize: '12.5px' }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#00d2d3' }}></span>
                      <span className="fw-semibold text-dark">Physical Site Visits</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Avg. Conversion Velocity: <strong className="text-success">4.8 Days</strong>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Acquisition Channels Breakdown */}
          <div className="col-xl-4">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '14px' }}>
              <div className="card-header bg-white border-bottom py-3">
                <h5 className="card-title mb-0 fw-bold" style={{ fontSize: '15px', color: '#1e293b' }}>
                  Lead Source Distribution
                </h5>
                <small className="text-muted">Inflow channels &amp; campaigns</small>
              </div>
              <div className="card-body p-4">
                
                {/* Channels List with Progress bars */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1" style={{ fontSize: '13px' }}>
                    <span className="fw-semibold text-dark"><i className="ri-building-4-line text-primary me-1"></i> MagicBricks Portal</span>
                    <span className="fw-bold">38% (5,648)</span>
                  </div>
                  <div className="progress" style={{ height: '7px', borderRadius: '4px' }}>
                    <div className="progress-bar" style={{ width: '38%', backgroundColor: '#0284c7' }}></div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1" style={{ fontSize: '13px' }}>
                    <span className="fw-semibold text-dark"><i className="ri-community-line text-info me-1"></i> 99acres Listing</span>
                    <span className="fw-bold">24% (3,567)</span>
                  </div>
                  <div className="progress" style={{ height: '7px', borderRadius: '4px' }}>
                    <div className="progress-bar" style={{ width: '24%', backgroundColor: '#06b6d4' }}></div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1" style={{ fontSize: '13px' }}>
                    <span className="fw-semibold text-dark"><i className="ri-global-line text-success me-1"></i> Sai Reality Website</span>
                    <span className="fw-bold">22% (3,270)</span>
                  </div>
                  <div className="progress" style={{ height: '7px', borderRadius: '4px' }}>
                    <div className="progress-bar" style={{ width: '22%', backgroundColor: '#10b981' }}></div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1" style={{ fontSize: '13px' }}>
                    <span className="fw-semibold text-dark"><i className="ri-google-fill text-warning me-1"></i> Google Search Ads</span>
                    <span className="fw-bold">16% (2,378)</span>
                  </div>
                  <div className="progress" style={{ height: '7px', borderRadius: '4px' }}>
                    <div className="progress-bar" style={{ width: '16%', backgroundColor: '#f59e0b' }}></div>
                  </div>
                </div>

                <div className="p-3 mt-3 rounded" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted d-block">Cost Per Converted Deal</small>
                      <strong className="text-dark" style={{ fontSize: '16px' }}>₹ 1,420 / lead</strong>
                    </div>
                    <Link to="/dashboard/gcode" className="btn btn-sm btn-outline-primary" style={{ fontWeight: '600', borderRadius: '6px' }}>
                      Analytics &rarr;
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* ── Recent Inquiries Table & Scheduled Site Visits ── */}
        <div className="row g-3 mb-4">
          
          {/* Main Table: Recent Inquiries */}
          <div className="col-xl-8">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '14px' }}>
              <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <h5 className="card-title mb-0 fw-bold" style={{ fontSize: '15px', color: '#1e293b' }}>
                    Recent High-Intent Buyer Leads
                  </h5>
                  <small className="text-muted">Live inbound feeds with instant calling &amp; WhatsApp actions</small>
                </div>
                <Link to="/dashboard/leads/all" className="btn btn-sm btn-light border text-primary fw-bold" style={{ fontSize: '12px' }}>
                  Open Full Leads CRM &rarr;
                </Link>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0" style={{ fontSize: '13px' }}>
                    <thead style={{ backgroundColor: '#f8fafc', color: '#475569' }}>
                      <tr>
                        <th className="ps-3 py-2">Buyer / Customer</th>
                        <th className="py-2">Property Interest</th>
                        <th className="py-2">Budget</th>
                        <th className="py-2">Source</th>
                        <th className="py-2">Status</th>
                        <th className="text-end pe-3 py-2">Instant Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map(lead => {
                        const badge = getBadgeStyle(lead.status);
                        return (
                          <tr key={lead.id}>
                            <td className="ps-3">
                              <div className="d-flex align-items-center gap-2">
                                <img 
                                  src={lead.avatar} 
                                  alt="" 
                                  style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #e2e8f0' }}
                                  onError={(e) => { e.target.src = '/static/dashboard/assets/images/users/avatar-1.jpg'; }}
                                />
                                <div>
                                  <div className="fw-bold text-dark">{lead.full_name}</div>
                                  <small className="text-muted">{lead.phone}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <img 
                                  src={lead.prop_img} 
                                  alt="" 
                                  style={{ width: '36px', height: '28px', borderRadius: '4px', objectFit: 'cover' }}
                                  onError={(e) => { e.target.src = '/media/dashboard/images/gallery/1000607247.jpg'; }}
                                />
                                <div>
                                  <div className="fw-semibold text-primary" style={{ fontSize: '12.5px' }}>{lead.property_name}</div>
                                  <small className="text-muted">📍 {lead.city}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '3px 8px', borderRadius: '6px', fontWeight: '700', fontSize: '11.5px' }}>
                                {lead.budget}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark border" style={{ fontSize: '11px' }}>{lead.source}</span>
                            </td>
                            <td>
                              <span style={{ backgroundColor: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, padding: '3px 8px', borderRadius: '6px', fontWeight: '700', fontSize: '11px' }}>
                                {lead.status}
                              </span>
                            </td>
                            <td className="text-end pe-3">
                              <div className="d-flex justify-content-end gap-1">
                                <button 
                                  onClick={() => setSelectedLead(lead)} 
                                  className="btn btn-sm btn-light border" 
                                  style={{ width: '30px', height: '30px', padding: 0, borderRadius: '6px' }}
                                  title="View Details"
                                >
                                  <i className="ri-eye-line text-primary"></i>
                                </button>
                                <button 
                                  onClick={() => setEditingLead(lead)} 
                                  className="btn btn-sm btn-light border text-info" 
                                  style={{ width: '30px', height: '30px', padding: 0, borderRadius: '6px' }}
                                  title="Edit Lead"
                                >
                                  <i className="ri-edit-line"></i>
                                </button>
                                <a 
                                  href={`tel:${lead.phone}`} 
                                  className="btn btn-sm btn-light border text-success" 
                                  style={{ width: '30px', height: '30px', padding: 0, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                                  title="Call Buyer"
                                >
                                  <i className="ri-phone-fill"></i>
                                </a>
                                <a 
                                  href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${lead.full_name},%20regarding%20your%20property%20enquiry%20for%20${lead.property_name}%20with%20Sai%20Reality...`} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="btn btn-sm btn-light border text-success" 
                                  style={{ width: '30px', height: '30px', padding: 0, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                                  title="Chat on WhatsApp"
                                >
                                  <i className="ri-whatsapp-fill"></i>
                                </a>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Site Visits Schedule */}
          <div className="col-xl-4">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '14px' }}>
              <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title mb-0 fw-bold" style={{ fontSize: '15px', color: '#1e293b' }}>
                    Today's Site Visits (3)
                  </h5>
                  <small className="text-muted">Assigned executive visits</small>
                </div>
                <Link to="/dashboard/daily-report" className="btn btn-sm btn-light border text-primary fw-bold" style={{ fontSize: '11px' }}>
                  View All
                </Link>
              </div>
              <div className="card-body p-3">
                <div className="d-flex flex-column gap-3">
                  {upcomingVisits.map((v, i) => (
                    <div key={i} className="p-3 rounded" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className="badge bg-primary fw-bold" style={{ fontSize: '11px' }}>
                          <i className="ri-time-line me-1"></i> {v.time}
                        </span>
                        <span className={`badge ${v.status === 'Confirmed' ? 'bg-success' : 'bg-warning text-dark'}`} style={{ fontSize: '10.5px' }}>
                          {v.status}
                        </span>
                      </div>
                      <div className="fw-bold text-dark" style={{ fontSize: '13.5px' }}>{v.client}</div>
                      <div className="text-muted small mb-2"><i className="ri-building-line text-primary me-1"></i> {v.project}</div>
                      <div className="d-flex justify-content-between align-items-center pt-2 border-top" style={{ fontSize: '11.5px' }}>
                        <span className="text-muted">Executive: <strong>{v.exec}</strong></span>
                        <a href="tel:+919518701503" className="text-success fw-bold text-decoration-none">
                          <i className="ri-phone-fill me-1"></i> Contact
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 p-3 rounded" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #cffafe 100%)', border: '1px solid #bae6fd' }}>
                  <div className="d-flex align-items-center gap-2">
                    <i className="ri-car-fill fs-20 text-primary"></i>
                    <div>
                      <strong className="text-dark" style={{ fontSize: '12.5px' }}>Free Site Visit Cab Service</strong>
                      <div style={{ fontSize: '11px', color: '#0369a1' }}>2 Executive cabs active in Kharadi &amp; Dhanori zone.</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* ── Lead Detail Modal ── */}
        {selectedLead && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="card border-0 shadow-lg" style={{ width: '100%', maxWidth: '540px', borderRadius: '16px', overflow: 'hidden' }}>
              <div className="card-header bg-primary text-white py-3 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <i className="ri-user-star-line fs-18"></i>
                  <h5 className="modal-title mb-0 fw-bold" style={{ fontSize: '16px' }}>Lead Details — #{selectedLead.id}</h5>
                </div>
                <button onClick={() => setSelectedLead(null)} className="btn-close btn-close-white" style={{ fontSize: '12px' }}></button>
              </div>
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                  <img 
                    src={selectedLead.avatar} 
                    alt="" 
                    style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #0284c7' }} 
                  />
                  <div>
                    <h5 className="fw-bold text-dark mb-1">{selectedLead.full_name}</h5>
                    <div className="text-muted small">
                      <i className="ri-phone-line text-success me-1"></i> {selectedLead.phone} &nbsp;|&nbsp; 
                      <i className="ri-mail-line text-primary ms-1 me-1"></i> {selectedLead.email}
                    </div>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '10.5px' }}>Property Requirement</small>
                    <div className="fw-bold text-dark mt-1">{selectedLead.property_name}</div>
                  </div>
                  <div className="col-6">
                    <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '10.5px' }}>Budget Range</small>
                    <div className="fw-bold text-success mt-1">{selectedLead.budget}</div>
                  </div>
                  <div className="col-6">
                    <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '10.5px' }}>Inquiry Source</small>
                    <div className="fw-semibold text-dark mt-1">{selectedLead.source}</div>
                  </div>
                  <div className="col-6">
                    <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '10.5px' }}>Current Status</small>
                    <div className="mt-1">
                      <span className="badge bg-primary fw-bold">{selectedLead.status}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '10.5px' }}>Executive Interaction Notes</small>
                  <div className="p-3 mt-1 rounded" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '12.5px', color: '#334155' }}>
                    {selectedLead.notes}
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <button 
                    onClick={() => {
                      setEditingLead(selectedLead);
                      setSelectedLead(null);
                    }} 
                    className="btn btn-primary fw-bold d-flex align-items-center gap-1" 
                    style={{ borderRadius: '8px' }}
                  >
                    <i className="ri-edit-line"></i> Edit Lead
                  </button>
                  <div className="d-flex gap-2">
                    <button onClick={() => setSelectedLead(null)} className="btn btn-light border fw-semibold" style={{ borderRadius: '8px' }}>
                      Close
                    </button>
                    <a href={`tel:${selectedLead.phone}`} className="btn btn-success fw-bold d-flex align-items-center gap-1" style={{ borderRadius: '8px' }}>
                      <i className="ri-phone-fill"></i> Call Client
                    </a>
                    <a href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="btn btn-outline-primary fw-bold d-flex align-items-center gap-1" style={{ borderRadius: '8px' }}>
                      <i className="ri-whatsapp-fill"></i> WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Edit Lead Modal (Overview) ── */}
        {editingLead && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="card border-0 shadow-lg" style={{ width: '100%', maxWidth: '540px', borderRadius: '16px', overflow: 'hidden' }}>
              <div className="card-header bg-primary text-white py-3 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <i className="ri-edit-line fs-18"></i>
                  <h5 className="modal-title mb-0 fw-bold" style={{ fontSize: '16px' }}>✏️ Edit Lead Details — #{editingLead.id}</h5>
                </div>
                <button onClick={() => setEditingLead(null)} className="btn-close btn-close-white" style={{ fontSize: '12px' }}></button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                setLeads(leads.map(l => l.id === editingLead.id ? {
                  ...l,
                  full_name: fd.get('name') || l.full_name,
                  phone: fd.get('phone') || l.phone,
                  email: fd.get('email') || l.email,
                  property_name: fd.get('property_name') || l.property_name,
                  budget: fd.get('budget') || l.budget,
                  status: fd.get('status') || l.status,
                  source: fd.get('source') || l.source,
                  city: fd.get('city') || l.city,
                  notes: fd.get('notes') || l.notes,
                } : l));
                setEditingLead(null);
              }} className="card-body p-4">
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ fontSize: '12.5px' }}>Full Name *</label>
                  <input required name="name" type="text" className="form-control form-control-sm" defaultValue={editingLead.full_name} />
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label fw-bold" style={{ fontSize: '12.5px' }}>Primary Phone *</label>
                    <input required name="phone" type="text" className="form-control form-control-sm" defaultValue={editingLead.phone} />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-bold" style={{ fontSize: '12.5px' }}>Secondary Phone *</label>
                    <input required name="phone2" type="text" className="form-control form-control-sm" defaultValue={editingLead.phone2 || ''} />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ fontSize: '12.5px' }}>Email Address</label>
                  <input name="email" type="email" className="form-control form-control-sm" defaultValue={editingLead.email} />
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label fw-bold" style={{ fontSize: '12.5px' }}>Property Name</label>
                    <input name="property_name" type="text" className="form-control form-control-sm" defaultValue={editingLead.property_name} />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-bold" style={{ fontSize: '12.5px' }}>Budget</label>
                    <input name="budget" type="text" className="form-control form-control-sm" defaultValue={editingLead.budget} />
                  </div>
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label fw-bold" style={{ fontSize: '12.5px' }}>Status</label>
                    <select name="status" className="form-select form-select-sm" defaultValue={editingLead.status}>
                      <option value="NEW LEAD">NEW LEAD</option>
                      <option value="IN FOLLOWUP">IN FOLLOWUP</option>
                      <option value="SITE VISIT">SITE VISIT</option>
                      <option value="BOOKINGS/ EOI">BOOKINGS/ EOI</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-bold" style={{ fontSize: '12.5px' }}>Source</label>
                    <input name="source" type="text" className="form-control form-control-sm" defaultValue={editingLead.source} />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ fontSize: '12.5px' }}>Interaction Notes</label>
                  <textarea name="notes" rows="2" className="form-control form-control-sm" defaultValue={editingLead.notes}></textarea>
                </div>
                <div className="d-flex justify-content-end gap-2 border-top pt-3">
                  <button type="button" onClick={() => setEditingLead(null)} className="btn btn-light border fw-semibold" style={{ borderRadius: '8px' }}>Cancel</button>
                  <button type="submit" className="btn btn-success fw-bold" style={{ borderRadius: '8px' }}>💾 Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default DashboardOverview;
