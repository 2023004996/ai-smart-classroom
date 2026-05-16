import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <section className="space-y-6 rounded-3xl bg-white p-8 shadow-sm">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold text-slate-900">AI Smart Classroom</h1>
        <p className="mt-4 text-slate-600">
          A modern full-stack classroom experience with AI tutoring, analytics, and secure JWT-based access.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link to="/login" className="rounded-2xl bg-slate-900 px-6 py-4 text-center text-white transition hover:bg-slate-700">
          Login
        </Link>
        <Link to="/register" className="rounded-2xl bg-slate-100 px-6 py-4 text-center text-slate-900 transition hover:bg-slate-200">
          Register
        </Link>
      </div>
    </section>
  );
};

export default Home;
