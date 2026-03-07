import { useState, useEffect } from 'react';
import { Camera, BrainCircuit, Activity, Users, AlertTriangle, ArrowUpRight } from 'lucide-react';

const Dashboard = () => {
  const [role, setRole] = useState('citizen'); // 'citizen' or 'admin'
  const [activeTab, setActiveTab] = useState('overview');

  // Admin View
  if (role === 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-civic-dark">Authority Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage public projects, view transparency metrics, and respond to citizen feedback.</p>
            </div>
            <button onClick={() => setRole('citizen')} className="text-sm bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">Switch to Citizen View</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="bg-blue-100 p-4 rounded-full"><Activity className="w-6 h-6 text-civic-blue" /></div>
                <div><h3 className="text-gray-500 text-sm font-medium">Active Projects</h3><p className="text-2xl font-bold">24</p></div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="bg-green-100 p-4 rounded-full"><Users className="w-6 h-6 text-green-600" /></div>
                <div><h3 className="text-gray-500 text-sm font-medium">Citizen Engagement</h3><p className="text-2xl font-bold">8.4k</p></div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="bg-orange-100 p-4 rounded-full"><AlertTriangle className="w-6 h-6 text-orange-600" /></div>
                <div><h3 className="text-gray-500 text-sm font-medium">Pending Feedback</h3><p className="text-2xl font-bold">15</p></div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="bg-purple-100 p-4 rounded-full"><BrainCircuit className="w-6 h-6 text-purple-600" /></div>
                <div><h3 className="text-gray-500 text-sm font-medium">AI Queries</h3><p className="text-2xl font-bold">1.2k</p></div>
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-civic-dark">Recent Citizen Feedback</h2>
                <button className="btn-secondary text-sm">View All Reports</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b text-gray-500 text-sm">
                            <th className="pb-3 font-medium">Project</th>
                            <th className="pb-3 font-medium">Issue Type</th>
                            <th className="pb-3 font-medium">Date</th>
                            <th className="pb-3 font-medium">Status</th>
                            <th className="pb-3 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        <tr className="border-b border-gray-50">
                            <td className="py-4 font-medium">Downtown Metro</td>
                            <td className="py-4"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Noise Complaint</span></td>
                            <td className="py-4 text-gray-500">2 hrs ago</td>
                            <td className="py-4"><span className="text-orange-600 font-medium">Pending Review</span></td>
                            <td className="py-4"><button className="text-civic-blue hover:underline flex items-center gap-1">Review <ArrowUpRight className="w-3 h-3" /></button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    );
  }

  // Citizen View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-civic-dark">Citizen Dashboard</h1>
                <p className="text-gray-600 mt-1">Track projects near your home and understand their community impact.</p>
            </div>
            <button onClick={() => setRole('admin')} className="text-sm bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">Switch to Admin View</button>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 flex items-start gap-4">
            <div className="bg-blue-500 text-white p-3 rounded-full shrink-0">
                <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
                <h3 className="font-bold text-lg text-blue-900">Geofence Alert: You are near an active project</h3>
                <p className="text-blue-800 mt-1">You are within 500m of the <strong>Downtown Metro Expansion</strong>. Expect slight traffic delays due to construction on Main St.</p>
                <button className="mt-3 bg-white text-blue-600 font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow transition-shadow text-sm">Read AI Summary</button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Visuals Section */}
            <div className="glass-card p-6 border border-gray-100 shadow-lg">
                <h2 className="text-xl font-bold text-civic-dark mb-4 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-civic-blue" />
                    Impact Visualizer
                </h2>
                <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden relative group">
                    {/* Placeholder for before/after image slider */}
                    <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070" className="object-cover w-full h-full" alt="Cityscape" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium shadow-xl">Use Slider to Compare Before & After</button>
                    </div>
                </div>
                <div className="mt-4">
                    <h3 className="font-semibold text-lg">Riverside Park Renovation</h3>
                    <p className="text-sm text-gray-600 mt-1">Visualizing the addition of new green spaces and public restrooms.</p>
                </div>
            </div>

            {/* AI Summaries Section */}
            <div className="glass-card p-6 border border-gray-100 shadow-lg">
                <h2 className="text-xl font-bold text-civic-dark mb-4 flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-purple-600" />
                    AI Project Summaries
                </h2>
                <div className="space-y-4">
                    <div className="bg-purple-50/50 p-4 border border-purple-100 rounded-xl">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-md text-purple-900">Downtown Metro Expansion</h3>
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">2km Away</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed mb-3">
                            <strong>AI Summary:</strong> This project expands the metro line by 5 stops. It aims to reduce traffic congestion and improve downtown accessibility for over 50,000 daily commuters. 
                        </p>
                        <hr className="border-purple-200 mb-2" />
                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div><span className="text-gray-500">Budget:</span> <span className="font-medium">$450M</span></div>
                            <div><span className="text-gray-500">Timeline:</span> <span className="font-medium">2024 - 2026</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
