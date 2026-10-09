import React, { useState, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const DashboardTransactions = () => {
  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);
  const [activeTab, setActiveTab] = useState('Income');
  const [categories, setCategories] = useState({
    Income: ['Sales', 'Consulting', 'Investment'],
    Expenses: ['Rent', 'Salaries', 'Utilities', 'Marketing']
  });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  
  const [showFilters, setShowFilters] = useState(false);
  const [filterAccountType, setFilterAccountType] = useState({ income: false, expenses: false });
  const [filterDateRange, setFilterDateRange] = useState('All Dates');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterToDate, setFilterToDate] = useState('');
  
  // Dummy transactions for preview
  const [transactions, setTransactions] = useState([
    { id: '#TX1052', category: 'Sales', type: 'Income', amount: 50000, description: 'Client payment', status: 'Completed', date: '10/09/2026' },
    { id: '#TX3921', category: 'Marketing', type: 'Expenses', amount: 5000, description: 'Facebook Ads', status: 'Completed', date: '08/09/2026' },
    { id: '#TX8432', category: 'Consulting', type: 'Income', amount: 12000, description: 'Consultation fee', status: 'Completed', date: '05/09/2026' }
  ]);


  const handleRefresh = (e) => {
    e.preventDefault();
    window.location.reload();
  };

  const handleAddNewCategory = (e) => {
    e.preventDefault();
    const newCat = window.prompt(`Enter new ${activeTab} category name:`);
    if (newCat && newCat.trim() !== '') {
      setCategories(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], newCat.trim()]
      }));
      setSelectedCategory(newCat.trim());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCategory || !amount) {
      alert("Please select a category and enter an amount.");
      return;
    }
    const newTx = {
      id: `#TX${Math.floor(1000 + Math.random() * 9000)}`,
      category: selectedCategory,
      type: activeTab,
      amount: parseFloat(amount),
      description: description,
      status: 'Completed',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    setTransactions([newTx, ...transactions]);
    setAmount('');
    setDescription('');
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  
  const filteredTransactions = transactions.filter(t => {
    // Search Box
    const matchSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.type.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Account Type Filter
    let matchType = true;
    if (filterAccountType.income || filterAccountType.expenses) {
      if (t.type === 'Income' && !filterAccountType.income) matchType = false;
      if (t.type === 'Expenses' && !filterAccountType.expenses) matchType = false;
    }
    
    // Date Range Filter (simplified logic for demonstration)
    let matchDate = true;
    if (filterDateRange === 'Select Date Range' && filterFromDate && filterToDate) {
      // Very basic string comparison or you'd parse dates properly
      // For now, just a placeholder logic to show it's wired up
    }
    
    return matchSearch && matchType && matchDate;
  });

  const clearFilters = () => {
    setFilterAccountType({ income: false, expenses: false });
    setFilterDateRange('All Dates');
    setFilterFromDate('');
    setFilterToDate('');
    setShowFilters(false);
  };

  return (
    <DashboardLayout>
      <div className="container-fluid p-0">
        
        {/* Page Title */}
        <div className="row mb-3 pb-1">
          <div className="col-12">
            <div className="d-flex align-items-lg-center flex-lg-row flex-column justify-content-between">
              <h4 className="fs-16 mb-1 text-uppercase fw-semibold" style={{ color: '#495057' }}>ALL TRANSACTIONS</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0" style={{ backgroundColor: 'transparent', padding: 0 }}>
                  <li className="breadcrumb-item"><a href="#!" style={{ color: '#495057', textDecoration: 'none' }}>Finance & Account</a></li>
                  <li className="breadcrumb-item active" style={{ color: '#74788d' }}>Transaction</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="card border-0 shadow-sm" id="leadsList">
              <div className="card-header border-0 bg-transparent pt-4 pb-3">
                <div className="row g-4 align-items-center">
                  <div className="col-sm-3">
                    <div className="search-box position-relative">
                      <input 
                        className="form-control search shadow-sm" 
                        placeholder="Search for..." 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '35px', borderRadius: '4px' }}
                      />
                      <i className="ri-search-line search-icon position-absolute" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#878a99' }}></i>
                    </div>
                  </div>
                  <div className="col-sm-auto ms-auto">
                    <div className="hstack gap-2 d-flex flex-wrap">
                      <button onClick={handleRefresh} className="btn btn-soft-primary add-btn shadow-sm" style={{ backgroundColor: '#e2e5ed', color: '#405189', border: 'none' }}>
                        <i className="ri-restart-line me-1"></i> Refresh
                      </button>
                      <button onClick={() => setShowModal(true)} className="btn btn-success add-btn shadow-sm" style={{ backgroundColor: '#0ab39c', borderColor: '#0ab39c' }} type="button">
                        <i className="ri-add-line align-bottom me-1"></i> Add New Transaction
                      </button>
                      <button onClick={() => setShowFilters(true)} className="btn btn-info shadow-sm" type="button" style={{ backgroundColor: '#299cdb', borderColor: '#299cdb' }}>
                        <i className="ri-filter-3-line align-bottom me-1"></i> Filters
                      </button>
                      <button className="btn btn-warning add-btn shadow-sm" type="button" style={{ backgroundColor: '#f7b84b', borderColor: '#f7b84b' }}>
                        <i className="ri-download-cloud-line align-bottom me-1"></i> Download Statement CSV
                      </button>
                      <a href="/dashboard/finance-overview/" className="btn btn-soft-info add-btn shadow-sm" style={{ backgroundColor: '#e0f1f9', color: '#299cdb', border: 'none' }}>
                        <i className="ri-arrow-go-back-line align-bottom me-1"></i> Back
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body pt-0">
                <div className="table-responsive table-card">
                  <table className="table align-middle table-nowrap table-hover" id="customerTable">
                    <thead className="table-light text-muted">
                      <tr>
                        <th>Tr. ID</th>
                        <th className="sort">Category</th>
                        <th className="sort">Type</th>
                        <th className="sort">Amount</th>
                        <th className="sort">Description</th>
                        <th className="sort">Create Date</th>
                        <th className="sort">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.length === 0 ? (
                        <tr>
                          <td colSpan="7">
                            <div className="noresult py-5">
                              <div className="text-center">
                                <i className="ri-search-line text-muted" style={{ fontSize: '40px' }}></i>
                                <h5 className="mt-2" style={{ color: '#495057' }}>Sorry! No Data Found</h5>
                                <p className="text-muted mb-0">We've searched all database, But we did not find any transactions for you.</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredTransactions.map(tx => (
                          <tr key={tx.id}>
                            <td><a href="#!" className="fw-medium text-primary text-decoration-none">{tx.id}</a></td>
                            <td>{tx.category}</td>
                            <td>{tx.type}</td>
                            <td className={tx.type === 'Income' ? 'text-success fw-medium' : 'text-danger fw-medium'}>
                              {tx.type === 'Income' ? '+' : '-'} ₹ {tx.amount}
                            </td>
                            <td>{tx.description || '-'}</td>
                            <td>{tx.date}</td>
                            <td>
                              <ul className="list-inline hstack gap-2 mb-0">
                                <li className="list-inline-item">
                                  <button className="btn btn-sm btn-soft-primary px-2 py-1"><i className="ri-pencil-fill"></i></button>
                                </li>
                                <li className="list-inline-item">
                                  <button onClick={() => handleDelete(tx.id)} className="btn btn-sm btn-soft-danger px-2 py-1"><i className="ri-delete-bin-line"></i></button>
                                </li>
                              </ul>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="d-flex justify-content-end mt-3">
                  <div className="pagination-wrap hstack gap-2">
                    <label className="mt-2 text-muted me-2">Available Transactions {filteredTransactions.length}</label>
                    <a className="page-item pagination-prev disabled text-muted text-decoration-none" href="#!">Previous</a>
                    <ul className="pagination listjs-pagination mb-0">
                      <li className="active"><a className="page" href="#!" style={{ backgroundColor: '#405189', color: 'white', padding: '5px 10px', borderRadius: '4px', textDecoration: 'none' }}>1</a></li>
                    </ul>
                    <a className="page-item pagination-next disabled text-muted text-decoration-none" href="#!">Next</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add New Transaction Modal */}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ backgroundColor: '#fff', width: '600px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              
              <div style={{ padding: '16px 20px', backgroundColor: '#f3f6f9', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="m-0 d-flex align-items-center" style={{ fontSize: '18px', color: '#495057' }}>
                  <i className="mdi mdi-file-account-outline me-2"></i> Add New Transaction
                </h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#878a99' }}>&times;</button>
              </div>

              <div className="card mb-0 shadow-none border-0">
                <div className="card-header align-items-center border-0 d-flex pt-3 pb-2 px-4 bg-transparent">
                  <h4 className="card-title mb-0 flex-grow-1 text-muted" style={{ fontSize: '15px' }}>
                    <i className="ri-file-add-line me-1 align-bottom"></i> Transaction
                  </h4>
                  <div className="flex-shrink-0">
                    <ul className="nav justify-content-end nav-tabs-custom rounded card-header-tabs border-bottom-0 m-0">
                      <li className="nav-item">
                        <span onClick={() => {setActiveTab('Income'); setSelectedCategory('');}} className={`nav-link ${activeTab === 'Income' ? 'active' : ''}`} style={{ cursor: 'pointer', borderBottom: activeTab === 'Income' ? '2px solid #0ab39c' : 'none', color: activeTab === 'Income' ? '#0ab39c' : '#495057', fontWeight: '500', padding: '10px 15px' }}>
                          <i className="ri-arrow-down-line align-bottom me-1 text-success"></i> Income
                        </span>
                      </li>
                      <li className="nav-item">
                        <span onClick={() => {setActiveTab('Expenses'); setSelectedCategory('');}} className={`nav-link ${activeTab === 'Expenses' ? 'active' : ''}`} style={{ cursor: 'pointer', borderBottom: activeTab === 'Expenses' ? '2px solid #f06548' : 'none', color: activeTab === 'Expenses' ? '#f06548' : '#495057', fontWeight: '500', padding: '10px 15px' }}>
                          <i className="ri-arrow-up-line align-bottom me-1 text-danger"></i> Expenses
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="card-body p-4 pt-2">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label style={{ fontSize: '13px', fontWeight: '500', color: '#495057' }}>Select {activeTab} Category : <a href="#!" onClick={handleAddNewCategory} className="text-primary" style={{ textDecoration: 'none' }}>+ Add New</a></label>
                      <select className="form-select form-select-md" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required>
                        <option value="">-- Select {activeTab} Category --</option>
                        {categories[activeTab].map((cat, idx) => (
                          <option key={idx} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label style={{ fontSize: '13px', fontWeight: '500', color: '#495057' }}>Amount <span className="text-danger">*</span></label>
                      <input type="number" className="form-control form-control-md" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                      <label style={{ fontSize: '13px', fontWeight: '500', color: '#495057' }}>Description / Remark</label>
                      <textarea className="form-control form-control-md" rows="4" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>

                    <div className="mt-4 pt-2">
                      <button className="btn btn-primary w-100 py-2" type="submit" style={{ backgroundColor: '#405189', borderColor: '#405189', fontWeight: '500' }}>Submit</button>
                    </div>
                  </form>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    
        {/* ── Transactions Filters Offcanvas ── */}
        {showFilters && (
          <>
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99998 }} onClick={() => setShowFilters(false)}></div>
            <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', backgroundColor: '#fff', zIndex: 99999, display: 'flex', flexDirection: 'column', boxShadow: '-5px 0 15px rgba(0,0,0,0.1)' }}>
              
              <div style={{ padding: '16px 20px', backgroundColor: '#f3f6f9', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h6 style={{ margin: 0, fontWeight: '600', fontSize: '15px', color: '#495057' }}>Transactions Filters</h6>
                <button onClick={() => setShowFilters(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#878a99' }}>&times;</button>
              </div>

              <div style={{ padding: '20px', flexGrow: 1, overflowY: 'auto' }}>
                
                <h6 style={{ fontSize: '12px', fontWeight: '600', color: '#878a99', textTransform: 'uppercase', marginBottom: '15px' }}>Account Type</h6>
                <div className="row mb-4">
                  <div className="col-6">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="chkIncome" checked={filterAccountType.income} onChange={(e) => setFilterAccountType({...filterAccountType, income: e.target.checked})} />
                      <label className="form-check-label" htmlFor="chkIncome" style={{ fontSize: '13px', color: '#212529' }}>Income</label>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="chkExpenses" checked={filterAccountType.expenses} onChange={(e) => setFilterAccountType({...filterAccountType, expenses: e.target.checked})} />
                      <label className="form-check-label" htmlFor="chkExpenses" style={{ fontSize: '13px', color: '#212529' }}>Expenses</label>
                    </div>
                  </div>
                </div>

                <h6 style={{ fontSize: '12px', fontWeight: '600', color: '#878a99', textTransform: 'uppercase', marginBottom: '15px' }}>Select Date Range</h6>
                <div className="mb-3">
                  <div className="form-check form-radio-primary mb-2">
                    <input className="form-check-input" type="radio" name="dateRange" id="allDates" checked={filterDateRange === 'All Dates'} onChange={() => setFilterDateRange('All Dates')} style={{ borderColor: filterDateRange === 'All Dates' ? '#405189' : '' }} />
                    <label className="form-check-label" htmlFor="allDates" style={{ fontSize: '13px', color: '#212529' }}>All Dates</label>
                  </div>
                  <div className="form-check form-radio-primary mb-2">
                    <input className="form-check-input" type="radio" name="dateRange" id="currentMonth" checked={filterDateRange === 'Current Month'} onChange={() => setFilterDateRange('Current Month')} />
                    <label className="form-check-label" htmlFor="currentMonth" style={{ fontSize: '13px', color: '#212529' }}>Current Month</label>
                  </div>
                  <div className="form-check form-radio-primary mb-3">
                    <input className="form-check-input" type="radio" name="dateRange" id="selectRange" checked={filterDateRange === 'Select Date Range'} onChange={() => setFilterDateRange('Select Date Range')} />
                    <label className="form-check-label" htmlFor="selectRange" style={{ fontSize: '13px', color: '#212529' }}>Select Date Range</label>
                  </div>
                  
                  <div className="row g-2 align-items-center mb-2">
                    <div className="col-auto">
                      <label style={{ fontSize: '13px', width: '40px', marginBottom: 0 }}>From</label>
                    </div>
                    <div className="col">
                      <input type="date" className="form-control form-control-sm"  value={filterFromDate} onChange={(e) => setFilterFromDate(e.target.value)}  />
                    </div>
                  </div>
                  <div className="row g-2 align-items-center mb-4">
                    <div className="col-auto">
                      <label style={{ fontSize: '13px', width: '40px', marginBottom: 0 }}>To</label>
                    </div>
                    <div className="col">
                      <input type="date" className="form-control form-control-sm"  value={filterToDate} onChange={(e) => setFilterToDate(e.target.value)}  />
                    </div>
                  </div>
                </div>

                <h6 style={{ fontSize: '11px', fontWeight: '600', color: '#878a99', textTransform: 'uppercase', marginBottom: '15px' }}>
                  Categories / Accounts Name <span style={{ color: '#405189' }}>(Income Account)</span>
                </h6>
                <h6 style={{ fontSize: '11px', fontWeight: '600', color: '#878a99', textTransform: 'uppercase', marginBottom: '15px' }}>
                  Categories / Accounts Name <span style={{ color: '#405189' }}>(Expenses Account)</span>
                </h6>

              </div>

              <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px' }}>
                <button onClick={clearFilters} className="btn btn-light flex-grow-1" style={{ backgroundColor: '#f3f6f9', border: 'none', color: '#495057' }}>Clear Filter</button>
                <button onClick={() => setShowFilters(false)} className="btn flex-grow-1" style={{ backgroundColor: '#0ab39c', color: 'white', border: 'none' }}>Filters</button>
              </div>

            </div>
          </>
        )}

    </DashboardLayout>
  );
};

export default DashboardTransactions;
