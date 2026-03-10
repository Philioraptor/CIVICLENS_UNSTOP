import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus, Trash2, Check } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const DEPARTMENTS = [
    'Transit Authority', 'Parks & Recreation', 'Public Works',
    'Water & Sanitation', 'Education Department', 'Health Department',
    'Housing Authority', 'Energy Department', 'Agriculture Department',
];

const AdminPanel = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('projects');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingProjects, setFetchingProjects] = useState(true);

    const [form, setForm] = useState({
        name: '', budget: '', timeline: '', department: '', description: '',
        communityImpact: '', status: 'planned',
        lat: '', lng: '', radius: '1000',
        beforeImage: '', afterImage: '',
    });

    useEffect(() => {
        api.get('/api/projects')
            .then(({ data }) => setProjects(data))
            .catch(() => setProjects([]))
            .finally(() => setFetchingProjects(false));
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.lat || !form.lng) {
            toast.error('Please enter location coordinates');
            return;
        }
        setLoading(true);
        try {
            const payload = {
                name: form.name, budget: form.budget, timeline: form.timeline,
                department: form.department, description: form.description,
                communityImpact: form.communityImpact, status: form.status,
                radius: parseInt(form.radius),
                location: {
                    type: 'Point',
                    coordinates: [parseFloat(form.lng), parseFloat(form.lat)],
                },
                beforeImage: form.beforeImage || undefined,
                afterImage: form.afterImage || undefined,
            };

            // Auto-generate AI summary
            try {
                const { data: aiData } = await api.post('/api/ai/summarize', { description: form.description });
                payload.aiSummary = aiData.summary;
            } catch { }

            const { data } = await api.post('/api/projects', payload);
            setProjects(prev => [data, ...prev]);
            toast.success('Project published successfully! 🎉');
            setForm({ name: '', budget: '', timeline: '', department: '', description: '', communityImpact: '', status: 'planned', lat: '', lng: '', radius: '1000', beforeImage: '', afterImage: '' });
            setActiveTab('manage');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to create project');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/api/projects/${id}`, { status });
            setProjects(prev => prev.map(p => p._id === id ? { ...p, status } : p));
            toast.success('Status updated');
        } catch { toast.error('Failed to update'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this project?')) return;
        try {
            await api.delete(`/api/projects/${id}`);
            setProjects(prev => prev.filter(p => p._id !== id));
            toast.success('Project deleted');
        } catch { toast.error('Failed to delete'); }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-civic-dark">⚙ Admin Panel</h1>
                    <p className="text-gray-500 mt-1">Manage civic projects and infrastructure data</p>
                </div>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    {user?.name} · Admin
                </span>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
                {[
                    { id: 'projects', label: '➕ Add Project' },
                    { id: 'manage', label: `📋 Manage (${projects.length})` },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                ? 'border-civic-blue text-civic-blue'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Add Project Tab */}
            {activeTab === 'projects' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="glass-card p-6 border border-gray-100">
                        <h2 className="font-bold text-civic-dark mb-4">Project Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
                                <input type="text" name="name" value={form.name} onChange={handleChange} required
                                    className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-civic-blue"
                                    placeholder="e.g., ICU Wing Expansion - Civil Hospital" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Budget *</label>
                                <input type="text" name="budget" value={form.budget} onChange={handleChange} required
                                    className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-civic-blue"
                                    placeholder="e.g., ₹2.3 Cr" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Timeline *</label>
                                <input type="text" name="timeline" value={form.timeline} onChange={handleChange} required
                                    className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-civic-blue"
                                    placeholder="e.g., 2024 - 2026" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                                <select name="department" value={form.department} onChange={handleChange} required
                                    className="w-full rounded-lg border border-gray-300 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-civic-blue">
                                    <option value="">Select department</option>
                                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select name="status" value={form.status} onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-civic-blue">
                                    <option value="planned">Planned</option>
                                    <option value="ongoing">Ongoing</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Project Description *</label>
                                <textarea name="description" value={form.description} onChange={handleChange} required rows={4}
                                    className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-civic-blue"
                                    placeholder="Full description — AI will summarize this automatically..." />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Community Impact</label>
                                <textarea name="communityImpact" value={form.communityImpact} onChange={handleChange} rows={2}
                                    className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-civic-blue"
                                    placeholder="How does this project benefit the local community?" />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="glass-card p-6 border border-gray-100">
                        <h2 className="font-bold text-civic-dark mb-4">📍 Location & Zone</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude *</label>
                                <input type="number" step="any" name="lat" value={form.lat} onChange={handleChange} required
                                    className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-civic-blue"
                                    placeholder="e.g., 28.6139" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude *</label>
                                <input type="number" step="any" name="lng" value={form.lng} onChange={handleChange} required
                                    className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-civic-blue"
                                    placeholder="e.g., 77.2090" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Geofence Radius (m)</label>
                                <input type="number" name="radius" value={form.radius} onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-civic-blue"
                                    placeholder="1000" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">💡 Tip: Find coordinates by right-clicking any location on <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-civic-blue underline">Google Maps</a></p>
                    </div>

                    {/* Images */}
                    <div className="glass-card p-6 border border-gray-100">
                        <h2 className="font-bold text-civic-dark mb-4">📸 Before / After Images (Optional)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Before Image URL</label>
                                <input type="url" name="beforeImage" value={form.beforeImage} onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-civic-blue"
                                    placeholder="https://..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">After Image URL</label>
                                <input type="url" name="afterImage" value={form.afterImage} onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-civic-blue"
                                    placeholder="https://..." />
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-60">
                        {loading ? (
                            <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full inline-block" />
                        ) : <><Plus className="w-5 h-5" /> Publish Project</>}
                    </button>
                </form>
            )}

            {/* Manage Projects Tab */}
            {activeTab === 'manage' && (
                <div className="space-y-4">
                    {fetchingProjects ? (
                        [...Array(3)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)
                    ) : projects.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                            <div className="text-4xl mb-2">📋</div>
                            <p>No projects yet. Add one using the form.</p>
                        </div>
                    ) : (
                        projects.map(proj => (
                            <div key={proj._id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-civic-dark">{proj.name}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${proj.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                                                proj.status === 'completed' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-blue-100 text-blue-700'
                                            }`}>{proj.status}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">{proj.department} · {proj.budget} · {proj.timeline}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <select
                                        value={proj.status}
                                        onChange={e => handleStatusUpdate(proj._id, e.target.value)}
                                        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none"
                                    >
                                        <option value="planned">Planned</option>
                                        <option value="ongoing">Ongoing</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                    <button onClick={() => handleDelete(proj._id)}
                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
