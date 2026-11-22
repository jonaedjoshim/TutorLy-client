import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Alert, Button, Input } from '../components/ui';
import AuthLayout from '../components/layout/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../api/client';

const destination = (role, fallback) => {
  if (fallback && fallback.startsWith('/')) return fallback;
  if (role === 'tutor') return '/tutor/dashboard';
  if (role === 'admin') return '/admin';
  return '/student/dashboard';
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);

    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}.`);
      navigate(destination(user.role, location.state?.from), { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Could not log in. Check your details and try again.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Good to see you again."
      description="Log in to pick up where you left off."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert tone="error">{error}</Alert>}
        <Input
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="At least 8 characters"
          value={form.password}
          onChange={handleChange}
          required
        />
        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? 'Signing in…' : 'Log in'}
        </Button>
      </form>

      <p className="mt-7 text-sm text-muted">
        New to Tutorly?{' '}
        <Link to="/register" className="font-semibold text-teal hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
