'use client';

import { useState } from 'react';
import { CheckCircle, Lock } from 'phosphor-react';

interface Props { courseId: string; initiallyEnrolled: boolean }

export function EnrollButton({ courseId, initiallyEnrolled }: Props) {
  const [enrolled, setEnrolled] = useState(initiallyEnrolled);
  const [loading,  setLoading]  = useState(false);

  async function enroll() {
    setLoading(true);
    const res = await fetch('/api/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ course_id: courseId }),
    });
    setLoading(false);
    if (res.ok) setEnrolled(true);
  }

  if (enrolled) {
    return (
      <span className="flex items-center gap-1.5 text-xs font-semibold text-green-400">
        <CheckCircle size={15} weight="fill" /> You're enrolled
      </span>
    );
  }

  return (
    <button onClick={enroll} disabled={loading}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors disabled:opacity-50">
      <Lock size={14} weight="bold" />
      {loading ? 'Enrolling…' : 'Enroll Now'}
    </button>
  );
}
