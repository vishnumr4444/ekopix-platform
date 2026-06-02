'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Shield, Lock, User, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('ekopix_admin_token', data.token);
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Network error. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#030305] relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(255,255,255,0.15),_transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(136,136,136,0.10),_transparent_60%)] pointer-events-none" />



      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border border-[#ffffff]/40 bg-[#ffffff]/10 mb-4">
            <Shield size={28} className="text-[#cccccc]" />
          </div>
          <h1 className="font-display font-black text-3xl text-white tracking-[0.15em]">
            EKO<span className="text-[#888888]">PIX</span>
          </h1>
          <p className="font-heading text-xs tracking-[0.4em] uppercase text-[#9b9bb1] mt-2">
            Admin Console
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={16} className="text-[#ffffff]" />
            <h2 className="font-heading text-sm tracking-[0.3em] uppercase text-[#F0F0F0]/80">
              Secure Login
            </h2>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl border border-[#888888]/40 bg-[#888888]/10">
              <AlertCircle size={16} className="text-[#888888] shrink-0" />
              <p className="font-body text-sm text-[#888888]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="username" className="block font-heading text-xs tracking-[0.3em] uppercase text-[#9b9bb1]">
                Username
              </label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9b9bb1]" />
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  placeholder="admin"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/10 bg-[#0d0d18] text-white placeholder-[#9b9bb1]/50 font-body text-sm focus:outline-none focus:border-[#ffffff]/60 focus:ring-1 focus:ring-[#ffffff]/40 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block font-heading text-xs tracking-[0.3em] uppercase text-[#9b9bb1]">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9b9bb1]" />
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-white/10 bg-[#0d0d18] text-white placeholder-[#9b9bb1]/50 font-body text-sm focus:outline-none focus:border-[#ffffff]/60 focus:ring-1 focus:ring-[#ffffff]/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9b9bb1] hover:text-white transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              id="admin-login-btn"
              className="w-full py-3.5 rounded-xl bg-white text-black font-heading uppercase tracking-[0.3em] text-sm font-semibold hover:bg-[#e0e0e0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating…
                </span>
              ) : (
                'Enter Console'
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <a href="/" className="font-heading text-xs tracking-[0.3em] uppercase text-[#9b9bb1] hover:text-[#cccccc] transition-colors">
              ← Back to Site
            </a>
          </div>
        </div>

        <p className="text-center font-body text-xs text-[#9b9bb1]/50 mt-6">
          Authorized personnel only. All access is logged.
        </p>
      </div>
    </div>
  );
}
