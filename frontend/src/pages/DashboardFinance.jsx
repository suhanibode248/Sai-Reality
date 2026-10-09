import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

import { useState } from 'react';

const DashboardFinance = () => {
  const [transactionType, setTransactionType] = useState('Income');
  const [categories, setCategories] = useState({
    Income: ['Sales', 'Consulting', 'Investment'],
    Expenses: ['Rent', 'Salaries', 'Utilities', 'Marketing']
  });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  
  const [transactions, setTransactions] = useState([]);

  
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatTab, setNewCatTab] = useState('Income');
  const [newCatName, setNewCatName] = useState('');

  const handleOpenCategoryModal = (type, e) => {
    if (e) e.preventDefault();
    setNewCatTab(type || 'Income');
    setNewCatName('');
    setShowCategoryModal(true);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (newCatName.trim()) {
      setCategories(prev => ({
        ...prev,
        [newCatTab]: [...prev[newCatTab], newCatName.trim()]
      }));
      if (transactionType === newCatTab) {
        setSelectedCategory(newCatName.trim());
      }
      setShowCategoryModal(false);
    }
  };

    const handleRefresh = () => {
    window.location.reload();
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
      type: transactionType,
      amount: parseFloat(amount),
      description: description,
      status: 'Completed',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    setTransactions([newTx, ...transactions]);
    setAmount('');
    setDescription('');
  };

  const incomeTxs = transactions.filter(t => t.type === 'Income');
  const expenseTxs = transactions.filter(t => t.type === 'Expenses');
  const totalIncome = incomeTxs.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenseTxs.reduce((sum, t) => sum + t.amount, 0);
  const netSaving = totalIncome - totalExpense;
  const savingPercentage = totalIncome > 0 ? ((netSaving / totalIncome) * 100).toFixed(2) : '0.00';

  return (
    <DashboardLayout>
      <div className="container-fluid p-0">
        
        {/* Header Row */}
        <div className="row mb-3 pb-1">
          <div className="col-12">
            <div className="d-flex align-items-lg-center flex-lg-row flex-column">
              <div className="flex-grow-1">
                <h4 className="fs-16 mb-1 text-primary" style={{ color: '#405189' }}>Financials Transactions & Accounting Overview !</h4>
                <p className="text-muted mb-0">Here's what's happening with your finance and accounts.</p>
              </div>
              <div className="mt-3 mt-lg-0">
                <form action="javascript:void(0);">
                  <div className="row g-3 mb-0 align-items-center">
                    <div className="col-sm-auto">
                      <div className="input-group">
                        <input type="text" className="form-control border-0 shadow-sm" defaultValue="10/09/2026" style={{ fontSize: '13px' }} />
                        <div className="input-group-text bg-primary border-primary text-white shadow-sm" style={{ backgroundColor: '#405189', borderColor: '#405189' }}>
                          <i className="ri-calendar-2-line"></i>
                        </div>
                      </div>
                    </div>
                    <div className="col-auto">
                      <button type="button" onClick={handleRefresh} className="btn btn-soft-secondary btn-sm shadow-sm" style={{ backgroundColor: '#f3f6f9', color: '#495057', border: 'none', padding: '7px 12px' }}>
                        <i className="ri-refresh-line align-middle me-1"></i> Refresh
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="row" id="top-metrics">
          {/* INCOME */}
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card card-animate border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center mb-4">
                  <div className="flex-grow-1 overflow-hidden">
                    <p className="text-uppercase fw-medium text-muted text-truncate mb-0" style={{ fontSize: '12px' }}>INCOME</p>
                  </div>
                  <div className="flex-shrink-0">
                    <h5 className="text-success fs-12 mb-0">
                      <i className="ri-arrow-right-up-line fs-13 align-middle"></i> ({incomeTxs.length} Transactions)
                    </h5>
                  </div>
                </div>
                <div className="d-flex align-items-end justify-content-between">
                  <div>
                    <h4 className="fs-22 fw-semibold ff-secondary mb-3">₹ {totalIncome}</h4>
                    <a href="#income-table" className="text-decoration-underline text-muted" style={{ fontSize: '12px' }}>View Income Transaction</a>
                  </div>
                  <div className="avatar-sm flex-shrink-0">
                    <span className="avatar-title rounded fs-3" style={{ backgroundColor: 'rgba(10, 179, 156, 0.18)', color: '#0ab39c' }}>
                      <i className="ri-arrow-down-circle-line"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* EXPENSES */}
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card card-animate border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center mb-4">
                  <div className="flex-grow-1 overflow-hidden">
                    <p className="text-uppercase fw-medium text-muted text-truncate mb-0" style={{ fontSize: '12px' }}>EXPENSES</p>
                  </div>
                  <div className="flex-shrink-0">
                    <h5 className="text-danger fs-12 mb-0">
                      <i className="ri-arrow-right-down-line fs-13 align-middle"></i> ({expenseTxs.length} Transactions)
                    </h5>
                  </div>
                </div>
                <div className="d-flex align-items-end justify-content-between">
                  <div>
                    <h4 className="fs-22 fw-semibold ff-secondary mb-3">₹ {totalExpense}</h4>
                    <a href="#income-table" className="text-decoration-underline text-muted" style={{ fontSize: '12px' }}>View Income Transaction</a>
                  </div>
                  <div className="avatar-sm flex-shrink-0">
                    <span className="avatar-title rounded fs-3" style={{ backgroundColor: 'rgba(240, 101, 72, 0.18)', color: '#f06548' }}>
                      <i className="ri-arrow-up-circle-line"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RECEIVABLES */}
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card card-animate border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center mb-4">
                  <div className="flex-grow-1 overflow-hidden">
                    <p className="text-uppercase fw-medium text-muted text-truncate mb-0" style={{ fontSize: '12px' }}>RECEIVABLES</p>
                  </div>
                  <div className="flex-shrink-0">
                    <h5 className="text-warning fs-12 mb-0">( Invoices)</h5>
                  </div>
                </div>
                <div className="d-flex align-items-end justify-content-between">
                  <div>
                    <h4 className="fs-22 fw-semibold ff-secondary mb-3">₹ 0</h4>
                    <a href="#recent-transactions" className="text-decoration-underline text-muted" style={{ fontSize: '12px' }}>See details</a>
                  </div>
                  <div className="avatar-sm flex-shrink-0">
                    <span className="avatar-title rounded fs-3" style={{ backgroundColor: 'rgba(247, 184, 75, 0.18)', color: '#f7b84b' }}>
                      <i className="ri-money-rupee-circle-line"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NET SAVING */}
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card card-animate border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center mb-4">
                  <div className="flex-grow-1 overflow-hidden">
                    <p className="text-uppercase fw-medium text-muted text-truncate mb-0" style={{ fontSize: '12px' }}>NET SAVING</p>
                  </div>
                  <div className="flex-shrink-0">
                    <h5 className="text-muted fs-12 mb-0">{savingPercentage > 0 ? '+' : ''}{savingPercentage} %</h5>
                  </div>
                </div>
                <div className="d-flex align-items-end justify-content-between">
                  <div>
                    <h4 className="fs-22 fw-semibold ff-secondary mb-3">₹ {netSaving}</h4>
                    <a href="#recent-transactions" className="text-decoration-underline text-muted" style={{ fontSize: '12px' }}>View Transactions</a>
                  </div>
                  <div className="avatar-sm flex-shrink-0">
                    <span className="avatar-title rounded fs-3" style={{ backgroundColor: 'rgba(41, 156, 219, 0.18)', color: '#299cdb' }}>
                      <i className="ri-wallet-3-line"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section (Chart & Transaction Form) */}
        <div className="row">
          {/* Revenue Chart */}
          <div className="col-xl-8 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header border-0 align-items-center d-flex bg-transparent pb-0 pt-3">
                <h4 className="card-title mb-0 flex-grow-1 fw-semibold text-muted" style={{ fontSize: '14px' }}>Revenue</h4>
                <div>
                  <button className="btn btn-soft-secondary btn-sm" type="button" style={{ backgroundColor: '#f3f6f9', color: '#495057' }}>
                    1 Year Data
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fcfcfc', borderRadius: '4px' }}>
                  {/* Empty white box matching screenshot */}
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Form */}
          <div className="col-xl-4 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header border-0 align-items-center d-flex bg-transparent pb-2 pt-3 border-bottom">
                <h4 className="card-title mb-0 flex-grow-1 fw-semibold text-muted" style={{ fontSize: '14px' }}>
                  <i className="ri-file-list-3-line me-1"></i> Transaction
                </h4>
                <div className="d-flex gap-2 text-muted" style={{ fontSize: '12px' }}>
                  <span onClick={() => {setTransactionType('Income'); setSelectedCategory('');}} className={transactionType === 'Income' ? "fw-medium" : ""} style={{ cursor: 'pointer', color: transactionType === 'Income' ? '#405189' : 'inherit' }}><i className="ri-arrow-right-down-line text-success"></i> Income</span>
                  <span onClick={() => {setTransactionType('Expenses'); setSelectedCategory('');}} className={transactionType === 'Expenses' ? "fw-medium" : ""} style={{ cursor: 'pointer', color: transactionType === 'Expenses' ? '#405189' : 'inherit' }}><i className="ri-arrow-right-up-line text-danger"></i> Expenses</span>
                </div>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label style={{ fontSize: '12px', fontWeight: '500' }}>Select {transactionType} Category : <a href="#!" onClick={(e) => handleOpenCategoryModal(transactionType, e)} className="text-primary" style={{ textDecoration: 'none' }}>+ Add New</a></label>
                    <select className="form-select form-select-sm" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required>
                      <option value="">-- Select {transactionType} Category --</option>
                      {categories[transactionType].map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label style={{ fontSize: '12px', fontWeight: '500' }}>Amount <span className="text-danger">*</span></label>
                    <input type="number" className="form-control form-control-sm" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label style={{ fontSize: '12px', fontWeight: '500' }}>Description / Remark</label>
                    <textarea className="form-control form-control-sm" rows="3" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary btn-sm w-100" style={{ backgroundColor: '#8c98ba', borderColor: '#8c98ba', color: 'white', fontWeight: '500' }}>Submit</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Third Section: Overview Tables */}
        <div className="row">
          <div className="col-xl-6 mb-4" id="income-table">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header align-items-center d-flex bg-transparent border-bottom-0 pb-0 pt-3">
                <h4 className="card-title mb-0 flex-grow-1 fw-semibold text-muted" style={{ fontSize: '14px' }}>
                  <i className="ri-arrow-right-down-line text-success me-1"></i> Income Transaction Overview
                </h4>
                <a href="#recent-transactions" className="text-muted" style={{ fontSize: '12px', textDecoration: 'none' }}><i className="ri-history-line"></i> View Transaction History</a>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-borderless align-middle table-nowrap mb-0" style={{ fontSize: '12px' }}>
                    <thead className="table-light text-muted">
                      <tr>
                        <th>#ID</th>
                        <th className="w-100">Category</th>
                        <th>Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incomeTxs.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center py-5">
                            <i className="ri-search-line text-muted" style={{ fontSize: '30px' }}></i>
                            <h6 className="mt-2 text-muted" style={{ fontSize: '13px' }}>Sorry! No Data Found</h6>
                            <p className="text-muted mb-3" style={{ fontSize: '11px' }}>We've searched all databases, But we did not find any transaction category for you.</p>
                            <button onClick={() => {setTransactionType('Income'); handleOpenCategoryModal('Income');}} className="btn btn-light btn-sm text-muted" style={{ fontSize: '11px', backgroundColor: '#f3f6f9', border: 'none' }}>+ Add New Category</button>
                          </td>
                        </tr>
                      ) : (
                        incomeTxs.map(tx => (
                          <tr key={tx.id}>
                            <td className="fw-medium text-primary">{tx.id}</td>
                            <td>{tx.category}</td>
                            <td className="text-success">+ ₹ {tx.amount}</td>
                            <td><button className="btn btn-sm btn-soft-danger px-2 py-1"><i className="ri-delete-bin-line"></i></button></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-6 mb-4" id="expenses-table">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header align-items-center d-flex bg-transparent border-bottom-0 pb-0 pt-3">
                <h4 className="card-title mb-0 flex-grow-1 fw-semibold text-muted" style={{ fontSize: '14px' }}>
                  <i className="ri-arrow-right-up-line text-danger me-1"></i> Expenses Transaction Overview
                </h4>
                <a href="#recent-transactions" className="text-muted" style={{ fontSize: '12px', textDecoration: 'none' }}><i className="ri-history-line"></i> View Transaction History</a>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-borderless align-middle table-nowrap mb-0" style={{ fontSize: '12px' }}>
                    <thead className="table-light text-muted">
                      <tr>
                        <th>#ID</th>
                        <th className="w-100">Category</th>
                        <th>Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenseTxs.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center py-5">
                            <i className="ri-search-line text-muted" style={{ fontSize: '30px' }}></i>
                            <h6 className="mt-2 text-muted" style={{ fontSize: '13px' }}>Sorry! No Data Found</h6>
                            <p className="text-muted mb-3" style={{ fontSize: '11px' }}>We've searched all databases, But we did not find any transaction category for you.</p>
                            <button onClick={() => {setTransactionType('Expenses'); handleOpenCategoryModal('Income');}} className="btn btn-light btn-sm text-muted" style={{ fontSize: '11px', backgroundColor: '#f3f6f9', border: 'none' }}>+ Add New Category</button>
                          </td>
                        </tr>
                      ) : (
                        expenseTxs.map(tx => (
                          <tr key={tx.id}>
                            <td className="fw-medium text-primary">{tx.id}</td>
                            <td>{tx.category}</td>
                            <td className="text-danger">- ₹ {tx.amount}</td>
                            <td><button className="btn btn-sm btn-soft-danger px-2 py-1"><i className="ri-delete-bin-line"></i></button></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Recent Transactions */}
        <div className="row" id="recent-transactions">
          <div className="col-xl-12 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header align-items-center d-flex bg-transparent border-bottom-0 pb-0 pt-3">
                <h4 className="card-title mb-0 flex-grow-1 fw-semibold text-muted" style={{ fontSize: '14px' }}>Recent Transactions</h4>
                <div className="flex-shrink-0">
                  <a className="btn btn-soft-info btn-sm" href="#recent-transactions" style={{ backgroundColor: 'rgba(41, 156, 219, 0.1)', color: '#299cdb' }}>
                    <i className="ri-eye-line align-middle me-1"></i> View All
                  </a>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive table-card">
                  <table className="table table-borderless table-centered align-middle table-nowrap mb-0" style={{ fontSize: '12px' }}>
                    <thead className="table-light text-muted">
                      <tr>
                        <th>Tr. ID</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center py-5">
                            <i className="ri-search-line text-muted" style={{ fontSize: '30px' }}></i>
                            <h6 className="mt-2 text-muted" style={{ fontSize: '13px' }}>Sorry! No Data Found</h6>
                            <p className="text-muted mb-0" style={{ fontSize: '11px' }}>We've searched all database, But we did not find any transaction for you.</p>
                          </td>
                        </tr>
                      ) : (
                        transactions.map(tx => (
                          <tr key={tx.id}>
                            <td className="fw-medium text-primary">{tx.id}</td>
                            <td>{tx.category}</td>
                            <td>{tx.type}</td>
                            <td className={tx.type === 'Income' ? 'text-success' : 'text-danger'}>{tx.type === 'Income' ? '+' : '-'} ₹ {tx.amount}</td>
                            <td>{tx.description || '-'}</td>
                            <td><span className="badge bg-success">{tx.status}</span></td>
                            <td>{tx.date}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    
        {/* ── Add New Category Modal ── */}
        {showCategoryModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ backgroundColor: '#fff', width: '500px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h6 style={{ margin: 0, fontWeight: '600', fontSize: '15px', color: '#334155' }}>Add New category</h6>
                <button onClick={() => setShowCategoryModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>&times;</button>
              </div>

              <div style={{ padding: '20px' }}>
                
                {/* Tabs */}
                <div className="d-flex align-items-center mb-4 pb-2 border-bottom">
                  <div className="d-flex align-items-center me-4">
                    <i className="ri-folder-2-line text-muted me-2" style={{ fontSize: '18px' }}></i>
                    <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>Category</span>
                  </div>
                  <div className="d-flex gap-4">
                    <span onClick={() => setNewCatTab('Income')} style={{ cursor: 'pointer', fontSize: '13px', paddingBottom: '10px', marginBottom: '-11px', borderBottom: newCatTab === 'Income' ? '2px solid #405189' : 'none', color: newCatTab === 'Income' ? '#405189' : '#64748b', fontWeight: newCatTab === 'Income' ? '500' : 'normal' }}>Income</span>
                    <span onClick={() => setNewCatTab('Expenses')} style={{ cursor: 'pointer', fontSize: '13px', paddingBottom: '10px', marginBottom: '-11px', borderBottom: newCatTab === 'Expenses' ? '2px solid #405189' : 'none', color: newCatTab === 'Expenses' ? '#405189' : '#64748b', fontWeight: newCatTab === 'Expenses' ? '500' : 'normal' }}>Expenses</span>
                  </div>
                </div>

                <form onSubmit={handleSaveCategory}>
                  <div className="mb-4">
                    <label style={{ fontSize: '12px', fontWeight: '500', color: '#495057' }}>Category Type <span className="text-danger">*</span></label>
                    <input type="text" className="form-control form-control-sm bg-light" value={newCatTab.toLowerCase()} readOnly style={{ color: '#878a99' }} />
                  </div>

                  <div className="mb-4">
                    <label style={{ fontSize: '12px', fontWeight: '500', color: '#495057' }}>{newCatTab} Category Name <span className="text-danger">*</span></label>
                    <input type="text" className="form-control form-control-sm" placeholder={`Enter ${newCatTab.toLowerCase()} category name`} value={newCatName} onChange={(e) => setNewCatName(e.target.value)} required autoFocus />
                  </div>

                  <button type="submit" className="btn btn-primary w-100" style={{ backgroundColor: '#405189', borderColor: '#405189', padding: '8px', fontSize: '13px', fontWeight: '500' }}>Submit</button>
                </form>

              </div>

            </div>
          </div>
        )}

    </DashboardLayout>
  );
};

export default DashboardFinance;
