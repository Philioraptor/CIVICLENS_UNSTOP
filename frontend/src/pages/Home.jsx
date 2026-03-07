import { ArrowRight, MapPin, Eye, FileText, Bell, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  { icon: <MapPin className="text-civic-blue w-6 h-6" />, title: 'Geofencing', desc: 'Detects nearby projects automatically based on your location.' },
  { icon: <FileText className="text-civic-blue w-6 h-6" />, title: 'AI Summaries', desc: 'Simplifies complex government structural documents.' },
  { icon: <Eye className="text-civic-blue w-6 h-6" />, title: 'Visuals', desc: 'Compare before and after impact imagery.' },
  { icon: <Bell className="text-civic-blue w-6 h-6" />, title: 'Notifications', desc: 'Get alerts when entering an active project zone.' },
  { icon: <MessageSquare className="text-civic-blue w-6 h-6" />, title: 'Feedback', desc: 'Submit issues and report directly to authorities.' },
];

const Home = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-civic-lightBlue to-civic-blue text-white py-20 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">CivicLens</h1>
        <p className="text-xl md:text-2xl font-light mb-10 opacity-90">AI Powered Hyper-Local Governance Transparency Platform</p>
        <p className="max-w-2xl mx-auto text-lg mb-10 opacity-80">
          Track government projects, view budgets, monitor timelines, and understand the impact of infrastructure changes right in your neighborhood.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link to="/map" className="bg-white text-civic-blue px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg flex items-center">
            Explore Map <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link to="/dashboard" className="border-border border border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors">
            View Nearby Projects
          </Link>
          <Link to="/feedback" className="bg-civic-green text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors shadow-lg">
            Submit Feedback
          </Link>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-civic-dark">How CivicLens Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((pkg, idx) => (
              <div key={idx} className="glass-card p-6 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  {pkg.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
                <p className="text-gray-600">{pkg.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
