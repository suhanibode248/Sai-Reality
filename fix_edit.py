import re

jsx_file = r'frontend\src\pages\LeadsDashboard.jsx'
with open(jsx_file, 'r', encoding='utf-8') as f:
    content = f.read()

# We need to replace the edit form block.
# Let's extract everything inside `isEditingCustomer ? ( ... ) : (`

start_marker = r'                  <div>\n                    <div style={{ display: \'grid\', gridTemplateColumns: \'1fr 1fr 1fr\', rowGap: \'20px\', columnGap: \'15px\', fontSize: \'13px\', marginBottom: \'20px\' }}>'
# Find the start
if start_marker in content:
    print("Found start marker!")

# Instead of complex regex, let's just do a big replace on the exact string
old_edit_block = r'''                  <div>
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
                  </div>'''

new_edit_block = r'''                  <div>
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
                  </div>'''

if old_edit_block in content:
    content = content.replace(old_edit_block, new_edit_block)
else:
    print("WARNING: Could not find old edit block")

with open(jsx_file, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated edit mode!")
