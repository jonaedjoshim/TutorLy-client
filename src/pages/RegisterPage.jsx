import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Alert, Button, Input } from '../components/ui';
import AuthLayout from '../components/layout/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../api/client';

const roles = [
  { value: 'student', label: 'I need a tutor', hint: 'Post a need and browse tutors.' },
  { value: 'tutor', label: 'I am a tutor', hint: 'Build a profile and apply to needs.' },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setBusy(true);
    try {
      const user = await register(form);
      toast.success('Account created. Welcome to Tutorly.');
      navigate(user.role === 'tutor' ? '/tutor/dashboard' : '/student/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Could not create your account. Try again.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Join tutorly"
      title="Start with the basics."
      description="Tell us who you are and we'll take it from there."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert tone="error">{error}</Alert>}

        <div className="grid grid-cols-2 gap-3">
          {roles.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setForm((current) => ({ ...current, role: option.value }))}
              className={`rounded-lg border p-4 text-left transition ${
                form.role === option.value
                  ? 'border-teal bg-teal-light/60'
                  : 'border-line bg-white hover:border-muted'
              }`}
            >
              <span className="block text-sm font-semibold text-ink">{option.label}</span>
              <span className="mt-1 block text-[11px] leading-4 text-muted">{option.hint}</span>
            </button>
          ))}
        </div>

        <Input label="Full name" name="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
        <Input label="Email address" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Phone" name="phone" placeholder="01XXXXXXXXX" value={form.phone} onChange={handleChange} />
          <Input label="Area" name="location" placeholder="Dhanmondi, Dhaka" value={form.location} onChange={handleChange} />
        </div>
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="At least 8 characters"
          value={form.password}
          onChange={handleChange}
          required
        />

        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-7 text-sm text-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-teal hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
