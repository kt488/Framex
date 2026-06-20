import { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function Home() {
  const [dismissed, setDismissed] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    document.title = 'FrameX | Share Your World in Frames'
  }, [])

  useEffect(() => {
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

      <style>{`
        /* ===== AURORA BACKGROUND ===== */
        .aurora-bg {
            position: fixed;
            inset: 0;
            z-index: -1;
            overflow: hidden;
            background: var(--color-bg);
        }

        .aurora-bg::before,
        .aurora-bg::after {
            content: '';
            position: absolute;
            width: 80vmax;
            height: 80vmax;
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.3;
            animation: auroraDrift 20s ease-in-out infinite alternate;
        }

        .aurora-bg::before {
            background: radial-gradient(circle, var(--color-amber), transparent 70%);
            top: -20vmax;
            left: -10vmax;
            animation-delay: 0s;
        }

        .aurora-bg::after {
            background: radial-gradient(circle, var(--color-violet), transparent 70%);
            bottom: -20vmax;
            right: -10vmax;
            animation-delay: -10s;
        }

        .aurora-blob {
            position: absolute;
            border-radius: 50%;
            filter: blur(100px);
            opacity: 0.15;
            animation: auroraDrift 25s ease-in-out infinite alternate;
        }

        .aurora-blob--1 {
            width: 60vmax;
            height: 60vmax;
            background: radial-gradient(circle, var(--color-rose), transparent 70%);
            top: 30%;
            right: -20%;
            animation-delay: -5s;
        }

        .aurora-blob--2 {
            width: 50vmax;
            height: 50vmax;
            background: radial-gradient(circle, var(--color-crimson), transparent 70%);
            bottom: 10%;
            left: -15%;
            animation-delay: -15s;
        }

        /* ===== HERO ===== */
        .hero {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 4rem;
            min-height: 100vh;
            padding: 8rem 5% 4rem;
            position: relative;
        }

        .hero-content {
            flex: 1;
            max-width: 580px;
        }

        .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.35rem 1rem 0.35rem 0.35rem;
            background: var(--color-glass);
            border: var(--glass-border);
            border-radius: 100px;
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 2rem;
            animation: fadeSlideUp 0.6s ease forwards;
            animation-delay: 0.1s;
            opacity: 0;
        }

        .hero-badge span {
            background: var(--gradient-accent);
            color: #08080f;
            padding: 0.2rem 0.7rem;
            border-radius: 100px;
            font-size: 0.7rem;
            font-weight: 600;
        }

        .hero-content h1 {
            font-size: clamp(2.8rem, 6vw, 4.5rem);
            line-height: 1.08;
            margin-bottom: 1.5rem;
            animation: fadeSlideUp 0.6s ease forwards;
            animation-delay: 0.2s;
            opacity: 0;
        }

        .hero-content h1 .gradient-text {
            background: var(--gradient-warm);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .hero-content p {
            font-size: 1.1rem;
            color: rgba(255, 255, 255, 0.5);
            margin-bottom: 2.5rem;
            max-width: 440px;
            line-height: 1.8;
            animation: fadeSlideUp 0.6s ease forwards;
            animation-delay: 0.3s;
            opacity: 0;
        }

        .cta-buttons {
            display: flex;
            gap: 1rem;
            animation: fadeSlideUp 0.6s ease forwards;
            animation-delay: 0.4s;
            opacity: 0;
        }

        /* ===== HERO MEDIA (GLASS CARD STACK) ===== */
        .hero-media {
            flex: 1;
            max-width: 480px;
            position: relative;
            animation: fadeSlideUp 0.8s ease forwards;
            animation-delay: 0.5s;
            opacity: 0;
        }

        .glass-card-stack {
            position: relative;
            width: 100%;
            aspect-ratio: 3 / 4;
        }

        .glass-card {
            position: absolute;
            inset: 0;
            background: var(--color-glass);
            backdrop-filter: blur(var(--glass-blur));
            -webkit-backdrop-filter: blur(var(--glass-blur));
            border: var(--glass-border);
            border-radius: 24px;
            box-shadow: var(--shadow-glass-lg);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            overflow: hidden;
        }

        .glass-card::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.08) 0%,
                transparent 50%
            );
            border-radius: 24px;
            pointer-events: none;
        }

        .glass-card::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(
                115deg,
                transparent 30%,
                rgba(255, 255, 255, 0.04) 37%,
                rgba(255, 255, 255, 0.08) 40%,
                rgba(255, 255, 255, 0.04) 43%,
                transparent 50%
            );
            border-radius: 24px;
            pointer-events: none;
        }

        .glass-card-decoration {
            position: absolute;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: radial-gradient(circle, var(--color-amber), transparent 70%);
            opacity: 0.1;
            top: -30px;
            right: -30px;
            filter: blur(20px);
        }

        .glass-card-decoration--2 {
            width: 80px;
            height: 80px;
            background: radial-gradient(circle, var(--color-violet), transparent 70%);
            bottom: -20px;
            left: -20px;
            top: auto;
            right: auto;
        }

        .glass-card-icon {
            font-size: 3.5rem;
            color: var(--color-amber);
            margin-bottom: 1.5rem;
            opacity: 0.6;
        }

        .glass-card h3 {
            font-size: 1.3rem;
            margin-bottom: 0.5rem;
            color: rgba(255, 255, 255, 0.9);
        }

        .glass-card p {
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.4);
            text-align: center;
        }

        .glass-card-stack .glass-card:nth-child(1) {
            transform: rotate(-6deg) translateY(8px) scale(0.92);
            z-index: 1;
        }

        .glass-card-stack .glass-card:nth-child(2) {
            transform: rotate(3deg) translateY(-4px) scale(0.96);
            z-index: 2;
        }

        .glass-card-stack .glass-card:nth-child(3) {
            transform: rotate(0deg) translateY(0) scale(1);
            z-index: 3;
        }

        .hero-stat {
            position: absolute;
            background: var(--color-glass-strong);
            backdrop-filter: blur(var(--glass-blur));
            -webkit-backdrop-filter: blur(var(--glass-blur));
            border: var(--glass-border);
            border-radius: 12px;
            padding: 0.75rem 1.25rem;
            box-shadow: var(--shadow-glass);
            z-index: 4;
            animation: float 4s ease-in-out infinite;
        }

        .hero-stat--1 {
            top: -10%;
            right: -10%;
            animation-delay: 0s;
        }

        .hero-stat--2 {
            bottom: 10%;
            left: -15%;
            animation-delay: -2s;
        }

        .hero-stat strong {
            display: block;
            font-family: var(--font-display);
            font-size: 1.2rem;
            color: #fff;
        }

        .hero-stat span {
            font-size: 0.7rem;
            color: rgba(255, 255, 255, 0.4);
            letter-spacing: 0.05em;
        }

        /* ===== FEATURES ===== */
        .features {
            padding: var(--section-padding);
            position: relative;
        }

        .features-header {
            text-align: center;
            max-width: 500px;
            margin: 0 auto 4rem;
        }

        .features-header h2 {
            font-size: clamp(2rem, 4vw, 3rem);
            margin-bottom: 1rem;
        }

        .features-header p {
            color: rgba(255, 255, 255, 0.45);
            font-size: 1.05rem;
        }

        .feature-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
        }

        .feature-card {
            background: var(--color-glass);
            backdrop-filter: blur(var(--glass-blur));
            -webkit-backdrop-filter: blur(var(--glass-blur));
            border: var(--glass-border);
            border-radius: 20px;
            padding: 2.5rem 2rem;
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
        }

        .feature-card::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(
                105deg,
                transparent 25%,
                rgba(255, 255, 255, 0.04) 32%,
                rgba(255, 255, 255, 0.08) 36%,
                rgba(255, 255, 255, 0.04) 40%,
                transparent 47%
            );
            border-radius: 20px;
            pointer-events: none;
        }

        .feature-card::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(
                circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
                rgba(255, 255, 255, 0.03),
                transparent 60%
            );
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.4s ease;
        }

        .feature-card:hover::after {
            opacity: 1;
        }

        .feature-card:hover {
            background: var(--color-glass-hover);
            border-color: rgba(255, 255, 255, 0.15);
            transform: translateY(-4px);
            box-shadow: var(--shadow-glass);
        }

        .feature-icon {
            width: 52px;
            height: 52px;
            border-radius: 14px;
            background: var(--color-glass-strong);
            border: var(--glass-border);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.3rem;
            margin-bottom: 1.5rem;
            color: var(--color-amber);
            transition: all 0.3s ease;
        }

        .feature-card:hover .feature-icon {
            background: var(--gradient-accent);
            color: #08080f;
            border-color: transparent;
        }

        .feature-card h3 {
            font-size: 1.25rem;
            margin-bottom: 0.75rem;
            color: rgba(255, 255, 255, 0.9);
        }

        .feature-card p {
            color: rgba(255, 255, 255, 0.45);
            font-size: 0.9rem;
            line-height: 1.7;
        }

        /* ===== BROWSER BAR ===== */
        .browser-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            padding: 0.75rem 5%;
            background: rgba(8, 8, 15, 0.85);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.5);
            animation: browserBarUp 0.5s ease-out;
        }

        .browser-bar-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        }

        .browser-bar-text {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.9rem;
            font-weight: 500;
        }

        .browser-bar-icon {
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--gradient-accent);
            border-radius: 10px;
            color: #08080f;
            font-size: 1rem;
            flex-shrink: 0;
        }

        .browser-bar-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.6rem 1.5rem;
            background: var(--gradient-accent);
            border: none;
            border-radius: 10px;
            color: #08080f;
            font-weight: 600;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.3s ease;
            white-space: nowrap;
            font-family: var(--font-body);
        }

        .browser-bar-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 20px rgba(251, 191, 36, 0.25);
        }

        .browser-bar-close {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            color: rgba(255, 255, 255, 0.5);
            cursor: pointer;
            transition: all 0.3s ease;
            flex-shrink: 0;
            font-size: 0.8rem;
        }

        .browser-bar-close:hover {
            background: rgba(255, 255, 255, 0.12);
            color: rgba(255, 255, 255, 0.8);
        }

        /* ===== COMMUNITY ===== */
        .community {
            padding: var(--section-padding);
            text-align: center;
        }

        .community h2 {
            font-size: clamp(1.8rem, 3vw, 2.5rem);
            margin-bottom: 0.75rem;
        }

        .community > p {
            color: rgba(255, 255, 255, 0.45);
            margin-bottom: 3rem;
            font-size: 1rem;
        }

        .social-links {
            display: flex;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .social-link {
            width: 60px;
            height: 60px;
            border-radius: 16px;
            background: var(--color-glass);
            backdrop-filter: blur(var(--glass-blur));
            -webkit-backdrop-filter: blur(var(--glass-blur));
            border: var(--glass-border);
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgba(255, 255, 255, 0.6);
            font-size: 1.4rem;
            transition: all 0.3s ease;
        }

        .social-link:hover {
            background: var(--color-glass-hover);
            border-color: rgba(255, 255, 255, 0.2);
            color: #fff;
            transform: translateY(-4px);
            box-shadow: var(--shadow-glass);
        }

        /* ===== DOWNLOAD SECTION ===== */
        .download {
            padding: var(--section-padding);
            text-align: center;
        }

        .download-glass {
            max-width: 600px;
            margin: 0 auto;
            padding: 4rem 3rem;
            background: var(--color-glass);
            backdrop-filter: blur(var(--glass-blur));
            -webkit-backdrop-filter: blur(var(--glass-blur));
            border: var(--glass-border);
            border-radius: 28px;
            box-shadow: var(--shadow-glass-lg);
        }

        .download-glass h2 {
            font-size: clamp(1.8rem, 3vw, 2.5rem);
            margin-bottom: 0.75rem;
        }

        .download-glass p {
            color: rgba(255, 255, 255, 0.45);
            margin-bottom: 2rem;
            font-size: 1rem;
        }

        .download-buttons {
            display: flex;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .app-store,
        .google-play {
            display: inline-flex;
            align-items: center;
            gap: 0.6rem;
            padding: 0.85rem 2rem;
            background: var(--color-glass-strong);
            border: var(--glass-border);
            border-radius: 14px;
            color: rgba(255, 255, 255, 0.85);
            font-size: 0.95rem;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .app-store:hover,
        .google-play:hover {
            background: var(--color-glass-hover);
            border-color: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
            box-shadow: var(--shadow-glass);
        }

        /* ===== MODAL ===== */
        .modal-overlay {
            position: fixed;
            inset: 0;
            z-index: 2000;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.2s ease;
        }

        .modal-card {
            width: 90%;
            max-width: 400px;
            padding: 2.5rem 2rem;
            background: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);
            backdrop-filter: blur(var(--glass-blur));
            -webkit-backdrop-filter: blur(var(--glass-blur));
            border-radius: 28px;
            box-shadow: 0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08);
            position: relative;
            animation: fadeSlideUp 0.3s ease;
        }

        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 8px;
            color: rgba(255,255,255,0.5);
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.8rem;
        }

        .modal-close:hover {
            background: rgba(255,255,255,0.12);
            color: rgba(255,255,255,0.8);
        }

        .modal-header {
            text-align: center;
            margin-bottom: 2rem;
        }

        .modal-logo {
            width: 48px;
            height: 48px;
            border-radius: 14px;
            background: var(--gradient-accent);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.3rem;
            font-weight: 700;
            color: #08080f;
            margin: 0 auto 1rem;
        }

        .modal-header h2 {
            font-size: 1.4rem;
            margin-bottom: 0.25rem;
        }

        .modal-header p {
            color: rgba(255,255,255,0.45);
            font-size: 0.9rem;
        }

        .modal-body {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .social-btn {
            width: 100%;
            padding: 0.8rem 1rem;
            background: var(--color-glass);
            border: var(--glass-border);
            border-radius: 12px;
            color: rgba(255,255,255,0.7);
            font-size: 0.9rem;
            font-family: var(--font-body);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.6rem;
            transition: all 0.3s ease;
        }

        .social-btn:hover {
            background: var(--color-glass-hover);
            border-color: rgba(255,255,255,0.15);
            color: #fff;
            transform: translateY(-1px);
        }

        .social-btn i {
            font-size: 1.1rem;
        }

        .modal-footer {
            text-align: center;
            margin-top: 1.5rem;
            color: rgba(255,255,255,0.3);
            font-size: 0.78rem;
            line-height: 1.6;
        }

        .modal-footer a {
            color: var(--color-amber);
            transition: color 0.3s ease;
        }

        .modal-footer a:hover {
            color: #fff;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 968px) {
            .hero {
                flex-direction: column;
                text-align: center;
                padding-top: 6rem;
                gap: 3rem;
            }
            .hero-content {
                max-width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .hero-content p {
                max-width: 100%;
            }
            .hero-media {
                max-width: 360px;
            }
            .cta-buttons {
                justify-content: center;
            }
        }

        @media (max-width: 768px) {
            .hero-content h1 {
                font-size: 2.2rem;
            }
            .hero-stat--1 {
                right: 0;
                top: -15%;
            }
            .hero-stat--2 {
                left: 0;
                bottom: 5%;
            }
        }

        @media (max-width: 480px) {
            .hero-content h1 {
                font-size: 1.8rem;
            }
            .cta-buttons {
                flex-direction: column;
                width: 100%;
            }
            .btn-primary,
            .btn-secondary {
                width: 100%;
                justify-content: center;
            }
        }
      `}</style>
    </>
  )
}
