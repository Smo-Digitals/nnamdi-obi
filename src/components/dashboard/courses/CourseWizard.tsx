'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, WarningCircle, PencilSimpleLine, Stack, ChatCircleText, Tag } from 'phosphor-react';
import { WizardActions } from './WizardActions';
import { IntroductionTab } from './IntroductionTab';
import { CurriculumTab } from './CurriculumTab';
import { CaptionTab } from './CaptionTab';
import { PricingTab } from './PricingTab';
import { emptyCourse, type Course } from './courseTypes';

const STEPS = ['Introduction', 'Content', 'Caption', 'Pricing'] as const;
type Step = typeof STEPS[number];
const SAVE_DELAY = 700;

const STEP_ICONS: Record<Step, typeof PencilSimpleLine> = {
  Introduction: PencilSimpleLine, Content: Stack, Caption: ChatCircleText, Pricing: Tag,
};

function stepFromQuery(v: string | null): Step {
  return STEPS.find((s) => s.toLowerCase() === v) ?? 'Introduction';
}

function toPayload(c: Course) {
  const rest: Partial<Course> = { ...c };
  delete rest.id;
  delete rest.created_at;
  return rest;
}

export function CourseWizard({ initialCourseId }: { initialCourseId: string | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [courseId, setCourseId] = useState(initialCourseId);
  const [course, setCourse] = useState<Course>(emptyCourse());
  const [loading, setLoading] = useState(!!initialCourseId);
  const [step, setStep] = useState<Step>(stepFromQuery(searchParams.get('tab')));
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const skipAutosave = useRef(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!initialCourseId) return;
    fetch(`/api/courses/${initialCourseId}`).then((r) => r.json()).then((c) => {
      if (c?.error) { setError(c.error); setLoading(false); return; }
      skipAutosave.current = true;
      setCourse(c);
      setLoading(false);
    }).catch(() => {
      setError('Could not load this course. Check your connection and reload.');
      setLoading(false);
    });
  }, [initialCourseId]);

  useEffect(() => {
    if (skipAutosave.current) { skipAutosave.current = false; return; }
    if (!courseId) return;
    setSaveStatus('saving');
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => { persist(); }, SAVE_DELAY);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course]);

  async function persist(overrides?: Partial<Course>) {
    if (!courseId) return null;
    setSaveStatus('saving');
    const res = await fetch(`/api/courses/${courseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...toPayload(course), ...overrides }),
    });
    const data = await res.json();
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 1500);
    return data;
  }

  async function createDraft() {
    setError(null);
    setSaveStatus('saving');
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...toPayload(course), title: course.title.trim() || 'Untitled Course', status: 'draft' }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? 'Something went wrong.'); setSaveStatus('idle'); return null; }
    skipAutosave.current = true;
    setCourseId(data.id);
    setCourse(data);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 1500);
    return data;
  }

  async function goToStep(next: Step) {
    let id = courseId;
    if (!id) {
      const created = await createDraft();
      if (!created) return;
      id = created.id;
    }
    router.replace(`/admin/courses/all/${id}?tab=${next.toLowerCase()}`);
    setStep(next);
  }

  async function advance() {
    const idx = STEPS.indexOf(step);
    const next = STEPS[idx + 1];
    if (courseId) {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      await persist();
    }
    if (next) goToStep(next);
  }

  async function publish() {
    if (!courseId) {
      const created = await createDraft();
      if (!created) return;
      await fetch(`/api/courses/${created.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'published' }),
      });
    } else {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      await persist({ status: 'published' });
    }
    setCourse((c) => ({ ...c, status: 'published' }));
    router.push('/admin/courses/all');
  }

  async function remove() {
    if (!courseId) return;
    if (!confirm('Delete this course? This cannot be undone.')) return;
    setDeleting(true);
    await fetch(`/api/courses/${courseId}`, { method: 'DELETE' });
    router.push('/admin/courses/all');
  }

  function update(patch: Partial<Course>) {
    setCourse((c) => ({ ...c, ...patch }));
  }

  const isLastStep = step === STEPS[STEPS.length - 1];
  const primaryLabel = isLastStep ? 'Publish course' : 'Next step';
  const primaryAction = isLastStep ? publish : advance;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="shrink-0 px-8 pt-6 pb-4 border-b" style={{ borderColor: 'var(--adm-border)' }}>
        <button onClick={() => router.push('/admin/courses/all')}
          className="flex items-center gap-1.5 text-xs font-semibold mb-3 hover:text-white transition-colors" style={{ color: 'var(--adm-muted)' }}>
          <ArrowLeft size={13} /> Back
        </button>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="font-bold text-2xl" style={{ color: 'var(--adm-text)' }}>
            {courseId ? course.title || 'Edit course' : 'Add new course'}
          </h1>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {STEPS.map((s) => {
                const Icon = STEP_ICONS[s];
                const active = step === s;
                return (
                  <button key={s} onClick={() => goToStep(s)}
                    className="hover-brighten flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors"
                    style={active
                      ? { backgroundColor: '#DC5B17', borderColor: '#DC5B17', color: '#fff' }
                      : { backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)', color: 'var(--adm-muted)' }}>
                    <Icon size={14} weight={active ? 'fill' : 'regular'} />
                    {s}
                  </button>
                );
              })}
            </div>
            <WizardActions status={saveStatus} label={primaryLabel} onClick={primaryAction} disabled={loading} />
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-8 py-6 flex flex-col gap-6">
        {error && (
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <WarningCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
            <p className="text-red-400 text-xs">{error}</p>
          </div>
        )}

        {loading ? (
          <p className="text-sm" style={{ color: 'var(--adm-muted)' }}>Loading…</p>
        ) : (
          <>
            {step === 'Introduction' && <IntroductionTab course={course} onChange={update} />}
            {step === 'Content' && (courseId
              ? <CurriculumTab courseId={courseId} sessionType={course.session_type} />
              : <p className="text-sm" style={{ color: 'var(--adm-muted)' }}>Setting up your draft…</p>)}
            {step === 'Caption' && <CaptionTab course={course} onChange={update} />}
            {step === 'Pricing' && (
              <PricingTab course={course} onChange={update} onDelete={courseId ? remove : undefined} deleting={deleting} />
            )}
          </>
        )}
      </div>

      <div className="shrink-0 flex items-center justify-end gap-3 px-8 py-5 border-t" style={{ backgroundColor: 'var(--adm-panel)', borderColor: 'var(--adm-border)' }}>
        <WizardActions status={saveStatus} label={primaryLabel} onClick={primaryAction} disabled={loading} />
      </div>
    </div>
  );
}
