import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const response = await api.get('/classrooms/dashboard');
      setStats(response.data);
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Classroom Dashboard</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-wide text-slate-500">Students</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{stats?.studentCount ?? '–'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-wide text-slate-500">Courses</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{stats?.courseCount ?? '–'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-wide text-slate-500">Completed Lessons</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{stats?.completedLessons ?? '–'}</p>
          </div>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2">
        <Link className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5" to="/ai">
          <h3 className="text-lg font-semibold text-slate-900">AI Tutor</h3>
          <p className="mt-2 text-slate-600">Ask classroom-related questions and receive instant learning support.</p>
        </Link>
        <Link className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5" to="/analytics">
          <h3 className="text-lg font-semibold text-slate-900">Analytics</h3>
          <p className="mt-2 text-slate-600">Review progress and performance trends for your classes.</p>
        </Link>
      </section>
    </div>
  );
};

export default Dashboard;
