import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    type: "public",
    description: "",
    fundingGoal: "",
    currentFunding: "",
    startDate: "",
    endDate: "",
    imageUrl: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletionReason, setDeletionReason] = useState("");
  const [deletionJustification, setDeletionJustification] = useState("");
  const [deletionAcknowledged, setDeletionAcknowledged] = useState(false);
  const [submittingDeletion, setSubmittingDeletion] = useState(false);

  useEffect(() => {
    if (!user?.token) {
      navigate("/login");
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
          name: p.name || "",
          category: p.category || "",
          type: p.type || "public",
          description: p.description || "",
          fundingGoal: p.fundingGoal || "",
          currentFunding: p.currentFunding || "",
          startDate: p.startDate
            ? new Date(p.startDate).toISOString().slice(0, 10)
            : "",
          endDate: p.endDate
            ? new Date(p.endDate).toISOString().slice(0, 10)
            : "",
          imageUrl: p.imageUrl || "",
        });
        setImagePreview(p.imageUrl || "");
      } catch (error) {
        toast.error("Failed to load project details.");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id, user, navigate]);

  const compressImage = (base64String, maxWidth = 1200, maxHeight = 800) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64String;

      img.onload = () => {
        const canvas = document.createElement("canvas");
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

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG with quality 0.8
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);
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
        toast.error("Image size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const compressed = await compressImage(reader.result);
          setFormData({ ...formData, imageUrl: compressed });
          setImagePreview(compressed);
          toast.success("Image uploaded (compressed for optimal storage)");
        } catch (err) {
          toast.error("Failed to process image");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.put(
        `/api/projects/${id}`,
        {
          ...formData,
          type: formData.type,
          fundingGoal: Number(formData.fundingGoal),
          currentFunding: Number(formData.currentFunding),
          imageUrl: formData.imageUrl,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );
      toast.success("Project updated successfully");
    } catch (error) {
      toast.error("Failed to update project.");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitDeletion = async (e) => {
    e.preventDefault();

    if (!deletionReason || !deletionJustification || !deletionAcknowledged) {
      toast.error("Please fill all fields and acknowledge the action");
      return;
    }

    setSubmittingDeletion(true);
    try {
      await axiosInstance.post(
        `/api/projects/${id}/request-deletion`,
        {
          reason: deletionReason,
          justification: deletionJustification,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );
      toast.success("Deletion request submitted to admin for review");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit deletion request.",
      );
    } finally {
      setSubmittingDeletion(false);
    }
  };

  if (loading)
    return <div className="text-center mt-20">Loading project...</div>;

  const fundingProgress = Math.min(
    100,
    Math.round(
      (Number(formData.fundingGoal)
        ? (Number(formData.currentFunding) / Number(formData.fundingGoal)) * 100
        : 0) || 0,
    ),
  );

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
              Project Details
            </h1>
            <p className="text-sm text-[#747780] mt-1">
              Review and edit this campaign. Delete it if you no longer need it.
            </p>
          </div>
          <button
            type="button"
            className="bg-gradient-to-r from-[#001736] to-[#002b5b] text-white px-7 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:opacity-90 transition-opacity"
            onClick={() => navigate("/dashboard")}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-[#e7e7f0] p-6 md:p-8">
            <h2 className="font-headline text-2xl font-bold text-[#001736] mb-4">
              Campaign details
            </h2>
            <form className="space-y-5" onSubmit={handleUpdate}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-[#001736] mb-2">
                    Project Name
                  </label>
                  <input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    type="text"
                    placeholder="Quant-X Algorithm"
                    className="w-full px-4 py-3 bg-[#f8f9fc] border border-[#e7e7f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a64] focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#001736] mb-2">
                    Project Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  {["public", "private", "hybrid"].map((mode) => (
                    <button
                      type="button"
                      key={mode}
                      onClick={() => setFormData({ ...formData, type: mode })}
                      className={`rounded-xl border p-4 text-left transition ${
                        formData.type === mode
                          ? "border-[#002b5b] bg-[#e4f2ff] shadow"
                          : "border-[#e7e7f0] bg-white hover:border-[#006a64] hover:bg-[#f3f8fd]"
                      }`}
                    >
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#f3f4f6] mb-2">
                        <span className="material-symbols-outlined text-sm">
                          {mode === "public"
                            ? "public"
                            : mode === "private"
                              ? "lock"
                              : "layers"}
                        </span>
                      </span>
                      <h3 className="font-bold text-[#001736] capitalize">
                        {mode}
                      </h3>
                      <p className="text-xs text-[#747780] mt-1">
                        {mode === "public"
                          ? "Community round, open access and high transparency."
                          : mode === "private"
                            ? "Secure, invite-only investment channel."
                            : "Hybrid strategy with mixed institutional and community."}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-[#001736] mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#f8f9fc] border border-[#e7e7f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a64] focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#001736] mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#f8f9fc] border border-[#e7e7f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a64] focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-[#001736] mb-2">
                    Funding Goal ($)
                  </label>
                  <input
                    value={formData.fundingGoal}
                    onChange={(e) =>
                      setFormData({ ...formData, fundingGoal: e.target.value })
                    }
                    type="number"
                    placeholder="50000"
                    className="w-full px-4 py-3 bg-[#f8f9fc] border border-[#e7e7f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a64] focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#001736] mb-2">
                    Current Funding ($)
                  </label>
                  <input
                    readOnly
                    value={formData.currentFunding}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentFunding: e.target.value,
                      })
                    }
                    type="number"
                    placeholder="12000"
                    className="w-full px-4 py-3 bg-[#f8f9fc] border border-[#e7e7f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a64] focus:border-transparent transition-all"
                    min={0}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#001736] mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={5}
                  placeholder="Describe your project goals, audience, and impact..."
                  className="w-full px-4 py-3 bg-[#f8f9fc] border border-[#e7e7f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006a64] focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#001736] mb-2">
                  Project Image
                </label>
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
                        onClick={() => {
                          setFormData({ ...formData, imageUrl: "" });
                          setImagePreview("");
                        }}
                        className="absolute top-2 right-2  text-[#ba1a1a] border border-[#f3c2c2] rounded-full p-1 hover:bg-[#fde7e7] transition"
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
                    id="image-input-detail"
                  />
                  <label
                    htmlFor="image-input-detail"
                    className="cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-4xl text-[#006a64] mb-2 block">
                      image
                    </span>
                    <p className="text-sm font-semibold text-[#001736]">
                      Click to upload image
                    </p>
                    <p className="text-xs text-[#747780] mt-1">
                      PNG, JPG up to 5MB (will be compressed automatically)
                    </p>
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end items-center gap-3">
                <button
                  type="button"
                  className="px-6 py-3 bg-[#f8f9fc] text-[#43474f] font-semibold rounded-lg hover:bg-[#e7e7f0] transition-colors border border-[#e7e7f0]"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={`bg-gradient-to-r from-[#001736] to-[#002b5b] text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-opacity ${saving ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"}`}
                >
                  {saving ? "Saving..." : "Update Project"}
                </button>
              </div>
            </form>

            {/* Danger Zone Section */}
            <div
              id="danger-zone"
              className="mt-12 pt-8 border-t-2 border-[#fde7e7]"
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl text-[#ba1a1a]">⚠</span>
                <h3 className="font-headline text-2xl font-bold text-[#ba1a1a]">
                  Danger Zone: Project Deletion Request
                </h3>
              </div>

              <form onSubmit={handleSubmitDeletion} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#ba1a1a] mb-2">
                      REASON FOR DISSOLUTION
                    </label>
                    <select
                      value={deletionReason}
                      onChange={(e) => setDeletionReason(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-[#fff8f8] border border-[#fde7e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ba1a1a] focus:border-transparent transition-all"
                    >
                      <option value="">Select a reason...</option>
                      <option value="Acquisition / M&A">
                        Acquisition / M&A
                      </option>
                      <option value="Strategic Pivot">Strategic Pivot</option>
                      <option value="Security & Privacy Concern">
                        Security & Privacy Concern
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#ba1a1a] mb-2">
                      JUSTIFICATION
                    </label>
                    <textarea
                      value={deletionJustification}
                      onChange={(e) => setDeletionJustification(e.target.value)}
                      placeholder="Provide context for the board of governors..."
                      rows={3}
                      required
                      className="w-full px-4 py-3 bg-[#fff8f8] border border-[#fde7e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ba1a1a] focus:border-transparent transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-[#fff8f8] border border-[#fde7e7] rounded-lg">
                  <input
                    type="checkbox"
                    id="deletion-acknowledge"
                    checked={deletionAcknowledged}
                    onChange={(e) => setDeletionAcknowledged(e.target.checked)}
                    required
                    className="w-5 h-5 mt-0.5 accent-[#ba1a1a] cursor-pointer"
                  />
                  <label
                    htmlFor="deletion-acknowledge"
                    className="text-sm font-bold text-[#ba1a1a] cursor-pointer leading-relaxed"
                  >
                    I acknowledge this action is irreversible and will purge all
                    architectural shells.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submittingDeletion}
                  className={`w-full sm:w-auto bg-[#ba1a1a] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#9d1616] transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                    !deletionAcknowledged ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {submittingDeletion
                    ? "Submitting..."
                    : "Submit Deletion Report"}
                </button>
              </form>
            </div>
          </section>

          <aside className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-[#e7e7f0] p-6 md:p-8">
            <h3 className="font-headline text-lg font-bold text-[#001736] mb-4">
              Project Preview
            </h3>

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
              <p className="text-xs uppercase tracking-wider text-[#747780] font-bold mb-2">
                Category
              </p>
              <h4 className="font-bold text-[#001736] text-xl mb-1">
                {formData.name || "Untitled Project"}
              </h4>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block px-2 py-1 bg-[#e7eef4] text-[#1b4d82] text-[11px] font-bold rounded-full">
                  {formData.category || "AI"}
                </span>
                <span
                  className={`inline-block px-2 py-1 text-[11px] font-bold rounded-full ${
                    formData.type === "public"
                      ? "bg-[#e7f7f1] text-[#056443]"
                      : formData.type === "private"
                        ? "bg-[#e8f0ff] text-[#0f4f8c]"
                        : "bg-[#fff5e6] text-[#a04b00]"
                  }`}
                >
                  {formData.type || "public"}
                </span>
              </div>

              <p className="text-sm text-[#43474f] mt-3 min-h-[68px]">
                {formData.description ||
                  "Project description will appear here."}
              </p>

              <div className="mt-4 mb-1 text-[11px] font-bold uppercase tracking-wider text-[#747780] flex justify-between">
                <span>Funding goal</span>
                <span>
                  {formData.fundingGoal
                    ? `$${Number(formData.fundingGoal).toLocaleString()}`
                    : "$0"}
                </span>
              </div>
              <div className="h-2 bg-[#edf2fa] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#001736] to-[#002b5b]"
                  style={{ width: `${fundingProgress}%` }}
                />
              </div>
              <div className="mt-1 text-xs font-semibold text-[#001736]">
                {fundingProgress}% funded
              </div>

              <div className="mt-4 text-xs text-[#43474f]">
                <div>
                  <span className="font-semibold text-[#001736]">Start:</span>{" "}
                  {formData.startDate || "—"}
                </div>
                <div>
                  <span className="font-semibold text-[#001736]">End:</span>{" "}
                  {formData.endDate || "—"}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
