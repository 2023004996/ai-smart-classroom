import { useEffect, useState } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        setError('Failed to load admin stats.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading admin dashboard...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  const { totalStudents, averagePerformance, categoryDistribution } = stats;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6">
        <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
        <p className="mt-2 text-slate-600">Welcome, admin — overview of student performance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6">
          <h4 className="text-sm text-slate-600">Total Students</h4>
          <p className="mt-2 text-2xl font-semibold">{totalStudents}</p>
        </div>
        <div className="rounded-2xl border bg-white p-6">
          <h4 className="text-sm text-slate-600">Average Performance</h4>
          <p className="mt-2 text-2xl font-semibold">{averagePerformance}</p>
        </div>
        <div className="rounded-2xl border bg-white p-6">
          <h4 className="text-sm text-slate-600">Category Distribution</h4>
          <ul className="mt-2 text-sm">
            <li>Below Average: {categoryDistribution.belowAverage}</li>
            <li>Average: {categoryDistribution.average}</li>
            <li>Above Average: {categoryDistribution.aboveAverage}</li>
            <li>Excellent: {categoryDistribution.excellent}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
