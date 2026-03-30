import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";

import simsPortrait1 from "../assets/sims_register_portrait_1.jpg";
import simsPortrait2 from "../assets/sims_register_portrait_2.jpg";
import simsPortrait3 from "../assets/sims_register_portrait_3.jpg";

const Register = () => {
  const [role, setRole] = useState("entrepreneur");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Load fonts + Material Symbols icons (mirrors the Stitch export).
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
      "sims-register-fonts",
      "https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&family=Inter:wght@400;500;600&display=swap",
    );
    ensureLink(
      "sims-register-icons",
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap",
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend expects { name, email, password }.
      await axiosInstance.post("/api/auth/register", formData);
      alert("Registration successful. Please log in.");
      navigate("/login");
    } catch (error) {
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const note =
    role === "investor"
      ? {
          title: "Investor Note:",
          p1: "Your institutional account will require manual activation by our editorial board (24-48h).",
          p2: "Entrepreneurs: You can start building your first idea pipeline immediately after email verification.",
        }
      : {
          title: "Entrepreneur Note:",
          p1: "You can start building your first idea pipeline immediately after email verification.",
          p2: "Investors: Your institutional account may require manual activation by our editorial board (24-48h).",
        };

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#191b22] flex flex-col">
      <style>
        {`.material-symbols-outlined{font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;}`}
      </style>

      <main className="flex-grow flex items-center justify-center p-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Side: Editorial Content */}
          <div className="lg:col-span-5 space-y-8 space">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#006a64] mb-4 block">
                Editorial Intelligence
              </span>
              <h1
                className="text-[3.5rem] leading-[1.1] font-extrabold text-[#001736] tracking-tight"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                The future of ideas, curated.
              </h1>
            </div>
            <p className="text-[#43474f] text-lg leading-relaxed max-w-md">
              Join an elite ecosystem where visionary entrepreneurs and
              institutional investors bridge the gap between concept and
              capital.
            </p>

            <div className="pt-4 flex items-center gap-4">
              <div className="flex -space-x-3">
                <img
                  className="w-10 h-10 rounded-full border-2 border-[#f9f9ff] shadow-sm object-cover"
                  alt="portrait 1"
                  src={simsPortrait1}
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-[#f9f9ff] shadow-sm object-cover"
                  alt="portrait 2"
                  src={simsPortrait2}
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-[#f9f9ff] shadow-sm object-cover"
                  alt="portrait 3"
                  src={simsPortrait3}
                />
              </div>
              <p className="text-sm font-medium text-[#43474f]">
                Trusted by 500+ Partners
              </p>
            </div>
          </div>

          {/* Right Side: Registration Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-[#ffffff] p-10 rounded-xl shadow-[0px_12px_32px_rgba(25,27,34,0.06)] relative overflow-hidden">
              {/* Accent line */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#006a64]" />

              <div className="relative">
                <div className="mb-10">
                  <h2
                    className="text-2xl font-bold text-[#001736] mb-2"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    Create your account
                  </h2>
                  <p className="text-[#43474f] text-sm">
                    Select your professional path to begin.
                  </p>
                </div>

                <form className="space-y-8" onSubmit={handleSubmit}>
                  {/* Role Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="cursor-pointer group">
                      <input
                        className="peer hidden"
                        name="role"
                        type="radio"
                        value="entrepreneur"
                        checked={role === "entrepreneur"}
                        onChange={() => setRole("entrepreneur")}
                      />
                      <div
                        className={
                          role === "entrepreneur"
                            ? "p-6 rounded-xl bg-[#006f69] text-white"
                            : "p-6 rounded-xl bg-[#f3f3fc] text-[#001736]"
                        }
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className="material-symbols-outlined"
                            style={{
                              fontVariationSettings: "'FILL' 1",
                              color:
                                role === "entrepreneur" ? "#ffffff" : "#006a64",
                            }}
                          >
                            rocket_launch
                          </span>
                          <span className="font-bold">
                            {role === "entrepreneur"
                              ? "Entrepreneur"
                              : "Entrepreneur"}
                          </span>
                        </div>
                        <p className="text-[11px] leading-tight">
                          Launch projects and gain traction immediately.
                        </p>
                      </div>
                    </label>

                    <label className="cursor-pointer group">
                      <input
                        className="peer hidden"
                        name="role"
                        type="radio"
                        value="investor"
                        checked={role === "investor"}
                        onChange={() => setRole("investor")}
                      />
                      <div
                        className={
                          role === "investor"
                            ? "p-6 rounded-xl bg-[#002b5b] text-white"
                            : "p-6 rounded-xl bg-[#f3f3fc] text-[#001736]"
                        }
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className="material-symbols-outlined"
                            style={{
                              fontVariationSettings: "'FILL' 1",
                              color:
                                role === "investor" ? "#ffffff" : "#001736",
                            }}
                          >
                            account_balance
                          </span>
                          <span className="font-bold">Investor</span>
                        </div>
                        <p className="text-[11px] leading-tight">
                          Access curated deals and editorial intelligence.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Fields */}
                  <div className="space-y-5">
                    <div className="group">
                      <label className="block text-[11px] uppercase tracking-wider font-semibold mb-2 text-[#43474f]">
                        Full Name
                      </label>
                      <input
                        className="w-full px-4 py-3 bg-[#e1e2eb] rounded-lg border-none focus:ring-2 focus:ring-[#006a64]/40 placeholder:text-[#c4c6d0] transition-all outline-none"
                        placeholder="Alex Sterling"
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="group">
                      <label className="block text-[11px] uppercase tracking-wider font-semibold mb-2 text-[#43474f]">
                        Phone Number
                      </label>
                      <input
                        className="w-full px-4 py-3 bg-[#e1e2eb] rounded-lg border-none focus:ring-2 focus:ring-[#006a64]/40 placeholder:text-[#c4c6d0] transition-all outline-none"
                        placeholder="123-456-7890"
                        pattern="[0-9]{10}"
                        type="tel"
                        value={formData.phone}
                        maxLength={10}
                        onChange={(e) => {
                          return setFormData({ ...formData, phone: e.target.value });
                        }
                        }
                        required
                      />
                    </div>

                    <div className="group">
                      <label className="block text-[11px] uppercase tracking-wider font-semibold mb-2 text-[#43474f]">
                        Address
                      </label>
                      <input
                        className="w-full px-4 py-3 bg-[#e1e2eb] rounded-lg border-none focus:ring-2 focus:ring-[#006a64]/40 placeholder:text-[#c4c6d0] transition-all outline-none"
                        placeholder="New York"
                        type="text"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                      />
                    </div>

                    <div className="group">
                      <label className="block text-[11px] uppercase tracking-wider font-semibold mb-2 text-[#43474f]">
                        Corporate Email
                      </label>
                      <input
                        className="w-full px-4 py-3 bg-[#e1e2eb] rounded-lg border-none focus:ring-2 focus:ring-[#006a64]/40 placeholder:text-[#c4c6d0] transition-all outline-none"
                        placeholder="alex@sterling-capital.com"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="group">
                      <label className="block text-[11px] uppercase tracking-wider font-semibold mb-2 text-[#43474f]">
                        Security Password
                      </label>
                      <input
                        className="w-full px-4 py-3 bg-[#e1e2eb] rounded-lg border-none focus:ring-2 focus:ring-[#006a64]/40 placeholder:text-[#c4c6d0] transition-all outline-none"
                        placeholder="••••••••••••"
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* Contextual Notes */}
                  <div className="p-4 rounded-lg bg-[#f3f3fc] flex items-start gap-3">
                    <span
                      className="material-symbols-outlined text-[#006a64] text-sm"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      info
                    </span>
                    <div className="space-y-1">
                      <p className="text-[12px] text-[#43474f] leading-relaxed">
                        <span className="font-bold">{note.title}</span>{" "}
                        {note.p1}
                      </p>
                      <p className="text-[12px] text-[#006a64] font-medium italic">
                        {note.p2}
                      </p>
                    </div>
                  </div>

                  <button
                    className="w-full py-4 bg-gradient-to-r from-[#001736] to-[#002b5b] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all active:scale-95 uppercase tracking-widest text-xs disabled:opacity-60"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Intelligence Account"}
                  </button>

                  <p className="mt-8 text-center text-xs text-[#43474f]">
                    By registering, you agree to our{" "}
                    <button
                      type="button"
                      className="underline hover:text-[#006a64] ml-1"
                      onClick={() => alert("Terms not implemented.")}
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      className="underline hover:text-[#006a64] ml-1"
                      onClick={() => alert("Privacy not implemented.")}
                    >
                      Privacy Policy
                    </button>
                    .
                  </p>

                  <div className="pt-8 text-center">
                    <p className="text-sm text-[#43474f]">
                      Already have an account?{" "}
                      <button
                        type="button"
                        className="ml-1 font-bold text-[#006a64] uppercase tracking-wider hover:underline underline-offset-4"
                        onClick={() => navigate("/login")}
                      >
                        Login instead
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
