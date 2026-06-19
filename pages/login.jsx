import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const router = useRouter()
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isSignup) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username: username || email.split('@')[0] } }
        })
        if (signUpError) throw signUpError
        alert('Check your email for the confirmation link!')
        setIsSignup(false)
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        if (signInError) throw signInError
        router.push('/chat')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider) => {
    try {
      await supabase.auth.signInWithOAuth({ provider })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <Head>
        <title>{isSignup ? 'Sign Up' : 'Log In'} | FrameX</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </Head>

      <div className="aurora-bg">
        <div className="aurora-blob aurora-blob--1" />
        <div className="aurora-blob aurora-blob--2" />
      </div>

      <Nav />

      <section className="auth-section">
        <div className="auth-glass">
          <div className="auth-header">
            <span className="section-label">{isSignup ? 'Get Started' : 'Welcome Back'}</span>
            <h1>{isSignup ? 'Sign Up' : 'Log In'}</h1>
            <p>{isSignup ? 'Create your FrameX account' : 'Sign in to continue to FrameX'}</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            {isSignup && (
              <div className="form-group">
                <label htmlFor="username">
                  <i className="fas fa-user" /> Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="yourname"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">
                <i className="fas fa-envelope" /> Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <i className="fas fa-lock" /> Password
              </label>
              <input
                id="password"
                type="password"
                placeholder={isSignup ? 'Create a password' : 'Enter your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="btn-primary auth-submit" disabled={loading}>
              {loading ? (
                <span><i className="fas fa-spinner fa-spin" /> {isSignup ? 'Creating account...' : 'Signing in...'}</span>
              ) : (
                <span>{isSignup ? 'Create Account' : 'Sign In'} <i className="fas fa-arrow-right" /></span>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <div className="social-auth">
            <button className="social-auth-btn" onClick={() => handleSocialLogin('google')}>
              <i className="fab fa-google" /> Google
            </button>
            <button className="social-auth-btn" onClick={() => handleSocialLogin('apple')}>
              <i className="fab fa-apple" /> Apple
            </button>
            <button className="social-auth-btn" onClick={() => handleSocialLogin('github')}>
              <i className="fab fa-github" /> GitHub
            </button>
          </div>

          <p className="auth-footer-text">
            {isSignup ? (
              <>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsSignup(false); setError(null); }}>Log In</a></>
            ) : (
              <>Don&apos;t have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsSignup(true); setError(null); }}>Sign Up</a></>
            )}
          </p>
        </div>
      </section>

      <Footer />
    </>
  )
}
