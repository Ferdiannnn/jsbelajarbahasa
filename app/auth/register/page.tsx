'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { Mail, Lock, AlertCircle, Loader, CheckCircle, Circle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const validatePassword = (pwd: string) => {
    return pwd.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password || !confirmPassword) {
        throw new Error('Please fill in all fields');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Please enter a valid email');
      }

      if (!validatePassword(password)) {
        throw new Error('Password must be at least 8 characters');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      await register(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = password.length >= 8;
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute -bottom-8 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="card-elevated shadow-2xl">
          <div className="p-8 sm:p-10">
            {/* Logo/Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                <span className="text-2xl">✨</span>
              </div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                日本語を学ぼう
              </h1>
              <p className="text-slate-600 dark:text-slate-400">Create your account to start learning</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6 border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-semibold">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-styled pl-12"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-semibold">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="input-styled pl-12 pr-12"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  {passwordStrength ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-green-600 dark:text-green-400 font-semibold">Password is strong</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-5 h-5 text-slate-400" />
                      <span className="text-sm text-slate-500 dark:text-slate-400">Minimum 8 characters</span>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-700 dark:text-slate-300 font-semibold">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="input-styled pl-12 pr-12"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPassword && (
                  <div className="mt-2 flex items-center gap-2">
                    {passwordsMatch ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm text-green-600 dark:text-green-400 font-semibold">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-5 h-5 text-red-400" />
                        <span className="text-sm text-red-600 dark:text-red-500">Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading || !passwordStrength || !passwordsMatch}
                className="btn-gradient-secondary w-full h-11 text-base font-semibold"
              >
                {loading && <Loader className="w-5 h-5 animate-spin mr-2" />}
                {loading ? 'Creating account...' : 'Sign Up'}
              </Button>
            </form>

            <Separator className="my-6" />

            <div className="text-center">
              <p className="text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold underline"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-600 dark:text-slate-400 text-sm mt-6">
          By signing up, you agree to our terms of service
        </p>
      </div>
    </div>
  );
}
