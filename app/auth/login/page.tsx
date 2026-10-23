'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { Mail, Lock, AlertCircle, Loader, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Please enter a valid email');
      }

      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden">
      <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute -bottom-8 right-5 sm:right-10 w-48 sm:w-72 h-48 sm:h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="card-elevated shadow-2xl border border-white/20 dark:border-slate-700/30">
          <div className="p-8 sm:p-10 lg:p-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-5 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl">
                <span className="text-3xl sm:text-4xl">🎌</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-3">
                日本語を学ぼう
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">学習の道を続けましょう</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6 border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950 rounded-xl">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="text-sm sm:text-base text-red-800 dark:text-red-200 ml-2">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-semibold block">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-styled pl-12 sm:pl-13 text-sm sm:text-base h-12 sm:h-13 rounded-xl"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-semibold">Password</Label>
                  <Link href="/auth/forgot-password" className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-styled pl-12 sm:pl-13 pr-12 sm:pr-13 text-sm sm:text-base h-12 sm:h-13 rounded-xl w-full"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="btn-gradient w-full h-14 sm:h-16 text-lg sm:text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 mt-8"
              >
                {loading && <Loader className="w-6 h-6 animate-spin mr-3" />}
                {loading ? 'Logging in...' : 'Log In'}
              </Button>
            </form>

            <Separator className="my-8 bg-slate-200 dark:bg-slate-700" />

            <div className="text-center space-y-4">
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300">
                Don&apos;t have an account?{' '}
                <Link
                  href="/auth/register"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold underline underline-offset-2 hover:underline-offset-4 transition-all"
                >
                  Sign up
                </Link>
              </p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-500 leading-relaxed">
                By logging in, you agree to our<br />
                <Link href="#" className="text-blue-600 dark:text-blue-400 hover:underline">terms of service</Link>
                {' '}and{' '}
                <Link href="#" className="text-blue-600 dark:text-blue-400 hover:underline">privacy policy</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
