'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/lib/validation';
import { signIn } from 'next-auth/react';

function getPasswordStrength(password: string): { level: 'weak' | 'medium' | 'strong'; percent: number } {
  if (!password) return { level: 'weak', percent: 0 };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2) return { level: 'weak', percent: 33 };
  if (score <= 4) return { level: 'medium', percent: 66 };
  return { level: 'strong', percent: 100 };
}

const strengthColors = {
  weak: 'bg-red-500',
  medium: 'bg-yellow-500',
  strong: 'bg-green-500',
};

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { phone: '' },
  });

  const passwordValue = watch('password', '');
  const strength = useMemo(() => getPasswordStrength(passwordValue), [passwordValue]);

  async function onSubmit(data: RegisterInput) {
    if (!agreedToTerms) return;
    setServerError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone || undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setServerError(body.message || 'Registration failed. Please try again.');
        return;
      }
      // Auto-sign in after registration
      const signInRes = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (signInRes?.error) {
        router.push('/auth/login');
      } else {
        router.push('/account');
      }
    } catch {
      setServerError('Something went wrong. Please try again.');
    }
  }

  async function handleGoogleSignIn() {
    await signIn('google', { callbackUrl: '/account' });
  }

  const inputClass =
    'w-full px-4 py-3 rounded-[var(--radius-sm)] bg-charcoal-light border border-[var(--border)] text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors';

  return (
    <div className="w-full max-w-md">
      <div className="bg-surface rounded-[var(--radius-md)] border border-[var(--border)] p-8 sm:p-10 shadow-[var(--shadow-deep)]">
        <h1 className="font-[var(--font-display)] text-2xl font-semibold text-text-primary text-center mb-1">
          Create your account
        </h1>
        <p className="text-text-secondary text-sm text-center mb-8">
          Start designing custom embroidery today
        </p>

        {/* Google OAuth */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-[var(--radius-sm)] border border-[var(--border)] bg-transparent text-text-primary text-sm font-medium hover:bg-surface-hover transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Sign up with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-text-muted text-xs tracking-wider uppercase">or</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        {serverError && (
          <div className="mb-4 p-3 rounded-[var(--radius-sm)] bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1.5">
              Full Name
            </label>
            <input id="name" type="text" autoComplete="name" {...register('name')} className={inputClass} placeholder="John Doe" />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">
              Email
            </label>
            <input id="email" type="email" autoComplete="email" {...register('email')} className={inputClass} placeholder="you@example.com" />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-text-secondary mb-1.5">
              Phone <span className="text-text-muted">(optional)</span>
            </label>
            <input id="phone" type="tel" autoComplete="tel" {...register('phone')} className={inputClass} placeholder="+91 9876543210" />
            {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                {...register('password')}
                className={`${inputClass} pr-12`}
                placeholder="Min 8 chars, uppercase, number, symbol"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  ) : (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </>
                  )}
                </svg>
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}

            {/* Strength indicator */}
            {passwordValue && (
              <div className="mt-2">
                <div className="h-1.5 w-full bg-charcoal-light rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${strengthColors[strength.level]}`}
                    style={{ width: `${strength.percent}%` }}
                  />
                </div>
                <p className={`mt-1 text-xs capitalize ${strength.level === 'weak' ? 'text-red-400' : strength.level === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                  {strength.level} password
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                {...register('confirmPassword')}
                className={`${inputClass} pr-12`}
                placeholder="Re-enter your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  {showConfirm ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  ) : (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </>
                  )}
                </svg>
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>}
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-[var(--border)] bg-charcoal-light accent-gold"
            />
            <span className="text-sm text-text-secondary leading-snug">
              I agree to the{' '}
              <Link href="/terms" className="text-gold hover:text-gold-light">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-gold hover:text-gold-light">Privacy Policy</Link>
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !agreedToTerms}
            className="w-full py-3 rounded-[var(--radius-sm)] bg-gold text-charcoal-deep font-semibold text-sm tracking-wide hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer relative overflow-hidden btn-shimmer"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating account...
              </span>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-gold hover:text-gold-light font-medium transition-colors">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
