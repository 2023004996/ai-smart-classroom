import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StudentCard from '../components/StudentCard';
import StatBox from '../components/StatBox';
import ProgressBar from '../components/ProgressBar';
import QuizScoreCard from '../components/QuizScoreCard';
import TaskList from '../components/TaskList';
import QuickActions from '../components/QuickActions';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [simulatorScore, setSimulatorScore] = useState('');
  const [simulatorLoading, setSimulatorLoading] = useState(false);
  const [simulatorError, setSimulatorError] = useState('');

  // Subjects state
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectsLoading, setSubjectsLoading] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setSubjectsLoading(true);
        const res = await api.get('/subjects');
        setSubjects(res.data || []);
      } catch (err) {
        console.error('Failed to load subjects:', err);
      } finally {
        setSubjectsLoading(false);
      }
    };

    const loadSelectedSubject = () => {
      const stored = localStorage.getItem('selectedSubject');
      if (stored) {
        try {
          setSelectedSubject(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      } else {
        setSelectedSubject(null);
      }
    };

    if (user && !authLoading) {
      fetchSubjects();
      loadSelectedSubject();
    }

    const handleStorageChange = () => {
      loadSelectedSubject();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user, authLoading]);

  const handleSelectSubject = (subj) => {
    const payload = { id: subj.id, name: subj.name };
    localStorage.setItem('selectedSubject', JSON.stringify(payload));
    setSelectedSubject(payload);
    window.dispatchEvent(new Event('storage'));
  };

  const handleDeselectSubject = () => {
    localStorage.removeItem('selectedSubject');
    setSelectedSubject(null);
    window.dispatchEvent(new Event('storage'));
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError('');
        const response = await api.get('/student/dashboard');
        setDashboardData(response.data);
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to load dashboard. Please try again.';
        setError(message);
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user && !authLoading) {
      fetchDashboard();
    }
  }, [user, authLoading]);

  const refreshDashboard = async () => {
    try {
      const response = await api.get('/student/dashboard');
      setDashboardData(response.data);
    } catch (err) {
      console.error('Dashboard refresh failed:', err);
    }
  };

  const handleSimulatorSubmit = async (event) => {
    event.preventDefault();
    setSimulatorError('');

    const numericScore = Number(simulatorScore);
    if (!Number.isFinite(numericScore) || numericScore < 0 || numericScore > 100) {
      setSimulatorError('Enter a valid score between 0 and 100.');
      return;
    }

    setSimulatorLoading(true);

    try {
      const response = await api.post('/student/update-performance', {
        performanceScore: numericScore
      });

      await refreshDashboard();
      setSimulatorScore('');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update performance score.';
      setSimulatorError(message);
      console.error('Simulator submit error:', err);
    } finally {
      setSimulatorLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          </div>
          <p className="mt-4 text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl bg-red-50 border border-red-200 p-8">
        <h2 className="text-lg font-semibold text-red-900">Error</h2>
        <p className="mt-2 text-red-800">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="rounded-3xl bg-yellow-50 border border-yellow-200 p-8">
        <p className="text-yellow-900">No dashboard data available.</p>
      </div>
    );
  }

  const { student, latestQuizScore, assignedTasks, stats } = dashboardData;

  return (
    <div className="space-y-8">
      {/* Student Header Card */}
      <StudentCard
        name={student.name}
        email={student.email}
        category={student.category}
      />

      {/* Selected Subject Banner */}
      {selectedSubject && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 px-6 py-4 flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-sm font-semibold text-indigo-900">
              Selected Subject: <span className="underline font-bold">{selectedSubject.name}</span>
            </span>
          </div>
          <button 
            onClick={handleDeselectSubject}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Deselect
          </button>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Quick Actions</h3>
        <QuickActions />
      </div>

      {/* Performance Metrics */}
      <section>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Performance Overview</h3>
        <div className="grid gap-4 sm:grid-cols-4">
          <StatBox
            label="Performance Score"
            value={Math.round(student.performanceScore)}
            icon={
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            }
            color="blue"
          />
          <StatBox
            label="Lesson Progress"
            value={Math.round(student.progress) + '%'}
            icon={
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.697 9.293l-5 5a1 1 0 01-1.414 0l-2.5-2.5a1 1 0 011.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 1.414z" clipRule="evenodd" />
              </svg>
            }
            color="green"
          />
          <StatBox
            label="Questions Asked"
            value={stats.doubtsRaised}
            icon={
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
                <path fillOpacity=".5" d="M6 7h8v2H6V7zm0 4h8v2H6v-2z" />
              </svg>
            }
            color="purple"
          />
          <StatBox
            label="Category Level"
            value={student.category || 'N/A'}
            icon={
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V15a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            }
            color="indigo"
          />
        </div>
      </section>

      {/* Progress Bar */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Learning Progress</h3>
        <div className="mt-6">
          <ProgressBar value={student.progress} max={100} label="Overall Course Completion" />
        </div>
      </section>

      {/* Available Subjects Section */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Available Subjects</h3>
        {subjectsLoading && subjects.length === 0 ? (
          <p className="text-slate-500 text-sm">Loading subjects...</p>
        ) : subjects.filter(s => s.isActive).length === 0 ? (
          <p className="text-slate-500 text-sm">No subjects available at this time.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {subjects.filter(s => s.isActive).map((subj) => {
              const isSelected = selectedSubject?.id === subj.id;
              return (
                <div
                  key={subj.id}
                  className={`rounded-xl border p-4 flex flex-col justify-between transition ${
                    isSelected ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{subj.name}</h4>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                      {subj.description || 'No description provided.'}
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => handleSelectSubject(subj)}
                      className={`w-full rounded-lg py-1.5 text-xs font-semibold transition ${
                        isSelected
                          ? 'bg-indigo-600 text-white cursor-default'
                          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                      disabled={isSelected}
                    >
                      {isSelected ? '✓ Selected' : 'Select Subject'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Main Content Grid */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Quiz Score Card */}
        <QuizScoreCard
          score={latestQuizScore?.score}
          quizTitle={latestQuizScore?.quizTitle}
          completionTime={latestQuizScore?.completionTime}
          date={latestQuizScore?.date}
        />

        {/* Task List */}
        <TaskList tasks={assignedTasks} />
      </section>

      {/* Additional Info Footer */}
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
        <h4 className="text-sm font-semibold text-slate-700">Performance Simulator</h4>
        <p className="mt-2 text-sm text-slate-600">
          Submit a test score to update your performance category and refresh the dashboard instantly.
        </p>

        <form onSubmit={handleSimulatorSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="performanceScore" className="block text-sm font-medium text-slate-700">
              Test Score
            </label>
            <input
              id="performanceScore"
              type="number"
              min="0"
              max="100"
              step="1"
              value={simulatorScore}
              onChange={(e) => setSimulatorScore(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Enter a score between 0 and 100"
              disabled={simulatorLoading}
            />
          </div>

          {simulatorError && (
            <p className="text-sm text-red-700">{simulatorError}</p>
          )}

          <button
            type="submit"
            disabled={simulatorLoading}
            className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300 transition"
          >
            {simulatorLoading ? 'Updating...' : 'Update Score'}
          </button>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">Example scores</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>30 → Below Average</li>
              <li>55 → Average</li>
              <li>75 → Above Average</li>
              <li>95 → Excellent</li>
            </ul>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
        <h4 className="text-sm font-semibold text-slate-700">Need Help?</h4>
        <p className="mt-2 text-sm text-slate-600">
          Visit the AI Tutor section to ask questions about lessons, get clarifications on concepts, and receive personalized learning support.
        </p>
        <button
          onClick={() => navigate('/ai')}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
        >
          Go to AI Tutor
        </button>
      </section>
    </div>
  );
};

export default Dashboard;
