'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Camera, CheckCircle, WarningCircle } from 'phosphor-react';
import { createClient } from '@/lib/supabase/client';

type Status = { type: 'success' | 'error'; message: string } | null;

const inputCls = 'w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white text-sm placeholder:text-[#444] outline-none focus:border-[#DC5B17] focus:ring-2 focus:ring-[#DC5B17]/20 transition';
const labelCls = 'text-xs font-medium text-[#555] mb-1.5 block';

export default function ProfilePage() {
  const supabase = createClient();
  const fileRef  = useRef<HTMLInputElement>(null);

  const [avatarUrl,  setAvatarUrl]  = useState<string | null>(null);
  const [preview,    setPreview]    = useState<string | null>(null);
  const [file,       setFile]       = useState<File | null>(null);
  const [firstName,  setFirstName]  = useState('');
  const [lastName,   setLastName]   = useState('');
  const [email,      setEmail]      = useState('');
  const [phone,      setPhone]      = useState('');
  const [gender,     setGender]     = useState<'male' | 'female' | ''>('');
  const [address,    setAddress]    = useState('');
  const [saving,     setSaving]     = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [status,     setStatus]     = useState<Status>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? '');

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, bio')
        .eq('id', user.id)
        .single();

      if (profile) {
        const parts = (profile.full_name ?? '').split(' ');
        setFirstName(parts[0] ?? '');
        setLastName(parts.slice(1).join(' ') ?? '');
        setAvatarUrl(profile.avatar_url ?? null);
        setAddress(profile.bio ?? '');
      }
    }
    load();
  }, []);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function deleteAvatar() {
    setPreview(null);
    setFile(null);
    setAvatarUrl(null);
  }

  async function uploadAvatar(): Promise<string | null> {
    if (!file) return avatarUrl;
    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/upload-avatar', { method: 'POST', body: form });
    setUploading(false);
    if (!res.ok) return null;
    const { url } = await res.json() as { url: string };
    return url;
  }

  async function save() {
    setSaving(true);
    setStatus(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    const newAvatarUrl = await uploadAvatar();
    const fullName     = [firstName, lastName].filter(Boolean).join(' ');

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        bio:       address,
        ...(newAvatarUrl !== undefined ? { avatar_url: newAvatarUrl } : {}),
      })
      .eq('id', user.id);

    setSaving(false);
    if (error) {
      setStatus({ type: 'error', message: error.message });
    } else {
      if (newAvatarUrl) setAvatarUrl(newAvatarUrl);
      setFile(null);
      setPreview(null);
      setStatus({ type: 'success', message: 'Profile updated successfully.' });
    }
  }

  const displayAvatar = preview ?? avatarUrl;
  const initials      = [firstName[0], lastName[0]].filter(Boolean).join('').toUpperCase() || 'N';

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-white text-2xl font-bold">Profile</h1>
        <p className="text-[#444] text-sm mt-0.5">Update your personal information and photo.</p>
      </div>

      <div className="bg-[#0e0e0e] border border-white/[0.06] rounded-2xl p-8 flex flex-col gap-8">

        {/* Avatar */}
        <div className="flex items-center gap-6">
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-[#DC5B17] flex items-center justify-center">
              {displayAvatar ? (
                <Image src={displayAvatar} alt="Avatar" fill className="object-cover" />
              ) : (
                <span className="text-white text-3xl font-bold">{initials}</span>
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#DC5B17] border-2 border-[#0e0e0e] flex items-center justify-center text-white hover:bg-[#c44f13] transition-colors"
            >
              <Camera size={14} weight="fill" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => fileRef.current?.click()}
              className="px-5 py-2.5 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors"
            >
              {uploading ? 'Uploading…' : 'Upload New'}
            </button>
            <button
              onClick={deleteAvatar}
              className="px-5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.07] text-[#888] text-sm font-medium hover:text-red-400 hover:border-red-400/20 hover:bg-red-400/5 transition-colors"
            >
              Delete avatar
            </button>
          </div>
        </div>

        {/* First + Last name */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>First Name <span className="text-[#DC5B17]">*</span></label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Last Name <span className="text-[#DC5B17]">*</span></label>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" className={inputCls} />
          </div>
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Email</label>
            <input value={email} disabled placeholder="examples@gmail.com"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-[#555] text-sm cursor-not-allowed" />
          </div>
          <div>
            <label className={labelCls}>Mobile Number <span className="text-[#DC5B17]">*</span></label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.07] focus-within:border-[#DC5B17] focus-within:ring-2 focus-within:ring-[#DC5B17]/20 transition">
              <span className="text-sm shrink-0">🇳🇬</span>
              <span className="text-[#555] text-sm shrink-0">+234</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0806 123 7890"
                className="flex-1 bg-transparent text-white text-sm placeholder:text-[#444] outline-none" />
            </div>
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className={labelCls}>Gender</label>
          <div className="flex gap-3">
            {(['male', 'female'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border text-sm font-medium transition-colors capitalize ${
                  gender === g
                    ? 'border-[#DC5B17] bg-[#DC5B17]/10 text-white'
                    : 'border-white/[0.07] bg-white/[0.04] text-[#666] hover:text-white hover:border-white/20'
                }`}
              >
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${gender === g ? 'border-[#DC5B17]' : 'border-[#444]'}`}>
                  {gender === g && <span className="w-2 h-2 rounded-full bg-[#DC5B17]" />}
                </span>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Residential Address */}
        <div>
          <label className={labelCls}>Residential Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            placeholder="e.g. 12 Broad Street, Lagos Island, Lagos"
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white text-sm placeholder:text-[#444] outline-none focus:border-[#DC5B17] focus:ring-2 focus:ring-[#DC5B17]/20 transition resize-none"
          />
        </div>

        {/* Status */}
        {status && (
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
            status.type === 'success'
              ? 'bg-green-500/10 border border-green-500/20 text-green-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}>
            {status.type === 'success' ? <CheckCircle size={15} weight="fill" /> : <WarningCircle size={15} weight="fill" />}
            {status.message}
          </div>
        )}

        {/* Save */}
        <div>
          <button
            onClick={save}
            disabled={saving || uploading}
            className="px-8 py-3 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>

      </div>
    </div>
  );
}
