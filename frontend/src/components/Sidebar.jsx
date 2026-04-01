import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const hideSidebar = ["/login", "/register"].includes(location.pathname);

    if (hideSidebar) {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <aside className="h-screen w-64 fixed left-0 top-0 bg-slate-50 hidden md:block pt-16 z-30">
            <div className="flex flex-col h-full p-4 gap-2">
                <div className="mb-6 px-4">
                    <h2 className="font-headline font-semibold text-lg text-blue-950">Project Hub</h2>
                    <p className="text-xs text-slate-500">Managing 4 Ideas</p>
                </div>

                <nav className="space-y-1">
                    <button
                        type="button"
                        className="w-full flex items-center gap-3 bg-white text-[#006a64] rounded-lg px-4 py-3 shadow-sm"
                    >
                        <span
                            className="material-symbols-outlined"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                            lightbulb
                        </span>
                        <span className="text-sm font-medium">My Projects</span>
                    </button>

                    <button
                        type="button"
                        className="w-full flex items-center gap-3 text-slate-600 px-4 py-3 hover:translate-x-1 transition-transform hover:bg-slate-200/50"
                    >
                        <span className="material-symbols-outlined">group</span>
                        <span className="text-sm font-medium">Team</span>
                    </button>

                    <button
                        type="button"
                        className="w-full flex items-center gap-3 text-slate-600 px-4 py-3 hover:translate-x-1 transition-transform hover:bg-slate-200/50"
                    >
                        <span className="material-symbols-outlined">payments</span>
                        <span className="text-sm font-medium">Funding</span>
                    </button>

                    <button
                        type="button"
                        className="w-full flex items-center gap-3 text-slate-600 px-4 py-3 hover:translate-x-1 transition-transform hover:bg-slate-200/50"
                    >
                        <span className="material-symbols-outlined">insights</span>
                        <span className="text-sm font-medium">Analytics</span>
                    </button>

                    <button
                        type="button"
                        className="w-full flex items-center gap-3 text-slate-600 px-4 py-3 hover:translate-x-1 transition-transform hover:bg-slate-200/50"
                    >
                        <span className="material-symbols-outlined">mail</span>
                        <span className="text-sm font-medium">Messages</span>
                    </button>
                </nav>

                <div className="mt-auto space-y-1 border-t border-slate-200 pt-4">
                    <button
                        type="button"
                        className="w-full flex items-center gap-3 text-slate-600 px-4 py-3 hover:translate-x-1 transition-transform hover:bg-slate-200/50"
                    >
                        <span className="material-symbols-outlined">help</span>
                        <span className="text-sm font-medium">Help Center</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 text-slate-600 px-4 py-3 hover:translate-x-1 transition-transform hover:bg-slate-200/50"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
