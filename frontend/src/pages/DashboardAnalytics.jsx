import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import styles from './DashboardAnalytics.module.css';

const DashboardAnalytics = () => {
  const [data, setData] = useState({
    total: 0,
    statusCounts: {
      'New': 0,
      'Contacted': 0,
      'In Progress': 0,
      'Converted': 0,
      'Closed': 0
    },
    properties: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/leads');
        const result = await res.json();
        
        if (result.status === 'success') {
          const leads = result.leads;
          const statusCounts = { 'New': 0, 'Contacted': 0, 'In Progress': 0, 'Converted': 0, 'Closed': 0 };
          const properties = {};
          
          leads.forEach(lead => {
            if (statusCounts[lead.status] !== undefined) {
              statusCounts[lead.status]++;
            }
            
            const prop = lead.property_name || 'Unspecified';
            properties[prop] = (properties[prop] || 0) + 1;
          });
          
          setData({
            total: leads.length,
            statusCounts,
            properties
          });
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getPercentage = (count) => {
    if (data.total === 0) return 0;
    return Math.round((count / data.total) * 100);
  };

  return (
    <DashboardLayout>
      <div className={styles.analyticsContainer}>
        <h1 className={styles.pageTitle}>📈 Analytics Overview</h1>
        
        <div className={styles.grid}>
          {/* Conversion Funnel */}
          <div className={`${styles.card} ${styles.fullWidth}`}>
            <h2 className={styles.cardTitle}>🎯 Lead Conversion Funnel</h2>
            <div className={styles.funnelContainer}>
              <div className={styles.funnelStep}>
                <span className={styles.stepLabel}>Total Leads (New + Contacted)</span>
                <span className={styles.stepValue}>{data.statusCounts['New'] + data.statusCounts['Contacted']}</span>
              </div>
              <div className={styles.funnelStep}>
                <span className={styles.stepLabel}>Engaged (In Progress)</span>
                <span className={styles.stepValue}>{data.statusCounts['In Progress']}</span>
              </div>
              <div className={styles.funnelStep}>
                <span className={styles.stepLabel}>Converted (Sales)</span>
                <span className={styles.stepValue}>{data.statusCounts['Converted']}</span>
              </div>
            </div>
          </div>

          {/* Status Distribution */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>📊 Status Distribution</h2>
            <div className={styles.barChart}>
              <div className={styles.barRow}>
                <span className={styles.barLabel}>New</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${getPercentage(data.statusCounts['New'])}%`, '--bar-color': '#9333ea', '--bar-light': '#c084fc' }}>
                    {data.statusCounts['New']}
                  </div>
                </div>
              </div>
              <div className={styles.barRow}>
                <span className={styles.barLabel}>Contacted</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${getPercentage(data.statusCounts['Contacted'])}%`, '--bar-color': '#2563eb', '--bar-light': '#60a5fa' }}>
                    {data.statusCounts['Contacted']}
                  </div>
                </div>
              </div>
              <div className={styles.barRow}>
                <span className={styles.barLabel}>In Progress</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${getPercentage(data.statusCounts['In Progress'])}%`, '--bar-color': '#d97706', '--bar-light': '#fbbf24' }}>
                    {data.statusCounts['In Progress']}
                  </div>
                </div>
              </div>
              <div className={styles.barRow}>
                <span className={styles.barLabel}>Converted</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${getPercentage(data.statusCounts['Converted'])}%`, '--bar-color': '#16a34a', '--bar-light': '#4ade80' }}>
                    {data.statusCounts['Converted']}
                  </div>
                </div>
              </div>
              <div className={styles.barRow}>
                <span className={styles.barLabel}>Closed</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${getPercentage(data.statusCounts['Closed'])}%`, '--bar-color': '#475569', '--bar-light': '#94a3b8' }}>
                    {data.statusCounts['Closed']}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Property Distribution */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>🏢 Property Interest</h2>
            <div className={styles.barChart}>
              {Object.entries(data.properties).sort((a,b) => b[1] - a[1]).slice(0, 5).map(([prop, count], i) => (
                <div className={styles.barRow} key={prop}>
                  <span className={styles.barLabel} style={{ width: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={prop}>
                    {prop}
                  </span>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: `${getPercentage(count)}%`, '--bar-color': '#0ea5e9', '--bar-light': '#38bdf8' }}>
                      {count}
                    </div>
                  </div>
                </div>
              ))}
              {Object.keys(data.properties).length === 0 && !loading && (
                <p style={{ color: '#94a3b8' }}>No property data available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardAnalytics;
