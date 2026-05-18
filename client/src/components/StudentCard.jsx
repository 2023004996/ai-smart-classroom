const StudentCard = ({ name, email, category }) => {
  const getCategoryColor = () => {
    switch (category?.toLowerCase()) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'above average':
        return 'bg-blue-100 text-blue-800';
      case 'average':
        return 'bg-yellow-100 text-yellow-800';
      case 'below average':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-sm border border-indigo-100">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">{name}</h3>
          <p className="mt-2 text-slate-600">{email}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getCategoryColor()}`}>
              {category || 'Not Assessed'}
            </span>
          </div>
        </div>
        <div className="rounded-full bg-white p-4 shadow-md">
          <svg className="h-10 w-10 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
