import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const VanyaLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false); // start closed on mobile
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('admin'); 
    alert('Logged out successfully!');
    navigate('/login'); 
  };

  // Detect screen size for responsive sidebar
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={styles.adminWrapper}>

      {/* Sidebar Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          style={styles.overlay} 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside style={{
        ...styles.sidebar,
        left: isSidebarOpen || !isMobile ? '0' : '-250px',
        width: isMobile ? '250px' : '250px',
      }}>
        <div style={styles.logo}>
          VANYA <span style={styles.logoSub}>Admin</span>
        </div>

      <nav style={styles.nav}>
  <Link 
    to="/admin/products" 
    style={styles.navItem} 
    onClick={() => isMobile && setSidebarOpen(false)}
  >
    👗 Manage Products
  </Link>
  <Link 
    to="/admin/orders" 
    style={styles.navItem} 
    onClick={() => isMobile && setSidebarOpen(false)}
  >
    🛒 Orders
  </Link>
  <Link 
    to="/admin/coupons" 
    style={styles.navItem} 
    onClick={() => isMobile && setSidebarOpen(false)}
  >
    💳 Coupons
  </Link>
  <Link 
    to="/admin/contact" 
    style={styles.navItem} 
    onClick={() => isMobile && setSidebarOpen(false)}
  >
    📧 Contact
  </Link>

  <button 
    onClick={() => { handleLogout(); isMobile && setSidebarOpen(false); }} 
    style={{ 
      ...styles.navItem, 
      background: 'none', 
      border: 'none', 
      textAlign: 'left', 
      width: '100%', 
      cursor: 'pointer',
      padding: '15px 20px',
    }}
  >
    🔓 Logout
  </button>
</nav>
      </aside>

      {/* Main Content */}
      <main style={{
        ...styles.main,
        marginLeft: !isMobile ? '250px' : '0',
      }}>
        <header style={styles.topHeader}>
          {/* Hamburger for mobile */}
          {isMobile && (
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)} 
              style={styles.menuBtn}
            >
              ☰
            </button>
          )}
          {/* <div style={styles.adminProfile}>
            <span>Welcome, Admin</span>
            <div style={styles.avatar}>A</div>
          </div> */}
        </header>

        <div style={styles.content}>
          <Outlet />
        </div>
      </main>

    </div>
  );
};

const styles = {
  adminWrapper: { display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'Arial, sans-serif' },
  overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 },
  sidebar: { 
    backgroundColor: '#1a3a32', 
    color: '#fff', 
    position: 'fixed', 
    height: '100%', 
    transition: '0.3s', 
    padding: '20px 0', 
    zIndex: 1000,
  },
  logo: { padding: '0 20px 30px', fontSize: '24px', fontWeight: 'bold', color: '#d4af37', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  logoSub: { fontSize: '12px', display: 'block', color: '#fff', opacity: 0.7 },
  nav: { marginTop: '20px' },
  navItem: { display: 'block', padding: '15px 20px', color: '#fff', textDecoration: 'none', fontSize: '14px' },
  main: { flex: 1, transition: '0.3s' },
  topHeader: { height: '60px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  menuBtn: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' },
  adminProfile: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: { width: '35px', height: '35px', backgroundColor: '#d4af37', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' },
  content: { padding: '30px' },
};

export default VanyaLayout;