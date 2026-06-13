'use client';

interface Props {
  title: string;
  subtitle?: string;
}

export function PageShell({ title, subtitle }: Props) {
  return (
    <div className="p-8 min-h-full flex flex-col">
      <div className="mb-8">
        <h1 className="font-bold text-2xl" style={{ color: 'var(--adm-text)' }}>{title}</h1>
        {subtitle && (
          <p className="text-sm mt-1" style={{ color: 'var(--adm-muted)' }}>{subtitle}</p>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-24">
        <div
          className="w-16 h-16 rounded-2xl border flex items-center justify-center mb-4"
          style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}
        >
          <div className="w-5 h-5 rounded-full bg-white/10" />
        </div>
        <p className="font-semibold text-sm mb-1" style={{ color: 'var(--adm-text)' }}>
          Coming soon
        </p>
        <p className="text-xs" style={{ color: 'var(--adm-muted)' }}>
          This section is being built
        </p>
      </div>
    </div>
  );
}
