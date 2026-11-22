import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardShell from '../components/layout/DashboardShell';
import { Alert, Badge, Button, Card, EmptyState, Input, Skeleton } from '../components/ui';
import { tutorAPI } from '../api/tutors';
import { postAPI } from '../api/posts';
import { applicationAPI } from '../api/applications';
import { getErrorMessage } from '../api/client';

const nav = [
  { key: 'overview', label: 'Overview', icon: '▦' },
  { key: 'opportunities', label: 'Open needs', icon: '◎' },
  { key: 'applications', label: 'My applications', icon: '↗' },
  { key: 'profile', label: 'Teaching profile', icon: '◷' },
];

const statusTone = { pending: 'clay', accepted: 'teal', rejected: 'neutral' };

const commaList = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export default function TutorDashboard() {
  const [active, setActive] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [posts, setPosts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [docBusy, setDocBusy] = useState(null);

  useEffect(() => {
    let activeRequest = true;

    Promise.all([
      tutorAPI.getMyProfile(),
      postAPI.list({ limit: 12 }),
      applicationAPI.mine({ limit: 50 }),
    ])
      .then(([profileResponse, postResponse, applicationResponse]) => {
        if (!activeRequest) return;
        const nextProfile = profileResponse.data.profile;
        setProfile(nextProfile);
        setForm({
          headline: nextProfile.headline || '',
          qualification: nextProfile.qualification || '',
          experience: nextProfile.experience || 0,
          subjects: (nextProfile.subjects || []).join(', '),
          classLevels: (nextProfile.classLevels || []).join(', '),
          area: nextProfile.area || '',
          hourlyRate: nextProfile.hourlyRate || 0,
          online: Boolean(nextProfile.online),
          bio: nextProfile.bio || '',
        });
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

  const stats = useMemo(
    () => [
      { label: 'Applications sent', value: applications.length, note: 'All time' },
      { label: 'Accepted', value: applications.filter((item) => item.status === 'accepted').length, note: 'Confirmed tuitions' },
      { label: 'Awaiting reply', value: applications.filter((item) => item.status === 'pending').length, note: 'In progress' },
      { label: 'Open needs', value: posts.length, note: 'On the board' },
    ],
    [applications, posts]
  );

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const response = await tutorAPI.updateMyProfile({
        ...form,
        experience: Number(form.experience),
        hourlyRate: Number(form.hourlyRate),
        subjects: commaList(form.subjects),
        classLevels: commaList(form.classLevels),
      });
      setProfile(response.data.profile);
      toast.success('Teaching profile updated.');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not save your profile.'));
    } finally {
      setSaving(false);
    }
  };

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((file) => formData.append('documents', file));

    setUploading(true);
    try {
      const response = await tutorAPI.uploadDocuments(formData);
      setProfile((current) => ({ ...current, documents: response.data.documents }));
      toast.success('Documents uploaded. Our team will review them.');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not upload those files.'));
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleRemoveDocument = async (filename) => {
    setDocBusy(filename);
    try {
      const response = await tutorAPI.removeDocument(filename);
      setProfile((current) => ({ ...current, documents: response.data.documents }));
      toast.success('Document removed.');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not remove that document.'));
    } finally {
      setDocBusy(null);
    }
  };

  const handleDownloadDocument = async (filename) => {
    setDocBusy(filename);
    try {
      await tutorAPI.downloadDocument(filename);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not open that document.'));
    } finally {
      setDocBusy(null);
    }
  };

  const displayName = (filename) => filename.replace(/^\d+-\d+-/, '');

  return (
    <DashboardShell
      title={active === 'overview' ? `Your space, ${profile?.user?.name?.split(' ')[0] || 'tutor'}.` : nav.find((item) => item.key === active)?.label}
      subtitle="Keep your profile sharp and follow up on the requests that matter."
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
                    <h2 className="text-2xl text-ink">Latest applications</h2>
                    <button type="button" onClick={() => setActive('applications')} className="text-xs font-semibold text-teal">
                      View all →
                    </button>
                  </div>
                  {applications.length === 0 ? (
                    <p className="mt-6 text-sm text-muted">You have not applied to any requests yet. Browse the open needs to get started.</p>
                  ) : (
                    <ul className="mt-5 divide-y divide-line">
                      {applications.slice(0, 5).map((item) => (
                        <li key={item._id} className="flex items-center justify-between gap-4 py-4">
                          <div>
                            <p className="text-sm font-semibold text-ink">{item.post?.subject}</p>
                            <p className="text-xs text-muted">{item.post?.classLevel} · {item.post?.area}</p>
                          </div>
                          <Badge tone={statusTone[item.status]}>{item.status}</Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>

                <Card className="bg-teal-dark p-6 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">Profile strength</p>
                  <p className="mt-4 text-4xl text-white">
                    {profile?.verified ? 'Verified' : 'Unverified'}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/70">
                    {profile?.verified
                      ? 'Your documents have been reviewed by our team.'
                      : 'Upload your documents from the profile tab so we can verify you.'}
                  </p>
                </Card>
              </div>
            </div>
          )}

          {active === 'opportunities' && (
            <div className="space-y-5">
              {posts.length === 0 ? (
                <EmptyState title="No open needs right now." description="New requests are added every day. Check back soon." />
              ) : (
                posts.map((post) => (
                  <Card key={post._id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                    <div>
                      <h3 className="text-xl text-ink">{post.subject}</h3>
                      <p className="mt-1 text-xs text-muted">{post.classLevel} · {post.area} · ৳{post.budget.toLocaleString()}/month</p>
                    </div>
                    <Link to={`/needs/${post._id}`}>
                      <Button variant="outline" size="sm">View & apply</Button>
                    </Link>
                  </Card>
                ))
              )}
            </div>
          )}

          {active === 'applications' && (
            <div className="space-y-5">
              {applications.length === 0 ? (
                <EmptyState title="No applications yet." description="When you apply to a tuition need, it will appear here." />
              ) : (
                applications.map((item) => (
                  <Card key={item._id} className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl text-ink">{item.post?.subject}</h3>
                          <Badge tone={statusTone[item.status]}>{item.status}</Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted">{item.post?.classLevel} · {item.post?.area}</p>
                        {item.message && <p className="mt-4 max-w-xl text-sm leading-6 text-muted">“{item.message}”</p>}
                      </div>
                      <span className="text-xs text-muted">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {active === 'profile' && form && (
            <Card className="max-w-3xl p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl text-ink">How students see you</h2>
                  <p className="mt-2 text-sm text-muted">Use plain language and be specific about what you teach.</p>
                </div>
                {profile?.verified && <Badge tone="teal">Verified tutor</Badge>}
              </div>

              <form onSubmit={handleSave} className="mt-7 space-y-5">
                <Input label="Headline" name="headline" placeholder="HSC Physics & Math tutor" value={form.headline} onChange={(e) => update('headline', e.target.value)} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="Qualification" name="qualification" placeholder="BSc in Physics" value={form.qualification} onChange={(e) => update('qualification', e.target.value)} />
                  <Input label="Years of experience" name="experience" type="number" min="0" value={form.experience} onChange={(e) => update('experience', e.target.value)} />
                </div>
                <Input label="Subjects" name="subjects" placeholder="Physics, Mathematics" hint="Separate with commas" value={form.subjects} onChange={(e) => update('subjects', e.target.value)} />
                <Input label="Class levels" name="classLevels" placeholder="HSC, Class 9-10" hint="Separate with commas" value={form.classLevels} onChange={(e) => update('classLevels', e.target.value)} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="Area" name="area" placeholder="Dhanmondi, Dhaka" value={form.area} onChange={(e) => update('area', e.target.value)} />
                  <Input label="Hourly rate (৳)" name="hourlyRate" type="number" min="0" value={form.hourlyRate} onChange={(e) => update('hourlyRate', e.target.value)} />
                </div>
                <label className="flex items-center gap-2.5 text-sm text-ink">
                  <input
                    type="checkbox"
                    checked={form.online}
                    onChange={(e) => update('online', e.target.checked)}
                    className="h-4 w-4 rounded border-line accent-teal"
                  />
                  I also teach online
                </label>
                <div>
                  <label htmlFor="tutor-bio" className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">About your teaching</label>
                  <textarea
                    id="tutor-bio"
                    rows="4"
                    value={form.bio}
                    onChange={(e) => update('bio', e.target.value)}
                    className="w-full resize-none rounded-lg border border-line bg-white px-4 py-3 text-sm outline-none focus:border-teal"
                  />
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving…' : 'Save profile'}
                </Button>
              </form>

              <div className="mt-10 border-t border-line pt-8">
                <h3 className="text-xl text-ink">Verification documents</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Add a degree certificate, teaching ID, or NID. Only you and our review team can open these files.
                </p>

                <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-teal bg-teal-light px-4 py-2.5 text-sm font-semibold text-teal-dark transition hover:bg-teal-light/70">
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                    onChange={handleUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  {uploading ? 'Uploading…' : 'Choose files'}
                </label>
                <p className="mt-2 text-[11px] text-muted">JPG, PNG, WEBP or PDF · up to 5 files · 5 MB each</p>

                {(profile?.documents || []).length > 0 ? (
                  <ul className="mt-5 divide-y divide-line rounded-lg border border-line bg-white">
                    {profile.documents.map((filename) => (
                      <li key={filename} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                        <span className="truncate text-sm text-ink">{displayName(filename)}</span>
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            disabled={docBusy === filename}
                            onClick={() => handleDownloadDocument(filename)}
                            className="text-xs font-semibold text-teal hover:underline disabled:opacity-50"
                          >
                            Open
                          </button>
                          <button
                            type="button"
                            disabled={docBusy === filename}
                            onClick={() => handleRemoveDocument(filename)}
                            className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-5 text-sm text-muted">No documents uploaded yet.</p>
                )}
              </div>
            </Card>
          )}
        </>
      )}
    </DashboardShell>
  );
}
