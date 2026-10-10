import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';

export default function LeadsDashboard() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showLeadDetailModal, setShowLeadDetailModal] = useState(null);
  const [showFollowupModal, setShowFollowupModal] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(null);
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please ensure permissions are granted.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all tracks to turn off the microphone
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const [selectedLeads, setSelectedLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter criteria state

  

  const [projectsList, setProjectsList] = useState(() => {
    try {
      const stored = localStorage.getItem('cp_projects_list');
      if (stored) return JSON.parse(stored);
    } catch(e){}
    return [
      { id: 'proj-1', title: 'CODENAME FIREWORKS' },
      { id: 'proj-2', title: 'MANTRA MIRARI' },
      { id: 'proj-3', title: 'Atelier Greens by Adani Realty' },
      { id: 'proj-4', title: 'CODENAME QUAD AT MAHINDRA CITADEL' }
    ];
  });

  const API = 'http://localhost:8000/api/dashboard';
  const CLIENT_CACHE_SECONDS = 60;

  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [tabCounts, setTabCounts] = useState({
    all: 0, new: 0, followups: 0, siteVisits: 0, svCompleted: 0, bookingInprogress: 0,
    bookings: 0, pending: 0, todayPending: 0, dead: 0, duplicate: 0
  });
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [followupInfo, setFollowupInfo] = useState('');
  const [bellCount, setBellCount] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const forceReloadRef = useRef(false);
  const responseCacheRef = useRef(new Map());

  // Live "Apply Leads Filter" form values (null when no filter is applied)
  const [activeFilter, setActiveFilter] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const filterFormRef = useRef(null);
  const downloadFormRef = useRef(null);

  const [sortConfig, setSortConfig] = useState({ key: null, dir: 'asc' });

  // "Read More" note popover and "See Followups" dropdown (one open at a time)
  const [floatingPanel, setFloatingPanel] = useState(null);
  const floatingPanelRef = useRef(null);
  const openFloatingPanel = (e, type, lead) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setFloatingPanel(prev => prev && prev.type === type && prev.lead.id === lead.id
      ? null
      : { type, lead, top: rect.bottom + 4, left: Math.max(8, Math.min(rect.left, window.innerWidth - 300)) });
  };
  useEffect(() => {
    if (!floatingPanel) return;
    const close = (e) => {
      if (floatingPanelRef.current?.contains(e.target)) return;
      setFloatingPanel(null);
    };
    window.addEventListener('click', close);
    window.addEventListener('scroll', close, true);
    return () => {
      window.removeEventListener('click', close);
      window.removeEventListener('scroll', close, true);
    };
  }, [floatingPanel]);

  // Bell: live "Notification Details" (period / staff / date filters)
  const [notifications, setNotifications] = useState({ rows: [], periodOptions: [], staffOptions: [] });
  const [notificationQuery, setNotificationQuery] = useState({ period: 'daily', staff: '', fromDate: '', toDate: '' });
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState('');
  const loadNotifications = (query) => {
    setNotificationsLoading(true);
    setNotificationsError('');
    const params = query ? '?' + new URLSearchParams(query).toString() : '';
    fetch(`${API}/notifications${params}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setNotifications(data);
          if (!query && data.staffOptions?.length) {
            setNotificationQuery(q => ({ ...q, staff: q.staff || data.staffOptions[0].value }));
          }
        } else {
          setNotifications(prev => ({ ...prev, rows: [] }));
          setNotificationsError(data.message || 'Could not load notifications');
        }
      })
      .catch(() => setNotificationsError('Could not reach the backend at localhost:8000'))
      .finally(() => setNotificationsLoading(false));
  };
  const openNotifications = () => {
    setShowNotificationModal(true);
    loadNotifications(null);
  };

  // Like the live site, search runs 5 sec after the user stops typing
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 5000);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Tabs, pagination, search and filters are served by the local backend.
  // Responses are kept for a minute so going back to a tab or page is instant.
  useEffect(() => {
    let ignore = false;
    const force = forceReloadRef.current;
    forceReloadRef.current = false;

    let url, options, mode;
    if (activeFilter) {
      mode = 'filter';
      url = `${API}/leads/filter`;
      options = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(activeFilter) };
    } else if (debouncedSearch) {
      mode = 'search';
      url = `${API}/leads/search?q=${encodeURIComponent(debouncedSearch)}`;
    } else {
      mode = 'page';
      url = `${API}/leads?tab=${activeTab}&page=${currentPage}${force ? '&force=true' : ''}`;
    }
    const cacheKey = `${mode}|${activeTab}|${currentPage}|${debouncedSearch}|${options?.body || ''}`;

    const show = (data) => {
      setLeads(data.data);
      setTotalLeads(data.total);
      setTotalPages(mode === 'page' ? data.lastPage : 1);
      if (data.counts) setTabCounts(prev => ({ ...prev, ...data.counts }));
      if (data.followupInfo) setFollowupInfo(data.followupInfo);
      if (data.bellCount !== undefined) setBellCount(data.bellCount);
    };

    const cached = !force && responseCacheRef.current.get(cacheKey);
    if (cached) {
      show(cached.data);
      setIsLoading(false);
      setLoadError('');
      if ((Date.now() - cached.at) / 1000 < CLIENT_CACHE_SECONDS) return () => { ignore = true; };
    } else {
      setIsLoading(true);
    }

    fetch(url, options)
      .then(res => res.json())
      .then(data => {
        if (ignore) return;
        if (data.status === 'success') {
          responseCacheRef.current.set(cacheKey, { at: Date.now(), data });
          show(data);
          setLoadError('');
        } else if (!cached) {
          setLeads([]);
          setLoadError(data.message || 'Could not load leads');
        }
      })
      .catch(() => { if (!ignore && !cached) setLoadError('Could not reach the backend at localhost:8000'); })
      .finally(() => { if (!ignore) setIsLoading(false); });
    return () => { ignore = true; };
  }, [activeTab, currentPage, debouncedSearch, activeFilter, reloadKey]);

  const selectTab = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchTerm('');
    setDebouncedSearch('');
    setActiveFilter(null);
    setSortConfig({ key: null, dir: 'asc' });
  };

  const refreshLeads = () => {
    responseCacheRef.current.clear();
    forceReloadRef.current = true;
    setSearchTerm('');
    setDebouncedSearch('');
    setActiveFilter(null);
    setSortConfig({ key: null, dir: 'asc' });
    setReloadKey(k => k + 1);
  };

  // Re-read the current view after a change (keeps the tab, page, search and filter)
  const reloadLeads = () => {
    responseCacheRef.current.clear();
    setReloadKey(k => k + 1);
  };

  const sendLeadChange = (url, options) =>
    fetch(url, options)
      .then(res => res.json())
      .then(data => { if (data.status !== 'success') alert(data.message || 'Could not save'); reloadLeads(); return data; })
      .catch(() => alert('Could not reach the backend at localhost:8000'));

  const saveLead = (lead, changes) => sendLeadChange(`${API}/leads/${lead.pk || lead.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes)
  });

  const addLead = (fields) => sendLeadChange(`${API}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields)
  });

  // "Upload Excel": imports a .csv file (columns: name, phone, email, location, budget, lookingFor, source, note)
  const importLeadsFile = (input) => {
    const file = input?.files?.[0];
    if (!file) { alert('Choose a .csv file first'); return; }
    if (!/\.csv$/i.test(file.name)) { alert('Please save the Excel sheet as .csv and upload that file'); return; }
    file.text().then(async (text) => {
      const [header, ...rows] = text.split(/\r?\n/).filter(line => line.trim());
      const cols = header.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      let added = 0;
      for (const row of rows) {
        const cells = row.match(/("([^"]|"")*"|[^,]*)(,|$)/g).map(c => c.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"').trim());
        const lead = Object.fromEntries(cols.map((c, i) => [c, cells[i] || '']));
        if (!lead.name || !lead.phone) continue;
        await fetch(`${API}/leads`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) });
        added++;
      }
      alert(`${added} lead(s) imported`);
      setShowAddModal(false);
      reloadLeads();
    });
  };

  // Read a live-style filter form (inputs are linked to it with form="...")
  const readLeadsForm = (form) => {
    const fd = new FormData(form);
    return {
      status: fd.getAll('status[]'),
      intent: fd.getAll('intent[]'),
      lookingFor: fd.getAll('lookingFor[]'),
      leadSource: fd.getAll('leadSource[]'),
      dateStatus: fd.get('dateStatus') || 'allDate',
      fromDate: fd.get('fromDate') || '',
      toDate: fd.get('toDate') || '',
      contentField: fd.getAll('contentField[]')
    };
  };

  const toggleAllChecks = (e, name) => {
    [...e.target.form.elements]
      .filter(el => el.name === name)
      .forEach(el => { el.checked = e.target.checked; });
  };

  const applyLeadsFilter = () => {
    if (!filterFormRef.current) return;
    setActiveFilter(readLeadsForm(filterFormRef.current));
    setSortConfig({ key: null, dir: 'asc' });
    setCurrentPage(1);
    setSearchTerm('');
    setDebouncedSearch('');
    setShowFilterModal(false);
  };

  const clearLeadsFilter = () => {
    filterFormRef.current?.reset();
    if (activeFilter) {
      setActiveFilter(null);
      setCurrentPage(1);
    }
  };

  const downloadLeadsCsv = () => {
    if (!downloadFormRef.current) return;
    setIsDownloading(true);
    fetch(`${API}/leads/download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(readLeadsForm(downloadFormRef.current))
    })
      .then(async res => {
        if (!(res.headers.get('Content-Type') || '').includes('text/csv')) {
          const data = await res.json();
          throw new Error(data.message || 'Download failed');
        }
        const url = URL.createObjectURL(await res.blob());
        const link = document.createElement('a');
        link.href = url;
        link.download = 'leads-data.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setShowDownloadModal(false);
      })
      .catch(err => alert(err.message))
      .finally(() => setIsDownloading(false));
  };

  // Lead details live under the lead's internal id (e.g. 3124), not the displayed Lead ID
  const openLeadDetails = (lead) => {
    setShowLeadDetailModal({ ...lead, loadingDetails: true });
    fetch(`${API}/leads/${lead.pk || lead.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setShowLeadDetailModal({ ...lead, customerDetails: data.data.customerDetails, activities: data.data.activities, loadingDetails: false });
          setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, customerDetails: data.data.customerDetails, activities: data.data.activities } : l));
        } else {
          setShowLeadDetailModal({ ...lead, loadingDetails: false });
        }
      })
      .catch(() => setShowLeadDetailModal({ ...lead, loadingDetails: false }));
  };

  // Column sorting on the current page, like the live table
  const parseLiveDate = (text) => {
    const cleaned = (text || '')
      .replace(/\bnoon\b/, '12:00 p.m.').replace(/\bmidnight\b/, '12:00 a.m.')
      .replace(/a\.m\./, 'AM').replace(/p\.m\./, 'PM').replace(/Sept\./, 'Sep').replace(/\./g, '');
    const t = Date.parse(cleaned);
    return isNaN(t) ? 0 : t;
  };
  const sortValue = (lead, key) => {
    if (key === 'createdDate') return parseLiveDate(lead.createdDate);
    if (key === 'assignedTo') return lead.assignedOptions?.[0] || '';
    return String(lead[key] ?? '');
  };
  const toggleSort = (key) => {
    setSortConfig(prev => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }));
  };

  const tabButtonStyle = (tab) => ({
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: activeTab === tab ? '700' : '500',
    color: activeTab === tab ? '#0f172a' : '#475569',
    borderBottom: activeTab === tab ? '2px solid #f97316' : 'none',
    paddingBottom: '4px'
  });

  // Tab, search and filters are applied by the backend; sorting happens here
  const filteredLeads = sortConfig.key
    ? [...leads].sort((a, b) => {
        const va = sortValue(a, sortConfig.key), vb = sortValue(b, sortConfig.key);
        const cmp = typeof va === 'number' ? va - vb : va.localeCompare(vb, undefined, { numeric: true, sensitivity: 'base' });
        return sortConfig.dir === 'asc' ? cmp : -cmp;
      })
    : leads;

  const paginatedLeads = filteredLeads;

  // Page numbers shown in the pagination bar (5 at a time, like the live site)
  const pageWindowStart = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, i) => pageWindowStart + i);

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
        <span style={{ fontSize: '11px', color: '#64748b' }}>{followupInfo}</span>
      </div>

      {/* ── Status Tab Pills (Two Rows) ── */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px' }}>
        {/* Row 1 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '10px' }}>
          <button 
            onClick={() => selectTab('all')} 
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
            onClick={() => selectTab('new')} 
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
            onClick={() => selectTab('followups')} 
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
            onClick={() => selectTab('siteVisits')} 
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
            onClick={() => selectTab('svCompleted')}
            style={tabButtonStyle('svCompleted')}
          >
            SV Completed <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold', marginLeft: '4px' }}>{tabCounts.svCompleted}</span>
          </button>

          <button 
            onClick={() => selectTab('bookingInprogress')} 
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
            onClick={() => selectTab('bookings')} 
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
          <button onClick={() => selectTab('pending')} style={tabButtonStyle('pending')}>
            Pending Leads <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold', marginLeft: '4px' }}>{tabCounts.pending}</span>
          </button>

          <button onClick={() => selectTab('todayPending')} style={tabButtonStyle('todayPending')}>
            Today Pending Leads <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold', marginLeft: '4px' }}>{tabCounts.todayPending}</span>
          </button>

          <button onClick={() => selectTab('dead')} style={tabButtonStyle('dead')}>
            Dead Leads <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold', marginLeft: '4px' }}>{tabCounts.dead}</span>
          </button>

          <button onClick={() => selectTab('duplicate')} style={tabButtonStyle('duplicate')}>
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
            {totalLeads} LEADS
          </span>

          <button
            onClick={refreshLeads}
            style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', fontSize: '13px', fontWeight: '500', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <i className="ri-refresh-line"></i> Refresh
          </button>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <div onClick={openNotifications} style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', cursor: 'pointer' }}>
              <i className="ri-notification-3-fill"></i>
            </div>
            <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#ef4444', color: '#fff', fontSize: '10px', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {bellCount}
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
            onClick={() => setShowDownloadModal(true)}
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
                
                
                <th style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>Lead ID</th>
                {[
                  ['Name', 'name', { minWidth: '220px', whiteSpace: 'normal' }],
                  ['Phone', 'phone'],
                  ['Status', 'status'],
                  ['Budget', 'budget'],
                  ['Intent', 'intent'],
                  ['Note', 'note', { minWidth: '160px', whiteSpace: 'normal' }],
                  ['Looking For', 'lookingFor'],
                  ['Source', 'source'],
                  ['Assigned To', 'assignedTo'],
                  ['Next Followup', 'createdDate']
                ].map(([label, key, extra]) => (
                  <th key={key} onClick={() => toggleSort(key)} style={{ padding: '12px 10px', whiteSpace: 'nowrap', cursor: 'pointer', userSelect: 'none', ...extra }}>
                    {label} <i className={sortConfig.key !== key ? 'ri-arrow-up-down-line' : sortConfig.dir === 'asc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} style={{ fontSize: '11px', color: sortConfig.key === key ? '#0284c7' : '#94a3b8' }}></i>
                  </th>
                ))}
                <th style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={12} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>{activeFilter ? 'Applying filter...' : 'Loading leads...'}</td></tr>
              )}
              {!isLoading && paginatedLeads.length === 0 && (
                <tr><td colSpan={12} style={{ padding: '24px', textAlign: 'center', color: loadError ? '#dc2626' : '#64748b' }}>{loadError || 'No leads found'}</td></tr>
              )}
              {!isLoading && paginatedLeads.map(lead => (
                <tr key={lead.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  {/* Lead ID */}
                  <td style={{ padding: '12px 10px', fontWeight: '600', color: '#1e293b' }}>
                    <span 
                      style={{ cursor: 'pointer', color: '#0284c7', textDecoration: 'underline' }}
                      onClick={() => openLeadDetails(lead)}
                    >
                      {lead.id}
                    </span>
                  </td>
                  

                  

                  {/* Name with Avatar */}
                  <td style={{ padding: '12px 10px', color: '#1e3a8a', fontWeight: '500', lineHeight: 1.4 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }} onClick={() => openLeadDetails(lead)}>
                      
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{lead.name}</span>
                        <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px', fontWeight: 'normal' }}>Created Date: {lead.createdDate}</span>
                      </div>
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
                        <span 
                          onClick={() => setShowStatusModal(lead)}
                          style={{ backgroundColor: lead.statusColor || '#299cdb', color: '#fff', fontSize: '11px', fontWeight: '600', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                        >
                          {lead.status} <i className="ri-pencil-line"></i>
                        </span>
                        <small style={{ fontSize: '10px', color: '#64748b', whiteSpace: 'nowrap' }}>
                          {lead.statusLabel ? `${lead.statusLabel} Date:` : 'Date:'} {lead.statusDate}
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
                    {lead.note} <span style={{ color: '#0284c7', cursor: 'pointer', fontWeight: '500' }} onClick={(e) => openFloatingPanel(e, 'note', lead)}>Read More</span>
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
                      value={lead.assignedSelected ?? lead.assignedOptions?.[0] ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setLeads(prev => prev.map(item => item.id === lead.id ? { ...item, assignedSelected: val } : item));
                        saveLead(lead, { assignedTo: val });
                      }}
                      style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 8px', fontSize: '12px', color: '#334155', backgroundColor: '#fff', outline: 'none', maxWidth: '140px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                    >
                      {(lead.assignedOptions || []).map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </td>

                  {/* Next Followup Button */}
                  <td style={{ padding: '12px 10px' }}>
                    <button 
                      onClick={(e) => openFloatingPanel(e, 'followups', lead)}
                      style={{ backgroundColor: '#0ea5e9', border: 'none', color: '#fff', fontSize: '12px', fontWeight: '600', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
                    >
                      See Followups <i className="ri-arrow-down-s-line"></i>
                    </button>
                  </td>

                  {/* Action */}

                    <td style={{ padding: '12px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      
                      <button 
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete lead #${lead.id}?`)) {
                            setLeads(leads.filter(l => l.id !== lead.id));
                            sendLeadChange(`${API}/leads/${lead.pk || lead.id}`, { method: 'DELETE' });
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
            Available Leads <strong>{totalLeads}</strong>
          </span>

          <div style={{ display: 'flex', gap: '4px' }}>
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              style={{ padding: '4px 10px', border: '1px solid #cbd5e1', backgroundColor: currentPage === 1 ? '#f8fafc' : '#fff', color: currentPage === 1 ? '#94a3b8' : '#334155', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '12px' }}
            >
              Previous
            </button>

            {pageNumbers.map(p => (
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

      {/* ── "Read More" note / "See Followups" dropdown ── */}
      {floatingPanel && (
        <div ref={floatingPanelRef} style={{ position: 'fixed', top: floatingPanel.top, left: floatingPanel.left, zIndex: 9999, width: '280px', maxHeight: '260px', overflowY: 'auto', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 8px 24px rgba(15,23,42,0.15)', fontSize: '12px', color: '#334155' }}>
          {floatingPanel.type === 'note' ? (
            <div style={{ padding: '10px 12px', lineHeight: 1.5 }}>{floatingPanel.lead.fullNote || floatingPanel.lead.note || '-'}</div>
          ) : floatingPanel.lead.followups?.length ? (
            floatingPanel.lead.followups.map((item, i) => (
              <div key={i} style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item}>{item}</div>
            ))
          ) : (
            <div style={{ padding: '10px 12px', color: '#94a3b8' }}>No followups yet</div>
          )}
        </div>
      )}


      {/* ── Filter Drawer / Modal ── */}
      
      {/* ── Filter Leads Modal ── */}
      {showFilterModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <div style={{ backgroundColor: '#fff', width: '380px', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '-5px 0 25px rgba(0,0,0,0.1)' }}>
            
            {/* Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                <i className="ri-filter-3-line" style={{ fontSize: '18px' }}></i>
                <h6 style={{ margin: 0, fontWeight: '600', fontSize: '14.5px', color: '#334155' }}>Apply Leads Filter</h6>
              </div>
              <button onClick={() => setShowFilterModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>

            <form id="leadsFilterForm" ref={filterFormRef} onSubmit={e => e.preventDefault()} />
            {/* Body */}
            <div style={{ padding: '16px 24px', overflowY: 'auto', flex: 1, fontSize: '12.5px', color: '#334155' }}>
              
              {/* STATUS */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: '700', color: '#94a3b8', fontSize: '11px', marginBottom: '10px' }}>STATUS</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsFilterForm" name="status[]" value="New Lead" /> New Leads</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" form="leadsFilterForm" name="status[]" value="Not Connected" /> Not Connected</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" form="leadsFilterForm" name="status[]" value="In Progress" /> In Progress</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" form="leadsFilterForm" name="status[]" value="SV Scheduled" /> SV Scheduled</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" form="leadsFilterForm" name="status[]" value="EOI Completed" /> EOI Completed</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" form="leadsFilterForm" name="status[]" value="Bookings In Progress" /> Bookings In Progress</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" form="leadsFilterForm" name="status[]" value="Booking Completed" /> Booking Completed</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" form="leadsFilterForm" name="status[]" value="Dead Lead" /> Dead Lead</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" form="leadsFilterForm" name="status[]" value="SV Completed" /> SV Completed</label>
                </div>
              </div>

              {/* SELECT INTENT */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: '700', color: '#94a3b8', fontSize: '11px', marginBottom: '10px' }}>SELECT INTENT</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsFilterForm" name="intent[]" value="Cold" /> Cold</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" form="leadsFilterForm" name="intent[]" value="Warm" /> Warm</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" form="leadsFilterForm" name="intent[]" value="Hot" /> Hot</label>
                </div>
              </div>

              {/* SELECT LOOKING FOR */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: '700', color: '#94a3b8', fontSize: '11px', marginBottom: '10px' }}>SELECT LOOKING FOR</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsFilterForm" name="lookingFor[]" value="Property on Rent" /> Property on Rent</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsFilterForm" name="lookingFor[]" value="Buy New Property" /> Buy New Property</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsFilterForm" name="lookingFor[]" value="Property on Loan" /> Property on Loan</label>
                </div>
              </div>

              {/* SELECT FOLLOWUP DATE */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: '700', color: '#94a3b8', fontSize: '11px', marginBottom: '10px' }}>SELECT FOLLOWUP DATE</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><input type="radio" defaultChecked form="leadsFilterForm" name="dateStatus" value="allDate" /> All Dates</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><input type="radio" form="leadsFilterForm" name="dateStatus" value="today" /> Today</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><input type="radio" form="leadsFilterForm" name="dateStatus" value="yesterday" /> Yesterday</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><input type="radio" form="leadsFilterForm" name="dateStatus" value="tomorrow" /> Tomorrow</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', gridColumn: 'span 2' }}><input type="radio" form="leadsFilterForm" name="dateStatus" value="dateRange" /> Select Date</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ width: '40px' }}>From</span>
                  <input type="date" form="leadsFilterForm" name="fromDate" style={{ flex: 1, padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#f8fafc', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '40px' }}>To</span>
                  <input type="date" form="leadsFilterForm" name="toDate" style={{ flex: 1, padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#f8fafc', outline: 'none' }} />
                </div>
              </div>

              {/* LEADS SOURCE */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ fontWeight: '700', color: '#94a3b8', fontSize: '11px' }}>LEADS SOURCE</div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}><input type="checkbox" defaultChecked form="leadsFilterForm" onChange={e => toggleAllChecks(e, 'leadSource[]')} /> Select All</label>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsFilterForm" name="leadSource[]" value="Facebook Ads" /> Facebook Ads</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsFilterForm" name="leadSource[]" value="Google Ads" /> Google Ads</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsFilterForm" name="leadSource[]" value="Landing Page" /> Landing Page</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsFilterForm" name="leadSource[]" value="Magicbricks" /> Magicbricks</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsFilterForm" name="leadSource[]" value="Makaan" /> Makaan</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsFilterForm" name="leadSource[]" value="Company Website" /> Company Website</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsFilterForm" name="leadSource[]" value="just_dial" /> Just dial</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsFilterForm" name="leadSource[]" value="Youtube" /> Youtube</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsFilterForm" name="leadSource[]" value="OLX" /> OLX</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsFilterForm" name="leadSource[]" value="Referance" /> Referance</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsFilterForm" name="leadSource[]" value="99Acres" /> 99 Acres</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsFilterForm" name="leadSource[]" value="Common Floor" /> Common Floor</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsFilterForm" name="leadSource[]" value="Housing" /> Housing</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsFilterForm" name="leadSource[]" value="Whatsapp" /> Whatsapp</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsFilterForm" name="leadSource[]" value="Tele Calling" /> Tele Calling</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsFilterForm" name="leadSource[]" value="Other" /> Other</label>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px' }}>
              <button type="button" onClick={clearLeadsFilter} style={{ flex: 1, padding: '10px 0', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Clear Filter</button>
              <button type="button" onClick={applyLeadsFilter} style={{ flex: 1, padding: '10px 0', backgroundColor: '#0ab39c', border: 'none', color: '#fff', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Filters</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Download Leads Modal ── */}
      {showDownloadModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <div style={{ backgroundColor: '#fff', width: '420px', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '-5px 0 25px rgba(0,0,0,0.1)' }}>
            
            {/* Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                <i className="ri-filter-3-line" style={{ fontSize: '18px' }}></i>
                <h6 style={{ margin: 0, fontWeight: '600', fontSize: '14.5px', color: '#334155' }}>Filter Leads Report</h6>
              </div>
              <button onClick={() => setShowDownloadModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>

            <form id="leadsDownloadForm" ref={downloadFormRef} onSubmit={e => e.preventDefault()} />
            {/* Body */}
            <div style={{ padding: '16px 24px', overflowY: 'auto', flex: 1, fontSize: '12.5px', color: '#334155' }}>
              
              {/* STATUS */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: '700', color: '#94a3b8', fontSize: '11px', marginBottom: '10px' }}>STATUS</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="status[]" value="New Lead" /> New Leads</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" form="leadsDownloadForm" name="status[]" value="Not Connected" /> Not Connected</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" form="leadsDownloadForm" name="status[]" value="In Progress" /> In Progress</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" form="leadsDownloadForm" name="status[]" value="SV Scheduled" /> SV Scheduled</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" form="leadsDownloadForm" name="status[]" value="EOI Completed" /> EOI Completed</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" form="leadsDownloadForm" name="status[]" value="Bookings In Progress" /> Bookings In Progress</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" form="leadsDownloadForm" name="status[]" value="Booking Completed" /> Booking Completed</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" form="leadsDownloadForm" name="status[]" value="Dead Lead" /> Dead Lead</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" form="leadsDownloadForm" name="status[]" value="SV Completed" /> SV Completed</label>
                </div>
              </div>

              {/* SELECT INTENT */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: '700', color: '#94a3b8', fontSize: '11px', marginBottom: '10px' }}>SELECT INTENT</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="intent[]" value="New" /> New</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="intent[]" value="Cold" /> Cold</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" form="leadsDownloadForm" name="intent[]" value="Warm" /> Warm</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" form="leadsDownloadForm" name="intent[]" value="Hot" /> Hot</label>
                </div>
              </div>

              {/* SELECT LOOKING FOR */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: '700', color: '#94a3b8', fontSize: '11px', marginBottom: '10px' }}>SELECT LOOKING FOR</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="lookingFor[]" value="Property on Rent" /> Property on Rent</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="lookingFor[]" value="Buy New Property" /> Buy New Property</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="lookingFor[]" value="Property on Loan" /> Property on Loan</label>
                </div>
              </div>

              {/* SELECT FOLLOWUP DATE */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: '700', color: '#94a3b8', fontSize: '11px', marginBottom: '10px' }}>SELECT FOLLOWUP DATE</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><input type="radio" defaultChecked form="leadsDownloadForm" name="dateStatus" value="allDate" /> All Dates</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><input type="radio" form="leadsDownloadForm" name="dateStatus" value="today" /> Today</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><input type="radio" form="leadsDownloadForm" name="dateStatus" value="yesterday" /> Yesterday</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><input type="radio" form="leadsDownloadForm" name="dateStatus" value="tomorrow" /> Tomorrow</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', gridColumn: 'span 2' }}><input type="radio" form="leadsDownloadForm" name="dateStatus" value="dateRange" /> Select Date</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ width: '40px' }}>From</span>
                  <input type="date" form="leadsDownloadForm" name="fromDate" style={{ flex: 1, padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#f8fafc', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '40px' }}>To</span>
                  <input type="date" form="leadsDownloadForm" name="toDate" style={{ flex: 1, padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#f8fafc', outline: 'none' }} />
                </div>
              </div>

              {/* LEADS SOURCE */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ fontWeight: '700', color: '#94a3b8', fontSize: '11px' }}>LEADS SOURCE</div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" onChange={e => toggleAllChecks(e, 'leadSource[]')} /> Select All</label>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="leadSource[]" value="Facebook Ads" /> Facebook Ads</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="leadSource[]" value="Google Ads" /> Google Ads</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="leadSource[]" value="Referance" /> Referance</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="leadSource[]" value="Landing Page" /> Landing Page</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="leadSource[]" value="99Acres" /> 99 Acres</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="leadSource[]" value="OLX" /> OLX</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="leadSource[]" value="Magicbricks" /> Magicbricks</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="leadSource[]" value="Common Floor" /> Common Floor</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="leadSource[]" value="Makaan" /> Makaan</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="leadSource[]" value="Housing" /> Housing</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="leadSource[]" value="Company Website" /> Company Website</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="leadSource[]" value="Whatsapp" /> Whatsapp</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="leadSource[]" value="just_dial" /> Just dial</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="leadSource[]" value="Tele Calling" /> Tele Calling</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="leadSource[]" value="Youtube" /> Youtube</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="leadSource[]" value="Other" /> Other</label>
                </div>
              </div>

              {/* CONTENT */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ fontWeight: '700', color: '#94a3b8', fontSize: '11px' }}>CONTENT</div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" onChange={e => toggleAllChecks(e, 'contentField[]')} /> Select All</label>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="contentField[]" value="createdDate" /> CreatedDate</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="contentField[]" value="status" /> Status</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="contentField[]" value="name" /> Name</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="contentField[]" value="phone" /> Phone</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="contentField[]" value="intent" /> Intent</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="contentField[]" value="comment" /> Comment</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="contentField[]" value="lookingFor" /> LookingFor</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="contentField[]" value="source" /> Source</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked form="leadsDownloadForm" name="contentField[]" value="nextFollowupByDateFilter" /> Date</label>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => downloadFormRef.current?.reset()} style={{ flex: 1, padding: '10px 0', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Clear Filter</button>
              <button type="button" onClick={downloadLeadsCsv} disabled={isDownloading} style={{ flex: 1, padding: '10px 0', backgroundColor: '#0ab39c', border: 'none', color: '#fff', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Download</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Notification Section Modal ── */}
      {showNotificationModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', width: '90%', maxWidth: '1000px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            
            <div style={{ padding: '24px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                  <button onClick={() => setShowNotificationModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>✕</button>
                </div>

                {/* Top Filters */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', marginBottom: '40px', justifyContent: 'center' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="ri-calendar-event-line" style={{ color: '#64748b', fontSize: '18px' }}></i>
                    <select value={notificationQuery.period} onChange={e => setNotificationQuery(q => ({ ...q, period: e.target.value }))} style={{ width: '120px', padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', color: '#334155', backgroundColor: '#fff' }}>
                      {(notifications.periodOptions.length ? notifications.periodOptions : [{ value: 'daily', label: 'Daily' }]).map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="ri-user-settings-line" style={{ color: '#64748b', fontSize: '18px' }}></i>
                    <select value={notificationQuery.staff} onChange={e => setNotificationQuery(q => ({ ...q, staff: e.target.value }))} style={{ width: '200px', padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', color: '#334155', backgroundColor: '#fff' }}>
                      {notifications.staffOptions.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#334155', fontWeight: '500' }}>From:</span>
                    <input type="date" value={notificationQuery.fromDate} onChange={e => setNotificationQuery(q => ({ ...q, fromDate: e.target.value }))} style={{ width: '140px', padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', backgroundColor: '#f1f5f9' }} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#334155', fontWeight: '500' }}>To:</span>
                    <input type="date" value={notificationQuery.toDate} onChange={e => setNotificationQuery(q => ({ ...q, toDate: e.target.value }))} style={{ width: '140px', padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', backgroundColor: '#f1f5f9' }} />
                  </div>

                  <button onClick={() => loadNotifications(notificationQuery)} disabled={notificationsLoading} style={{ backgroundColor: '#405189', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                    Notification Details
                  </button>
                </div>

                <h4 style={{ textAlign: 'center', color: '#334155', marginBottom: '20px', fontWeight: '500' }}>Today Notification</h4>

                {/* Table */}
                <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', color: '#334155' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'left', borderRight: '1px solid #e2e8f0' }}>Name</th>
                        <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'left', borderRight: '1px solid #e2e8f0' }}>Phone</th>
                        <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'left', borderRight: '1px solid #e2e8f0' }}>Nextfollowupdate</th>
                        <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'left', borderRight: '1px solid #e2e8f0' }}>Status</th>
                        <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'left', borderRight: '1px solid #e2e8f0' }}>Source</th>
                        <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'left', borderRight: '1px solid #e2e8f0' }}>Comment</th>
                        <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'left', borderRight: '1px solid #e2e8f0' }}>Looking_for</th>
                        <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'left' }}>Intent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notificationsLoading ? (
                        <tr><td colSpan="8" style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>Loading notifications...</td></tr>
                      ) : notificationsError ? (
                        <tr><td colSpan="8" style={{ padding: '24px', textAlign: 'center', color: '#dc2626' }}>{notificationsError}</td></tr>
                      ) : notifications.rows.length === 0 ? (
                        <tr><td colSpan="8" style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>No notifications for today</td></tr>
                      ) : notifications.rows.map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          {['Name', 'Phone', 'Nextfollowupdate', 'Status', 'Source', 'Comment', 'Looking_for', 'Intent'].map(col => (
                            <td key={col} style={{ padding: '10px 16px' }}>{row[col]}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

            </div>
          </div>
        </div>
      )}
{/* ── Add New Lead Modal ── */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', width: '90%', maxWidth: '420px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="ri-file-add-line" style={{ color: '#475569', fontSize: '18px' }}></i>
                <h6 style={{ margin: 0, fontWeight: '600', fontSize: '15px', color: '#1e293b' }}>Add New Lead</h6>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ri-close-line"></i>
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const field = (name) => (fd.get(name) || '').toString();
              addLead({
                name: field('name'), phone: field('phone'), alt_phone: field('alt_phone'), email: field('email'),
                city: field('city'), location: field('location'), budget: field('budget'),
                lookingFor: field('lookingFor') || 'Buy New Property', source: field('source') || 'Other', note: field('note')
              });
              setShowAddModal(false);
            }} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              
              <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* File Upload / Excel */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flexDirection: 'column' }}>
                  <input type="file" name="excelFile" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }} />
                  <button type="button" onClick={(e) => importLeadsFile(e.currentTarget.parentElement.querySelector('input[type=file]'))} style={{ backgroundColor: '#405189', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: '4px', fontSize: '12.5px', fontWeight: '500', cursor: 'pointer' }}>
                    Upload Excel
                  </button>
                </div>

                {/* Full Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '500', color: '#334155', marginBottom: '6px' }}>Full Name <span style={{color: '#ef4444'}}>*</span></label>
                  <input required name="name" type="text" placeholder="Enter lead name" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }} />
                </div>

                {/* Phone */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '500', color: '#334155', marginBottom: '6px' }}>Phone <span style={{color: '#ef4444'}}>*</span></label>
                  <input required name="phone" type="text" placeholder="Enter 10 digit number" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }} />
                </div>

                {/* Alternate Phone */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '500', color: '#334155', marginBottom: '6px' }}>Alternate Phone</label>
                  <input name="altPhone" type="text" placeholder="Enter 10 digit number" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }} />
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '500', color: '#334155', marginBottom: '6px' }}>Email (Optional)</label>
                  <input name="email" type="email" placeholder="Enter email" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }} />
                </div>

                {/* City */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '500', color: '#334155', marginBottom: '6px' }}>City</label>
                  <input name="city" type="text" placeholder="Enter city" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }} />
                </div>

                {/* Location */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '500', color: '#334155', marginBottom: '6px' }}>Location</label>
                  <input name="location" type="text" placeholder="Location" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }} />
                </div>

                {/* Budget */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '500', color: '#334155', marginBottom: '6px' }}>Budget <span style={{color: '#ef4444'}}>*</span></label>
                  <input required name="budget" type="text" defaultValue="0" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }} />
                </div>

                {/* Looking For */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '500', color: '#334155', marginBottom: '6px' }}>Looking For <span style={{color: '#ef4444'}}>*</span></label>
                  <select required name="lookingFor" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', backgroundColor: '#fff', color: '#334155' }}>
                    <option value="Buy New Property">Buy New Property</option>
                    <option value="Property on Rent">Property on Rent</option>
                    <option value="Loan">Loan</option>
                  </select>
                </div>

                {/* Lead Source */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '500', color: '#334155', marginBottom: '6px' }}>Lead Source</label>
                  <select name="source" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', backgroundColor: '#fff', color: '#334155' }}>
                    <option value="Facebook Ads">Facebook Ads</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="Referance">Referance</option>
                    <option value="Landing Page">Landing Page</option>
                    <option value="99 Acres">99 Acres</option>
                    <option value="Magicbricks">Magicbricks</option>
                    <option value="Common Floor">Common Floor</option>
                    <option value="Makaan">Makaan</option>
                    <option value="Tele Calling">Tele Calling</option>
                    <option value="Youtube">Youtube</option>
                    <option value="Housing">Housing</option>
                    <option value="OLX">OLX</option>
                    <option value="Company Website">Company Website</option>
                    <option value="Whatsapp">Whatsapp</option>
                    <option value="Just Dial">Just Dial</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Assigned To */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '500', color: '#334155', marginBottom: '6px' }}>Assigned To <span style={{color: '#ef4444'}}>*</span></label>
                    <select required name="assignedTo" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', backgroundColor: '#fff', color: '#334155' }}>
                      <option value="">Select Assigned User</option>
                      <option value="assigntoall">Assign to all</option>
                      <option style={{ backgroundColor: "rgba(137, 43, 226, 0.123)" }} value="1:group">Sales - group</option>
                      <option style={{ backgroundColor: "rgba(137, 43, 226, 0.123)" }} value="2:group">Rent - group</option>
                      <option style={{ backgroundColor: "rgba(137, 43, 226, 0.123)" }} value="3:group">Buy - group</option>
                      <option value="5">poojamourya205_5 Pooja Arvind Prasad Mourya</option>
                      <option value="7">aartidodmani282002_7 Aarti Davallpa Dodmani</option>
                      <option value="9">londheharsh074_9 Harsh Vicky Londhe</option>
                      <option value="10">raj.dcr_10 Raj Bansode</option>
                      <option value="13">adeshgarkal646_13 Adesh Narayan Garkal</option>
                      <option value="14">endalvikrant_14 Vikrant Shannkar Endal</option>
                      <option value="18">test_18 test</option>
                      <option value="20">test_20 Test 2</option>
                      <option value="21">prajakatarathod123_21 Prajakata Gaurav Rathod</option>
                      <option value="22">ashishwaghmare102_22 Ashish Raju Waghmare</option>
                      <option value="23">mohammadkhalilrinamdar123_23 Inamdar Mohammadkhalil Rajmohammad</option>
                      <option value="24">jamadaramar6321_24 Amar Khanderaya Jamadar</option>
                      <option value="25">nayaksanket44_25 Sanket Gajanan Nayak</option>
                      <option value="26">akhute.p14_26 Prashant Kailas Akhute</option>
                      <option value="28">suhanigaikwad1914_28 Suhani Gautam Gaikwad</option>
                      <option value="29">shindedipali833_29 Dipali Ravsahe Shinde</option>
                      <option value="30">DawkharDhanu_30 Dhanashree Mangesh Dawkhar</option>
                      <option value="31">chaitanyamane1202_31 Chaitanya Kantarao Mane</option>
                      <option value="32">shinderohan232_32 Rohan Sanjay Shinde</option>
                      <option value="33">bhagyashreebhalerao8802_33 Bhagyashree Balasaheb Bhalerao</option>
                      <option value="35">SomnathJangam_35 Somnath Virhadra Jangam</option>
                      <option value="36">jaswantsalunkhe4_36 Jaswant Jagdish Sakunkhe</option>
                      <option value="37">deepti0635suryawashi_37 Dipti Dipak Suryavashi</option>
                      <option value="38">akhileshshinde4545_38 Akhilesh Harish Shinde</option>
                      <option value="39">snehalm112_39 Sneha Balasaheb Zirpe</option>
                      <option value="40">utkarsh.saraf19_40 utkarsh</option>
                      <option value="41">surveshweta09_41 Shweta Dipak Surve</option>
                      <option value="42">rajvardhansalve4377_42 Rajvardhan Kishir Salve</option>
                      <option value="43">upasnarawal29_43 Upasana Shivaji Rawal</option>
                      <option value="44">shwetashedmake143_44 Shweta Chandraakant Marasakolhe</option>
                      <option value="45">sp4938281_45 Sakshi Milind Pawar</option>
                      <option value="46">morerajesh065_46 Rajesh Sanjay More</option>
                      <option value="47">suhasbasode502_47 Suhas Sadahiv Bansode</option>
                      <option value="48">ayushkajagdhane_48 Ayushka Nitin Jagdhane</option>
                      <option value="49">narwadenandini5732_49 Nandini Gangaram Narwade</option>
                      <option value="50">gawalwadprasad07_50 Prasad Prakashrao Gawalwad</option>
                      <option value="51">tejal2122badgujar_51 Tejal Pavan badgujar</option>
                      <option value="52">spachshilagade1991_52 Panchsheela Santosh Kamle</option>
                      <option value="53">sagarabchate2004_53 Sagar Mahadev Bachate</option>
                    </select>
                  </div>
                  
                  {/* Select Project */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '500', color: '#334155', marginBottom: '6px' }}>Select Project</label>
                  <select name="project" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', backgroundColor: '#fff', color: '#334155', appearance: 'auto' }}>
                    <option value="">-- Select Project --</option>
                    {projectsList.map(proj => (
                      <option key={proj.id} value={proj.title}>{proj.title}</option>
                    ))}
                  </select>
                </div>

                {/* Lead Note */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '500', color: '#334155', marginBottom: '6px' }}>Lead Note</label>
                  <textarea name="note" rows="3" placeholder="Enter lead details, Description, Requirements etc." style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', resize: 'vertical' }}></textarea>
                </div>

              </div>
              
              {/* Modal Footer */}
              <div style={{ padding: '14px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', gap: '12px', backgroundColor: '#fff' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '10px 28px', backgroundColor: '#f1f5f9', color: '#1e293b', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Close</button>
                <button type="submit" style={{ padding: '10px 28px', backgroundColor: '#0ab39c', border: 'none', color: '#fff', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>Add lead</button>
              </div>

            </form>
          </div>
        </div>
      )}
      </div>
    
      {/* Right Side Status Panel (Full Form) */}
        {showStatusModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
            <div style={{ backgroundColor: '#fff', width: '450px', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-5px 0 25px rgba(0,0,0,0.1)' }}>
              
              {/* Header */}
              <div style={{ padding: '20px', backgroundColor: '#edebeb', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h5 style={{ margin: 0, fontSize: '16px', color: '#1e293b', fontWeight: '600' }}>Add Lead Followup</h5>
                <button onClick={() => setShowStatusModal(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b' }}>&times;</button>
              </div>

              {/* Body */}
              <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
                
                <h5 style={{ margin: '0 0 20px 0', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                  <span style={{ color: '#6c757d', fontWeight: 'normal' }}>Name :</span> &nbsp;{showStatusModal.name}
                </h5>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Select Status */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#212529', marginBottom: '8px', fontWeight: '500' }}>Select Status <span style={{ color: '#dc3545' }}>*</span></label>
                    <select 
                      name="status"
                      defaultValue={showStatusModal.status === "NEW LEAD" ? "New Lead" : showStatusModal.status === "SV SCHEDULED" ? "SV Scheduled" : showStatusModal.status}
                      style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px', color: '#212529' }}
                    >
                      <option value="New Lead">New Lead</option>
                      <option value="Not Connected">Not Connected</option>
                      <option value="In Progress">In Progress</option>
                      <option value="SV Scheduled">SV Scheduled</option>
                      <option value="SV Completed">SV Completed</option>
                      <option value="EOI Completed">EOI Completed</option>
                      <option value="Bookings In Progress">Bookings In Progress</option>
                      <option value="Booking Completed">Booking Completed</option>
                      <option value="Dead Lead">Dead Lead</option>
                    </select>
                  </div>

                  {/* Assigned To */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#212529', marginBottom: '8px', fontWeight: '500' }}>Assigned To <span style={{ color: '#dc3545' }}>*</span></label>
                    <select defaultValue={showStatusModal.assignedTo || ""} style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px', color: '#212529' }}>
                      <option value="">Select Assigned User</option>
                      <option value="assigntoall">Assign to all</option>
                      <option style={{ backgroundColor: "rgba(137, 43, 226, 0.123)" }} value="1:group">Sales - group</option>
                      <option style={{ backgroundColor: "rgba(137, 43, 226, 0.123)" }} value="2:group">Rent - group</option>
                      <option style={{ backgroundColor: "rgba(137, 43, 226, 0.123)" }} value="3:group">Buy - group</option>
                      <option value="5">poojamourya205_5 Pooja Arvind Prasad Mourya</option>
                      <option value="7">aartidodmani282002_7 Aarti Davallpa Dodmani</option>
                      <option value="9">londheharsh074_9 Harsh Vicky Londhe</option>
                      <option value="10">raj.dcr_10 Raj Bansode</option>
                      <option value="13">adeshgarkal646_13 Adesh Narayan Garkal</option>
                      <option value="14">endalvikrant_14 Vikrant Shannkar Endal</option>
                      <option value="18">test_18 test</option>
                      <option value="20">test_20 Test 2</option>
                      <option value="21">prajakatarathod123_21 Prajakata Gaurav Rathod</option>
                      <option value="22">ashishwaghmare102_22 Ashish Raju Waghmare</option>
                      <option value="23">mohammadkhalilrinamdar123_23 Inamdar Mohammadkhalil Rajmohammad</option>
                      <option value="24">jamadaramar6321_24 Amar Khanderaya Jamadar</option>
                      <option value="25">nayaksanket44_25 Sanket Gajanan Nayak</option>
                      <option value="26">akhute.p14_26 Prashant Kailas Akhute</option>
                      <option value="28">suhanigaikwad1914_28 Suhani Gautam Gaikwad</option>
                      <option value="29">shindedipali833_29 Dipali Ravsahe Shinde</option>
                      <option value="30">DawkharDhanu_30 Dhanashree Mangesh Dawkhar</option>
                      <option value="31">chaitanyamane1202_31 Chaitanya Kantarao Mane</option>
                      <option value="32">shinderohan232_32 Rohan Sanjay Shinde</option>
                      <option value="33">bhagyashreebhalerao8802_33 Bhagyashree Balasaheb Bhalerao</option>
                      <option value="35">SomnathJangam_35 Somnath Virhadra Jangam</option>
                      <option value="36">jaswantsalunkhe4_36 Jaswant Jagdish Sakunkhe</option>
                      <option value="37">deepti0635suryawashi_37 Dipti Dipak Suryavashi</option>
                      <option value="38">akhileshshinde4545_38 Akhilesh Harish Shinde</option>
                      <option value="39">snehalm112_39 Sneha Balasaheb Zirpe</option>
                      <option value="40">utkarsh.saraf19_40 utkarsh</option>
                      <option value="41">surveshweta09_41 Shweta Dipak Surve</option>
                      <option value="42">rajvardhansalve4377_42 Rajvardhan Kishir Salve</option>
                      <option value="43">upasnarawal29_43 Upasana Shivaji Rawal</option>
                      <option value="44">shwetashedmake143_44 Shweta Chandraakant Marasakolhe</option>
                      <option value="45">sp4938281_45 Sakshi Milind Pawar</option>
                      <option value="46">morerajesh065_46 Rajesh Sanjay More</option>
                      <option value="47">suhasbasode502_47 Suhas Sadahiv Bansode</option>
                      <option value="48">ayushkajagdhane_48 Ayushka Nitin Jagdhane</option>
                      <option value="49">narwadenandini5732_49 Nandini Gangaram Narwade</option>
                      <option value="50">gawalwadprasad07_50 Prasad Prakashrao Gawalwad</option>
                      <option value="51">tejal2122badgujar_51 Tejal Pavan badgujar</option>
                      <option value="52">spachshilagade1991_52 Panchsheela Santosh Kamle</option>
                      <option value="53">sagarabchate2004_53 Sagar Mahadev Bachate</option>
                    </select>
                  </div>

                  {/* Select Intent */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#212529', marginBottom: '8px', fontWeight: '500' }}>Select Intent <span style={{ color: '#dc3545' }}>*</span></label>
                    <select defaultValue={showStatusModal.intent === "COLD LEAD" ? "Cold" : showStatusModal.intent === "HOT LEAD" ? "Hot" : showStatusModal.intent === "WARM LEAD" ? "Warm" : "New"} style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px', color: '#212529' }}>
                      <option value="New">New</option>
                      <option value="Cold">Cold</option>
                      <option value="Warm">Warm</option>
                      <option value="Hot">Hot</option>
                    </select>
                  </div>

                  {/* Looking For */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#212529', marginBottom: '8px', fontWeight: '500' }}>Looking For <span style={{ color: '#dc3545' }}>*</span></label>
                    <select defaultValue={showStatusModal.lookingFor || "Buy New Property"} style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px', color: '#212529' }}>
                      <option value="Buy New Property">Buy New Property</option>
                      <option value="Property on Rent">Property on Rent</option>
                      <option value="Home Loan">Home Loan</option>
                    </select>
                  </div>

                  {/* Comment/Note/Remark */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#212529', marginBottom: '8px', fontWeight: '500' }}>Comment/ Note/ Remark <span style={{ color: '#dc3545' }}>*</span></label>
                    <textarea 
                      placeholder="Enter any followup comments" 
                      rows="3" 
                      style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px', color: '#212529', boxSizing: 'border-box' }}
                    ></textarea>
                  </div>

                  {/* Voice Note */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#212529', marginBottom: '8px', fontWeight: '500' }}>Voice Note/ Remark</label><input type="file" style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px', color: '#212529', marginBottom: '10px' }} />
                    
                    {audioURL && (
                      <div style={{ marginBottom: '10px' }}>
                        <audio src={audioURL} controls style={{ width: '100%', height: '36px' }}></audio>
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {!isRecording ? (
                        <button type="button" onClick={startRecording} style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #ced4da', borderRadius: '4px', backgroundColor: '#f8f9fa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ width: '8px', height: '8px', backgroundColor: '#dc3545', borderRadius: '50%', display: 'inline-block' }}></span> Start Recording
                        </button>
                      ) : (
                        <button type="button" onClick={stopRecording} style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #dc3545', borderRadius: '4px', backgroundColor: '#fee2e2', color: '#dc3545', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ width: '8px', height: '8px', backgroundColor: '#dc3545', display: 'inline-block' }}></span> Stop Recording
                        </button>
                      )}
                      
                      {audioURL && (
                        <button type="button" onClick={() => alert("Audio remark saved!")} style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #ced4da', borderRadius: '4px', backgroundColor: '#f8f9fa', cursor: 'pointer' }}>Save Audio remark</button>
                      )}
                    </div>
                  </div>

                  {/* Select Project */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#212529', marginBottom: '8px', fontWeight: '500' }}>Select Project</label>
                    <select multiple style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px', color: '#212529', height: '100px' }}>
                      <option value="55">Nivasa Ananya</option>
                      <option value="54">Nivasa Enchante</option>
                      <option value="53">Virndavan height</option>
                      <option value="51">MAHINDRA CODENAME CROWN</option>
                      <option value="49">Shikpkaar developers</option>
                      <option value="47">Purvankara keshav nager</option>
                      <option value="44">Kohinoor Riverdale</option>
                    </select>
                  </div>

                  {/* Next Followup Date & Time */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#212529', marginBottom: '8px', fontWeight: '500' }}>Select Date & Time for next followup <span style={{ color: '#dc3545' }}>*</span></label>
                    <input type="datetime-local" style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px', color: '#212529', boxSizing: 'border-box' }} />
                  </div>

                  {/* Upload Image/Photo */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#212529', marginBottom: '8px', fontWeight: '500' }}>Upload Image/ Photo</label>
                    <input type="file" multiple style={{ width: '100%', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px', color: '#212529', boxSizing: 'border-box' }} />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: '15px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px', backgroundColor: '#fff' }}>
                <button onClick={() => setShowStatusModal(null)} style={{ flex: 1, padding: '10px 0', backgroundColor: '#f8f9fa', color: '#212529', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Reset</button>
                <button onClick={() => {
                  const statusDropdown = document.querySelector('select[name="status"]');
                  const panel = statusDropdown?.closest('div[style*="position: fixed"]');
                  if (statusDropdown && panel) {
                    const [, assignedSel, intentSel, lookingSel] = panel.querySelectorAll('select:not([multiple])');
                    const comment = panel.querySelector('textarea')?.value.trim();
                    const next = panel.querySelector('input[type="datetime-local"]')?.value;
                    const assignedText = assignedSel?.selectedOptions[0]?.text.split(' ')[0];
                    setLeads(prev => prev.map(l => l.id === showStatusModal.id ? { ...l, status: statusDropdown.value.toUpperCase() } : l));
                    saveLead(showStatusModal, {
                      status: statusDropdown.value,
                      intent: intentSel?.value || undefined,
                      lookingFor: lookingSel?.value || undefined,
                      assignedTo: assignedSel?.value && !/^(assigntoall|\d+:group)$/.test(assignedSel.value) ? assignedText : undefined,
                      comment: comment || undefined,
                      nextFollowup: next || undefined
                    });
                  }
                  setShowStatusModal(null);
                }} style={{ flex: 1, padding: '10px 0', backgroundColor: '#198754', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Update</button>
              </div>
            </div>
          </div>
        )}
      
{/* Lead Detail Full Screen View */}
      {showLeadDetailModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#f1f5f9', zIndex: 99999, overflowY: 'auto' }}>
          {/* Top Header Section */}
          <div style={{ backgroundColor: '#2b3652', color: '#fff', padding: '20px 30px 0 30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '600', marginBottom: '8px', color: '#fff' }}>
                  #{showLeadDetailModal.id} &gt; {showLeadDetailModal.name}
                </h2>
                <div style={{ display: 'flex', gap: '15px', color: '#cbd5e1', fontSize: '13px' }}>
                  <span><i className="ri-map-pin-line"></i> {showLeadDetailModal.location || 'Pune'}</span>
                  <a href={`https://wa.me/${showLeadDetailModal.phone}`} target="_blank" rel="noreferrer" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                    <i className="ri-whatsapp-line"></i> Connect on whatsapp
                  </a>
                </div>
              </div>
              <button 
                onClick={() => setShowLeadDetailModal(null)} 
                style={{ backgroundColor: 'transparent', border: '1px solid #475569', color: '#fff', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <i className="ri-arrow-left-line"></i> Back to list
              </button>
            </div>
            
            {/* Sub-nav */}
            <div style={{ marginTop: '30px', display: 'flex', gap: '20px' }}>
              <div style={{ backgroundColor: '#f1f5f9', color: '#2b3652', padding: '8px 20px', borderRadius: '4px 4px 0 0', fontSize: '14px', fontWeight: '600' }}>
                Overview
              </div>
            </div>
          </div>

          {/* Main Content Body */}
          <div style={{ padding: '20px 30px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            
            {/* Left Column */}
            <div style={{ flex: '0 0 35%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Lead Status Card */}
              <div style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#1e293b', fontWeight: '600' }}>Lead Status</h3>
                <div style={{ backgroundColor: '#3b5282', color: '#fff', textAlign: 'center', padding: '10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                  {showLeadDetailModal.status}
                </div>
              </div>

              {/* Overview Card */}
              <div style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', color: '#1e293b', fontWeight: '600' }}>Overview</h3>
                  <i className="ri-pencil-line" style={{ color: '#64748b', cursor: 'pointer' }}></i>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '13px' }}>
                  <div style={{ display: 'flex' }}><div style={{ width: '140px', color: '#1e293b', fontWeight: '600' }}>Full Name :</div><div style={{ color: '#64748b' }}>{showLeadDetailModal.name}</div></div>
                  <div style={{ display: 'flex' }}><div style={{ width: '140px', color: '#1e293b', fontWeight: '600' }}>Mobile :</div><div style={{ color: '#64748b' }}>{showLeadDetailModal.phone}</div></div>
                  <div style={{ display: 'flex' }}><div style={{ width: '140px', color: '#1e293b', fontWeight: '600' }}>Alternat number :</div><div style={{ color: '#64748b' }}>-</div></div>
                  <div style={{ display: 'flex' }}><div style={{ width: '140px', color: '#1e293b', fontWeight: '600' }}>E-mail :</div><div style={{ color: '#64748b' }}>{showLeadDetailModal.email || '-'}</div></div>
                  <div style={{ display: 'flex' }}><div style={{ width: '140px', color: '#1e293b', fontWeight: '600' }}>Location :</div><div style={{ color: '#64748b' }}>{showLeadDetailModal.location || '-'}</div></div>
                  <div style={{ display: 'flex' }}><div style={{ width: '140px', color: '#1e293b', fontWeight: '600' }}>Source :</div><div style={{ color: '#64748b' }}>{showLeadDetailModal.source}</div></div>
                  <div style={{ display: 'flex' }}><div style={{ width: '140px', color: '#1e293b', fontWeight: '600' }}>Lead Created Date</div><div style={{ color: '#64748b' }}>{showLeadDetailModal.createdDate || '-'}</div></div>
                </div>
              </div>

              {/* Projects Card */}
              <div style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#1e293b', fontWeight: '600' }}>Projects</h3>
                <span style={{ backgroundColor: '#f1f5f9', color: '#3b5282', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                  {showLeadDetailModal.lookingFor || 'Project'}
                </span>
              </div>

              {/* Followup Images Card */}
              <div style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ margin: 0, fontSize: '15px', color: '#1e293b', fontWeight: '600' }}>Followup Images/ Photos (Eg. Site Visits, etc.)</h3>
              </div>

            </div>

            {/* Right Column */}
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* About Customer Card */}
              <div style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', color: '#1e293b', fontWeight: '600' }}>About Customer {isEditingCustomer && <i className="ri-pencil-line" style={{ fontSize: '18px' }}></i>}</h3>
                  {!isEditingCustomer && <i className="ri-pencil-line" style={{ color: '#64748b', cursor: 'pointer', fontSize: '18px' }} onClick={() => setIsEditingCustomer(true)}></i>}
                </div>
                
                {isEditingCustomer ? (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', rowGap: '20px', columnGap: '15px', fontSize: '13px', marginBottom: '20px' }}>
                      <div>
                        <div style={{ color: '#64748b', marginBottom: '5px' }}>Purpose :</div>
                        <select defaultValue={showLeadDetailModal.customerDetails?.purpose !== '-' ? showLeadDetailModal.customerDetails?.purpose : ''} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none' }}>
                          <option value="">Select Purpose</option>
                          <option value="End Use">End Use</option>
                          <option value="Investment">Investment</option>
                        </select>
                      </div>
                      <div>
                        <div style={{ color: '#64748b', marginBottom: '5px' }}>Property Type :</div>
                        <select defaultValue={showLeadDetailModal.customerDetails?.propertyType !== '-' ? showLeadDetailModal.customerDetails?.propertyType : ''} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none' }}>
                          <option value="">Select Property Type</option>
                          <option value="Residential">Residential</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Plots">Plots</option>
                        </select>
                      </div>
                      <div>
                        <div style={{ color: '#64748b', marginBottom: '5px' }}>Configurations Type :</div>
                        <input type="text" defaultValue={showLeadDetailModal.customerDetails?.configurationsType !== '-' ? showLeadDetailModal.customerDetails?.configurationsType : ''} placeholder="Enter configration" style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      
                      <div>
                        <div style={{ color: '#64748b', marginBottom: '5px' }}>Area : (in sqft)</div>
                        <input type="text" defaultValue={showLeadDetailModal.customerDetails?.area !== '-' ? showLeadDetailModal.customerDetails?.area : ''} placeholder="Enter area in sqft" style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <div style={{ color: '#64748b', marginBottom: '5px' }}>Funding Source :</div>
                        <select defaultValue={showLeadDetailModal.customerDetails?.fundingSource !== '-' ? showLeadDetailModal.customerDetails?.fundingSource : ''} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none' }}>
                          <option value="">Select Funding Source</option>
                          <option value="Home Loan">Home Loan</option>
                          <option value="Self Funded">Self Funded</option>
                        </select>
                      </div>
                      <div>
                        <div style={{ color: '#64748b', marginBottom: '5px' }}>Employment Type :</div>
                        <select defaultValue={showLeadDetailModal.customerDetails?.employmentType !== '-' ? showLeadDetailModal.customerDetails?.employmentType : ''} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none' }}>
                          <option value="">Select Employment Type</option>
                          <option value="Salaried">Salaried</option>
                          <option value="Self Employed">Self Employed</option>
                          <option value="Business">Business</option>
                        </select>
                      </div>
                      
                      <div>
                        <div style={{ color: '#64748b', marginBottom: '5px' }}>Facing :</div>
                        <select defaultValue={showLeadDetailModal.customerDetails?.facing !== '-' ? showLeadDetailModal.customerDetails?.facing : ''} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none' }}>
                          <option value="">Select Facing</option>
                          <option value="East">East</option>
                          <option value="West">West</option>
                          <option value="North">North</option>
                          <option value="South">South</option>
                        </select>
                      </div>
                      <div>
                        <div style={{ color: '#64748b', marginBottom: '5px' }}>Age :</div>
                        <input type="text" defaultValue={showLeadDetailModal.customerDetails?.age !== '-' ? showLeadDetailModal.customerDetails?.age : ''} placeholder="Enter customer age" style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <div style={{ color: '#64748b', marginBottom: '5px' }}>Referred By :</div>
                        <input type="text" defaultValue={showLeadDetailModal.customerDetails?.referredBy !== '-' ? showLeadDetailModal.customerDetails?.referredBy : ''} placeholder="Referred By" style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      
                      <div>
                        <div style={{ color: '#64748b', marginBottom: '5px' }}>Gender :</div>
                        <select defaultValue={showLeadDetailModal.customerDetails?.gender !== '-' ? showLeadDetailModal.customerDetails?.gender : ''} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none' }}>
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <div style={{ color: '#64748b', marginBottom: '5px' }}>Annual Income :</div>
                        <input type="text" defaultValue={showLeadDetailModal.customerDetails?.annualIncome !== '-' ? showLeadDetailModal.customerDetails?.annualIncome : ''} placeholder="Annual income" style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <button onClick={() => setIsEditingCustomer(false)} style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px 20px', borderRadius: '4px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        &times; Cancel
                      </button>
                      <button onClick={() => setIsEditingCustomer(false)} style={{ backgroundColor: '#e2e8f0', color: '#475569', border: 'none', padding: '8px 20px', borderRadius: '4px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <i className="ri-check-line"></i> Update
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', rowGap: '20px', columnGap: '15px', fontSize: '13px' }}>
                    <div><div style={{ color: '#94a3b8', marginBottom: '5px' }}>Purpose :</div><div style={{ color: '#334155' }}>{showLeadDetailModal.customerDetails?.purpose || '-'}</div></div>
                    <div><div style={{ color: '#94a3b8', marginBottom: '5px' }}>Property Type :</div><div style={{ color: '#334155' }}>{showLeadDetailModal.customerDetails?.propertyType || '-'}</div></div>
                    <div><div style={{ color: '#94a3b8', marginBottom: '5px' }}>Configurations Type :</div><div style={{ color: '#334155' }}>{showLeadDetailModal.customerDetails?.configurationsType || '-'}</div></div>
                    
                    <div><div style={{ color: '#94a3b8', marginBottom: '5px' }}>Area :</div><div style={{ color: '#334155' }}>{showLeadDetailModal.customerDetails?.area || '-'}</div></div>
                    <div><div style={{ color: '#94a3b8', marginBottom: '5px' }}>Funding Source :</div><div style={{ color: '#334155' }}>{showLeadDetailModal.customerDetails?.fundingSource || '-'}</div></div>
                    <div><div style={{ color: '#94a3b8', marginBottom: '5px' }}>Employment Type :</div><div style={{ color: '#334155' }}>{showLeadDetailModal.customerDetails?.employmentType || '-'}</div></div>
                    
                    <div><div style={{ color: '#94a3b8', marginBottom: '5px' }}>Facing :</div><div style={{ color: '#334155' }}>{showLeadDetailModal.customerDetails?.facing || '-'}</div></div>
                    <div><div style={{ color: '#94a3b8', marginBottom: '5px' }}>Age :</div><div style={{ color: '#334155' }}>{showLeadDetailModal.customerDetails?.age || '-'}</div></div>
                    <div><div style={{ color: '#94a3b8', marginBottom: '5px' }}>Referred By :</div><div style={{ color: '#334155' }}>{showLeadDetailModal.customerDetails?.referredBy || '-'}</div></div>
                    
                    <div><div style={{ color: '#94a3b8', marginBottom: '5px' }}>Gender :</div><div style={{ color: '#334155' }}>{showLeadDetailModal.customerDetails?.gender || '-'}</div></div>
                    <div><div style={{ color: '#94a3b8', marginBottom: '5px' }}>Annual Income :</div><div style={{ color: '#334155' }}>{showLeadDetailModal.customerDetails?.annualIncome || '-'}</div></div>
                  </div>
                )}
              </div>

              {/* Recent Activity Card */}
              <div style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', color: '#1e293b', fontWeight: '600' }}>Recent Activity</h3>
                
                <div style={{ position: 'relative', paddingLeft: '20px', borderLeft: '1px solid #e2e8f0', marginLeft: '10px' }}>
                  {showLeadDetailModal.activities && showLeadDetailModal.activities.length > 0 ? (
                    showLeadDetailModal.activities.map((act, i) => (
                      <div key={i} style={{ position: 'relative', marginBottom: '25px' }}>
                        <i className="ri-time-line" style={{ position: 'absolute', left: '-30px', top: '0', backgroundColor: '#fff', color: '#3b5282', fontSize: '18px' }}></i>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#1e293b' }}>{act.title}</h4>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '10px' }}>{act.subtitle}</div>
                        <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
                          {act.desc}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '13px', color: '#94a3b8' }}>No activity found.</div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
