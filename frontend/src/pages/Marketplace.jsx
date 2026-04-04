import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const Marketplace = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [fundingFilter, setFundingFilter] = useState('All Funding Stages');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/projects', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      // Transform backend projects to marketplace format
      const transformedProjects = response.data.map((project, index) => ({
        id: project._id || index,
        name: project.name,
        description: project.description,
        status: project.type === 'public' ? 'Public' : project.type === 'private' ? 'Private' : 'Hybrid',
        industry: project.category || 'Tech',
        funding: Math.round((project.currentFunding / project.fundingGoal) * 100),
        imageUrl: project.imageUrl,
        type: project.type,
      }));

      setProjects(transformedProjects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    if (!user?.token) {
      navigate('/login');
      return;
    }

    loadProjects();
  }, [user, navigate, loadProjects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const categoryMatch = categoryFilter === 'All Categories' || project.industry === categoryFilter;
      const fundingMatch = fundingFilter === 'All Funding Stages' || true; // Add logic if needed
      return categoryMatch && fundingMatch;
    });
  }, [categoryFilter, fundingFilter, projects]);

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Public':
        return 'bg-[#10B98120] text-[#10B981]';
      case 'Private':
        return 'bg-[#00173620] text-[#001736]';
      case 'Hybrid':
        return 'bg-[#F59E0B20] text-[#F59E0B]';
      default:
        return 'bg-gray-100 text-[#747780]';
    }
  };

  const getFundingBarColor = (type) => {
    switch (type) {
      case 'public':
        return 'bg-[#10B981]';
      case 'private':
        return 'bg-[#001736]';
      case 'hybrid':
        return 'bg-[#F59E0B]';
      default:
        return 'bg-[#006D77]';
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f3fc]">
      <style>
        {`.material-symbols-outlined{font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;} .font-headline{font-family:'Manrope',sans-serif;} .rounded-custom{border-radius:4px;}`}
      </style>

      {/* Main Content */}
      <main className="px-8 py-16 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <span className="text-[10px] uppercase tracking-wider text-[#006a64] font-bold mb-2 block">
            Investment Discovery
          </span>
          <h1 className="font-headline text-5xl font-bold text-[#001736] mb-2">
            Discover the <span className="text-[#006D77]">Next Frontier</span>
          </h1>
          <p className="text-lg text-[#747780]">
            Curated investment opportunities from the world's most innovative founders. Browse, analyze, and connect with the projects shaping the future.
          </p>
        </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-[#e7e7f0] p-8 mb-8">
            <div className="flex flex-col sm:flex-row gap-6 items-end">
              <div className="flex-1">
                <label className="block text-[10px] uppercase tracking-wider font-bold text-[#747780] mb-3">
                  Project Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-custom px-4 py-3 text-sm font-medium"
                >
                  <option>All Categories</option>
                  <option>AI</option>
                  <option>Finance</option>
                  <option>Health</option>
                  <option>Social</option>
                  <option>Environment</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-[10px] uppercase tracking-wider font-bold text-[#747780] mb-3">
                  Funding Stage
                </label>
                <select
                  value={fundingFilter}
                  onChange={(e) => setFundingFilter(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-custom px-4 py-3 text-sm font-medium"
                >
                  <option>All Funding Stages</option>
                  <option>Seed</option>
                  <option>Series A</option>
                  <option>Series B</option>
                  <option>Series C+</option>
                </select>
              </div>

              <div className="flex gap-1 bg-gray-50 rounded-custom p-1">
                {['grid', 'list'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-4 py-2 rounded-custom text-sm font-medium transition ${
                      viewMode === mode
                        ? 'bg-[#001736] text-white shadow-sm'
                        : 'text-[#747780] hover:text-[#001736]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {mode === 'grid' ? 'grid_view' : 'list'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-[#e7e7f0] p-20 text-center">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006D77] mx-auto"></div>
                <p className="mt-4 text-[#747780] font-medium">Loading projects...</p>
              </div>
            </div>
          ) : displayedProjects.length > 0 ? (
            <div className={`grid gap-8 mb-12 ${
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
            }`}>
              {displayedProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white border border-[#e7e7f0] border-l-4 rounded-2xl overflow-hidden"
                  style={{ borderLeftColor: getFundingBarColor(project.type) }}
                >
                  <div className="p-8">
                    {/* Project Image */}
                    <div className="mb-6 rounded-lg overflow-hidden h-40 bg-gray-100 flex items-center justify-center text-sm text-[#747780]">
                      {project.imageUrl ? (
                        <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-semibold">No image</span>
                      )}
                    </div>

                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeColor(project.status)}`}>
                        {project.status}
                      </span>
                      {/* <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-xs font-bold text-[#001736]">{project.stars}</span>
                      </div> */}
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-2xl font-bold text-[#001736] font-headline mb-3">
                      {project.name}
                    </h3>
                    <p className="text-sm text-[#747780] mb-8 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Funding Progress */}
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-[#747780]">
                          Funding Progress
                        </span>
                        <span className="text-sm font-bold text-[#001736]">{project.funding}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getFundingBarColor(project.type)}`}
                          style={{ width: `${project.funding}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-[#747780] uppercase">
                        {project.industry}
                      </span>
                      <button
                        // onClick={() => navigate(`/project/${project.id}`)}
                        className="flex items-center gap-2 text-[#006D77] text-sm font-bold hover:gap-3 transition-all group"
                      >
                        Analyze{' '}
                        <span className="material-symbols-outlined text-base transform group-hover:translate-x-1 transition">
                          arrow_forward
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#e7e7f0] p-20 text-center">
              <p className="text-[#747780] font-medium">No projects found matching your filters</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white rounded-2xl border border-[#e7e7f0] p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <p className="text-sm text-[#747780]">
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProjects.length)} of{' '}
                  {filteredProjects.length} results
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-3 border border-gray-200 rounded-custom hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-custom text-sm font-bold transition-colors ${
                        currentPage === page
                          ? 'bg-[#001736] text-white'
                          : 'border border-gray-200 text-[#747780] hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-3 border border-gray-200 rounded-custom hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    );
};

export default Marketplace;
