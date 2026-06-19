import { useEffect, useState } from 'react'
import Head from 'next/head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function Home() {
  const [dismissed, setDismissed] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Scroll reveal observer
    const revealEls = document.querySelectorAll('.reveal')
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            revealObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )
    revealEls.forEach((el) => revealObserver.observe(el))

    // Feature card mouse tracking
    const cards = document.querySelectorAll('.feature-card')
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        card.style.setProperty('--mouse-x', x + '%')
        card.style.setProperty('--mouse-y', y + '%')
      })
    })

    // Parallax stat badges
    const stats = document.querySelectorAll('.hero-stat')
    const handleMouse = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 6
      const y = (e.clientY / window.innerHeight - 0.5) * 6
      stats.forEach((stat, i) => {
        const factor = i === 0 ? 1 : -0.8
        stat.style.transform = `translate(${x * factor}px, ${y * factor}px)`
      })
    }
    window.addEventListener('mousemove', handleMouse)

    return () => {
      revealObserver.disconnect()
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [])

  return (
    <>
      <Head>
        <title>FrameX | Share Your World in Frames</title>
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
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/uicons-bold-rounded/css/uicons-bold-rounded.css"
        />
      </Head>

      <div className="aurora-bg">
        <div className="aurora-blob aurora-blob--1" />
        <div className="aurora-blob aurora-blob--2" />
      </div>

      <Nav onLoginClick={() => setShowModal(true)} />

      {/* Hero */}
      <section className="hero" id="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span>New</span>
            Now available on iOS &amp; Android
          </div>
          <h1>
            Share Your World<br />
            in <span className="gradient-text">Every Frame</span>
          </h1>
          <p>
            Discover, create, and connect with short videos and photos. Join millions of
            creators sharing their stories through the lens.
          </p>
          <div className="cta-buttons">
            <a href="#get-started" className="btn-primary">
              Get Started <i className="fas fa-arrow-right" />
            </a>
            <a href="#download" className="btn-secondary">
              <i className="fas fa-mobile-alt" /> Download App
            </a>
            <a href="#community" className="btn-secondary">
              <i className="fas fa-play" /> Explore Community
            </a>
          </div>
        </div>
        <div className="hero-media">
          <div className="glass-card-stack">
            <div className="glass-card">
              <div className="glass-card-decoration" />
              <div className="glass-card-icon"><i className="fas fa-video" /></div>
              <h3>Short Videos</h3>
              <p>Create and watch short, engaging videos</p>
            </div>
            <div className="glass-card">
              <div className="glass-card-decoration glass-card-decoration--2" />
              <div className="glass-card-icon"><i className="fas fa-camera" /></div>
              <h3>Photo Sharing</h3>
              <p>Share moments with high-quality photos</p>
            </div>
            <div className="glass-card">
              <div className="glass-card-icon"><i className="fas fa-users" /></div>
              <h3>Community</h3>
              <p>Connect with creators worldwide</p>
            </div>
          </div>
          <div className="hero-stat hero-stat--1">
            <strong>10M+</strong>
            <span>Active Users</span>
          </div>
          <div className="hero-stat hero-stat--2">
            <strong>4.8★</strong>
            <span>App Rating</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features">
        <div className="features-header reveal">
          <span className="section-label">Features</span>
          <h2>Built for Creators</h2>
          <p>Everything you need to capture, edit, and share your perspective with the world.</p>
        </div>
        <div className="feature-cards">
          {[
            { icon: 'fa-video', title: 'Short Videos', desc: 'Create and watch short, engaging videos on any topic. Our smart editor makes it effortless.' },
            { icon: 'fa-camera', title: 'Photo Sharing', desc: 'Share moments with high-quality photos and professional-grade filters built right in.' },
            { icon: 'fa-users', title: 'Community', desc: 'Connect with creators and friends from around the world. Your audience is waiting.' },
          ].map((f, i) => (
            <div key={f.title} className={`feature-card reveal reveal-delay-${i + 1}`}>
              <div className="feature-icon"><i className={`fas ${f.icon}`} /></div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Continue in Browser Bar */}
      {!dismissed && (
        <div className="browser-bar">
          <div className="browser-bar-content">
            <div className="browser-bar-text">
              <span className="browser-bar-icon"><i className="fas fa-mobile-alt" /></span>
              <span>Continue in browser for the full experience</span>
            </div>
            <button className="browser-bar-btn">Continue <i className="fas fa-arrow-right" /></button>
            <button className="browser-bar-close" onClick={() => setDismissed(true)} aria-label="Dismiss">
              <i className="fas fa-times" />
            </button>
          </div>
        </div>
      )}

      {/* Community */}
      <section id="community" className="community">
        <h2 className="reveal">Join Our Community</h2>
        <p className="reveal reveal-delay-1">
          Follow us on social media and be part of the FrameX movement.
        </p>
        <div className="social-links reveal reveal-delay-2">
          {['instagram', 'twitter', 'tiktok', 'facebook', 'youtube'].map((s) => (
            <a key={s} href="#" className="social-link" aria-label={s.charAt(0).toUpperCase() + s.slice(1)}>
              <i className={`fab fa-${s}`} />
            </a>
          ))}
        </div>
      </section>

      {/* Download */}
      <section id="download" className="download">
        <div className="download-glass reveal">
          <span className="section-label">Get the App</span>
          <h2>Download FrameX Now</h2>
          <p>Available on iOS and Android. Start sharing your story today.</p>
          <div className="download-buttons">
            <a href="#" className="app-store"><i className="fab fa-apple fa-lg" /> App Store</a>
            <a href="#" className="google-play"><i className="fab fa-google-play fa-lg" /> Google Play</a>
          </div>
        </div>
      </section>

      <Footer />

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)} aria-label="Close modal">
              <i className="fas fa-times" />
            </button>
            <div className="modal-header">
              <div className="modal-logo">F</div>
              <h2>Welcome to FrameX</h2>
              <p>Sign in to continue</p>
            </div>
            <div className="modal-body">
              <button className="social-btn social-btn--google">
                <i className="fab fa-google" /> Continue with Google
              </button>
              <button className="social-btn social-btn--facebook">
                <i className="fab fa-facebook-f" /> Continue with Facebook
              </button>
              <button className="social-btn social-btn--github">
                <i className="fab fa-github" /> Continue with GitHub
              </button>
              <button className="social-btn social-btn--x">
                <i className="fab fa-x-twitter" /> Continue with X
              </button>
            </div>
            <div className="modal-footer">
              <span>By continuing, you agree to our</span>
              <a href="/terms">Terms of Service</a>
              <span> and </span>
              <a href="/privacy">Privacy Policy</a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
