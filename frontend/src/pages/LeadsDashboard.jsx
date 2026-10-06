import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

export default function LeadsDashboard() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showLeadDetailModal, setShowLeadDetailModal] = useState(null);
  const [showFollowupModal, setShowFollowupModal] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter criteria state
  const [filters, setFilters] = useState({
    source: 'All',
    assignedTo: 'All',
    budget: 'All',
    location: 'All',
    dateFrom: '',
    dateTo: ''
  });

  const tabCounts = {
    all: 14863,
    new: 10026,
    followups: 1226,
    siteVisits: 3050,
    svCompleted: 355,
    bookingInprogress: 84,
    bookings: 39,
    pending: 47485,
    todayPending: 0,
    dead: 438,
    duplicate: 438
  };

  const [leads, setLeads] = useState([
    {
      id: '2022016488',
      name: 'Thank you very much for your inquiry We appreciate you 4005804 https://youtube.com faceapple !',
      phone: '+91 9876543210',
      email: 'client.enquiry@gmail.com',
      status: 'NEW LEAD',
      statusDate: 'Oct. 4, 2026, 7:32 a.m.',
      budget: '0 RS.',
      intent: 'NEW LEAD',
      note: 'Call back request lead for project ..',
      lookingFor: 'Residential 2BHK',
      source: 'Company Website',
      assignedTo: 'Admin',
      location: 'Wagholi',
      followups: [
        { date: '2026-10-04 09:30 AM', executive: 'Admin', note: 'Initial system auto-acknowledgment sent via SMS & WhatsApp.' }
      ]
    },
    {
      id: '2022016489',
      name: 'Rahul Sharma (Looking for Lodha Kharadi luxury 3BHK penthouse with garden view)',
      phone: '+91 9518701503',
      email: 'rahul.sharma@outlook.com',
      status: 'IN FOLLOWUP',
      statusDate: 'Oct. 4, 2026, 9:15 a.m.',
      budget: '1.45 CR',
      intent: 'HOT LEAD',
      note: 'Requested weekend site visit appointment for family ..',
      lookingFor: '3 BHK Luxury',
      source: 'MagicBricks',
      assignedTo: 'Sales Team',
      location: 'Kharadi',
      followups: [
        { date: '2026-10-04 11:00 AM', executive: 'Amit Executive', note: 'Called client. Family available on Saturday 11 AM for Lodha Kharadi site visit.' },
        { date: '2026-10-04 02:30 PM', executive: 'Amit Executive', note: 'Sent floor plan PDF and location map on WhatsApp.' }
      ]
    },
    {
      id: '2022016490',
      name: 'Priya Patel (Requires home loan pre-approval for Ganga New Town Dhanori 2BHK)',
      phone: '+91 9812345678',
      email: 'priya.patel@techcorp.in',
      status: 'SITE VISIT',
      statusDate: 'Oct. 3, 2026, 3:45 p.m.',
      budget: '65 LACS',
      intent: 'SITE VISIT',
      note: 'Token payment discussed with executive during site visit ..',
      lookingFor: '2 BHK Dhanori',
      source: 'Direct Call',
      assignedTo: 'Executive',
      location: 'Dhanori',
      followups: [
        { date: '2026-10-03 04:00 PM', executive: 'Pooja Sales', note: 'Site visit completed. Client liked 5th floor east-facing unit.' },
        { date: '2026-10-04 10:15 AM', executive: 'Banking Team', note: 'Collected salary slips and bank statements for HDFC home loan sanction.' }
      ]
    },
    {
      id: '2022016491',
      name: 'Amit Deshmukh (Enquiry for Bramha F-Residences Wagholi residential apartment)',
      phone: '+91 9988776655',
      email: 'deshmukh.amit@yahoo.co.in',
      status: 'BOOKING INPROGRESS',
      statusDate: 'Oct. 2, 2026, 11:20 a.m.',
      budget: '78 LACS',
      intent: 'FINAL DEAL',
      note: 'Paperwork verification in progress for unit 804 ..',
      lookingFor: '2.5 BHK Wagholi',
      source: 'Company Website',
      assignedTo: 'Manager',
      location: 'Wagholi',
      followups: [
        { date: '2026-10-02 01:00 PM', executive: 'Manager Raj', note: 'Token amount of ₹50,000 received via NEFT. Booking receipt generated.' }
      ]
    },
    {
      id: '2022016492',
      name: 'Sneha Kulkarni (Investor seeking NA Plots in Lohegaon with clear titles)',
      phone: '+91 9765432109',
      email: 'sneha.kulkarni@gmail.com',
      status: 'BOOKINGS/ EOI',
      statusDate: 'Oct. 1, 2026, 04:10 p.m.',
      budget: '40 LACS',
      intent: 'CLOSED',
      note: 'Registered agreement for Plot No. 14 completed ..',
      lookingFor: 'Open NA Plot',
      source: '99acres',
      assignedTo: 'Admin',
      location: 'Lohegaon',
      followups: [
        { date: '2026-10-01 05:30 PM', executive: 'Admin', note: 'Sub-registrar office registration completed. Commission logged.' }
      ]
    },
    {
      id: '2022016493',
      name: 'Vikram Verma (Commercial office showroom space requirement in Viman Nagar)',
      phone: '+91 9123456789',
      email: 'vikram.v@ventures.com',
      status: 'IN FOLLOWUP',
      statusDate: 'Sep. 30, 2026, 10:00 a.m.',
      budget: '95 LACS',
      intent: 'WARM LEAD',
      note: 'Looking for 1000 sq.ft commercial space for IT startup office ..',
      lookingFor: 'Commercial Space',
      source: 'Google Ads',
      assignedTo: 'Commercial Team',
      location: 'Viman Nagar',
      followups: [
        { date: '2026-09-30 11:30 AM', executive: 'Commercial Team', note: 'Shared 3 commercial properties list with ROI calculations.' }
      ]
    },
    {
      id: '2022016494',
      name: 'Rohan Joshi (Looking for ready possession 2BHK near Hinjewadi IT Park)',
      phone: '+91 9845123670',
      email: 'rohan.joshi@tcs.com',
      status: 'NEW LEAD',
      statusDate: 'Sep. 29, 2026, 02:40 p.m.',
      budget: '58 LACS',
      intent: 'NEW LEAD',
      note: 'Immediate shift required before Diwali ..',
      lookingFor: '2 BHK Ready',
      source: 'Housing.com',
      assignedTo: 'Executive',
      location: 'Hinjewadi',
      followups: []
    },
    {
      id: '2022016495',
      name: 'Kavita Nair (Enquiry for luxury villa project in Nirwana Life County)',
      phone: '+91 9972345612',
      email: 'kavita.nair@investors.org',
      status: 'SITE VISIT',
      statusDate: 'Sep. 28, 2026, 06:15 p.m.',
      budget: '1.95 CR',
      intent: 'HOT LEAD',
      note: 'Weekend appointment booked for row house visit ..',
      lookingFor: 'Villa / Bungalow',
      source: 'Facebook Ads',
      assignedTo: 'Manager',
      location: 'Lohegaon',
      followups: []
    }
  ]);

  // Filtering Logic
  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.id.includes(searchTerm) ||
      l.phone.includes(searchTerm) ||
      l.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'new' && l.status === 'NEW LEAD') ||
      (activeTab === 'followups' && l.status === 'IN FOLLOWUP') ||
      (activeTab === 'siteVisits' && l.status === 'SITE VISIT') ||
      (activeTab === 'bookingInprogress' && l.status === 'BOOKING INPROGRESS') ||
      (activeTab === 'bookings' && l.status === 'BOOKINGS/ EOI');

    const matchesSource = filters.source === 'All' || l.source === filters.source;
    const matchesAssigned = filters.assignedTo === 'All' || l.assignedTo === filters.assignedTo;
    const matchesLocation = filters.location === 'All' || l.location === filters.location;

    return matchesSearch && matchesTab && matchesSource && matchesAssigned && matchesLocation;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage) || 1;
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Checkbox handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedLeads(paginatedLeads.map(l => l.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (id) => {
    setSelectedLeads(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Status changer
  const changeLeadStatus = (leadId, newStatus) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          status: newStatus,
          statusDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })
        };
      }
      return l;
    }));
  };

  // Add follow-up note
  const [newFollowupText, setNewFollowupText] = useState('');
  const handleAddFollowup = (e) => {
    e.preventDefault();
    if (!newFollowupText.trim() || !showFollowupModal) return;

    const newNote = {
      date: new Date().toLocaleString(),
      executive: 'Admin',
      note: newFollowupText.trim()
    };

    setLeads(prev => prev.map(l => {
      if (l.id === showFollowupModal.id) {
        return { ...l, followups: [newNote, ...(l.followups || [])] };
      }
      return l;
    }));

    setNewFollowupText('');
    setShowFollowupModal(null);
  };

  // CSV Exporter
  const exportToCSV = () => {
    const headers = ['Lead ID,Name,Phone,Email,Status,Budget,Intent,Note,Looking For,Source,Assigned To,Location'];
    const rows = filteredLeads.map(l => 
      `"${l.id}","${l.name.replace(/"/g, '""')}","${l.phone}","${l.email}","${l.status}","${l.budget}","${l.intent}","${l.note}","${l.lookingFor}","${l.source}","${l.assignedTo}","${l.location}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Certified_Properties_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
        {/* ── Subheader Title & Breadcrumb ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <h5 style={{ margin: 0, fontWeight: '700', letterSpacing: '0.5px', color: '#1e293b' }}>LEADS</h5>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '300px', flex: '1 1 auto' }}>
            <div style={{ flex: 1, height: '10px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '42%', height: '100%', backgroundColor: '#0284c7' }}></div>
            </div>
            <span style={{ fontSize: '11px', color: '#64748b' }}>42% Verified</span>
          </div>

          <div style={{ fontSize: '12px', color: '#64748b' }}>
            <span>CRM</span> <span style={{ margin: '0 4px' }}>&gt;</span> <span style={{ color: '#334155', fontWeight: '600' }}>Leads</span>
          </div>
        </div>

      {/* ── Testing IDs Section Banner ── */}
      <div style={{ marginBottom: '16px' }}>
        <h6 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', margin: '0 0 2px' }}>
          this is ids section for testing purpose
        </h6>
        <span style={{ fontSize: '11px', color: '#64748b' }}>11628 1</span>
      </div>

      {/* ── Status Tab Pills (Two Rows) ── */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px' }}>
        {/* Row 1 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '10px' }}>
          <button 
            onClick={() => { setActiveTab('all'); setCurrentPage(1); }} 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              fontSize: '13px', 
              fontWeight: activeTab === 'all' ? '700' : '500', 
              color: activeTab === 'all' ? '#0f172a' : '#475569',
              borderBottom: activeTab === 'all' ? '2px solid #f97316' : 'none',
              paddingBottom: '4px'
            }}
          >
            All Leads <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold', marginLeft: '4px' }}>{tabCounts.all}</span>
          </button>

          <button 
            onClick={() => { setActiveTab('new'); setCurrentPage(1); }} 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              fontSize: '13px', 
              fontWeight: activeTab === 'new' ? '700' : '500', 
              color: activeTab === 'new' ? '#0f172a' : '#475569',
              borderBottom: activeTab === 'new' ? '2px solid #f97316' : 'none',
              paddingBottom: '4px'
            }}
          >
            New <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold', marginLeft: '4px' }}>{tabCounts.new}</span>
          </button>

          <button 
            onClick={() => { setActiveTab('followups'); setCurrentPage(1); }} 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              fontSize: '13px', 
              fontWeight: activeTab === 'followups' ? '700' : '500', 
              color: activeTab === 'followups' ? '#0f172a' : '#475569',
              borderBottom: activeTab === 'followups' ? '2px solid #f97316' : 'none',
              paddingBottom: '4px'
            }}
          >
            In Followups <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold', marginLeft: '4px' }}>{tabCounts.followups}</span>
          </button>

          <button 
            onClick={() => { setActiveTab('siteVisits'); setCurrentPage(1); }} 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              fontSize: '13px', 
              fontWeight: activeTab === 'siteVisits' ? '700' : '500', 
              color: activeTab === 'siteVisits' ? '#0f172a' : '#475569',
              borderBottom: activeTab === 'siteVisits' ? '2px solid #f97316' : 'none',
              paddingBottom: '4px'
            }}
          >
            Sites Visits <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold', marginLeft: '4px' }}>{tabCounts.siteVisits}</span>
          </button>

          <button 
            onClick={() => { setActiveTab('svCompleted'); setCurrentPage(1); }} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#475569', fontWeight: '500' }}
          >
            SV Completed <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold', marginLeft: '4px' }}>{tabCounts.svCompleted}</span>
          </button>

          <button 
            onClick={() => { setActiveTab('bookingInprogress'); setCurrentPage(1); }} 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              fontSize: '13px', 
              fontWeight: activeTab === 'bookingInprogress' ? '700' : '500', 
              color: activeTab === 'bookingInprogress' ? '#0f172a' : '#475569',
              borderBottom: activeTab === 'bookingInprogress' ? '2px solid #f97316' : 'none',
              paddingBottom: '4px'
            }}
          >
            Booking Inprogress <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold', marginLeft: '4px' }}>{tabCounts.bookingInprogress}</span>
          </button>

          <button 
            onClick={() => { setActiveTab('bookings'); setCurrentPage(1); }} 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              fontSize: '13px', 
              fontWeight: activeTab === 'bookings' ? '700' : '500', 
              color: activeTab === 'bookings' ? '#0f172a' : '#475569',
              borderBottom: activeTab === 'bookings' ? '2px solid #f97316' : 'none',
              paddingBottom: '4px'
            }}
          >
            Bookings/ EOI's <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold', marginLeft: '4px' }}>{tabCounts.bookings}</span>
          </button>
        </div>

        {/* Row 2 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#475569', fontWeight: '500' }}>
            Pending Leads <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold', marginLeft: '4px' }}>{tabCounts.pending}</span>
          </button>

          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#475569', fontWeight: '500' }}>
            Today Pending Leads <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold', marginLeft: '4px' }}>{tabCounts.todayPending}</span>
          </button>

          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#475569', fontWeight: '500' }}>
            Dead Leads <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold', marginLeft: '4px' }}>{tabCounts.dead}</span>
          </button>

          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#475569', fontWeight: '500' }}>
            Duplicate <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold', marginLeft: '4px' }}>{tabCounts.duplicate}</span>
          </button>
        </div>
      </div>

      {/* ── Search & Action Bar ── */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '14px 16px', marginBottom: '16px' }}>
        {/* Search input */}
        <div style={{ position: 'relative', width: '100%', marginBottom: '14px' }}>
          <i className="ri-search-line" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '15px' }}></i>
          <input 
            type="text" 
            placeholder="Search for... wait 5 sec after typing" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '8px 14px 8px 36px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }}
          />
        </div>

        {/* Right side buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ backgroundColor: '#e0f2fe', color: '#0284c7', fontSize: '12px', fontWeight: '700', padding: '6px 12px', borderRadius: '4px', textTransform: 'uppercase' }}>
            {filteredLeads.length} LEADS
          </span>

          <button 
            onClick={() => { setSearchTerm(''); setFilters({ source: 'All', assignedTo: 'All', budget: 'All', location: 'All', dateFrom: '', dateTo: '' }); }}
            style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', fontSize: '13px', fontWeight: '500', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <i className="ri-refresh-line"></i> Refresh
          </button>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
              <i className="ri-notification-3-fill"></i>
            </div>
            <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#ef4444', color: '#fff', fontSize: '10px', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              1
            </span>
          </div>

          <button 
            onClick={() => setShowFilterModal(true)}
            style={{ backgroundColor: '#0284c7', border: 'none', color: '#fff', fontSize: '13px', fontWeight: '600', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <i className="ri-equalizer-line"></i> Filters
          </button>

          <button 
            onClick={() => setShowAddModal(true)}
            style={{ backgroundColor: '#00b894', border: 'none', color: '#fff', fontSize: '13px', fontWeight: '600', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            + Add Leads
          </button>

          <button 
            onClick={exportToCSV}
            style={{ backgroundColor: '#f59e0b', border: 'none', color: '#fff', fontSize: '13px', fontWeight: '600', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
            title="Download CSV Spreadsheet"
          >
            <i className="ri-download-2-line"></i> Download Leads
          </button>
        </div>
      </div>

      {/* ── Leads Table Card ── */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', color: '#334155' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontWeight: '600', color: '#475569' }}>
                <th style={{ padding: '12px 10px', width: '35px' }}>
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll} 
                    checked={selectedLeads.length > 0 && selectedLeads.length === paginatedLeads.length} 
                  />
                </th>
                <th style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>Lead ID <i className="ri-arrow-up-down-line" style={{ fontSize: '11px', color: '#94a3b8' }}></i></th>
                <th style={{ padding: '12px 10px', minWidth: '220px' }}>Name <i className="ri-arrow-up-down-line" style={{ fontSize: '11px', color: '#94a3b8' }}></i></th>
                <th style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>Phone <i className="ri-arrow-up-down-line" style={{ fontSize: '11px', color: '#94a3b8' }}></i></th>
                <th style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>Status <i className="ri-arrow-up-down-line" style={{ fontSize: '11px', color: '#94a3b8' }}></i></th>
                <th style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>Budget <i className="ri-arrow-up-down-line" style={{ fontSize: '11px', color: '#94a3b8' }}></i></th>
                <th style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>Intent <i className="ri-arrow-up-down-line" style={{ fontSize: '11px', color: '#94a3b8' }}></i></th>
                <th style={{ padding: '12px 10px', minWidth: '160px' }}>Note <i className="ri-arrow-up-down-line" style={{ fontSize: '11px', color: '#94a3b8' }}></i></th>
                <th style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>Looking For <i className="ri-arrow-up-down-line" style={{ fontSize: '11px', color: '#94a3b8' }}></i></th>
                <th style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>Source <i className="ri-arrow-up-down-line" style={{ fontSize: '11px', color: '#94a3b8' }}></i></th>
                <th style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>Assigned To <i className="ri-arrow-up-down-line" style={{ fontSize: '11px', color: '#94a3b8' }}></i></th>
                <th style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>Next Followup <i className="ri-arrow-up-down-line" style={{ fontSize: '11px', color: '#94a3b8' }}></i></th>
                <th style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>Action <i className="ri-arrow-up-down-line" style={{ fontSize: '11px', color: '#94a3b8' }}></i></th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.map(lead => (
                <tr key={lead.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 10px' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedLeads.includes(lead.id)}
                      onChange={() => handleSelectLead(lead.id)}
                    />
                  </td>

                  {/* Lead ID */}
                  <td style={{ padding: '12px 10px', fontWeight: '600', color: '#1e293b' }}>
                    <span 
                      style={{ cursor: 'pointer', color: '#0284c7', textDecoration: 'underline' }}
                      onClick={() => setShowLeadDetailModal(lead)}
                    >
                      {lead.id}
                    </span>
                  </td>

                  {/* Name with Avatar */}
                  <td style={{ padding: '12px 10px', color: '#1e3a8a', fontWeight: '500', lineHeight: 1.4 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }} onClick={() => setShowLeadDetailModal(lead)}>
                      <img 
                        src={`/static/dashboard/assets/images/users/avatar-${(parseInt(lead.id.slice(-1)) % 3) + 1}.jpg`}
                        alt=""
                        style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, marginTop: '2px', border: '1px solid #e2e8f0' }}
                        onError={(e) => { e.target.src = '/static/dashboard/assets/images/users/user-dummy-img.jpg'; }}
                      />
                      <div>{lead.name}</div>
                    </div>
                  </td>

                  {/* Phone */}
                  <td style={{ padding: '12px 10px' }}>
                    <a 
                      href={`tel:${lead.phone}`}
                      style={{ textDecoration: 'none' }}
                      title={`Call ${lead.phone}`}
                    >
                      <div style={{ width: '38px', height: '36px', backgroundColor: '#334155', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
                        <i className="ri-phone-fill" style={{ fontSize: '13px' }}></i>
                        <span style={{ fontSize: '9px', fontWeight: 'bold' }}>P</span>
                      </div>
                    </a>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '3px' }}>
                      <select 
                        value={lead.status}
                        onChange={(e) => changeLeadStatus(lead.id, e.target.value)}
                        style={{ backgroundColor: '#0284c7', border: 'none', color: '#fff', fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', outline: 'none' }}
                      >
                        <option value="NEW LEAD">NEW LEAD ✏️</option>
                        <option value="IN FOLLOWUP">IN FOLLOWUP ✏️</option>
                        <option value="SITE VISIT">SITE VISIT ✏️</option>
                        <option value="SV COMPLETED">SV COMPLETED ✏️</option>
                        <option value="BOOKING INPROGRESS">BOOKING INPROGRESS ✏️</option>
                        <option value="BOOKINGS/ EOI">BOOKINGS/ EOI ✏️</option>
                        <option value="DEAD LEAD">DEAD LEAD ✏️</option>
                      </select>
                      <small style={{ fontSize: '10px', color: '#64748b', whiteSpace: 'nowrap' }}>
                        NewLead Date: {lead.statusDate}
                      </small>
                    </div>
                  </td>

                  {/* Budget */}
                  <td style={{ padding: '12px 10px' }}>
                    <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                      {lead.budget}
                    </span>
                  </td>

                  {/* Intent */}
                  <td style={{ padding: '12px 10px' }}>
                    <span style={{ backgroundColor: '#e0f2fe', color: '#0284c7', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                      {lead.intent}
                    </span>
                  </td>

                  {/* Note */}
                  <td style={{ padding: '12px 10px', fontSize: '12px', color: '#334155' }}>
                    {lead.note} <span style={{ color: '#0284c7', cursor: 'pointer', fontWeight: '500' }} onClick={() => setShowLeadDetailModal(lead)}>Read More</span>
                  </td>

                  {/* Looking For */}
                  <td style={{ padding: '12px 10px', color: '#64748b' }}>
                    {lead.lookingFor || '-'}
                  </td>

                  {/* Source */}
                  <td style={{ padding: '12px 10px', color: '#334155', fontWeight: '500' }}>
                    {lead.source}
                  </td>

                  {/* Assigned To */}
                  <td style={{ padding: '12px 10px' }}>
                    <select 
                      value={lead.assignedTo}
                      onChange={(e) => {
                        const val = e.target.value;
                        setLeads(prev => prev.map(item => item.id === lead.id ? { ...item, assignedTo: val } : item));
                      }}
                      style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', color: '#334155', backgroundColor: '#fff', outline: 'none' }}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Sales Team">Sales Team</option>
                      <option value="Executive">Executive</option>
                      <option value="Manager">Manager</option>
                    </select>
                  </td>

                  {/* Next Followup Button */}
                  <td style={{ padding: '12px 10px' }}>
                    <button 
                      onClick={() => setShowFollowupModal(lead)}
                      style={{ backgroundColor: '#0ea5e9', border: 'none', color: '#fff', fontSize: '12px', fontWeight: '600', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
                    >
                      See Followups <i className="ri-arrow-down-s-line"></i>
                    </button>
                  </td>

                  {/* Action */}
                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button 
                        onClick={() => setEditingLead(lead)}
                        style={{ backgroundColor: '#e0f2fe', border: '1px solid #bae6fd', color: '#0284c7', padding: '3px 8px', borderRadius: '4px', fontSize: '11.5px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                        title="Edit Lead Details"
                      >
                        <i className="ri-edit-line"></i> Edit
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete lead #${lead.id}?`)) {
                            setLeads(leads.filter(l => l.id !== lead.id));
                          }
                        }}
                        style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '16px', cursor: 'pointer', padding: '3px' }}
                        title="Delete Lead"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Table Pagination Bar ── */}
        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to <strong>{Math.min(currentPage * itemsPerPage, filteredLeads.length)}</strong> of <strong>{filteredLeads.length}</strong> entries
          </span>

          <div style={{ display: 'flex', gap: '4px' }}>
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              style={{ padding: '4px 10px', border: '1px solid #cbd5e1', backgroundColor: currentPage === 1 ? '#f8fafc' : '#fff', color: currentPage === 1 ? '#94a3b8' : '#334155', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '12px' }}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                style={{ padding: '4px 10px', border: '1px solid #cbd5e1', backgroundColor: currentPage === p ? '#0284c7' : '#fff', color: currentPage === p ? '#fff' : '#334155', fontWeight: currentPage === p ? '700' : '500', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
              >
                {p}
              </button>
            ))}

            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              style={{ padding: '4px 10px', border: '1px solid #cbd5e1', backgroundColor: currentPage === totalPages ? '#f8fafc' : '#fff', color: currentPage === totalPages ? '#94a3b8' : '#334155', borderRadius: '4px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: '12px' }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ── Filter Drawer / Modal ── */}
      {showFilterModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', width: '90%', maxWidth: '520px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h6 style={{ margin: 0, fontWeight: '700', fontSize: '15px' }}>Filter Leads Pipeline</h6>
              <button onClick={() => setShowFilterModal(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Lead Source</label>
                <select 
                  value={filters.source}
                  onChange={e => setFilters({ ...filters, source: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
                >
                  <option value="All">All Sources</option>
                  <option value="Company Website">Company Website</option>
                  <option value="MagicBricks">MagicBricks</option>
                  <option value="99acres">99acres</option>
                  <option value="Housing.com">Housing.com</option>
                  <option value="Direct Call">Direct Call</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Facebook Ads">Facebook Ads</option>
                </select>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Assigned Agent</label>
                <select 
                  value={filters.assignedTo}
                  onChange={e => setFilters({ ...filters, assignedTo: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
                >
                  <option value="All">All Agents</option>
                  <option value="Admin">Admin</option>
                  <option value="Sales Team">Sales Team</option>
                  <option value="Executive">Executive</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Pune Location</label>
                <select 
                  value={filters.location}
                  onChange={e => setFilters({ ...filters, location: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
                >
                  <option value="All">All Locations</option>
                  <option value="Wagholi">Wagholi</option>
                  <option value="Kharadi">Kharadi</option>
                  <option value="Dhanori">Dhanori</option>
                  <option value="Lohegaon">Lohegaon</option>
                  <option value="Viman Nagar">Viman Nagar</option>
                  <option value="Hinjewadi">Hinjewadi</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button 
                  onClick={() => { setFilters({ source: 'All', assignedTo: 'All', budget: 'All', location: 'All', dateFrom: '', dateTo: '' }); setShowFilterModal(false); }}
                  style={{ padding: '8px 16px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: '4px', fontSize: '13px', cursor: 'pointer' }}
                >
                  Reset
                </button>
                <button 
                  onClick={() => setShowFilterModal(false)}
                  style={{ padding: '8px 18px', backgroundColor: '#0284c7', border: 'none', color: '#fff', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Follow-up History Modal ── */}
      {showFollowupModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', width: '90%', maxWidth: '560px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h6 style={{ margin: 0, fontWeight: '700', fontSize: '15px' }}>Follow-up Timeline: {showFollowupModal.id}</h6>
              <button onClick={() => setShowFollowupModal(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: '20px', maxHeight: '420px', overflowY: 'auto' }}>
              <p style={{ fontWeight: '600', fontSize: '13px', color: '#1e293b', marginBottom: '12px' }}>
                {showFollowupModal.name}
              </p>

              {/* Add Note Form */}
              <form onSubmit={handleAddFollowup} style={{ marginBottom: '18px', display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Type new follow-up call note..."
                  value={newFollowupText}
                  onChange={e => setNewFollowupText(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
                />
                <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#0ea5e9', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
                  Add Note
                </button>
              </form>

              <h6 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>Activity Log:</h6>
              {showFollowupModal.followups && showFollowupModal.followups.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {showFollowupModal.followups.map((f, i) => (
                    <div key={i} style={{ backgroundColor: '#f8fafc', borderLeft: '3px solid #0ea5e9', padding: '8px 12px', borderRadius: '0 4px 4px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginBottom: '3px' }}>
                        <strong>{f.executive}</strong>
                        <span>{f.date}</span>
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#334155' }}>{f.note}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#94a3b8', fontSize: '12px' }}>No previous follow-ups logged yet. Add one above.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Lead Detail Modal ── */}
      {showLeadDetailModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', width: '90%', maxWidth: '580px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h6 style={{ margin: 0, fontWeight: '700', fontSize: '15px' }}>Lead Details: #{showLeadDetailModal.id}</h6>
              <button onClick={() => setShowLeadDetailModal(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: '20px' }}>
              <h6 style={{ color: '#1e3a8a', fontWeight: '700', fontSize: '14px', marginBottom: '8px' }}>{showLeadDetailModal.name}</h6>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '6px', marginBottom: '14px' }}>
                <div>
                  <small style={{ color: '#64748b', display: 'block' }}>Phone Number</small>
                  <strong>{showLeadDetailModal.phone}</strong>
                </div>
                <div>
                  <small style={{ color: '#64748b', display: 'block' }}>Email Address</small>
                  <strong>{showLeadDetailModal.email}</strong>
                </div>
                <div>
                  <small style={{ color: '#64748b', display: 'block' }}>Property Requirement</small>
                  <strong>{showLeadDetailModal.lookingFor}</strong>
                </div>
                <div>
                  <small style={{ color: '#64748b', display: 'block' }}>Budget Range</small>
                  <strong style={{ color: '#16a34a' }}>{showLeadDetailModal.budget}</strong>
                </div>
                <div>
                  <small style={{ color: '#64748b', display: 'block' }}>Source Channel</small>
                  <strong>{showLeadDetailModal.source}</strong>
                </div>
                <div>
                  <small style={{ color: '#64748b', display: 'block' }}>Assigned Executive</small>
                  <strong>{showLeadDetailModal.assignedTo}</strong>
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <small style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>Client Note</small>
                <div style={{ fontSize: '13px', color: '#334155', backgroundColor: '#fff', border: '1px solid #e2e8f0', padding: '8px 12px', borderRadius: '4px' }}>
                  {showLeadDetailModal.note}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button 
                  onClick={() => {
                    setEditingLead(showLeadDetailModal);
                    setShowLeadDetailModal(null);
                  }}
                  style={{ padding: '6px 14px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <i className="ri-edit-line"></i> Edit This Lead
                </button>
                <button onClick={() => setShowLeadDetailModal(null)} style={{ padding: '6px 16px', backgroundColor: '#64748b', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Lead Modal ── */}
      {editingLead && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', width: '90%', maxWidth: '540px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '14px 20px', backgroundColor: '#0284c7', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h6 style={{ margin: 0, fontWeight: '700', fontSize: '15px' }}>✏️ Edit Lead #{editingLead.id}</h6>
              <button onClick={() => setEditingLead(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer' }}>×</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              setLeads(prev => prev.map(l => l.id === editingLead.id ? {
                ...l,
                name: fd.get('name') || l.name,
                phone: fd.get('phone') || l.phone,
                email: fd.get('email') || l.email,
                budget: fd.get('budget') || l.budget,
                lookingFor: fd.get('lookingFor') || l.lookingFor,
                status: fd.get('status') || l.status,
                intent: fd.get('intent') || l.intent,
                source: fd.get('source') || l.source,
                assignedTo: fd.get('assignedTo') || l.assignedTo,
                location: fd.get('location') || l.location,
                note: fd.get('note') || l.note,
              } : l));
              setEditingLead(null);
            }} style={{ padding: '20px', maxHeight: '80vh', overflowY: 'auto' }}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Client Full Name *</label>
                <input required name="name" type="text" defaultValue={editingLead.name} style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Phone Number *</label>
                  <input required name="phone" type="text" defaultValue={editingLead.phone} style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Email Address</label>
                  <input name="email" type="email" defaultValue={editingLead.email} style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Requirement</label>
                  <input name="lookingFor" type="text" defaultValue={editingLead.lookingFor} style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Budget Range</label>
                  <input name="budget" type="text" defaultValue={editingLead.budget} style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Status</label>
                  <select name="status" defaultValue={editingLead.status} style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}>
                    <option value="NEW LEAD">NEW LEAD</option>
                    <option value="IN FOLLOWUP">IN FOLLOWUP</option>
                    <option value="SITE VISIT">SITE VISIT</option>
                    <option value="SV COMPLETED">SV COMPLETED</option>
                    <option value="BOOKING INPROGRESS">BOOKING INPROGRESS</option>
                    <option value="BOOKINGS/ EOI">BOOKINGS/ EOI</option>
                    <option value="DEAD LEAD">DEAD LEAD</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Intent</label>
                  <select name="intent" defaultValue={editingLead.intent} style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}>
                    <option value="HOT LEAD">HOT LEAD</option>
                    <option value="WARM LEAD">WARM LEAD</option>
                    <option value="NEW LEAD">NEW LEAD</option>
                    <option value="SITE VISIT">SITE VISIT</option>
                    <option value="FINAL DEAL">FINAL DEAL</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Assigned To</label>
                  <select name="assignedTo" defaultValue={editingLead.assignedTo} style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}>
                    <option value="Admin">Admin</option>
                    <option value="Sales Team">Sales Team</option>
                    <option value="Executive">Executive</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Location</label>
                  <input name="location" type="text" defaultValue={editingLead.location} style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }} />
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Inquiry Note / Remarks</label>
                <textarea name="note" rows="3" defaultValue={editingLead.note} style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setEditingLead(null)} style={{ padding: '8px 16px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: '4px', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 20px', backgroundColor: '#00b894', border: 'none', color: '#fff', borderRadius: '4px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>💾 Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Add New Lead Modal ── */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', width: '90%', maxWidth: '500px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h6 style={{ margin: 0, fontWeight: '700', fontSize: '15px' }}>+ Add New Lead</h6>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>×</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const newObj = {
                id: `20220${Math.floor(10000 + Math.random() * 90000)}`,
                name: fd.get('name') || 'New Client',
                phone: fd.get('phone') || '+91 9000000000',
                email: fd.get('email') || 'client@example.com',
                status: 'NEW LEAD',
                statusDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }),
                budget: fd.get('budget') || '50 LACS',
                intent: 'NEW LEAD',
                note: fd.get('note') || 'Fresh inquiry received via admin panel ..',
                lookingFor: fd.get('lookingFor') || '2 BHK Apartment',
                source: 'Admin Direct',
                assignedTo: 'Admin',
                location: 'Wagholi',
                followups: []
              };
              setLeads([newObj, ...leads]);
              setShowAddModal(false);
            }} style={{ padding: '20px' }}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Client Full Name *</label>
                <input required name="name" type="text" placeholder="Full name" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Phone Number *</label>
                <input required name="phone" type="text" placeholder="10-digit mobile number" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Email Address</label>
                <input name="email" type="email" placeholder="Email address" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Requirement</label>
                  <input name="lookingFor" type="text" placeholder="e.g. 2BHK / Villa" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Budget</label>
                  <input name="budget" type="text" placeholder="e.g. 60 LACS" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }} />
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Inquiry Note</label>
                <textarea name="note" rows="2" placeholder="Enter inquiry details..." style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '8px 16px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: '4px', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 18px', backgroundColor: '#00b894', border: 'none', color: '#fff', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Save Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
}
