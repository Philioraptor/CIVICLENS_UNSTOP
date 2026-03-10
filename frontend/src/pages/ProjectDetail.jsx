import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BrainCircuit, Calendar, DollarSign, Building2, Users, ArrowLeft, MessageSquare } from 'lucide-react';
import api from '../api/axios';

const MOCK = {
    _id: '1', name: 'Downtown Metro Expansion', department: 'Transit Authority',
    budget: '₹450 Cr', timeline: '2024 - 2026', status: 'ongoing',
    description: 'This project expands the metro network across the city center by adding 5 new stops. The expansion covers a 12km stretch and is expected to serve over 50,000 commuters daily. The project includes underground tunneling, new escalators, and accessibility ramps at each station.',
    aiSummary: 'Expands metro line by 5 stops to reduce traffic congestion and improve downtown accessibility for 50,000+ daily commuters.',
    communityImpact: 'High positive impact on commute times. Temporary road closures expected on Main St during construction. Reduced carbon emissions once operational.',
    beforeImage: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80',
    location: { coordinates: [-74.006, 40.7128] }, radius: 2000,
};

const StatusBadge = ({ status }) => {
    const map = { ongoing: 'bg-green-100 text-green-700', completed: 'bg-purple-100 text-purple-700', planned: 'bg-blue-100 text-blue-700' };
    return <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${map[status] || 'bg-gray-100 text-gray-600'}`}>● {status}</span>;
};

// Simple Before/After image slider
const ImageComparison = ({ before, after }) => {
    const [sliderPos, setSliderPos] = useState(50);
    const [dragging, setDragging] = useState(false);
    const containerRef = useState(null);

    const handleMove = (e) => {
        if (!dragging) return;
        const container = e.currentTarget;
        const rect = container.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        setSliderPos(Math.min(100, Math.max(0, (x / rect.width) * 100)));
    };

    return (
        <div className="relative rounded-xl overflow-hidden select-none border border-gray-200 shadow-sm"
            style={{ aspectRatio: '16/9', cursor: 'ew-resize' }}
            onMouseMove={handleMove}
            onMouseUp={() => setDragging(false)}
            onMouseLeave={() => setDragging(false)}
            onTouchMove={handleMove}
            onTouchEnd={() => setDragging(false)}
        >
            {/* After image (full) */}
            <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover" />
            {/* Before image (clipped) */}
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
                <img src={before} alt="Before" className="absolute inset-0 w-full h-full object-cover" style={{ width: `${10000 / sliderPos}%`, maxWidth: 'none' }} />
            </div>
            {/* Slider handle */}
            <div className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10 flex items-center justify-center" style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}>
                <div
                    className="w-8 h-8 bg-white rounded-full shadow-xl border-2 border-civic-blue flex items-center justify-center cursor-ew-resize"
                    onMouseDown={() => setDragging(true)}
                    onTouchStart={() => setDragging(true)}
                >
                    <span className="text-civic-blue text-xs font-bold">⟺</span>
                </div>
            </div>
            {/* Labels */}
            <span className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">Before</span>
            <span className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">After</span>
        </div>
    );
};

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await api.get(`/api/projects/${id}`);
                setProject(data);
            } catch {
                setProject(MOCK);
            }
            try {
                const { data } = await api.get(`/api/feedback/project/${id}`);
                setFeedbacks(data);
            } catch { }
            setLoading(false);
        };
        load();
    }, [id]);

    const fetchAISummary = async () => {
        if (!project?.description || project.aiSummary) return;
        setAiLoading(true);
        try {
            const { data } = await api.post('/api/ai/summarize', { description: project.description });
            setProject(p => ({ ...p, aiSummary: data.summary }));
        } catch { }
        setAiLoading(false);
    };

    useEffect(() => { if (project && !project.aiSummary) fetchAISummary(); }, [project]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
                {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
            </div>
        );
    }

    if (!project) return <div className="text-center py-20 text-gray-400">Project not found</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            {/* Back link */}
            <Link to="/dashboard" className="text-sm text-civic-blue flex items-center gap-1 mb-6 hover:underline">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-civic-dark">{project.name}</h1>
                    <p className="text-gray-500 mt-1 flex items-center gap-1">
                        <Building2 className="w-4 h-4" /> {project.department}
                    </p>
                </div>
                <StatusBadge status={project.status} />
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {[
                    { icon: <DollarSign className="w-4 h-4 text-green-600" />, label: 'Budget', val: project.budget, bg: 'bg-green-50 border-green-100' },
                    { icon: <Calendar className="w-4 h-4 text-blue-600" />, label: 'Timeline', val: project.timeline, bg: 'bg-blue-50 border-blue-100' },
                    { icon: <Users className="w-4 h-4 text-purple-600" />, label: 'Impact', val: 'Community-wide', bg: 'bg-purple-50 border-purple-100' },
                ].map((item, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${item.bg}`}>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">{item.icon} {item.label}</div>
                        <p className="font-bold text-civic-dark">{item.val}</p>
                    </div>
                ))}
            </div>

            {/* Overview */}
            <div className="glass-card p-6 mb-6 border border-gray-100">
                <h2 className="text-lg font-bold text-civic-dark mb-3">📋 Project Overview</h2>
                <p className="text-gray-700 leading-relaxed">{project.description || 'No description available.'}</p>
            </div>

            {/* AI Summary */}
            <div className="glass-card p-6 mb-6 border border-purple-100 bg-purple-50/40">
                <h2 className="text-lg font-bold text-civic-dark mb-3 flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-purple-600" /> AI Summary
                </h2>
                {aiLoading ? (
                    <div className="flex items-center gap-2 text-gray-400">
                        <span className="animate-spin w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full inline-block" />
                        Generating AI summary...
                    </div>
                ) : (
                    <p className="text-gray-700 leading-relaxed italic">{project.aiSummary || 'No AI summary available.'}</p>
                )}
            </div>

            {/* Community Impact */}
            {project.communityImpact && (
                <div className="glass-card p-6 mb-6 border border-orange-100 bg-orange-50/40">
                    <h2 className="text-lg font-bold text-civic-dark mb-3">🌍 Community Impact</h2>
                    <p className="text-gray-700 leading-relaxed">{project.communityImpact}</p>
                </div>
            )}

            {/* Before / After Slider */}
            {project.beforeImage && project.afterImage && (
                <div className="glass-card p-6 mb-6 border border-gray-100">
                    <h2 className="text-lg font-bold text-civic-dark mb-3">📸 Before & After</h2>
                    <p className="text-sm text-gray-400 mb-3">Drag the slider to compare before and after views</p>
                    <ImageComparison before={project.beforeImage} after={project.afterImage} />
                </div>
            )}

            {/* Citizen Feedback */}
            <div className="glass-card p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-civic-dark flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-civic-blue" /> Citizen Feedback
                        <span className="text-sm font-normal text-gray-400">({feedbacks.length})</span>
                    </h2>
                    <Link to={`/feedback?project=${id}`} className="btn-primary text-sm px-4 py-2">
                        Submit Feedback
                    </Link>
                </div>
                {feedbacks.length === 0 ? (
                    <p className="text-center py-6 text-gray-400">No feedback yet. Be the first to report!</p>
                ) : (
                    <div className="space-y-3">
                        {feedbacks.map(f => (
                            <div key={f._id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold text-sm text-gray-800">{f.name}</span>
                                    <span className="text-xs text-gray-400">{new Date(f.createdAt).toLocaleDateString()}</span>
                                </div>
                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded mb-2 inline-block">{f.issueType}</span>
                                <p className="text-sm text-gray-700 mt-1">{f.message}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetail;
