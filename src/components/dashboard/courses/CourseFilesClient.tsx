'use client';

import { File, FilePdf, FileVideo, FileZip, Trash, DownloadSimple } from 'phosphor-react';
import { SectionLayout } from '../SectionLayout';

type FileType = 'pdf' | 'video' | 'zip' | 'other';
type CourseFile = { id: string; name: string; type: FileType; size: string; course: string; date: string; };

const MOCK: CourseFile[] = [
  { id: '1', name: 'Community Building Workbook.pdf', type: 'pdf', size: '2.4 MB', course: 'Community Building Masterclass', date: '2026-06-10' },
  { id: '2', name: 'Module 1 - Intro to Courses.mp4', type: 'video', size: '148 MB', course: 'Online Course Creation Bootcamp', date: '2026-06-08' },
  { id: '3', name: 'Marketing Templates Pack.zip', type: 'zip', size: '8.7 MB', course: 'Marketing Fundamentals', date: '2026-06-05' },
  { id: '4', name: 'Financial Tracker.pdf', type: 'pdf', size: '1.1 MB', course: 'Financial Literacy for Creators', date: '2026-06-01' },
  { id: '5', name: 'Module 3 - Advanced Tactics.mp4', type: 'video', size: '212 MB', course: 'Community Building Masterclass', date: '2026-05-28' },
];

const ICONS: Record<FileType, React.ComponentType<{ size: number; className?: string }>> = {
  pdf: FilePdf, video: FileVideo, zip: FileZip, other: File,
};

const ICON_COLOR: Record<FileType, string> = {
  pdf: 'text-red-400', video: 'text-blue-400', zip: 'text-yellow-400', other: 'text-[#555]',
};

export function CourseFilesClient() {
  return (
    <SectionLayout
      title="Course Files"
      subtitle="Uploaded resources and materials for all courses"
      cta={{ label: 'Upload File', onClick: () => {} }}
      stats={[
        { label: 'Total Files', value: MOCK.length },
        { label: 'PDFs', value: MOCK.filter((f) => f.type === 'pdf').length },
        { label: 'Videos', value: MOCK.filter((f) => f.type === 'video').length },
      ]}
    >
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--adm-border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--adm-card)', borderBottom: '1px solid var(--adm-border)' }}>
              {['File', 'Course', 'Size', 'Date', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--adm-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK.map((f, i) => {
              const Icon = ICONS[f.type];
              return (
                <tr key={f.id} style={{ backgroundColor: 'var(--adm-card)', borderTop: i > 0 ? '1px solid var(--adm-border)' : undefined }}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className={ICON_COLOR[f.type]} />
                      <p className="text-sm font-medium truncate max-w-xs" style={{ color: 'var(--adm-text)' }}>{f.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>{f.course}</td>
                  <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>{f.size}</td>
                  <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--adm-muted)' }}>
                    {new Date(f.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1.5 justify-end">
                      <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--adm-muted)' }}><DownloadSimple size={14} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors" style={{ color: 'var(--adm-muted)' }}><Trash size={14} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </SectionLayout>
  );
}
