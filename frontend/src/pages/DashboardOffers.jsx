import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const DashboardOffers = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState('All');
  
  const [newOffer, setNewOffer] = useState({
    offerText: '', duration: '20', fontColor: '#000000', backgroundColor: '#000000', fontStyle: 'open'
  });

  const [offers, setOffers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/offers')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setOffers(data.offers);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      try {
        const response = await fetch(`http://localhost:8000/api/offers/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setOffers(offers.filter(o => o.id !== id));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddOffer = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offer_text: newOffer.offerText,
          duration: parseInt(newOffer.duration) || 20,
          font_color: newOffer.fontColor,
          background_color: newOffer.backgroundColor,
          font_style: newOffer.fontStyle
        })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setOffers([data.offer, ...offers]);
        setShowAddModal(false);
        setNewOffer({ offerText: '', duration: '20', fontColor: '#000000', backgroundColor: '#000000', fontStyle: 'open' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOffers = filter === 'All' ? offers : offers.filter(o => o.status === filter);

  return (
    <DashboardLayout>
      <div className="container-fluid p-0">
        
        {/* Page Title */}
        <div className="row mb-3 pb-1">
          <div className="col-12">
            <div className="d-flex align-items-lg-center flex-lg-row flex-column justify-content-between">
              <h4 className="fs-16 mb-1 text-uppercase fw-semibold" style={{ color: '#495057' }}>Offers</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0" style={{ backgroundColor: 'transparent', padding: 0 }}>
                  <li className="breadcrumb-item"><a href="#!" style={{ color: '#495057', textDecoration: 'none' }}>Others</a></li>
                  <li className="breadcrumb-item active" style={{ color: '#74788d' }}>Offers</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Add Button */}
        <div className="row mb-4">
          <div className="col-lg-12">
            <div className="card shadow-sm border-0 mb-0">
              <div className="card-body py-3 px-4 d-flex align-items-center justify-content-between">
                
                <ul className="list-inline mb-0 d-flex gap-3 align-items-center" style={{ fontSize: '14px' }}>
                  <li className="list-inline-item m-0">
                    <a href="#!" onClick={(e) => { e.preventDefault(); setFilter('All'); }} className={filter === 'All' ? "text-primary fw-medium" : "text-muted"} style={{ cursor: 'pointer', textDecoration: 'none' }}>All</a>
                  </li>
                  <li className="list-inline-item m-0">
                    <a href="#!" onClick={(e) => { e.preventDefault(); setFilter('Published'); }} className={filter === 'Published' ? "text-primary fw-medium" : "text-muted"} style={{ cursor: 'pointer', textDecoration: 'none' }}>Published</a>
                  </li>
                  <li className="list-inline-item m-0">
                    <a href="#!" onClick={(e) => { e.preventDefault(); setFilter('Unpublished'); }} className={filter === 'Unpublished' ? "text-primary fw-medium" : "text-muted"} style={{ cursor: 'pointer', textDecoration: 'none' }}>Unpublished</a>
                  </li>
                </ul>

                <button onClick={() => setShowAddModal(true)} className="btn btn-soft-primary btn-sm" style={{ backgroundColor: '#e0e8ff', color: '#405189', border: 'none', fontWeight: '500' }}>
                  <i className="ri-image-add-line align-bottom me-1"></i> Add New Offer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="row">
          {filteredOffers.map(offer => (
            <div className="col-xl-3 col-sm-6 mb-4" key={offer.id}>
              <div className="card gallery-box shadow-sm border-0 h-100 m-0 overflow-hidden" style={{ borderRadius: '8px' }}>
                <div className="gallery-container p-4 d-flex align-items-center justify-content-center text-center" style={{ minHeight: '180px', backgroundColor: '#f3f6f9', borderBottom: '1px solid #e2e8f0' }}>
                  <h3 className="fs-14 m-0" style={{ fontFamily: "'Roboto', sans-serif", color: offer.font_color, lineHeight: '1.6' }}>
                    {offer.offer_text}
                  </h3>
                </div>
                <div className="box-content p-3 bg-white">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1 text-muted" style={{ fontSize: '11px', fontWeight: '500', textTransform: 'uppercase' }}>
                      COLOR : {offer.font_color}
                    </div>
                    <div className="flex-grow-1 text-muted text-center fs-12">
                      {new Date(offer.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex-shrink-0">
                      <div className="d-flex gap-2">
                        <a href="#!" className="text-primary text-decoration-none" onClick={(e) => e.preventDefault()}>
                          <i className="fs-16 ri-edit-line align-bottom"></i>
                        </a>
                        <a href="#!" className="text-danger text-decoration-none" onClick={(e) => { e.preventDefault(); handleDelete(offer.id); }}>
                          <i className="fs-16 ri-delete-bin-line align-bottom"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredOffers.length === 0 && (
            <div className="col-12 text-center py-5">
              <i className="ri-file-list-3-line text-muted" style={{ fontSize: '40px' }}></i>
              <h5 className="mt-2 text-muted">No Offers Found</h5>
            </div>
          )}
        </div>

        {/* Add Offer Offcanvas */}
        {showAddModal && (
          <>
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99998 }} onClick={() => setShowAddModal(false)}></div>
            <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', backgroundColor: '#fff', zIndex: 99999, display: 'flex', flexDirection: 'column', boxShadow: '-5px 0 15px rgba(0,0,0,0.1)' }}>
              
              <div className="offcanvas-header p-3 border-bottom d-flex justify-content-between align-items-center" style={{ backgroundColor: '#f8f9fa' }}>
                <h5 className="m-0 d-flex align-items-center fw-medium" style={{ fontSize: '15px', color: '#495057' }}>
                  <i className="ri-image-add-line fs-18 me-2" style={{ color: '#878a99' }}></i> Add New Offer
                </h5>
                <button onClick={() => setShowAddModal(false)} className="btn-close" style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#878a99' }}>&times;</button>
              </div>

              <div className="offcanvas-body p-4 flex-grow-1 overflow-auto">
                <form id="addOfferForm" onSubmit={handleAddOffer}>
                  
                  <div className="mb-4">
                    <label className="form-label text-uppercase fw-semibold" style={{ fontSize: '11px', color: '#878a99', letterSpacing: '0.5px' }}>
                      OFFER <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      className="form-control form-control-sm" 
                      placeholder="Enter Offer" 
                      required
                      value={newOffer.offerText}
                      onChange={(e) => setNewOffer({...newOffer, offerText: e.target.value})}
                      style={{ padding: '8px 12px', fontSize: '13px', borderColor: '#ced4da' }} 
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label text-uppercase fw-semibold" style={{ fontSize: '11px', color: '#878a99', letterSpacing: '0.5px' }}>
                      DURATION <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="number" 
                      className="form-control form-control-sm" 
                      required
                      value={newOffer.duration}
                      onChange={(e) => setNewOffer({...newOffer, duration: e.target.value})}
                      style={{ padding: '8px 12px', fontSize: '13px', borderColor: '#ced4da' }} 
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-uppercase fw-semibold" style={{ fontSize: '11px', color: '#878a99', letterSpacing: '0.5px' }}>
                      FONT COLOR <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="color" 
                      className="form-control form-control-color w-100 p-1" 
                      value={newOffer.fontColor}
                      onChange={(e) => setNewOffer({...newOffer, fontColor: e.target.value})}
                      style={{ height: '40px', cursor: 'pointer', borderColor: '#ced4da' }} 
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-uppercase fw-semibold" style={{ fontSize: '11px', color: '#878a99', letterSpacing: '0.5px' }}>
                      BACKGROUND COLOR <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="color" 
                      className="form-control form-control-color w-100 p-1" 
                      value={newOffer.backgroundColor}
                      onChange={(e) => setNewOffer({...newOffer, backgroundColor: e.target.value})}
                      style={{ height: '40px', cursor: 'pointer', borderColor: '#ced4da' }} 
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-dark fw-medium" style={{ fontSize: '12px' }}>
                      Fonts Style
                    </label>
                    <select 
                      className="form-select form-select-sm"
                      value={newOffer.fontStyle}
                      onChange={(e) => setNewOffer({...newOffer, fontStyle: e.target.value})}
                      style={{ padding: '8px 12px', fontSize: '13px', borderColor: '#ced4da' }}
                    >
                      <option value="open">open</option>
                      <option value="roboto">roboto</option>
                      <option value="inter">inter</option>
                    </select>
                  </div>

                </form>
              </div>

              <div className="p-3 bg-white border-top d-flex gap-2" style={{ position: 'sticky', bottom: 0 }}>
                <button type="button" onClick={() => setNewOffer({ offerText: '', duration: '20', fontColor: '#000000', backgroundColor: '#000000', fontStyle: 'open' })} className="btn btn-light flex-grow-1" style={{ backgroundColor: '#f3f6f9', border: 'none', color: '#495057', fontSize: '13px', fontWeight: '500' }}>
                  Reset
                </button>
                <button type="submit" form="addOfferForm" className="btn btn-success flex-grow-1" style={{ backgroundColor: '#0ab39c', borderColor: '#0ab39c', fontSize: '13px', fontWeight: '500' }}>
                  Add New
                </button>
              </div>

            </div>
          </>
        )}

      </div>
    </DashboardLayout>
  );
};

export default DashboardOffers;
