import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './DashboardLayout.module.css';
import { API_BASE_URL } from '../api/config';

const DashboardLayout = ({ children }) => {
    const [sidebarCounts, setSidebarCounts] = React.useState({});
    React.useEffect(() => {
        fetch(`${API_BASE_URL}/api/dashboard/summary`)
            .then(res => res.json())
            .then(data => { if (data.status === 'success') setSidebarCounts(data); })
            .catch(() => {});
    }, []);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
    const [quickAddOpen, setQuickAddOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isFullscreen, setIsFullscreen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const [openTransactions, setOpenTransactions] = useState(location.pathname.includes('/transactions'));
    const [openUsers, setOpenUsers] = useState(location.pathname.includes('/users'));
    const [openJobs, setOpenJobs] = useState(location.pathname.includes('/jobs'));

    useEffect(() => {
        if (location.pathname.includes('/transactions')) setOpenTransactions(true);
        if (location.pathname.includes('/users')) setOpenUsers(true);
        if (location.pathname.includes('/jobs')) setOpenJobs(true);
    }, [location.pathname]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (!e.target.closest('#user-profile-menu') && !e.target.closest('#user-profile-btn')) setUserDropdownOpen(false);
            if (!e.target.closest('#notif-menu') && !e.target.closest('#notif-btn')) setNotifDropdownOpen(false);
            if (!e.target.closest('#quick-add-menu') && !e.target.closest('#quick-add-btn')) setQuickAddOpen(false);
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
            document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
        } else {
            document.exitFullscreen && document.exitFullscreen().then(() => setIsFullscreen(false));
        }
    };

    const notificationsList = [
        { id: 1, title: 'New Hot Lead Enquiry', desc: 'Rahul Sharma enquired for 2BHK Lodha Kharadi (1.45 CR)', time: '2 mins ago', icon: 'ri-fire-fill', color: '#ea580c', bg: 'rgba(234,88,12,0.12)', link: '/dashboard/leads/all' },
        { id: 2, title: 'Site Visit Confirmed', desc: 'Priya Patel confirmed visit for Ganga Newtown at 3:30 PM', time: '15 mins ago', icon: 'ri-map-pin-user-fill', color: '#0ea5e9', bg: 'rgba(14,165,233,0.12)', link: '/dashboard/daily-report' },
        { id: 3, title: 'Brokerage Payout Cleared', desc: '₹ 2,90,000 RTGS payout received from Lodha Group', time: '1 hour ago', icon: 'ri-money-dollar-circle-fill', color: '#10b981', bg: 'rgba(16,185,129,0.12)', link: '/dashboard/transactions' }
    ];

    // Sidebar nav item component
    const NavItem = ({ to, icon, label, badge, isActiveItem }) => (
        <Link
            to={to}
            className={`${styles.navItem} ${isActiveItem ? styles.navItemActive : ''}`}
        >
            <i className={`${icon} ${styles.navIcon}`}></i>
            {!sidebarCollapsed && (
                <>
                    <span className={styles.navLabel}>{label}</span>
                    {badge != null && badge !== '' && (
                        <span className={styles.navBadge}>{badge}</span>
                    )}
                </>
            )}
            {isActiveItem && <span className={styles.activeGlow}></span>}
        </Link>
    );

    const NavSection = ({ label }) => !sidebarCollapsed ? (
        <div className={styles.navSection}>{label}</div>
    ) : <div className={styles.navSectionDivider}></div>;

    return (
        <div className={styles.layoutWrapper}>

            {/* ── Premium Dark Sidebar ── */}
            <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>

                {/* Sidebar gradient orbs */}
                <div className={styles.sidebarOrb1}></div>
                <div className={styles.sidebarOrb2}></div>

                {/* Logo Area */}
                <div className={styles.sidebarLogo}>
                    <Link to="/dashboard" className={styles.logoLink}>
                        <div className={styles.logoContainer}>
                            <img
                                src="/sai_reality_logo.png"
                                alt="Sai Reality"
                                className={`${styles.logoImg} ${sidebarCollapsed ? styles.logoImgCollapsed : ''}`}
                                onError={(e) => { e.target.src = '/logo.png'; }}
                            />
                        </div>
                        {!sidebarCollapsed && (
                            <div className={styles.logoText}>
                                <span className={styles.logoTitle}>Sai Reality</span>
                                <span className={styles.logoSub}>CRM Dashboard</span>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Navigation */}
                <nav className={styles.sidebarNav}>

                    <NavItem to="/dashboard" icon="ri-dashboard-2-line" label="Dashboards" isActiveItem={isActive('/dashboard')} />

                    <NavSection label="CRM" />

                    <NavItem to="/dashboard/leads/all" icon="ri-contacts-book-2-line" label="Leads" badge={sidebarCounts.leads} isActiveItem={isActive('/dashboard/leads/all')} />
                    <NavItem to="/dashboard/properties" icon="ri-home-4-line" label="Properties" badge={sidebarCounts.properties} isActiveItem={isActive('/dashboard/properties')} />
                    <NavItem to="/dashboard/projects" icon="ri-building-4-line" label="Projects" badge={sidebarCounts.projects} isActiveItem={isActive('/dashboard/projects')} />
                    <NavItem to="/dashboard/daily-report" icon="ri-calendar-check-line" label="Daily Report" isActiveItem={isActive('/dashboard/daily-report')} />

                    <NavSection label="Finance" />

                    <NavItem to="/dashboard/finance-overview" icon="ri-pie-chart-2-line" label="Overview" isActiveItem={isActive('/dashboard/finance-overview')} />

                    {/* Transactions Accordion */}
                    <div>
                        <div
                            className={`${styles.navItem} ${location.pathname.includes('/transactions') ? styles.navItemActive : ''}`}
                            onClick={() => setOpenTransactions(!openTransactions)}
                            style={{ cursor: 'pointer' }}
                        >
                            <i className={`ri-exchange-dollar-line ${styles.navIcon}`}></i>
                            {!sidebarCollapsed && (
                                <>
                                    <span className={styles.navLabel}>Transactions</span>
                                    <i className={`${openTransactions ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'} ${styles.chevron}`}></i>
                                </>
                            )}
                            {location.pathname.includes('/transactions') && <span className={styles.activeGlow}></span>}
                        </div>
                        {openTransactions && !sidebarCollapsed && (
                            <div className={styles.subMenu}>
                                <Link to="/dashboard/transactions/income" className={`${styles.subItem} ${location.pathname === '/dashboard/transactions/income' ? styles.subItemActive : ''}`}>
                                    <i className="ri-arrow-up-circle-line"></i> Income
                                </Link>
                                <Link to="/dashboard/transactions/expenses" className={`${styles.subItem} ${location.pathname === '/dashboard/transactions/expenses' ? styles.subItemActive : ''}`}>
                                    <i className="ri-arrow-down-circle-line"></i> Expenses
                                </Link>
                                <Link to="/dashboard/transactions" className={`${styles.subItem} ${location.pathname === '/dashboard/transactions' ? styles.subItemActive : ''}`}>
                                    <i className="ri-list-check-2"></i> All
                                </Link>
                            </div>
                        )}
                    </div>

                    <NavSection label="Master" />

                    <NavItem to="/dashboard/my-account" icon="ri-account-circle-2-line" label="My Account" isActiveItem={isActive('/dashboard/my-account')} />

                    {/* Users Accordion */}
                    <div>
                        <div
                            className={`${styles.navItem} ${location.pathname.includes('/users') && !location.pathname.includes('sequence') ? styles.navItemActive : ''}`}
                            onClick={() => setOpenUsers(!openUsers)}
                            style={{ cursor: 'pointer' }}
                        >
                            <i className={`ri-team-line ${styles.navIcon}`}></i>
                            {!sidebarCollapsed && (
                                <>
                                    <span className={styles.navLabel}>Users</span>
                                    <i className={`${openUsers ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'} ${styles.chevron}`}></i>
                                </>
                            )}
                            {location.pathname.includes('/users') && !location.pathname.includes('sequence') && <span className={styles.activeGlow}></span>}
                        </div>
                        {openUsers && !sidebarCollapsed && (
                            <div className={styles.subMenu}>
                                <Link to="/dashboard/users" className={`${styles.subItem} ${location.pathname === '/dashboard/users' ? styles.subItemActive : ''}`}>
                                    <i className="ri-user-3-line"></i> Directory
                                </Link>
                                <Link to="/dashboard/users/attendance" className={`${styles.subItem} ${location.pathname === '/dashboard/users/attendance' ? styles.subItemActive : ''}`}>
                                    <i className="ri-time-line"></i> Attendance
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Jobs Accordion */}
                    <div>
                        <div
                            className={`${styles.navItem} ${location.pathname.includes('/jobs') ? styles.navItemActive : ''}`}
                            onClick={() => setOpenJobs(!openJobs)}
                            style={{ cursor: 'pointer' }}
                        >
                            <i className={`ri-briefcase-4-line ${styles.navIcon}`}></i>
                            {!sidebarCollapsed && (
                                <>
                                    <span className={styles.navLabel}>Jobs & Applications</span>
                                    <i className={`${openJobs ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'} ${styles.chevron}`}></i>
                                </>
                            )}
                            {location.pathname.includes('/jobs') && <span className={styles.activeGlow}></span>}
                        </div>
                        {openJobs && !sidebarCollapsed && (
                            <div className={styles.subMenu}>
                                <Link to="/dashboard/jobs" className={`${styles.subItem} ${location.pathname === '/dashboard/jobs' ? styles.subItemActive : ''}`}>
                                    <i className="ri-briefcase-line"></i> Jobs
                                </Link>
                                <Link to="/dashboard/jobs/applications" className={`${styles.subItem} ${location.pathname === '/dashboard/jobs/applications' ? styles.subItemActive : ''}`}>
                                    <i className="ri-file-user-line"></i> Applications
                                </Link>
                            </div>
                        )}
                    </div>

                    <NavSection label="Others" />

                    <NavItem to="/dashboard/media-gallery" icon="ri-image-2-line" label="Media / Gallery" isActiveItem={isActive('/dashboard/media-gallery')} />
                    <NavItem to="/dashboard/website-slider" icon="ri-slideshow-2-line" label="Website Sliders" isActiveItem={isActive('/dashboard/website-slider')} />
                    <NavItem to="/dashboard/website-offer" icon="ri-gift-2-line" label="Website Offers" isActiveItem={isActive('/dashboard/website-offer')} />
                    <NavItem to="/dashboard/reviews" icon="ri-star-smile-line" label="Reviews" isActiveItem={isActive('/dashboard/reviews')} />
                    <NavItem to="/dashboard/contact" icon="ri-mail-open-line" label="Contact Details" isActiveItem={isActive('/dashboard/contact')} />
                    <NavItem to="/dashboard/users-sequence" icon="ri-stack-line" label="Users Sequence" isActiveItem={isActive('/dashboard/users-sequence')} />
                    <NavItem to="/dashboard/gcode" icon="ri-bar-chart-box-line" label="Google Analytics" isActiveItem={isActive('/dashboard/gcode')} />

                    <NavSection label="Support" />

                    <NavItem to="/dashboard/faq" icon="ri-question-answer-line" label="FAQ's" isActiveItem={isActive('/dashboard/faq')} />
                    <NavItem to="/dashboard/help" icon="ri-lifebuoy-line" label="Help Center" isActiveItem={isActive('/dashboard/help')} />

                    <div className={styles.navDivider}></div>

                    {/* View Website shortcut */}
                    {!sidebarCollapsed && (
                        <Link to="/home" target="_blank" className={styles.viewSiteBtn}>
                            <i className="ri-earth-line"></i>
                            <span>View Live Website</span>
                            <i className="ri-external-link-line" style={{ marginLeft: 'auto', opacity: 0.6, fontSize: '12px' }}></i>
                        </Link>
                    )}

                    <Link to="/dashboard/user-logout" className={styles.logoutBtn}>
                        <i className={`ri-logout-box-r-line ${styles.navIcon}`}></i>
                        {!sidebarCollapsed && <span>Logout</span>}
                    </Link>
                </nav>
            </aside>

            {/* ── Main Content Area ── */}
            <div className={`${styles.mainWrapper} ${sidebarCollapsed ? styles.mainWrapperExpanded : ''}`}>

                {/* ── Premium Topbar ── */}
                <header className={styles.topbar}>
                    <div className={styles.topbarLeft}>
                        {/* Sidebar Toggle */}
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className={styles.topbarIconBtn}
                            title="Toggle Sidebar"
                        >
                            <i className={sidebarCollapsed ? "ri-menu-unfold-line" : "ri-menu-fold-line"}></i>
                        </button>

                        {/* Search Bar */}
                        <div className={styles.searchBar}>
                            <i className="ri-search-2-line"></i>
                            <input type="text" placeholder="Search CRM..." className={styles.searchInput}
                                onFocus={e => e.target.parentElement.classList.add(styles.searchFocused)}
                                onBlur={e => e.target.parentElement.classList.remove(styles.searchFocused)}
                            />
                            <kbd className={styles.searchKbd}>Ctrl K</kbd>
                        </div>

                        {/* Live HQ Pill */}
                        <div className={styles.liveHqPill}>
                            <span className={styles.livePulseDot}></span>
                            <span>Pune HQ</span>
                            <span className={styles.liveSep}>|</span>
                            <span>Live</span>
                        </div>
                    </div>

                    <div className={styles.topbarRight}>
                        {/* View Website */}
                        <Link to="/home" target="_blank" className={styles.viewWebsiteBtn}>
                            <i className="ri-external-link-line"></i>
                            <span>View Website</span>
                        </Link>

                        {/* Clock */}
                        <div className={styles.clockBadge}>
                            <i className="ri-time-line"></i>
                            <span>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                            <span className={styles.clockIst}>IST</span>
                        </div>

                        {/* Quick Create */}
                        <div style={{ position: 'relative' }}>
                            <button
                                id="quick-add-btn"
                                onClick={() => setQuickAddOpen(!quickAddOpen)}
                                className={styles.createBtn}
                            >
                                <i className="ri-add-circle-line"></i>
                                <span>Create</span>
                                <i className="ri-arrow-down-s-line" style={{ fontSize: '13px', opacity: 0.8 }}></i>
                            </button>
                            {quickAddOpen && (
                                <div id="quick-add-menu" className={`${styles.dropdown} ${styles.dropdownFadeIn}`}>
                                    <div className={styles.dropdownHeader}>Quick Actions</div>
                                    {[
                                        { to: '/dashboard/leads/all', icon: 'ri-user-add-line', label: '+ Add New Lead', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
                                        { to: '/dashboard/properties', icon: 'ri-building-line', label: '+ Add Property', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
                                        { to: '/dashboard/transactions', icon: 'ri-money-dollar-circle-line', label: '+ Record Payment', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
                                        { to: '/dashboard/daily-report', icon: 'ri-calendar-event-line', label: '+ Log Site Visit', color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
                                    ].map(item => (
                                        <Link key={item.to} to={item.to} onClick={() => setQuickAddOpen(false)} className={styles.dropdownItem}>
                                            <span className={styles.dropdownItemIcon} style={{ backgroundColor: item.bg, color: item.color }}>
                                                <i className={item.icon}></i>
                                            </span>
                                            <strong>{item.label}</strong>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Fullscreen */}
                        <button onClick={toggleFullscreen} className={styles.topbarIconBtn} title="Toggle Fullscreen">
                            <i className={isFullscreen ? "ri-fullscreen-exit-line" : "ri-fullscreen-line"}></i>
                        </button>

                        {/* Notifications */}
                        <div style={{ position: 'relative' }}>
                            <button
                                id="notif-btn"
                                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                                className={`${styles.topbarIconBtn} ${styles.notifBtn}`}
                                title="Notifications"
                            >
                                <i className="ri-notification-3-line"></i>
                                <span className={styles.notifBadgeDot}></span>
                            </button>
                            {notifDropdownOpen && (
                                <div id="notif-menu" className={`${styles.dropdown} ${styles.dropdownFadeIn}`} style={{ width: '340px' }}>
                                    <div className={styles.notifDropdownHeader}>
                                        <span>CRM Notifications</span>
                                        <span className={styles.notifCount}>3 New</span>
                                    </div>
                                    <div className={styles.notifList}>
                                        {notificationsList.map(n => (
                                            <Link key={n.id} to={n.link} onClick={() => setNotifDropdownOpen(false)} className={styles.notifItem}>
                                                <div className={styles.notifItemIcon} style={{ backgroundColor: n.bg, color: n.color }}>
                                                    <i className={n.icon}></i>
                                                </div>
                                                <div className={styles.notifItemBody}>
                                                    <div className={styles.notifItemTitle}>{n.title}</div>
                                                    <div className={styles.notifItemDesc}>{n.desc}</div>
                                                    <div className={styles.notifItemTime}>{n.time}</div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    <Link to="/dashboard/leads/all" onClick={() => setNotifDropdownOpen(false)} className={styles.notifViewAll}>
                                        View All Live Leads →
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* User Profile */}
                        <div style={{ position: 'relative' }}>
                            <div
                                id="user-profile-btn"
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                className={styles.userProfile}
                            >
                                <div className={styles.userAvatar}>S</div>
                                <div className={styles.userInfo}>
                                    <div className={styles.userName}>Sai Admin</div>
                                    <div className={styles.userRole}>Administrator</div>
                                </div>
                                <i className="ri-arrow-down-s-line" style={{ fontSize: '13px', color: '#64748b' }}></i>
                            </div>
                            {userDropdownOpen && (
                                <div id="user-profile-menu" className={`${styles.dropdown} ${styles.dropdownFadeIn}`}>
                                    <div className={styles.userDropdownHeader}>
                                        <div className={styles.userDropdownName}>Sai Reality Administrator</div>
                                        <div className={styles.userDropdownEmail}>admin@saireality.in</div>
                                    </div>
                                    {[
                                        { to: '/dashboard/my-account', icon: 'ri-user-settings-line', label: 'Account Settings', color: '#6366f1' },
                                        { to: '/dashboard/daily-report', icon: 'ri-file-chart-line', label: 'Daily Reports', color: '#10b981' },
                                        { to: '/home', icon: 'ri-window-line', label: 'Open Public Website', color: '#f59e0b', target: '_blank' },
                                    ].map(item => (
                                        <Link key={item.to} to={item.to} target={item.target} onClick={() => setUserDropdownOpen(false)} className={styles.dropdownItem}>
                                            <i className={item.icon} style={{ color: item.color }}></i>
                                            {item.label}
                                        </Link>
                                    ))}
                                    <div className={styles.dropdownDivider}></div>
                                    <Link to="/dashboard/user-logout" onClick={() => setUserDropdownOpen(false)} className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}>
                                        <i className="ri-logout-box-r-line"></i> Sign Out
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* ── Main Dynamic Content ── */}
                <main className={styles.mainContent}>
                    {/* Floating Background Orbs */}
                    <div className={styles.floatingOrb1}></div>
                    <div className={styles.floatingOrb2}></div>
                    <div className={styles.floatingOrb3}></div>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        {children}
                    </div>
                </main>

                {/* ── Footer ── */}
                <footer className={styles.footer}>
                    <div>© 2026 <strong>Sai Reality Certified Properties</strong>. All rights reserved.</div>
                    <div className={styles.footerLinks}>
                        <Link to="/dashboard/faq">FAQ</Link>
                        <Link to="/dashboard/help">Help Desk</Link>
                        <Link to="/home" target="_blank" className={styles.footerLiveSite}>Live Site →</Link>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default DashboardLayout;
