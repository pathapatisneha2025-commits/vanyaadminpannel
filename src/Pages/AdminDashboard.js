import React, { useState } from 'react';

const AdminDashboard = () => {
  return (
    <div style={styles.container}>
    
     

      {/* Main Content */}
      <main style={styles.main}>
        <header style={styles.header}>
          <h2 style={{ margin: 0 }}>Dashboard Overview</h2>
          <div style={styles.profile}>
            <span style={{ marginRight: '15px' }}>Administrator</span>
            <div style={styles.avatar}>A</div>
          </div>
        </header>

        {/* Stats Cards */}
        <div style={styles.grid}>
          <div style={styles.card}>
            <span style={styles.cardLabel}>Total Revenue</span>
            <h3 style={styles.cardValue}>₹8,42,000</h3>
            <div style={styles.trend}>+12.5% from last month</div>
          </div>
          <div style={styles.card}>
            <span style={styles.cardLabel}>Total Orders</span>
            <h3 style={styles.cardValue}>482</h3>
            <div style={styles.trend}>+5.2% from last week</div>
          </div>
          <div style={styles.card}>
            <span style={styles.cardLabel}>Active Listings</span>
            <h3 style={styles.cardValue}>124</h3>
            <div style={styles.trend}>12 new this month</div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div style={styles.tableCard}>
          <h4 style={{ marginTop: 0, color: '#D4AF37' }}>Recent Orders</h4>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Product</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={styles.tr}>
                <td style={styles.td}>Aditi Rao</td>
                <td style={styles.td}>Kanjeevaram Silk</td>
                <td style={styles.td}>₹18,500</td>
                <td style={styles.td}><span style={styles.status}>Processing</span></td>
              </tr>
              <tr style={styles.tr}>
                <td style={styles.td}>Meera Nair</td>
                <td style={styles.td}>Floral Banarasi</td>
                <td style={styles.td}>₹12,200</td>
                <td style={styles.td}><span style={{...styles.status, backgroundColor: '#1b5e20'}}>Shipped</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: '#0d1f18',
    color: '#fff',
    fontFamily: 'sans-serif',
  },
  sidebar: {
    width: '240px',
    background: '#142a22',
    padding: '30px 20px',
    borderRight: '1px solid rgba(212, 175, 55, 0.2)',
  },
  logo: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: '40px',
    textAlign: 'center',
  },
  subLogo: { fontSize: '10px', display: 'block', opacity: 0.6 },
  nav: { display: 'flex', flexDirection: 'column', gap: '10px' },
  navItem: {
    padding: '12px 15px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: '0.3s',
  },
  activeNavItem: {
    background: 'rgba(212, 175, 55, 0.15)',
    color: '#f2b94a',
    borderLeft: '4px solid #f2b94a',
  },
  main: { flex: 1, padding: '40px' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  profile: { display: 'flex', alignItems: 'center' },
  avatar: {
    width: '35px',
    height: '35px',
    borderRadius: '50%',
    backgroundColor: '#D4AF37',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#142a22',
    fontWeight: 'bold',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  cardLabel: { fontSize: '12px', color: '#888' },
  cardValue: { fontSize: '24px', margin: '10px 0', color: '#D4AF37' },
  trend: { fontSize: '11px', color: '#4CAF50' },
  tableCard: {
    background: 'rgba(255,255,255,0.03)',
    padding: '25px',
    borderRadius: '15px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px', color: '#888', borderBottom: '1px solid #333', fontSize: '13px' },
  td: { padding: '15px 12px', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  status: {
    background: '#4e342e',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
  }
};

export default AdminDashboard;