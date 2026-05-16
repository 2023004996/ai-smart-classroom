import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: 'Week 1', attendance: 88, progress: 45 },
  { name: 'Week 2', attendance: 92, progress: 56 },
  { name: 'Week 3', attendance: 95, progress: 69 },
  { name: 'Week 4', attendance: 90, progress: 78 }
];

const Analytics = () => {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Classroom Analytics</h2>
        <p className="mt-3 text-slate-600">Monitor attendance trends and course progress over time.</p>
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={mockData} margin={{ top: 20, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Line type="monotone" dataKey="attendance" stroke="#2563eb" strokeWidth={3} />
            <Line type="monotone" dataKey="progress" stroke="#10b981" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default Analytics;
