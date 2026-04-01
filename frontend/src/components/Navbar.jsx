import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import simsDashboardAvatar from "../assets/sims_dashboard_avatar.jpg";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
      {/* <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Your apps name
        </Link>

        <div>
          {user ? (
            <>
              <Link to="/tasks" className="mr-4">
                CRUD
              </Link>
              <Link to="/profile" className="mr-4">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-500 px-4 py-2 rounded hover:bg-green-700"
              >
                Register
              </Link>
            </>
          )}
        </div>

      </nav> */}
      {/* Top navigation specific to dashboard */}

      <div className="flex justify-between items-center w-full px-6 py-3 max-w-full">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tight text-blue-950 font-headline">
            SIMS
          </span>
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-blue-900 font-semibold border-b-2 border-blue-900 pb-1 text-sm"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/marketplace")}
            className="text-slate-500 hover:text-blue-800 transition-colors text-sm">
              Marketplace
            </button>
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
              className="w-8 h-8 rounded-full border border-[#e1e2eb] overflow-hidden"
            >
              <img
                alt="User profile avatar"
                className="w-full h-full object-cover"
                src={simsDashboardAvatar}
              />
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
