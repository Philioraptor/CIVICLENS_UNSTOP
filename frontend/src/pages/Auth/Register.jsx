import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const INTERESTS = [
  { id: 'education', label: '🎓 Education', desc: 'Schools, colleges, scholarships' },
  { id: 'health', label: '🏥 Health', desc: 'Hospitals, ICU, clinics' },
  { id: 'transport', label: '🚌 Transport', desc: 'Roads, bridges, metro' },
  { id: 'agriculture', label: '🌾 Agriculture', desc: 'Farming schemes, subsidies' },
  { id: 'housing', label: '🏠 Housing', desc: 'Public housing, welfare' },
  { id: 'water', label: '💧 Water & Sanitation', desc: 'Water supply, sewage' },
  { id: 'energy', label: '⚡ Energy', desc: 'Power grids, solar projects' },
  { id: 'environment', label: '🌳 Environment', desc: 'Parks, green zones, pollution' },
];

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Details, 2: Interests
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'citizen' });
  const [interests, setInterests] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleInterest = (id) => {
    setInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleStep1 = (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async () => {
    setError('');
    const result = await register(form.name, form.email, form.password, form.role, interests);
    if (result.success) {
      toast.success('Account created! Welcome to CivicLens 🎉');
      navigate('/dashboard');
    } else {
      setError(result.error);
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">{step === 1 ? '📋' : '🎯'}</div>
          <h1 className="text-3xl font-bold text-civic-dark">
            {step === 1 ? 'Create Account' : 'Your Interests'}
          </h1>
          <p className="text-gray-500 mt-2">
            {step === 1 ? 'Join CivicLens to track local projects' : 'Personalize your civic updates (select all that apply)'}
          </p>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className={`w-8 h-2 rounded-full transition-colors ${step >= 1 ? 'bg-civic-blue' : 'bg-gray-200'}`} />
            <div className={`w-8 h-2 rounded-full transition-colors ${step >= 2 ? 'bg-civic-blue' : 'bg-gray-200'}`} />
          </div>
        </div>

        <div className="glass-card p-8 shadow-xl">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">{error}</div>
          )}

          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} required
                  className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-civic-blue"
                  placeholder="Min 6 characters" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                <select name="role" value={form.role} onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-civic-blue">
                  <option value="citizen">👤 Citizen</option>
                  <option value="admin">🏛 Government / Admin</option>
                </select>
              </div>
              <button type="submit" className="w-full btn-primary py-3 text-lg">
                Continue →
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                {INTERESTS.map(interest => (
                  <button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${interests.includes(interest.id)
                        ? 'border-civic-blue bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                  >
                    <div className="font-medium text-sm">{interest.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{interest.desc}</div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-300 rounded-full font-medium text-gray-600 hover:bg-gray-50">
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full inline-block" />
                  ) : '🚀 Create Account'}
                </button>
              </div>
              <p className="text-center text-xs text-gray-400">You can skip this step — interests can be updated later</p>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-civic-blue font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
