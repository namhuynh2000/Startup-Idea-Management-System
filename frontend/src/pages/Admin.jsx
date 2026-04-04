import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const Admin = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [deletionRequests, setDeletionRequests] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [activations, setActivations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    capitalRaised: 0,
    deletionRequests: 0,
    investmentDisputes: 0,
    investorActivations: 0,
    systemUptime: 99.98,
  });

  const loadDeletionRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/projects/admin/deletion-requests', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      
      setDeletionRequests(response.data);
      setStats((prev) => ({
        ...prev,
        deletionRequests: response.data.length,
      }));
    } catch (error) {
      console.error('Failed to load deletion requests:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  const loadDisputes = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/auth/admin/disputes', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setDisputes(response.data);
      setStats((prev) => ({
        ...prev,
        investmentDisputes: response.data.length,
      }));
    } catch (error) {
      console.error('Failed to load disputes:', error);
    }
  }, [user?.token]);

  const loadActivations = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/auth/admin/activations', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setActivations(response.data);
      setStats((prev) => ({
        ...prev,
        investorActivations: response.data.length,
      }));
    } catch (error) {
      console.error('Failed to load activations:', error);
    }
  }, [user?.token]);

  useEffect(() => {
    if (!user?.token || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    
    loadDeletionRequests();
    loadDisputes();
    loadActivations();
  }, [user, navigate, loadDeletionRequests, loadDisputes, loadActivations]);

  const handleApproveDeletion = async (projectId) => {
    if (!window.confirm('Are you sure you want to approve this deletion?')) return;
    
    try {
      await axiosInstance.post(`/api/projects/${projectId}/approve-deletion`, {}, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      
      // Remove from list
      setDeletionRequests((prev) => prev.filter((p) => p._id !== projectId));
      toast.success('Project deletion approved');
    } catch (error) {
      console.error('Failed to approve deletion:', error);
      toast.error(error.response?.data?.message || 'Failed to approve deletion');
    }
  };

  const handleRejectDeletion = async (projectId) => {
    if (!window.confirm('Are you sure you want to reject this deletion request?')) return;
    
    try {
      await axiosInstance.post(`/api/projects/${projectId}/reject-deletion`, {}, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      
      // Remove from list
      setDeletionRequests((prev) => prev.filter((p) => p._id !== projectId));
      toast.success('Project deletion rejected');
    } catch (error) {
      console.error('Failed to reject deletion:', error);
      toast.error(error.response?.data?.message || 'Failed to reject deletion');
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      await axiosInstance.post(`/api/auth/admin/activate/${userId}`, {}, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      
      // Remove from activations list
      setActivations((prev) => prev.filter((user) => user._id !== userId));
      setStats((prev) => ({
        ...prev,
        investorActivations: prev.investorActivations - 1,
      }));
      toast.success('User activated successfully');
    } catch (error) {
      console.error('Failed to activate user:', error);
      toast.error(error.response?.data?.message || 'Failed to activate user');
    }
  };


  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-[#f3f3fc]">
      <style>
        {`.material-symbols-outlined{font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;} .font-headline{font-family:'Manrope',sans-serif;}`}
      </style>

      {/* <Navbar /> */}

      {/* Main Content */}
      <main className="px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <span className="text-[10px] uppercase tracking-wider text-[#006a64] font-bold">Admin Dashboard</span>
          <h1 className="font-headline text-5xl font-extrabold text-[#001736] tracking-tight mt-2">
            Command Center
          </h1>
          <p className="text-sm text-[#747780] mt-2">Manage platform integrity, monitor metrics, and resolve disputes</p>
        </div>

        {/* Hero Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl border border-[#e7e7f0] p-8">
            <p className="text-[11px] uppercase tracking-wider text-[#747780] font-bold mb-3">Total Projects</p>
            <h2 className="font-headline text-5xl font-bold text-[#001736]">{stats.totalProjects.toLocaleString()}</h2>
            <p className="text-sm text-[#43474f] mt-2">Active campaigns in the system</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e7e7f0] p-8">
            <p className="text-[11px] uppercase tracking-wider text-[#747780] font-bold mb-3">Capital Raised</p>
            <h2 className="font-headline text-5xl font-bold text-[#006a64]">
              ${(stats.capitalRaised / 1000000).toFixed(1)}M
            </h2>
            <p className="text-sm text-[#43474f] mt-2">Total funding across all projects</p>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Project Deletion Requests - span 2 cols */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e7e7f0] p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#747780] font-bold">Deletion Requests</p>
                <h3 className="font-headline text-2xl font-bold text-[#001736] mt-1">Project Review Queue</h3>
              </div>
              <span className="inline-block px-3 py-1 bg-[#fde7e7] text-[#ba1a1a] text-sm font-bold rounded-full">
                {stats.deletionRequests} Pending
              </span>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-[#747780]">Loading...</p>
              </div>
            ) : deletionRequests.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-[#747780]">No deletion requests</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#f8f9fc] border-b border-[#e7e7f0]">
                      <th className="text-left px-4 py-3 text-sm font-bold text-[#001736]">Project Name</th>
                      <th className="text-left px-4 py-3 text-sm font-bold text-[#001736]">Created By</th>
                      <th className="text-left px-4 py-3 text-sm font-bold text-[#001736]">Reason</th>
                      <th className="text-left px-4 py-3 text-sm font-bold text-[#001736]">Justification</th>
                      <th className="text-left px-4 py-3 text-sm font-bold text-[#001736]">Requested</th>
                      <th className="text-left px-4 py-3 text-sm font-bold text-[#001736]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deletionRequests.map((project) => (
                      <tr key={project._id} className="border-b border-[#e7e7f0] hover:bg-[#f8f9fc] transition">
                        <td className="px-4 py-3 text-sm font-medium text-[#001736]">{project.name}</td>
                        <td className="px-4 py-3 text-sm text-[#747780]">{project.createdBy?.name || 'Unknown'}</td>
                        <td className="px-4 py-3 text-sm text-[#747780]">
                          <span className="inline-block px-2 py-1 bg-[#fde7e7] text-[#ba1a1a] text-xs font-bold rounded">
                            {project.deletionRequestReason || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#747780] max-w-xs truncate" title={project.deletionRequestJustification}>
                          {project.deletionRequestJustification || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#747780]">{formatDate(project.deletionRequestedAt)}</td>
                        <td className="px-4 py-3 text-sm space-x-2 flex items-center">
                          <button
                            onClick={() => handleApproveDeletion(project._id)}
                            className="px-3 py-1 bg-[#006a64] text-white text-xs font-bold rounded hover:opacity-90 transition"
                            title="Approve deletion"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => handleRejectDeletion(project._id)}
                            className="px-3 py-1 bg-[#f3f3fc] text-[#001736] text-xs font-bold rounded hover:bg-[#e7e7f0] transition"
                            title="Reject deletion"
                          >
                            ✕ Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Investment Disputes */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-[#e7e7f0] p-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] uppercase tracking-wider text-[#747780] font-bold">Disputes</p>
              <span className="text-2xl font-bold text-[#ba1a1a]">{stats.investmentDisputes}</span>
            </div>
            <p className="text-sm text-[#43474f] mb-6">Investment conflicts requiring mediation</p>

            <div className="space-y-3 max-h-40 overflow-y-auto">
              {disputes.length > 0 ? disputes.slice(0, 4).map((dispute) => (
                <div key={dispute._id} className="flex items-center justify-between p-2 bg-[#f8f9fc] rounded">
                  <div>
                    <p className="text-sm font-medium text-[#001736]">{dispute.name}</p>
                    <p className="text-xs text-[#747780]">{dispute.email}</p>
                  </div>
                  <button className="px-2 py-1 bg-[#ba1a1a] text-white text-xs font-bold rounded hover:opacity-90">
                    Mediate
                  </button>
                </div>
              )) : (
                <p className="text-sm text-[#747780] text-center py-4">No disputes</p>
              )}
            </div>
          </div>

          {/* Investor Activation Requests */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-[#e7e7f0] p-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] uppercase tracking-wider text-[#747780] font-bold">Activations</p>
              <span className="text-2xl font-bold text-[#006a64]">{stats.investorActivations}</span>
            </div>
            <p className="text-sm text-[#43474f] mb-6">Investor accounts pending verification</p>

            <div className="space-y-3 max-h-40 overflow-y-auto">
              {activations.length > 0 ? activations.slice(0, 4).map((activation) => (
                <div key={activation._id} className="flex items-center justify-between p-2 bg-[#f8f9fc] rounded">
                  <div>
                    <p className="text-sm font-medium text-[#001736]">{activation.name}</p>
                    <p className="text-xs text-[#747780]">{activation.email}</p>
                  </div>
                  <button
                    onClick={() => handleActivateUser(activation._id)}
                    className="px-2 py-1 bg-[#006a64] text-white text-xs font-bold rounded hover:opacity-90"
                  >
                    ✓
                  </button>
                </div>
              )) : (
                <p className="text-sm text-[#747780] text-center py-4">No pending activations</p>
              )}
            </div>
          </div>


        
        </div>
      </main>
    </div>
  );
};

export default Admin;
