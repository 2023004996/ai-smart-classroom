import { useState } from 'react';
import aiService from '../services/aiService';

const AiChat = () => {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await aiService.askTutor(message);
      setReply(data.answer || 'No answer returned.');
    } catch (err) {
      setReply(err.response?.data?.message || 'Unable to reach AI service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 rounded-3xl bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">AI Tutor</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="5"
          placeholder="Ask a classroom question or request a lesson plan..."
          className="w-full rounded-3xl border border-slate-200 p-4 outline-none focus:border-slate-400"
        />
        <button
          type="submit"
          className="rounded-3xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-800"
          disabled={loading || !message.trim()}
        >
          {loading ? 'Asking AI…' : 'Ask AI'}
        </button>
      </form>
      {reply && (
        <div className="rounded-3xl bg-slate-50 p-6 text-slate-800 shadow-inner">
          <h3 className="text-lg font-semibold">AI Response</h3>
          <p className="mt-3 whitespace-pre-line">{reply}</p>
        </div>
      )}
    </div>
  );
};

export default AiChat;
