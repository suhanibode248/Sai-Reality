import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const DashboardSliders = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSlider, setNewSlider] = useState({ title: '', image: null });

  const [sliders, setSliders] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaImages, setMediaImages] = useState([]);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState(null);


  useEffect(() => {
    fetch('http://localhost:8000/api/sliders')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setSliders(data.sliders);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const openMediaLibrary = () => {
    fetch('http://localhost:8000/api/media')
      .then(res => res.json())
      .then(data => {
        if(data.status === 'success') {
          setMediaImages(data.images);
          setShowMediaLibrary(true);
        }
      })
      .catch(err => console.error(err));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this slider?")) {
      try {
        const response = await fetch(`http://localhost:8000/api/sliders/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setSliders(sliders.filter(s => s.id !== id));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddSlider = async (e) => {
    e.preventDefault();

    
    const formData = new FormData();
    formData.append('title', newSlider.title || 'New Slider');
    
    if (selectedFile) {
        formData.append('image', selectedFile);
    } else if (selectedMediaUrl) {
        formData.append('image_url', selectedMediaUrl);
    } else {
        return alert("Please select an image file or choose from Media Library.");
    }

    try {
      const response = await fetch('http://localhost:8000/api/sliders', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.status === 'success') {
        setSliders([data.slider, ...sliders]);
        setShowAddModal(false);
        setNewSlider({ title: '', image: null });
        setSelectedFile(null);
        setSelectedMediaUrl(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="container-fluid p-0">
        
        {/* Page Title */}
        <div className="row mb-3 pb-1">
          <div className="col-12">
            <div className="d-flex align-items-lg-center flex-lg-row flex-column justify-content-between">
              <h4 className="fs-16 mb-1 text-uppercase fw-semibold" style={{ color: '#495057' }}>Sliders</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0" style={{ backgroundColor: 'transparent', padding: 0 }}>
                  <li className="breadcrumb-item"><a href="#!" style={{ color: '#495057', textDecoration: 'none' }}>Others</a></li>
                  <li className="breadcrumb-item active" style={{ color: '#74788d' }}>Sliders</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Header row with Add Button */}
        <div className="row mb-3">
          <div className="col-lg-12">
            <div className="card shadow-sm border-0 mb-0">
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="mb-0 fs-14 fw-medium text-dark">Website Sliders Gallery</h5>
                  <button onClick={() => setShowAddModal(true)} className="btn btn-soft-primary btn-sm" style={{ backgroundColor: '#e0e8ff', color: '#405189', border: 'none', fontWeight: '500' }}>
                    <i className="ri-image-add-line align-bottom me-1"></i> Add New Slider
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="row">
          {sliders.map(slider => (
            <div className="col-xl-3 col-sm-6 mb-4" key={slider.id}>
              <div className="card gallery-box shadow-sm border-0 h-100 m-0 overflow-hidden" style={{ borderRadius: '8px' }}>
                <div className="gallery-container position-relative" style={{ height: '200px', backgroundColor: '#f3f6f9' }}>
                  <a href="#!" className="image-popup" title={slider.title}>
                    <img src={slider.image_path} alt={slider.title} className="gallery-img img-fluid mx-auto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div className="gallery-overlay" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '15px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                      <h5 className="overlay-caption text-white m-0 text-truncate fs-14 fw-medium" title={slider.title}>
                        {slider.title}
                      </h5>
                    </div>
                  </a>
                </div>
                <div className="box-content p-3 bg-white">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1 text-muted fs-12">
                      {new Date(slider.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex-shrink-0">
                      <div className="d-flex gap-2">
                        <a href="#!" className="text-primary text-decoration-none" onClick={(e) => e.preventDefault()}>
                          <i className="fs-16 ri-edit-line align-bottom"></i>
                        </a>
                        <a href="#!" className="text-danger text-decoration-none" onClick={(e) => { e.preventDefault(); handleDelete(slider.id); }}>
                          <i className="fs-16 ri-delete-bin-line align-bottom"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {sliders.length === 0 && (
            <div className="col-12 text-center py-5">
              <i className="ri-image-line text-muted" style={{ fontSize: '40px' }}></i>
              <h5 className="mt-2 text-muted">No Sliders Found</h5>
            </div>
          )}
        </div>

        {/* Add Slider Offcanvas */}
        {showAddModal && (
          <>
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99998 }} onClick={() => setShowAddModal(false)}></div>
            <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', backgroundColor: '#fff', zIndex: 99999, display: 'flex', flexDirection: 'column', boxShadow: '-5px 0 15px rgba(0,0,0,0.1)' }}>
              
              <div className="offcanvas-header p-3 border-bottom d-flex justify-content-between align-items-center" style={{ backgroundColor: '#f3f6f9' }}>
                <h5 className="m-0 d-flex align-items-center fw-medium" style={{ fontSize: '15px', color: '#405189' }}>
                  <i className="ri-image-add-line fs-18 me-2 text-primary"></i> Add New Slider
                </h5>
                <button onClick={() => setShowAddModal(false)} className="btn-close" style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#878a99' }}>&times;</button>
              </div>

              <div className="offcanvas-body p-4 flex-grow-1 overflow-auto">
                <form id="addSliderForm" onSubmit={handleAddSlider}>
                  <div className="mb-4">
                    <label className="form-label text-uppercase fw-semibold" style={{ fontSize: '11px', color: '#878a99', letterSpacing: '0.5px' }}>
                      Headline / Title <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      className="form-control form-control-sm" 
                      placeholder="Enter title" 
                      required
                      value={newSlider.title}
                      onChange={(e) => setNewSlider({...newSlider, title: e.target.value})}
                      style={{ padding: '8px 12px', fontSize: '13px', borderColor: '#ced4da' }} 
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label text-uppercase fw-semibold" style={{ fontSize: '11px', color: '#878a99', letterSpacing: '0.5px' }}>
                      Add Media Images
                    </label>
                    <p className="mb-1 text-dark" style={{ fontSize: '13px', fontWeight: '500' }}>Media (Size : 1920x500 Px)</p>
                    <div className="d-flex justify-content-between mb-2">
                      <p className="text-muted mb-0" style={{ fontSize: '12px' }}>Choose images. (Only .png, .jpeg, .jpg)</p>
                      <button type="button" className="btn btn-sm btn-link p-0 text-decoration-none" onClick={openMediaLibrary}>Choose from Library</button>
                    </div>
                    {selectedMediaUrl && <div className="mb-2"><img src={selectedMediaUrl} height="50" alt="selected"/> <small className="text-success ms-2">Selected from library</small></div>}
                    <input 
                      type="file" 
                      className="form-control form-control-sm"
                      accept=".png, .jpeg, .jpg"
                      onChange={(e) => {
                         if (e.target.files && e.target.files[0]) {
                           setSelectedFile(e.target.files[0]);
                           setNewSlider({...newSlider, image: URL.createObjectURL(e.target.files[0])});
                         }
                      }}
                      style={{ fontSize: '12px' }}
                    />
                  </div>
                </form>
              </div>

              <div className="p-3 bg-white border-top d-flex gap-2" style={{ position: 'sticky', bottom: 0 }}>
                <button type="button" onClick={() => setNewSlider({ title: '', image: null })} className="btn btn-light flex-grow-1" style={{ backgroundColor: '#f3f6f9', border: 'none', color: '#495057', fontSize: '13px', fontWeight: '500' }}>
                  Reset
                </button>
                <button type="submit" form="addSliderForm" className="btn btn-success flex-grow-1" style={{ backgroundColor: '#0ab39c', borderColor: '#0ab39c', fontSize: '13px', fontWeight: '500' }}>
                  Add New
                </button>
              </div>

            </div>
          </>
        )}


        {/* Media Library Modal */}
        {showMediaLibrary && (
          <>
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100000 }} onClick={() => setShowMediaLibrary(false)}></div>
            <div style={{ position: 'fixed', top: '10%', left: '10%', right: '10%', bottom: '10%', backgroundColor: '#fff', zIndex: 100001, display: 'flex', flexDirection: 'column', borderRadius: '8px', overflow: 'hidden' }}>
              <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
                <h5 className="m-0">Media Library</h5>
                <button onClick={() => setShowMediaLibrary(false)} className="btn-close"></button>
              </div>
              <div className="p-3 flex-grow-1 overflow-auto">
                <div className="row g-3">
                  {mediaImages.map((imgUrl, i) => (
                    <div className="col-2" key={i}>
                      <div 
                        onClick={() => { setSelectedMediaUrl(imgUrl); setSelectedFile(null); setNewSlider({...newSlider, image: imgUrl}); setShowMediaLibrary(false); }}
                        style={{ cursor: 'pointer', border: '2px solid transparent', borderRadius: '4px', overflow: 'hidden' }}
                        className="hover-shadow h-100"
                      >
                        <img src={imgUrl} className="img-fluid w-100 h-100 object-fit-cover" style={{ minHeight: '100px' }} alt="" />
                      </div>
                    </div>
                  ))}
                  {mediaImages.length === 0 && <p className="text-muted w-100 text-center mt-5">No images found in library.</p>}
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </DashboardLayout>
  );
};

export default DashboardSliders;
