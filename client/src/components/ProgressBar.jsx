const ProgressBar = ({ value, max = 100, label }) => {
  const percentage = (value / max) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-semibold text-indigo-600">{Math.round(percentage)}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
