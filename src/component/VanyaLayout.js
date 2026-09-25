import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Tags,
  Package,
  Image,
  ShoppingCart,
  TicketPercent,
  QrCode,
  Mail,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Store,
} from "lucide-react";

const VanyaLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const navigate = useNavigate();
  const location = useLocation();

  // --------------------------------------------------
  // RESPONSIVE SCREEN DETECTION
  // --------------------------------------------------
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem("admin");
    alert("Logged out successfully!");
    navigate("/login");
  };

  // --------------------------------------------------
  // NAVIGATION ITEMS
  // --------------------------------------------------
  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Manage Categories",
      path: "/admin/categories",
      icon: Tags,
    },
    {
      name: "Manage Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      name: "Banner Management",
      path: "/admin/banner",
      icon: Image,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      name: "Coupons",
      path: "/admin/coupons",
      icon: TicketPercent,
    },
    {
      name: "QR Code Settings",
      path: "/admin/onlinepaymentssettings",
      icon: QrCode,
    },
    {
      name: "Contact",
      path: "/admin/contact",
      icon: Mail,
    },
  ];

  // --------------------------------------------------
  // ACTIVE LINK
  // --------------------------------------------------
  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }

    return location.pathname.startsWith(path);
  };

  // --------------------------------------------------
  // CLOSE SIDEBAR ON MOBILE
  // --------------------------------------------------
  const handleNavigation = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div style={styles.adminWrapper}>

      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}
      {isMobile && isSidebarOpen && (
        <div
          style={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}
      <aside
        style={{
          ...styles.sidebar,
          left: isMobile
            ? isSidebarOpen
              ? "0"
              : "-280px"
            : "0",
        }}
      >

        {/* LOGO */}
        <div style={styles.logoSection}>
          <div style={styles.logoIcon}>
            <Store size={22} strokeWidth={2} />
          </div>

          <div>
            <div style={styles.logo}>
              Vanya Collection
            </div>

            <div style={styles.logoSub}>
              ADMIN PANEL
            </div>
          </div>

          {/* MOBILE CLOSE */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={styles.closeBtn}
            >
              <X size={22} />
            </button>
          )}
        </div>

        {/* DIVIDER */}
        <div style={styles.divider} />

        {/* NAVIGATION */}
        <nav style={styles.nav}>

          <div style={styles.menuLabel}>
            MANAGEMENT
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavigation}
                style={{
                  ...styles.navItem,
                  ...(active ? styles.activeNavItem : {}),
                }}
              >

                {/* ACTIVE INDICATOR */}
                {active && (
                  <span style={styles.activeIndicator} />
                )}

                <div
                  style={{
                    ...styles.navIcon,
                    ...(active
                      ? styles.activeNavIcon
                      : {}),
                  }}
                >
                  <Icon
                    size={19}
                    strokeWidth={active ? 2.4 : 2}
                  />
                </div>

                <span style={styles.navText}>
                  {item.name}
                </span>

                {active && (
                  <ChevronRight
                    size={16}
                    style={styles.arrow}
                  />
                )}
              </Link>
            );
          })}

        </nav>

        {/* =====================================================
            SIDEBAR BOTTOM
        ===================================================== */}
        <div style={styles.sidebarBottom}>

          <div style={styles.bottomDivider} />

          <button
            onClick={() => {
              handleLogout();

              if (isMobile) {
                setSidebarOpen(false);
              }
            }}
            style={styles.logoutBtn}
          >
            <div style={styles.logoutIcon}>
              <LogOut size={19} />
            </div>

            <span>
              Logout
            </span>
          </button>

          <div style={styles.version}>
            Vanya Admin • v1.0
          </div>

        </div>

      </aside>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <main
        style={{
          ...styles.main,
          marginLeft: !isMobile ? "260px" : "0",
        }}
      >

        {/* =====================================================
            TOP HEADER
        ===================================================== */}
        <header style={styles.topHeader}>

          <div style={styles.headerLeft}>

            {/* MOBILE MENU */}
            {isMobile && (
              <button
                onClick={() =>
                  setSidebarOpen(!isSidebarOpen)
                }
                style={styles.menuBtn}
                aria-label="Open menu"
              >
                {isSidebarOpen ? (
                  <X size={24} />
                ) : (
                  <Menu size={24} />
                )}
              </button>
            )}

            <div style={styles.headerTitle}>
              Vanya Admin
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div style={styles.headerRight}>

            <div style={styles.adminInfo}>

              <div style={styles.adminAvatar}>
                A
              </div>

              <div style={styles.adminText}>
                <span style={styles.adminName}>
                  Admin
                </span>

                <span style={styles.adminRole}>
                  Administrator
                </span>
              </div>

            </div>

          </div>

        </header>

        {/* =====================================================
            PAGE CONTENT
        ===================================================== */}
        <div style={styles.content}>
          <Outlet />
        </div>

      </main>

    </div>
  );
};

// ============================================================
// STYLES
// ============================================================

const styles = {

  // MAIN WRAPPER
  adminWrapper: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f7f7f5",
    fontFamily:
      "'Inter', 'Segoe UI', Arial, sans-serif",
  },

  // OVERLAY
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    zIndex: 999,
    backdropFilter: "blur(2px)",
  },

  // SIDEBAR
  sidebar: {
    position: "fixed",
    top: 0,
    bottom: 0,
    width: "260px",
    backgroundColor: "#183B32",
    color: "#ffffff",
    zIndex: 1000,
    transition:
      "left 0.28s ease",
    display: "flex",
    flexDirection: "column",
    boxShadow:
      "4px 0 20px rgba(0,0,0,0.12)",
    overflowY: "auto",
  },

  // LOGO SECTION
  logoSection: {
    minHeight: "82px",
    padding: "0 18px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  logoIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    backgroundColor: "#D4AF37",
    color: "#183B32",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  logo: {
  fontSize: "18px",
  fontWeight: "800",
  letterSpacing: "1.5px",
  color: "#D4AF37",
  lineHeight: "22px",
  whiteSpace: "nowrap",
},

  logoSub: {
    fontSize: "9px",
    letterSpacing: "2px",
    color: "rgba(255,255,255,0.65)",
    marginTop: "4px",
    fontWeight: "600",
  },

  closeBtn: {
    marginLeft: "auto",
    background: "transparent",
    border: "none",
    color: "#ffffff",
    cursor: "pointer",
    padding: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  divider: {
    height: "1px",
    backgroundColor:
      "rgba(255,255,255,0.10)",
    margin: "0 18px",
  },

  // NAVIGATION
  nav: {
    padding: "20px 12px",
    flex: 1,
  },

  menuLabel: {
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    color: "rgba(255,255,255,0.42)",
    padding: "0 12px 10px",
  },

  navItem: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "100%",
    minHeight: "48px",
    marginBottom: "5px",
    padding: "0 13px",
    boxSizing: "border-box",
    borderRadius: "9px",
    color: "rgba(255,255,255,0.78)",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "500",
    transition:
      "all 0.2s ease",
  },

  activeNavItem: {
    backgroundColor:
      "rgba(212,175,55,0.14)",
    color: "#ffffff",
    fontWeight: "600",
  },

  activeIndicator: {
    position: "absolute",
    left: 0,
    top: "9px",
    bottom: "9px",
    width: "3px",
    borderRadius: "0 4px 4px 0",
    backgroundColor: "#D4AF37",
  },

  navIcon: {
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(255,255,255,0.65)",
    flexShrink: 0,
  },

  activeNavIcon: {
    backgroundColor: "#D4AF37",
    color: "#183B32",
  },

  navText: {
    marginLeft: "8px",
    whiteSpace: "nowrap",
  },

  arrow: {
    marginLeft: "auto",
    color: "#D4AF37",
  },

  // SIDEBAR BOTTOM
  sidebarBottom: {
    padding: "0 12px 18px",
  },

  bottomDivider: {
    height: "1px",
    backgroundColor:
      "rgba(255,255,255,0.10)",
    margin: "0 6px 12px",
  },

  logoutBtn: {
    width: "100%",
    minHeight: "46px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "0 13px",
    background: "transparent",
    border: "none",
    borderRadius: "9px",
    color: "rgba(255,255,255,0.75)",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    textAlign: "left",
  },

  logoutIcon: {
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  version: {
    textAlign: "center",
    marginTop: "12px",
    fontSize: "9px",
    color: "rgba(255,255,255,0.3)",
    letterSpacing: "0.5px",
  },

  // MAIN
  main: {
    flex: 1,
    minWidth: 0,
    transition:
      "margin-left 0.28s ease",
  },

  // HEADER
  topHeader: {
    height: "64px",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 25px",
    borderBottom:
      "1px solid #eeeeea",
    boxSizing: "border-box",
    position: "sticky",
    top: 0,
    zIndex: 900,
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  menuBtn: {
    width: "40px",
    height: "40px",
    backgroundColor: "#f5f5f2",
    border: "1px solid #e5e5df",
    borderRadius: "9px",
    color: "#183B32",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#183B32",
  },

  // ADMIN INFO
  headerRight: {
    display: "flex",
    alignItems: "center",
  },

  adminInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  adminAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#D4AF37",
    color: "#183B32",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "14px",
  },

  adminText: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },

  adminName: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#183B32",
  },

  adminRole: {
    fontSize: "10px",
    color: "#999999",
  },

  // CONTENT
  content: {
    padding: "28px",
    boxSizing: "border-box",
  },
};

export default VanyaLayout;