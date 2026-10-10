import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import faqSections from '../data/faqSections.json';

const SUPPORT = {
  email: 'support@businessyog.com',
  phone: '918459520768',
  whatsapp: 'https://wa.me/918459520768?text=Hello, Need a CRM assistant - Sai Realty.'
};

/** Others > FAQ's — same layout as the reference dashboard: contact banner + three accordion columns. */
const DashboardFAQ = () => {
  // First question of the first section starts open, like the reference page
  const [open, setOpen] = useState({ '0-0': true });
  const toggle = (key) => setOpen(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <DashboardLayout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="card rounded-0 bg-soft-success border-top" style={{ backgroundColor: 'rgba(10, 179, 156, 0.1)' }}>
              <div className="px-4">
                <div className="row">
                  <div className="col-xxl-5 align-self-center">
                    <div className="py-4">
                      <h4 className="display-6 coming-soon-text">Frequently asked questions</h4>
                      <p className="text-success fs-15 mt-3">
                        If you can not find answer to your question in our FAQ, you can always contact us via mail, direct call or whatsapp. We will answer you shortly!
                      </p>
                      <div className="hstack flex-wrap gap-2">
                        <a className="btn btn-primary btn-label rounded-pill" href={`mailto:${SUPPORT.email}`}>
                          <i className="ri-mail-line label-icon align-middle rounded-pill fs-16 me-2"></i> Email Us
                        </a>
                        <a className="btn btn-warning btn-label rounded-pill" href={`tel:${SUPPORT.phone}`}>
                          <i className="ri-phone-line label-icon align-middle rounded-pill fs-16 me-2"></i> Call us
                        </a>
                        <a className="btn btn-success btn-label rounded-pill" href={SUPPORT.whatsapp} target="_blank" rel="noreferrer">
                          <i className="ri-whatsapp-line label-icon align-middle rounded-pill fs-16 me-2"></i> Whatsapp us
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row justify-content-evenly">
              {faqSections.map((section, si) => (
                <div className="col-lg-4" key={section.title}>
                  <div className="mt-3">
                    <div className="d-flex align-items-center mb-2">
                      <div className="flex-shrink-0 me-1">
                        <i className={section.icon}></i>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="fs-16 mb-0 fw-semibold">{section.title}</h5>
                      </div>
                    </div>
                    <div className="accordion accordion-border-box">
                      {section.items.map((item, qi) => {
                        const key = `${si}-${qi}`;
                        return (
                          <div className="accordion-item" key={key}>
                            <h2 className="accordion-header">
                              <button className={`accordion-button ${open[key] ? '' : 'collapsed'}`} type="button" onClick={() => toggle(key)}>
                                {item.q}
                              </button>
                            </h2>
                            <div className={`accordion-collapse collapse ${open[key] ? 'show' : ''}`}>
                              <div className="accordion-body">
                                {item.a.map((p, i) => <p key={i}>{p}</p>)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardFAQ;
