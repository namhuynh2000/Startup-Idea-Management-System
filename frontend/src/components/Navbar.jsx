import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getAvatarInitials = () => {
    const name = user?.name?.trim();
    if (!name) return 'U';
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  const hideNavbar = ["/login", "/register"].includes(location.pathname);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (hideNavbar) {
    return null;
  }

  return (
    <nav className="bg-white sticky top-0 z-50 w-full">
      {/* Top navigation specific to dashboard */}

      <div className="flex justify-between items-center w-full px-6 py-3 max-w-full cursor-pointer">
        <div className="flex items-center gap-8">
          <span
            onClick={() => {
              navigate(user?.role === 'admin' ? '/admin' : '/dashboard');
            }}
            className="text-xl font-bold tracking-tight text-blue-950 font-headline"
          >
            SIMS
          </span>
          <nav className="hidden md:flex items-center gap-6">
            {user?.role === 'admin' ? (
              <button
                onClick={() => navigate('/admin')}
                className={`font-semibold pb-1 text-sm transition-colors ${
                  location.pathname === '/admin'
                    ? 'text-blue-900 border-b-2 border-blue-900'
                    : 'text-slate-500 hover:text-blue-800'
                }`}
              >
                Admin
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`font-semibold pb-1 text-sm transition-colors ${
                    location.pathname === '/dashboard'
                      ? 'text-blue-900 border-b-2 border-blue-900'
                      : 'text-slate-500 hover:text-blue-800'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/marketplace')}
                  className={`font-semibold pb-1 text-sm transition-colors ${
                    location.pathname === '/marketplace'
                      ? 'text-blue-900 border-b-2 border-blue-900'
                      : 'text-slate-500 hover:text-blue-800'
                  }`}
                >
                  Marketplace
                </button>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#43474f] text-lg">
              search
            </span>
            <input
              className="bg-[#e1e2eb] border-none rounded-md pl-10 pr-4 py-2 text-sm w-64 focus:ring-1 focus:ring-[#006a64]/40 outline-none"
              placeholder="Search ideas..."
              type="text"
            />
          </div>
          <button
            className="p-2 text-slate-500 rounded-full transition-all"
            type="button"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button
            className="p-2 text-slate-500 rounded-full transition-all"
            type="button"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="w-8 h-8 rounded-full border border-[#e1e2eb] overflow-hidden bg-gradient-to-br from-[#006D77] to-[#002B5B] text-white flex items-center justify-center font-bold"
            >
              <span className="text-xs">{getAvatarInitials()}</span>
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-100"
                >
                  Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                    navigate("/login");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-slate-100 h-px w-full" />
    </nav>
  );
};

export default Navbar;
