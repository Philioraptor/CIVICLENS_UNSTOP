import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import MapPage from './pages/MapPage';
import Dashboard from './pages/Dashboard';
import Feedback from './pages/Feedback';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ProjectDetail from './pages/ProjectDetail';
import AdminPanel from './pages/Admin/AdminPanel';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route
                path="/dashboard"
                element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
              />
              <Route
                path="/feedback"
                element={<ProtectedRoute><Feedback /></ProtectedRoute>}
              />
              <Route
                path="/admin"
                element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>}
              />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </Router>
    </AuthProvider>
  );
}

export default App;
