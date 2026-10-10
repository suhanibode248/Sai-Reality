import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ProfileView, { formatFileSize } from '../components/ProfileView';

const DEFAULT_PROFILE = {
  name: 'Admin',
  role: 'Admin',
  email: 'admin@email.com',
  mobile: '9222445513',
  location: 'Pune, Maharashtra',
  lastLogin: '',
  companyName: 'Sai Reality',
  industry: 'Real Estate',
  reraNumber: '',
  gstNumber: '',
  businessEmail: '',
  website: '',
  officeAddress: 'Lohegaon - Dhanori Road, Lohegaon, Pune - 411047',
  facebook: '', instagram: '', linkedin: '', twitter: ''
};

const readStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    return fallback;
  }
};

const EDIT_FIELDS = [
  ['name', 'Full Name'], ['mobile', 'Mobile'], ['email', 'E-mail'], ['location', 'Location'],
  ['companyName', 'Business / Company Name'], ['industry', 'Industry'], ['website', 'Website'],
  ['reraNumber', 'Business Registration No'], ['businessEmail', 'Business Email'], ['gstNumber', 'GST No'],
  ['facebook', 'Facebook URL'], ['instagram', 'Instagram URL'], ['linkedin', 'LinkedIn URL'], ['twitter', 'Twitter URL']
];

/** Master > My Account — same layout as the reference dashboard. */
const DashboardMyAccount = () => {
  const [profile, setProfile] = useState(() => ({ ...DEFAULT_PROFILE, ...readStorage('cp_account_profile', {}) }));
  const [documents, setDocuments] = useState(() => readStorage('cp_account_docs', []));
  const [editing, setEditing] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => { localStorage.setItem('cp_account_profile', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('cp_account_docs', JSON.stringify(documents)); }, [documents]);

  // Today's follow-ups are the account's notifications
  useEffect(() => {
    fetch('http://localhost:8000/api/dashboard/notifications')
      .then(res => res.json())
      .then(data => setNotifications((data.rows || []).map(r => ({ title: `Follow up: ${r.Name} (${r.Phone})`, text: `${r.Nextfollowupdate} - ${r.Status} - ${r.Comment}` }))))
      .catch(() => {});
  }, []);

  const save = (e) => {
    e.preventDefault();
    setProfile(editing);
    setEditing(null);
  };

  return (
    <DashboardLayout>
      <ProfileView
        name={profile.name}
        subtitle={`${profile.companyName || ''} | ${profile.role}`}
        location={profile.location}
        company={profile.companyName}
        personalRows={[
          ['Full Name :', profile.name],
          ['Mobile :', profile.mobile ? `+(91) ${profile.mobile.replace(/^\+?\(?91\)?\s*/, '')}` : ''],
          ['E-mail :', profile.email],
          ['Location :', profile.location],
          ['Last login', profile.lastLogin || new Date().toLocaleString('en-IN')]
        ]}
        socials={[
          { icon: 'ri-facebook-fill', color: 'bg-primary', href: profile.facebook },
          { icon: 'ri-instagram-fill', color: 'bg-danger', href: profile.instagram },
          { icon: 'ri-linkedin-fill', color: 'bg-success', href: profile.linkedin },
          { icon: 'ri-twitter-fill', color: 'bg-warning', href: profile.twitter }
        ]}
        address={profile.officeAddress}
        businessRows={[
          ['ri-building-line', 'Business / Company Name :', profile.companyName],
          ['ri-building-3-line', 'Industry :', profile.industry],
          ['ri-global-line', 'Website :', profile.website, profile.website],
          ['ri-building-line', 'Business Registration No :', profile.reraNumber],
          ['ri-mail-check-line', 'Business Email :', profile.businessEmail, profile.businessEmail && `mailto:${profile.businessEmail}`],
          ['ri-file-text-line', 'GST No : (If Available)', profile.gstNumber]
        ]}
        notifications={notifications}
        documents={documents}
        onUploadDocuments={(files) => setDocuments(prev => [...prev, ...files.map(f => ({ id: `${Date.now()}-${f.name}`, title: f.name, size: formatFileSize(f.size), date: new Date().toLocaleDateString('en-IN') }))])}
        onDeleteDocument={(i) => setDocuments(prev => prev.filter((_, j) => j !== i))}
        actions={
          <button className="btn btn-success" onClick={() => setEditing({ ...profile })}>
            <i className="ri-edit-box-line align-bottom"></i> Edit Profile
          </button>
        }
      />

      {editing && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '40px 16px' }}>
          <form onSubmit={save} className="card shadow border-0" style={{ width: '100%', maxWidth: '760px' }}>
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Edit Profile</h5>
              <button type="button" className="btn-close" onClick={() => setEditing(null)}></button>
            </div>
            <div className="card-body row">
              {EDIT_FIELDS.map(([key, label]) => (
                <div className="col-md-6 mb-3" key={key}>
                  <label className="form-label" style={{ fontSize: '13px' }}>{label}</label>
                  <input className="form-control form-control-sm" value={editing[key] || ''} required={key === 'name'} onChange={(e) => setEditing(prev => ({ ...prev, [key]: e.target.value }))} />
                </div>
              ))}
              <div className="col-12">
                <label className="form-label" style={{ fontSize: '13px' }}>Address</label>
                <textarea className="form-control form-control-sm" rows="2" value={editing.officeAddress || ''} onChange={(e) => setEditing(prev => ({ ...prev, officeAddress: e.target.value }))}></textarea>
              </div>
            </div>
            <div className="card-footer bg-white d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-light" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="btn btn-success">Update</button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardMyAccount;
