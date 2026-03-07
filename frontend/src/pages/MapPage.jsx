import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { BrainCircuit, Info } from 'lucide-react';

// Fix leafet default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Mock projects
const mockProjects = [
  {
    id: 1,
    name: "Downtown Metro Expansion",
    department: "Transit Authority",
    budget: "$450M",
    timeline: "2024 - 2026",
    aiSummary: "Expands the metro line by 5 stops to reduce traffic congestion and improve downtown accessibility for over 50,000 daily commuters.",
    communityImpact: "High positive impact on commute times; temporary road closures during construction.",
    location: [40.7128, -74.0060], // NY coordinates for demo
    radius: 2000 // 2km radius
  },
  {
    id: 2,
    name: "Riverside Park Renovation",
    department: "Parks & Recreation",
    budget: "$12M",
    timeline: "Q3 2025 - Q1 2026",
    aiSummary: "Complete overhaul of the park including new public restrooms, updated playground equipment, and improved drainage systems.",
    communityImpact: "Enhanced public recreation space; part of the park closed during construction.",
    location: [40.7200, -74.0100],
    radius: 800
  }
];

const MapPage = () => {
  const [userLocation, setUserLocation] = useState([40.7128, -74.0060]); // Default to NY
  const [projects, setProjects] = useState(mockProjects);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          // Fetch nearby projects here using userLocation
        },
        () => console.log('Geolocation denied, using default')
      );
    }
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] relative flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 bg-white p-6 overflow-y-auto border-r border-gray-200 z-10 shadow-lg hidden md:block">
        <h2 className="text-2xl font-bold mb-6 text-civic-dark">Nearby Projects</h2>
        <div className="space-y-4">
          {projects.map(proj => (
            <div key={proj.id} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-gray-50">
              <h3 className="font-semibold text-lg text-civic-blue">{proj.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{proj.department}</p>
              <div className="flex gap-2 mb-3">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{proj.budget}</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{proj.timeline}</span>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg flex gap-2 items-start mt-4 border border-blue-100">
                <BrainCircuit className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 italic">{proj.aiSummary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex-1 h-full z-0">
        <MapContainer center={userLocation} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* User Location */}
          <Circle center={userLocation} radius={200} pathOptions={{ color: 'blue', fillColor: 'blue' }}>
             <Popup>Your Location</Popup>
          </Circle>

          {/* Project Locations */}
          {projects.map(proj => (
            <div key={proj.id}>
              <Circle center={proj.location} radius={proj.radius} pathOptions={{ color: 'rgba(34, 197, 94, 0.5)', fillColor: 'rgba(34, 197, 94, 0.2)' }} />
              <Marker position={proj.location}>
                <Popup className="custom-popup">
                  <div className="p-1 min-w-[200px]">
                    <h3 className="font-bold text-md text-civic-blue mb-1">{proj.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{proj.department}</p>
                    <p className="font-medium text-sm mb-1 text-green-700">{proj.budget}</p>
                    <div className="flex items-start gap-1 mt-2 text-xs text-gray-700 bg-gray-50 p-2 rounded">
                       <Info className="w-3 h-3 mt-0.5 shrink-0" />
                       <span>{proj.communityImpact}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </div>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
