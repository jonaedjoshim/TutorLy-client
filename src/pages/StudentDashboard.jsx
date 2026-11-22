import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardShell from '../components/layout/DashboardShell';
import { Alert, Badge, Button, Card, EmptyState, Input, Skeleton, Spinner } from '../components/ui';
import { postAPI } from '../api/posts';
import { applicationAPI } from '../api/applications';
import { authAPI } from '../api/auth';
import { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';

const nav = [
  { key: 'overview', label: 'Overview', icon: '▦' },
  { key: 'posts', label: 'My requests', icon: '▤' },
  { key: 'applications', label: 'Applications', icon: '↳' },
  { key: 'profile', label: 'Profile', icon: '◷' },
];

const statusTone = {
  pending: 'clay',
  approved: 'teal',
  rejected: 'neutral',
  accepted: 'teal',
};

export default function StudentDashboard() {
  const { user, updateUser } = useAuth();
  const [active, setActive] = useState('overview');
  const [posts, setPosts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState(null);
  const [profile, setProfile] = useState({ name: '', phone: '', location: '', bio: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    let activeRequest = true;

    Promise.all([postAPI.mine({ limit: 50 }), applicationAPI.received({ limit: 50 })])
      .then(([postResponse, applicationResponse]) => {
        if (!activeRequest) return;
        setPosts(postResponse.data.data);
        setApplications(applicationResponse.data.data);
      })
      .catch((err) => {
        if (activeRequest) setError(getErrorMessage(err, 'Could not load your dashboard.'));
      })
      .finally(() => {
        if (activeRequest) setLoading(false);
      });

    return () => {
      activeRequest = false;
    };
  }, []);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const stats = useMemo(
    () => [
      { label: 'Total requests', value: posts.length, note: 'All time' },
      { label: 'Awaiting review', value: posts.filter((post) => post.status === 'pending').length, note: 'From Tutorly team' },
      { label: 'Applications', value: applications.length, note: 'From tutors' },
      { label: 'New replies', value: applications.filter((item) => item.status === 'pending').length, note: 'Need your response' },
    ],
    [posts, applications]
  );

  const handleStatus = async (id, status) => {
    setActionId(id);
    try {
      const response = await applicationAPI.updateStatus(id, status);
      setApplications((current) =>
        current.map((item) => (item._id === id ? response.data.application : item))
      );
      toast.success(status === 'accepted' ? 'Application accepted.' : 'Application declined.');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not update the application.'));
    } finally {
      setActionId(null);
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Remove this request and its applications?')) return;

    try {
      await postAPI.remove(id);
      setPosts((current) => current.filter((post) => post._id !== id));
      setApplications((current) => current.filter((item) => item.post?._id !== id));
      toast.success('Request removed.');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not remove the request.'));
    }
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    setSavingProfile(true);

    try {
      const response = await authAPI.updateProfile(profile);
      updateUser(response.data.user);
      toast.success('Profile saved.');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not save your profile.'));
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <DashboardShell
      title={active === 'overview' ? `Hello, ${user?.name?.split(' ')[0]}.` : nav.find((item) => item.key === active)?.label}
      subtitle={
        active === 'overview'
          ? 'Here is what is happening with your tuition requests.'
          : 'Everything you need, in one place.'
      }
      nav={nav}
      active={active}
      onSelect={setActive}
    >
      {error && <Alert tone="error" className="mb-6">{error}</Alert>}

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((item) => <Skeleton key={item} className="h-28" />)}
        </div>
      ) : (
        <>
          {active === 'overview' && (
            <div className="space-y-8">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <Card key={stat.label} className="p-5">
                    <p className="text-xs font-semibold text-muted">{stat.label}</p>
                    <p className="mt-3 text-4xl text-ink">{stat.value}</p>
                    <p className="mt-2 text-[11px] text-muted">{stat.note}</p>
                  </Card>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl text-ink">Recent applications</h2>
                    <button type="button" onClick={() => setActive('applications')} className="text-xs font-semibold text-teal">
                      View all →
                    </button>
                  </div>
                  {applications.length === 0 ? (
                    <p className="mt-6 text-sm text-muted">No applications yet. Approved requests tend to get replies quickly.</p>
                  ) : (
                    <ul className="mt-5 divide-y divide-line">
                      {applications.slice(0, 5).map((item) => (
                        <li key={item._id} className="flex items-center justify-between gap-4 py-4">
                          <div>
                            <p className="text-sm font-semibold text-ink">{item.tutor?.name}</p>
                            <p className="text-xs text-muted">{item.post?.subject} · {item.post?.area}</p>
                          </div>
                          <Badge tone={statusTone[item.status]}>{item.status}</Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>

                <Card className="bg-teal-dark p-6 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">Next step</p>
                  <h2 className="mt-3 text-3xl text-white">Need another tutor?</h2>
                  <p className="mt-3 text-sm leading-6 text-white/70">
                    Post a new request and we will put it in front of tutors nearby.
                  </p>
                  <Link to="/post-tuition" className="mt-6 inline-block rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-teal-dark">
                    Post a need
                  </Link>
                </Card>
              </div>
            </div>
          )}

          {active === 'posts' && (
            <div className="space-y-5">
              <div className="flex justify-end">
                <Link to="/post-tuition"><Button>New request</Button></Link>
              </div>
              {posts.length === 0 ? (
                <EmptyState
                  title="No requests yet."
                  description="Post what you are looking for and tutors will be able to apply."
                  action={<Link to="/post-tuition"><Button>Post a need</Button></Link>}
                />
              ) : (
                posts.map((post) => (
                  <Card key={post._id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl text-ink">{post.subject}</h3>
                        <Badge tone={statusTone[post.status]}>{post.status}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted">{post.classLevel} · {post.area} · ৳{post.budget.toLocaleString()}/month</p>
                    </div>
                    <Button variant="danger" size="sm" onClick={() => handleDeletePost(post._id)}>Remove</Button>
                  </Card>
                ))
              )}
            </div>
          )}

          {active === 'applications' && (
            <div className="space-y-5">
              {applications.length === 0 ? (
                <EmptyState title="No applications yet." description="When tutors apply to your requests, you will see them here." />
              ) : (
                applications.map((item) => (
                  <Card key={item._id} className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl text-ink">{item.tutor?.name}</h3>
                          <Badge tone={statusTone[item.status]}>{item.status}</Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted">{item.post?.subject} · {item.post?.classLevel} · {item.post?.area}</p>
                        {item.message && <p className="mt-4 max-w-xl text-sm leading-6 text-muted">“{item.message}”</p>}
                      </div>
                      {item.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" disabled={actionId === item._id} onClick={() => handleStatus(item._id, 'accepted')}>Accept</Button>
                          <Button variant="outline" size="sm" disabled={actionId === item._id} onClick={() => handleStatus(item._id, 'rejected')}>Decline</Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {active === 'profile' && (
            <Card className="max-w-2xl p-7">
              <h2 className="text-2xl text-ink">Your details</h2>
              <p className="mt-2 text-sm text-muted">Keep this current so tutors know who they are speaking with.</p>
              <form onSubmit={handleProfileSave} className="mt-7 space-y-5">
                <Input label="Name" name="name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Phone" name="phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                  <Input label="Area" name="location" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="bio" className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">About you</label>
                  <textarea
                    id="bio"
                    rows="3"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full resize-none rounded-lg border border-line bg-white px-4 py-3 text-sm outline-none focus:border-teal"
                  />
                </div>
                <Button type="submit" disabled={savingProfile}>
                  {savingProfile ? <><Spinner size={16} /> Saving…</> : 'Save changes'}
                </Button>
              </form>
            </Card>
          )}
        </>
      )}
    </DashboardShell>
  );
}
