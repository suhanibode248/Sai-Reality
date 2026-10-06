import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './DashboardLayout.module.css';

const DashboardLayout = ({ children }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
    const [quickAddOpen, setQuickAddOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isFullscreen, setIsFullscreen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Accordion state for expandable sidebar items
    const [openTransactions, setOpenTransactions] = useState(
        location.pathname.includes('/transactions')
    );
    const [openUsers, setOpenUsers] = useState(
        location.pathname.includes('/users')
    );
    const [openJobs, setOpenJobs] = useState(
        location.pathname.includes('/jobs')
    );

    useEffect(() => {
        if (location.pathname.includes('/transactions')) setOpenTransactions(true);
        if (location.pathname.includes('/users')) setOpenUsers(true);
        if (location.pathname.includes('/jobs')) setOpenJobs(true);
    }, [location.pathname]);

    // Live Clock timer (updates every second)
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (!e.target.closest('#user-profile-menu') && !e.target.closest('#user-profile-btn')) {
                setUserDropdownOpen(false);
            }
            if (!e.target.closest('#notif-menu') && !e.target.closest('#notif-btn')) {
                setNotifDropdownOpen(false);
            }
            if (!e.target.closest('#quick-add-menu') && !e.target.closest('#quick-add-btn')) {
                setQuickAddOpen(false);
            }
        };
        document.addEventListener('click', handleOutsideClick);
        return () => document.removeEventListener('click', handleOutsideClick);
    }, []);

    const isActive = (path) => {
        if (path === '/dashboard/leads/all' && location.pathname.includes('/leads')) return true;
        return location.pathname === path;
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => console.log(err));
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().then(() => setIsFullscreen(false));
            }
        }
    };

    const notificationsList = [
        { id: 1, title: 'New Hot Lead Enquiry', desc: 'Rahul Sharma enquired for 2BHK Lodha Kharadi (1.45 CR)', time: '2 mins ago', icon: 'ri-fire-fill', color: '#ea580c', bg: '#ffedd5', link: '/dashboard/leads/all' },
        { id: 2, title: 'Site Visit Confirmed', desc: 'Priya Patel confirmed visit for Ganga Newtown at 3:30 PM', time: '15 mins ago', icon: 'ri-map-pin-user-fill', color: '#0284c7', bg: '#e0f2fe', link: '/dashboard/daily-report' },
        { id: 3, title: 'Brokerage Payout Cleared', desc: '₹ 2,90,000 RTGS payout received from Lodha Group', time: '1 hour ago', icon: 'ri-money-dollar-circle-fill', color: '#16a34a', bg: '#dcfce7', link: '/dashboard/transactions' }
    ];

    return (
        <div id="layout-wrapper" style={{ backgroundColor: '#f4f6fb', minHeight: '100vh', width: '100%', maxWidth: '100vw', overflowX: 'hidden', display: 'flex', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", boxSizing: 'border-box' }}>
            
            {/* ── Ultra-Modern Luxury Dark Sidebar ── */}
            <aside 
                style={{ 
                    width: sidebarCollapsed ? '72px' : '250px', 
                    background: 'linear-gradient(180deg, #151c2e 0%, #1e2538 100%)', 
                    color: '#fff', 
                    flexShrink: 0,
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 1001,
                    borderRight: '1px solid rgba(255,255,255,0.06)',
                    boxShadow: '4px 0 20px rgba(0,0,0,0.15)'
                }}
            >
                {/* Branded Logo Container with Sai Reality Logo */}
                <div style={{ 
                    padding: '10px 14px', 
                    backgroundColor: '#ffffff', 
                    borderBottom: '1px solid rgba(0,0,0,0.08)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '66px',
                    position: 'relative'
                }}>
                    <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <img 
                            src="/sai_reality_logo.png" 
                            alt="Sai Reality - Means certified properties" 
                            style={{ maxHeight: sidebarCollapsed ? '32px' : '48px', maxWidth: '100%', objectFit: 'contain', transition: 'all 0.2s' }}
                            onError={(e) => { e.target.src = '/logo.png'; }}
                        />
                    </Link>
                </div>

                {/* Sidebar Navigation (Scrollable) */}
                <div className="sidebarNav" style={{ flex: 1, overflowY: 'auto', padding: '12px 8px 24px', scrollbarWidth: 'thin' }}>
                    
                    {/* Main Dashboard Link */}
                    <Link 
                        to="/dashboard"
                        style={{ 
                            padding: sidebarCollapsed ? '10px 0' : '10px 14px', 
                            fontSize: '13.5px', 
                            color: isActive('/dashboard') ? '#ffffff' : '#94a3b8', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                            gap: '12px', 
                            fontWeight: isActive('/dashboard') ? '600' : '500',
                            background: isActive('/dashboard') ? 'linear-gradient(90deg, rgba(0, 210, 211, 0.2) 0%, rgba(0, 210, 211, 0.04) 100%)' : 'transparent',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            borderLeft: isActive('/dashboard') ? '3px solid #00d2d3' : '3px solid transparent',
                            marginBottom: '4px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <i className="ri-dashboard-2-fill" style={{ fontSize: '18px', color: isActive('/dashboard') ? '#00d2d3' : '#94a3b8' }}></i>
                        {!sidebarCollapsed && <span>Executive CRM</span>}
                    </Link>

                    {/* CRM SECTION */}
                    {!sidebarCollapsed && (
                        <div style={{ padding: '14px 14px 6px', fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '800' }}>
                            CRM MODULES
                        </div>
                    )}

                    <Link 
                        to="/dashboard/leads/all" 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                            padding: sidebarCollapsed ? '10px 0' : '9px 14px', 
                            color: isActive('/dashboard/leads/all') ? '#ffffff' : '#94a3b8', 
                            textDecoration: 'none', 
                            fontSize: '13.5px',
                            background: isActive('/dashboard/leads/all') ? 'linear-gradient(90deg, rgba(0, 210, 211, 0.2) 0%, rgba(0, 210, 211, 0.04) 100%)' : 'transparent',
                            fontWeight: isActive('/dashboard/leads/all') ? '600' : '500',
                            borderRadius: '8px',
                            borderLeft: isActive('/dashboard/leads/all') ? '3px solid #00d2d3' : '3px solid transparent',
                            marginBottom: '2px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <i className="ri-contacts-book-2-line" style={{ fontSize: '17px', color: isActive('/dashboard/leads/all') ? '#00d2d3' : '#94a3b8' }}></i>
                            {!sidebarCollapsed && <span>Leads Management</span>}
                        </div>
                        {!sidebarCollapsed && (
                            <span style={{ backgroundColor: '#ea580c', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: '700' }}>
                                14.8k
                            </span>
                        )}
                    </Link>

                    <Link 
                        to="/dashboard/properties" 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                            padding: sidebarCollapsed ? '10px 0' : '9px 14px', 
                            color: isActive('/dashboard/properties') ? '#ffffff' : '#94a3b8', 
                            textDecoration: 'none', 
                            fontSize: '13.5px',
                            background: isActive('/dashboard/properties') ? 'linear-gradient(90deg, rgba(0, 210, 211, 0.2) 0%, rgba(0, 210, 211, 0.04) 100%)' : 'transparent',
                            fontWeight: isActive('/dashboard/properties') ? '600' : '500',
                            borderRadius: '8px',
                            borderLeft: isActive('/dashboard/properties') ? '3px solid #00d2d3' : '3px solid transparent',
                            marginBottom: '2px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <i className="ri-building-line" style={{ fontSize: '17px', color: isActive('/dashboard/properties') ? '#00d2d3' : '#94a3b8' }}></i>
                            {!sidebarCollapsed && <span>Properties</span>}
                        </div>
                        {!sidebarCollapsed && (
                            <span style={{ backgroundColor: '#0284c7', color: '#fff', fontSize: '10.5px', padding: '2px 7px', borderRadius: '10px', fontWeight: '700' }}>
                                808
                            </span>
                        )}
                    </Link>

                    <Link 
                        to="/dashboard/projects" 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                            padding: sidebarCollapsed ? '10px 0' : '9px 14px', 
                            color: isActive('/dashboard/projects') ? '#ffffff' : '#94a3b8', 
                            textDecoration: 'none', 
                            fontSize: '13.5px',
                            background: isActive('/dashboard/projects') ? 'linear-gradient(90deg, rgba(0, 210, 211, 0.2) 0%, rgba(0, 210, 211, 0.04) 100%)' : 'transparent',
                            fontWeight: isActive('/dashboard/projects') ? '600' : '500',
                            borderRadius: '8px',
                            borderLeft: isActive('/dashboard/projects') ? '3px solid #00d2d3' : '3px solid transparent',
                            marginBottom: '2px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <i className="ri-stack-line" style={{ fontSize: '17px', color: isActive('/dashboard/projects') ? '#00d2d3' : '#94a3b8' }}></i>
                            {!sidebarCollapsed && <span>Townships &amp; Projects</span>}
                        </div>
                        {!sidebarCollapsed && (
                            <span style={{ backgroundColor: '#0284c7', color: '#fff', fontSize: '10.5px', padding: '2px 7px', borderRadius: '10px', fontWeight: '700' }}>
                                48
                            </span>
                        )}
                    </Link>

                    <Link 
                        to="/dashboard/daily-report" 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                            padding: sidebarCollapsed ? '10px 0' : '9px 14px', 
                            color: isActive('/dashboard/daily-report') ? '#ffffff' : '#94a3b8', 
                            textDecoration: 'none', 
                            fontSize: '13.5px',
                            background: isActive('/dashboard/daily-report') ? 'linear-gradient(90deg, rgba(0, 210, 211, 0.2) 0%, rgba(0, 210, 211, 0.04) 100%)' : 'transparent',
                            fontWeight: isActive('/dashboard/daily-report') ? '600' : '500',
                            borderRadius: '8px',
                            borderLeft: isActive('/dashboard/daily-report') ? '3px solid #00d2d3' : '3px solid transparent',
                            marginBottom: '2px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <i className="ri-calendar-check-line" style={{ marginRight: sidebarCollapsed ? '0' : '12px', fontSize: '17px', color: isActive('/dashboard/daily-report') ? '#00d2d3' : '#94a3b8' }}></i>
                        {!sidebarCollapsed && <span>Daily Calling Report</span>}
                    </Link>

                    {/* FINANCE & ACCOUNTING SECTION */}
                    {!sidebarCollapsed && (
                        <div style={{ padding: '14px 14px 6px', fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '800' }}>
                            FINANCE &amp; ACCOUNTS
                        </div>
                    )}

                    <Link 
                        to="/dashboard/finance-overview" 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                            padding: sidebarCollapsed ? '10px 0' : '9px 14px', 
                            color: isActive('/dashboard/finance-overview') ? '#ffffff' : '#94a3b8', 
                            textDecoration: 'none', 
                            fontSize: '13.5px',
                            background: isActive('/dashboard/finance-overview') ? 'linear-gradient(90deg, rgba(0, 210, 211, 0.2) 0%, rgba(0, 210, 211, 0.04) 100%)' : 'transparent',
                            fontWeight: isActive('/dashboard/finance-overview') ? '600' : '500',
                            borderRadius: '8px',
                            borderLeft: isActive('/dashboard/finance-overview') ? '3px solid #00d2d3' : '3px solid transparent',
                            marginBottom: '2px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <i className="ri-wallet-3-line" style={{ marginRight: sidebarCollapsed ? '0' : '12px', fontSize: '17px', color: isActive('/dashboard/finance-overview') ? '#00d2d3' : '#94a3b8' }}></i>
                        {!sidebarCollapsed && <span>Finance Overview</span>}
                    </Link>

                    {/* Transactions Accordion */}
                    <div>
                        <div 
                            onClick={() => setOpenTransactions(!openTransactions)}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                                padding: sidebarCollapsed ? '10px 0' : '9px 14px', 
                                color: location.pathname.includes('/transactions') ? '#ffffff' : '#94a3b8', 
                                textDecoration: 'none', 
                                fontSize: '13.5px',
                                cursor: 'pointer',
                                background: location.pathname.includes('/transactions') ? 'linear-gradient(90deg, rgba(0, 210, 211, 0.2) 0%, rgba(0, 210, 211, 0.04) 100%)' : 'transparent',
                                fontWeight: location.pathname.includes('/transactions') ? '600' : '500',
                                borderRadius: '8px',
                                borderLeft: location.pathname.includes('/transactions') ? '3px solid #00d2d3' : '3px solid transparent',
                                marginBottom: '2px',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <i className="ri-exchange-dollar-line" style={{ fontSize: '17px', color: location.pathname.includes('/transactions') ? '#00d2d3' : '#94a3b8' }}></i>
                                {!sidebarCollapsed && <span>Transactions</span>}
                            </div>
                            {!sidebarCollapsed && (
                                <i className={openTransactions ? "ri-arrow-down-s-line" : "ri-arrow-right-s-line"} style={{ fontSize: '15px', opacity: 0.8 }}></i>
                            )}
                        </div>

                        {/* Submenu */}
                        {openTransactions && !sidebarCollapsed && (
                            <div style={{ paddingLeft: '38px', display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '3px', marginBottom: '6px' }}>
                                <Link 
                                    to="/dashboard/transactions/income" 
                                    style={{ color: location.pathname === '/dashboard/transactions/income' ? '#00d2d3' : '#94a3b8', textDecoration: 'none', fontSize: '12.5px', padding: '4px 0', fontWeight: location.pathname === '/dashboard/transactions/income' ? '700' : '400' }}
                                >
                                    • Income &amp; Brokerage
                                </Link>
                                <Link 
                                    to="/dashboard/transactions/expenses" 
                                    style={{ color: location.pathname === '/dashboard/transactions/expenses' ? '#00d2d3' : '#94a3b8', textDecoration: 'none', fontSize: '12.5px', padding: '4px 0', fontWeight: location.pathname === '/dashboard/transactions/expenses' ? '700' : '400' }}
                                >
                                    • Office Expenses
                                </Link>
                                <Link 
                                    to="/dashboard/transactions" 
                                    style={{ color: location.pathname === '/dashboard/transactions' ? '#00d2d3' : '#94a3b8', textDecoration: 'none', fontSize: '12.5px', padding: '4px 0', fontWeight: location.pathname === '/dashboard/transactions' ? '700' : '400' }}
                                >
                                    • All Ledgers
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* MASTER SECTION */}
                    {!sidebarCollapsed && (
                        <div style={{ padding: '14px 14px 6px', fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '800' }}>
                            MASTER &amp; USERS
                        </div>
                    )}

                    <Link 
                        to="/dashboard/my-account" 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                            padding: sidebarCollapsed ? '10px 0' : '9px 14px', 
                            color: isActive('/dashboard/my-account') ? '#ffffff' : '#94a3b8', 
                            textDecoration: 'none', 
                            fontSize: '13.5px',
                            background: isActive('/dashboard/my-account') ? 'linear-gradient(90deg, rgba(0, 210, 211, 0.2) 0%, rgba(0, 210, 211, 0.04) 100%)' : 'transparent',
                            fontWeight: isActive('/dashboard/my-account') ? '600' : '500',
                            borderRadius: '8px',
                            borderLeft: isActive('/dashboard/my-account') ? '3px solid #00d2d3' : '3px solid transparent',
                            marginBottom: '2px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <i className="ri-user-settings-line" style={{ marginRight: sidebarCollapsed ? '0' : '12px', fontSize: '17px', color: isActive('/dashboard/my-account') ? '#00d2d3' : '#94a3b8' }}></i>
                        {!sidebarCollapsed && <span>My Account</span>}
                    </Link>

                    {/* Users Accordion */}
                    <div>
                        <div 
                            onClick={() => setOpenUsers(!openUsers)}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                                padding: sidebarCollapsed ? '10px 0' : '9px 14px', 
                                color: location.pathname.includes('/users') ? '#ffffff' : '#94a3b8', 
                                textDecoration: 'none', 
                                fontSize: '13.5px',
                                cursor: 'pointer',
                                background: location.pathname.includes('/users') ? 'linear-gradient(90deg, rgba(0, 210, 211, 0.2) 0%, rgba(0, 210, 211, 0.04) 100%)' : 'transparent',
                                fontWeight: location.pathname.includes('/users') ? '600' : '500',
                                borderRadius: '8px',
                                borderLeft: location.pathname.includes('/users') ? '3px solid #00d2d3' : '3px solid transparent',
                                marginBottom: '2px',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <i className="ri-team-line" style={{ fontSize: '17px', color: location.pathname.includes('/users') ? '#00d2d3' : '#94a3b8' }}></i>
                                {!sidebarCollapsed && <span>Staff &amp; Attendance</span>}
                            </div>
                            {!sidebarCollapsed && (
                                <i className={openUsers ? "ri-arrow-down-s-line" : "ri-arrow-right-s-line"} style={{ fontSize: '15px', opacity: 0.8 }}></i>
                            )}
                        </div>

                        {/* Submenu */}
                        {openUsers && !sidebarCollapsed && (
                            <div style={{ paddingLeft: '38px', display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '3px', marginBottom: '6px' }}>
                                <Link 
                                    to="/dashboard/users" 
                                    style={{ color: location.pathname === '/dashboard/users' ? '#00d2d3' : '#94a3b8', textDecoration: 'none', fontSize: '12.5px', padding: '4px 0', fontWeight: location.pathname === '/dashboard/users' ? '700' : '400' }}
                                >
                                    • Users Directory
                                </Link>
                                <Link 
                                    to="/dashboard/users/attendance" 
                                    style={{ color: location.pathname === '/dashboard/users/attendance' ? '#00d2d3' : '#94a3b8', textDecoration: 'none', fontSize: '12.5px', padding: '4px 0', fontWeight: location.pathname === '/dashboard/users/attendance' ? '700' : '400' }}
                                >
                                    • Daily Attendance
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Jobs & Applications Accordion */}
                    <div>
                        <div 
                            onClick={() => setOpenJobs(!openJobs)}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                                padding: sidebarCollapsed ? '10px 0' : '9px 14px', 
                                color: location.pathname.includes('/jobs') ? '#ffffff' : '#94a3b8', 
                                textDecoration: 'none', 
                                fontSize: '13.5px',
                                cursor: 'pointer',
                                background: location.pathname.includes('/jobs') ? 'linear-gradient(90deg, rgba(0, 210, 211, 0.2) 0%, rgba(0, 210, 211, 0.04) 100%)' : 'transparent',
                                fontWeight: location.pathname.includes('/jobs') ? '600' : '500',
                                borderRadius: '8px',
                                borderLeft: location.pathname.includes('/jobs') ? '3px solid #00d2d3' : '3px solid transparent',
                                marginBottom: '2px',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <i className="ri-briefcase-line" style={{ fontSize: '17px', color: location.pathname.includes('/jobs') ? '#00d2d3' : '#94a3b8' }}></i>
                                {!sidebarCollapsed && <span>Careers &amp; Jobs</span>}
                            </div>
                            {!sidebarCollapsed && (
                                <i className={openJobs ? "ri-arrow-down-s-line" : "ri-arrow-right-s-line"} style={{ fontSize: '15px', opacity: 0.8 }}></i>
                            )}
                        </div>

                        {/* Submenu */}
                        {openJobs && !sidebarCollapsed && (
                            <div style={{ paddingLeft: '38px', display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '3px', marginBottom: '6px' }}>
                                <Link 
                                    to="/dashboard/jobs" 
                                    style={{ color: location.pathname === '/dashboard/jobs' ? '#00d2d3' : '#94a3b8', textDecoration: 'none', fontSize: '12.5px', padding: '4px 0', fontWeight: location.pathname === '/dashboard/jobs' ? '700' : '400' }}
                                >
                                    • Job Postings
                                </Link>
                                <Link 
                                    to="/dashboard/jobs/applications" 
                                    style={{ color: location.pathname === '/dashboard/jobs/applications' ? '#00d2d3' : '#94a3b8', textDecoration: 'none', fontSize: '12.5px', padding: '4px 0', fontWeight: location.pathname === '/dashboard/jobs/applications' ? '700' : '400' }}
                                >
                                    • Candidate Resumes
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* WEBSITE & MARKETING SECTION */}
                    {!sidebarCollapsed && (
                        <div style={{ padding: '14px 14px 6px', fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '800' }}>
                            WEBSITE &amp; MARKETING
                        </div>
                    )}

                    <Link 
                        to="/dashboard/media-gallery" 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                            padding: sidebarCollapsed ? '10px 0' : '9px 14px', 
                            color: isActive('/dashboard/media-gallery') ? '#ffffff' : '#94a3b8', 
                            textDecoration: 'none', 
                            fontSize: '13.5px',
                            background: isActive('/dashboard/media-gallery') ? 'linear-gradient(90deg, rgba(0, 210, 211, 0.2) 0%, rgba(0, 210, 211, 0.04) 100%)' : 'transparent',
                            fontWeight: isActive('/dashboard/media-gallery') ? '600' : '500',
                            borderRadius: '8px',
                            borderLeft: isActive('/dashboard/media-gallery') ? '3px solid #00d2d3' : '3px solid transparent',
                            marginBottom: '2px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <i className="ri-image-2-line" style={{ marginRight: sidebarCollapsed ? '0' : '12px', fontSize: '17px', color: isActive('/dashboard/media-gallery') ? '#00d2d3' : '#94a3b8' }}></i>
                        {!sidebarCollapsed && <span>Media Gallery</span>}
                    </Link>

                    <Link 
                        to="/dashboard/website-slider" 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                            padding: sidebarCollapsed ? '10px 0' : '9px 14px', 
                            color: isActive('/dashboard/website-slider') ? '#ffffff' : '#94a3b8', 
                            textDecoration: 'none', 
                            fontSize: '13.5px',
                            background: isActive('/dashboard/website-slider') ? 'linear-gradient(90deg, rgba(0, 210, 211, 0.2) 0%, rgba(0, 210, 211, 0.04) 100%)' : 'transparent',
                            fontWeight: isActive('/dashboard/website-slider') ? '600' : '500',
                            borderRadius: '8px',
                            borderLeft: isActive('/dashboard/website-slider') ? '3px solid #00d2d3' : '3px solid transparent',
                            marginBottom: '2px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <i className="ri-slideshow-line" style={{ marginRight: sidebarCollapsed ? '0' : '12px', fontSize: '17px', color: isActive('/dashboard/website-slider') ? '#00d2d3' : '#94a3b8' }}></i>
                        {!sidebarCollapsed && <span>Hero Sliders</span>}
                    </Link>

                    <Link 
                        to="/dashboard/website-offer" 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                            padding: sidebarCollapsed ? '10px 0' : '9px 14px', 
                            color: isActive('/dashboard/website-offer') ? '#ffffff' : '#94a3b8', 
                            textDecoration: 'none', 
                            fontSize: '13.5px',
                            background: isActive('/dashboard/website-offer') ? 'linear-gradient(90deg, rgba(0, 210, 211, 0.2) 0%, rgba(0, 210, 211, 0.04) 100%)' : 'transparent',
                            fontWeight: isActive('/dashboard/website-offer') ? '600' : '500',
                            borderRadius: '8px',
                            borderLeft: isActive('/dashboard/website-offer') ? '3px solid #00d2d3' : '3px solid transparent',
                            marginBottom: '2px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <i className="ri-gift-2-line" style={{ marginRight: sidebarCollapsed ? '0' : '12px', fontSize: '17px', color: isActive('/dashboard/website-offer') ? '#00d2d3' : '#94a3b8' }}></i>
                        {!sidebarCollapsed && <span>Festival Offers</span>}
                    </Link>

                    <Link 
                        to="/dashboard/reviews" 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                            padding: sidebarCollapsed ? '10px 0' : '9px 14px', 
                            color: isActive('/dashboard/reviews') ? '#ffffff' : '#94a3b8', 
                            textDecoration: 'none', 
                            fontSize: '13.5px',
                            background: isActive('/dashboard/reviews') ? 'linear-gradient(90deg, rgba(0, 210, 211, 0.2) 0%, rgba(0, 210, 211, 0.04) 100%)' : 'transparent',
                            fontWeight: isActive('/dashboard/reviews') ? '600' : '500',
                            borderRadius: '8px',
                            borderLeft: isActive('/dashboard/reviews') ? '3px solid #00d2d3' : '3px solid transparent',
                            marginBottom: '2px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <i className="ri-star-line" style={{ marginRight: sidebarCollapsed ? '0' : '12px', fontSize: '17px', color: isActive('/dashboard/reviews') ? '#00d2d3' : '#94a3b8' }}></i>
                        {!sidebarCollapsed && <span>Client Reviews</span>}
                    </Link>

                    <Link 
                        to="/dashboard/contact" 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                            padding: sidebarCollapsed ? '10px 0' : '9px 14px', 
                            color: isActive('/dashboard/contact') ? '#ffffff' : '#94a3b8', 
                            textDecoration: 'none', 
                            fontSize: '13.5px',
                            background: isActive('/dashboard/contact') ? 'linear-gradient(90deg, rgba(0, 210, 211, 0.2) 0%, rgba(0, 210, 211, 0.04) 100%)' : 'transparent',
                            fontWeight: isActive('/dashboard/contact') ? '600' : '500',
                            borderRadius: '8px',
                            borderLeft: isActive('/dashboard/contact') ? '3px solid #00d2d3' : '3px solid transparent',
                            marginBottom: '2px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <i className="ri-phone-line" style={{ marginRight: sidebarCollapsed ? '0' : '12px', fontSize: '17px', color: isActive('/dashboard/contact') ? '#00d2d3' : '#94a3b8' }}></i>
                        {!sidebarCollapsed && <span>Contact Details</span>}
                    </Link>

                    <Link 
                        to="/dashboard/gcode" 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                            padding: sidebarCollapsed ? '10px 0' : '9px 14px', 
                            color: isActive('/dashboard/gcode') ? '#ffffff' : '#94a3b8', 
                            textDecoration: 'none', 
                            fontSize: '13.5px',
                            background: isActive('/dashboard/gcode') ? 'linear-gradient(90deg, rgba(0, 210, 211, 0.2) 0%, rgba(0, 210, 211, 0.04) 100%)' : 'transparent',
                            fontWeight: isActive('/dashboard/gcode') ? '600' : '500',
                            borderRadius: '8px',
                            borderLeft: isActive('/dashboard/gcode') ? '3px solid #00d2d3' : '3px solid transparent',
                            marginBottom: '2px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span style={{ display: 'inline-flex', alignItems: 'flex-end', gap: '2px', marginRight: sidebarCollapsed ? '0' : '12px', height: '16px' }}>
                            <span style={{ width: '3.5px', height: '6px', backgroundColor: '#f59e0b', borderRadius: '1px' }}></span>
                            <span style={{ width: '3.5px', height: '11px', backgroundColor: '#f97316', borderRadius: '1px' }}></span>
                            <span style={{ width: '3.5px', height: '16px', backgroundColor: '#ea580c', borderRadius: '1px' }}></span>
                        </span>
                        {!sidebarCollapsed && <span>Google Analytics</span>}
                    </Link>

                    {/* SUPPORT & LOGOUT */}
                    {!sidebarCollapsed && (
                        <div style={{ padding: '14px 14px 6px', fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '800' }}>
                            SUPPORT &amp; SYSTEM
                        </div>
                    )}

                    <Link 
                        to="/dashboard/faq" 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                            padding: sidebarCollapsed ? '10px 0' : '9px 14px', 
                            color: isActive('/dashboard/faq') ? '#ffffff' : '#94a3b8', 
                            textDecoration: 'none', 
                            fontSize: '13.5px',
                            background: isActive('/dashboard/faq') ? 'linear-gradient(90deg, rgba(0, 210, 211, 0.2) 0%, rgba(0, 210, 211, 0.04) 100%)' : 'transparent',
                            fontWeight: isActive('/dashboard/faq') ? '600' : '500',
                            borderRadius: '8px',
                            borderLeft: isActive('/dashboard/faq') ? '3px solid #00d2d3' : '3px solid transparent',
                            marginBottom: '2px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <i className="ri-questionnaire-line" style={{ marginRight: sidebarCollapsed ? '0' : '12px', fontSize: '17px', color: isActive('/dashboard/faq') ? '#00d2d3' : '#94a3b8' }}></i>
                        {!sidebarCollapsed && <span>FAQ &amp; Knowledgebase</span>}
                    </Link>

                    <Link 
                        to="/dashboard/help" 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                            padding: sidebarCollapsed ? '10px 0' : '9px 14px', 
                            color: isActive('/dashboard/help') ? '#ffffff' : '#94a3b8', 
                            textDecoration: 'none', 
                            fontSize: '13.5px',
                            background: isActive('/dashboard/help') ? 'linear-gradient(90deg, rgba(0, 210, 211, 0.2) 0%, rgba(0, 210, 211, 0.04) 100%)' : 'transparent',
                            fontWeight: isActive('/dashboard/help') ? '600' : '500',
                            borderRadius: '8px',
                            borderLeft: isActive('/dashboard/help') ? '3px solid #00d2d3' : '3px solid transparent',
                            marginBottom: '2px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <i className="ri-customer-service-2-line" style={{ marginRight: sidebarCollapsed ? '0' : '12px', fontSize: '17px', color: isActive('/dashboard/help') ? '#00d2d3' : '#94a3b8' }}></i>
                        {!sidebarCollapsed && <span>Help Desk</span>}
                    </Link>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '12px 6px 6px' }}></div>

                    <Link 
                        to="/dashboard/user-logout" 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                            padding: sidebarCollapsed ? '10px 0' : '9px 14px', 
                            color: '#f87171', 
                            textDecoration: 'none', 
                            fontSize: '13.5px',
                            fontWeight: '600',
                            borderRadius: '8px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <i className="ri-logout-box-r-line" style={{ marginRight: sidebarCollapsed ? '0' : '12px', fontSize: '17px' }}></i>
                        {!sidebarCollapsed && <span>Sign Out</span>}
                    </Link>
                </div>

                {/* Sidebar Bottom Profile Card */}
                {!sidebarCollapsed && (
                    <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ position: 'relative' }}>
                                <img 
                                    src="/static/dashboard/assets/images/users/avatar-1.jpg" 
                                    alt="Admin" 
                                    style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #00d2d3' }} 
                                    onError={(e) => { e.target.src = '/logo.png'; }}
                                />
                                <span style={{ position: 'absolute', bottom: '0', right: '0', width: '9px', height: '9px', backgroundColor: '#10b981', border: '2px solid #151c2e', borderRadius: '50%' }}></span>
                            </div>
                            <div>
                                <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#ffffff', lineHeight: 1.2 }}>Sai Admin</div>
                                <small style={{ fontSize: '10.5px', color: '#00d2d3' }}>Super Admin</small>
                            </div>
                        </div>
                        <Link to="/home" target="_blank" title="Open Public Website" style={{ color: '#94a3b8', fontSize: '16px' }}>
                            <i className="ri-external-link-line"></i>
                        </Link>
                    </div>
                )}
            </aside>

            {/* ── Main Taskbar (Topbar) & Content Area with Accurate Width Boundaries ── */}
            <div style={{ 
                marginLeft: sidebarCollapsed ? '72px' : '250px', 
                width: sidebarCollapsed ? 'calc(100% - 72px)' : 'calc(100% - 250px)',
                maxWidth: sidebarCollapsed ? 'calc(100% - 72px)' : 'calc(100% - 250px)',
                minWidth: 0,
                minHeight: '100vh', 
                display: 'flex', 
                flexDirection: 'column', 
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                boxSizing: 'border-box',
                overflowX: 'hidden'
            }}>
                
                {/* ── High-End Frosted Glass Topbar / Taskbar ── */}
                <header style={{ 
                    height: '66px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid #e2e8f0', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '0 20px', 
                    position: 'sticky', 
                    top: 0, 
                    zIndex: 1000, 
                    boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.04)',
                    width: '100%',
                    boxSizing: 'border-box'
                }}>
                    {/* Left Side: Sidebar Toggle, Global Search, System Status */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                        <button 
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            style={{ 
                                background: '#f8fafc', 
                                border: '1px solid #e2e8f0', 
                                fontSize: '18px', 
                                color: '#334155', 
                                cursor: 'pointer', 
                                width: '38px', 
                                height: '38px', 
                                borderRadius: '10px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                transition: 'all 0.2s',
                                flexShrink: 0,
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                            }}
                            title="Toggle Sidebar"
                        >
                            <i className={sidebarCollapsed ? "ri-menu-unfold-line" : "ri-menu-fold-line"}></i>
                        </button>

                        {/* Search Input Bar with Shortcut Indicator */}
                        <div style={{ position: 'relative', width: '220px', maxWidth: '240px' }} className="d-none d-md-block">
                            <i className="ri-search-2-line" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '14px' }}></i>
                            <input 
                                type="text" 
                                placeholder="Search CRM..." 
                                style={{ 
                                    width: '100%', 
                                    padding: '7px 54px 7px 32px', 
                                    border: '1px solid #e2e8f0', 
                                    borderRadius: '8px', 
                                    fontSize: '12.5px', 
                                    outline: 'none', 
                                    backgroundColor: '#f8fafc',
                                    transition: 'all 0.2s'
                                }}
                                onFocus={(e) => { e.target.style.backgroundColor = '#ffffff'; e.target.style.borderColor = '#0284c7'; }}
                                onBlur={(e) => { e.target.style.backgroundColor = '#f8fafc'; e.target.style.borderColor = '#e2e8f0'; }}
                            />
                            <span style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', backgroundColor: '#e2e8f0', color: '#64748b', fontSize: '9.5px', padding: '1px 4px', borderRadius: '3px', fontWeight: '600', pointerEvents: 'none' }}>
                                Ctrl K
                            </span>
                        </div>

                        {/* Live HQ Status Pill */}
                        <div className="d-none d-xl-flex align-items-center gap-2 px-2 py-1 bg-light rounded-pill border" style={{ fontSize: '11.5px', color: '#475569', flexShrink: 0 }}>
                            <span className={styles.livePulseDot}></span>
                            <span className="fw-semibold">Pune HQ</span>
                            <span className="text-muted">| Live</span>
                        </div>
                    </div>

                    {/* Right Side: Quick Link to Website, Live Clock, Create +, Notifications, User Profile */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        
                        {/* Direct Fast Jump to Public Website (/home) */}
                        <Link 
                            to="/home" 
                            target="_blank"
                            className="btn btn-sm d-none d-lg-flex align-items-center gap-1"
                            style={{ 
                                backgroundColor: '#f1f5f9', 
                                color: '#0f172a', 
                                border: '1px solid #e2e8f0', 
                                fontWeight: '600', 
                                borderRadius: '8px', 
                                padding: '5px 10px', 
                                fontSize: '12px',
                                textDecoration: 'none'
                            }}
                            title="Open Sai Reality Public Website"
                        >
                            <i className="ri-external-link-line text-primary"></i>
                            <span>View Website</span>
                        </Link>

                        {/* Live Digital Clock Badge */}
                        <div className="d-none d-sm-flex align-items-center gap-1 px-2 py-1 rounded-pill" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '11.5px', color: '#334155' }}>
                            <i className="ri-time-line text-primary"></i>
                            <span className="fw-bold">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                            <span className="text-muted" style={{ fontSize: '10px' }}>IST</span>
                        </div>

                        {/* Quick Create Dropdown Button */}
                        <div style={{ position: 'relative' }}>
                            <button 
                                id="quick-add-btn"
                                onClick={() => setQuickAddOpen(!quickAddOpen)}
                                style={{ 
                                    background: 'linear-gradient(135deg, #00b894 0%, #00947a 100%)', 
                                    border: 'none', 
                                    color: '#ffffff', 
                                    padding: '6px 12px', 
                                    borderRadius: '8px', 
                                    fontSize: '12.5px', 
                                    fontWeight: '700', 
                                    cursor: 'pointer', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '5px',
                                    boxShadow: '0 2px 8px rgba(0,184,148,0.25)',
                                    transition: 'all 0.2s'
                                }}
                                title="Quick Create Action"
                            >
                                <i className="ri-add-line fs-14"></i>
                                <span>+ Create</span>
                                <i className="ri-arrow-down-s-line" style={{ fontSize: '11px' }}></i>
                            </button>

                            {quickAddOpen && (
                                <div id="quick-add-menu" className={styles.dropdownFadeIn} style={{ position: 'absolute', right: 0, top: '44px', width: '230px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 12px 36px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', zIndex: 1050, padding: '8px 0' }}>
                                    <div style={{ padding: '6px 16px 8px', borderBottom: '1px solid #f1f5f9' }}>
                                        <small style={{ color: '#94a3b8', fontSize: '10.5px', textTransform: 'uppercase', fontWeight: '800' }}>Quick Actions</small>
                                    </div>
                                    <Link to="/dashboard/leads/all" onClick={() => setQuickAddOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 16px', color: '#1e293b', textDecoration: 'none', fontSize: '13px' }}>
                                        <span style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}><i className="ri-user-add-line"></i></span>
                                        <strong>+ Add New Lead</strong>
                                    </Link>
                                    <Link to="/dashboard/properties" onClick={() => setQuickAddOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 16px', color: '#1e293b', textDecoration: 'none', fontSize: '13px' }}>
                                        <span style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}><i className="ri-building-line"></i></span>
                                        <strong>+ Add Property</strong>
                                    </Link>
                                    <Link to="/dashboard/transactions" onClick={() => setQuickAddOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 16px', color: '#1e293b', textDecoration: 'none', fontSize: '13px' }}>
                                        <span style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}><i className="ri-money-dollar-circle-line"></i></span>
                                        <strong>+ Record Payment</strong>
                                    </Link>
                                    <Link to="/dashboard/daily-report" onClick={() => setQuickAddOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 16px', color: '#1e293b', textDecoration: 'none', fontSize: '13px' }}>
                                        <span style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}><i className="ri-calendar-event-line"></i></span>
                                        <strong>+ Log Site Visit</strong>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Fullscreen Toggle */}
                        <button 
                            onClick={toggleFullscreen}
                            style={{ 
                                background: '#f8fafc', 
                                border: '1px solid #e2e8f0', 
                                color: '#475569', 
                                width: '36px', 
                                height: '36px', 
                                borderRadius: '8px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                cursor: 'pointer',
                                fontSize: '15px'
                            }}
                            title="Toggle Fullscreen"
                        >
                            <i className={isFullscreen ? "ri-fullscreen-exit-line" : "ri-fullscreen-line"}></i>
                        </button>

                        {/* Notifications Center */}
                        <div style={{ position: 'relative' }}>
                            <button 
                                id="notif-btn"
                                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                                style={{ 
                                    background: '#f8fafc', 
                                    border: '1px solid #e2e8f0', 
                                    color: '#475569', 
                                    width: '36px', 
                                    height: '36px', 
                                    borderRadius: '8px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    cursor: 'pointer', 
                                    position: 'relative',
                                    fontSize: '16px'
                                }}
                                title="Notifications"
                            >
                                <i className="ri-notification-3-line"></i>
                                <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%', border: '1.5px solid #fff' }}></span>
                            </button>

                            {notifDropdownOpen && (
                                <div id="notif-menu" className={styles.dropdownFadeIn} style={{ position: 'absolute', right: 0, top: '44px', width: '320px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 14px 40px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', zIndex: 1050, overflow: 'hidden' }}>
                                    <div style={{ padding: '10px 14px', backgroundColor: '#0284c7', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div className="fw-bold" style={{ fontSize: '13px' }}>CRM Notifications</div>
                                        <span className="badge bg-warning text-dark fw-bold">3 New</span>
                                    </div>
                                    <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                                        {notificationsList.map(n => (
                                            <Link 
                                                key={n.id} 
                                                to={n.link} 
                                                onClick={() => setNotifDropdownOpen(false)}
                                                style={{ display: 'flex', gap: '10px', padding: '10px 14px', borderBottom: '1px solid #f1f5f9', textDecoration: 'none', color: '#1e293b', transition: 'background 0.2s' }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                                            >
                                                <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: n.bg, color: n.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '16px' }}>
                                                    <i className={n.icon}></i>
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div className="fw-bold" style={{ fontSize: '12px' }}>{n.title}</div>
                                                    <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.desc}</div>
                                                    <small style={{ fontSize: '10px', color: '#94a3b8' }}>{n.time}</small>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    <div style={{ padding: '8px 14px', textAlign: 'center', backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                                        <Link to="/dashboard/leads/all" onClick={() => setNotifDropdownOpen(false)} style={{ fontSize: '11.5px', color: '#0284c7', fontWeight: '700', textDecoration: 'none' }}>
                                            View All Live Leads &rarr;
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Profile Avatar Dropdown */}
                        <div style={{ position: 'relative' }}>
                            <div 
                                id="user-profile-btn"
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '6px', 
                                    cursor: 'pointer', 
                                    padding: '3px 6px', 
                                    borderRadius: '8px', 
                                    transition: 'background 0.2s',
                                    border: '1px solid #e2e8f0',
                                    backgroundColor: '#f8fafc'
                                }}
                            >
                                <img 
                                    src="/static/dashboard/assets/images/users/avatar-1.jpg" 
                                    alt="Admin" 
                                    style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                                    onError={(e) => { e.target.src = '/logo.png'; }}
                                />
                                <div className="d-none d-md-block text-start">
                                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b', lineHeight: 1.1 }}>Sai Admin</div>
                                    <small style={{ fontSize: '9.5px', color: '#64748b' }}>Admin</small>
                                </div>
                                <i className="ri-arrow-down-s-line text-muted" style={{ fontSize: '11px' }}></i>
                            </div>

                            {userDropdownOpen && (
                                <div id="user-profile-menu" className={styles.dropdownFadeIn} style={{ position: 'absolute', right: 0, top: '44px', width: '210px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 14px 40px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', zIndex: 1050, padding: '6px 0' }}>
                                    <div style={{ padding: '8px 14px', borderBottom: '1px solid #f1f5f9' }}>
                                        <div className="fw-bold" style={{ fontSize: '12.5px', color: '#0f172a' }}>Sai Reality Administrator</div>
                                        <small className="text-muted" style={{ fontSize: '10.5px' }}>admin@saireality.in</small>
                                    </div>
                                    <Link to="/dashboard/my-account" onClick={() => setUserDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', color: '#334155', textDecoration: 'none', fontSize: '12.5px' }}>
                                        <i className="ri-user-settings-line text-primary"></i> Account Settings
                                    </Link>
                                    <Link to="/dashboard/daily-report" onClick={() => setUserDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', color: '#334155', textDecoration: 'none', fontSize: '12.5px' }}>
                                        <i className="ri-file-chart-line text-success"></i> Daily Reports
                                    </Link>
                                    <Link to="/home" target="_blank" onClick={() => setUserDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', color: '#334155', textDecoration: 'none', fontSize: '12.5px' }}>
                                        <i className="ri-window-line text-warning"></i> Open Public Website
                                    </Link>
                                    <div style={{ borderTop: '1px solid #f1f5f9', margin: '4px 0' }}></div>
                                    <Link to="/dashboard/user-logout" onClick={() => setUserDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', color: '#ef4444', textDecoration: 'none', fontSize: '12.5px', fontWeight: '600' }}>
                                        <i className="ri-logout-box-r-line"></i> Sign Out
                                    </Link>
                                </div>
                            )}
                        </div>

                    </div>
                </header>

                {/* ── Main Dynamic Content Container ── */}
                <main style={{ 
                    flex: 1, 
                    padding: '20px 20px', 
                    backgroundColor: '#f4f6fb', 
                    width: '100%', 
                    maxWidth: '100%',
                    minWidth: 0, 
                    boxSizing: 'border-box',
                    overflowX: 'hidden'
                }}>
                    {children}
                </main>

                {/* ── Minimalist Clean Footer ── */}
                <footer style={{ padding: '12px 20px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', fontSize: '11.5px', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
                    <div>
                        &copy; 2026 <strong>Sai Reality Certified Properties</strong>. All rights reserved.
                    </div>
                    <div style={{ display: 'flex', gap: '14px' }}>
                        <Link to="/dashboard/faq" style={{ color: '#64748b', textDecoration: 'none' }}>FAQ</Link>
                        <Link to="/dashboard/help" style={{ color: '#64748b', textDecoration: 'none' }}>Help Desk</Link>
                        <Link to="/home" target="_blank" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: '600' }}>Live Site &rarr;</Link>
                    </div>
                </footer>

            </div>

        </div>
    );
};

export default DashboardLayout;
