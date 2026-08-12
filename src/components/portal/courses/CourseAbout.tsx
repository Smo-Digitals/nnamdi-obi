import { CheckCircle } from 'phosphor-react';

interface Props {
  description: string | null;
  whatYoudGet: string;
  materialsNeeded: string;
}

function splitToItems(text: string): string[] {
  return text
    .split(/\n+/)
    .flatMap((line) => line.split(/(?<=[.!?])\s+(?=[A-Z])/))
    .map((s) => s.trim())
    .filter(Boolean);
}

export function CourseAbout({ description, whatYoudGet, materialsNeeded }: Props) {
  const perks = whatYoudGet ? splitToItems(whatYoudGet) : [];

  return (
    <div className="flex flex-col gap-8">
      {description && (
        <div>
          <h2 className="font-bold text-lg mb-3" style={{ color: 'var(--adm-text)' }}>About Course</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--adm-muted)' }}>{description}</p>
        </div>
      )}

      {perks.length > 0 && (
        <div>
          <h2 className="font-bold text-lg mb-3" style={{ color: 'var(--adm-text)' }}>What You&rsquo;ll Learn</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {perks.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--adm-text)' }}>
                <CheckCircle size={16} weight="fill" className="text-green-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {materialsNeeded && (
        <div>
          <h2 className="font-bold text-lg mb-3" style={{ color: 'var(--adm-text)' }}>Materials Needed</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--adm-muted)' }}>{materialsNeeded}</p>
        </div>
      )}
    </div>
  );
}
