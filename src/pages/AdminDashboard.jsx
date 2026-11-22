import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardShell from '../components/layout/DashboardShell';
import { Alert, Badge, Button, Card, EmptyState, Skeleton } from '../components/ui';
import { adminAPI } from '../api/admin';
import { tutorAPI } from '../api/tutors';
import { getErrorMessage } from '../api/client';

const nav = [
  { key: 'overview', label: 'Overview', icon: '▦' },
  { key: 'posts', label: 'Review posts', icon: '▤' },
  { key: 'tutors', label: 'Verify tutors', icon: '✓' },
  { key: 'users', label: 'Users', icon: '◷' },
];

export default function AdminDashboard() {
  const [active, setActive] = useState('overview');
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    let activeRequest = true;

    Promise.all([
      adminAPI.stats(),
      adminAPI.pendingPosts({ limit: 50 }),
      adminAPI.tutors({ limit: 50 }),
      adminAPI.users({ limit: 50 }),
    ])
      .then(([statsResponse, postsResponse, tutorsResponse, usersResponse]) => {
        if (!activeRequest) return;
        setStats(statsResponse.data.stats);
        setPosts(postsResponse.data.data);
        setTutors(tutorsResponse.data.data);
        setUsers(usersResponse.data.data);
      })
      .catch((err) => {
        if (activeRequest) setError(getErrorMessage(err, 'Could not load the admin dashboard.'));
      })
      .finally(() => {
        if (activeRequest) setLoading(false);
      });

    return () => {
      activeRequest = false;
    };
  }, []);

  const reviewPost = async (id, status) => {
    setActionId(id);
    try {
      await adminAPI.reviewPost(id, status);
      setPosts((current) => current.filter((post) => post._id !== id));
      if (stats) {
        setStats({ ...stats, pendingPosts: Math.max(stats.pendingPosts - 1, 0) });
      }
      toast.success(status === 'approved' ? 'Post approved and now visible.' : 'Post rejected.');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not review the post.'));
    } finally {
      setActionId(null);
    }
  };

  const verifyTutor = async (id, verified) => {
    setActionId(id);
    try {
      const response = await adminAPI.setTutorVerification(id, verified);
      setTutors((current) =>
        current.map((tutor) => (tutor._id === id ? response.data.profile : tutor))
      );
      if (stats) {
        setStats({ ...stats, unverifiedTutors: Math.max(stats.unverifiedTutors - (verified ? 1 : 0), 0) });
      }
      toast.success(verified ? 'Tutor verified.' : 'Verification removed.');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not update verification.'));
    } finally {
      setActionId(null);
    }
  };

  const setUserStatus = async (id, status) => {
    setActionId(id);
    try {
      const response = await adminAPI.setUserStatus(id, status);
      setUsers((current) =>
        current.map((user) => (user._id === id ? { ...user, status: response.data.user.status } : user))
      );
      toast.success(status === 'suspended' ? 'User suspended.' : 'User restored.');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not update the user.'));
    } finally {
      setActionId(null);
    }
  };

  return (
    <DashboardShell
      title={active === 'overview' ? 'Platform overview.' : nav.find((item) => item.key === active)?.label}
      subtitle="Keep the marketplace healthy and responsive."
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
          {active === 'overview' && stats && (
            <div className="space-y-8">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'Members', value: stats.users, note: 'Students and tutors' },
                  { label: 'Posts awaiting review', value: stats.pendingPosts, note: 'Action needed' },
                  { label: 'Unverified tutors', value: stats.unverifiedTutors, note: 'Action needed' },
                  { label: 'Applications', value: stats.applications, note: 'All time' },
                ].map((stat) => (
                  <Card key={stat.label} className="p-5">
                    <p className="text-xs font-semibold text-muted">{stat.label}</p>
                    <p className="mt-3 text-4xl text-ink">{stat.value}</p>
                    <p className="mt-2 text-[11px] text-muted">{stat.note}</p>
                  </Card>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl text-ink">Posts to review</h2>
                    <button type="button" onClick={() => setActive('posts')} className="text-xs font-semibold text-teal">Open queue →</button>
                  </div>
                  {stats.pendingPosts === 0 ? (
                    <p className="mt-6 text-sm text-muted">The review queue is clear. Nice work.</p>
                  ) : (
                    <p className="mt-6 text-sm text-muted">{stats.pendingPosts} request{stats.pendingPosts === 1 ? '' : 's'} waiting for a decision.</p>
                  )}
                </Card>
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl text-ink">Tutor verification</h2>
                    <button type="button" onClick={() => setActive('tutors')} className="text-xs font-semibold text-teal">Open list →</button>
                  </div>
                  <p className="mt-6 text-sm text-muted">{stats.unverifiedTutors} tutor{stats.unverifiedTutors === 1 ? '' : 's'} awaiting verification.</p>
                </Card>
              </div>
            </div>
          )}

          {active === 'posts' && (
            <div className="space-y-5">
              {posts.length === 0 ? (
                <EmptyState title="Queue is clear." description="No tuition posts are waiting for review right now." />
              ) : (
                posts.map((post) => (
                  <Card key={post._id} className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="max-w-xl">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl text-ink">{post.subject}</h3>
                          <Badge tone="clay">Pending</Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted">
                          {post.classLevel} · {post.area} · ৳{post.budget.toLocaleString()}/month · {post.student?.name}
                        </p>
                        {post.description && <p className="mt-4 text-sm leading-6 text-muted">{post.description}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" disabled={actionId === post._id} onClick={() => reviewPost(post._id, 'approved')}>Approve</Button>
                        <Button variant="danger" size="sm" disabled={actionId === post._id} onClick={() => reviewPost(post._id, 'rejected')}>Reject</Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {active === 'tutors' && (
            <div className="space-y-5">
              {tutors.length === 0 ? (
                <EmptyState title="No tutor profiles yet." description="Profiles appear here once tutors complete onboarding." />
              ) : (
                tutors.map((tutor) => (
                  <Card key={tutor._id} className="flex flex-wrap items-center justify-between gap-4 p-6">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl text-ink">{tutor.user?.name || 'Tutor'}</h3>
                        <Badge tone={tutor.verified ? 'teal' : 'clay'}>{tutor.verified ? 'Verified' : 'Unverified'}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        {tutor.headline || 'No headline'} · {tutor.area || 'Area not set'} · {tutor.experience || 0} yrs
                      </p>
                      {(tutor.documents || []).length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-3">
                          {tutor.documents.map((filename) => (
                            <button
                              key={filename}
                              type="button"
                              disabled={actionId === filename}
                              onClick={() => {
                                setActionId(filename);
                                tutorAPI
                                  .downloadDocument(filename)
                                  .catch((err) => toast.error(getErrorMessage(err, 'Could not open that document.')))
                                  .finally(() => setActionId(null));
                              }}
                              className="text-xs font-semibold text-teal hover:underline disabled:opacity-50"
                            >
                              View {filename.replace(/^\d+-\d+-/, '')} ↗
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      variant={tutor.verified ? 'outline' : 'primary'}
                      size="sm"
                      disabled={actionId === tutor._id}
                      onClick={() => verifyTutor(tutor._id, !tutor.verified)}
                    >
                      {tutor.verified ? 'Remove verification' : 'Verify tutor'}
                    </Button>
                  </Card>
                ))
              )}
            </div>
          )}

          {active === 'users' && (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-line bg-sand text-xs uppercase tracking-wider text-muted">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 font-semibold text-ink">{user.name}</td>
                        <td className="px-6 py-4 text-muted">{user.email}</td>
                        <td className="px-6 py-4 capitalize text-muted">{user.role}</td>
                        <td className="px-6 py-4">
                          <Badge tone={user.status === 'active' ? 'teal' : 'clay'}>{user.status}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            disabled={actionId === user._id}
                            onClick={() => setUserStatus(user._id, user.status === 'active' ? 'suspended' : 'active')}
                            className="text-xs font-semibold text-teal hover:underline disabled:opacity-50"
                          >
                            {user.status === 'active' ? 'Suspend' : 'Restore'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {users.length === 0 && <p className="p-6 text-sm text-muted">No members yet.</p>}
            </Card>
          )}
        </>
      )}
    </DashboardShell>
  );
}
