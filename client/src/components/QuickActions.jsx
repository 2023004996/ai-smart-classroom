import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 1,
      label: 'Start Lesson',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: 'Begin a new lesson (warmup quiz first)',
      onClick: () => navigate('/quiz'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 2,
      label: 'Continue Learning',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      description: 'Resume your progress',
      onClick: () => navigate('/lessons'),
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      id: 3,
      label: 'Ask Doubt',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: 'Get help from AI tutor',
      onClick: () => navigate('/ai'),
      color: 'bg-green-500 hover:bg-green-600'
    }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={action.onClick}
          className={`rounded-2xl ${action.color} p-6 text-white shadow-md transition transform hover:scale-105 text-left`}
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold">{action.label}</h4>
              <p className="mt-2 text-sm opacity-90">{action.description}</p>
            </div>
            <div className="flex-shrink-0">{action.icon}</div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
