import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Mail, ShieldAlert, CheckCircle2, RotateCw, User, Phone, Sparkles } from 'lucide-react';
import { SectionHeader } from '../components/Shared.js';
import { getSupabase, getSupabaseConfig, saveSupabaseConfig, rebindSupabase } from '../supabaseClient.js';

const COUNTRIES = [
  { name: 'Afghanistan', code: '+93', maxLength: 9, placeholder: '70 123 4567' },
  { name: 'Albania', code: '+355', maxLength: 9, placeholder: '68 123 4567' },
  { name: 'Algeria', code: '+213', maxLength: 9, placeholder: '550 123 456' },
  { name: 'Andorra', code: '+376', maxLength: 6, placeholder: '312 345' },
  { name: 'Angola', code: '+244', maxLength: 9, placeholder: '912 345 678' },
  { name: 'Argentina', code: '+54', maxLength: 10, placeholder: '11 1234 5678' },
  { name: 'Armenia', code: '+374', maxLength: 8, placeholder: '91 123456' },
  { name: 'Australia', code: '+61', maxLength: 9, placeholder: '412 345 678' },
  { name: 'Austria', code: '+43', maxLength: 10, placeholder: '660 1234567' },
  { name: 'Azerbaijan', code: '+994', maxLength: 9, placeholder: '50 123 45 67' },
  { name: 'Bahrain', code: '+973', maxLength: 8, placeholder: '3123 4567' },
  { name: 'Bangladesh', code: '+880', maxLength: 10, placeholder: '1712 345678' },
  { name: 'Belarus', code: '+375', maxLength: 9, placeholder: '29 123 45 67' },
  { name: 'Belgium', code: '+32', maxLength: 9, placeholder: '470 12 34 56' },
  { name: 'Bhutan', code: '+975', maxLength: 8, placeholder: '17 123456' },
  { name: 'Bolivia', code: '+591', maxLength: 8, placeholder: '712 34567' },
  { name: 'Brazil', code: '+55', maxLength: 11, placeholder: '11 91234 5678' },
  { name: 'Brunei', code: '+673', maxLength: 7, placeholder: '812 3456' },
  { name: 'Bulgaria', code: '+359', maxLength: 9, placeholder: '87 123 4567' },
  { name: 'Cambodia', code: '+855', maxLength: 9, placeholder: '12 345 678' },
  { name: 'Canada', code: '+1', maxLength: 10, placeholder: '416 555 0199' },
  { name: 'Chile', code: '+56', maxLength: 9, placeholder: '9 1234 5678' },
  { name: 'China', code: '+86', maxLength: 11, placeholder: '139 1234 5678' },
  { name: 'Colombia', code: '+57', maxLength: 10, placeholder: '300 123 4567' },
  { name: 'Costa Rica', code: '+506', maxLength: 8, placeholder: '8123 4567' },
  { name: 'Croatia', code: '+385', maxLength: 9, placeholder: '91 123 4567' },
  { name: 'Cuba', code: '+53', maxLength: 8, placeholder: '5123 4567' },
  { name: 'Cyprus', code: '+357', maxLength: 8, placeholder: '99 123456' },
  { name: 'Czech Republic', code: '+420', maxLength: 9, placeholder: '712 345 678' },
  { name: 'Denmark', code: '+45', maxLength: 8, placeholder: '12 34 56 78' },
  { name: 'Egypt', code: '+20', maxLength: 10, placeholder: '100 123 4567' },
  { name: 'Estonia', code: '+372', maxLength: 8, placeholder: '5123 4567' },
  { name: 'Ethiopia', code: '+251', maxLength: 9, placeholder: '91 123 4567' },
  { name: 'Finland', code: '+358', maxLength: 10, placeholder: '40 123 4567' },
  { name: 'France', code: '+33', maxLength: 9, placeholder: '612 345 678' },
  { name: 'Georgia', code: '+995', maxLength: 9, placeholder: '599 12 34 56' },
  { name: 'Germany', code: '+49', maxLength: 11, placeholder: '151 23456789' },
  { name: 'Greece', code: '+30', maxLength: 10, placeholder: '691 234 5678' },
  { name: 'Hong Kong', code: '+852', maxLength: 8, placeholder: '9123 4567' },
  { name: 'Hungary', code: '+36', maxLength: 9, placeholder: '20 123 4567' },
  { name: 'Iceland', code: '+354', maxLength: 7, placeholder: '812 3456' },
  { name: 'India', code: '+91', maxLength: 10, placeholder: '98765 43210' },
  { name: 'Indonesia', code: '+62', maxLength: 12, placeholder: '812 3456 7890' },
  { name: 'Iran', code: '+98', maxLength: 10, placeholder: '912 345 6789' },
  { name: 'Iraq', code: '+964', maxLength: 10, placeholder: '770 123 4567' },
  { name: 'Ireland', code: '+353', maxLength: 9, placeholder: '87 123 4567' },
  { name: 'Israel', code: '+972', maxLength: 9, placeholder: '50 123 4567' },
  { name: 'Italy', code: '+39', maxLength: 10, placeholder: '312 345 6789' },
  { name: 'Japan', code: '+81', maxLength: 10, placeholder: '90 1234 5678' },
  { name: 'Jordan', code: '+962', maxLength: 9, placeholder: '7 9123 4567' },
  { name: 'Kazakhstan', code: '+7', maxLength: 10, placeholder: '701 123 4567' },
  { name: 'Kenya', code: '+254', maxLength: 9, placeholder: '712 345678' },
  { name: 'Kuwait', code: '+965', maxLength: 8, placeholder: '9123 4567' },
  { name: 'Kyrgyzstan', code: '+996', maxLength: 9, placeholder: '555 123 456' },
  { name: 'Latvia', code: '+371', maxLength: 8, placeholder: '2123 4567' },
  { name: 'Lebanon', code: '+961', maxLength: 8, placeholder: '70 123 456' },
  { name: 'Libya', code: '+218', maxLength: 9, placeholder: '91 123 4567' },
  { name: 'Liechtenstein', code: '+423', maxLength: 7, placeholder: '712 3456' },
  { name: 'Lithuania', code: '+370', maxLength: 8, placeholder: '612 34567' },
  { name: 'Luxembourg', code: '+352', maxLength: 9, placeholder: '621 123 456' },
  { name: 'Macau', code: '+853', maxLength: 8, placeholder: '6123 4567' },
  { name: 'Malaysia', code: '+60', maxLength: 10, placeholder: '12 345 6789' },
  { name: 'Maldives', code: '+960', maxLength: 7, placeholder: '712 3456' },
  { name: 'Malta', code: '+356', maxLength: 8, placeholder: '9912 3456' },
  { name: 'Mauritius', code: '+230', maxLength: 8, placeholder: '5123 4567' },
  { name: 'Mexico', code: '+52', maxLength: 10, placeholder: '55 1234 5678' },
  { name: 'Moldova', code: '+373', maxLength: 8, placeholder: '612 34567' },
  { name: 'Monaco', code: '+377', maxLength: 8, placeholder: '6 1234 567' },
  { name: 'Mongolia', code: '+976', maxLength: 8, placeholder: '9912 3456' },
  { name: 'Montenegro', code: '+382', maxLength: 8, placeholder: '67 123 456' },
  { name: 'Morocco', code: '+212', maxLength: 9, placeholder: '612 345678' },
  { name: 'Myanmar', code: '+95', maxLength: 9, placeholder: '9 1234 5678' },
  { name: 'Nepal', code: '+977', maxLength: 10, placeholder: '981 2345678' },
  { name: 'Netherlands', code: '+31', maxLength: 9, placeholder: '6 1234 5678' },
  { name: 'New Zealand', code: '+64', maxLength: 9, placeholder: '21 123 4567' },
  { name: 'Nigeria', code: '+234', maxLength: 10, placeholder: '803 123 4567' },
  { name: 'North Macedonia', code: '+389', maxLength: 8, placeholder: '70 123 456' },
  { name: 'Norway', code: '+47', maxLength: 8, placeholder: '912 34 567' },
  { name: 'Oman', code: '+968', maxLength: 8, placeholder: '9123 4567' },
  { name: 'Pakistan', code: '+92', maxLength: 10, placeholder: '300 1234567' },
  { name: 'Palestine', code: '+970', maxLength: 9, placeholder: '59 123 4567' },
  { name: 'Panama', code: '+507', maxLength: 8, placeholder: '6123 4567' },
  { name: 'Paraguay', code: '+595', maxLength: 9, placeholder: '981 123 456' },
  { name: 'Peru', code: '+51', maxLength: 9, placeholder: '912 345 678' },
  { name: 'Philippines', code: '+63', maxLength: 10, placeholder: '917 123 4567' },
  { name: 'Poland', code: '+48', maxLength: 9, placeholder: '501 234 567' },
  { name: 'Portugal', code: '+351', maxLength: 9, placeholder: '912 345 678' },
  { name: 'Qatar', code: '+974', maxLength: 8, placeholder: '3312 3456' },
  { name: 'Romania', code: '+40', maxLength: 9, placeholder: '712 345 678' },
  { name: 'Russia', code: '+7', maxLength: 10, placeholder: '912 345 6789' },
  { name: 'Saudi Arabia', code: '+966', maxLength: 9, placeholder: '50 123 4567' },
  { name: 'Serbia', code: '+381', maxLength: 9, placeholder: '61 123 4567' },
  { name: 'Singapore', code: '+65', maxLength: 8, placeholder: '8123 4567' },
  { name: 'Slovakia', code: '+421', maxLength: 9, placeholder: '912 345 678' },
  { name: 'Slovenia', code: '+386', maxLength: 8, placeholder: '41 123 456' },
  { name: 'South Africa', code: '+27', maxLength: 9, placeholder: '82 123 4567' },
  { name: 'South Korea', code: '+82', maxLength: 10, placeholder: '10 1234 5678' },
  { name: 'Spain', code: '+34', maxLength: 9, placeholder: '612 345 678' },
  { name: 'Sri Lanka', code: '+94', maxLength: 9, placeholder: '71 123 4567' },
  { name: 'Sweden', code: '+46', maxLength: 9, placeholder: '70 123 4567' },
  { name: 'Switzerland', code: '+41', maxLength: 9, placeholder: '79 123 45 67' },
  { name: 'Taiwan', code: '+886', maxLength: 9, placeholder: '912 345 678' },
  { name: 'Tajikistan', code: '+992', maxLength: 9, placeholder: '91 234 5678' },
  { name: 'Thailand', code: '+66', maxLength: 9, placeholder: '81 234 5678' },
  { name: 'Tunisia', code: '+216', maxLength: 8, placeholder: '21 234 567' },
  { name: 'Turkey', code: '+90', maxLength: 10, placeholder: '532 123 4567' },
  { name: 'Turkmenistan', code: '+993', maxLength: 8, placeholder: '61 234567' },
  { name: 'Ukraine', code: '+380', maxLength: 9, placeholder: '50 123 4567' },
  { name: 'United Arab Emirates', code: '+971', maxLength: 9, placeholder: '50 123 4567' },
  { name: 'United Kingdom', code: '+44', maxLength: 10, placeholder: '7911 123456' },
  { name: 'United States', code: '+1', maxLength: 10, placeholder: '202 555 0199' },
  { name: 'Uruguay', code: '+598', maxLength: 9, placeholder: '99 123 456' },
  { name: 'Uzbekistan', code: '+998', maxLength: 9, placeholder: '90 123 4567' },
  { name: 'Vatican City', code: '+379', maxLength: 10, placeholder: '06 69812345' },
  { name: 'Venezuela', code: '+58', maxLength: 10, placeholder: '412 123 4567' },
  { name: 'Vietnam', code: '+84', maxLength: 9, placeholder: '91 234 5678' },
  { name: 'Yemen', code: '+967', maxLength: 9, placeholder: '71 234 5678' },
  { name: 'Zimbabwe', code: '+263', maxLength: 9, placeholder: '71 234 5678' }
];

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
  const [mobileCode, setMobileCode] = useState('+91');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [logs, setLogs] = useState([]);
  const [busy, setBusy] = useState(false);

  const selectedCountry = COUNTRIES.find(c => c.code === mobileCode) || COUNTRIES[0];

  const handleMobileChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= selectedCountry.maxLength) {
      setMobile(val);
    }
  };

  const handleCountryCodeChange = (e) => {
    const newCode = e.target.value;
    setMobileCode(newCode);
    const targetCountry = COUNTRIES.find(c => c.code === newCode) || COUNTRIES[0];
    if (mobile.length > targetCountry.maxLength) {
      setMobile(mobile.slice(0, targetCountry.maxLength));
    }
  };

  const queryParams = new URLSearchParams(window.location.search);
  const [showConfirmedAlert, setShowConfirmedAlert] = useState(queryParams.get('confirmed') === 'true');
  const [showResetSuccessAlert, setShowResetSuccessAlert] = useState(queryParams.get('resetSuccess') === 'true');

  useEffect(() => {
    if (queryParams.get('confirmed') === 'true' || queryParams.get('resetSuccess') === 'true') {
      // Clear the query parameters from the browser address bar to prevent race conditions during subsequent logins
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

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
      if (mobile.trim().length !== selectedCountry.maxLength) {
        setErrorMsg(`Mobile number must be exactly ${selectedCountry.maxLength} digits for ${selectedCountry.name}.`);
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
        const fullMobile = `${mobileCode}${mobile.trim()}`;
        // Pre-check if credentials (email or mobile) are already registered
        try {
          const { data: checkData, error: checkError } = await supabase.rpc('check_credentials_exist', {
            p_email: email.trim(),
            p_mobile: fullMobile
          });

          if (!checkError && checkData && checkData.length > 0) {
            const { email_exists, mobile_exists } = checkData[0];
            if (email_exists || mobile_exists) {
              let msg = 'already registered with mobile number or email';
              setErrorMsg(msg);
              setLogs(prev => [...prev, `[!] Registration blocked: ${msg}`]);
              setBusy(false);
              return;
            }
          }
        } catch (e) {
          // Fallback if database migration hasn't been executed
          console.warn('Pre-check skipped:', e);
        }

        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              name: name.trim(),
              mobile: fullMobile
            },
            emailRedirectTo: `${window.location.origin}/portal?confirmed=true`
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
      const fullMobile = `${mobileCode}${mobile.trim()}`;
      const { error } = await supabase.auth.signUp({ 
        email, 
        password: password || "tempPasswordForResend123!",
        options: {
          data: {
            name: name.trim(),
            mobile: fullMobile
          },
          emailRedirectTo: `${window.location.origin}/portal?confirmed=true`
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
        redirectTo: `${window.location.origin}/reset-password`
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
            className="px-2.5 py-1 bg-brand-purple/15 hover:bg-brand-purple/30 border border-brand-purple/30 hover:border-brand-purple/50 text-brand-purple rounded uppercase text-[0.62rem] tracking-wider font-extrabold transition-all cursor-pointer"
          >
            {view === 'signin' ? 'Sign Up Account' : 'Sign In Account'}
          </button>
        )}
      </div>

      {showConfirmedAlert && (
        <div className="bg-brand-green/10 border border-brand-green/20 p-3 rounded-lg text-brand-green text-[0.58rem] leading-normal font-mono flex items-center gap-1.5 animate-fadeIn">
          <CheckCircle2 className="w-3.5 h-3.5 text-brand-green shrink-0 animate-bounce" /> [SUCCESS] Your email is verified. You can now login to your account.
        </div>
      )}

      {showResetSuccessAlert && (
        <div className="bg-brand-green/10 border border-brand-green/20 p-3 rounded-lg text-brand-green text-[0.58rem] leading-normal font-mono flex items-center gap-1.5 animate-fadeIn">
          <CheckCircle2 className="w-3.5 h-3.5 text-brand-green shrink-0 animate-bounce" /> [SUCCESS] Your password has been reset successfully. Please login with your new credentials.
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

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleResend}
              disabled={busy}
              className="w-full py-3 bg-brand-purple/25 hover:bg-brand-purple/45 border border-brand-purple/50 hover:border-brand-purple text-brand-purple rounded-lg uppercase font-bold tracking-widest cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.15)] text-xs"
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
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/20 text-slate-300 rounded-lg uppercase font-bold tracking-widest cursor-pointer transition-all text-xs"
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
            className="w-full py-3.5 bg-brand-cyan/20 hover:bg-brand-cyan/35 border border-brand-cyan/50 hover:border-brand-cyan text-brand-cyan rounded-lg uppercase font-bold tracking-widest cursor-pointer active:scale-95 transition-all disabled:opacity-40 text-xs shadow-[0_0_15px_rgba(0,245,255,0.15)] hover:shadow-[0_0_25px_rgba(0,245,255,0.3)]"
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

          <div className="pt-3 border-t border-white/5 flex justify-center select-none animate-fadeIn font-mono">
            <button 
              type="button"
              onClick={() => { setView('signin'); setErrorMsg(''); setLogs([]); }} 
              className="px-3.5 py-1.5 bg-white/5 border border-white/10 hover:border-brand-cyan/30 rounded-lg text-slate-400 hover:text-brand-cyan uppercase cursor-pointer transition-all active:scale-95 text-[0.62rem] tracking-wider font-extrabold"
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
            className="w-full py-3.5 bg-brand-cyan/20 hover:bg-brand-cyan/35 border border-brand-cyan/50 hover:border-brand-cyan text-brand-cyan rounded-lg uppercase font-bold tracking-widest cursor-pointer active:scale-95 transition-all disabled:opacity-40 text-xs shadow-[0_0_15px_rgba(0,245,255,0.15)] hover:shadow-[0_0_25px_rgba(0,245,255,0.3)]"
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

          <div className="pt-3 border-t border-white/5 flex justify-center select-none animate-fadeIn font-mono">
            <button 
              type="button"
              onClick={() => { setView('signin'); setErrorMsg(''); setLogs([]); }} 
              className="px-3.5 py-1.5 bg-white/5 border border-white/10 hover:border-brand-cyan/30 rounded-lg text-slate-400 hover:text-brand-cyan uppercase cursor-pointer transition-all active:scale-95 text-[0.62rem] tracking-wider font-extrabold"
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
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[0.52rem] text-slate-500 block uppercase tracking-wider flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-slate-500" /> Mobile Number
                    </label>
                    <span className="text-[0.52rem] text-slate-500 font-mono">
                      {mobile.length} / {selectedCountry.maxLength} digits
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={mobileCode}
                      onChange={handleCountryCodeChange}
                      disabled={busy || !isConfigured}
                      className="w-28 px-2 py-2 bg-neutral-900/60 border border-white/10 rounded text-white outline-none focus:border-brand-cyan/40 transition-all font-mono disabled:opacity-40 text-xs"
                    >
                      {COUNTRIES.map(c => (
                        <option key={c.name} value={c.code} className="bg-neutral-900 text-white">
                          {c.code} ({c.name})
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={handleMobileChange}
                      disabled={busy || !isConfigured}
                      placeholder={selectedCountry.placeholder}
                      className="flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded text-white outline-none focus:border-brand-cyan/40 transition-all font-mono disabled:opacity-40 text-xs"
                    />
                  </div>
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
            className="w-full py-3.5 bg-brand-cyan/20 hover:bg-brand-cyan/35 border border-brand-cyan/50 hover:border-brand-cyan text-brand-cyan rounded-lg uppercase font-bold tracking-widest cursor-pointer active:scale-95 transition-all disabled:opacity-40 text-xs shadow-[0_0_15px_rgba(0,245,255,0.15)] hover:shadow-[0_0_25px_rgba(0,245,255,0.3)]"
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

          <div className="pt-3 border-t border-white/5 flex justify-between select-none animate-fadeIn font-mono">
            <button 
              type="button"
              onClick={() => { setView('forgot'); setErrorMsg(''); setLogs([]); }} 
              className="px-3 py-1.5 bg-white/5 border border-white/10 hover:border-brand-cyan/30 rounded-lg text-slate-400 hover:text-brand-cyan uppercase cursor-pointer transition-all active:scale-95 text-[0.62rem] tracking-wider font-extrabold"
            >
              Forgot Password?
            </button>
            <button 
              type="button"
              onClick={() => { setView('magic'); setErrorMsg(''); setLogs([]); }} 
              className="px-3 py-1.5 bg-white/5 border border-white/10 hover:border-brand-cyan/30 rounded-lg text-slate-400 hover:text-brand-cyan uppercase cursor-pointer transition-all active:scale-95 text-[0.62rem] tracking-wider font-extrabold"
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
