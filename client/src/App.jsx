import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AiChat from './pages/AiChat';
import Analytics from './pages/Analytics';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-semibold text-slate-900">
            AI Smart Classroom
          </Link>
          <nav className="space-x-4 text-slate-700">
            <Link to="/">Home</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/ai">AI Tutor</Link>
            <Link to="/analytics">Analytics</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/ai" element={<ProtectedRoute><AiChat /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
