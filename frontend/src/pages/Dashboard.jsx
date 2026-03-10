import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Users, AlertTriangle, BrainCircuit, ArrowUpRight, CheckCircle, Clock, MapPin } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Haversine distance in meters
function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const MOCK = [
    { _id: '1', name: 'Downtown Metro Expansion', department: 'Transit Authority', budget: '₹450 Cr', timeline: '2024–2026', status: 'ongoing', location: { coordinates: [-74.006, 40.7128] }, radius: 2000, aiSummary: 'Expands the metro line by 5 stops for 50,000 daily commuters.' },
    { _id: '2', name: 'Riverside Park Renovation', department: 'Parks & Recreation', budget: '₹12 Cr', timeline: 'Q3 2025', status: 'planned', location: { coordinates: [-74.01, 40.72] }, radius: 800, aiSummary: 'Overhaul of park including new restrooms and playground.' },
];

const StatusBadge = ({ status }) => {
    const map = { ongoing: 'bg-green-100 text-green-700', completed: 'bg-purple-100 text-purple-700', planned: 'bg-blue-100 text-blue-700' };
    return <span className={`text-xs px-2 py-1 rounded-full font-medium ${map[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
};

const Dashboard = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [nearestProject, setNearestProject] = useState(null);
    const [stats, setStats] = useState({ total: 0, ongoing: 0, planned: 0, completed: 0 });
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const { data } = await api.get('/api/projects');
                const list = data.length ? data : MOCK;
                setProjects(list);
                setStats({
                    total: list.length,
                    ongoing: list.filter(p => p.status === 'ongoing').length,
                    planned: list.filter(p => p.status === 'planned').length,
                    completed: list.filter(p => p.status === 'completed').length,
                });
            } catch {
                setProjects(MOCK);
                setStats({ total: 2, ongoing: 1, planned: 1, completed: 0 });
            }

            if (user?.role === 'admin') {
                try {
                    const { data } = await api.get('/api/feedback');
                    setFeedbacks(data);
                } catch { }
            }
            setLoading(false);
        };
        loadData();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                setUserLocation([pos.coords.latitude, pos.coords.longitude]);
            });
        }
    }, [user]);

    // Find nearest project once we have location and projects
    useEffect(() => {
        if (!userLocation || !projects.length) return;
        let closest = null, minDist = Infinity;
        projects.forEach(proj => {
            const [lng, lat] = proj.location.coordinates;
            const d = getDistance(userLocation[0], userLocation[1], lat, lng);
            if (d < minDist) { minDist = d; closest = { ...proj, distance: Math.round(d) }; }
        });
        setNearestProject(closest);
    }, [userLocation, projects]);

    const handleFeedbackStatus = async (id, status) => {
        try {
            await api.patch(`/api/feedback/${id}/status`, { status });
            setFeedbacks(prev => prev.map(f => f._id === id ? { ...f, status } : f));
            toast.success(`Feedback marked as ${status}`);
        } catch { toast.error('Failed to update status'); }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
                </div>
            </div>
        );
    }

    // ─── ADMIN VIEW ────────────────────────────────────
    if (user?.role === 'admin') {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-civic-dark">Authority Dashboard</h1>
                        <p className="text-gray-600 mt-1">Manage public projects, view transparency metrics, respond to citizen feedback.</p>
                    </div>
                    <Link to="/admin" className="btn-primary flex items-center gap-2 text-sm">
                        ⚙ Admin Panel
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Projects', val: stats.total, icon: <Activity className="w-5 h-5 text-civic-blue" />, bg: 'bg-blue-50' },
                        { label: 'Ongoing', val: stats.ongoing, icon: <Clock className="w-5 h-5 text-green-600" />, bg: 'bg-green-50' },
                        { label: 'Pending Feedback', val: feedbacks.filter(f => f.status === 'pending').length, icon: <AlertTriangle className="w-5 h-5 text-orange-600" />, bg: 'bg-orange-50' },
                        { label: 'Completed', val: stats.completed, icon: <CheckCircle className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50' },
                    ].map((s, i) => (
                        <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className={`p-3 rounded-full ${s.bg}`}>{s.icon}</div>
                            <div>
                                <p className="text-gray-500 text-xs font-medium">{s.label}</p>
                                <p className="text-2xl font-bold text-civic-dark">{s.val}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Feedback Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-civic-dark">Citizen Feedback</h2>
                        <span className="text-sm text-gray-400">{feedbacks.length} reports</span>
                    </div>
                    {feedbacks.length === 0 ? (
                        <p className="text-center py-8 text-gray-400">No feedback submitted yet</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b text-gray-400 text-xs uppercase">
                                        <th className="pb-3 font-medium">Citizen</th>
                                        <th className="pb-3 font-medium">Issue</th>
                                        <th className="pb-3 font-medium">Project</th>
                                        <th className="pb-3 font-medium">Status</th>
                                        <th className="pb-3 font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {feedbacks.map(f => (
                                        <tr key={f._id} className="hover:bg-gray-50">
                                            <td className="py-3 font-medium">{f.name}</td>
                                            <td className="py-3">
                                                <span className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded text-xs">{f.issueType}</span>
                                            </td>
                                            <td className="py-3 text-gray-500">{f.project?.name || 'General'}</td>
                                            <td className="py-3">
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${f.status === 'resolved' ? 'text-green-700 bg-green-100' :
                                                        f.status === 'reviewed' ? 'text-blue-700 bg-blue-100' :
                                                            'text-orange-600 bg-orange-50'
                                                    }`}>{f.status}</span>
                                            </td>
                                            <td className="py-3">
                                                {f.status === 'pending' && (
                                                    <button onClick={() => handleFeedbackStatus(f._id, 'reviewed')}
                                                        className="text-civic-blue hover:underline text-xs flex items-center gap-1">
                                                        Review <ArrowUpRight className="w-3 h-3" />
                                                    </button>
                                                )}
                                                {f.status === 'reviewed' && (
                                                    <button onClick={() => handleFeedbackStatus(f._id, 'resolved')}
                                                        className="text-green-600 hover:underline text-xs flex items-center gap-1">
                                                        Resolve <CheckCircle className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ─── CITIZEN VIEW ───────────────────────────────────
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-civic-dark">
                    Welcome, {user?.name?.split(' ')[0]} 👋
                </h1>
                <p className="text-gray-600 mt-1">Track projects near your location and understand their community impact.</p>
            </div>

            {/* Geofence Alert */}
            {nearestProject && nearestProject.distance <= nearestProject.radius && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8 flex items-start gap-4 shadow-sm">
                    <div className="bg-blue-500 text-white p-3 rounded-full shrink-0">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-blue-900">📢 Geofence Alert: Active Project Nearby</h3>
                        <p className="text-blue-800 mt-1">
                            You are <strong>{Math.round(nearestProject.distance)}m</strong> from{' '}
                            <strong>{nearestProject.name}</strong>. {nearestProject.aiSummary}
                        </p>
                        <Link to={`/projects/${nearestProject._id}`}
                            className="mt-3 inline-block bg-white text-blue-600 font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow transition-shadow text-sm">
                            View Project Details →
                        </Link>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                    { label: 'Total Projects', val: stats.total, color: 'text-civic-blue' },
                    { label: 'Ongoing', val: stats.ongoing, color: 'text-green-600' },
                    { label: 'Completed', val: stats.completed, color: 'text-purple-600' },
                ].map((s, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
                        <p className="text-gray-500 text-xs mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Projects Grid */}
            <h2 className="text-xl font-bold text-civic-dark mb-4">Local Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(proj => (
                    <div key={proj._id} className="glass-card p-5 border border-gray-100 shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-civic-dark text-sm leading-tight">{proj.name}</h3>
                            <StatusBadge status={proj.status} />
                        </div>
                        <p className="text-xs text-gray-500 mb-3">{proj.department}</p>
                        <div className="flex gap-2 mb-3">
                            <span className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">{proj.budget}</span>
                            <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{proj.timeline}</span>
                        </div>
                        {proj.aiSummary && (
                            <div className="bg-purple-50 border border-purple-100 p-3 rounded-lg mb-3">
                                <p className="text-xs text-gray-700 italic">🤖 {proj.aiSummary}</p>
                            </div>
                        )}
                        <Link to={`/projects/${proj._id}`} className="text-sm text-civic-blue hover:underline font-medium flex items-center gap-1">
                            Read More <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
