import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSupabase } from '../supabaseClient.js';
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Send, Upload, FileText,
  Code, Image, Video, Link2, X, ChevronRight, ChevronLeft,
  CheckCircle, Loader2, AlertTriangle, Users, BarChart2,
  Newspaper, Save, Globe, Lock, ArrowLeft, RefreshCw,
  FileCode, Play, Film, Paperclip
} from 'lucide-react';

const ADMIN_EMAIL = 'utkrashtkumar@gmail.com';
const CATEGORIES = ['General', 'Vulnerabilities', 'Attacks', 'Tools', 'Research'];

// ─── Auth Guard ──────────────────────────────────────────────────────────────
const AccessDenied = () => (
  <div className="min-h-[70vh] flex items-center justify-center animate-fadeIn">
    <div className="glass-panel p-10 max-w-sm w-full text-center space-y-5 border border-brand-pink/20">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand-pink" />
      <Lock className="w-12 h-12 text-brand-pink mx-auto animate-pulse" />
      <h3 className="font-display font-bold text-white uppercase tracking-wider">Access Denied</h3>
      <p className="text-slate-400 font-sans text-xs leading-relaxed">
        This terminal is restricted to the site administrator only. Unauthorized access attempts are logged.
      </p>
      <Link to="/" className="block font-mono text-xs text-brand-pink border border-brand-pink/30 rounded px-4 py-2 hover:bg-brand-pink/10 transition-all no-underline">
        Return to Terminal
      </Link>
    </div>
  </div>
);

// ─── Stats Card ──────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, color }) => (
  <div className={`glass-panel p-4 border flex items-center gap-3 ${color}`}>
    <div className="p-2 rounded-lg bg-white/5">{icon}</div>
    <div>
      <div className="font-mono text-[0.6rem] text-slate-500 uppercase tracking-wider">{label}</div>
      <div className="font-display font-bold text-white text-xl">{value}</div>
    </div>
  </div>
);

// ─── Inline Media Insert Bar ─────────────────────────────────────────────────
const MediaInsertBar = ({ contentRef, onInsert, supabase }) => {
  const imgFileRef = useRef(null);
  const videoFileRef = useRef(null);
  const [uploading, setUploading] = useState(null); // null | 'image' | 'video'
  const [showUrlInput, setShowUrlInput] = useState(null); // null | 'img' | 'video'
  const [urlValue, setUrlValue] = useState('');

  const insertAtCursor = (html) => {
    const ta = contentRef.current;
    if (!ta) { onInsert(prev => prev + html); return; }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const value = ta.value;
    const newVal = value.substring(0, start) + html + value.substring(end);
    onInsert(newVal);
    setTimeout(() => {
      ta.selectionStart = ta.selectionEnd = start + html.length;
      ta.focus();
    }, 0);
  };

  const handleImageUrl = () => {
    if (!urlValue.trim()) return;
    insertAtCursor(`<img src="${urlValue.trim()}" alt="" style="max-width:100%;border-radius:8px;margin:1rem 0;" />\n`);
    setUrlValue('');
    setShowUrlInput(null);
  };

  const handleVideoUrl = () => {
    const url = urlValue.trim();
    if (!url) return;

    let embedHtml = '';
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);

    if (ytMatch) {
      embedHtml = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:1.5rem 0;border-radius:12px;border:1px solid rgba(255,255,255,0.1)"><iframe src="https://www.youtube.com/embed/${ytMatch[1]}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe></div>\n`;
    } else if (vimeoMatch) {
      embedHtml = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:1.5rem 0;border-radius:12px;border:1px solid rgba(255,255,255,0.1)"><iframe src="https://player.vimeo.com/video/${vimeoMatch[1]}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen></iframe></div>\n`;
    } else {
      embedHtml = `<video controls style="width:100%;border-radius:12px;margin:1rem 0;border:1px solid rgba(255,255,255,0.1)"><source src="${url}" />Your browser does not support this video.</video>\n`;
    }

    insertAtCursor(embedHtml);
    setUrlValue('');
    setShowUrlInput(null);
  };

  const uploadFile = async (file, bucket) => {
    if (!supabase) return null;
    const path = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
    if (error) { console.error(error); return null; }
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return publicUrl;
  };

  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading('image');
    const url = await uploadFile(file, 'news-images');
    if (url) {
      insertAtCursor(`<img src="${url}" alt="${file.name}" style="max-width:100%;border-radius:8px;margin:1rem 0;" />\n`);
    }
    setUploading(null);
    e.target.value = '';
  };

  const handleVideoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading('video');
    const url = await uploadFile(file, 'news-videos');
    if (url) {
      insertAtCursor(`<video controls style="width:100%;border-radius:12px;margin:1rem 0;border:1px solid rgba(255,255,255,0.1)"><source src="${url}" type="${file.type}" />Your browser does not support this video.</video>\n`);
    }
    setUploading(null);
    e.target.value = '';
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setShowUrlInput(showUrlInput === 'img' ? null : 'img')} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-brand-cyan/10 border border-brand-cyan/25 text-brand-cyan font-mono text-[0.6rem] rounded cursor-pointer hover:bg-brand-cyan/20 transition-all">
          <Image className="w-3 h-3" /> Image URL
        </button>
        <button type="button" onClick={() => imgFileRef.current?.click()} disabled={uploading === 'image'} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-brand-cyan/10 border border-brand-cyan/25 text-brand-cyan font-mono text-[0.6rem] rounded cursor-pointer hover:bg-brand-cyan/20 transition-all disabled:opacity-50">
          {uploading === 'image' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Paperclip className="w-3 h-3" />}
          {uploading === 'image' ? 'Uploading...' : 'Upload Image'}
        </button>
        <button type="button" onClick={() => setShowUrlInput(showUrlInput === 'video' ? null : 'video')} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-brand-purple/10 border border-brand-purple/25 text-brand-purple font-mono text-[0.6rem] rounded cursor-pointer hover:bg-brand-purple/20 transition-all">
          <Link2 className="w-3 h-3" /> Video URL / YT / Vimeo
        </button>
        <button type="button" onClick={() => videoFileRef.current?.click()} disabled={uploading === 'video'} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-brand-purple/10 border border-brand-purple/25 text-brand-purple font-mono text-[0.6rem] rounded cursor-pointer hover:bg-brand-purple/20 transition-all disabled:opacity-50">
          {uploading === 'video' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Film className="w-3 h-3" />}
          {uploading === 'video' ? 'Uploading...' : 'Upload Video'}
        </button>
      </div>

      {showUrlInput && (
        <div className="flex gap-2 animate-fadeIn">
          <input
            type="url"
            value={urlValue}
            onChange={e => setUrlValue(e.target.value)}
            placeholder={showUrlInput === 'img' ? 'https://example.com/image.png' : 'https://youtube.com/watch?v=... or https://vimeo.com/...'}
            className="flex-1 px-3 py-1.5 bg-black/40 border border-white/10 rounded font-mono text-xs text-white outline-none focus:border-brand-cyan"
            onKeyDown={e => { if (e.key === 'Enter') showUrlInput === 'img' ? handleImageUrl() : handleVideoUrl(); }}
          />
          <button
            type="button"
            onClick={showUrlInput === 'img' ? handleImageUrl : handleVideoUrl}
            className="px-3 py-1.5 bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan font-mono text-xs font-bold rounded cursor-pointer hover:bg-brand-cyan/30 transition-all"
          >
            Insert
          </button>
          <button type="button" onClick={() => { setShowUrlInput(null); setUrlValue(''); }} className="px-2.5 py-1.5 text-slate-500 hover:text-white cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <input ref={imgFileRef} type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
      <input ref={videoFileRef} type="file" accept="video/*" onChange={handleVideoFileUpload} className="hidden" />
    </div>
  );
};

// ─── Post Editor ─────────────────────────────────────────────────────────────
const PostEditor = ({ post, supabase, onSaved, onCancel }) => {
  const contentRef = useRef(null);
  const htmlFileRef = useRef(null);
  const thumbFileRef = useRef(null);

  const [formData, setFormData] = useState({
    title: post?.title || '',
    summary: post?.summary || '',
    content: post?.content || '',
    category: post?.category || 'General',
    tags: post?.tags?.join(', ') || '',
    thumbnail_url: post?.thumbnail_url || '',
    published: post?.published || false,
  });

  const [editorMode, setEditorMode] = useState('html'); // 'html' | 'text' | 'file'
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [thumbUploading, setThumbUploading] = useState(false);

  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const handleHtmlFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const html = ev.target.result;
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      const extracted = bodyMatch ? bodyMatch[1].trim() : html.trim();
      set('content', extracted);
      setEditorMode('html');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleThumbUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;
    setThumbUploading(true);
    const path = `thumbs/${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const { data, error } = await supabase.storage.from('news-images').upload(path, file, { upsert: false });
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('news-images').getPublicUrl(data.path);
      set('thumbnail_url', publicUrl);
    }
    setThumbUploading(false);
    e.target.value = '';
  };

  const getRenderedContent = () => {
    if (editorMode === 'text') {
      return formData.content.replace(/\n/g, '<br/>');
    }
    return formData.content;
  };

  const handleSave = async (publish) => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required.');
      return;
    }
    setSaving(true);
    setError('');

    const payload = {
      title: formData.title.trim(),
      summary: formData.summary.trim(),
      content: getRenderedContent(),
      category: formData.category,
      thumbnail_url: formData.thumbnail_url.trim() || null,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      published: publish,
      updated_at: new Date().toISOString()
    };

    let err;
    if (post?.id) {
      const { error: e } = await supabase.from('cyber_news').update(payload).eq('id', post.id);
      err = e;
    } else {
      const { error: e } = await supabase.from('cyber_news').insert(payload);
      err = e;
    }

    setSaving(false);
    if (err) {
      setError(err.message);
    } else {
      onSaved();
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Back + title */}
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider">
          {post?.id ? '✏️ Edit Article' : '📝 New Article'}
        </h3>
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className={`flex items-center gap-1.5 px-3 py-1.5 border font-mono text-[0.6rem] font-bold uppercase rounded cursor-pointer transition-all ${
              preview ? 'bg-brand-green/20 border-brand-green/40 text-brand-green' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {preview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {preview ? 'Hide Preview' : 'Preview'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-brand-pink/10 border border-brand-pink/20 rounded-lg text-brand-pink font-mono text-xs flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {error}
        </div>
      )}

      {preview ? (
        /* Preview mode */
        <div className="glass-panel p-6 border border-brand-cyan/20 rounded-2xl">
          <div className="font-mono text-[0.6rem] text-brand-cyan mb-3 uppercase tracking-wider">// Article Preview</div>
          {formData.thumbnail_url && (
            <img src={formData.thumbnail_url} alt="" className="w-full h-48 object-cover rounded-xl mb-4 border border-white/10" />
          )}
          <h2 className="font-display text-xl font-bold text-white mb-2">{formData.title || 'Untitled'}</h2>
          {formData.summary && <p className="text-slate-400 text-sm italic mb-4 border-l-2 border-brand-cyan/30 pl-3">{formData.summary}</p>}
          <div
            className="font-sans text-slate-300 text-sm leading-relaxed
              [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mb-3 [&_h1]:mt-5
              [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-brand-cyan [&_h2]:mb-2 [&_h2]:mt-4
              [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1
              [&_a]:text-brand-cyan [&_a]:underline
              [&_strong]:text-white [&_strong]:font-bold
              [&_code]:text-brand-cyan [&_code]:bg-black/50 [&_code]:px-1 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono
              [&_pre]:bg-black/80 [&_pre]:border [&_pre]:border-white/10 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:text-xs [&_pre]:font-mono [&_pre]:text-brand-green [&_pre]:my-4
              [&_img]:rounded-xl [&_img]:max-w-full [&_img]:my-4
              [&_video]:rounded-xl [&_video]:max-w-full [&_video]:my-4 [&_video]:w-full
              [&_iframe]:w-full [&_iframe]:rounded-xl [&_iframe]:my-4"
            dangerouslySetInnerHTML={{ __html: getRenderedContent() }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          {/* LEFT: Meta fields */}
          <div className="xl:col-span-4 space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="font-mono text-[0.62rem] text-slate-500 uppercase">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => set('title', e.target.value)}
                placeholder="Breaking: CVE-XXXX discovered..."
                className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-lg font-sans text-sm text-white outline-none focus:border-brand-cyan"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="font-mono text-[0.62rem] text-slate-500 uppercase">Category</label>
              <select
                value={formData.category}
                onChange={e => set('category', e.target.value)}
                className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-lg font-mono text-xs text-white outline-none focus:border-brand-cyan"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Summary */}
            <div className="space-y-1.5">
              <label className="font-mono text-[0.62rem] text-slate-500 uppercase">Summary / Excerpt</label>
              <textarea
                value={formData.summary}
                onChange={e => set('summary', e.target.value)}
                placeholder="Brief summary shown on the article card..."
                rows={3}
                className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-lg font-sans text-xs text-white outline-none focus:border-brand-cyan resize-none"
              />
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="font-mono text-[0.62rem] text-slate-500 uppercase">Tags (comma separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={e => set('tags', e.target.value)}
                placeholder="zero-day, RCE, CVE-2025"
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg font-mono text-xs text-white outline-none focus:border-brand-cyan"
              />
            </div>

            {/* Thumbnail */}
            <div className="space-y-2">
              <label className="font-mono text-[0.62rem] text-slate-500 uppercase">Thumbnail / Cover Image</label>
              {formData.thumbnail_url && (
                <img src={formData.thumbnail_url} alt="thumb" className="w-full h-28 object-cover rounded-lg border border-white/10" />
              )}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.thumbnail_url}
                  onChange={e => set('thumbnail_url', e.target.value)}
                  placeholder="https://... or upload below"
                  className="flex-1 px-2.5 py-1.5 bg-black/40 border border-white/10 rounded font-mono text-[0.6rem] text-white outline-none focus:border-brand-cyan"
                />
                <button
                  type="button"
                  onClick={() => thumbFileRef.current?.click()}
                  disabled={thumbUploading}
                  className="px-2.5 py-1.5 bg-brand-cyan/10 border border-brand-cyan/25 text-brand-cyan text-[0.6rem] font-mono rounded cursor-pointer hover:bg-brand-cyan/20 transition-all disabled:opacity-50 flex items-center gap-1"
                >
                  {thumbUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                  Upload
                </button>
                <input ref={thumbFileRef} type="file" accept="image/*" onChange={handleThumbUpload} className="hidden" />
              </div>
            </div>

            {/* Publish status */}
            <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/5 rounded-lg">
              <input
                type="checkbox"
                id="published-toggle"
                checked={formData.published}
                onChange={e => set('published', e.target.checked)}
                className="accent-brand-cyan cursor-pointer"
              />
              <label htmlFor="published-toggle" className="font-mono text-xs text-slate-300 cursor-pointer">
                Published (visible to public)
              </label>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleSave(false)}
                disabled={saving}
                className="w-full py-2.5 bg-white/5 border border-white/10 text-slate-300 font-mono text-xs font-bold uppercase rounded-lg cursor-pointer hover:bg-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSave(true)}
                disabled={saving}
                className="w-full py-2.5 bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan font-mono text-xs font-bold uppercase rounded-lg cursor-pointer hover:bg-brand-cyan/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                ✅ Publish Now
              </button>
            </div>
          </div>

          {/* RIGHT: Content Editor */}
          <div className="xl:col-span-8 space-y-3">
            {/* Mode selector */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[0.6rem] text-slate-500 uppercase mr-1">Content Mode:</span>
              {[
                { id: 'text', icon: <FileText className="w-3 h-3" />, label: 'Plain Text' },
                { id: 'html', icon: <Code className="w-3 h-3" />, label: 'HTML Raw' },
                { id: 'file', icon: <FileCode className="w-3 h-3" />, label: 'Upload .HTML' },
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => { setEditorMode(m.id); if (m.id === 'file') htmlFileRef.current?.click(); }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 border font-mono text-[0.6rem] rounded cursor-pointer transition-all ${
                    editorMode === m.id
                      ? 'bg-brand-cyan/20 border-brand-cyan/45 text-brand-cyan font-bold'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {m.icon} {m.label}
                </button>
              ))}
              <input ref={htmlFileRef} type="file" accept=".html,.htm" onChange={handleHtmlFileUpload} className="hidden" />
            </div>

            {/* Media insert bar */}
            <MediaInsertBar
              contentRef={contentRef}
              onInsert={(val) => {
                if (typeof val === 'function') {
                  setFormData(prev => ({ ...prev, content: val(prev.content) }));
                } else {
                  setFormData(prev => ({ ...prev, content: val }));
                }
              }}
              supabase={supabase}
            />

            {/* Content textarea */}
            <div className="relative">
              <textarea
                ref={contentRef}
                value={formData.content}
                onChange={e => set('content', e.target.value)}
                placeholder={
                  editorMode === 'text'
                    ? 'Write your article in plain text here...'
                    : '<!-- Paste raw HTML content here -->\n<h2>Breaking Vulnerability</h2>\n<p>Details...</p>'
                }
                rows={22}
                className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl font-mono text-[0.68rem] text-slate-300 outline-none focus:border-brand-cyan resize-none leading-relaxed"
              />
              <div className="absolute bottom-3 right-3 font-mono text-[0.52rem] text-slate-600">
                {formData.content.length} chars
              </div>
            </div>

            <div className="font-mono text-[0.55rem] text-slate-600 leading-relaxed">
              💡 <strong>HTML Mode:</strong> Use standard HTML tags. Media will be inserted at cursor. &nbsp;
              💡 <strong>Text Mode:</strong> Line breaks auto-converted to &lt;br&gt;. &nbsp;
              💡 <strong>File Upload:</strong> Uploads .html file and extracts the &lt;body&gt; content.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Admin Dashboard Main ────────────────────────────────────────────────────
export default function Admin({ authUser }) {
  if (!authUser || authUser.email !== ADMIN_EMAIL) {
    return <AccessDenied />;
  }

  const supabase = getSupabase();

  const [view, setView] = useState('dashboard'); // 'dashboard' | 'editor' | 'subscribers'
  const [articles, setArticles] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, subscribers: 0, reactions: 0, views: 0 });
  const [editingPost, setEditingPost] = useState(null); // null = new post
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    if (!supabase) { setLoading(false); return; }

    const [{ data: arts }, { data: subs }, { data: reacts }] = await Promise.all([
      supabase.from('cyber_news').select('*').order('created_at', { ascending: false }),
      supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false }),
      supabase.from('news_reactions').select('id'),
    ]);

    setArticles(arts || []);
    setSubscribers(subs || []);

    const published = (arts || []).filter(a => a.published).length;
    const totalViews = (arts || []).reduce((sum, a) => sum + (a.views || 0), 0);
    setStats({
      total: (arts || []).length,
      published,
      drafts: (arts || []).length - published,
      subscribers: (subs || []).length,
      reactions: (reacts || []).length,
      views: totalViews
    });

    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article permanently?')) return;
    await supabase.from('cyber_news').delete().eq('id', id);
    loadAll();
  };

  const handleTogglePublish = async (article) => {
    await supabase.from('cyber_news').update({ published: !article.published }).eq('id', article.id);
    loadAll();
  };

  const handleSaved = () => {
    setView('dashboard');
    setEditingPost(null);
    loadAll();
  };

  return (
    <section className="py-12 animate-fadeIn space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-white/5 pb-4">
        <div className="font-mono text-xs text-brand-cyan px-2.5 py-1 bg-brand-cyan/5 border border-brand-cyan/20 rounded">ADMIN</div>
        <h2 className="font-display text-lg font-bold text-white tracking-wider uppercase">Cyber Intel Admin Panel</h2>
        <span className="font-mono text-[0.6rem] text-brand-green border border-brand-green/20 bg-brand-green/5 px-2 py-0.5 rounded">
          ✅ Authenticated: {authUser.email}
        </span>
        <Link to="/news" className="ml-auto font-mono text-[0.6rem] text-slate-400 hover:text-brand-cyan flex items-center gap-1 no-underline transition-colors">
          <Globe className="w-3 h-3" /> View Live Feed
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard icon={<Newspaper className="w-4 h-4 text-brand-cyan" />} label="Total Posts" value={stats.total} color="border-brand-cyan/20" />
        <StatCard icon={<Globe className="w-4 h-4 text-brand-green" />} label="Published" value={stats.published} color="border-brand-green/20" />
        <StatCard icon={<Lock className="w-4 h-4 text-slate-400" />} label="Drafts" value={stats.drafts} color="border-white/5" />
        <StatCard icon={<Users className="w-4 h-4 text-brand-purple" />} label="Subscribers" value={stats.subscribers} color="border-brand-purple/20" />
        <StatCard icon={<Eye className="w-4 h-4 text-yellow-400" />} label="Total Views" value={stats.views} color="border-yellow-400/20" />
        <StatCard icon={<BarChart2 className="w-4 h-4 text-brand-pink" />} label="Reactions" value={stats.reactions} color="border-brand-pink/20" />
      </div>

      {/* Tab Nav */}
      {view !== 'editor' && (
        <div className="flex gap-2">
          {[
            { id: 'dashboard', label: '📰 Articles' },
            { id: 'subscribers', label: '📧 Subscribers' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`px-4 py-2 font-mono text-[0.6rem] font-bold uppercase rounded border cursor-pointer transition-all ${
                view === tab.id
                  ? 'bg-brand-cyan/20 border-brand-cyan/45 text-brand-cyan'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <button
            onClick={() => { setEditingPost(null); setView('editor'); }}
            className="ml-auto px-4 py-2 bg-brand-green/20 border border-brand-green/45 text-brand-green font-mono text-[0.6rem] font-bold uppercase rounded cursor-pointer hover:bg-brand-green/30 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> New Article
          </button>
        </div>
      )}

      {/* Views */}
      {view === 'editor' && (
        <div className="glass-panel p-6 border border-white/5 rounded-2xl">
          <PostEditor
            post={editingPost}
            supabase={supabase}
            onSaved={handleSaved}
            onCancel={() => { setView('dashboard'); setEditingPost(null); }}
          />
        </div>
      )}

      {view === 'dashboard' && (
        <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 font-mono text-xs text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading articles...
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16 space-y-3 font-mono text-slate-500">
              <Newspaper className="w-10 h-10 mx-auto text-slate-700" />
              <p>No articles yet. Click <strong>New Article</strong> to create your first post.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {articles.map(article => (
                <div key={article.id} className="p-4 flex items-center gap-4 hover:bg-white/3 transition-colors">
                  {article.thumbnail_url ? (
                    <img src={article.thumbnail_url} alt="" className="w-14 h-10 object-cover rounded-lg border border-white/10 shrink-0" />
                  ) : (
                    <div className="w-14 h-10 bg-white/5 rounded-lg border border-white/5 flex items-center justify-center shrink-0">
                      <Newspaper className="w-5 h-5 text-slate-700" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-sans font-semibold text-white text-sm truncate">{article.title}</h4>
                    <div className="flex items-center gap-3 mt-0.5 font-mono text-[0.58rem] text-slate-500">
                      <span>{article.category}</span>
                      <span className="flex items-center gap-0.5"><Eye className="w-2.5 h-2.5" /> {article.views || 0}</span>
                      <span>{new Date(article.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className={`font-mono text-[0.52rem] font-bold uppercase tracking-widest border px-2 py-0.5 rounded shrink-0 ${
                    article.published
                      ? 'text-brand-green border-brand-green/25 bg-brand-green/5'
                      : 'text-slate-500 border-slate-500/20 bg-slate-500/5'
                  }`}>
                    {article.published ? 'Live' : 'Draft'}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleTogglePublish(article)}
                      className={`p-1.5 rounded border cursor-pointer transition-all ${
                        article.published
                          ? 'text-slate-400 border-white/10 hover:text-white hover:border-white/20'
                          : 'text-brand-green border-brand-green/25 hover:bg-brand-green/10'
                      }`}
                      title={article.published ? 'Unpublish' : 'Publish'}
                    >
                      {article.published ? <EyeOff className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => { setEditingPost(article); setView('editor'); }}
                      className="p-1.5 rounded border border-white/10 text-brand-cyan hover:bg-brand-cyan/10 cursor-pointer transition-all"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="p-1.5 rounded border border-brand-pink/20 text-brand-pink hover:bg-brand-pink/10 cursor-pointer transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {view === 'subscribers' && (
        <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-brand-purple uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Newsletter Subscribers ({subscribers.length})
            </span>
            <span className="font-mono text-[0.6rem] text-slate-500">All emails stored in Supabase</span>
          </div>
          {subscribers.length === 0 ? (
            <div className="text-center py-10 text-slate-500 font-mono text-xs">No subscribers yet.</div>
          ) : (
            <div className="divide-y divide-white/5 max-h-[500px] overflow-auto">
              {subscribers.map((sub, i) => (
                <div key={sub.id} className="px-4 py-3 flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-600">#{i + 1}</span>
                    <span className="text-white">{sub.email}</span>
                  </div>
                  <span className="text-slate-500 text-[0.58rem]">{new Date(sub.subscribed_at).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
