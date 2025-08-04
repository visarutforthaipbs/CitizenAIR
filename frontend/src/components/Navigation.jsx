// Navigation component for the main app - Mobile Responsive
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navStyle = {
    backgroundColor: "var(--primary-color)",
    borderBottom: "2px solid var(--border-light)",
    padding: "12px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "'DB Helvethaica X', system-ui, -apple-system, sans-serif",
    position: "relative",
    zIndex: 1000,
    minHeight: "var(--navbar-height-mobile)",
  };

  const logoStyle = {
    fontSize: "20px",
    fontWeight: "900",
    color: "var(--secondary-color)",
    textDecoration: "none",
    zIndex: 1001,
  };

  const desktopNavStyle = {
    display: "flex",
    gap: "24px",
    alignItems: "center",
  };

  const mobileMenuButtonStyle = {
    display: "none",
    background: "none",
    border: "none",
    fontSize: "24px",
    color: "var(--text-primary)",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "8px",
    transition: "background-color 0.2s ease",
    zIndex: 1001,
  };

  const mobileMenuStyle = {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "var(--primary-color)",
    borderBottom: "1px solid var(--border-light)",
    boxShadow: "var(--sketch-shadow-hover)",
    display: "none",
    flexDirection: "column",
    padding: "16px",
    gap: "12px",
    zIndex: 999,
  };

  const linkStyle = {
    textDecoration: "none",
    color: "var(--text-secondary)",
    fontSize: "16px",
    fontWeight: "500",
    padding: "12px 16px",
    borderRadius: "8px",
    transition: "all 0.2s ease",
    minHeight: "var(--touch-target-min)",
    display: "flex",
    alignItems: "center",
  };

  const activeLinkStyle = {
    ...linkStyle,
    color: "var(--secondary-color)",
    backgroundColor: "rgba(254, 80, 0, 0.1)",
  };

  const mobileLinkStyle = {
    ...linkStyle,
    justifyContent: "center",
    borderBottom: "1px solid var(--border-light)",
    borderRadius: 0,
    padding: "16px",
    fontSize: "18px",
  };

  const mobileActiveLinkStyle = {
    ...mobileLinkStyle,
    color: "var(--secondary-color)",
    backgroundColor: "rgba(254, 80, 0, 0.1)",
    borderRadius: "8px",
    borderBottom: "none",
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav style={navStyle}>
        <Link
          to="/"
          style={{ ...logoStyle, display: "flex", alignItems: "center" }}
        >
          <img
            src="/image/logo.svg"
            alt="CitizenAIR"
            style={{ height: "32px", width: "auto" }}
          />
        </Link>

        {/* Desktop Navigation */}
        <div style={desktopNavStyle} className="desktop-nav">
          <Link
            to="/"
            style={location.pathname === "/" ? activeLinkStyle : linkStyle}
          >
            แผนที่คุณภาพอากาศ
          </Link>
          <Link
            to="/solutions"
            style={
              location.pathname === "/solutions" ? activeLinkStyle : linkStyle
            }
          >
            แนวทางแก้ปัญหา
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          style={mobileMenuButtonStyle}
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label="เมนู"
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>

        {/* Mobile Navigation Menu */}
        <div
          style={{
            ...mobileMenuStyle,
            display: isMobileMenuOpen ? "flex" : "none",
          }}
          className="mobile-nav"
        >
          <Link
            to="/"
            style={
              location.pathname === "/"
                ? mobileActiveLinkStyle
                : mobileLinkStyle
            }
            onClick={closeMobileMenu}
          >
            แผนที่คุณภาพอากาศ
          </Link>
          <Link
            to="/solutions"
            style={
              location.pathname === "/solutions"
                ? mobileActiveLinkStyle
                : mobileLinkStyle
            }
            onClick={closeMobileMenu}
          >
            แนวทางแก้ปัญหา
          </Link>
        </div>
      </nav>

      {/* Responsive CSS */}
      <style>{`
        /* Desktop styles (default) */
        @media (min-width: 769px) {
          .mobile-menu-button {
            display: none !important;
          }
          
          .desktop-nav {
            display: flex !important;
          }
          
          nav {
            min-height: var(--navbar-height) !important;
            padding: 16px 24px !important;
          }
          
          nav a {
            font-size: 16px !important;
          }
        }

        /* Mobile and Tablet styles */
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          
          .mobile-menu-button {
            display: block !important;
          }
          
          .mobile-menu-button:hover {
            background-color: var(--light-bg);
          }
          
          nav {
            padding: 12px 16px !important;
          }
          
          nav a:first-child {
            font-size: 18px !important;
          }
        }

        /* Tablet specific adjustments */
        @media (min-width: 481px) and (max-width: 768px) {
          nav {
            padding: 14px 20px !important;
          }
        }

        /* Mobile menu overlay for closing when clicking outside */
        .mobile-nav-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 998;
          display: none;
        }
      `}</style>
    </>
  );
};

export default Navigation;
