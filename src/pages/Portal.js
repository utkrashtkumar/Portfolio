import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Mail, ShieldAlert, CheckCircle2, RotateCw, User, Phone, Sparkles } from 'lucide-react';
import { SectionHeader } from '../components/Shared.js';
import { getSupabase, getSupabaseConfig, saveSupabaseConfig, rebindSupabase } from '../supabaseClient.js';

const UserSessionDashboard = ({ user, session, onSignOut }) => {
  const [comment, setComment] = useState('');
  const [ledger, setLedger] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [logs, setLogs] = useState([]);

  const loadLedger = async () => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('guestbook')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) {
          setLedger(data.map((d) => ({ email: d.email, comment: d.comment, date: new Date(d.created_at).toLocaleDateString() })));
          return;
        }
      } catch (e) {}
    }
    const local = JSON.parse(localStorage.getItem('utk_auth_guestbook') || '[]');
    setLedger(local);
  };

  useEffect(() => {
    loadLedger();
  }, []);

  const handlePost = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    setLogs(['[~] Establishing secure ledger transaction...', '[*] Encoding payload registers...']);
    await new Promise(r => setTimeout(r, 400));

    const supabase = getSupabase();
    let success = false;

    if (supabase) {
      try {
        const { error } = await supabase
          .from('guestbook')
          .insert([{ email: user.email, comment: comment.trim() }]);
        if (!error) {
          setLogs(prev => [...prev, '[SUCCESS] Block verified and committed to remote tables.']);
          success = true;
        } else {
          setLogs(prev => [...prev, `[!] Remote table check failed: ${error.message}`, `[*] Appending payload to local storage registry.`]);
        }
      } catch (e) {
        setLogs(prev => [...prev, '[!] Exception occurred during remote table check. Appending payload to local storage registry.']);
      }
    }

    if (!success) {
      const local = JSON.parse(localStorage.getItem('utk_auth_guestbook') || '[]');
      const newEntry = { email: user.email, comment: comment.trim(), date: new Date().toLocaleDateString() };
      localStorage.setItem('utk_auth_guestbook', JSON.stringify([newEntry, ...local]));
      setLedger([newEntry, ...local]);
      setLogs(prev => [...prev, '[SUCCESS] Committed to local registry fallback successfully.']);
    }

    setComment('');
    setSubmitting(false);
    setTimeout(() => setLogs([]), 2500);
    loadLedger();
  };

  const maskedToken = session?.access_token 
    ? `${session.access_token.substring(0, 16)}...${session.access_token.substring(session.access_token.length - 16)}` 
    : 'NO_SESSION_TOKEN';

  return (
    <div className="glass-panel border border-brand-cyan/30 p-6 space-y-6 max-w-2xl mx-auto animate-fadeIn font-mono text-xs text-slate-300">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2 text-brand-cyan font-bold">
          <Unlock className="w-5 h-5 text-brand-cyan animate-pulse" />
          <h4 className="font-display text-sm uppercase tracking-wider">Secure Developer Console</h4>
        </div>
        <button
          onClick={onSignOut}
          className="px-3.5 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 text-[0.62rem] rounded uppercase font-bold tracking-wider hover:bg-red-500/25 cursor-pointer active:scale-95 transition-all"
        >
          Sign Out Session
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-brand-cyan/5 border border-brand-cyan/20 p-3 rounded-lg flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-cyan animate-blink" />
          <span className="text-white text-[0.65rem] font-bold">SESSION STATE: SIGNED_IN</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[0.6rem]">
          <div className="bg-black/40 p-2.5 rounded border border-white/5">
            <span className="text-slate-500 block uppercase text-[0.5rem] mb-0.5">Agent Name</span>
            <span className="text-white font-bold">{user.user_metadata?.name || 'Anonymous Agent'}</span>
          </div>
          <div className="bg-black/40 p-2.5 rounded border border-white/5">
            <span className="text-slate-500 block uppercase text-[0.5rem] mb-0.5">Mobile Registry</span>
            <span className="text-white font-bold">{user.user_metadata?.mobile || 'Not Registered'}</span>
          </div>
          <div className="bg-black/40 p-2.5 rounded border border-white/5">
            <span className="text-slate-500 block uppercase text-[0.5rem] mb-0.5">Hacker Email</span>
            <span className="text-white font-bold">{user.email}</span>
          </div>
          <div className="bg-black/40 p-2.5 rounded border border-white/5">
            <span className="text-slate-500 block uppercase text-[0.5rem] mb-0.5">Authentication ID</span>
            <span className="text-white font-bold truncate block">{user.id}</span>
          </div>
          <div className="bg-black/40 p-2.5 rounded border border-white/5 md:col-span-2">
            <span className="text-slate-500 block uppercase text-[0.5rem] mb-0.5">Active Session JWT</span>
            <span className="text-brand-purple font-bold break-all block mt-0.5">{maskedToken}</span>
          </div>
        </div>

        <div className="border-t border-white/5 pt-4 space-y-3">
          <div className="font-display font-semibold text-white tracking-wider uppercase text-[0.65rem]">✍ Log Signature to Guestbook Ledger</div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Sign the guestbook ledger..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              disabled={submitting}
              className="flex-1 px-3 py-2 bg-black/60 border border-white/10 rounded font-mono text-xs text-white outline-none focus:border-brand-cyan/50"
            />
            <button
              onClick={handlePost}
              disabled={submitting || !comment.trim()}
              className="px-4 py-2 bg-brand-cyan/15 hover:bg-brand-cyan/25 border border-brand-cyan/30 text-brand-cyan rounded uppercase font-bold tracking-wider cursor-pointer active:scale-95 transition-all disabled:opacity-40"
            >
              Sign
            </button>
          </div>

          {logs.length > 0 && (
            <div className="bg-black/80 p-2.5 rounded border border-white/5 text-[0.55rem] text-slate-500 space-y-0.5">
              {logs.map((l, idx) => <div key={idx} className={l.startsWith('[SUCCESS]') ? 'text-brand-green' : ''}>{l}</div>)}
            </div>
          )}

          <div className="space-y-2 mt-4">
            <div className="text-slate-500 uppercase text-[0.5rem] font-bold">Ledger Records:</div>
            {ledger.length === 0 ? (
              <div className="text-slate-600 italic text-[0.58rem] py-2">No sign logs on this node.</div>
            ) : (
              <div className="max-h-[150px] overflow-y-auto divide-y divide-white/3 border border-white/5 rounded-lg bg-black/20">
                {ledger.map((entry, i) => (
                  <div key={i} className="p-2.5 text-[0.58rem] flex justify-between items-start">
                    <div className="space-y-0.5">
                      <span className="text-brand-cyan font-bold block">{entry.email}</span>
                      <span className="text-white italic">"{entry.comment}"</span>
                    </div>
                    <span className="text-slate-600 text-[0.52rem] shrink-0">{entry.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};const AuthPortal = ({ onAuthSuccess }) => {
  const [view, setView] = useState('signin'); // signin | signup | forgot | magic | verify
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [logs, setLogs] = useState([]);
  const [busy, setBusy] = useState(false);

  const queryParams = new URLSearchParams(window.location.search);
  const isConfirmed = queryParams.get('confirmed') === 'true';

  const supabase = getSupabase();
  const isConfigured = !!supabase;

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!isConfigured) {
      setErrorMsg('Auth services are currently offline / unconfigured.');
      return;
    }
    if (!email || !password || busy) return;
    setErrorMsg('');
    
    if (view === 'signup') {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (!mobile.trim()) {
        setErrorMsg('Please enter your mobile number.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
    }

    setBusy(true);
    setLogs(['[~] Contacting Core Auth Portal...', '[~] Verifying user credentials digests...']);
    await new Promise(r => setTimeout(r, 600));

    try {
      if (view === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.toLowerCase().includes("confirm") || error.message.toLowerCase().includes("verified") || error.message.toLowerCase().includes("confirmed")) {
            setLogs(prev => [...prev, '[!] Access Denied: Email verification required.']);
            setView('verify');
            setBusy(false);
            return;
          }
          throw error;
        }
        setLogs(prev => [...prev, '[SUCCESS] Authentication handshake validated. Logging session...']);
        await new Promise(r => setTimeout(r, 400));
        onAuthSuccess(data.user, data.session);
      } else {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              name: name.trim(),
              mobile: mobile.trim()
            }
          }
        });
        if (error) throw error;
        setLogs(prev => [...prev, '[SUCCESS] Account registry created. Verification sent.']);
        setView('verify');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Auth handshake failed.');
      setLogs(prev => [...prev, `[!] Handshake failed: ${err.message}`]);
    }
    setBusy(false);
  };

  const handleResend = async () => {
    if (!supabase || !email) return;
    setBusy(true);
    setLogs(prev => [...prev, `[~] Resending verification dispatch to: ${email}...`]);
    await new Promise(r => setTimeout(r, 600));
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password: password || "tempPasswordForResend123!",
        options: {
          data: {
            name: name.trim(),
            mobile: mobile.trim()
          }
        }
      });
      if (error && !error.message.includes("already registered")) {
        throw error;
      }
      setLogs(prev => [...prev, '[SUCCESS] New verification dispatch queued successfully.']);
    } catch (err) {
      setErrorMsg(err.message || 'Verification resend failed.');
      setLogs(prev => [...prev, `[-] Resend failed: ${err.message}`]);
    }
    setBusy(false);
  };

  const handleResetRequest = async (e) => {
    e.preventDefault();
    if (!email || busy) return;
    setErrorMsg('');
    setBusy(true);
    setLogs(['[~] Initiating credentials recovery dispatch...', `[~] Mailing recovery token to: ${email}...`]);
    await new Promise(r => setTimeout(r, 600));

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/profile`
      });
      if (error) throw error;
      setLogs(prev => [...prev, '[SUCCESS] Password recovery dispatch sent. Check your inbox.']);
      setView('verify');
    } catch (err) {
      setErrorMsg(err.message || 'Recovery request failed.');
      setLogs(prev => [...prev, `[!] Pipeline failed: ${err.message}`]);
    }
    setBusy(false);
  };

  const handleMagicLinkRequest = async (e) => {
    e.preventDefault();
    if (!email || busy) return;
    setErrorMsg('');
    setBusy(true);
    setLogs(['[~] Queueing magic link token generator...', `[~] Mailing passwordless key to: ${email}...`]);
    await new Promise(r => setTimeout(r, 600));

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: `${window.location.origin}/portal`
        }
      });
      if (error) throw error;
      setLogs(prev => [...prev, '[SUCCESS] Magic link token generated and dispatched successfully.']);
      setView('verify');
    } catch (err) {
      setErrorMsg(err.message || 'Magic link request failed.');
      setLogs(prev => [...prev, `[!] Pipeline failed: ${err.message}`]);
    }
    setBusy(false);
  };

  return (
    <div className="glass-panel border border-brand-cyan/25 p-6 max-w-sm mx-auto font-mono text-xs text-slate-300 space-y-4 shadow-xl">
      <div className="border-b border-white/5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-brand-cyan font-bold">
          <Lock className="w-4 h-4 text-brand-cyan animate-pulse" />
          <h4 className="font-display text-xs uppercase tracking-wider">
            {view === 'verify' ? 'Verification Hub' : 'Authentication Gateways'}
          </h4>
        </div>
        {isConfigured && view !== 'verify' && (
          <button 
            type="button"
            onClick={() => {
              setView(view === 'signin' ? 'signup' : 'signin');
              setErrorMsg('');
              setLogs([]);
            }}
            className="text-brand-purple hover:underline text-[0.55rem] uppercase cursor-pointer"
          >
            {view === 'signin' ? 'Sign Up Account' : 'Sign In Account'}
          </button>
        )}
      </div>

      {isConfirmed && (
        <div className="bg-brand-green/10 border border-brand-green/20 p-3 rounded-lg text-brand-green text-[0.58rem] leading-normal font-mono flex items-center gap-1.5 animate-fadeIn">
          <CheckCircle2 className="w-3.5 h-3.5 text-brand-green shrink-0 animate-bounce" /> [SUCCESS] Email verified successfully. Please authenticate session below.
        </div>
      )}

      {!isConfigured && (
        <div className="bg-red-950/20 border border-red-500/30 p-3 rounded-lg text-red-400 text-[0.58rem] leading-normal font-mono">
          ⚠️ [ERROR] Authentication server not configured. Please define the required environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
        </div>
      )}

      {isConfigured && view !== 'verify' && (
        <div className="bg-gradient-to-r from-brand-cyan/10 via-brand-purple/10 to-brand-cyan/10 border border-brand-cyan/20 rounded-xl p-3.5 text-center space-y-2 relative overflow-hidden animate-fadeIn">
          <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-brand-cyan/15 rounded-full text-[0.55rem] text-brand-cyan uppercase tracking-widest font-bold">
            <Sparkles className="w-3 h-3 text-brand-cyan animate-pulse animate-blink" /> Special Access
          </div>
          <p className="text-white font-display text-[0.68rem] leading-relaxed font-semibold">
            Sign up for a FREE account to unlock premium interactive simulators, mini-games, advanced security skills, and labs!
          </p>
        </div>
      )}

      {view === 'verify' ? (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-brand-cyan/5 border border-brand-cyan/20 p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
              <Mail className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h5 className="text-white font-bold text-xs uppercase">Check Verification Mail</h5>
              <p className="text-slate-400 text-[0.6rem] leading-normal max-w-xs">
                A verification link has been dispatched to:
              </p>
              <span className="text-brand-cyan text-[0.65rem] font-bold block select-all break-all">{email}</span>
            </div>
          </div>

          <p className="text-[0.58rem] text-slate-500 leading-normal">
            Database security protocols require email validation before granting console tokens. Click the link inside the confirmation email to complete credentials registration.
          </p>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={busy}
              className="w-full py-2 bg-brand-purple/20 hover:bg-brand-purple/30 border border-brand-purple/40 text-brand-purple rounded uppercase font-bold tracking-wider cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCw className={`w-3.5 h-3.5 ${busy ? 'animate-spin' : ''}`} />
              Resend Verification Email
            </button>
            
            <button
              type="button"
              onClick={() => {
                setView('signin');
                setErrorMsg('');
                setLogs([]);
              }}
              className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded uppercase font-bold cursor-pointer transition-all"
            >
              Return to Gate
            </button>
          </div>

          {logs.length > 0 && (
            <div className="bg-black/80 p-2.5 rounded border border-white/5 text-[0.55rem] text-slate-500 space-y-0.5">
              {logs.map((l, i) => <div key={i} className={l.startsWith('[SUCCESS]') ? 'text-brand-green' : ''}>{l}</div>)}
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-950/20 border border-red-500/20 p-2.5 rounded text-red-400 text-[0.58rem]">
              ❌ {errorMsg}
            </div>
          )}
        </div>
      ) : view === 'forgot' ? (
        <form onSubmit={handleResetRequest} className="space-y-3.5 animate-fadeIn">
          <p className="text-[0.62rem] text-slate-500 leading-normal font-mono">
            Enter your agent email address. A credentials reset token dispatch will be routed to your inbox.
          </p>
          <div>
            <label className="text-[0.52rem] text-slate-500 block mb-1 uppercase tracking-wider flex items-center gap-1 font-mono">
              <Mail className="w-3 h-3 text-slate-500" /> Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={busy || !isConfigured}
              placeholder="admin@kali-console.net"
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded text-white outline-none focus:border-brand-cyan/40 transition-all font-mono disabled:opacity-40"
            />
          </div>
          <button
            type="submit"
            disabled={busy || !isConfigured}
            className="w-full py-2.5 bg-brand-cyan/15 hover:bg-brand-cyan/25 border border-brand-cyan/35 text-brand-cyan rounded uppercase font-bold tracking-widest cursor-pointer active:scale-95 transition-all disabled:opacity-40"
          >
            {busy ? 'Dispatching...' : 'Send Recovery Dispatch'}
          </button>

          {logs.length > 0 && (
            <div className="bg-black/60 p-2.5 rounded border border-white/5 text-[0.55rem] text-slate-500 space-y-0.5">
              {logs.map((l, i) => <div key={i} className={l.startsWith('[SUCCESS]') ? 'text-brand-green' : ''}>{l}</div>)}
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-950/20 border border-red-500/20 p-2.5 rounded text-red-400 text-[0.58rem]">
              ❌ {errorMsg}
            </div>
          )}

          <div className="pt-2.5 border-t border-white/5 flex justify-center text-[0.52rem] text-slate-500 select-none animate-fadeIn font-mono">
            <button 
              type="button"
              onClick={() => { setView('signin'); setErrorMsg(''); setLogs([]); }} 
              className="text-slate-500 hover:text-brand-cyan uppercase bg-transparent border-none cursor-pointer hover:underline"
            >
              Back to Sign In
            </button>
          </div>
        </form>
      ) : view === 'magic' ? (
        <form onSubmit={handleMagicLinkRequest} className="space-y-3.5 animate-fadeIn">
          <p className="text-[0.62rem] text-slate-500 leading-normal font-mono">
            Enter your agent email address to receive a one-click passwordless login link.
          </p>
          <div>
            <label className="text-[0.52rem] text-slate-500 block mb-1 uppercase tracking-wider flex items-center gap-1 font-mono">
              <Mail className="w-3 h-3 text-slate-500" /> Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={busy || !isConfigured}
              placeholder="admin@kali-console.net"
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded text-white outline-none focus:border-brand-cyan/40 transition-all font-mono disabled:opacity-40"
            />
          </div>
          <button
            type="submit"
            disabled={busy || !isConfigured}
            className="w-full py-2.5 bg-brand-cyan/15 hover:bg-brand-cyan/25 border border-brand-cyan/35 text-brand-cyan rounded uppercase font-bold tracking-widest cursor-pointer active:scale-95 transition-all disabled:opacity-40"
          >
            {busy ? 'Generating Link...' : 'Send Magic Link'}
          </button>

          {logs.length > 0 && (
            <div className="bg-black/60 p-2.5 rounded border border-white/5 text-[0.55rem] text-slate-500 space-y-0.5">
              {logs.map((l, i) => <div key={i} className={l.startsWith('[SUCCESS]') ? 'text-brand-green' : ''}>{l}</div>)}
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-950/20 border border-red-500/20 p-2.5 rounded text-red-400 text-[0.58rem]">
              ❌ {errorMsg}
            </div>
          )}

          <div className="pt-2.5 border-t border-white/5 flex justify-center text-[0.52rem] text-slate-500 select-none animate-fadeIn font-mono">
            <button 
              type="button"
              onClick={() => { setView('signin'); setErrorMsg(''); setLogs([]); }} 
              className="text-slate-500 hover:text-brand-cyan uppercase bg-transparent border-none cursor-pointer hover:underline"
            >
              Back to Sign In
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleAuth} className="space-y-3.5 animate-fadeIn">
          <div className="space-y-2.5">
            {view === 'signup' && (
              <>
                <div>
                  <label className="text-[0.52rem] text-slate-500 block mb-1 uppercase tracking-wider flex items-center gap-1 font-mono">
                    <User className="w-3 h-3 text-slate-500" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    disabled={busy || !isConfigured}
                    placeholder="Alex Mercer"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded text-white outline-none focus:border-brand-cyan/40 transition-all font-mono disabled:opacity-40"
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
                    disabled={busy || !isConfigured}
                    placeholder="+1 (555) 019-2834"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded text-white outline-none focus:border-brand-cyan/40 transition-all font-mono disabled:opacity-40"
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-[0.52rem] text-slate-500 block mb-1 uppercase tracking-wider flex items-center gap-1 font-mono">
                <Mail className="w-3 h-3 text-slate-500" /> Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={busy || !isConfigured}
                placeholder="admin@kali-console.net"
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded text-white outline-none focus:border-brand-cyan/40 transition-all font-mono disabled:opacity-40"
              />
            </div>
            <div>
              <label className="text-[0.52rem] text-slate-500 block mb-1 uppercase tracking-wider flex items-center gap-1 font-mono">
                <Lock className="w-3 h-3 text-slate-500" /> {view === 'signin' ? 'Access Code (Password)' : 'Password'}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={busy || !isConfigured}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded text-white outline-none focus:border-brand-cyan/40 transition-all font-mono disabled:opacity-40"
              />
            </div>

            {view === 'signup' && (
              <div>
                <label className="text-[0.52rem] text-slate-500 block mb-1 uppercase tracking-wider flex items-center gap-1 font-mono">
                  <Lock className="w-3 h-3 text-slate-500" /> Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  disabled={busy || !isConfigured}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded text-white outline-none focus:border-brand-cyan/40 transition-all font-mono disabled:opacity-40"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={busy || !isConfigured}
            className="w-full py-2.5 bg-brand-cyan/15 hover:bg-brand-cyan/25 border border-brand-cyan/35 text-brand-cyan rounded uppercase font-bold tracking-widest cursor-pointer active:scale-95 transition-all disabled:opacity-40"
          >
            {busy ? 'Handshake...' : view === 'signin' ? 'Authenticate Session' : 'Register Account'}
          </button>

          {logs.length > 0 && (
            <div className="bg-black/60 p-2.5 rounded border border-white/5 text-[0.55rem] text-slate-500 space-y-0.5">
              {logs.map((l, i) => <div key={i} className={l.startsWith('[SUCCESS]') ? 'text-brand-green' : ''}>{l}</div>)}
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-950/20 border border-red-500/20 p-2.5 rounded text-red-400 text-[0.58rem]">
              ❌ {errorMsg}
            </div>
          )}

          <div className="pt-2.5 border-t border-white/5 flex justify-between text-[0.52rem] text-slate-500 select-none animate-fadeIn font-mono">
            <button 
              type="button"
              onClick={() => { setView('forgot'); setErrorMsg(''); setLogs([]); }} 
              className="text-slate-500 hover:text-brand-cyan uppercase bg-transparent border-none cursor-pointer hover:underline"
            >
              Forgot Password?
            </button>
            <button 
              type="button"
              onClick={() => { setView('magic'); setErrorMsg(''); setLogs([]); }} 
              className="text-slate-500 hover:text-brand-cyan uppercase bg-transparent border-none cursor-pointer hover:underline"
            >
              Magic Link
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default function Portal({ authUser, authSession, setAuthUser, setAuthSession }) {
  return (
    <section className="py-12 animate-fadeIn space-y-8">
      <SectionHeader num="09" title="Secure Access Portal" />
      {authUser ? (
        <UserSessionDashboard 
          user={authUser} 
          session={authSession} 
          onSignOut={() => {
            getSupabase()?.auth.signOut();
            setAuthUser(null);
            setAuthSession(null);
          }} 
        />
      ) : (
        <AuthPortal 
          onAuthSuccess={(u, s) => {
            setAuthUser(u);
            setAuthSession(s);
          }} 
        />
      )}
    </section>
  );
}
