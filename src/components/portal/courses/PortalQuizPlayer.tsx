'use client';

import { useState } from 'react';
import { CheckCircle, XCircle } from 'phosphor-react';
import type { QuizQuestion } from '@/components/dashboard/courses/courseTypes';

interface Props { questions: QuizQuestion[] }

export function PortalQuizPlayer({ questions }: Props) {
  const [answers, setAnswers] = useState<Record<string, Set<string>>>({});
  const [submitted, setSubmitted] = useState(false);

  function toggle(qId: string, optId: string, multiple: boolean) {
    if (submitted) return;
    setAnswers((prev) => {
      const current = new Set(prev[qId] ?? []);
      if (multiple) {
        current.has(optId) ? current.delete(optId) : current.add(optId);
      } else {
        current.clear();
        current.add(optId);
      }
      return { ...prev, [qId]: current };
    });
  }

  const score = questions.filter((q) => {
    const chosen = answers[q.id] ?? new Set();
    const correctIds = new Set(q.options.filter((o) => o.correct).map((o) => o.id));
    return chosen.size === correctIds.size && [...chosen].every((id) => correctIds.has(id));
  }).length;

  return (
    <div className="flex flex-col gap-5">
      {questions.map((q, qi) => {
        const chosen = answers[q.id] ?? new Set();
        return (
          <div key={q.id} className="p-5 rounded-2xl border" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--adm-text)' }}>
              {qi + 1}. {q.question}
            </p>
            <div className="flex flex-col gap-2">
              {q.options.map((o) => {
                const isChosen = chosen.has(o.id);
                const showResult = submitted;
                const correct = showResult && o.correct;
                const wrongChoice = showResult && isChosen && !o.correct;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => toggle(q.id, o.id, q.type === 'multiple')}
                    disabled={submitted}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-left text-xs transition-colors disabled:cursor-default"
                    style={{
                      borderColor: correct ? '#4ade80' : wrongChoice ? '#f87171' : isChosen ? '#DC5B17' : 'var(--adm-border)',
                      backgroundColor: correct ? 'rgba(74,222,128,0.08)' : wrongChoice ? 'rgba(248,113,113,0.08)' : isChosen ? 'rgba(220,91,23,0.08)' : 'transparent',
                      color: 'var(--adm-text)',
                    }}
                  >
                    <span
                      className={`w-4 h-4 shrink-0 flex items-center justify-center border ${q.type === 'multiple' ? 'rounded-md' : 'rounded-full'}`}
                      style={{ borderColor: isChosen ? '#DC5B17' : 'var(--adm-border)', backgroundColor: isChosen ? '#DC5B17' : 'transparent' }}
                    />
                    <span className="flex-1">{o.text}</span>
                    {correct && <CheckCircle size={15} weight="fill" className="text-green-400 shrink-0" />}
                    {wrongChoice && <XCircle size={15} weight="fill" className="text-red-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          className="self-start px-5 py-2.5 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors"
        >
          Check answers
        </button>
      ) : (
        <div className="p-4 rounded-xl border text-sm font-semibold" style={{ borderColor: 'var(--adm-border)', backgroundColor: 'var(--adm-card)', color: 'var(--adm-text)' }}>
          You scored {score} / {questions.length}
        </div>
      )}
    </div>
  );
}
