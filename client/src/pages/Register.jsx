import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Register</h2>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Name</label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-white hover:bg-slate-800" type="submit">
          Register
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Already have an account? <Link className="text-slate-900 underline" to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
