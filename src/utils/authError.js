/**
 * Formats Supabase Auth errors into human-readable messages.
 * Prevents opaque `AuthRetryableFetchError: {}` from printing as `❌ {}`.
 */
export const formatAuthError = (err, fallback = 'Authentication request failed.') => {
  if (!err) return fallback;

  // If err itself is a string
  if (typeof err === 'string' && err.trim() && err !== '{}' && err !== '[object Object]') {
    return err;
  }

  const status = err.status || err.statusCode || err.code;
  const msg = typeof err.message === 'string' ? err.message.trim() : '';

  // Check for opaque '{}' or '[object Object]'
  const isOpaque = !msg || msg === '{}' || msg === '[object Object]';

  // 500 error / unexpected_failure usually means SMTP or email dispatch failure in Supabase GoTrue
  if (status === 500 || err.error_code === 'unexpected_failure') {
    return 'Supabase failed to send verification email (HTTP 500). Please check your Supabase SMTP settings, or disable "Confirm email" under Authentication > Providers > Email in your Supabase Dashboard.';
  }

  if (isOpaque) {
    if (err.error_description) return err.error_description;
    if (err.msg) return err.msg;
    if (err.details) return err.details;
    if (status === 429) return 'Email rate limit exceeded. Please wait a few minutes before trying again.';
    if (status === 400) return 'Invalid credentials or registration parameters.';
    return fallback;
  }

  if (msg.toLowerCase().includes('error sending confirmation email')) {
    return 'Failed to send confirmation email. Please check your Supabase SMTP configuration or disable "Confirm email" in Supabase settings.';
  }

  return msg;
};
