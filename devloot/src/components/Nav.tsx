import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Nav: React.FC = () => {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const location                  = useLocation();
  const navigate                  = useNavigate();
  const { isAuthed, isAdmin, author, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleSubscribe = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      document.getElementById("subscribe")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      // Wait for navigation then scroll
      setTimeout(() => {
        document.getElementById("subscribe")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      className={`transition-colors ${
        location.pathname === to ? "text-ink font-medium" : "text-muted hover:text-ink"
      }`}
    >
      {label}
    </Link>
  );

  const isTransparent = !scrolled && location.pathname === "/" && !menuOpen;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent ? "" : "bg-cream/95 backdrop-blur-sm border-b border-border"
      }`}>
        <div className="max-w-6xl mx-auto px-8 py-5 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="font-mono text-sm font-medium tracking-widest uppercase text-ink hover:opacity-70 transition-opacity"
            >
              DEV<span className="text-muted">LOOT</span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-6 text-sm font-body">
              {navLink("/archive", "Archive")}
              {navLink("/about", "About")}
              {isAuthed && navLink("/post", "Write")}
              {isAdmin  && navLink("/admin", "Admin")}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {isAuthed ? (
              <>
                <span className="hidden md:block font-mono text-xs text-muted">{author?.name}</span>
                <button
                  onClick={() => { logout(); navigate("/"); }}
                  className="font-mono text-xs border border-border text-muted px-4 py-2 hover:border-ink hover:text-ink transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden md:block font-mono text-xs border border-border text-muted px-4 py-2 hover:border-ink hover:text-ink transition-colors"
                >
                  Sign in
                </Link>
                <button
                  onClick={handleSubscribe}
                  className="bg-ink text-cream text-xs font-mono tracking-wider px-4 py-2 hover:bg-dim transition-colors"
                >
                  SUBSCRIBE
                </button>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden flex flex-col gap-1.5 p-1 ml-2"
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-px bg-ink transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-px bg-ink transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-px bg-ink transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 bg-cream border-b border-border ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}>
          <div className="px-8 py-6 flex flex-col gap-5 text-sm font-body">
            {navLink("/archive", "Archive")}
            {navLink("/about", "About")}
            {isAuthed && navLink("/post", "Write")}
            {isAdmin  && navLink("/admin", "Admin")}
            <div className="border-t border-border pt-5 flex flex-col gap-3">
              {isAuthed ? (
                <>
                  <span className="font-mono text-xs text-muted">{author?.name}</span>
                  <button
                    onClick={() => { logout(); navigate("/"); }}
                    className="font-mono text-xs border border-border text-muted px-4 py-2 hover:border-ink hover:text-ink transition-colors w-fit"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="font-mono text-xs text-muted hover:text-ink transition-colors">
                    Sign in
                  </Link>
                  <button
                    onClick={handleSubscribe}
                    className="bg-ink text-cream text-xs font-mono tracking-wider px-4 py-2 hover:bg-dim transition-colors w-fit"
                  >
                    SUBSCRIBE
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;
