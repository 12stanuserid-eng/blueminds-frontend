'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Shield, Layers } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('[https://build-a-simple-9058-api.onrender.com/api/login](https://build-a-simple-9058-api.onrender.com/api/login)', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Invalid credentials. Please try again.')
      }

      const data = await response.json()
      if (data.token) {
        localStorage.setItem('auth_token', data.token)
        router.push('/tasks')
      } else {
        throw new Error('Authentication failed.')
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected network error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-[#FAF9F6]">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl border border-neutral-100 shadow-premium">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-sm mb-4">
            <Layers className="h-6 w-6 stroke-[1.5]" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Welcome to Aura
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Sign in to access your curated dashboard.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-neutral-50 border border-neutral-200 p-3 text-xs font-medium text-neutral-700 text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-1.5">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-3 text-sm transition-all duration-200 placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-3 text-sm transition-all duration-200 placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="relative flex w-full items-center justify-center rounded-xl bg-neutral-950 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-neutral-800 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Authenticating
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                Continue Space <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 pt-4 border-t border-neutral-100 text-[11px] text-neutral-400 font-medium tracking-wide uppercase">
          <Shield className="h-3.5 w-3.5" /> Secure Enterprise Access
        </div>
      </div>
    </div>
  )
}