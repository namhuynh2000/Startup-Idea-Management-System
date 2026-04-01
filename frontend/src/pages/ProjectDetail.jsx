import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    fundingGoal: '',
    currentFunding: '',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.token) {
      navigate('/login');
      return;
    }

    const loadProject = async () => {
      setLoading(true);
      try {
        const resp = await axiosInstance.get(`/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const p = resp.data;
        setFormData({
          name: p.name || '',
          category: p.category || '',
          description: p.description || '',
          fundingGoal: p.fundingGoal || '',
          currentFunding: p.currentFunding || '',
          startDate: p.startDate ? new Date(p.startDate).toISOString().slice(0, 10) : '',
          endDate: p.endDate ? new Date(p.endDate).toISOString().slice(0, 10) : '',
        });
      } catch (error) {
        alert('Failed to load project details.');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id, user, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.put(
        `/api/projects/${id}`,
        {
          ...formData,
          fundingGoal: Number(formData.fundingGoal),
          currentFunding: Number(formData.currentFunding),
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      alert('Project updated successfully');
    } catch (error) {
      alert('Failed to update project.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await axiosInstance.delete(`/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert('Project deleted');
      navigate('/dashboard');
    } catch (error) {
      alert('Failed to delete project.');
    }
  };

  if (loading) return <div className="text-center mt-20">Loading project...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Edit Project</h1>
      <form onSubmit={handleUpdate} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <label className="block">
          <span className="text-sm font-medium">Name</span>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full border rounded px-3 py-2"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Category</span>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="mt-1 block w-full border rounded px-3 py-2"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Description</span>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full border rounded px-3 py-2"
            required
          />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium">Funding Goal</span>
            <input
              type="number"
              value={formData.fundingGoal}
              onChange={(e) => setFormData({ ...formData, fundingGoal: e.target.value })}
              className="mt-1 block w-full border rounded px-3 py-2"
              required
              min={0}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Current Funding</span>
            <input
              type="number"
              value={formData.currentFunding}
              onChange={(e) => setFormData({ ...formData, currentFunding: e.target.value })}
              className="mt-1 block w-full border rounded px-3 py-2"
              min={0}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium">Start Date</span>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="mt-1 block w-full border rounded px-3 py-2"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">End Date</span>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="mt-1 block w-full border rounded px-3 py-2"
              required
            />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete Project
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="border border-slate-300 px-4 py-2 rounded hover:bg-slate-100"
          >
            Back to Dashboard
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectDetail;
