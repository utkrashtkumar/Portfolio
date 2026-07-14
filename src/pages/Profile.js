import React, { useState, useEffect, useRef } from 'react';
import { User, Phone, Mail, Lock, ShieldCheck, Sparkles, Upload, RefreshCw, LogOut, CheckCircle2 } from 'lucide-react';
import { SectionHeader } from '../components/Shared.js';
import { getSupabase } from '../supabaseClient.js';
import { useNavigate } from 'react-router-dom';

const PRESET_AVATARS = [
  {
    name: 'Cyber Skull',
    color: '#4ade80',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23060a0f"><rect width="100" height="100" fill="%23060a0f" stroke="%234ade80" stroke-width="4"/><path d="M30 40a20 20 0 1 1 40 0c0 10-5 18-12 21v12H42V61c-7-3-12-11-12-21z" fill="%231f2937" stroke="%234ade80" stroke-width="3"/><circle cx="40" cy="40" r="4" fill="%234ade80"/><circle cx="60" cy="40" r="4" fill="%234ade80"/><path d="M45 52h10M48 65h4" stroke="%234ade80" stroke-width="2"/></svg>`
  },
  {
    name: 'Cyber Shield',
    color: '#a855f7',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23060a0f"><rect width="100" height="100" fill="%23060a0f" stroke="%23a855f7" stroke-width="4"/><path d="M50 20L80 30V55C80 70 68 82 50 87C32 82 20 70 20 55V30L50 20Z" fill="%231f2937" stroke="%23a855f7" stroke-width="3"/><path d="M50 35v25M40 45l10-10 10 10" stroke="%23a855f7" stroke-width="3" stroke-linecap="round"/></svg>`
  },
  {
    name: 'Cyber Prompt',
    color: '#00f5ff',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23060a0f"><rect width="100" height="100" fill="%23060a0f" stroke="%2300f5ff" stroke-width="4"/><path d="M30 35l15 15-15 15M50 65h20" stroke="%2300f5ff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  {
    name: 'Cyber Agent',
    color: '#f59e0b',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23060a0f"><rect width="100" height="100" fill="%23060a0f" stroke="%23f59e0b" stroke-width="4"/><circle cx="50" cy="35" r="16" fill="%231f2937" stroke="%23f59e0b" stroke-width="3"/><path d="M25 75c0-14 11-25 25-25s25 11 25 25z" fill="%231f2937" stroke="%23f59e0b" stroke-width="3"/></svg>`
  }
];

export default function Profile({ authUser, setAuthUser, setAuthSession }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Profile forms state
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  // Password and email updates state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // Status and Telemetry Logs
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [logs, setLogs] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!authUser) {
      navigate('/portal');
      return;
    }
    // Set initial profile states from user metadata
    setName(authUser.user_metadata?.name || '');
    setMobile(authUser.user_metadata?.mobile || '');
    setAvatarUrl(authUser.user_metadata?.avatar_url || '');
    setLogs(['[+] Syncing profile registries from remote auth schemas...', '[SUCCESS] Connection stable. Ready for modification.']);
  }, [authUser, navigate]);

  const handlePresetSelect = (url, presetName) => {
    setAvatarUrl(url);
    setLogs(prev => [...prev, `[~] Staged preset avatar: ${presetName}`]);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Invalid file type. Please upload an image file.');
      return;
    }

    setLogs(prev => [...prev, `[~] Loading image payload: ${file.name}...`]);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 120;
        const MAX_HEIGHT = 120;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Output compressed JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setAvatarUrl(compressedDataUrl);
        setLogs(prev => [...prev, '[SUCCESS] Image resized client-side to 120x120px to optimize database payload. Staged successfully.']);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const supabase = getSupabase();
    if (!supabase) {
      setErrorMsg('Auth services are currently offline / unconfigured.');
      return;
    }

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!mobile.trim()) {
      setErrorMsg('Please enter your mobile number.');
      return;
    }

    setBusy(true);
    setLogs(prev => [...prev, '[~] Launching profile modification sequence...', '[~] Uploading metadata payload mapping to Auth database...']);
    await new Promise(r => setTimeout(r, 600));

    try {
      const { data: { user }, error } = await supabase.auth.updateUser({
        data: {
          name: name.trim(),
          mobile: mobile.trim(),
          avatar_url: avatarUrl
        }
      });

      if (error) throw error;

      setLogs(prev => [...prev, '[SUCCESS] Profile metadata registry saved successfully!']);
      setSuccessMsg('Profile records updated successfully!');
      setAuthUser(user);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile details.');
      setLogs(prev => [...prev, `[!] Modification pipeline failed: ${err.message}`]);
    }
    setBusy(false);
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const supabase = getSupabase();
    if (!supabase) {
      setErrorMsg('Auth services are currently offline / unconfigured.');
      return;
    }

    if (!newEmail.trim()) {
      setErrorMsg('Please enter the target email address.');
      return;
    }

    if (newEmail.trim() === authUser.email) {
      setErrorMsg('Target email matches current active registry.');
      return;
    }

    setBusy(true);
    setLogs(prev => [...prev, '[~] Initializing email migration handshake...', '[~] Dispatching dual verification tokens...']);
    await new Promise(r => setTimeout(r, 600));

    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail.trim()
      });

      if (error) throw error;

      setLogs(prev => [...prev, '[SUCCESS] Email change token dispatched to both old and new targets.']);
      setSuccessMsg('Migration initiated. Check both inboxes to confirm email change.');
      setNewEmail('');
    } catch (err) {
      setErrorMsg(err.message || 'Email update failed.');
      setLogs(prev => [...prev, `[!] Migration failed: ${err.message}`]);
    }
    setBusy(false);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const supabase = getSupabase();
    if (!supabase) {
      setErrorMsg('Auth services are currently offline / unconfigured.');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setErrorMsg('Please type your new password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    setBusy(true);
    setLogs(prev => [...prev, '[~] Initializing credential override token sequence...', '[~] Verifying secure handshake channels...']);
    await new Promise(r => setTimeout(r, 600));

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setLogs(prev => [...prev, '[SUCCESS] New passcode registry updated successfully!']);
      setSuccessMsg('Your security password has been changed.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMsg(err.message || 'Password update failed.');
      setLogs(prev => [...prev, `[!] Handshake failed: ${err.message}`]);
    }
    setBusy(false);
  };

  const handleSignOut = async () => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setAuthUser(null);
    setAuthSession(null);
    navigate('/portal');
  };

  if (!authUser) return null;

  return (
    <div className="py-12 animate-fadeIn space-y-8 max-w-4xl mx-auto">
      <SectionHeader num="10" title="Agent Profile Console" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Avatar Panel */}
        <div className="md:col-span-1 glass-panel border border-brand-cyan/20 p-6 flex flex-col items-center justify-start text-center space-y-4">
          <h4 className="font-display text-xs text-brand-cyan uppercase tracking-wider font-bold border-b border-white/5 pb-2 w-full text-center">
            Avatar Registry
          </h4>

          {/* Current Avatar Display */}
          <div className="relative group w-24 h-24 rounded-full overflow-hidden border-2 border-brand-cyan/40 bg-black/40 hover:border-brand-purple/50 transition-colors flex items-center justify-center">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Agent Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-brand-cyan/40" />
            )}
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={busy}
              className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-slate-300 hover:text-white"
            >
              <Upload className="w-4 h-4 mb-1 text-brand-cyan" />
              <span className="text-[0.55rem] uppercase font-bold font-mono">Upload Image</span>
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <p className="text-[0.52rem] text-slate-500 font-mono leading-normal">
            JPEG/PNG. Max size: 2MB.<br/>
            Files resize automatically to 120x120px to protect database packets.
          </p>

          {/* Preset Avatar Grid Selector */}
          <div className="w-full space-y-2 pt-2 border-t border-white/5">
            <label className="text-[0.52rem] text-slate-500 block uppercase tracking-wider font-bold font-mono text-left">
              Hacker Presets:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_AVATARS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handlePresetSelect(preset.url, preset.name)}
                  disabled={busy}
                  className={`w-10 h-10 rounded border overflow-hidden flex items-center justify-center p-0.5 cursor-pointer bg-black/35 hover:scale-105 transition-transform ${avatarUrl === preset.url ? 'border-brand-cyan shadow-[0_0_8px_rgba(0,245,255,0.4)]' : 'border-white/10'}`}
                  title={preset.name}
                >
                  <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={busy}
            className="w-full py-2 bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[0.62rem] rounded uppercase font-bold tracking-wider hover:bg-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Terminate Session
          </button>
        </div>

        {/* Right Side: Details Forms */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Form 1: Profile Information */}
          <form onSubmit={handleSaveProfile} className="glass-panel border border-brand-cyan/20 p-6 space-y-4">
            <h4 className="font-display text-xs text-brand-cyan uppercase tracking-wider font-bold border-b border-white/5 pb-2">
              Profile Configurations
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[0.52rem] text-slate-500 block mb-1 uppercase tracking-wider flex items-center gap-1 font-mono">
                  <User className="w-3 h-3 text-slate-500" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={busy}
                  placeholder="Alex Mercer"
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded text-white outline-none focus:border-brand-cyan/40 transition-all font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-[0.52rem] text-slate-500 block mb-1 uppercase tracking-wider flex items-center gap-1 font-mono">
                  <Phone className="w-3 h-3 text-slate-500" /> Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  disabled={busy}
                  placeholder="+1 (555) 019-2834"
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded text-white outline-none focus:border-brand-cyan/40 transition-all font-mono text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[0.52rem] text-slate-500 block mb-1 uppercase tracking-wider flex items-center gap-1 font-mono">
                  <Mail className="w-3 h-3 text-slate-500" /> Primary Email (Read-Only)
                </label>
                <input
                  type="email"
                  disabled
                  value={authUser.email}
                  className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded text-slate-500 outline-none font-mono text-xs select-all cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="px-5 py-2.5 bg-brand-cyan/15 hover:bg-brand-cyan/25 border border-brand-cyan/35 text-brand-cyan rounded uppercase font-bold tracking-wider cursor-pointer active:scale-95 transition-all disabled:opacity-40 font-mono text-[0.62rem]"
            >
              Update Registry Parameters
            </button>
          </form>

          {/* Form 1.5: Email Migration Console */}
          <form onSubmit={handleUpdateEmail} className="glass-panel border border-brand-cyan/20 p-6 space-y-4">
            <h4 className="font-display text-xs text-brand-cyan uppercase tracking-wider font-bold border-b border-white/5 pb-2">
              Email Routing Migration
            </h4>
            
            <div className="space-y-3">
              <p className="text-[0.58rem] text-slate-500 leading-normal font-mono">
                Initiate a primary email address re-routing handshake. Note: Supabase will dispatch validation tokens to **both** your current email ({authUser.email}) and the new target email. The migration is completed only when both links are clicked.
              </p>
              <div>
                <label className="text-[0.52rem] text-slate-500 block mb-1 uppercase tracking-wider flex items-center gap-1 font-mono">
                  <Mail className="w-3 h-3 text-slate-500" /> New Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  disabled={busy}
                  placeholder="new-agent@kali-console.net"
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded text-white outline-none focus:border-brand-cyan/40 transition-all font-mono text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={busy || !newEmail.trim() || newEmail.trim() === authUser.email}
              className="px-5 py-2.5 bg-brand-cyan/15 hover:bg-brand-cyan/25 border border-brand-cyan/35 text-brand-cyan rounded uppercase font-bold tracking-wider cursor-pointer active:scale-95 transition-all disabled:opacity-40 font-mono text-[0.62rem]"
            >
              Initiate Email Migration
            </button>
          </form>

          {/* Form 2: Password Reset */}
          <form onSubmit={handleUpdatePassword} className="glass-panel border border-brand-purple/20 p-6 space-y-4">
            <h4 className="font-display text-xs text-brand-purple uppercase tracking-wider font-bold border-b border-white/5 pb-2">
              Credentials Override Vault
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[0.52rem] text-slate-500 block mb-1 uppercase tracking-wider flex items-center gap-1 font-mono">
                  <Lock className="w-3 h-3 text-slate-500" /> New Passcode
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  disabled={busy}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded text-white outline-none focus:border-brand-purple/40 transition-all font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-[0.52rem] text-slate-500 block mb-1 uppercase tracking-wider flex items-center gap-1 font-mono">
                  <Lock className="w-3 h-3 text-slate-500" /> Confirm Passcode
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  disabled={busy}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded text-white outline-none focus:border-brand-purple/40 transition-all font-mono text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="px-5 py-2.5 bg-brand-purple/15 hover:bg-brand-purple/25 border border-brand-purple/35 text-brand-purple rounded uppercase font-bold tracking-wider cursor-pointer active:scale-95 transition-all disabled:opacity-40 font-mono text-[0.62rem]"
            >
              Commit Credentials Override
            </button>
          </form>

          {/* Global Alert and Logs Display */}
          {(errorMsg || successMsg || logs.length > 0) && (
            <div className="glass-panel border border-white/5 p-4 space-y-3 animate-fadeIn font-mono text-xs">
              {errorMsg && (
                <div className="bg-red-950/20 border border-red-500/20 p-2.5 rounded text-red-400 text-[0.58rem]">
                  ❌ {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="bg-brand-green/10 border border-brand-green/20 p-2.5 rounded text-brand-green text-[0.58rem] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-green animate-pulse" /> {successMsg}
                </div>
              )}
              {logs.length > 0 && (
                <div className="bg-black/60 p-3 rounded-lg border border-white/5 text-[0.55rem] text-slate-500 space-y-0.5 max-h-[120px] overflow-y-auto">
                  {logs.map((l, i) => <div key={i} className={l.startsWith('[SUCCESS]') ? 'text-brand-green font-bold' : l.startsWith('[!') ? 'text-red-400' : ''}>{l}</div>)}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
