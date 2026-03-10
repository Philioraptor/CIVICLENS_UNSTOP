import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Status colors
const STATUS_COLORS = {
  planned: '#3b82f6',
  ongoing: '#10b981',
  completed: '#6366f1',
};

// Fallback mock data (when backend is unavailable)
const MOCK_PROJECTS = [
  {
    _id: '1', name: 'Downtown Metro Expansion', department: 'Transit Authority',
    budget: '₹450 Cr', timeline: '2024 - 2026', status: 'ongoing',
    aiSummary: 'Expands the metro line by 5 stops to reduce traffic congestion and improve downtown accessibility for over 50,000 daily commuters.',
    communityImpact: 'High positive impact on commute times; temporary road closures during construction.',
    location: { coordinates: [-74.0060, 40.7128] }, radius: 2000,
  },
  {
    _id: '2', name: 'Riverside Park Renovation', department: 'Parks & Recreation',
    budget: '₹12 Cr', timeline: 'Q3 2025 - Q1 2026', status: 'planned',
    aiSummary: 'Complete overhaul of the park including new restrooms, playground equipment, and improved drainage.',
    communityImpact: 'Enhanced public recreation space; part of the park closed during construction.',
    location: { coordinates: [-74.0100, 40.7200] }, radius: 800,
  },
];

// Helper: get distance between two lat/lng in meters
function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Recenter map on user location
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => { map.setView(center, map.getZoom()); }, [center]);
  return null;
}

const STATUS_FILTERS = ['all', 'planned', 'ongoing', 'completed'];

const MapPage = () => {
  const [userLocation, setUserLocation] = useState([20.5937, 78.9629]); // India center default
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [geofenceAlerted, setGeofenceAlerted] = useState(new Set());

  // Fetch nearby projects from API
  const fetchProjects = useCallback(async (lat, lng) => {
    try {
      const { data } = await api.get(`/api/projects/nearby?lat=${lat}&lng=${lng}&radius=10000`);
      const projectList = data.length > 0 ? data : MOCK_PROJECTS;
      setProjects(projectList);
      setFilteredProjects(projectList);
    } catch {
      setProjects(MOCK_PROJECTS);
      setFilteredProjects(MOCK_PROJECTS);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation([latitude, longitude]);
          fetchProjects(latitude, longitude);
        },
        () => {
          fetchProjects(20.5937, 78.9629);
        }
      );
    } else {
      fetchProjects(20.5937, 78.9629);
    }
  }, [fetchProjects]);

  // Geofencing check
  useEffect(() => {
    if (!projects.length) return;
    projects.forEach(proj => {
      const [lng, lat] = proj.location.coordinates;
      const dist = getDistance(userLocation[0], userLocation[1], lat, lng);
      if (dist <= proj.radius && !geofenceAlerted.has(proj._id)) {
        toast(`📍 Civic Alert: You are near "${proj.name}"!`, { icon: '🏗', duration: 6000 });
        setGeofenceAlerted(prev => new Set([...prev, proj._id]));
      }
    });
  }, [userLocation, projects]);

  // Filter + search
  useEffect(() => {
    let list = projects;
    if (statusFilter !== 'all') list = list.filter(p => p.status === statusFilter);
    if (search) list = list.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.department.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProjects(list);
  }, [projects, statusFilter, search]);

  return (
    <div className="h-[calc(100vh-4rem)] relative flex">
      {/* Sidebar */}
      <div className="w-full md:w-80 lg:w-96 bg-white flex flex-col border-r border-gray-200 z-10 shadow-lg">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-civic-dark mb-3">🗺 Nearby Projects</h2>
          {/* Search */}
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-civic-blue mb-3"
          />
          {/* Status filters */}
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1 text-xs rounded-full font-medium capitalize transition-colors ${statusFilter === f
                    ? 'bg-civic-blue text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-100 p-4 animate-pulse bg-gray-50">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-2">🔍</div>
              <p>No projects found</p>
            </div>
          ) : (
            filteredProjects.map(proj => (
              <div
                key={proj._id}
                onClick={() => setSelectedProject(proj)}
                className={`p-4 border rounded-xl cursor-pointer transition-all hover:shadow-md ${selectedProject?._id === proj._id
                    ? 'border-civic-blue bg-blue-50 shadow-md'
                    : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-civic-blue text-sm leading-tight">{proj.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ml-2 shrink-0 ${proj.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                      proj.status === 'completed' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'
                    }`}>{proj.status}</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{proj.department}</p>
                <div className="flex gap-2">
                  <span className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">{proj.budget}</span>
                  <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{proj.timeline}</span>
                </div>
                {proj.aiSummary && (
                  <p className="text-xs text-gray-600 mt-2 italic line-clamp-2">🤖 {proj.aiSummary}</p>
                )}
                <Link
                  to={`/projects/${proj._id}`}
                  onClick={e => e.stopPropagation()}
                  className="mt-2 inline-block text-xs text-civic-blue hover:underline font-medium"
                >
                  View Details →
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 h-full z-0">
        <MapContainer center={userLocation} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecenterMap center={userLocation} />

          {/* User location */}
          <Circle center={userLocation} radius={150} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.5 }}>
            <Popup><b>📍 Your Location</b></Popup>
          </Circle>

          {/* Project zones */}
          {filteredProjects.map(proj => {
            const [lng, lat] = proj.location.coordinates;
            const color = STATUS_COLORS[proj.status] || '#10b981';
            return (
              <div key={proj._id}>
                <Circle
                  center={[lat, lng]}
                  radius={proj.radius}
                  pathOptions={{ color, fillColor: color, fillOpacity: 0.15, weight: 2 }}
                />
                <Marker position={[lat, lng]}>
                  <Popup>
                    <div className="min-w-[200px]">
                      <h3 className="font-bold text-civic-blue">{proj.name}</h3>
                      <p className="text-xs text-gray-500 mb-1">{proj.department}</p>
                      <span className="text-xs font-semibold text-green-700">{proj.budget}</span>
                      {proj.aiSummary && <p className="text-xs text-gray-600 mt-2">{proj.aiSummary}</p>}
                      <Link to={`/projects/${proj._id}`} className="mt-2 block text-xs text-civic-blue font-medium hover:underline">
                        View full details →
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              </div>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
