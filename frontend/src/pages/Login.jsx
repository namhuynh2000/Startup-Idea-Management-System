import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";

import simsLoginBg from "../assets/sims_login_bg.jpg";
import simsLoginPortrait1 from "../assets/sims_login_portrait_1.jpg";
import simsLoginPortrait2 from "../assets/sims_login_portrait_2.jpg";
import simsLoginPortrait3 from "../assets/sims_login_portrait_3.jpg";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Load fonts + Material Symbols icons (as in Stitch export).
    const head = document.head;

    const ensureLink = (id, href) => {
      if (document.getElementById(id)) return;
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = href;
      head.appendChild(link);
    };

    ensureLink(
      "sims-fonts",
      "https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&family=Inter:wght@400;600;700&display=swap",
    );
    ensureLink(
      "sims-material-symbols",
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap",
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/api/auth/login", formData);
      login(response.data);
      navigate("/dashboard");
    } catch (error) {
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="bg-[#f9f9ff] text-[#191b22] antialiased min-h-screen font-sans">
      <style>
        {`.material-symbols-outlined{font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;}`}
      </style>

      <main className="flex min-h-screen overflow-hidden">
        <section className="hidden lg:grid lg:grid-rows-5 lg:w-1/2 relative flex-col p-16 bg-[#001736] overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              alt="Abstract Intelligence"
              className="w-full h-full object-cover opacity-60"
              src={simsLoginBg}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#001736] via-[#001736]/80 to-transparent" />
          </div>

          <div className="relative z-10 row-span-1">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black tracking-tighter text-white">
                SIMS
              </span>
            </div>
          </div>

          <div className="relative z-10 max-w-lg row-span-4">
            <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
              Curating the Future of{" "}
              <span className="text-[#72f7ed]">Startup Intelligence</span>.
            </h1>
            <p className="text-[#d6e3ff] text-lg font-light leading-relaxed mb-8">
              Access our high-end editorial gallery for startup management.
              Manage, track, and score ideas with institutional precision.
            </p>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <img
                  alt="portrait 1"
                  className="w-10 h-10 rounded-full border-2 border-[#001736] object-cover"
                  src={simsLoginPortrait1}
                />
                <img
                  alt="portrait 2"
                  className="w-10 h-10 rounded-full border-2 border-[#001736] object-cover"
                  src={simsLoginPortrait2}
                />
                <img
                  alt="portrait 3"
                  className="w-10 h-10 rounded-full border-2 border-[#001736] object-cover"
                  src={simsLoginPortrait3}
                />
              </div>
              <span className="text-[#a9c7ff] text-sm tracking-wide font-bold">
                Trusted by 500+ Partners
              </span>
            </div>

            <div className="relative z-10 flex gap-8 mt-10">
              <div>
                <span className="block text-2xl font-bold text-white tracking-tight">
                  1.2B+
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-[#d6e3ff]">
                  CAPITAL ANALYZED
                </span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-white tracking-tight">
                  14k
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-[#d6e3ff]">
                  IDEAS SCORED
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-24 bg-[#f9f9ff]">
          <div className="w-full max-w-md space-y-10">
            <div className="lg:hidden mb-12">
              <span className="text-2xl font-black tracking-tighter text-[#001736]">
                SIMS
              </span>
            </div>

            <div className="space-y-3">
              <span className="font-bold text-[11px] text-[#006a64] uppercase tracking-[0.2em]">
                Institutional Access
              </span>
              <h2 className="text-4xl font-extrabold text-[#191b22] tracking-tight">
                Welcome Back
              </h2>
              <p className="text-[#43474f] text-sm">
                Please enter your credentials to access the SIMS editorial
                dashboard.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label
                  className="block font-bold text-[10px] text-[#43474f] uppercase tracking-wider"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#747780]">
                    <span className="material-symbols-outlined text-[20px]">
                      mail
                    </span>
                  </div>
                  <input
                    className="block w-full pl-11 pr-4 py-4 bg-[#e1e2eb] border-none rounded-xl focus:ring-2 focus:ring-[#006a64]/40 focus:bg-[#f3f3fc] transition-all text-[#191b22] placeholder-[#c4c6d0]/50 text-sm"
                    id="email"
                    name="email"
                    placeholder="name@organization.com"
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    className="block font-bold text-[10px] text-[#43474f] uppercase tracking-wider"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-[10px] font-bold text-[#006a64] uppercase tracking-wider hover:text-[#006f69] transition-colors"
                    onClick={() =>
                      alert("Forgot password is not implemented in this demo.")
                    }
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#747780]">
                    <span className="material-symbols-outlined text-[20px]">
                      lock
                    </span>
                  </div>
                  <input
                    className="block w-full pl-11 pr-4 py-4 bg-[#e1e2eb] border-none rounded-xl focus:ring-2 focus:ring-[#006a64]/40 focus:bg-[#f3f3fc] transition-all text-[#191b22] placeholder-[#c4c6d0]/50 text-sm"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center ">
                <input
                  className="h-4 w-4 rounded border-[#c4c6d0]/40 text-[#006a64] focus:ring-[#006a64] bg-[#ededf6]"
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label
                  className="ml-3 block text-sm text-[#43474f]"
                  htmlFor="remember-me"
                >
                  Remember me
                </label>
              </div>

              <div className="pt-2">
                <button
                  className="w-full flex justify-center items-center gap-2 py-4 px-6 bg-gradient-to-r from-[#001736] to-[#002b5b] text-white font-bold text-[13px] uppercase tracking-widest rounded-xl hover:shadow-lg active:scale-[0.98] transition-all"
                  type="submit"
                >
                  Sign In
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </button>
              </div>
            </form>

            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-[#c4c6d0]/20" />
              <span className="flex-shrink mx-4 text-[10px] text-[#747780] uppercase tracking-widest font-bold">
                or continue with
              </span>
              <div className="flex-grow border-t border-[#c4c6d0]/20" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                className="flex items-center justify-center gap-3 py-3 px-4 bg-[#ffffff] rounded-xl border border-[#c4c6d0]/20 hover:bg-[#f3f3fc] transition-colors"
                type="button"
                onClick={() =>
                  alert("Google SSO is not implemented in this demo.")
                }
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  ></path>
                </svg>
                <span className="text-xs font-bold uppercase tracking-tight text-[#43474f]">
                  Google
                </span>
              </button>

              <button
                className="flex items-center justify-center gap-3 py-3 px-4 bg-[#ffffff] rounded-xl border border-[#c4c6d0]/20 hover:bg-[#f3f3fc] transition-colors"
                type="button"
                onClick={() => alert("SSO is not implemented in this demo.")}
              >
                <svg
                  className="w-5 h-5 text-[#191b22]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"></path>
                </svg>
                <span className="text-xs font-bold uppercase tracking-tight text-[#43474f]">
                  SSO
                </span>
              </button>
            </div>

            <div className="pt-8 text-center">
              <p className="text-sm text-[#43474f]">
                New to the platform?{" "}
                <button
                  type="button"
                  className="ml-1 font-bold text-[#006a64] uppercase tracking-wider hover:underline underline-offset-4"
                  onClick={() => navigate("/register")}
                >
                  Sign up instead
                </button>
              </p>
            </div>

            {/* <footer className="pt-12 flex justify-center gap-6">
              <button
                type="button"
                className="font-bold text-[10px] text-[#747780] uppercase tracking-[0.15em] hover:text-[#006a64] transition-colors"
                onClick={() => alert('Privacy is not implemented in this demo.')}
              >
                Privacy
              </button>
              <button
                type="button"
                className="font-bold text-[10px] text-[#747780] uppercase tracking-[0.15em] hover:text-[#006a64] transition-colors"
                onClick={() => alert('Terms is not implemented in this demo.')}
              >
                Terms
              </button>
              <button
                type="button"
                className="font-bold text-[10px] text-[#747780] uppercase tracking-[0.15em] hover:text-[#006a64] transition-colors"
                onClick={() => alert('Support is not implemented in this demo.')}
              >
                Support
              </button>
            </footer> */}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;
