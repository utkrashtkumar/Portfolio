import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getSupabase } from '../supabaseClient.js';
import {
  Bell, BellRing, Send, MessageCircle, X, Clock, Tag,
  Eye, Shield, AlertTriangle, Flame, Rss, Mail, Search,
  ChevronDown, ChevronUp, ExternalLink, CheckCircle, RefreshCw,
  ArrowUp, Newspaper, Globe, Cpu, Zap, Lock, AlertCircle, Loader2
} from 'lucide-react';
import emailjs from '@emailjs/browser';

// ─── Constants ──────────────────────────────────────────────────────────────
const ADMIN_EMAIL = 'utkrashtkumar@gmail.com';
const CATEGORIES = ['All', 'Vulnerabilities', 'Attacks', 'Tools', 'Research', 'General'];

const CATEGORY_CONFIG = {
  Vulnerabilities: { icon: <AlertCircle className="w-3 h-3" />, color: 'text-brand-pink border-brand-pink/30 bg-brand-pink/10' },
  Attacks:         { icon: <Zap className="w-3 h-3" />,         color: 'text-red-400 border-red-400/30 bg-red-400/10' },
  Tools:           { icon: <Cpu className="w-3 h-3" />,          color: 'text-brand-purple border-brand-purple/30 bg-brand-purple/10' },
  Research:        { icon: <Globe className="w-3 h-3" />,         color: 'text-brand-cyan border-brand-cyan/30 bg-brand-cyan/10' },
  General:         { icon: <Newspaper className="w-3 h-3" />,     color: 'text-slate-400 border-slate-400/30 bg-slate-400/10' },
};

const REACTIONS = [
  { key: 'fire',   emoji: '🔥', label: 'Fire',      activeColor: 'text-orange-400 border-orange-400/40 bg-orange-400/10' },
  { key: 'alert',  emoji: '⚠️',  label: 'Alert',     activeColor: 'text-yellow-400 border-yellow-400/40 bg-yellow-400/10' },
  { key: 'eye',    emoji: '👁️',  label: 'Watching',  activeColor: 'text-brand-cyan border-brand-cyan/40 bg-brand-cyan/10' },
  { key: 'shield', emoji: '🛡️', label: 'Key Intel', activeColor: 'text-brand-green border-brand-green/40 bg-brand-green/10' },
];

const formatDate = (ts) =>
  new Date(ts).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const getCategoryConfig = (cat) => CATEGORY_CONFIG[cat] || CATEGORY_CONFIG['General'];

// ─── Newsletter Subscribe Bar ────────────────────────────────────────────────
const NewsletterBar = ({ onSubscribed }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return;
    setStatus('loading');

    const supabase = getSupabase();
    if (!supabase) { setStatus('error'); return; }

    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert({ email: email.trim() }, { onConflict: 'email' });

    if (error) {
      setStatus('error');
      return;
    }

    // Send welcome email via EmailJS (graceful fail if not configured)
    try {
      const svcId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const tplId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const pubKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      if (svcId && tplId && pubKey) {
        await emailjs.send(svcId, tplId, {
          subscriber_email: email.trim(),
          admin_email: ADMIN_EMAIL,
          to_email: email.trim(),
          reply_to: ADMIN_EMAIL
        }, pubKey);
      }
    } catch (_) {}

    setStatus('success');
    onSubscribed?.();
    setEmail('');
    setTimeout(() => setStatus('idle'), 4000);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-cyan/20 bg-black/40 backdrop-blur-md p-6 mb-8">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-cyan/0 via-brand-cyan to-brand-cyan/0" />
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center shrink-0">
            <Rss className="w-5 h-5 text-brand-cyan" />
          </div>
          <div>
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider">Subscribe to Cyber Intel Feed</h4>
            <p className="text-slate-400 text-xs font-sans mt-0.5">Get the latest cybersecurity news, zero-days & threat alerts delivered to your inbox — free.</p>
          </div>
        </div>

        {status === 'success' ? (
          <div className="flex items-center gap-2 text-brand-green font-mono text-sm shrink-0">
            <CheckCircle className="w-4 h-4" />
            <span>Subscribed! Welcome to the network.</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex gap-2 shrink-0 w-full sm:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agent@domain.com"
              disabled={status === 'loading'}
              className="flex-1 sm:w-64 px-3 py-2 bg-black/50 border border-white/10 rounded-lg font-mono text-xs text-white outline-none focus:border-brand-cyan/50 placeholder-slate-600 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === 'loading' || !email}
              className="px-4 py-2 bg-brand-cyan/20 hover:bg-brand-cyan/30 border border-brand-cyan/40 text-brand-cyan font-mono text-xs font-bold uppercase rounded-lg cursor-pointer transition-all active:scale-95 disabled:opacity-50 shrink-0 flex items-center gap-1.5"
            >
              {status === 'loading' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// ─── Article Card ────────────────────────────────────────────────────────────
const ArticleCard = ({ article, reactionCounts, onOpen }) => {
  const catCfg = getCategoryConfig(article.category);
  const totalReactions = Object.values(reactionCounts || {}).reduce((a, b) => a + b, 0);

  return (
    <div
      className="glass-panel flex flex-col border border-white/5 hover:border-brand-cyan/25 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer group overflow-hidden"
      onClick={() => onOpen(article)}
    >
      {/* Cover image */}
      <div className="h-44 bg-gradient-to-br from-black/80 to-slate-900/60 overflow-hidden relative flex-shrink-0">
        {article.thumbnail_url ? (
          <img
            src={article.thumbnail_url}
            alt={article.title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
              {catCfg.icon || <Newspaper className="w-7 h-7 text-slate-600" />}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span className={`absolute top-3 left-3 font-mono text-[0.55rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded border flex items-center gap-1 ${catCfg.color}`}>
          {catCfg.icon} {article.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 space-y-3">
        <h3 className="font-display font-bold text-white text-sm leading-snug group-hover:text-brand-cyan transition-colors line-clamp-2">
          {article.title}
        </h3>
        {article.summary && (
          <p className="text-slate-400 text-xs leading-relaxed font-sans line-clamp-3">
            {article.summary}
          </p>
        )}
        {article.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {article.tags.slice(0, 3).map(tag => (
              <span key={tag} className="font-mono text-[0.52rem] px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-slate-500">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 pb-4 border-t border-white/5 pt-3 flex items-center justify-between text-[0.6rem] font-mono text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {formatDate(article.created_at)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" /> {article.views || 0}
          </span>
        </div>
        {totalReactions > 0 && (
          <span className="text-brand-cyan">{totalReactions} reactions</span>
        )}
      </div>
    </div>
  );
};

// ─── Comment Thread ──────────────────────────────────────────────────────────
const CommentThread = ({ comment, replies, authUser, onReply }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [posting, setPosting] = useState(false);

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;
    setPosting(true);
    const supabase = getSupabase();
    if (!supabase) { setPosting(false); return; }

    const name = authUser ? (authUser.user_metadata?.name || authUser.email) : guestName;
    const email = authUser ? authUser.email : guestEmail;

    await supabase.from('news_comments').insert({
      news_id: comment.news_id,
      parent_id: comment.id,
      user_email: email || 'guest@anon.com',
      user_name: name || 'Agent',
      content: replyContent.trim()
    });

    setPosting(false);
    setReplyContent('');
    setShowReplyBox(false);
    onReply?.();
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        <div className="w-7 h-7 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center font-mono text-[0.55rem] text-brand-cyan font-bold shrink-0">
          {(comment.user_name || 'A')[0].toUpperCase()}
        </div>
        <div className="flex-1 bg-black/40 border border-white/5 rounded-xl p-3 space-y-1.5">
          <div className="flex items-center gap-2 font-mono text-[0.6rem]">
            <span className="text-brand-cyan font-bold">{comment.user_name || 'Agent'}</span>
            <span className="text-slate-600">{formatDate(comment.created_at)}</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed font-sans">{comment.content}</p>
          <button
            onClick={() => setShowReplyBox(!showReplyBox)}
            className="text-slate-500 hover:text-brand-cyan transition-colors font-mono text-[0.58rem] flex items-center gap-1 cursor-pointer"
          >
            <MessageCircle className="w-3 h-3" /> Reply
          </button>

          {showReplyBox && (
            <div className="space-y-2 mt-2 pt-2 border-t border-white/5 animate-fadeIn">
              {!authUser && (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                    placeholder="Your name"
                    className="px-2.5 py-1.5 bg-black/40 border border-white/10 rounded text-xs text-white outline-none focus:border-brand-cyan font-mono"
                  />
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={e => setGuestEmail(e.target.value)}
                    placeholder="Email (optional)"
                    className="px-2.5 py-1.5 bg-black/40 border border-white/10 rounded text-xs text-white outline-none focus:border-brand-cyan font-mono"
                  />
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyContent}
                  onChange={e => setReplyContent(e.target.value)}
                  placeholder="Write reply..."
                  className="flex-1 px-2.5 py-1.5 bg-black/40 border border-white/10 rounded text-xs text-white outline-none focus:border-brand-cyan font-mono"
                  onKeyDown={e => { if (e.key === 'Enter') handleSubmitReply(); }}
                />
                <button
                  onClick={handleSubmitReply}
                  disabled={posting}
                  className="px-3 bg-brand-cyan/20 border border-brand-cyan/35 text-brand-cyan font-bold rounded cursor-pointer hover:bg-brand-cyan/30 transition-all"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {replies?.length > 0 && (
        <div className="ml-10 space-y-2">
          {replies.map(reply => (
            <div key={reply.id} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center font-mono text-[0.5rem] text-brand-purple font-bold shrink-0">
                {(reply.user_name || 'A')[0].toUpperCase()}
              </div>
              <div className="flex-1 bg-black/30 border border-white/5 rounded-lg p-2.5 space-y-1">
                <div className="flex items-center gap-2 font-mono text-[0.58rem]">
                  <span className="text-brand-purple font-bold">{reply.user_name || 'Agent'}</span>
                  <span className="text-slate-600">{formatDate(reply.created_at)}</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed font-sans">{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Article Modal ───────────────────────────────────────────────────────────
const ArticleModal = ({ article, authUser, onClose }) => {
  const [reactions, setReactions] = useState({});
  const [myReaction, setMyReaction] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [postingComment, setPostingComment] = useState(false);
  const [loading, setLoading] = useState(true);

  const userIdentifier = authUser?.email || `guest-${navigator.userAgent.slice(0, 40)}`;

  useEffect(() => {
    loadReactions();
    loadComments();
    incrementViews();
  }, [article.id]);

  const incrementViews = async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.from('cyber_news').update({ views: (article.views || 0) + 1 }).eq('id', article.id);
  };

  const loadReactions = async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    const { data } = await supabase.from('news_reactions').select('reaction, user_identifier').eq('news_id', article.id);
    if (!data) return;

    const counts = {};
    let mine = null;
    data.forEach(r => {
      counts[r.reaction] = (counts[r.reaction] || 0) + 1;
      if (r.user_identifier === userIdentifier) mine = r.reaction;
    });
    setReactions(counts);
    setMyReaction(mine);
  };

  const handleReact = async (reactionKey) => {
    const supabase = getSupabase();
    if (!supabase) return;

    if (myReaction === reactionKey) {
      // Toggle off
      await supabase.from('news_reactions')
        .delete()
        .eq('news_id', article.id)
        .eq('user_identifier', userIdentifier);
      setMyReaction(null);
      setReactions(prev => ({ ...prev, [reactionKey]: Math.max(0, (prev[reactionKey] || 1) - 1) }));
    } else {
      // Remove previous if exists
      if (myReaction) {
        await supabase.from('news_reactions')
          .delete()
          .eq('news_id', article.id)
          .eq('user_identifier', userIdentifier);
        setReactions(prev => ({ ...prev, [myReaction]: Math.max(0, (prev[myReaction] || 1) - 1) }));
      }

      await supabase.from('news_reactions').upsert({
        news_id: article.id,
        user_identifier: userIdentifier,
        reaction: reactionKey
      }, { onConflict: 'news_id,user_identifier,reaction' });

      setMyReaction(reactionKey);
      setReactions(prev => ({ ...prev, [reactionKey]: (prev[reactionKey] || 0) + 1 }));
    }
  };

  const loadComments = async () => {
    setLoading(true);
    const supabase = getSupabase();
    if (!supabase) { setLoading(false); return; }

    const { data } = await supabase
      .from('news_comments')
      .select('*')
      .eq('news_id', article.id)
      .order('created_at', { ascending: true });

    setComments(data || []);
    setLoading(false);
  };

  const postComment = async () => {
    if (!commentContent.trim()) return;
    setPostingComment(true);
    const supabase = getSupabase();
    if (!supabase) { setPostingComment(false); return; }

    const name = authUser ? (authUser.user_metadata?.name || authUser.email.split('@')[0]) : guestName;
    const email = authUser ? authUser.email : guestEmail;

    await supabase.from('news_comments').insert({
      news_id: article.id,
      parent_id: null,
      user_email: email || 'guest@anon.com',
      user_name: name || 'Anonymous Agent',
      content: commentContent.trim()
    });

    setCommentContent('');
    setGuestName('');
    setGuestEmail('');
    setPostingComment(false);
    loadComments();
  };

  const topLevelComments = comments.filter(c => !c.parent_id);
  const getReplies = (commentId) => comments.filter(c => c.parent_id === commentId);
  const catCfg = getCategoryConfig(article.category);

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-start justify-center overflow-y-auto p-4 pt-8">
      <div className="max-w-4xl w-full space-y-0 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 w-9 h-9 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-brand-cyan/40 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Cover */}
        {article.thumbnail_url && (
          <div className="h-64 rounded-t-2xl overflow-hidden">
            <img src={article.thumbnail_url} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Article body */}
        <div className="bg-[#0d1117] border border-white/5 rounded-b-2xl rounded-t-none p-8 space-y-6">
          {/* Meta */}
          <div className="flex flex-wrap gap-3 items-center">
            <span className={`font-mono text-[0.58rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded border flex items-center gap-1 ${catCfg.color}`}>
              {catCfg.icon} {article.category}
            </span>
            <span className="font-mono text-[0.6rem] text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {formatDate(article.created_at)}
            </span>
            <span className="font-mono text-[0.6rem] text-slate-500 flex items-center gap-1">
              <Eye className="w-3 h-3" /> {article.views || 0} views
            </span>
          </div>

          <h1 className="font-display text-2xl font-bold text-white leading-snug">{article.title}</h1>

          {article.summary && (
            <p className="text-slate-400 font-sans text-sm leading-relaxed border-l-2 border-brand-cyan/30 pl-4 italic">
              {article.summary}
            </p>
          )}

          {article.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {article.tags.map(tag => (
                <span key={tag} className="font-mono text-[0.58rem] px-2 py-0.5 bg-white/5 border border-white/10 rounded text-slate-400">#{tag}</span>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="article-content prose-cyber">
            <div
              className="font-sans text-slate-300 text-sm leading-relaxed space-y-4 
                [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mb-3 [&_h1]:mt-5
                [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-brand-cyan [&_h2]:mb-2 [&_h2]:mt-4
                [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-white [&_h3]:mb-2 [&_h3]:mt-3
                [&_p]:mb-3 [&_p]:leading-relaxed
                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:text-slate-300
                [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1
                [&_li]:text-sm [&_li]:leading-relaxed
                [&_a]:text-brand-cyan [&_a]:underline [&_a]:hover:text-brand-green [&_a]:transition-colors
                [&_strong]:text-white [&_strong]:font-bold
                [&_em]:text-slate-400 [&_em]:italic
                [&_code]:text-brand-cyan [&_code]:bg-black/50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono
                [&_pre]:bg-black/80 [&_pre]:border [&_pre]:border-white/10 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:text-xs [&_pre]:font-mono [&_pre]:text-brand-green [&_pre]:my-4
                [&_blockquote]:border-l-2 [&_blockquote]:border-brand-cyan/40 [&_blockquote]:pl-4 [&_blockquote]:text-slate-400 [&_blockquote]:italic [&_blockquote]:my-4
                [&_img]:rounded-xl [&_img]:max-w-full [&_img]:my-4 [&_img]:border [&_img]:border-white/10
                [&_video]:rounded-xl [&_video]:max-w-full [&_video]:my-4 [&_video]:w-full
                [&_iframe]:w-full [&_iframe]:rounded-xl [&_iframe]:my-4 [&_iframe]:border-0 [&_iframe]:aspect-video
                [&_hr]:border-white/10 [&_hr]:my-6
                [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
                [&_th]:border [&_th]:border-white/10 [&_th]:px-3 [&_th]:py-2 [&_th]:bg-white/5 [&_th]:text-left [&_th]:text-xs [&_th]:font-mono [&_th]:text-brand-cyan
                [&_td]:border [&_td]:border-white/5 [&_td]:px-3 [&_td]:py-2 [&_td]:text-xs"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          {/* Reactions */}
          <div className="border-t border-white/5 pt-5 space-y-3">
            <span className="font-mono text-[0.62rem] text-slate-500 uppercase tracking-wider font-bold">// Reaction Vector</span>
            <div className="flex flex-wrap gap-2">
              {REACTIONS.map(r => {
                const isActive = myReaction === r.key;
                const count = reactions[r.key] || 0;
                return (
                  <button
                    key={r.key}
                    onClick={() => handleReact(r.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg font-mono text-xs cursor-pointer transition-all active:scale-95 ${
                      isActive ? r.activeColor : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    <span>{r.emoji}</span>
                    <span className="font-bold">{r.label}</span>
                    {count > 0 && <span className={`px-1 rounded ${isActive ? '' : 'text-slate-500'}`}>{count}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comments */}
          <div className="border-t border-white/5 pt-5 space-y-5">
            <span className="font-mono text-[0.62rem] text-slate-500 uppercase tracking-wider font-bold flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" /> // Comment Thread ({comments.length})
            </span>

            {/* Add comment */}
            <div className="space-y-2 bg-black/30 border border-white/5 rounded-xl p-4">
              {!authUser && (
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="Your name" className="px-3 py-2 bg-black/40 border border-white/10 rounded-lg font-mono text-xs text-white outline-none focus:border-brand-cyan" />
                  <input type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} placeholder="Email (optional)" className="px-3 py-2 bg-black/40 border border-white/10 rounded-lg font-mono text-xs text-white outline-none focus:border-brand-cyan" />
                </div>
              )}
              {authUser && (
                <div className="font-mono text-[0.62rem] text-brand-cyan mb-1">// Posting as: {authUser.user_metadata?.name || authUser.email}</div>
              )}
              <div className="flex gap-2">
                <textarea
                  value={commentContent}
                  onChange={e => setCommentContent(e.target.value)}
                  placeholder="Share your analysis or threat insights..."
                  rows={2}
                  className="flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded-lg font-sans text-xs text-white outline-none focus:border-brand-cyan resize-none"
                />
                <button
                  onClick={postComment}
                  disabled={postingComment || !commentContent.trim()}
                  className="px-3 py-2 bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan font-bold rounded-lg cursor-pointer hover:bg-brand-cyan/30 transition-all disabled:opacity-40 flex items-center gap-1 self-end"
                >
                  {postingComment ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Comments list */}
            {loading ? (
              <div className="flex items-center gap-2 text-slate-500 font-mono text-xs py-4">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading thread...
              </div>
            ) : topLevelComments.length === 0 ? (
              <div className="text-center py-6 text-slate-600 font-mono text-xs">// No comments yet. Be the first analyst to respond.</div>
            ) : (
              <div className="space-y-4">
                {topLevelComments.map(comment => (
                  <CommentThread
                    key={comment.id}
                    comment={comment}
                    replies={getReplies(comment.id)}
                    authUser={authUser}
                    onReply={loadComments}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main News Page ──────────────────────────────────────────────────────────
export default function News({ authUser }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [reactionCounts, setReactionCounts] = useState({});
  const [newArticleCount, setNewArticleCount] = useState(0);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('cyber_news')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    setArticles(data || []);
    setLoading(false);

    // Track new articles since last visit
    const lastVisited = localStorage.getItem('news_last_visited_at');
    if (lastVisited && data) {
      const count = data.filter(a => new Date(a.created_at) > new Date(lastVisited)).length;
      setNewArticleCount(count);
    }

    // Update last visited timestamp
    localStorage.setItem('news_last_visited_at', new Date().toISOString());

    // Load reactions for all articles
    if (data?.length) {
      const { data: reactions } = await supabase
        .from('news_reactions')
        .select('news_id, reaction')
        .in('news_id', data.map(a => a.id));

      if (reactions) {
        const counts = {};
        reactions.forEach(r => {
          if (!counts[r.news_id]) counts[r.news_id] = {};
          counts[r.news_id][r.reaction] = (counts[r.news_id][r.reaction] || 0) + 1;
        });
        setReactionCounts(counts);
      }
    }
  };

  const filtered = articles.filter(a => {
    const matchCat = activeCategory === 'All' || a.category === activeCategory;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.summary?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const supabase = getSupabase();

  return (
    <section className="py-12 animate-fadeIn">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <div className="font-mono text-xs text-brand-cyan px-2.5 py-1 bg-brand-cyan/5 border border-brand-cyan/20 rounded">10</div>
          <h2 className="font-display text-lg font-bold text-white tracking-wider uppercase">Cyber Intel Feed</h2>
          <div className="flex-1 h-px bg-white/5" />
          {authUser?.email === ADMIN_EMAIL && (
            <Link
              to="/admin"
              className="font-mono text-[0.6rem] px-3 py-1.5 border border-brand-purple/30 bg-brand-purple/10 text-brand-purple rounded uppercase tracking-widest hover:bg-brand-purple/20 transition-all no-underline"
            >
              ⚙️ Admin Panel
            </Link>
          )}
        </div>
        <p className="font-mono text-xs text-slate-400">Live cybersecurity intelligence: zero-days, APT campaigns, tool releases, and research findings.</p>
      </div>

      {/* Newsletter bar */}
      <NewsletterBar onSubscribed={loadArticles} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-mono text-[0.6rem] px-3 py-1.5 rounded border uppercase tracking-widest transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-brand-cyan/20 border-brand-cyan/45 text-brand-cyan font-bold'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative sm:ml-auto">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search intel feed..."
            className="pl-7 pr-3 py-1.5 bg-black/40 border border-white/10 rounded-lg font-mono text-xs text-white outline-none focus:border-brand-cyan/50 placeholder-slate-600 w-full sm:w-56"
          />
        </div>
      </div>

      {/* Articles grid */}
      {!supabase ? (
        <div className="text-center py-20 space-y-3 font-mono">
          <Lock className="w-10 h-10 text-brand-purple mx-auto animate-pulse" />
          <h4 className="text-white font-bold uppercase text-sm">Database Not Connected</h4>
          <p className="text-slate-500 text-xs">Configure Supabase credentials to view the cyber intel feed.</p>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-panel h-64 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 space-y-3 font-mono">
          <Newspaper className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-slate-500 font-bold uppercase text-sm">No Intel Reports Found</h4>
          <p className="text-slate-600 text-xs">
            {activeCategory !== 'All' || search
              ? 'Try adjusting your filters or search terms.'
              : 'The admin has not published any articles yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(article => (
            <ArticleCard
              key={article.id}
              article={article}
              reactionCounts={reactionCounts[article.id]}
              onOpen={setSelectedArticle}
            />
          ))}
        </div>
      )}

      {/* Article Modal */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          authUser={authUser}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </section>
  );
}
