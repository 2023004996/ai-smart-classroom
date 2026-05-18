const TaskList = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-slate-900">Assigned Tasks</h4>
        <div className="mt-4 py-8 text-center">
          <p className="text-slate-600">Tasks will appear after assessment</p>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'in progress':
        return 'bg-blue-50 border-blue-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-white border-slate-200';
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h4 className="text-lg font-semibold text-slate-900">Assigned Tasks</h4>
      <div className="mt-4 space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className={`rounded-lg border p-4 transition ${getStatusColor(task.status)}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h5 className="font-semibold text-slate-900">{task.title}</h5>
                <p className="mt-1 text-sm text-slate-600">{task.description}</p>
              </div>
              <div className="ml-4 flex gap-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(task.difficulty)}`}>
                  {task.difficulty}
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span className="capitalize font-medium">{task.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
