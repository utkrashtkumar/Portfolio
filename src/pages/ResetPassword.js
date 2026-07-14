import React, { useState } from 'react';
import { Lock, ShieldAlert } from 'lucide-react';
import { SectionHeader } from '../components/Shared.js';
import { getSupabase } from '../supabaseClient.js';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword({ authUser, setAuthUser, setAuthSession }) {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [logs, setLogs] = useState([]);
  const [busy, setBusy] = useState(false);

  const supabase = getSupabase();
  const isConfigured = !!supabase;

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!isConfigured) {
      setErrorMsg('Auth services are currently offline / unconfigured.');
      return;
    }
    if (!authUser) {
      setErrorMsg('Unauthorized session. Please trigger a new recovery link.');
      return;
    }
    if (!newPassword || !confirmPassword || busy) return;
    setErrorMsg('');
    
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setBusy(true);
    setLogs(['[~] Initiating credentials override...', '[~] Committing new passcode hash to secure tables...']);
    await new Promise(r => setTimeout(r, 600));

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setLogs(prev => [...prev, '[SUCCESS] Credential override validated. Signing out recovery session...']);
      await new Promise(r => setTimeout(r, 600));

      // Force sign-out of the recovery session so they can't login directly
      await supabase.auth.signOut();
      setAuthUser(null);
      setAuthSession(null);

      // Redirect to portal with reset success query parameter
      navigate('/portal?resetSuccess=true');
    } catch (err) {
      setErrorMsg(err.message || 'Password update failed.');
      setLogs(prev => [...prev, `[!] Pipeline failed: ${err.message}`]);
      setBusy(false);
    }
  };

  return (
    <section className="py-12 animate-fadeIn space-y-8">
      <SectionHeader num="11" title="Credentials Override Terminal" />

      <div className="glass-panel border border-brand-cyan/25 p-6 max-w-sm mx-auto font-mono text-xs text-slate-300 space-y-4 shadow-xl">
        <div className="border-b border-white/5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-cyan font-bold">
            <Lock className="w-4 h-4 text-brand-cyan animate-pulse" />
            <h4 className="font-display text-xs uppercase tracking-wider">
              Passcode Modification
            </h4>
          </div>
        </div>

        {!isConfigured ? (
          <div className="bg-red-950/20 border border-red-500/30 p-3 rounded-lg text-red-400 text-[0.58rem] leading-normal">
            ⚠️ [ERROR] Authentication server not configured.
          </div>
        ) : !authUser ? (
          <div className="space-y-4">
            <div className="bg-red-950/20 border border-red-500/30 p-3 rounded-lg text-red-400 text-[0.58rem] leading-normal flex items-start gap-1.5 animate-fadeIn">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>[ACCESS DENIED] Unauthorized recovery attempt. Active token session not found or link has expired.</span>
            </div>
            <button
              onClick={() => navigate('/portal')}
              className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/20 text-slate-300 rounded uppercase font-bold tracking-widest cursor-pointer transition-all text-xs"
            >
              Return to Gate
            </button>
          </div>
        ) : (
          <form onSubmit={handlePasswordReset} className="space-y-3.5 animate-fadeIn">
            <p className="text-[0.62rem] text-slate-500 leading-normal">
              Enter your new security passcode. Upon committing, you will be signed out and required to login manually.
            </p>

            <div>
              <label className="text-[0.52rem] text-slate-500 block mb-1 uppercase tracking-wider flex items-center gap-1 font-mono">
                <Lock className="w-3 h-3 text-slate-500" /> New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                disabled={busy}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded text-white outline-none focus:border-brand-cyan/40 transition-all font-mono"
              />
            </div>

            <div>
              <label className="text-[0.52rem] text-slate-500 block mb-1 uppercase tracking-wider flex items-center gap-1 font-mono">
                <Lock className="w-3 h-3 text-slate-500" /> Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                disabled={busy}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded text-white outline-none focus:border-brand-cyan/40 transition-all font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3.5 bg-brand-cyan/20 hover:bg-brand-cyan/35 border border-brand-cyan/50 hover:border-brand-cyan text-brand-cyan rounded-lg uppercase font-bold tracking-widest cursor-pointer active:scale-95 transition-all text-xs shadow-[0_0_15px_rgba(0,245,255,0.15)] hover:shadow-[0_0_25px_rgba(0,245,255,0.3)]"
            >
              {busy ? 'Committing...' : 'Commit New Passcode'}
            </button>

            {logs.length > 0 && (
              <div className="bg-black/60 p-2.5 rounded border border-white/5 text-[0.55rem] text-slate-500 space-y-0.5 font-mono">
                {logs.map((l, i) => <div key={i} className={l.startsWith('[SUCCESS]') ? 'text-brand-green' : ''}>{l}</div>)}
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-950/20 border border-red-500/20 p-2.5 rounded text-red-400 text-[0.58rem]">
                ❌ {errorMsg}
              </div>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
