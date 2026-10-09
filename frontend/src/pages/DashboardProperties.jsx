import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import scrapedProperties from '../data/scrapedProperties.json';

const DashboardProperties = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewProperty, setViewProperty] = useState(null);
  const [properties, setProperties] = useState(scrapedProperties || []);
  const [appliedFilters, setAppliedFilters] = useState({ propertyType: 'All', category: 'All', city: 'All', location: 'All', bedroom: 'All' });
  const handleDeleteProperty = (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  const handleSearch = () => {
    setAppliedFilters({ propertyType, category, city, location, bedroom });
  };

  
  // Filter states
  const [propertyType, setPropertyType] = useState('All');
  const [category, setCategory] = useState('All');
  const [city, setCity] = useState('All');
  const [location, setLocation] = useState('All');
  const [bedroom, setBedroom] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const filteredProperties = properties.filter(p => {
    let match = true;
    if (propertyType !== 'All' && p.type !== propertyType) match = false;
    if (location !== 'All' && !p.location.includes(location)) match = false;
    // For price, since it's a string like '₹ 27000', we'd need to parse it, but for now simple check
    return match;
  });

  return (
    <DashboardLayout>
      <div className="container-fluid p-0">
        
        {/* Title Box */}
        
      {viewProperty ? (
        <div className="container-fluid p-0">
          {/* Header */}
          <div className="row mb-3">
            <div className="col-12">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between bg-white border-0 p-3 shadow-sm rounded">
                <h4 className="mb-sm-0 fw-bold text-uppercase" style={{ fontSize: '14px', color: '#495057' }}>Property Details</h4>
                <div className="page-title-right">
                  <ol className="breadcrumb m-0" style={{ backgroundColor: 'transparent', padding: 0 }}>
                    <li className="breadcrumb-item"><a href="#!" style={{ color: '#495057', textDecoration: 'none' }}>CRM</a></li>
                    <li className="breadcrumb-item active" style={{ color: '#74788d' }}>Property Details</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Left Column: Image Gallery */}
            <div className="col-lg-4">
              <div className="card shadow-sm border-0 mb-3 rounded">
                <div className="card-body p-2 position-relative">
                  <div className="position-absolute top-0 start-0 m-3 bg-dark bg-opacity-75 text-white px-2 py-1 rounded" style={{ fontSize: '12px', zIndex: 10 }}>
                    <i className="ri-image-line me-1"></i> 5 of 7
                  </div>
                  <img src={viewProperty.image && viewProperty.image !== '/media/' ? viewProperty.image : 'https://placehold.co/600x400'} alt="Main" className="w-100 rounded mb-2" style={{ height: '250px', objectFit: 'cover' }} />
                  <div className="d-flex gap-2">
                    <img src={viewProperty.image && viewProperty.image !== '/media/' ? viewProperty.image : 'https://placehold.co/100x100'} alt="Thumb 1" className="rounded" style={{ width: '80px', height: '80px', objectFit: 'cover', border: '2px solid #0ab39c' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Details */}
            <div className="col-lg-8">
              <div className="card shadow-sm border-0 mb-3 rounded">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h4 className="fw-bold mb-1" style={{ color: '#405189', fontSize: '18px' }}>{viewProperty.title}</h4>
                      <p className="text-muted mb-2" style={{ fontSize: '12px' }}>
                        Residential Appartment - {viewProperty.type || 'For Sale'} | Seller: <strong>Vijay Shipalkar</strong> | Published : {viewProperty.date}
                      </p>
                      <p className="text-muted mb-3" style={{ fontSize: '13px' }}>
                        <i className="ri-map-pin-line text-primary me-1"></i> {viewProperty.location}
                      </p>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-light btn-sm border"><i className="ri-links-line"></i></button>
                      <button className="btn btn-light btn-sm border"><i className="ri-pencil-line"></i></button>
                      <button onClick={() => setViewProperty(null)} className="btn btn-light btn-sm border"><i className="ri-arrow-go-back-line"></i></button>
                    </div>
                  </div>

                  {/* 4 Info Boxes */}
                  <div className="row g-3 mb-4">
                    <div className="col-md-3">
                      <div className="border rounded p-3 d-flex align-items-center gap-3">
                        <i className="ri-money-rupee-circle-line" style={{ fontSize: '24px', color: '#0ab39c' }}></i>
                        <div>
                          <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Price -</p>
                          <h6 className="mb-0 fw-bold">{viewProperty.price || 'Ask Price'}</h6>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="border rounded p-3 d-flex align-items-center gap-3">
                        <i className="ri-layout-masonry-line" style={{ fontSize: '24px', color: '#0ab39c' }}></i>
                        <div>
                          <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Area -</p>
                          <h6 className="mb-0 fw-bold">767 sqft</h6>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="border rounded p-3 d-flex align-items-center gap-3">
                        <i className="ri-hotel-bed-line" style={{ fontSize: '24px', color: '#0ab39c' }}></i>
                        <div>
                          <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Bedroom -</p>
                          <h6 className="mb-0 fw-bold">2</h6>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="border rounded p-3 d-flex align-items-center gap-3">
                        <i className="ri-showers-line" style={{ fontSize: '24px', color: '#0ab39c' }}></i>
                        <div>
                          <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Bathroom -</p>
                          <h6 className="mb-0 fw-bold">2</h6>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h6 className="fw-bold" style={{ fontSize: '13px' }}>Description :</h6>
                  <p className="text-muted" style={{ fontSize: '13px' }}>{viewProperty.title} Amenities - Club House, Swimming Pool, Lift with Back Up, Security Guards 24by7, Housekeeping, 24 by 7 Drinking water from PMC, 24by7 Water for use.</p>

                  <h6 className="fw-bold mt-4" style={{ fontSize: '13px' }}>Features :</h6>
                  <ul className="list-unstyled text-muted" style={{ fontSize: '13px' }}>
                    <li className="mb-1"><i className="ri-checkbox-circle-line text-success me-1"></i> Built Year : 2026</li>
                    <li className="mb-1"><i className="ri-checkbox-circle-line text-success me-1"></i> Transaction :</li>
                    <li className="mb-1"><i className="ri-checkbox-circle-line text-success me-1"></i> Facing :</li>
                    <li className="mb-1"><i className="ri-checkbox-circle-line text-success me-1"></i> Furnishing : Unfurnished</li>
                  </ul>

                  <h6 className="fw-bold mt-4" style={{ fontSize: '13px' }}>Amenities :</h6>
                  <div className="d-flex flex-wrap gap-3 mb-4 text-muted" style={{ fontSize: '12px' }}>
                    <span><i className="ri-check-line text-success"></i> Swimming Pool</span>
                    <span><i className="ri-check-line text-success"></i> Gym</span>
                    <span><i className="ri-check-line text-success"></i> Clubhouse</span>
                    <span><i className="ri-check-line text-success"></i> Security</span>
                    <span><i className="ri-check-line text-success"></i> Playground</span>
                    <span><i className="ri-check-line text-success"></i> Parking</span>
                    <span><i className="ri-check-line text-success"></i> CCTV</span>
                  </div>

                  <h6 className="fw-bold mt-4" style={{ fontSize: '13px' }}>Property Description :</h6>
                  <ul className="nav nav-tabs nav-tabs-custom mb-3">
                    <li className="nav-item">
                      <a className="nav-link active" style={{ color: '#0ab39c', borderBottom: '2px solid #0ab39c' }} href="#!">Seller Information</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link text-muted" href="#!">Meta SEO Details</a>
                    </li>
                  </ul>
                  
                  <div className="table-responsive">
                    <table className="table table-borderless table-sm text-muted" style={{ fontSize: '13px' }}>
                      <tbody>
                        <tr className="border-bottom">
                          <th className="fw-medium py-2" style={{ width: '150px' }}>Category</th>
                          <td className="py-2">Residential Appartment - For Sale</td>
                        </tr>
                        <tr className="border-bottom">
                          <th className="fw-medium py-2">Seller Name</th>
                          <td className="py-2">Vijay Shipalkar</td>
                        </tr>
                        <tr className="border-bottom">
                          <th className="fw-medium py-2">Seller Phone</th>
                          <td className="py-2">9175929455</td>
                        </tr>
                        <tr>
                          <th className="fw-medium py-2">Address</th>
                          <td className="py-2"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (<>
<div className="row mb-3">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between bg-transparent border-0 p-0">
              <h4 className="mb-sm-0 fw-bold" style={{ fontSize: '16px', color: '#495057' }}>Properties List</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0" style={{ backgroundColor: 'transparent', padding: 0 }}>
                  <li className="breadcrumb-item"><a href="#!" style={{ color: '#495057', textDecoration: 'none' }}>Properties</a></li>
                  <li className="breadcrumb-item active" style={{ color: '#74788d' }}>Properties List</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-12">
            <div className="card shadow-sm border-0" style={{ borderRadius: '8px' }}>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-lg-3 col-md-6">
                    <label style={{ fontSize: '13px', fontWeight: '500', color: '#495057' }}>Property Type</label>
                    <select className="form-select form-select-sm" value={propertyType} onChange={e => setPropertyType(e.target.value)}>
                      <option value="All">Select Property Type</option>
                      <option value="For Sale">For Sale</option>
                      <option value="For Rent">For Rent</option>
                      <option value="For Lease">For Lease</option>
                    </select>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <label style={{ fontSize: '13px', fontWeight: '500', color: '#495057' }}>Category</label>
                    <select className="form-select form-select-sm" value={category} onChange={e => setCategory(e.target.value)}>
                      <option value="All">Select Category</option>
                      <option value="Residential Appartment">Residential Appartment</option>
                      <option value="Commercial Space & Office">Commercial Space & Office</option>
                      <option value="Commercial Shop">Commercial Shop</option>
                      <option value="Commercial Showroom">Commercial Showroom</option>
                      <option value="Banglow">Banglow</option>
                      <option value="Open Plot">Open Plot</option>
                    </select>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <label style={{ fontSize: '13px', fontWeight: '500', color: '#495057' }}>City</label>
                    <select className="form-select form-select-sm" value={city} onChange={e => setCity(e.target.value)}>
                      <option value="All">Select City</option>
                      <option value="Pune">Pune</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="bangalore">bangalore</option>
                      <option value="Delhi">Delhi</option>
                    </select>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <label style={{ fontSize: '13px', fontWeight: '500', color: '#495057' }}>Location</label>
                    <select className="form-select form-select-sm" value={location} onChange={e => setLocation(e.target.value)}>
                      <option value="All">Select Location</option>
                      <option value="Dhanori">Dhanori</option>
                      <option value="Kharadi">Kharadi</option>
                      <option value="Lohgaon">Lohgaon</option>
                      <option value="Wagholi">Wagholi</option>
                      <option value="Viman Nagar">Viman Nagar</option>
                      <option value="Kalyani Nagar">Kalyani Nagar</option>
                    </select>
                  </div>
                  <div className="col-lg-2 col-md-6">
                    <label style={{ fontSize: '13px', fontWeight: '500', color: '#495057' }}>Min Price</label>
                    <input type="text" className="form-control form-control-sm" placeholder="Min Price" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                  </div>
                  <div className="col-lg-2 col-md-6">
                    <label style={{ fontSize: '13px', fontWeight: '500', color: '#495057' }}>Max Price</label>
                    <input type="text" className="form-control form-control-sm" placeholder="Max Price" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
                  </div>
                  <div className="col-lg-2 col-md-6">
                    <label style={{ fontSize: '13px', fontWeight: '500', color: '#495057' }}>Bedroom</label>
                    <select className="form-select form-select-sm" value={bedroom} onChange={e => setBedroom(e.target.value)}>
                      <option value="All">Select Bedroom</option>
                      <option value="1BHK">1BHK</option>
                      <option value="2BHK">2BHK</option>
                      <option value="3BHK">3BHK</option>
                      <option value="4BHK">4BHK</option>
                      <option value="5BHK">5BHK</option>
                    </select>
                  </div>
                  <div className="col-lg-3 col-md-6 d-flex align-items-end">
                    <button onClick={handleSearch} className="btn btn-primary btn-sm w-100" style={{ backgroundColor: '#405189', borderColor: '#405189' }}>
                      <i className="ri-search-line me-1"></i> Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar (Top) */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button onClick={() => setShowAddModal(true)} className="btn btn-success btn-sm px-4" style={{ backgroundColor: '#0ab39c', borderColor: '#0ab39c', fontWeight: '500' }}>
            + Add New
          </button>
          <button className="btn btn-light btn-sm shadow-sm" style={{ fontWeight: '500' }}>
            <i className="ri-refresh-line me-1"></i> Refresh
          </button>
        </div>

        {/* Properties Grid */}
        <div className="row">
          {filteredProperties.map((p) => (
            <div className="col-xxl-3 col-lg-4 col-md-6 mb-4" key={p.id}>
              <div className="card h-100 shadow-sm border" style={{ borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                
                {/* Diagonal Ribbon */}
                <div style={{ position: 'absolute', top: '10px', left: '-30px', backgroundColor: '#3b4371', color: 'white', padding: '4px 35px', transform: 'rotate(-45deg)', fontSize: '10px', fontWeight: 'bold', zIndex: 10, letterSpacing: '0.5px' }}>
                  {p.type || 'For Sale'}
                </div>

                <div style={{ height: '180px', width: '100%', overflow: 'hidden', backgroundColor: '#f3f6f9' }}>
                  <img 
                    alt={p.title} 
                    className="w-100 h-100" 
                    src={p.image && p.image !== '/media/' ? p.image : 'https://placehold.co/600x400?text=No+Image'} 
                    style={{ objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=No+Image'; }}
                  />
                </div>
                
                <div className="card-body p-3 pb-2">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <h5 className="mb-0 text-truncate me-2" style={{ fontSize: '14px', fontWeight: '600' }}>
                      <a href="#!" onClick={(e) => { e.preventDefault(); setViewProperty(p); }} className="text-primary text-decoration-none" style={{ color: '#0d6efd' }}>{p.title}</a>
                    </h5>
                    <span className="text-muted d-flex align-items-center" style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                      <i className="ri-eye-line me-1"></i> {Math.floor(1000000 + Math.random() * 9000000)}
                    </span>
                  </div>
                  <p className="text-muted mb-0 text-truncate" style={{ fontSize: '12px' }}>
                    <i className="ri-map-pin-line align-bottom me-1"></i> {p.location}
                  </p>
                </div>
                
                <div className="card-body p-3 pt-0 pb-2">
                  <div className="row g-2 text-center" style={{ borderTop: '1px solid #f3f6f9', borderBottom: '1px solid #f3f6f9', padding: '8px 0' }}>
                    <div className="col-4 border-end">
                      <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Price</p>
                      <h5 className="mb-0 text-truncate" style={{ fontSize: '12px', fontWeight: '600', color: '#495057' }}>{p.price || 'Ask Price'}</h5>
                    </div>
                    <div className="col-4 border-end">
                      <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Avl From</p>
                      <h5 className="mb-0 text-truncate" style={{ fontSize: '12px', fontWeight: '600', color: '#495057' }}>None</h5>
                    </div>
                    <div className="col-4">
                      <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Created <i className="ri-calendar-line"></i></p>
                      <h5 className="mb-0 text-truncate" style={{ fontSize: '12px', fontWeight: '600', color: '#495057' }}>{p.date}</h5>
                    </div>
                  </div>
                </div>

                <div className="card-footer bg-transparent p-2 px-3 border-0 d-flex justify-content-between align-items-center">
                  <div className="d-flex gap-2">
                    <a href="tel:+919876543210" className="text-muted" title="Call Seller"><i className="ri-phone-line" style={{ fontSize: '15px', cursor: 'pointer' }}></i></a>
                    <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="text-muted" title="WhatsApp Seller"><i className="ri-whatsapp-line" style={{ fontSize: '15px', cursor: 'pointer' }}></i></a>
                    <a href="#!" onClick={(e) => { e.preventDefault(); setShowAddModal(true); }} className="text-muted" title="Edit Property"><i className="ri-pencil-line" style={{ fontSize: '15px', cursor: 'pointer' }}></i></a>
                    <a href="#!" onClick={(e) => { e.preventDefault(); handleDeleteProperty(p.id); }} className="text-muted" title="Delete Property"><i className="ri-delete-bin-line" style={{ fontSize: '15px', cursor: 'pointer' }}></i></a>
                  </div>
                  <span style={{ color: '#0d6efd', fontSize: '12px', fontWeight: '600' }}>{p.id % 2 === 0 ? 'Published' : 'Draft'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
      )}
      </div>

      {/* ── Add New Property Full Modal ── */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#f3f3f9', zIndex: 99999, overflowY: 'auto' }}>
          
          {/* Header */}
          <div style={{ backgroundColor: '#fff', padding: '15px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 10 }}>
            <div>
              <h4 style={{ margin: 0, fontWeight: '700', fontSize: '15px', color: '#495057', textTransform: 'uppercase' }}>Add New Property</h4>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ fontSize: '12px', color: '#878a99' }}>CRM &gt; Add New Property</span>
              <button onClick={() => setShowAddModal(false)} className="btn-close" style={{ fontSize: '14px' }}></button>
            </div>
          </div>

          {/* Form Content */}
          <div className="container-fluid p-4">
            <form onSubmit={e => e.preventDefault()}>
              <div className="row">
                
                {/* ─── LEFT COLUMN ─── */}
                <div className="col-lg-8">
                  
                  {/* Property Title & Desc */}
                  <div className="card shadow-sm border-0 mb-3" style={{ borderRadius: '4px' }}>
                    <div className="card-body">
                      <div className="mb-4">
                        <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Property Name/ Title <span className="text-danger">*</span></label>
                        <input className="form-control form-control-sm" type="text" placeholder="Enter property title" required />
                      </div>
                      <div>
                        <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Property Details/ Description <span className="text-danger">*</span></label>
                        <textarea className="form-control form-control-sm" rows="6" placeholder="Enter property description" required></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Images Gallery */}
                  <div className="card shadow-sm border-0 mb-3" style={{ borderRadius: '4px' }}>
                    <div className="card-header bg-white border-bottom">
                      <h5 className="card-title mb-0 fw-bold" style={{ fontSize: '14px' }}>Images Gallery</h5>
                    </div>
                    <div className="card-body">
                      <div className="mb-4">
                        <label className="form-label fw-medium mb-0" style={{ fontSize: '13px' }}>Property Main Image (Size : 800x800 Px)</label>
                        <p className="text-muted small mb-2">Add main Image. <span className="text-danger">*</span> (Only .jpg)</p>
                        <div style={{ border: '1px dashed #ced4da', borderRadius: '4px', padding: '30px', textAlign: 'center', backgroundColor: '#f8f9fa', width: '120px', height: '120px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="ri-image-add-line" style={{ fontSize: '32px', color: '#adb5bd' }}></i>
                        </div>
                      </div>
                      <div>
                        <label className="form-label fw-medium mb-0" style={{ fontSize: '13px' }}>Gallery (Size : 800x800 Px)</label>
                        <p className="text-muted small mb-2">Add Gallery Multiple Images. (Only .jpg)</p>
                        <input type="file" className="form-control form-control-sm" accept="image/jpeg" multiple style={{ maxWidth: '300px' }} />
                      </div>
                    </div>
                  </div>

                  {/* Address & Location */}
                  <div className="card shadow-sm border-0 mb-3" style={{ borderRadius: '4px' }}>
                    <div className="card-body">
                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Address <span className="text-danger">*</span></label>
                          <input className="form-control form-control-sm" type="text" placeholder="Enter property address" required />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Choose a location <span className="text-danger">*</span></label>
                          <select className="form-select form-select-sm mb-2">
                            <option value="">Select location</option>
                            <option value="Kharadi">Kharadi</option>
                            <option value="Lohgaon">Lohgaon</option>
                            <option value="Dhanori">Dhanori</option>
                            <option value="Wogholi">Wogholi</option>
                            <option value="Hadapsar">Hadapsar</option>
                            <option value="Vishrantwadi">Vishrantwadi</option>
                            <option value="Viman Nagar">Viman Nagar</option>
                            <option value="Tingare Nagar">Tingare Nagar</option>
                            <option value="Dighi">Dighi</option>
                            <option value="Koregaon Park">Koregaon Park</option>
                            <option value="Kalyani Nagar">Kalyani Nagar</option>
                            <option value="Yerwada">Yerwada</option>
                            <option value="vadgaonsheri">vadgaonsheri</option>
                            <option value="Chandan Nagar">Chandan Nagar</option>
                          </select>
                          <div className="d-flex gap-2">
                            <input type="text" className="form-control form-control-sm" placeholder="Enter new location" />
                            <button type="button" className="btn btn-light border btn-sm" style={{ whiteSpace: 'nowrap' }}>Add New Location</button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-medium" style={{ fontSize: '13px' }}>City <span className="text-danger">*</span></label>
                          <input className="form-control form-control-sm" type="text" placeholder="Enter city name" required />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Pincode <span className="text-danger">*</span></label>
                          <input className="form-control form-control-sm" type="text" placeholder="Enter pincode" required />
                        </div>
                      </div>

                      <div className="row g-3">
                        <div className="col-md-3">
                          <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Area (In sqft) <span className="text-danger">*</span></label>
                          <input className="form-control form-control-sm" type="number" defaultValue="10" required />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Built Year <span className="text-danger">*</span></label>
                          <input className="form-control form-control-sm" type="number" defaultValue="2001" required />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Bedroom <span className="text-danger">*</span></label>
                          <input className="form-control form-control-sm" type="number" defaultValue="2" required />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Bathroom <span className="text-danger">*</span></label>
                          <input className="form-control form-control-sm" type="number" defaultValue="1" required />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tabs: Seller Details & Meta Data */}
                  <div className="card shadow-sm border-0 mb-3" style={{ borderRadius: '4px' }}>
                    <div className="card-header bg-white border-bottom p-0">
                      <ul className="nav nav-tabs-custom border-bottom-0">
                        <li className="nav-item">
                          <a className="nav-link active fw-medium" style={{ color: '#405189', borderBottom: '2px solid #405189' }} href="#!">Seller Details</a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link fw-medium text-muted" href="#!">Meta Data (SEO)</a>
                        </li>
                      </ul>
                    </div>
                    <div className="card-body">
                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Seller Name</label>
                          <input className="form-control form-control-sm" type="text" placeholder="Enter Seller Name" />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Seller Mobile</label>
                          <input className="form-control form-control-sm" type="text" placeholder="Enter seller mobile" />
                        </div>
                      </div>
                      
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Price/ Rent <span className="text-danger">*</span></label>
                          <div className="input-group input-group-sm">
                            <span className="input-group-text bg-light">₹</span>
                            <input className="form-control" type="text" placeholder="Eg.1234567890" />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Deposit (If Available)</label>
                          <div className="input-group input-group-sm">
                            <span className="input-group-text bg-light">₹</span>
                            <input className="form-control" type="text" placeholder="Eg. 40000" />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Youtube Video URL (If Available)</label>
                          <div className="input-group input-group-sm">
                            <span className="input-group-text bg-light"><i className="ri-link"></i></span>
                            <input className="form-control" type="text" placeholder="Youtube Video URL" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* ─── RIGHT COLUMN ─── */}
                <div className="col-lg-4">
                  
                  {/* Publish */}
                  <div className="card shadow-sm border-0 mb-3" style={{ borderRadius: '4px' }}>
                    <div className="card-header bg-white border-bottom">
                      <h5 className="card-title mb-0 fw-bold" style={{ fontSize: '14px' }}>Publish</h5>
                    </div>
                    <div className="card-body">
                      <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Status</label>
                      <select className="form-select form-select-sm">
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  {/* Basic Details */}
                  <div className="card shadow-sm border-0 mb-3" style={{ borderRadius: '4px' }}>
                    <div className="card-header bg-white border-bottom">
                      <h5 className="card-title mb-0 fw-bold" style={{ fontSize: '14px' }}>Basic Details</h5>
                    </div>
                    <div className="card-body d-flex flex-column gap-3">
                      <div>
                        <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Select Type</label>
                        <select className="form-select form-select-sm">
                          <option value="For Sale">For Sale</option>
                          <option value="For Rent">For Rent</option>
                          <option value="For Lease">For Lease</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Select category</label>
                        <select className="form-select form-select-sm">
                          <option value="Residential Appartment">Residential Appartment</option>
                          <option value="Commercial Space & Office">Commercial Space & Office</option>
                          <option value="Commercial Shop">Commercial Shop</option>
                          <option value="Commercial Showroom">Commercial Showroom</option>
                          <option value="Banglow">Banglow</option>
                          <option value="Open Plot">Open Plot</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Select Transaction</label>
                        <select className="form-select form-select-sm">
                          <option value="New">New</option>
                          <option value="Resele">Resele</option>
                          <option value="Pre Launch">Pre Launch</option>
                          <option value="Individual">Individual</option>
                          <option value="Company">Company</option>
                          <option value="Distress Sale">Distress Sale</option>
                          <option value="Group Booking">Group Booking</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Facing</label>
                        <select className="form-select form-select-sm">
                          <option value="East">East</option>
                          <option value="West">West</option>
                          <option value="Notrh">Notrh</option>
                          <option value="South">South</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Furnishing Status</label>
                        <select className="form-select form-select-sm">
                          <option value="Fully Furnished">Fully Furnished</option>
                          <option value="Semi Furnished">Semi Furnished</option>
                          <option value="Unfrnished">Unfrnished</option>
                          <option value="Basic Furnished">Basic Furnished</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label fw-medium" style={{ fontSize: '13px' }}>Available From</label>
                        <input type="date" className="form-control form-control-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Select Amenities */}
                  <div className="card shadow-sm border-0 mb-3" style={{ borderRadius: '4px' }}>
                    <div className="card-header bg-white border-bottom">
                      <h5 className="card-title mb-0 fw-bold" style={{ fontSize: '14px' }}>Select Amenities</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-6 d-flex flex-column gap-2">
                          <label className="d-flex align-items-center gap-2 m-0" style={{ fontSize: '12px' }}><input type="checkbox" /> Rooftop Amenities</label>
                          <label className="d-flex align-items-center gap-2 m-0" style={{ fontSize: '12px' }}><input type="checkbox" /> Indoor Games</label>
                          <label className="d-flex align-items-center gap-2 m-0" style={{ fontSize: '12px' }}><input type="checkbox" /> Party Lawn</label>
                          <label className="d-flex align-items-center gap-2 m-0" style={{ fontSize: '12px' }}><input type="checkbox" /> Open Air Amphitheatre</label>
                          <label className="d-flex align-items-center gap-2 m-0" style={{ fontSize: '12px' }}><input type="checkbox" /> Pantry</label>
                          <label className="d-flex align-items-center gap-2 m-0" style={{ fontSize: '12px' }}><input type="checkbox" /> Spa</label>
                          <label className="d-flex align-items-center gap-2 m-0" style={{ fontSize: '12px' }}><input type="checkbox" /> Basketball Court</label>
                          <label className="d-flex align-items-center gap-2 m-0" style={{ fontSize: '12px' }}><input type="checkbox" /> Library</label>
                          <label className="d-flex align-items-center gap-2 m-0" style={{ fontSize: '12px' }}><input type="checkbox" /> CCTV</label>
                          <label className="d-flex align-items-center gap-2 m-0" style={{ fontSize: '12px' }}><input type="checkbox" /> Playground</label>
                          <label className="d-flex align-items-center gap-2 m-0" style={{ fontSize: '12px' }}><input type="checkbox" /> Clubhouse</label>
                          <label className="d-flex align-items-center gap-2 m-0" style={{ fontSize: '12px' }}><input type="checkbox" /> Swimming Pool</label>
                        </div>
                        <div className="col-6 d-flex flex-column gap-2">
                          <label className="d-flex align-items-center gap-2 m-0" style={{ fontSize: '12px' }}><input type="checkbox" /> Designer Club House</label>
                          <label className="d-flex align-items-center gap-2 m-0" style={{ fontSize: '12px' }}><input type="checkbox" /> Senior Citizen's Area</label>
                          <label className="d-flex align-items-center gap-2 m-0" style={{ fontSize: '12px' }}><input type="checkbox" /> Kids Play Area</label>
                          <label className="d-flex align-items-center gap-2 m-0" style={{ fontSize: '12px' }}><input type="checkbox" /> Gazebo</label>
                          <label className="d-flex align-items-center gap-2 m-0" style={{ fontSize: '12px' }}><input type="checkbox" /> Yoga Room</label>
                          <label className="d-flex align-items-center gap-2 m-0" style={{ fontSize: '12px' }}><input type="checkbox" /> Jogging Track</label>
                          <label className="d-flex align-items-center gap-2 m-0" style={{ fontSize: '12px' }}><input type="checkbox" /> Tennis Court</label>
                          <label className="d-flex align-items-center gap-2 m-0" style={{ fontSize: '12px' }}><input type="checkbox" /> Wi-Fi</label>
                          <label className="d-flex align-items-center gap-2 m-0" style={{ fontSize: '12px' }}><input type="checkbox" /> Parking</label>
                          <label className="d-flex align-items-center gap-2 m-0" style={{ fontSize: '12px' }}><input type="checkbox" /> Security</label>
                          <label className="d-flex align-items-center gap-2 m-0" style={{ fontSize: '12px' }}><input type="checkbox" /> Gym</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Buttons */}
                  <div className="d-flex justify-content-end gap-2 mt-4 mb-4 pb-4">
                    <button type="submit" className="btn text-white fw-medium px-4" style={{ backgroundColor: '#0ab39c' }}>+ Add Now</button>
                    <button type="reset" className="btn fw-medium px-4" style={{ backgroundColor: '#fef4e4', color: '#f59e0b', border: '1px solid #fef4e4' }}>Reset</button>
                    <button type="button" onClick={() => setShowAddModal(false)} className="btn fw-medium px-4" style={{ backgroundColor: '#fde8e4', color: '#ef4444', border: '1px solid #fde8e4' }}>Cancel</button>
                  </div>

                </div>

              </div>
            </form>
          </div>

        </div>
      )}

    </DashboardLayout>
  );
};

export default DashboardProperties;
