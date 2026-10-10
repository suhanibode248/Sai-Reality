import re
import json

jsx_file = r'frontend\src\pages\LeadsDashboard.jsx'
with open(jsx_file, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the state initialization
with open('full_leads_data.json', 'r', encoding='utf-8') as f:
    leads_list = json.load(f)

leads_json_str = json.dumps(leads_list, indent=4)
pattern = r'(const \[leads,\s*setLeads\]\s*=\s*useState\(\[)(.*?)(\]\);)'
content = re.sub(pattern, r'\1\n' + leads_json_str[1:-1].replace('\\', '\\\\') + r'\n\3', content, flags=re.DOTALL)

# 2. Update the modal to use customerDetails and activities dynamically
# Update the About Customer section (non-editing view)
old_about = r'''<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', rowGap: '20px', columnGap: '15px', fontSize: '13px' }}>
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
                  </div>'''

new_about = r'''<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', rowGap: '20px', columnGap: '15px', fontSize: '13px' }}>
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
                  </div>'''
content = content.replace(old_about, new_about)

# Update Recent Activity to map over activities array
old_activity = r'''<div style={{ position: 'relative', paddingLeft: '20px', borderLeft: '1px solid #e2e8f0', marginLeft: '10px' }}>
                  
                  {/* Activity Item 1 */}
                  <div style={{ position: 'relative', marginBottom: '25px' }}>
                    <i className="ri-time-line" style={{ position: 'absolute', left: '-30px', top: '0', backgroundColor: '#fff', color: '#3b5282', fontSize: '18px' }}></i>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#1e293b' }}>{showLeadDetailModal.status}</h4>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '10px' }}>Status changed as <span style={{ backgroundColor: '#f1f5f9', padding: '2px 4px', borderRadius: '2px', fontWeight: 'bold' }}>{showLeadDetailModal.status}</span> at {showLeadDetailModal.statusDate} by ADMIN</div>
                    <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
                      Lead status updated as <strong>{showLeadDetailModal.status}</strong>. Followup added by ADMIN. Customer Intent is <span style={{ color: '#0284c7', fontWeight: 'bold' }}>{showLeadDetailModal.intent}</span>.<br/><br/>
                      Note : {showLeadDetailModal.note}
                    </div>
                  </div>

                  {/* Activity Item 2 (Dummy) */}
                  <div style={{ position: 'relative' }}>
                    <i className="ri-time-line" style={{ position: 'absolute', left: '-30px', top: '0', backgroundColor: '#fff', color: '#3b5282', fontSize: '18px' }}></i>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#1e293b' }}>NEW LEAD</h4>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '10px' }}>Status changed as <span style={{ backgroundColor: '#f1f5f9', padding: '2px 4px', borderRadius: '2px', fontWeight: 'bold' }}>NEW LEAD</span> at {showLeadDetailModal.createdDate || 'Oct 1, 2026'} by SYSTEM</div>
                    <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
                      Lead successfully captured from {showLeadDetailModal.source}.
                    </div>
                  </div>

                </div>'''

new_activity = r'''<div style={{ position: 'relative', paddingLeft: '20px', borderLeft: '1px solid #e2e8f0', marginLeft: '10px' }}>
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
                </div>'''

content = content.replace(old_activity, new_activity)

with open(jsx_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Injected real detail data successfully!")
