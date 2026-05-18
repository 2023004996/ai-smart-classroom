const StatBox = ({ icon, label, value, color = 'indigo' }) => {
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
      <div className={`inline-block rounded-lg ${colorClasses[color]} p-3 mb-4`}>
        {icon}
      </div>
      <p className="text-sm uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
};

export default StatBox;
