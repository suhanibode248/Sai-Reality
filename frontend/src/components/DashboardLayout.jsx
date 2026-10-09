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
            
            {/* ── Velzon Style Sidebar ── */}
            <aside 
                style={{ 
                    width: sidebarCollapsed ? '72px' : '250px', 
                    backgroundColor: '#405189', 
                    color: '#abb9e8', 
                    flexShrink: 0,
                    transition: 'all 0.25s ease',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 1001,
                    boxShadow: '0 2px 4px rgba(15, 34, 58, 0.12)'
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

                {/* Sidebar Navigation */}
                <div className="sidebarNav" style={{ flex: 1, overflowY: 'auto', padding: '10px 0 24px', scrollbarWidth: 'thin' }}>
                    
                    {/* Dashboards */}
                    <Link 
                        to="/dashboard"
                        style={{ 
                            padding: '10px 20px', 
                            fontSize: '14.5px', 
                            color: isActive('/dashboard') ? '#ffffff' : '#abb9e8', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                            gap: '12px', 
                            textDecoration: 'none',
                            transition: 'all 0.2s',
                            fontWeight: isActive('/dashboard') ? '500' : '400'
                        }}
                    >
                        <i className="ri-dashboard-2-line" style={{ fontSize: '18px' }}></i>
                        {!sidebarCollapsed && <span>Dashboards</span>}
                    </Link>

                    {/* CRM SECTION */}
                    {!sidebarCollapsed && (
                        <div style={{ padding: '12px 20px 4px', fontSize: '11px', color: '#838fb9', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', marginTop: '10px' }}>
                            CRM
                        </div>
                    )}

                    <Link 
                        to="/dashboard/leads/all" 
                        style={{ 
                            padding: '10px 20px', fontSize: '14.5px', color: isActive('/dashboard/leads/all') ? '#ffffff' : '#abb9e8', 
                            display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'space-between', textDecoration: 'none', transition: 'all 0.2s', fontWeight: isActive('/dashboard/leads/all') ? '500' : '400'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <i className="ri-file-list-3-line" style={{ fontSize: '18px' }}></i>
                            {!sidebarCollapsed && <span>Leads</span>}
                        </div>
                        {!sidebarCollapsed && (
                            <span style={{ backgroundColor: 'rgba(10, 179, 156, 0.15)', color: '#0ab39c', fontSize: '11px', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>
                                14863
                            </span>
                        )}
                    </Link>

                    <Link 
                        to="/dashboard/properties" 
                        style={{ 
                            padding: '10px 20px', fontSize: '14.5px', color: isActive('/dashboard/properties') ? '#ffffff' : '#abb9e8', 
                            display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'space-between', textDecoration: 'none', transition: 'all 0.2s', fontWeight: isActive('/dashboard/properties') ? '500' : '400'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <i className="ri-building-line" style={{ fontSize: '18px' }}></i>
                            {!sidebarCollapsed && <span>Properties</span>}
                        </div>
                        {!sidebarCollapsed && (
                            <span style={{ backgroundColor: 'rgba(10, 179, 156, 0.15)', color: '#0ab39c', fontSize: '11px', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>
                                808
                            </span>
                        )}
                    </Link>

                    <Link 
                        to="/dashboard/projects" 
                        style={{ 
                            padding: '10px 20px', fontSize: '14.5px', color: isActive('/dashboard/projects') ? '#ffffff' : '#abb9e8', 
                            display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'space-between', textDecoration: 'none', transition: 'all 0.2s', fontWeight: isActive('/dashboard/projects') ? '500' : '400'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <i className="ri-building-4-line" style={{ fontSize: '18px' }}></i>
                            {!sidebarCollapsed && <span>Projects</span>}
                        </div>
                        {!sidebarCollapsed && (
                            <span style={{ backgroundColor: 'rgba(10, 179, 156, 0.15)', color: '#0ab39c', fontSize: '11px', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>
                                48
                            </span>
                        )}
                    </Link>

                    <Link 
                        to="/dashboard/daily-report" 
                        style={{ 
                            padding: '10px 20px', fontSize: '14.5px', color: isActive('/dashboard/daily-report') ? '#ffffff' : '#abb9e8', 
                            display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: '12px', textDecoration: 'none', transition: 'all 0.2s', fontWeight: isActive('/dashboard/daily-report') ? '500' : '400'
                        }}
                    >
                        <i className="ri-time-line" style={{ fontSize: '18px' }}></i>
                        {!sidebarCollapsed && <span>Daily Report</span>}
                    </Link>

                    {/* FINANCE & ACCOUNTING SECTION */}
                    {!sidebarCollapsed && (
                        <div style={{ padding: '12px 20px 4px', fontSize: '11px', color: '#838fb9', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', marginTop: '10px' }}>
                            FINANCE &amp; ACCOUNTING
                        </div>
                    )}

                    <Link 
                        to="/dashboard/finance-overview" 
                        style={{ 
                            padding: '10px 20px', fontSize: '14.5px', color: isActive('/dashboard/finance-overview') ? '#ffffff' : '#abb9e8', 
                            display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: '12px', textDecoration: 'none', transition: 'all 0.2s', fontWeight: isActive('/dashboard/finance-overview') ? '500' : '400'
                        }}
                    >
                        <i className="ri-pie-chart-line" style={{ fontSize: '18px' }}></i>
                        {!sidebarCollapsed && <span>Overview</span>}
                    </Link>

                    {/* Transactions Accordion */}
                    <div>
                        <div 
                            onClick={() => setOpenTransactions(!openTransactions)}
                            style={{ 
                                padding: '10px 20px', fontSize: '14.5px', color: location.pathname.includes('/transactions') ? '#ffffff' : '#abb9e8', 
                                display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'space-between', cursor: 'pointer', transition: 'all 0.2s', fontWeight: location.pathname.includes('/transactions') ? '500' : '400'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <i className="ri-arrow-left-right-line" style={{ fontSize: '18px' }}></i>
                                {!sidebarCollapsed && <span>Transactions</span>}
                            </div>
                            {!sidebarCollapsed && (
                                <i className={openTransactions ? "ri-arrow-down-s-line" : "ri-arrow-right-s-line"} style={{ fontSize: '15px' }}></i>
                            )}
                        </div>
                        {openTransactions && !sidebarCollapsed && (
                            <div style={{ paddingLeft: '50px', display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '8px', paddingTop: '4px' }}>
                                <Link to="/dashboard/transactions/income" style={{ color: location.pathname === '/dashboard/transactions/income' ? '#ffffff' : '#abb9e8', textDecoration: 'none', fontSize: '13.5px' }}>- Income</Link>
                                <Link to="/dashboard/transactions/expenses" style={{ color: location.pathname === '/dashboard/transactions/expenses' ? '#ffffff' : '#abb9e8', textDecoration: 'none', fontSize: '13.5px' }}>- Expenses</Link>
                                <Link to="/dashboard/transactions" style={{ color: location.pathname === '/dashboard/transactions' ? '#ffffff' : '#abb9e8', textDecoration: 'none', fontSize: '13.5px' }}>- All</Link>
                            </div>
                        )}
                    </div>

                    {/* MASTER SECTION */}
                    {!sidebarCollapsed && (
                        <div style={{ padding: '12px 20px 4px', fontSize: '11px', color: '#838fb9', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', marginTop: '10px' }}>
                            MASTER
                        </div>
                    )}

                    <Link 
                        to="/dashboard/my-account" 
                        style={{ 
                            padding: '10px 20px', fontSize: '14.5px', color: isActive('/dashboard/my-account') ? '#ffffff' : '#abb9e8', 
                            display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: '12px', textDecoration: 'none', transition: 'all 0.2s', fontWeight: isActive('/dashboard/my-account') ? '500' : '400'
                        }}
                    >
                        <i className="ri-account-circle-line" style={{ fontSize: '18px' }}></i>
                        {!sidebarCollapsed && <span>My Account</span>}
                    </Link>

                    {/* Users Accordion */}
                    <div>
                        <div 
                            onClick={() => setOpenUsers(!openUsers)}
                            style={{ 
                                padding: '10px 20px', fontSize: '14.5px', color: location.pathname.includes('/users') && !location.pathname.includes('sequence') ? '#ffffff' : '#abb9e8', 
                                display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'space-between', cursor: 'pointer', transition: 'all 0.2s', fontWeight: location.pathname.includes('/users') && !location.pathname.includes('sequence') ? '500' : '400'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <i className="ri-team-line" style={{ fontSize: '18px' }}></i>
                                {!sidebarCollapsed && <span>Users</span>}
                            </div>
                            {!sidebarCollapsed && (
                                <i className={openUsers ? "ri-arrow-down-s-line" : "ri-arrow-right-s-line"} style={{ fontSize: '15px' }}></i>
                            )}
                        </div>
                        {openUsers && !sidebarCollapsed && (
                            <div style={{ paddingLeft: '50px', display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '8px', paddingTop: '4px' }}>
                                <Link to="/dashboard/users" style={{ color: location.pathname === '/dashboard/users' ? '#ffffff' : '#abb9e8', textDecoration: 'none', fontSize: '13.5px' }}>- Directory</Link>
                                <Link to="/dashboard/users/attendance" style={{ color: location.pathname === '/dashboard/users/attendance' ? '#ffffff' : '#abb9e8', textDecoration: 'none', fontSize: '13.5px' }}>- Attendance</Link>
                            </div>
                        )}
                    </div>

                    {/* Jobs Accordion */}
                    <div>
                        <div 
                            onClick={() => setOpenJobs(!openJobs)}
                            style={{ 
                                padding: '10px 20px', fontSize: '14.5px', color: location.pathname.includes('/jobs') ? '#ffffff' : '#abb9e8', 
                                display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'space-between', cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <i className="ri-box-3-line" style={{ fontSize: '18px', color: location.pathname.includes('/jobs') ? '#ffffff' : 'inherit' }}></i>
                                {!sidebarCollapsed && <span style={{ fontWeight: location.pathname.includes('/jobs') ? '600' : '400' }}>Jobs &amp; Applications</span>}
                            </div>
                            {!sidebarCollapsed && (
                                <i className={openJobs ? "ri-arrow-down-s-line" : "ri-arrow-right-s-line"} style={{ fontSize: '15px', color: location.pathname.includes('/jobs') ? '#ffffff' : 'inherit' }}></i>
                            )}
                        </div>
                        {openJobs && !sidebarCollapsed && (
                            <div style={{ paddingLeft: '50px', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '8px', paddingTop: '8px' }}>
                                <Link to="/dashboard/jobs" style={{ color: location.pathname === '/dashboard/jobs' ? '#ffffff' : '#abb9e8', textDecoration: 'none', fontSize: '13.5px', display: 'flex', gap: '8px' }}><span>-</span> Jobs</Link>
                                <Link to="/dashboard/jobs/applications" style={{ color: location.pathname === '/dashboard/jobs/applications' ? '#ffffff' : '#abb9e8', textDecoration: 'none', fontSize: '13.5px', display: 'flex', gap: '8px' }}><span>-</span> Applications</Link>
                            </div>
                        )}
                    </div>

                    {/* OTHERS SECTION */}
                    {!sidebarCollapsed && (
                        <div style={{ padding: '12px 20px 4px', fontSize: '11px', color: '#838fb9', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', marginTop: '10px' }}>
                            OTHERS
                        </div>
                    )}

                    <Link 
                        to="/dashboard/media-gallery" 
                        style={{ 
                            padding: '10px 20px', fontSize: '14.5px', color: isActive('/dashboard/media-gallery') ? '#ffffff' : '#abb9e8', 
                            display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: '12px', textDecoration: 'none', transition: 'all 0.2s', fontWeight: isActive('/dashboard/media-gallery') ? '500' : '400'
                        }}
                    >
                        <i className="ri-image-line" style={{ fontSize: '18px' }}></i>
                        {!sidebarCollapsed && <span>Media / Gallery</span>}
                    </Link>

                    <Link 
                        to="/dashboard/website-slider" 
                        style={{ 
                            padding: '10px 20px', fontSize: '14.5px', color: isActive('/dashboard/website-slider') ? '#ffffff' : '#abb9e8', 
                            display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: '12px', textDecoration: 'none', transition: 'all 0.2s', fontWeight: isActive('/dashboard/website-slider') ? '500' : '400'
                        }}
                    >
                        <i className="ri-slideshow-line" style={{ fontSize: '18px' }}></i>
                        {!sidebarCollapsed && <span>Website Sliders</span>}
                    </Link>

                    <Link 
                        to="/dashboard/website-offer" 
                        style={{ 
                            padding: '10px 20px', fontSize: '14.5px', color: isActive('/dashboard/website-offer') ? '#ffffff' : '#abb9e8', 
                            display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: '12px', textDecoration: 'none', transition: 'all 0.2s', fontWeight: isActive('/dashboard/website-offer') ? '500' : '400'
                        }}
                    >
                        <i className="ri-gift-line" style={{ fontSize: '18px' }}></i>
                        {!sidebarCollapsed && <span>Website Offer</span>}
                    </Link>

                    <Link 
                        to="/dashboard/reviews" 
                        style={{ 
                            padding: '10px 20px', fontSize: '14.5px', color: isActive('/dashboard/reviews') ? '#ffffff' : '#abb9e8', 
                            display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: '12px', textDecoration: 'none', transition: 'all 0.2s', fontWeight: isActive('/dashboard/reviews') ? '500' : '400'
                        }}
                    >
                        <i className="ri-message-2-line" style={{ fontSize: '18px' }}></i>
                        {!sidebarCollapsed && <span>Reviews</span>}
                    </Link>

                    <Link 
                        to="/dashboard/contact" 
                        style={{ 
                            padding: '10px 20px', fontSize: '14.5px', color: isActive('/dashboard/contact') ? '#ffffff' : '#abb9e8', 
                            display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: '12px', textDecoration: 'none', transition: 'all 0.2s', fontWeight: isActive('/dashboard/contact') ? '500' : '400'
                        }}
                    >
                        <i className="ri-mail-line" style={{ fontSize: '18px' }}></i>
                        {!sidebarCollapsed && <span>Contact Details</span>}
                    </Link>

                    <Link 
                        to="/dashboard/users-sequence" 
                        style={{ 
                            padding: '10px 20px', fontSize: '14.5px', color: isActive('/dashboard/users-sequence') ? '#ffffff' : '#abb9e8', 
                            display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: '12px', textDecoration: 'none', transition: 'all 0.2s', fontWeight: isActive('/dashboard/users-sequence') ? '500' : '400'
                        }}
                    >
                        <i className="ri-stack-line" style={{ fontSize: '18px' }}></i>
                        {!sidebarCollapsed && <span>Users Sequence</span>}
                    </Link>

                    <Link 
                        to="/dashboard/gcode" 
                        style={{ 
                            padding: '10px 20px', fontSize: '14.5px', color: isActive('/dashboard/gcode') ? '#ffffff' : '#abb9e8', 
                            display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: '12px', textDecoration: 'none', transition: 'all 0.2s', fontWeight: isActive('/dashboard/gcode') ? '500' : '400'
                        }}
                    >
                        <i className="ri-bar-chart-fill" style={{ fontSize: '18px', color: '#f59e0b' }}></i>
                        {!sidebarCollapsed && <span>Google Analytics</span>}
                    </Link>

                    {/* SUPPORT */}
                    {!sidebarCollapsed && (
                        <div style={{ padding: '12px 20px 4px', fontSize: '11px', color: '#838fb9', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', marginTop: '10px' }}>
                            SUPPORT
                        </div>
                    )}

                    <Link 
                        to="/dashboard/faq" 
                        style={{ 
                            padding: '10px 20px', fontSize: '14.5px', color: isActive('/dashboard/faq') ? '#ffffff' : '#abb9e8', 
                            display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: '12px', textDecoration: 'none', transition: 'all 0.2s', fontWeight: isActive('/dashboard/faq') ? '500' : '400'
                        }}
                    >
                        <i className="ri-question-answer-line" style={{ fontSize: '18px' }}></i>
                        {!sidebarCollapsed && <span>FAQ's</span>}
                    </Link>

                    <Link 
                        to="/dashboard/help" 
                        style={{ 
                            padding: '10px 20px', fontSize: '14.5px', color: isActive('/dashboard/help') ? '#ffffff' : '#abb9e8', 
                            display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: '12px', textDecoration: 'none', transition: 'all 0.2s', fontWeight: isActive('/dashboard/help') ? '500' : '400'
                        }}
                    >
                        <i className="ri-question-line" style={{ fontSize: '18px' }}></i>
                        {!sidebarCollapsed && <span>Help</span>}
                    </Link>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', margin: '16px 20px 8px' }}></div>

                    <Link 
                        to="/dashboard/user-logout" 
                        style={{ 
                            padding: '10px 20px', fontSize: '14.5px', color: '#abb9e8', 
                            display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: '12px', textDecoration: 'none', transition: 'all 0.2s'
                        }}
                    >
                        <i className="ri-logout-box-r-line" style={{ fontSize: '18px' }}></i>
                        {!sidebarCollapsed && <span>Logout</span>}
                    </Link>
                </div>
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
