import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import subjectService from '../services/subjectService';

const Subjects = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  // Common state
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Admin form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Admin inline editing state
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);

  // Student selection state
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    fetchSubjects();

    // Fetch selected subject for student
    const stored = localStorage.getItem('selectedSubject');
    if (stored) {
      try {
        setSelectedSubject(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await subjectService.getAll();
      setSubjects(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load subjects.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Subject name is required.');
      return;
    }

    setSubmitting(true);
    try {
      await subjectService.create({ name, description });
      setSuccess('Subject created successfully.');
      setName('');
      setDescription('');
      await fetchSubjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create subject.');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (subj) => {
    setEditId(subj.id);
    setEditName(subj.name);
    setEditDescription(subj.description || '');
    setEditIsActive(subj.isActive);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName('');
    setEditDescription('');
  };

  const handleUpdate = async (id) => {
    setError('');
    setSuccess('');

    if (!editName.trim()) {
      setError('Subject name is required.');
      return;
    }

    try {
      await subjectService.update(id, {
        name: editName,
        description: editDescription,
        isActive: editIsActive
      });
      setSuccess('Subject updated successfully.');
      setEditId(null);
      await fetchSubjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update subject.');
    }
  };

  const handleDeactivate = async (id) => {
    setError('');
    setSuccess('');
    if (!window.confirm('Are you sure you want to deactivate this subject?')) {
      return;
    }

    try {
      await subjectService.delete(id);
      setSuccess('Subject deactivated successfully.');
      await fetchSubjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to deactivate subject.');
    }
  };

  const handleSelectSubject = (subj) => {
    const payload = { id: subj.id, name: subj.name };
    localStorage.setItem('selectedSubject', JSON.stringify(payload));
    setSelectedSubject(payload);
    setSuccess(`Selected ${subj.name} as your current subject.`);
    // Dispatch storage event so header/dashboard updates instantly if listening
    window.dispatchEvent(new Event('storage'));
  };

  const handleDeselectSubject = () => {
    localStorage.removeItem('selectedSubject');
    setSelectedSubject(null);
    setSuccess('Deselected subject.');
    window.dispatchEvent(new Event('storage'));
  };

  if (loading && subjects.length === 0) {
    return <div className="text-center py-12">Loading subjects page...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Toast notifications */}
      {(error || success) && (
        <div className="space-y-2">
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 shadow-sm animate-fade-in">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700 shadow-sm animate-fade-in">
              {success}
            </div>
          )}
        </div>
      )}

      {isAdmin ? (
        /* ================= ADMIN INTERFACE ================= */
        <div className="space-y-8">
          <div className="rounded-3xl border bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">Subject Management</h2>
            <p className="mt-2 text-sm text-slate-500">Create, edit, and deactivate subjects available to students.</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Create Subject Form */}
            <div className="lg:col-span-1">
              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Create Subject</h3>
                <form onSubmit={handleCreate} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Subject Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. English, Science"
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="3"
                      placeholder="Enter subject details..."
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                  >
                    {submitting ? 'Creating...' : 'Create Subject'}
                  </button>
                </form>
              </div>
            </div>

            {/* Subjects Table */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl border bg-white p-6 shadow-sm overflow-hidden">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Subject List</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-700">
                      <tr>
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Description</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {subjects.map((subj) => (
                        <tr key={subj.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-4 font-mono text-xs">{subj.id}</td>
                          <td className="px-4 py-4 font-semibold text-slate-900">
                            {editId === subj.id ? (
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-2 py-1 text-sm outline-none focus:border-slate-400"
                              />
                            ) : (
                              subj.name
                            )}
                          </td>
                          <td className="px-4 py-4 max-w-xs truncate">
                            {editId === subj.id ? (
                              <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-2 py-1 text-sm outline-none focus:border-slate-400"
                                rows="1"
                              />
                            ) : (
                              subj.description || <span className="text-slate-400 italic">No description</span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            {editId === subj.id ? (
                              <select
                                value={editIsActive ? 'true' : 'false'}
                                onChange={(e) => setEditIsActive(e.target.value === 'true')}
                                className="rounded-lg border border-slate-200 px-2 py-1 text-sm outline-none"
                              >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                              </select>
                            ) : subj.isActive ? (
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                                Active
                              </span>
                            ) : (
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-500 border border-slate-200">
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-right">
                            {editId === subj.id ? (
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleUpdate(subj.id)}
                                  className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => startEdit(subj)}
                                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                  Edit
                                </button>
                                {subj.isActive && (
                                  <button
                                    onClick={() => handleDeactivate(subj.id)}
                                    className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                                  >
                                    Deactivate
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                      {subjects.length === 0 && (
                        <tr>
                          <td colSpan="5" className="text-center py-8 text-slate-400">
                            No subjects have been created yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= STUDENT INTERFACE ================= */
        <div className="space-y-6">
          <div className="rounded-3xl border bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Available Subjects</h2>
            <p className="mt-2 text-slate-500">Select a subject to customize your learning environment and view progress.</p>
          </div>

          {selectedSubject && (
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-sm gap-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-indigo-100 p-2 text-indigo-700">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-700">Current Choice</h4>
                  <p className="text-lg font-bold text-indigo-950">{selectedSubject.name}</p>
                </div>
              </div>
              <button
                onClick={handleDeselectSubject}
                className="self-start sm:self-center rounded-xl border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100/50"
              >
                Deselect Subject
              </button>
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {subjects.filter(s => s.isActive).map((subj) => {
              const isSelected = selectedSubject?.id === subj.id;
              return (
                <div
                  key={subj.id}
                  className={`rounded-2xl border p-6 flex flex-col justify-between shadow-sm transition transform hover:scale-[1.02] ${
                    isSelected ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/10' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{subj.name}</h4>
                    <p className="mt-2 text-sm text-slate-500 line-clamp-3">
                      {subj.description || <span className="italic">No description provided for this subject.</span>}
                    </p>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={() => handleSelectSubject(subj)}
                      className={`w-full rounded-xl py-2.5 text-sm font-semibold transition ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10 cursor-default'
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

          {subjects.filter(s => s.isActive).length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 py-12 text-center text-slate-400">
              There are no available subjects at this time.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Subjects;
