export function CourseInstructorCard({ instructor }: { instructor: string | null }) {
  if (!instructor) return null;

  return (
    <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
      <p className="font-bold text-sm mb-4" style={{ color: 'var(--adm-text)' }}>Instructor</p>
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
          style={{ backgroundColor: 'rgba(220,91,23,0.15)', color: '#DC5B17' }}>
          {instructor.charAt(0).toUpperCase()}
        </div>
        <p className="font-semibold text-sm" style={{ color: 'var(--adm-text)' }}>{instructor}</p>
      </div>
    </div>
  );
}
