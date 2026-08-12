import Link from 'next/link';
import { BookOpen, Clock, Users } from 'phosphor-react';

type RubricItem = { max_score: number };

type Assignment = {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  rubric: RubricItem[];
  reviews_required: number;
};

export function CourseAssignmentsList({ courseId, assignments }: { courseId: string; assignments: Assignment[] }) {
  return (
    <div>
      <h2 className="font-bold text-lg mb-4" style={{ color: 'var(--adm-text)' }}>Assignments</h2>

      {assignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl border"
          style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <BookOpen size={24} className="text-[#333] mb-3" />
          <p className="text-sm" style={{ color: 'var(--adm-muted)' }}>No assignments yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {assignments.map((a) => {
            const maxScore = a.rubric.reduce((s, r) => s + r.max_score, 0);
            return (
              <Link key={a.id} href={`/home/courses/${courseId}/assignments/${a.id}`}
                className="flex flex-col gap-2 p-5 rounded-2xl border hover:border-white/15 transition-colors"
                style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--adm-text)' }}>{a.title}</h3>
                {a.description && <p className="text-xs line-clamp-2" style={{ color: 'var(--adm-muted)' }}>{a.description}</p>}
                <div className="flex gap-4 text-[11px]" style={{ color: 'var(--adm-muted)' }}>
                  {a.due_date && (
                    <span className="flex items-center gap-1">
                      <Clock size={11} />Due {new Date(a.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                  <span className="flex items-center gap-1"><Users size={11} />{a.reviews_required} peer reviews</span>
                  <span>{maxScore} pts max</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
