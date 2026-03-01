import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Nav: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthed, isAdmin, author, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || location.pathname !== "/" ? "bg-cream/90 backdrop-blur-sm border-b border-border" : ""
    }`}>
      <div className="max-w-6xl mx-auto px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-mono text-sm font-medium tracking-widest uppercase text-ink hover:opacity-70 transition-opacity">
            DEV<span className="text-muted">LOOT</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-body">
            <Link to="/archive" className={`transition-colors ${location.pathname === "/archive" ? "text-ink font-medium" : "text-muted hover:text-ink"}`}>
              Archive
            </Link>
            <Link to="/about" className={`transition-colors ${location.pathname === "/about" ? "text-ink font-medium" : "text-muted hover:text-ink"}`}>
              About
            </Link>
            {isAuthed && (
              <Link to="/post" className={`transition-colors ${location.pathname === "/post" ? "text-ink font-medium" : "text-muted hover:text-ink"}`}>
                Write
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className={`transition-colors ${location.pathname === "/admin" ? "text-ink font-medium" : "text-muted hover:text-ink"}`}>
                Admin
              </Link>
            )}
          </div>
        </div>

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
              <Link to="/login" className="hidden md:block font-mono text-xs border border-border text-muted px-4 py-2 hover:border-ink hover:text-ink transition-colors">
                Sign in
              </Link>
              <Link to="/#subscribe" className="bg-ink text-cream text-xs font-mono tracking-wider px-4 py-2 hover:bg-dim transition-colors">
                SUBSCRIBE
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
