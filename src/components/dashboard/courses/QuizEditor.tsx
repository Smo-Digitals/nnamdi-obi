'use client';

import { Plus, Trash, CheckCircle, Circle } from 'phosphor-react';
import { uid, type QuizQuestion, type QuizOption } from './courseTypes';

interface Props {
  questions: QuizQuestion[];
  onChange: (questions: QuizQuestion[]) => void;
}

const fieldCls = 'w-full px-3 py-2.5 rounded-lg border bg-transparent text-xs outline-none focus:border-[#DC5B17] transition-colors';

export function QuizEditor({ questions, onChange }: Props) {
  const style = { color: 'var(--adm-text)', borderColor: 'var(--adm-border)' };

  function addQuestion() {
    const q: QuizQuestion = { id: uid(), question: '', type: 'single', options: [{ id: uid(), text: '', correct: false }, { id: uid(), text: '', correct: false }] };
    onChange([...questions, q]);
  }
  function updateQuestion(id: string, patch: Partial<QuizQuestion>) {
    onChange(questions.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  }
  function removeQuestion(id: string) { onChange(questions.filter((q) => q.id !== id)); }

  function addOption(q: QuizQuestion) {
    updateQuestion(q.id, { options: [...q.options, { id: uid(), text: '', correct: false }] });
  }
  function updateOption(q: QuizQuestion, optId: string, patch: Partial<QuizOption>) {
    updateQuestion(q.id, { options: q.options.map((o) => (o.id === optId ? { ...o, ...patch } : o)) });
  }
  function toggleCorrect(q: QuizQuestion, optId: string) {
    if (q.type === 'single') {
      updateQuestion(q.id, { options: q.options.map((o) => ({ ...o, correct: o.id === optId })) });
    } else {
      updateOption(q, optId, { correct: !q.options.find((o) => o.id === optId)?.correct });
    }
  }
  function removeOption(q: QuizQuestion, optId: string) {
    updateQuestion(q.id, { options: q.options.filter((o) => o.id !== optId) });
  }

  return (
    <div className="flex flex-col gap-3">
      {questions.map((q, qi) => (
        <div key={q.id} className="rounded-lg border p-3 flex flex-col gap-2.5" style={{ borderColor: 'var(--adm-border)' }}>
          <div className="flex items-center gap-2">
            <input value={q.question} onChange={(e) => updateQuestion(q.id, { question: e.target.value })}
              placeholder={`Question ${qi + 1}…`} className={fieldCls} style={style} />
            <select value={q.type} onChange={(e) => updateQuestion(q.id, { type: e.target.value as QuizQuestion['type'] })}
              className="px-2 py-2.5 rounded-lg border bg-transparent text-xs outline-none shrink-0" style={style}>
              <option value="single">Single answer</option>
              <option value="multiple">Multiple answers</option>
            </select>
            <button onClick={() => removeQuestion(q.id)} className="p-1.5 rounded-md text-[#555] hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0">
              <Trash size={14} />
            </button>
          </div>

          <div className="flex flex-col gap-1.5 pl-1">
            {q.options.map((o) => (
              <div key={o.id} className="flex items-center gap-2">
                <button onClick={() => toggleCorrect(q, o.id)} className={`shrink-0 transition-colors ${o.correct ? 'text-green-400' : 'text-[#555]'}`}>
                  {o.correct ? <CheckCircle size={16} weight="fill" /> : <Circle size={16} />}
                </button>
                <input value={o.text} onChange={(e) => updateOption(q, o.id, { text: e.target.value })}
                  placeholder="Option…" className={fieldCls} style={style} />
                <button onClick={() => removeOption(q, o.id)} className="p-1 rounded-md text-[#555] hover:text-red-400 transition-colors shrink-0">
                  <Trash size={12} />
                </button>
              </div>
            ))}
            <button onClick={() => addOption(q)} className="flex items-center gap-1 text-[11px] font-semibold self-start" style={{ color: '#DC5B17' }}>
              <Plus size={11} weight="bold" /> Add option
            </button>
          </div>
        </div>
      ))}

      <button onClick={addQuestion}
        className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-dashed text-xs font-semibold transition-colors hover:bg-white/5"
        style={{ color: 'var(--adm-muted)', borderColor: 'var(--adm-border)' }}>
        <Plus size={13} weight="bold" /> Add Question
      </button>
    </div>
  );
}
