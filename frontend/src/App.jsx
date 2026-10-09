import React from 'react'
import DashboardProjects from './pages/DashboardProjects.jsx';
import DashboardDailyReport from './pages/DashboardDailyReport.jsx';
import DashboardFinance from './pages/DashboardFinance.jsx';
import DashboardTransactions from './pages/DashboardTransactions.jsx';
import DashboardUsers from './pages/DashboardUsers.jsx';
import DashboardAttendance from './pages/DashboardAttendance.jsx';
import DashboardJobs from './pages/DashboardJobs.jsx';
import DashboardApplications from './pages/DashboardApplications.jsx';
import DashboardSliders from './pages/DashboardSliders.jsx';
import DashboardOffers from './pages/DashboardOffers.jsx';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import LeadsDashboard from './pages/LeadsDashboard.jsx'
import DashboardOverview from './pages/DashboardOverview.jsx'
import DashboardAnalytics from './pages/DashboardAnalytics.jsx'
import DashboardProperties from './pages/DashboardProperties.jsx'
import {
  DashboardMyAccount,
  DashboardMedia,
  DashboardReviews,
  DashboardContact,
  DashboardUsersSequence,
  DashboardFAQ,
  DashboardHelp
} from './pages/DashboardSubPages.jsx'

/**
 * App.jsx — Complete application routing.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route → Login Page */}
        <Route path="/" element={<Login />} />

        {/* Sai Reality Login & Register */}
        <Route path="/login" element={<Login />} />

        {/* Sai Reality Home Website */}
        <Route path="/home" element={<Home />} />

        {/* CRM Dashboard: Dashboards */}
        <Route path="/dashboard" element={<DashboardOverview />} />
        <Route path="/dashboard/leads/all" element={<LeadsDashboard />} />
        <Route path="/dashboard/leads" element={<Navigate to="/dashboard/leads/all" replace />} />
        <Route path="/leads-dashboard" element={<Navigate to="/dashboard/leads/all" replace />} />
        <Route path="/dashboard/properties" element={<DashboardProperties />} />
        <Route path="/dashboard/projects" element={<DashboardProjects />} />
        <Route path="/dashboard/daily-report" element={<DashboardDailyReport />} />

        {/* CRM Dashboard: Finance & Accounting */}
        <Route path="/dashboard/finance-overview" element={<DashboardFinance />} />
        <Route path="/dashboard/transactions" element={<DashboardTransactions filter="All" />} />
        <Route path="/dashboard/transactions/income" element={<DashboardTransactions filter="Income" />} />
        <Route path="/dashboard/transactions/expenses" element={<DashboardTransactions filter="Expenses" />} />

        {/* CRM Dashboard: Master */}
        <Route path="/dashboard/my-account" element={<DashboardMyAccount />} />
        <Route path="/dashboard/users" element={<DashboardUsers />} />
        <Route path="/dashboard/user-attendance" element={<DashboardAttendance />} />
        <Route path="/dashboard/jobs" element={<DashboardJobs />} />
        <Route path="/dashboard/applications" element={<DashboardApplications />} />
        <Route path="/dashboard/jobs" element={<DashboardJobs />} />
        <Route path="/dashboard/jobs/applications" element={<DashboardApplications />} />

        {/* CRM Dashboard: Others */}
        <Route path="/dashboard/media-gallery" element={<DashboardMedia />} />
        <Route path="/dashboard/website-slider" element={<DashboardSliders />} />
        <Route path="/dashboard/website-offer" element={<DashboardOffers />} />
        <Route path="/dashboard/reviews" element={<DashboardReviews />} />
        <Route path="/dashboard/contact" element={<DashboardContact />} />
        <Route path="/dashboard/users-sequence" element={<DashboardUsersSequence />} />
        <Route path="/dashboard/gcode" element={<DashboardAnalytics />} />
        <Route path="/dashboard/analytics" element={<DashboardAnalytics />} />

        {/* CRM Dashboard: Support */}
        <Route path="/dashboard/faq" element={<DashboardFAQ />} />
        <Route path="/dashboard/help" element={<DashboardHelp />} />

        {/* Auth & Logout Routes */}
        <Route path="/dashboard/user-login" element={<Navigate to="/login" replace />} />
        <Route path="/dashboard/user-login/*" element={<Navigate to="/login" replace />} />
        <Route path="/dashboard/user-logout" element={<Logout />} />

        {/* Catch-all → Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

/**
 * Logout component — clears session storage and redirects to /login
 */
function Logout() {
  React.useEffect(() => {
    sessionStorage.removeItem('cp_logged_in');
    sessionStorage.removeItem('cp_user');
  }, []);
  return <Navigate to="/login" replace />;
}

export default App
