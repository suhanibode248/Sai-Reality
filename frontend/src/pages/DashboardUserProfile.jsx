import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import ProfileView, { formatFileSize } from '../components/ProfileView';
import useCrmCollection from '../hooks/useCrmCollection';

const EDIT_FIELDS = [['name', 'Full Name'], ['username', 'Username'], ['role', 'Role / Department'], ['phone', 'Phone'], ['email', 'Email'], ['location', 'Location']];

/** Users > View Profile: one staff member's profile, documents and attendance. */
const DashboardUserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useCrmCollection('users', []);
  const [attendance] = useCrmCollection('attendance', []);
  const [editing, setEditing] = useState(null);
  const user = users.find(u => String(u.id) === String(userId));

  const updateUser = (changes) => setUsers(prev => prev.map(u => (String(u.id) === String(userId) ? { ...u, ...changes } : u)));

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-5">
          <h5>User not found</h5>
          <button className="btn btn-light mt-2" onClick={() => navigate('/dashboard/users')}>Back to Users</button>
        </div>
      </DashboardLayout>
    );
  }

  const days = attendance.filter(r => (r.present || []).includes(user.name) || (r.absent || []).includes(user.name));
  const presentDays = days.filter(r => (r.present || []).includes(user.name)).length;

  return (
    <DashboardLayout>
      <ProfileView
        name={user.name}
        subtitle={`${user.role || 'Staff'} | ${user.username || ''}`}
        location={user.location}
        personalRows={[
          ['Full Name :', user.name],
          ['Mobile :', user.phone],
          ['E-mail :', user.email],
          ['Location :', user.location],
          ['Date Of Joining', user.createdDate],
          ['Status', user.isActive === false ? 'Inactive' : 'Active']
        ]}
        businessTitle="Work Details"
        address={user.location}
        businessRows={[
          ['ri-user-star-line', 'Role :', user.role],
          ['ri-at-line', 'Username :', user.username],
          ['ri-calendar-check-line', 'Days Present :', days.length ? `${presentDays} of ${days.length}` : 'No attendance yet']
        ]}
        notifications={(user.documents || []).map(d => ({ title: `Document uploaded: ${d.name || d.title}`, text: d.date }))}
        documents={user.documents || []}
        onUploadDocuments={(files) => updateUser({ documents: [...(user.documents || []), ...files.map(f => ({ name: f.name, size: formatFileSize(f.size), date: new Date().toLocaleString('en-IN') }))] })}
        onDeleteDocument={(i) => updateUser({ documents: (user.documents || []).filter((_, j) => j !== i) })}
        actions={<>
          <a className="btn btn-light" href={`tel:${(user.phone || '').replace(/\s/g, '')}`}><i className="ri-phone-line align-bottom me-1"></i> Make a Call</a>
          <button className="btn btn-success" onClick={() => setEditing({ ...user })}><i className="ri-edit-box-line align-bottom"></i> Edit Profile</button>
          <button className="btn btn-light" onClick={() => navigate('/dashboard/users')}><i className="ri-arrow-go-back-line align-bottom"></i> Back</button>
        </>}
      />

      {editing && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px' }}>
          <form className="card shadow border-0" style={{ width: '100%', maxWidth: '640px' }} onSubmit={(e) => { e.preventDefault(); updateUser(editing); setEditing(null); }}>
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
              <div className="col-md-6 mb-3 d-flex align-items-end">
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="user-active" checked={editing.isActive !== false} onChange={(e) => setEditing(prev => ({ ...prev, isActive: e.target.checked }))} />
                  <label className="form-check-label" htmlFor="user-active">Active</label>
                </div>
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

export default DashboardUserProfile;
