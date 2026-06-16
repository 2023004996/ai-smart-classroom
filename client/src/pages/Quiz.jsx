import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProtectedRoute from '../components/ProtectedRoute';

const Quiz = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [duration, setDuration] = useState(600);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const timerRef = useRef(null);
  const [remaining, setRemaining] = useState(duration);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const res = await api.get('/quiz/warmup');
        setQuestions(res.data.questions || []);
        setDuration(res.data.duration || 600);
        setRemaining(res.data.duration || 600);
        setAnswers(new Array((res.data.questions || []).length).fill(null));
      } catch (err) {
        setError('Failed to load quiz.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, []);

  useEffect(() => {
    if (!loading) {
      timerRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(timerRef.current);
            handleSubmit();
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const selectOption = (idx, value) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError('');

    try {
      const res = await api.post('/quiz/submit', { answers });
      setSuccessMsg(`Score: ${res.data.score} — Category: ${res.data.category}`);
      // short delay then navigate back to dashboard
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading quiz...</div>;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Warmup Quiz</h2>
        <div className="rounded-2xl border bg-white px-4 py-2 font-mono">{formatTime(remaining)}</div>
      </div>

      <div className="rounded-2xl border p-6 bg-white">
        <div className="mb-4 flex items-center justify-between">
          <div>Question {current + 1} of {questions.length}</div>
          <div className="w-1/2 bg-slate-100 rounded-full h-3">
            <div className="bg-indigo-600 h-3 rounded-full" style={{ width: `${((current+1)/questions.length)*100}%` }} />
          </div>
        </div>

        <h3 className="text-lg font-medium">{q.question}</h3>

        <div className="mt-4 grid gap-3">
          {q.options.map((opt) => (
            <button
              key={opt}
              onClick={() => selectOption(current, opt)}
              className={`text-left rounded-lg border p-3 ${answers[current] === opt ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-white'}`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="rounded-lg border px-4 py-2 bg-white"
          >
            Previous
          </button>

          <button
            onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
            disabled={current === questions.length - 1}
            className="rounded-lg border px-4 py-2 bg-white"
          >
            Next
          </button>

          <div className="ml-auto">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-2xl bg-indigo-600 px-4 py-2 text-white"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          </div>
        </div>

        {successMsg && <p className="mt-4 text-green-700">{successMsg}</p>}
      </div>
    </div>
  );
};

export default function ProtectedQuiz() {
  return (
    <ProtectedRoute>
      <Quiz />
    </ProtectedRoute>
  );
}
