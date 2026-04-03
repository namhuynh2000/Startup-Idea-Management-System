import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const CreateProject = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projectName, setProjectName] = useState('');
  const [category, setCategory] = useState('AI');
  const [type, setType] = useState('public');
  const [description, setDescription] = useState('');
  const [fundingGoal, setFundingGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');

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

  const compressImage = (base64String, maxWidth = 1200, maxHeight = 800) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64String;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG with quality 0.8
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        resolve(compressedBase64);
      };

      img.onerror = () => {
        resolve(base64String); // Return original if compression fails
      };
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const compressed = await compressImage(reader.result);
          setImageUrl(compressed);
          setImagePreview(compressed);
          toast.success('Image uploaded (compressed for optimal storage)');
        } catch (err) {
          toast.error('Failed to process image');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!user?.token) {
      toast.error('Please login first');
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
          type,
          description,
          fundingGoal: Number(fundingGoal),
          startDate,
          endDate,
          imageUrl: imageUrl || null,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      toast.success('Project created successfully!');
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

              <div>
                <p className="mb-2 text-sm font-bold text-[#001736]">Type</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['public', 'private', 'hybrid'].map((mode) => (
                    <button
                      type="button"
                      key={mode}
                      onClick={() => setType(mode)}
                      className={`rounded-xl border p-4 text-left transition ${
                        type === mode
                          ? 'border-[#002b5b] bg-[#e4f2ff] shadow'
                          : 'border-[#e7e7f0] bg-white hover:border-[#006a64] hover:bg-[#f3f8fd]'
                      }`}
                    >
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#f3f4f6] mb-2">
                        <span className="material-symbols-outlined text-sm">{mode === 'public' ? 'public' : mode === 'private' ? 'lock' : 'layers'}</span>
                      </span>
                      <h3 className="font-bold text-[#001736] capitalize">{mode}</h3>
                      <p className="text-xs text-[#747780] mt-1">
                        {mode === 'public'
                          ? 'Community round, open access and high visibility.'
                          : mode === 'private'
                          ? 'Secure, invite-only investment channel.'
                          : 'Hybrid capital strategy with institutional and community mix.'}
                      </p>
                    </button>
                  ))}
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

              <div>
                <label className="block text-sm font-bold text-[#001736] mb-2">Project Image</label>
                <div className="mb-4 rounded-lg overflow-hidden max-w-xs bg-white relative">
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Project"
                        className="w-full h-40 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => { setImageUrl(''); setImagePreview(''); }}
                        className="absolute top-2 right-2 bg-white text-[#ba1a1a] border border-[#f3c2c2] rounded-full p-1 hover:bg-[#fde7e7] transition"
                        aria-label="Remove image"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <div className="h-40 grid place-items-center text-[#747780] text-sm font-medium border border-dashed border-[#e7e7f0]">
                      No image selected
                    </div>
                  )}
                </div>
                <div className="border-2 border-dashed border-[#e7e7f0] rounded-lg p-6 text-center hover:border-[#006a64] transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-input"
                  />
                  <label htmlFor="image-input" className="cursor-pointer">
                    <span className="material-symbols-outlined text-4xl text-[#006a64] mb-2 block">image</span>
                    <p className="text-sm font-semibold text-[#001736]">Click to upload image</p>
                    <p className="text-xs text-[#747780] mt-1">PNG, JPG up to 5MB (will be compressed automatically)</p>
                  </label>
                </div>
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

           <div className="mb-4 rounded-xl overflow-hidden border border-[#e7e7f0] bg-white">
              {imagePreview ? (
                <div>
                  <img
                    src={imagePreview}
                    alt="Project preview"
                    className="w-full h-40 object-cover"
                  />
                </div>
              ) : (
                <div className="h-40 grid place-items-center text-[#747780] text-sm font-medium bg-[#f8f9fc]">
                  No image selected
                </div>
              )}
            </div>

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
