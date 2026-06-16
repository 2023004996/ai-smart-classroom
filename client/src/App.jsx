import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AiChat from './pages/AiChat';
import Analytics from './pages/Analytics';
import Quiz from './pages/Quiz';
import AdminDashboard from './pages/AdminDashboard';
import Subjects from './pages/Subjects';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import StudentRoute from './components/StudentRoute';

const App = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-semibold text-slate-900">
            AI Smart Classroom
          </Link>
          <nav className="flex items-center gap-4 text-slate-700">
            <Link to="/">Home</Link>
            {!user && <Link to="/login">Login</Link>}
            {!user && <Link to="/signup">Signup</Link>}

            {user && user.role === 'ADMIN' && (
              <>
                <Link to="/admin">Admin Dashboard</Link>
                <Link to="/subjects">Subjects</Link>
              </>
            )}

            {user && user.role === 'STUDENT' && (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/subjects">Subjects</Link>
                <Link to="/ai">AI Tutor</Link>
                <Link to="/analytics">Analytics</Link>
              </>
            )}

            {user && (
              <button
                type="button"
                onClick={logout}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/dashboard" element={<StudentRoute><Dashboard /></StudentRoute>} />
          <Route path="/subjects" element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/ai" element={<ProtectedRoute><AiChat /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
