'use client';

import { useState } from 'react';

const SERVICES = ['1:1 Strategy Call', 'Business Audit', 'Course Consultation', 'Brand Review', 'Group Workshop'];
const DURATIONS = ['30 min', '45 min', '60 min', '90 min', '120 min'];

export function CreateBookingClient() {
  const [service, setService] = useState('');
  const [duration, setDuration] = useState('60 min');
  const [price, setPrice] = useState('');
  const [slots, setSlots] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-bold text-2xl" style={{ color: 'var(--adm-text)' }}>Create Booking Service</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--adm-muted)' }}>Set up a new bookable service or session type</p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--adm-muted)' }}>SERVICE NAME</label>
          <select value={service} onChange={(e) => setService(e.target.value)} className="w-full bg-transparent text-base outline-none" style={{ color: service ? 'var(--adm-text)' : 'var(--adm-muted)' }}>
            <option value="">Select or enter a service name...</option>
            {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--adm-muted)' }}>DURATION</label>
            <div className="flex flex-wrap gap-2">
              {DURATIONS.map((d) => (
                <button key={d} onClick={() => setDuration(d)} className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors border ${duration === d ? 'bg-[#DC5B17]/20 text-[#DC5B17] border-[#DC5B17]/20' : 'bg-white/5 text-[#555] border-white/5 hover:text-white'}`}>{d}</button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
            <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--adm-muted)' }}>PRICE (₦)</label>
            <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 50000" type="number" className="w-full bg-transparent text-sm outline-none placeholder:opacity-30" style={{ color: 'var(--adm-text)' }} />
          </div>
        </div>

        <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--adm-muted)' }}>WEEKLY SLOTS AVAILABLE</label>
          <input value={slots} onChange={(e) => setSlots(e.target.value)} placeholder="e.g. 5 slots per week" className="w-full bg-transparent text-sm outline-none placeholder:opacity-30" style={{ color: 'var(--adm-text)' }} />
        </div>

        <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}>
          <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--adm-muted)' }}>DESCRIPTION</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What will clients get from this session?" rows={3} className="w-full bg-transparent text-sm outline-none resize-none placeholder:opacity-30" style={{ color: 'var(--adm-text)' }} />
        </div>

        <div className="flex items-center gap-3 justify-end">
          <button className="px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:bg-white/5" style={{ color: 'var(--adm-muted)', borderColor: 'var(--adm-border)' }}>Cancel</button>
          <button className="px-6 py-2.5 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors">Create Service</button>
        </div>
      </div>
    </div>
  );
}
