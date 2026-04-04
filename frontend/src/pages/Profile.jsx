import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Fetch profile data from the backend
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setFormData({
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone || '',
          address: response.data.address || '',
          bio: response.data.bio || '',
        });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setHasChanges(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.put('/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setHasChanges(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelChanges = () => {
    window.location.reload();
  };

  if (loading && Object.keys(formData).every(k => !formData[k] && formData[k] !== true)) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  const getRoleBadgeColor = () => {
    if (!user?.role) return 'bg-gray-100 text-gray-600';
    switch (user.role.toLowerCase()) {
      case 'entrepreneur':
        return 'bg-cyan-400 text-white';
      case 'investor':
        return 'bg-blue-500 text-white';
      case 'admin':
        return 'bg-purple-600 text-white';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getRoleLabel = () => {
    if (!user?.role) return 'User';
    return `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} — Premium`;
  };

  return (
    <div className="min-h-screen bg-[#f3f3fc]">
      <style>
        {`.material-symbols-outlined{font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;} .font-headline{font-family:'Manrope',sans-serif;}`}
      </style>

      {/* Header Section */}
      <div className=" border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="text-xs uppercase tracking-widest font-bold text-teal-600 mb-2">
            Account Configuration
          </p>
          <h1 className="font-headline text-5xl font-bold text-[#001736] mb-4">
            Profile Settings
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Manage your institutional presence, professional credentials, and public visibility within the SIMS network.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Avatar & Bio */}
          <div className="lg:col-span-1">
            {/* Identity Avatar Card */}
            <div className="bg-white rounded-lg shadow-sm border-l-4 border-teal-600 p-8 h-full">
              <p className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-6">
                Identity Avatar
              </p>

              {/* Avatar */}
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center text-white font-bold text-4xl">
                  {formData.name.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Name */}
              <h3 className="text-center font-bold text-[#001736] mb-3">
                {formData.name}
              </h3>

              {/* Role Badge */}
              <div className="flex justify-center mb-6">
                <div className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wide ${getRoleBadgeColor()}`}>
                  {getRoleLabel()}
                </div>
              </div>

              {/* Change Photo Link */}
              <button
                type="button"
                className="w-full text-center text-teal-600 font-bold hover:text-teal-700 py-2 transition"
              >
                Change Profile Photo
              </button>
              <p className="text-center text-xs text-gray-400 mt-2">JPG, PNG or SVG. Max 5MB</p>
            </div>

            
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
              {/* Personal Information */}
              <h2 className="font-headline text-2xl font-bold text-[#001736] mb-2">
                Personal Information
              </h2>
              <p className="text-gray-600 mb-8">
                Update your core account details and contact preferences.
              </p>

              {/* Two Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Full Legal Name */}
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-gray-600 mb-3">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition"
                  />
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-gray-600 mb-3">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 012-3456"
                    className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-gray-600 mb-3">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main St, City, Country"
                    className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition"
                  />
                  <p className="text-xs text-gray-400 mt-1">Address is used for corporate profile data</p>
                </div>


              </div>



              {/* Action Buttons */}
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={handleCancelChanges}
                  className="px-8 py-3 border border-gray-300 rounded font-bold text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel Changes
                </button>
                <button
                  type="submit"
                  disabled={!hasChanges || loading}
                  className="px-8 py-3 bg-[#001736] text-white rounded font-bold hover:bg-blue-950 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
