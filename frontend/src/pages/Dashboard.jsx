import { useEffect } from 'react';

import simsDashboardAvatar from '../assets/sims_dashboard_avatar.jpg';
import simsDashboardProject1 from '../assets/sims_dashboard_project_1.jpg';
import simsDashboardProject2 from '../assets/sims_dashboard_project_2.jpg';
import simsDashboardProject3 from '../assets/sims_dashboard_project_3.jpg';
import simsDashboardFeedback1 from '../assets/sims_dashboard_feedback_1.jpg';
import simsDashboardFeedback2 from '../assets/sims_dashboard_feedback_2.jpg';

const Dashboard = () => {
  useEffect(() => {
    const head = document.head;
    const ensureLink = (id, href) => {
      if (document.getElementById(id)) return;
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = href;
      head.appendChild(link);
    };

    ensureLink(
      'sims-dashboard-fonts',
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap'
    );
    ensureLink(
      'sims-dashboard-icons',
      'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
    );
  }, []);

  return (
    <div className="bg-[#f9f9ff] text-[#191b22] min-h-screen">
      <style>
        {`.material-symbols-outlined{font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;}
          .font-headline{font-family:'Manrope',sans-serif;}`}
      </style>

      {/* Top navigation specific to dashboard */}
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-40 shadow-sm border-b-0 w-full">
        <div className="flex justify-between items-center w-full px-6 py-3 max-w-full">
          <div className="flex items-center gap-8">
            <span className="text-xl font-bold tracking-tight text-blue-950 font-headline">
              SIMS
            </span>
            <nav className="hidden md:flex items-center gap-6">
              <span className="text-blue-900 font-semibold border-b-2 border-blue-900 pb-1 text-sm">
                Dashboard
              </span>
              <span className="text-slate-500 hover:text-blue-800 transition-colors text-sm cursor-default">
                Marketplace
              </span>
              <span className="text-slate-500 hover:text-blue-800 transition-colors text-sm cursor-default">
                Reports
              </span>
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
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-all" type="button">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-all" type="button">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <img
              alt="User profile avatar"
              className="w-8 h-8 rounded-full border border-[#e1e2eb]"
              src={simsDashboardAvatar}
            />
          </div>
        </div>
        <div className="bg-slate-100 h-px w-full" />
      </header>

      <div className="flex min-h-screen">
        {/* Side navigation */}
        <aside className="h-screen w-64 fixed left-0 top-0 bg-slate-50 hidden md:block pt-16">
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
                className="w-full flex items-center gap-3 text-slate-600 px-4 py-3 hover:translate-x-1 transition-transform hover:bg-slate-200/50"
              >
                <span className="material-symbols-outlined">logout</span>
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main canvas */}
        <main className="flex-1 md:ml-64 p-6 md:p-10 lg:p-16 bg-[#f3f3fc] min-h-screen">
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
            <button
              type="button"
              className="bg-gradient-to-r from-[#001736] to-[#002b5b] text-white px-8 py-4 rounded-lg font-semibold flex items-center gap-3 shadow-lg hover:opacity-90 transition-opacity self-start lg:self-auto"
            >
              <span className="material-symbols-outlined">add_circle</span>
              Launch New Campaign
            </button>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Active projects list */}
            <section className="col-span-12 lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between mb-2 px-2">
                <h3 className="font-headline text-xl font-bold text-[#001736]">Active Projects</h3>
                <span className="text-xs font-bold text-[#747780] uppercase tracking-widest">
                  4 Total
                </span>
              </div>

              {/* Project 1 */}
              <article className="bg-white p-6 rounded-xl flex flex-col md:flex-row gap-6 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#006a64]" />
                <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    alt="Quant-X Algorithm visual"
                    className="w-full h-full object-cover"
                    src={simsDashboardProject1}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-headline text-xl font-bold text-[#001736]">
                          Quant-X Algorithm
                        </h4>
                        <span className="px-3 py-1 bg-[#6ef4ea] text-[#006f69] rounded-full text-[10px] font-bold uppercase">
                          Public
                        </span>
                      </div>
                      <p className="text-sm text-[#43474f]">
                        Decentralized risk assessment engine for emerging markets.
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span
                        className="material-symbols-outlined text-[#006a64] text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span className="font-headline font-bold text-[#001736]">4.8</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[11px] font-bold text-[#747780] uppercase tracking-wider">
                        Funding Progress
                      </span>
                      <span className="font-headline text-sm font-bold text-[#001736]">
                        $1.2M <span className="text-[#747780] font-normal">/ $2M</span>
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#ededf6] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#006a64] rounded-full"
                        style={{ width: '60%' }}
                      />
                    </div>
                  </div>
                </div>
              </article>

              {/* Project 2 */}
              <article className="bg-white p-6 rounded-xl flex flex-col md:flex-row gap-6 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#002b5b]" />
                <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    alt="Eco-Logistics visual"
                    className="w-full h-full object-cover"
                    src={simsDashboardProject2}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-headline text-xl font-bold text-[#001736]">
                          Eco-Logistics 2.0
                        </h4>
                        <span className="px-3 py-1 bg-[#002b5b] text-[#d6e3ff] rounded-full text-[10px] font-bold uppercase">
                          Private
                        </span>
                      </div>
                      <p className="text-sm text-[#43474f]">
                        Zero-emission last-mile delivery network using swarm AI.
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span
                        className="material-symbols-outlined text-[#006a64] text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span className="font-headline font-bold text-[#001736]">4.2</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[11px] font-bold text-[#747780] uppercase tracking-wider">
                        Funding Progress
                      </span>
                      <span className="font-headline text-sm font-bold text-[#001736]">
                        $850k <span className="text-[#747780] font-normal">/ $1M</span>
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#ededf6] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#001736] rounded-full"
                        style={{ width: '85%' }}
                      />
                    </div>
                  </div>
                </div>
              </article>

              {/* Project 3 */}
              <article className="bg-white p-6 rounded-xl flex flex-col md:flex-row gap-6 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ffba20]" />
                <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    alt="Lumina SaaS visual"
                    className="w-full h-full object-cover"
                    src={simsDashboardProject3}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-headline text-xl font-bold text-[#001736]">
                          Lumina SaaS
                        </h4>
                        <span className="px-3 py-1 bg-[#ffdea8] text-[#5e4200] rounded-full text-[10px] font-bold uppercase">
                          Hybrid
                        </span>
                      </div>
                      <p className="text-sm text-[#43474f]">
                        Internal automation tools for manufacturing scaling.
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span
                        className="material-symbols-outlined text-[#006a64] text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span className="font-headline font-bold text-[#001736]">3.9</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[11px] font-bold text-[#747780] uppercase tracking-wider">
                        Funding Progress
                      </span>
                      <span className="font-headline text-sm font-bold text-[#001736]">
                        $120k <span className="text-[#747780] font-normal">/ $500k</span>
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#ededf6] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#ffba20] rounded-full"
                        style={{ width: '24%' }}
                      />
                    </div>
                  </div>
                </div>
              </article>
            </section>

            {/* Right column: feedback + impact metric */}
            <section className="col-span-12 lg:col-span-4 space-y-6">
              {/* Recent feedback */}
              <div className="bg-white p-6 rounded-xl h-full flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-[#001736]">forum</span>
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
                        <span className="text-sm font-bold text-[#001736]">Elena Rodriguez</span>
                        <span className="text-[10px] text-[#747780] uppercase">Investor</span>
                      </div>
                      <p className="text-xs text-[#43474f] leading-relaxed">
                        "The risk mitigation layer on Quant-X looks promising. Would love to see
                        the stress-test data for Q3."
                      </p>
                      <span className="text-[9px] text-[#c4c6d0] uppercase mt-2 block">
                        2 hours ago • Project: Quant-X
                      </span>
                    </div>
                  </div>

                  {/* Comment 2 */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-[#6ef4ea] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-headline text-sm font-bold text-[#006f69]">JS</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-[#001736]">James Sterling</span>
                        <span className="text-[10px] text-[#747780] uppercase">Tech Lead</span>
                      </div>
                      <p className="text-xs text-[#43474f] leading-relaxed">
                        "Updated the documentation for the API endpoints. Deployment scheduled for
                        midnight."
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
                        <span className="text-sm font-bold text-[#001736]">Marcus Thorne</span>
                        <span className="text-[10px] text-[#747780] uppercase">Partner</span>
                      </div>
                      <p className="text-xs text-[#43474f] leading-relaxed">
                        "Eco-Logistics is gaining traction in the Nordics. Let's discuss expansion
                        on Friday."
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

              {/* Impact metric card */}
              <div className="bg-[#001736] p-8 rounded-xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#006a64]/10 rounded-full -mr-16 -mt-16" />
                <div className="relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#a9c7ff] block mb-4">
                    Total Idea Impact
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-headline text-6xl font-extrabold tracking-tight">8.4</span>
                    <span className="text-sm text-[#a9c7ff]">/ 10</span>
                  </div>
                  <p className="mt-4 text-xs text-[#a9c7ff] leading-relaxed">
                    Your ecosystem quality is in the top 5% of active entrepreneurs this month.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

