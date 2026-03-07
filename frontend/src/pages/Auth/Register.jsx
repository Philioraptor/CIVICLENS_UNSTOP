import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, KeyRound } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-civic-dark mb-8">Join CivicLens</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 w-full rounded-lg border-gray-300 border p-3 focus:ring-civic-blue focus:border-civic-blue"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                className="pl-10 w-full rounded-lg border-gray-300 border p-3 focus:ring-civic-blue focus:border-civic-blue"
                placeholder="citizen@civiclens.gov"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                className="pl-10 w-full rounded-lg border-gray-300 border p-3 focus:ring-civic-blue focus:border-civic-blue"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-civic-green hover:bg-green-600 text-white py-3 rounded-full font-medium transition-all shadow-md">
            Create Account
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Already have an account? <Link to="/login" className="text-civic-blue hover:underline font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
