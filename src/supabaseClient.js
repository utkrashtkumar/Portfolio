import { createClient } from '@supabase/supabase-js';

export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  const localUrl = localStorage.getItem('utk_supabase_url');
  const localKey = localStorage.getItem('utk_supabase_key');
  
  return {
    url: envUrl || localUrl || '',
    key: envKey || localKey || '',
    isConfigured: !!((envUrl || localUrl) && (envKey || localKey)),
    isFromEnv: !!(envUrl && envKey),
  };
};

export const saveSupabaseConfig = (url, key) => {
  localStorage.setItem('utk_supabase_url', url.trim());
  localStorage.setItem('utk_supabase_key', key.trim());
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem('utk_supabase_url');
  localStorage.removeItem('utk_supabase_key');
};

let supabaseInstance = null;

export const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance;
  
  const { url, key } = getSupabaseConfig();
  if (url && key) {
    try {
      supabaseInstance = createClient(url, key);
      return supabaseInstance;
    } catch (e) {
      console.error('Failed to create Supabase client', e);
    }
  }
  return null;
};

export const rebindSupabase = () => {
  supabaseInstance = null;
  return getSupabase();
};
