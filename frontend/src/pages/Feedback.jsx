import { useState } from 'react';
import { Send, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MOCK_PROJECTS = [
  { _id: '1', name: 'Downtown Metro Expansion' },
  { _id: '2', name: 'Riverside Park Renovation' },
];

const Feedback = () => {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: '',
    project: '',
    issueType: '',
    message: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0] || e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      toast.error('File too large. Maximum 5MB.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k, v); });
      if (imageFile) formData.append('image', imageFile);

      await api.post('/api/feedback', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSubmitted(true);
      toast.success('Feedback submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center">
        <div className="glass-card p-12 flex flex-col items-center shadow-xl">
          <CheckCircle2 className="w-20 h-20 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-civic-dark mb-2">Thank you!</h2>
          <p className="text-gray-600 mb-6">Your feedback has been submitted and will be reviewed by the authorities soon.</p>
          <button
            onClick={() => { setSubmitted(false); setForm({ name: user?.name || '', email: '', project: '', issueType: '', message: '' }); setImageFile(null); setImagePreview(null); }}
            className="btn-primary px-8 py-2"
          >Submit Another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-civic-dark mb-3">📢 Report an Issue</h1>
        <p className="text-gray-500">Help improve your neighborhood by reporting infrastructure issues or providing direct feedback to the city council.</p>
      </div>

      <div className="glass-card p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-civic-blue"
                placeholder="Rahul Sharma" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-civic-blue"
                placeholder="rahul@example.com" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Related Project (Optional)</label>
              <select name="project" value={form.project} onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-civic-blue">
                <option value="">Select a project</option>
                {MOCK_PROJECTS.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
              <select name="issueType" value={form.issueType} onChange={handleChange} required
                className="w-full rounded-lg border border-gray-300 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-civic-blue">
                <option value="">Select issue type</option>
                <option value="delay">🕐 Project Delay</option>
                <option value="safety">⚠️ Safety Hazard</option>
                <option value="noise">🔊 Noise Complaint</option>
                <option value="corruption">🚨 Corruption Concern</option>
                <option value="general">💬 General Feedback</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea name="message" value={form.message} onChange={handleChange} required rows={4}
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-civic-blue"
              placeholder="Describe the issue in detail..." />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo Evidence (Optional)</label>
            {imagePreview ? (
              <div className="relative rounded-lg overflow-hidden border border-gray-200">
                <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover" />
                <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  Remove
                </button>
              </div>
            ) : (
              <div
                onDrop={handleImageDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => document.getElementById('file-input').click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-civic-blue hover:bg-blue-50 transition-colors"
              >
                <ImageIcon className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">Click or drag and drop an image</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                <input id="file-input" type="file" accept="image/*" onChange={handleImageDrop} className="hidden" />
              </div>
            )}
          </div>

          <button type="submit" disabled={loading}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-lg disabled:opacity-60">
            {loading ? (
              <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full inline-block" />
            ) : <><Send className="w-5 h-5" /> Submit Feedback</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
