'use client';

import { ToggleLeft, ToggleRight, Trash } from 'phosphor-react';
import type { Course } from './courseTypes';

interface Props {
  course: Course;
  onChange: (patch: Partial<Course>) => void;
  onDelete?: () => void;
  deleting: boolean;
}

const STATUSES = ['draft', 'published', 'archived'] as const;

export function PricingTab({ course, onChange, onDelete, deleting }: Props) {
  const pricingModel: 'paid' | 'free' = (course.price ?? 0) > 0 ? 'paid' : 'free';
  const style = { color: 'var(--adm-text)', borderColor: 'var(--adm-border)' };
  const labelCls = 'text-xs font-semibold mb-2 block';
  const cardCls = 'rounded-2xl border p-5';
  const cardStyle = { backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' };
  const inputCls = 'w-full px-4 py-3 rounded-xl border bg-transparent text-sm outline-none focus:border-[#DC5B17] transition-colors';

  function setPricingModel(m: 'paid' | 'free') {
    onChange(m === 'free' ? { price: 0, sale_price: null } : { price: course.price || 1000 });
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className={cardCls} style={cardStyle}>
        <label className={labelCls} style={{ color: 'var(--adm-muted)' }}>Pricing Model</label>
        <div className="flex gap-2 mb-4">
          {([['paid', '#2563eb'], ['free', '#16a34a']] as const).map(([m, color]) => (
            <button key={m} onClick={() => setPricingModel(m)}
              className="hover-brighten flex-1 py-2 rounded-lg text-xs font-semibold border capitalize transition-colors"
              style={pricingModel === m
                ? { backgroundColor: color, borderColor: color, color: '#fff' }
                : { borderColor: 'var(--adm-border)', color: 'var(--adm-muted)' }}>
              {m}
            </button>
          ))}
        </div>

        {pricingModel === 'paid' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium mb-1.5 block" style={{ color: 'var(--adm-muted)' }}>Original Price</label>
              <div className="flex items-center rounded-lg border overflow-hidden" style={{ borderColor: 'var(--adm-border)' }}>
                <span className="px-2.5 text-xs" style={{ color: 'var(--adm-muted)' }}>₦</span>
                <input type="number" min={0} value={course.price ?? 0} onChange={(e) => onChange({ price: Number(e.target.value) })}
                  className="w-full py-2 pr-2.5 bg-transparent text-sm outline-none" style={{ color: 'var(--adm-text)' }} />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-medium mb-1.5 block" style={{ color: 'var(--adm-muted)' }}>Sale Price</label>
              <div className="flex items-center rounded-lg border overflow-hidden" style={{ borderColor: 'var(--adm-border)' }}>
                <span className="px-2.5 text-xs" style={{ color: 'var(--adm-muted)' }}>₦</span>
                <input type="number" min={0} value={course.sale_price ?? ''} onChange={(e) => onChange({ sale_price: e.target.value ? Number(e.target.value) : null })}
                  placeholder="Optional" className="w-full py-2 pr-2.5 bg-transparent text-sm outline-none" style={{ color: 'var(--adm-text)' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={cardCls} style={cardStyle}>
        <label className={labelCls} style={{ color: 'var(--adm-muted)' }}>Coupon Code</label>
        <input value={course.coupon_code ?? ''} onChange={(e) => onChange({ coupon_code: e.target.value || null })}
          placeholder="ex. LAUNCH20" className={inputCls} style={style} />
      </div>

      <div className={cardCls} style={cardStyle}>
        <label className={labelCls} style={{ color: 'var(--adm-muted)' }}>Group Buy</label>
        <button onClick={() => onChange({ group_buy: !course.group_buy })}
          className={`hover-brighten flex items-center gap-2 transition-colors ${course.group_buy ? 'text-green-400' : 'text-[#555]'}`}>
          {course.group_buy ? <ToggleRight size={26} weight="fill" /> : <ToggleLeft size={26} />}
          <span className="text-xs font-medium" style={{ color: 'var(--adm-text)' }}>
            {course.group_buy ? 'Group buy enabled for this course' : 'Group buy disabled'}
          </span>
        </button>
      </div>

      <div className={cardCls} style={cardStyle}>
        <label className={labelCls} style={{ color: 'var(--adm-muted)' }}>Status</label>
        <div className="flex gap-2">
          {STATUSES.map((s) => {
            const color = s === 'published' ? '#16a34a' : s === 'draft' ? '#d97706' : '#6b7280';
            return (
              <button key={s} onClick={() => onChange({ status: s })}
                className="hover-brighten flex-1 py-2 rounded-lg text-xs font-semibold border capitalize transition-colors"
                style={course.status === s
                  ? { backgroundColor: color, borderColor: color, color: '#fff' }
                  : { borderColor: 'var(--adm-border)', color: 'var(--adm-muted)' }}>
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {onDelete && (
        <div className={cardCls} style={cardStyle}>
          <label className={labelCls} style={{ color: 'var(--adm-muted)' }}>Danger Zone</label>
          <button onClick={onDelete} disabled={deleting}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-red-400 text-sm font-semibold hover:bg-red-500/10 transition-colors disabled:opacity-50"
            style={{ borderColor: 'rgba(248,113,113,0.3)' }}>
            <Trash size={14} /> {deleting ? 'Deleting…' : 'Delete course'}
          </button>
        </div>
      )}
    </div>
  );
}
