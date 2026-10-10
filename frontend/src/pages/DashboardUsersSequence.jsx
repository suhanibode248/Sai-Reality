import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import useCrmCollection from '../hooks/useCrmCollection';

/**
 * Others > Users Sequence — same layout as the reference dashboard:
 * tick users in the order leads should rotate to them, then "Updates" saves the sequence and time gap.
 */
const DashboardUsersSequence = () => {
  const [users] = useCrmCollection('users', []);
  const [saved, setSaved] = useCrmCollection('usersSequence', [{ users: [], timeGap: '' }]);
  const current = saved[0] || { users: [], timeGap: '' };
  const [selected, setSelected] = useState([]);
  const [timeGap, setTimeGap] = useState('');
  const [message, setMessage] = useState('');

  const label = (u) => `${u.username || u.name} (${u.name})`;

  const toggle = (u) => {
    const key = label(u);
    setSelected(prev => prev.includes(key) ? prev.filter(x => x !== key) : [...prev, key]);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!selected.length) { setMessage('Select at least one user.'); return; }
    setSaved([{ users: selected, timeGap }]);
    setSelected([]);
    setTimeGap('');
    setMessage('User sequence updated.');
  };

  const cancel = () => { setSelected([]); setTimeGap(''); setMessage(''); };

  return (
    <DashboardLayout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between" style={{ margin: 0 }}>
              <h4 className="mb-sm-0">User Sequence</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item"><Link to="/dashboard">Others</Link></li>
                  <li className="breadcrumb-item active">User Sequence</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-2 main-userlist mt-2">
          {users.length === 0 && <p className="text-muted">No users yet. Add members on the Users page first.</p>}
          {users.map(u => (
            <div className="col-lg-6" key={u.id}>
              <div className="form-check select-checkboxcmsdm">
                <input className="form-check-input" id={`seq-user-${u.id}`} type="checkbox" checked={selected.includes(label(u))} onChange={() => toggle(u)} />
                <label className="form-check-label" htmlFor={`seq-user-${u.id}`}>{label(u)}</label>
              </div>
            </div>
          ))}
        </div>
        <hr />

        <form onSubmit={submit} className="d-flex flex-column justify-content-end">
          <div className="row g-2">
            <h3>Selected Users</h3>
            <div>
              {selected.length === 0 && <p className="text-muted mb-0" style={{ fontSize: '13px' }}>Tick users above in the order leads should be assigned.</p>}
              {selected.map((name, i) => (
                <div className="form-check" key={name}>
                  <label className="form-check-label">{i + 1}. {name}</label>
                </div>
              ))}
            </div>
          </div>
          <hr />
          <div className="row g-2">
            <h3>Old Selected Users</h3>
            {current.users.length === 0 && <p className="text-muted mb-0" style={{ fontSize: '13px' }}>No sequence saved yet.</p>}
            {current.users.map(name => (
              <div className="col-lg-12" key={name}>
                <div className="form-check">
                  <label className="form-check-label">{name}</label>
                </div>
              </div>
            ))}
            {current.timeGap && <p className="text-muted mb-0" style={{ fontSize: '13px' }}>Time gap: {current.timeGap}</p>}
          </div>
          <hr />
          <div className="col-lg-6 mb-4 mt-4">
            <div className="mb-3">
              <label className="form-label" htmlFor="time">Time gap<span className="text-danger">*</span></label>
              <input className="form-control" id="time" placeholder="Time gap" required type="number" min="0" value={timeGap} onChange={(e) => setTimeGap(e.target.value)} />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="hstack gap-2">
              <button className="btn btn-primary" type="submit"><i className="ri-check-double-line align-bottom me-1"></i> Updates</button>
              <button className="btn btn-soft-danger" type="button" onClick={cancel}>Cancel</button>
              {message && <span className="text-success ms-2" style={{ fontSize: '13px' }}>{message}</span>}
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default DashboardUsersSequence;
