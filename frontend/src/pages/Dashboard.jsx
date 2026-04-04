import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";

import simsDashboardFeedback1 from "../assets/sims_dashboard_feedback_1.jpg";
import simsDashboardFeedback2 from "../assets/sims_dashboard_feedback_2.jpg";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchProjects = async () => {
      if (!user?.token) return;
      try {
        const response = await axiosInstance.get("/api/projects", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProjects(response.data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user, navigate]);

  useEffect(() => {
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
      "sims-dashboard-fonts",
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap",
    );
    ensureLink(
      "sims-dashboard-icons",
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap",
    );
  }, []);

  return (
    <div className="w-full text-[#191b22] flex-1 p-6 md:p-10 lg:p-16 min-h-screen bg-[#f3f3fc]">
      <style>
        {`.material-symbols-outlined{font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;} .font-headline{font-family:'Manrope',sans-serif;}`}
      </style>
      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#006a64] font-bold mb-2 block">
            Entrepreneur Workspace
          </span>
          <h1 className="font-headline text-5xl font-extrabold text-[#001736] tracking-tight">
            Overview
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            className="bg-gradient-to-r from-[#001736] to-[#002b5b] text-white px-8 py-4 rounded-lg font-semibold flex items-center gap-3 shadow-lg hover:opacity-90 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              navigate("/create-project");
            }}
          >
            <span className="material-symbols-outlined">add_circle</span>
            Launch New Campaign
          </button>
        </div>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Active projects list */}
        <section className="col-span-12 lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-2 px-2">
            <h3 className="font-headline text-xl font-bold text-[#001736]">
              Active Projects
            </h3>
            <span className="text-xs font-bold text-[#747780] uppercase tracking-widest">
              {projects.length} Total
            </span>
          </div>

          {loading ? (
            <p className="px-2 text-sm text-[#747780]">Loading projects...</p>
          ) : projects.length === 0 ? (
            <p className="px-2 text-sm text-[#747780]">
              No active projects. Start by launching a new campaign!
            </p>
          ) : (
            projects.map((project, index) => {
              const fundingGoal = project.fundingGoal || 1;
              const currentFunding = project.currentFunding || 0;
              const progress = Math.min(
                100,
                Math.round((currentFunding / fundingGoal) * 100),
              );

              return (
                <article
                  key={project._id || index}
                  className="bg-white p-6 rounded-xl flex flex-col md:flex-row gap-6 relative overflow-hidden mb-6 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/project/${project._id || index}`)}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1`} />
                  <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center text-sm text-[#747780]">
                    {project.imageUrl ? (
                      <img
                        alt={`${project.name} visual`}
                        className="w-full h-full object-cover"
                        src={project.imageUrl}
                      />
                    ) : (
                      <span className="font-semibold">No image</span>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-headline text-xl font-bold text-[#001736]">
                            {project.name}
                          </h4>
                          <span
                            className={`px-3 py-1 bg-gray-200 rounded-full text-[10px] font-bold uppercase`}
                          >
                            {project.category}
                          </span>
                          <span
                            className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${
                              project.type === "public"
                                ? "bg-[#e7f7f1] text-[#006f69]"
                                : project.type === "private"
                                  ? "bg-[#e8f0ff] text-[#0f4f8c]"
                                  : "bg-[#fff4dc] text-[#a05f00]"
                            }`}
                          >
                            {project.type || "public"}
                          </span>
                        </div>
                        <p className="text-sm text-[#43474f] line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                      {/* <div className="flex items-center gap-1">
                        <span
                          className="material-symbols-outlined text-[#006a64] text-sm"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span className="font-headline font-bold text-[#001736]">{(4 + (index % 10) * 0.1).toFixed(1)}</span>
                      </div> */}
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[11px] font-bold text-[#747780] uppercase tracking-wider">
                          Funding Progress
                        </span>
                        <span className="font-headline text-sm font-bold text-[#001736]">
                          ${currentFunding.toLocaleString()}{" "}
                          <span className="text-[#747780] font-normal">
                            / ${fundingGoal.toLocaleString()}
                          </span>
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[#ededf6] rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-[#006a64] rounded-full`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>

        {/* Right column: feedback + impact metric */}
        <section className="col-span-12 lg:col-span-4 space-y-6">
          {/* Recent feedback */}
          <div className="bg-white p-6 rounded-xl flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[#001736]">
                forum
              </span>
              <h3 className="font-headline text-xl font-bold text-[#001736]">
                Recent Feedback
              </h3>
            </div>

            <div className="space-y-6 flex-1">
              {/* Comment 1 */}
              <div className="flex gap-4">
                <img
                  alt="Investor avatar"
                  className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
                  src={simsDashboardFeedback1}
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-[#001736]">
                      Elena Rodriguez
                    </span>
                    <span className="text-[10px] text-[#747780] uppercase">
                      Investor
                    </span>
                  </div>
                  <p className="text-xs text-[#43474f] leading-relaxed">
                    "The risk mitigation layer on Quant-X looks promising. Would
                    love to see the stress-test data for Q3."
                  </p>
                  <span className="text-[9px] text-[#c4c6d0] uppercase mt-2 block">
                    2 hours ago • Project: Quant-X
                  </span>
                </div>
              </div>

              {/* Comment 2 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-[#6ef4ea] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-headline text-sm font-bold text-[#006f69]">
                    JS
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-[#001736]">
                      James Sterling
                    </span>
                    <span className="text-[10px] text-[#747780] uppercase">
                      Tech Lead
                    </span>
                  </div>
                  <p className="text-xs text-[#43474f] leading-relaxed">
                    "Updated the documentation for the API endpoints. Deployment
                    scheduled for midnight."
                  </p>
                  <span className="text-[9px] text-[#c4c6d0] uppercase mt-2 block">
                    5 hours ago • Project: Lumina
                  </span>
                </div>
              </div>

              {/* Comment 3 */}
              <div className="flex gap-4">
                <img
                  alt="Investor avatar"
                  className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
                  src={simsDashboardFeedback2}
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-[#001736]">
                      Marcus Thorne
                    </span>
                    <span className="text-[10px] text-[#747780] uppercase">
                      Partner
                    </span>
                  </div>
                  <p className="text-xs text-[#43474f] leading-relaxed">
                    "Eco-Logistics is gaining traction in the Nordics. Let's
                    discuss expansion on Friday."
                  </p>
                  <span className="text-[9px] text-[#c4c6d0] uppercase mt-2 block">
                    Yesterday • Project: Eco-Logistics
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="w-full mt-8 py-3 bg-[#e7e7f0] rounded-lg text-sm font-semibold text-[#001736] hover:bg-[#e1e2eb] transition-colors"
            >
              View All Messages
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
