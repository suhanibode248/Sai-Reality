import React, { useState } from 'react';

const DUMMY_AVATAR = '/static/dashboard/assets/images/users/user-dummy-img.jpg';

const EmptyState = ({ text }) => (
  <div className="text-center py-4">
    <i className="ri-search-line text-muted" style={{ fontSize: '30px' }}></i>
    <h5 className="mt-2">Sorry! No Data Found</h5>
    <p className="text-muted mb-0">{text}</p>
  </div>
);

/**
 * Profile page layout shared by My Account and a user's profile:
 * cover header, Overview / Notifications / Documents tabs, Personal Details, social links and Business Details.
 */
const ProfileView = ({
  name, subtitle, location, company, avatar,
  personalRows, socials = [], businessTitle = 'Business Details', address, businessRows = [],
  extraOverview = null, notifications = [], documents = [], onUploadDocuments, onDeleteDocument,
  actions
}) => {
  const [tab, setTab] = useState('overview');

  return (
    <div className="container-fluid">
      {/* Cover + avatar */}
      <div className="position-relative rounded-3 mb-4" style={{ background: 'linear-gradient(135deg, #405189 0%, #0ab39c 100%)', padding: '28px 24px' }}>
        <div className="row g-4 align-items-center">
          <div className="col-auto">
            <img alt="user-img" className="img-thumbnail rounded-circle" src={avatar || DUMMY_AVATAR} style={{ width: '96px', height: '96px', objectFit: 'cover' }} />
          </div>
          <div className="col">
            <div className="p-2">
              <h3 className="text-white mb-1">{name}</h3>
              <p className="mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>{subtitle}</p>
              <div className="hstack gap-3" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                {location && <div><i className="ri-map-pin-user-line me-1 fs-16 align-middle"></i>{location}</div>}
                {company && <div><i className="ri-building-line me-1 fs-16 align-middle"></i>{company}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center flex-wrap gap-2">
        <ul className="nav nav-pills gap-2 gap-lg-3 flex-grow-1">
          {[['overview', 'Overview'], ['activities', 'Notifications'], ['documents', 'Documents']].map(([key, label]) => (
            <li className="nav-item" key={key}>
              <a href="#!" className={`nav-link fs-14 ${tab === key ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setTab(key); }}
                style={tab === key ? { backgroundColor: '#405189', color: '#fff' } : { color: '#495057', backgroundColor: '#fff' }}>{label}</a>
            </li>
          ))}
        </ul>
        <div className="flex-shrink-0 d-flex gap-2">{actions}</div>
      </div>

      <div className="tab-content pt-4 text-muted">
        {tab === 'overview' && (
          <div className="row">
            <div className="col-xxl-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title mb-3">Personal Details</h5>
                  <div className="table-responsive">
                    <table className="table table-borderless mb-0">
                      <tbody>
                        {personalRows.map(([label, value]) => (
                          <tr key={label}>
                            <th className="ps-0" scope="row">{label}</th>
                            <td className="text-muted">{value || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {socials.length > 0 && (
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title mb-4">Business Profile on Social Media</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {socials.map(({ icon, color, href }) => (
                        <a key={icon} className="avatar-xs d-block" href={href || '#!'} target={href ? '_blank' : undefined} rel="noreferrer"
                          onClick={(e) => { if (!href) { e.preventDefault(); alert('Add this link with Edit Profile'); } }}>
                          <span className={`avatar-title rounded-circle fs-16 ${color} text-light`}><i className={icon}></i></span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="col-xxl-8">
              <div className="card">
                <div className="card-header align-items-center d-flex">
                  <h4 className="card-title mb-0 me-2">{businessTitle}</h4>
                </div>
                <div className="card-body">
                  <h5 className="card-title mt-2">Address</h5>
                  <p>{address || '-'}</p>
                  <div className="row">
                    {businessRows.map(([icon, label, value, href]) => (
                      <div className="col-6 col-md-4" key={label}>
                        <div className="d-flex mt-4">
                          <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                            <div className="avatar-title bg-light rounded-circle fs-16 text-primary"><i className={icon}></i></div>
                          </div>
                          <div className="flex-grow-1 overflow-hidden">
                            <p className="mb-1">{label}</p>
                            {href && value ? <a className="fw-semibold" href={href} target="_blank" rel="noreferrer">{value}</a> : <h6 className="text-truncate mb-0">{value || '-'}</h6>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {extraOverview}
            </div>
          </div>
        )}

        {tab === 'activities' && (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-3">Notifications</h5>
              {notifications.length === 0 ? (
                <EmptyState text="We've searched all database, But we did not find any notificatiosn for you." />
              ) : (
                <div className="acitivity-timeline">
                  {notifications.map((n, i) => (
                    <div className="d-flex py-2 border-bottom" key={i}>
                      <i className="ri-notification-3-line text-primary me-2 mt-1"></i>
                      <div>
                        <h6 className="mb-1">{n.title}</h6>
                        <p className="text-muted mb-0" style={{ fontSize: '12px' }}>{n.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'documents' && (
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center mb-4">
                <h5 className="card-title flex-grow-1 mb-0">Documents</h5>
                {onUploadDocuments && (
                  <label className="btn btn-danger mb-0" style={{ cursor: 'pointer' }}>
                    <i className="ri-upload-2-fill me-1 align-bottom"></i> Upload Documents
                    <input type="file" multiple hidden onChange={(e) => { onUploadDocuments([...e.target.files]); e.target.value = ''; }} />
                  </label>
                )}
              </div>
              {documents.length === 0 ? (
                <EmptyState text="Sorry! No project documents found." />
              ) : (
                <div className="table-responsive">
                  <table className="table table-borderless align-middle mb-0">
                    <thead className="table-light">
                      <tr><th>File Name</th><th>Size</th><th>Upload Date</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {documents.map((doc, i) => (
                        <tr key={doc.id || i}>
                          <td><i className="ri-file-text-line text-primary me-2"></i>{doc.title || doc.name || doc.file}</td>
                          <td>{doc.size || '-'}</td>
                          <td>{doc.date}</td>
                          <td>
                            {onDeleteDocument && (
                              <button className="btn btn-sm btn-soft-danger" title="Delete" onClick={() => { if (window.confirm('Delete this document?')) onDeleteDocument(i); }}>
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const formatFileSize = (bytes) => (bytes > 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

export default ProfileView;
