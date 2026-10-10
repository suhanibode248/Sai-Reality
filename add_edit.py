import re

jsx_file = r'frontend\src\pages\LeadsDashboard.jsx'
with open(jsx_file, 'r', encoding='utf-8') as f:
    content = f.read()

if 'const [isEditingCustomer, setIsEditingCustomer] = useState(false);' not in content:
    content = content.replace('const [showStatusModal, setShowStatusModal] = useState(null);', 'const [showStatusModal, setShowStatusModal] = useState(null);\n  const [isEditingCustomer, setIsEditingCustomer] = useState(false);')

# Replace the "About Customer" block in the modal with an editable version
old_about = r'''{/* About Customer Card */}
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
              </div>'''

new_about = r'''{/* About Customer Card */}
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
                        <select style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none' }}><option></option></select>
                      </div>
                      <div>
                        <div style={{ color: '#64748b', marginBottom: '5px' }}>Property Type :</div>
                        <select style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none' }}><option></option></select>
                      </div>
                      <div>
                        <div style={{ color: '#64748b', marginBottom: '5px' }}>Configurations Type :</div>
                        <input type="text" placeholder="Enter configration" style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      
                      <div>
                        <div style={{ color: '#64748b', marginBottom: '5px' }}>Area : (in sqft)</div>
                        <input type="text" placeholder="Enter area in sqft" style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <div style={{ color: '#64748b', marginBottom: '5px' }}>Funding Source :</div>
                        <select style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none' }}><option></option></select>
                      </div>
                      <div>
                        <div style={{ color: '#64748b', marginBottom: '5px' }}>Employment Type :</div>
                        <select style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none' }}><option></option></select>
                      </div>
                      
                      <div>
                        <div style={{ color: '#64748b', marginBottom: '5px' }}>Facing :</div>
                        <select style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none' }}><option></option></select>
                      </div>
                      <div>
                        <div style={{ color: '#64748b', marginBottom: '5px' }}>Age :</div>
                        <input type="text" placeholder="Enter customer age" style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <div style={{ color: '#64748b', marginBottom: '5px' }}>Referred By :</div>
                        <input type="text" placeholder="Referred By" style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                      
                      <div>
                        <div style={{ color: '#64748b', marginBottom: '5px' }}>Gender :</div>
                        <select style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none' }}><option></option></select>
                      </div>
                      <div>
                        <div style={{ color: '#64748b', marginBottom: '5px' }}>Annual Income :</div>
                        <input type="text" placeholder="Annual income" style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none', boxSizing: 'border-box' }} />
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
                )}
              </div>'''

if old_about in content:
    content = content.replace(old_about, new_about)

with open(jsx_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Added edit state to customer card!")
