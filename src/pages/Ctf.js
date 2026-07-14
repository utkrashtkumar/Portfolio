import React, { useState, useEffect } from 'react';
import { GraduationCap } from 'lucide-react';
import { SectionHeader } from '../components/Shared.js';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
};

const setCookie = (name, val) => {
  const date = new Date();
  date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${val}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
};

const CtfLeaderboard = () => {
  const [board, setBoard] = useState([]);
  
  useEffect(() => {
    const updateBoard = () => {
      const list = JSON.parse(localStorage.getItem("utk_ctf_leaderboard") || "[]");
      setBoard(list);
    };
    updateBoard();
    window.addEventListener("storage", updateBoard);
    return () => window.removeEventListener("storage", updateBoard);
  }, []);

  const clearLeaderboard = () => {
    localStorage.removeItem("utk_ctf_leaderboard");
    setBoard([]);
  };

  return (
    <div className="glass-panel border border-brand-green/20 p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2 text-brand-green font-bold">
          <GraduationCap className="w-5 h-5 text-brand-green animate-pulse" />
          <h4 className="font-display text-sm uppercase tracking-wider">CTF Solver Hall of Fame</h4>
        </div>
        <button
          onClick={clearLeaderboard}
          className="text-[0.52rem] font-mono text-slate-500 hover:text-red-400 uppercase bg-transparent border-none cursor-pointer"
        >
          [Clear Logs]
        </button>
      </div>

      <div className="font-mono text-xs space-y-2">
        {board.length === 0 ? (
          <div className="text-center py-6 text-slate-500">
            No secure bypass records in local ledger database.
          </div>
        ) : (
          <div className="border border-white/5 rounded overflow-hidden">
            <div className="grid grid-cols-2 bg-white/5 px-3 py-1.5 text-[0.58rem] text-slate-500 uppercase tracking-widest border-b border-white/5 font-bold">
              <span>Hacker Nickname</span>
              <span className="text-right">Bypass Timestamp</span>
            </div>
            <div className="divide-y divide-white/3 max-h-[160px] overflow-y-auto">
              {board.map((item, i) => (
                <div key={i} className="grid grid-cols-2 px-3 py-2 text-[0.62rem] text-slate-300">
                  <span className="font-bold text-brand-green">👑 {item.name}</span>
                  <span className="text-right text-slate-500">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CtfChallengeRoom = ({ onAllSolved }) => {
  const [ch1Input, setCh1Input] = useState('');
  const [ch1Solved, setCh1Solved] = useState(() => 
    localStorage.getItem('utk_ctf_ch1') === 'true' || getCookie('utk_ctf_ch1') === 'true'
  );
  const [ch2Input, setCh2Input] = useState('');
  const [ch2Solved, setCh2Solved] = useState(() => 
    localStorage.getItem('utk_ctf_ch2') === 'true' || getCookie('utk_ctf_ch2') === 'true'
  );
  const [ch3Input, setCh3Input] = useState('');
  const [ch3Solved, setCh3Solved] = useState(() => 
    localStorage.getItem('utk_ctf_ch3') === 'true' || getCookie('utk_ctf_ch3') === 'true'
  );

  const [hackerName, setHackerName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(() => 
    localStorage.getItem('utk_ctf_name_submitted') === 'true'
  );

  const submitToBoard = () => {
    if (!hackerName.trim()) return;
    const currentBoard = JSON.parse(localStorage.getItem('utk_ctf_leaderboard') || '[]');
    const newEntry = { name: hackerName.trim(), date: new Date().toLocaleDateString() };
    localStorage.setItem('utk_ctf_leaderboard', JSON.stringify([newEntry, ...currentBoard].slice(0, 10)));
    localStorage.setItem('utk_ctf_name_submitted', 'true');
    setIsSubmitted(true);
    window.dispatchEvent(new Event('storage'));
  };

  const handleCh1Check = () => {
    if (ch1Input.trim().toUpperCase() === 'KALI_OFFENSIVE') {
      setCh1Solved(true);
      localStorage.setItem('utk_ctf_ch1', 'true');
      setCookie('utk_ctf_ch1', 'true');
    } else {
      alert('[!] Invalid flag digest checksum. Try again.');
    }
  };

  const handleCh2Check = () => {
    if (ch2Input.trim().toUpperCase() === 'UTK_FLAG_DOM') {
      setCh2Solved(true);
      localStorage.setItem('utk_ctf_ch2', 'true');
      setCookie('utk_ctf_ch2', 'true');
    } else {
      alert('[!] Flag not found in system registers.');
    }
  };

  const handleCh3Check = () => {
    if (ch3Input.trim().toUpperCase() === 'SECURITY') {
      setCh3Solved(true);
      localStorage.setItem('utk_ctf_ch3', 'true');
      setCookie('utk_ctf_ch3', 'true');
    } else {
      alert('[!] Ciphertext decipher failed. Key offset mismatch.');
    }
  };

  const totalSolved = (ch1Solved ? 1 : 0) + (ch2Solved ? 1 : 0) + (ch3Solved ? 1 : 0);

  useEffect(() => {
    if (ch1Solved && ch2Solved && ch3Solved) {
      if (onAllSolved) onAllSolved();
    }
  }, [ch1Solved, ch2Solved, ch3Solved, onAllSolved]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-6">
      <div className="text-center">
        <h2 className="font-display text-3xl font-black text-white drop-shadow-[0_0_20px_rgba(0,245,255,0.3)]">CAPTURE THE FLAG (CTF) INTRUSION ROOM</h2>
        <p className="font-mono text-xs text-brand-cyan mt-2">// SOLVE ALL CHALLENGES TO ELEVATE PRIVILEGES: {totalSolved}/3 SOLVED</p>
      </div>

      {totalSolved === 3 && (
        <div className="glass-panel p-6 border border-brand-green/30 bg-brand-green/5 text-center space-y-3">
          <div className="text-brand-green font-bold font-display text-xl uppercase animate-pulse">🏆 ROOT ACCESS GRANTED 🏆</div>
          <p className="font-mono text-xs text-slate-300">You successfully bypassed all containment rings. Use flag "ROOT_LEVEL_PASSED_2026" in contact handshake form for priority routing.</p>
          
          {!isSubmitted ? (
            <div className="mt-4 max-w-sm mx-auto p-4 bg-black/40 border border-brand-green/20 rounded-xl space-y-3">
              <span className="font-mono text-[0.62rem] text-brand-green uppercase tracking-widest block font-bold">Register bypass in Solver Ledger:</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter nickname..."
                  value={hackerName}
                  onChange={e => setHackerName(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-black/60 border border-white/10 rounded font-mono text-xs text-white outline-none focus:border-brand-green/50"
                />
                <button
                  onClick={submitToBoard}
                  className="px-4 py-1.5 bg-brand-green/25 hover:bg-brand-green/35 border border-brand-green/45 text-brand-green font-mono text-xs rounded uppercase font-bold transition-all cursor-pointer"
                >
                  Register
                </button>
              </div>
            </div>
          ) : (
            <div className="font-mono text-xs text-brand-green">✔ Nickname logged in local bypass registers!</div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`glass-panel p-6 border flex flex-col justify-between ${ch1Solved ? 'border-brand-green/30 bg-brand-green/5' : 'border-white/5'}`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[0.62rem] text-slate-400">CHALLENGE_01 // CRYPTO</span>
              <span className={`w-2.5 h-2.5 rounded-full ${ch1Solved ? 'bg-brand-green animate-pulse' : 'bg-red-500'}`} />
            </div>
            <h4 className="font-display font-bold text-base text-white mb-2">ROT13 Shift Gate</h4>
            <p className="text-[0.72rem] text-slate-400 font-mono leading-relaxed mb-4">
              Decrypt the following base-level encryption to reveal key parameters:<br />
              <span className="text-brand-cyan select-all">XNYV_BSSRAFVIR</span>
            </p>
          </div>
          <div>
            <input
              type="text"
              placeholder="Enter flag..."
              value={ch1Input}
              onChange={e => setCh1Input(e.target.value)}
              disabled={ch1Solved}
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded font-mono text-xs text-white outline-none mb-2.5 focus:border-brand-green/40"
            />
            <button
              onClick={handleCh1Check}
              disabled={ch1Solved}
              className="w-full py-1.5 bg-white/5 hover:bg-brand-green/20 border border-white/10 hover:border-brand-green/30 text-slate-300 hover:text-brand-green font-mono text-xs rounded transition-all uppercase cursor-pointer"
            >
              {ch1Solved ? 'SOLVED' : 'VERIFY FLAG'}
            </button>
          </div>
        </div>

        <div className={`glass-panel p-6 border flex flex-col justify-between ${ch2Solved ? 'border-brand-green/30 bg-brand-green/5' : 'border-white/5'}`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[0.62rem] text-slate-400">CHALLENGE_02 // DOM RECON</span>
              <span className={`w-2.5 h-2.5 rounded-full ${ch2Solved ? 'bg-brand-green animate-pulse' : 'bg-red-500'}`} />
            </div>
            <h4 className="font-display font-bold text-base text-white mb-2">Hidden Metadata registers</h4>
            <p className="text-[0.72rem] text-slate-400 font-mono leading-relaxed mb-4">
              Inspect this page's root elements. A hidden metadata attribute is declared within the body layout.
            </p>
          </div>
          <div>
            <input
              type="text"
              placeholder="Enter flag..."
              value={ch2Input}
              onChange={e => setCh2Input(e.target.value)}
              disabled={ch2Solved}
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded font-mono text-xs text-white outline-none mb-2.5 focus:border-brand-green/40"
            />
            <button
              onClick={handleCh2Check}
              disabled={ch2Solved}
              className="w-full py-1.5 bg-white/5 hover:bg-brand-green/20 border border-white/10 hover:border-brand-green/30 text-slate-300 hover:text-brand-green font-mono text-xs rounded transition-all uppercase cursor-pointer"
            >
              {ch2Solved ? 'SOLVED' : 'VERIFY FLAG'}
            </button>
          </div>
        </div>

        <div className={`glass-panel p-6 border flex flex-col justify-between ${ch3Solved ? 'border-brand-green/30 bg-brand-green/5' : 'border-white/5'}`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[0.62rem] text-slate-400">CHALLENGE_03 // DECIPHER</span>
              <span className={`w-2.5 h-2.5 rounded-full ${ch3Solved ? 'bg-brand-green animate-pulse' : 'bg-red-500'}`} />
            </div>
            <h4 className="font-display font-bold text-base text-white mb-2">Vigenère Register Lock</h4>
            <p className="text-[0.72rem] text-slate-400 font-mono leading-relaxed mb-4">
              Decrypt text <span className="text-brand-cyan">KIKWZBBP</span> using offset key <span className="text-brand-cyan">KALI</span> to access registers.
            </p>
          </div>
          <div>
            <input
              type="text"
              placeholder="Enter flag..."
              value={ch3Input}
              onChange={e => setCh3Input(e.target.value)}
              disabled={ch3Solved}
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded font-mono text-xs text-white outline-none mb-2.5 focus:border-brand-green/40"
            />
            <button
              onClick={handleCh3Check}
              disabled={ch3Solved}
              className="w-full py-1.5 bg-white/5 hover:bg-brand-green/20 border border-white/10 hover:border-brand-green/30 text-slate-300 hover:text-brand-green font-mono text-xs rounded transition-all uppercase cursor-pointer"
            >
              {ch3Solved ? 'SOLVED' : 'VERIFY FLAG'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Ctf({ setCtfSolved }) {
  return (
    <section className="py-12 animate-fadeIn space-y-8">
      <SectionHeader num="07" title="CTF Intrusion Challenges" />
      <CtfChallengeRoom onAllSolved={() => setCtfSolved(true)} />
      <CtfLeaderboard />
    </section>
  );
}
