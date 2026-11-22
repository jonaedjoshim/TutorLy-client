import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Alert, Button, Input } from '../components/ui';
import { postAPI } from '../api/posts';
import { getErrorMessage } from '../api/client';

const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const mediums = ['Bangla', 'English', 'English Version', 'Madrasa'];

const initial = {
  subject: '',
  classLevel: '',
  budget: '',
  area: '',
  medium: 'Bangla',
  daysPerWeek: 2,
  preferredDays: [],
  tutorGender: 'any',
  description: '',
};

const selectClass =
  'w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-teal';

export default function PostTuitionPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const toggleDay = (day) => {
    setForm((current) => ({
      ...current,
      preferredDays: current.preferredDays.includes(day)
        ? current.preferredDays.filter((item) => item !== day)
        : [...current.preferredDays, day],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);

    try {
      await postAPI.create({
        ...form,
        budget: Number(form.budget),
        daysPerWeek: Number(form.daysPerWeek),
      });
      toast.success('Your request is in. We will review it shortly.');
      navigate('/student/dashboard');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not submit your request.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="border-b border-line pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal">For students</p>
        <h1 className="mt-3 text-5xl text-ink">Tell us what you need.</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
          A short, specific request gets better responses. We review every post before it appears on the board.
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-card border border-line bg-white p-7 shadow-card">
          {error && <Alert tone="error">{error}</Alert>}

          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Subject" name="subject" placeholder="e.g. Physics" value={form.subject} onChange={(e) => update('subject', e.target.value)} required />
            <Input label="Class level" name="classLevel" placeholder="e.g. HSC" value={form.classLevel} onChange={(e) => update('classLevel', e.target.value)} required />
            <Input label="Monthly budget (৳)" name="budget" type="number" min="0" placeholder="4000" value={form.budget} onChange={(e) => update('budget', e.target.value)} required />
            <Input label="Area" name="area" placeholder="e.g. Dhanmondi" value={form.area} onChange={(e) => update('area', e.target.value)} required />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">Medium</label>
              <select className={selectClass} value={form.medium} onChange={(e) => update('medium', e.target.value)}>
                {mediums.map((medium) => <option key={medium}>{medium}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">Days per week</label>
              <select className={selectClass} value={form.daysPerWeek} onChange={(e) => update('daysPerWeek', e.target.value)}>
                {[1, 2, 3, 4, 5, 6].map((count) => <option key={count} value={count}>{count} day{count > 1 ? 's' : ''}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-3 block text-xs font-bold uppercase tracking-[0.12em] text-muted">Preferred days</label>
            <div className="flex flex-wrap gap-2">
              {days.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                    form.preferredDays.includes(day)
                      ? 'border-teal bg-teal-light text-teal-dark'
                      : 'border-line bg-white text-muted hover:border-teal'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-3 block text-xs font-bold uppercase tracking-[0.12em] text-muted">Tutor preference</label>
            <div className="flex gap-3">
              {[
                ['any', 'Any'],
                ['male', 'Male'],
                ['female', 'Female'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => update('tutorGender', value)}
                  className={`rounded-lg border px-4 py-2 text-sm transition ${
                    form.tutorGender === value
                      ? 'border-teal bg-teal-light text-teal-dark'
                      : 'border-line bg-white text-muted'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
              Anything else?
            </label>
            <textarea
              id="description"
              rows="4"
              placeholder="Current level, goals, schedule constraints…"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              className="w-full resize-none rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-teal"
            />
          </div>

          <Button type="submit" size="lg" disabled={busy}>
            {busy ? 'Submitting…' : 'Submit request'}
          </Button>
        </form>

        <aside className="space-y-5">
          <div className="rounded-card border border-line bg-sand p-6">
            <h2 className="text-xl text-ink">What happens next?</h2>
            <ol className="mt-5 space-y-5">
              {[
                ['01', 'We review the request', 'Usually within a few hours.'],
                ['02', 'It appears on the board', 'Tutors can see the details you shared.'],
                ['03', 'You get applications', 'Compare and reply from your dashboard.'],
              ].map(([number, title, body]) => (
                <li key={number} className="flex gap-3">
                  <span className="text-xs font-bold text-clay">{number}</span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-muted">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <p className="px-2 text-xs leading-5 text-muted">
            Please avoid sharing sensitive documents or payment details in the request.
          </p>
        </aside>
      </div>
    </main>
  );
}
