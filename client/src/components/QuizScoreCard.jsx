const QuizScoreCard = ({ score, quizTitle, completionTime, date }) => {
  if (!score && score !== 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-slate-900">Latest Quiz Result</h4>
        <div className="mt-4 py-8 text-center">
          <p className="text-slate-600">No quiz attempted yet</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h4 className="text-lg font-semibold text-slate-900">Latest Quiz Result</h4>
      <div className="mt-6 space-y-4">
        <div>
          <p className="text-sm text-slate-600">Quiz</p>
          <p className="mt-1 font-semibold text-slate-900">{quizTitle}</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">Score</p>
            <p className="mt-1 text-3xl font-bold text-indigo-600">{Math.round(score)}%</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Time</p>
            <p className="mt-1 font-semibold text-slate-900">{completionTime}s</p>
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-500">{formatDate(date)}</p>
        </div>
      </div>
    </div>
  );
};

export default QuizScoreCard;
