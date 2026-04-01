import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const CreateProject = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projectName, setProjectName] = useState('');
  const [category, setCategory] = useState('AI');
  const [description, setDescription] = useState('');
  const [fundingGoal, setFundingGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!user?.token) {
      alert('Please login first');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await axiosInstance.post(
        '/api/projects',
        {
          name: projectName,
          category,
          description,
          fundingGoal: Number(fundingGoal),
          startDate,
          endDate,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      alert('Project created successfully!');
      console.log('Created project', response.data);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fundingProgress = Math.min(100, Math.round((Number(fundingGoal) ? 12000 / Number(fundingGoal) : 0) * 100));

  return (
    <div className="min-h-screen bg-[#f3f3fc] p-6 md:p-10">
      <style>
        {`.material-symbols-outlined{font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;} .font-headline{font-family:'Manrope',sans-serif;}`}
      </style>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#006a64] font-bold mb-2 block">
              Entrepreneur Workspace
            </span>
            <h1 className="font-headline text-5xl font-extrabold text-[#001736] tracking-tight">
              Create Project
            </h1>
            <p className="text-sm text-[#747780] mt-1">
              Set up a new campaign, define goal and schedule, then launch to your investor network.
            </p>
          </div>
          <button
            type="button"
            className="bg-gradient-to-r from-[#001736] to-[#002b5b] text-white px-7 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:opacity-90 transition-opacity"
            onClick={() => navigate('/dashboard')}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-[#e7e7f0] p-6 md:p-8">
            <h2 className="font-headline text-2xl font-bold text-[#001736] mb-4">Campaign details</h2>
            {error && <div className="text-sm text-[#c22] bg-[#ffe5e5] border border-[#f3c2c2] p-3 rounded mb-4">{error}</div>}
            <form className="space-y-5" onSubmit={handleCreate}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-[#001736] mb-2">Project Name</label>
                  <input
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    type="text"
                    placeholder="Quant-X Algorithm"
                    className="w-full px-4 py-3 bg-[#f8f9fc] border border-[#e7e7f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a64] focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#001736] mb-2">Project Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-[#f8f9fc] border border-[#e7e7f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a64] focus:border-transparent transition-all"
                  >
                    <option>AI</option>
                    <option>Finance</option>
                    <option>Health</option>
                    <option>Social</option>
                    <option>Environment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-[#001736] mb-2">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 bg-[#f8f9fc] border border-[#e7e7f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a64] focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#001736] mb-2">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 bg-[#f8f9fc] border border-[#e7e7f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a64] focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-[#001736] mb-2">Funding Goal ($)</label>
                  <input
                    value={fundingGoal}
                    onChange={(e) => setFundingGoal(e.target.value)}
                    type="number"
                    placeholder="50000"
                    className="w-full px-4 py-3 bg-[#f8f9fc] border border-[#e7e7f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a64] focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#001736] mb-2">Allocated Team</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="10"
                    className="w-full px-4 py-3 bg-[#f8f9fc] border border-[#e7e7f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a64] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#001736] mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="5"
                  placeholder="Describe your project goals, audience, and impact..."
                  className="w-full px-4 py-3 bg-[#f8f9fc] border border-[#e7e7f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a64] focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end items-center gap-3">
                <button
                  type="button"
                  className="px-6 py-3 bg-[#f8f9fc] text-[#43474f] font-semibold rounded-lg hover:bg-[#e7e7f0] transition-colors border border-[#e7e7f0]"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-gradient-to-r from-[#001736] to-[#002b5b] text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-opacity ${isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'}`}
                >
                  {isSubmitting ? 'Creating...' : 'Launch Campaign'}
                </button>
              </div>
            </form>
          </section>

          <aside className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-[#e7e7f0] p-6 md:p-8">
            <h3 className="font-headline text-lg font-bold text-[#001736] mb-4">Project Preview</h3>

            <div className="bg-[#f8f9fc] p-4 rounded-xl border border-[#e7e7f0]">
              <p className="text-xs uppercase tracking-wider text-[#747780] font-bold mb-2">Category</p>
              <h4 className="font-bold text-[#001736] text-xl mb-1">{projectName || 'Untitled Project'}</h4>
              <span className="inline-block px-2 py-1 bg-[#e7eef4] text-[#1b4d82] text-[11px] font-bold rounded-full">{category}</span>

              <p className="text-sm text-[#43474f] mt-3 min-h-[68px]">{description || 'Project description will appear here.'}</p>

              <div className="mt-4 mb-1 text-[11px] font-bold uppercase tracking-wider text-[#747780] flex justify-between">
                <span>Funding goal</span>
                <span>{fundingGoal ? `$${Number(fundingGoal).toLocaleString()}` : '$0'}</span>
              </div>
              <div className="h-2 bg-[#edf2fa] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#001736] to-[#002b5b]"
                  style={{ width: `${fundingProgress}%` }}
                />
              </div>
              <div className="mt-1 text-xs font-semibold text-[#001736]">{fundingProgress}% funded</div>

              <div className="mt-4 text-xs text-[#43474f]">
                <div>
                  <span className="font-semibold text-[#001736]">Start:</span> {startDate || '—'}
                </div>
                <div>
                  <span className="font-semibold text-[#001736]">End:</span> {endDate || '—'}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
