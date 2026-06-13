'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Camera, CheckCircle, WarningCircle } from 'phosphor-react';
import { createClient } from '@/lib/supabase/client';

type Status = { type: 'success' | 'error'; message: string } | null;

export default function ProfilePage() {
  const supabase = createClient();
  const fileRef  = useRef<HTMLInputElement>(null);

  const [avatarUrl,  setAvatarUrl]  = useState<string | null>(null);
  const [preview,    setPreview]    = useState<string | null>(null);
  const [file,       setFile]       = useState<File | null>(null);
  const [fullName,   setFullName]   = useState('');
  const [email,      setEmail]      = useState('');
  const [bio,        setBio]        = useState('');
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
        setFullName(profile.full_name ?? '');
        setAvatarUrl(profile.avatar_url ?? null);
        setBio(profile.bio ?? '');
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

  async function uploadAvatar(): Promise<string | null> {
    if (!file) return avatarUrl;
    setUploading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const ext  = file.name.split('.').pop();
    const path = `avatars/${user.id}.${ext}`;

    const { error } = await supabase.storage
      .from('profiles')
      .upload(path, file, { upsert: true });

    if (error) { setUploading(false); return null; }

    const { data } = supabase.storage.from('profiles').getPublicUrl(path);
    setUploading(false);
    return data.publicUrl;
  }

  async function save() {
    setSaving(true);
    setStatus(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    const newAvatarUrl = await uploadAvatar();

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name:  fullName,
        bio,
        ...(newAvatarUrl ? { avatar_url: newAvatarUrl } : {}),
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
  const initials      = fullName ? fullName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() : 'N';

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-white text-2xl font-bold">Profile</h1>
        <p className="text-[#444] text-sm mt-0.5">Update your personal information and photo.</p>
      </div>

      <div className="bg-[#0e0e0e] border border-white/[0.06] rounded-2xl overflow-hidden">

        {/* Avatar section */}
        <div className="flex items-center gap-6 p-6 border-b border-white/[0.06]">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-[#DC5B17] flex items-center justify-center">
              {displayAvatar ? (
                <Image src={displayAvatar} alt="Avatar" fill className="object-cover" />
              ) : (
                <span className="text-white text-2xl font-bold">{initials}</span>
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#DC5B17] border-2 border-[#0e0e0e] flex items-center justify-center text-white hover:bg-[#c44f13] transition-colors"
            >
              <Camera size={13} weight="fill" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
          </div>

          <div>
            <p className="text-white font-semibold">{fullName || 'Nnamdi Obi'}</p>
            <p className="text-[#555] text-xs mb-3">{email}</p>
            <button
              onClick={() => fileRef.current?.click()}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.07] text-[#888] hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              {uploading ? 'Uploading…' : 'Change photo'}
            </button>
            {preview && (
              <button
                onClick={() => { setPreview(null); setFile(null); }}
                className="ml-2 text-xs px-3 py-1.5 rounded-lg text-[#555] hover:text-red-400 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {/* Form fields */}
        <div className="p-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#555]">Full name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white text-sm placeholder:text-[#444] outline-none focus:border-[#DC5B17] focus:ring-2 focus:ring-[#DC5B17]/20 transition"
                placeholder="Your full name"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#555]">Email</label>
              <input
                value={email}
                disabled
                className="px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-[#555] text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#555]">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white text-sm placeholder:text-[#444] outline-none focus:border-[#DC5B17] focus:ring-2 focus:ring-[#DC5B17]/20 transition resize-none"
              placeholder="Tell your community a bit about yourself…"
            />
          </div>

          {/* Status message */}
          {status && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
              status.type === 'success'
                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              {status.type === 'success'
                ? <CheckCircle size={15} weight="fill" />
                : <WarningCircle size={15} weight="fill" />
              }
              {status.message}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={save}
              disabled={saving || uploading}
              className="px-6 py-2.5 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
