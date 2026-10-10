import React from 'react';

const LeadDetailView = () => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#f1f5f9', zIndex: 99999, overflowY: 'auto' }}>
      {/* Top Header Section */}
      <div style={{ backgroundColor: '#2b3652', color: '#fff', padding: '20px 30px 0 30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '600', marginBottom: '8px' }}>
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
          <div style={{ backgroundColor: '#3b4b6b', padding: '8px 20px', borderRadius: '4px 4px 0 0', fontSize: '14px', fontWeight: '500' }}>
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
            <span style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
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
              <h3 style={{ margin: 0, fontSize: '15px', color: '#1e293b', fontWeight: '600' }}>About Customer</h3>
              <i className="ri-pencil-line" style={{ color: '#64748b', cursor: 'pointer' }}></i>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', rowGap: '20px', columnGap: '15px', fontSize: '13px' }}>
              <div><div style={{ color: '#94a3b8', marginBottom: '5px' }}>Purpose :</div><div style={{ color: '#334155' }}>-</div></div>
              <div><div style={{ color: '#94a3b8', marginBottom: '5px' }}>Property Type :</div><div style={{ color: '#334155' }}>-</div></div>
              <div><div style={{ color: '#94a3b8', marginBottom: '5px' }}>Configurations Type :</div><div style={{ color: '#334155' }}>-</div></div>
              
              <div><div style={{ color: '#94a3b8', marginBottom: '5px' }}>Area :</div><div style={{ color: '#334155' }}>-</div></div>
              <div><div style={{ color: '#94a3b8', marginBottom: '5px' }}>Funding Source :</div><div style={{ color: '#334155' }}>-</div></div>
              <div><div style={{ color: '#94a3b8', marginBottom: '5px' }}>Employment Type :</div><div style={{ color: '#334155' }}>-</div></div>
              
              <div><div style={{ color: '#94a3b8', marginBottom: '5px' }}>Facing :</div><div style={{ color: '#334155' }}>-</div></div>
              <div><div style={{ color: '#94a3b8', marginBottom: '5px' }}>Age :</div><div style={{ color: '#334155' }}>-</div></div>
              <div><div style={{ color: '#94a3b8', marginBottom: '5px' }}>Referred By :</div><div style={{ color: '#334155' }}>-</div></div>
              
              <div><div style={{ color: '#94a3b8', marginBottom: '5px' }}>Gender :</div><div style={{ color: '#334155' }}>-</div></div>
              <div><div style={{ color: '#94a3b8', marginBottom: '5px' }}>Annual Income :</div><div style={{ color: '#334155' }}>-</div></div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', color: '#1e293b', fontWeight: '600' }}>Recent Activity</h3>
            
            <div style={{ position: 'relative', paddingLeft: '20px', borderLeft: '1px solid #e2e8f0', marginLeft: '10px' }}>
              
              {/* Activity Item 1 */}
              <div style={{ position: 'relative', marginBottom: '25px' }}>
                <i className="ri-time-line" style={{ position: 'absolute', left: '-30px', top: '0', backgroundColor: '#fff', color: '#3b5282', fontSize: '18px' }}></i>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#1e293b' }}>{showLeadDetailModal.status}</h4>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '10px' }}>Status changed as <span style={{ backgroundColor: '#f1f5f9', padding: '2px 4px', borderRadius: '2px' }}>{showLeadDetailModal.status}</span> at {showLeadDetailModal.statusDate} by ADMIN</div>
                <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
                  Lead status updated as <strong>{showLeadDetailModal.status}</strong>. Followup added by ADMIN. Customer Intent is <span style={{ color: '#0284c7' }}>{showLeadDetailModal.intent}</span>.<br/><br/>
                  Note : {showLeadDetailModal.note}
                </div>
              </div>

              {/* Activity Item 2 (Dummy) */}
              <div style={{ position: 'relative' }}>
                <i className="ri-time-line" style={{ position: 'absolute', left: '-30px', top: '0', backgroundColor: '#fff', color: '#3b5282', fontSize: '18px' }}></i>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#1e293b' }}>NEW LEAD</h4>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '10px' }}>Status changed as <span style={{ backgroundColor: '#f1f5f9', padding: '2px 4px', borderRadius: '2px' }}>NEW LEAD</span> at {showLeadDetailModal.createdDate || 'Oct 1, 2026'} by SYSTEM</div>
                <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
                  Lead successfully captured from {showLeadDetailModal.source}.
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
