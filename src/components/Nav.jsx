import { useEffect, useState } from 'react'

export default function Nav({ onLoginClick }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault()
        const target = document.querySelector(this.getAttribute('href'))
        if (target) target.scrollIntoView({ behavior: 'smooth' })
      })
    })
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <div className="logo">
        <div className="logo-icon">F</div>
        <h1>FrameX</h1>
      </div>
      <ul className={menuOpen ? 'active' : ''}>
        <li><a href="#features" onClick={closeMenu}>Features</a></li>
        <li><a href="#community" onClick={closeMenu}>Community</a></li>
        <li><a href="#about" onClick={closeMenu}>About</a></li>
        <li><a href="#pricing" onClick={closeMenu}>Pricing</a></li>
        <li className="mobile-get-started"><a href="#get-started" className="get-started-btn" onClick={closeMenu}>Get Started</a></li>
      </ul>
      <div className="nav-right">
        <div className="auth-buttons">
          <button className="login" onClick={onLoginClick}>Log In</button>
          <button className="get-started" onClick={onLoginClick}>Get Started</button>
        </div>
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <i className={`fi ${menuOpen ? 'fas fa-times' : 'fi-br-menu-burger'}`} />
        </button>
      </div>
      <style>{`
        nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.8rem 5%;
            background: rgba(8, 8, 15, 0.6);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border-bottom: var(--glass-border);
            transition: background 0.3s ease;
        }

        nav.scrolled {
            background: rgba(8, 8, 15, 0.85);
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .logo-icon {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: var(--gradient-accent);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.9rem;
            font-weight: 700;
            color: #08080f;
        }

        .logo h1 {
            font-family: var(--font-display);
            font-size: 1.4rem;
            font-weight: 700;
            background: var(--gradient-accent);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        nav ul {
            display: flex;
            gap: 2.5rem;
        }

        nav ul li a {
            font-size: 0.9rem;
            font-weight: 400;
            color: rgba(255, 255, 255, 0.6);
            transition: color 0.3s ease;
            position: relative;
            letter-spacing: 0.02em;
        }

        nav ul li a::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 0;
            height: 1.5px;
            background: var(--gradient-accent);
            transition: width 0.3s ease;
            border-radius: 2px;
        }

        nav ul li a:hover {
            color: #fff;
        }

        nav ul li a:hover::after {
            width: 100%;
        }

        .auth-buttons {
            display: flex;
            gap: 0.75rem;
        }

        .nav-right {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .menu-toggle {
            display: none;
            width: 40px;
            height: 40px;
            align-items: center;
            justify-content: center;
            background: var(--color-glass);
            border: var(--glass-border);
            border-radius: 10px;
            color: rgba(255, 255, 255, 0.7);
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.3s ease;
            padding: 0;
        }

        .menu-toggle:hover {
            background: var(--color-glass-hover);
            color: #fff;
        }

        .login {
            padding: 0.5rem 1.5rem;
            background: var(--color-glass);
            color: rgba(255, 255, 255, 0.85);
            border: var(--glass-border);
            border-radius: 8px;
            font-size: 0.85rem;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .login:hover {
            background: var(--color-glass-hover);
            border-color: rgba(255, 255, 255, 0.2);
        }

        .signup,
        .get-started {
            padding: 0.5rem 1.5rem;
            background: var(--gradient-accent);
            color: #08080f;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .signup:hover,
        .get-started:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 20px rgba(251, 191, 36, 0.25);
        }

        .mobile-get-started {
            display: none;
        }

        @media (max-width: 968px) {
            nav ul {
                gap: 1.5rem;
            }
            nav ul li a {
                font-size: 0.8rem;
            }
            .auth-buttons .login,
            .auth-buttons .get-started {
                padding: 0.4rem 1rem;
                font-size: 0.78rem;
            }
            .logo h1 {
                font-size: 1.2rem;
            }
        }

        @media (max-width: 768px) {
            nav {
                padding: 0.7rem 5%;
            }
            nav ul {
                position: fixed;
                inset: 0;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 2.5rem;
                background: rgba(8, 8, 15, 0.92);
                backdrop-filter: blur(30px);
                -webkit-backdrop-filter: blur(30px);
                transform: translateY(-100%);
                opacity: 0;
                pointer-events: none;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 998;
            }
            nav ul.active {
                transform: translateY(0);
                opacity: 1;
                pointer-events: all;
            }
            nav ul li a {
                font-size: 1.3rem;
                padding: 0.5rem 0;
            }
            .nav-right .auth-buttons {
                display: none;
            }
            .menu-toggle {
                display: flex;
                z-index: 999;
            }
            .mobile-get-started {
                display: block;
                margin-top: 1rem;
            }
            .mobile-get-started .get-started-btn {
                display: inline-block;
                padding: 0.75rem 2.5rem;
                background: var(--gradient-accent);
                color: #08080f;
                border-radius: 8px;
                font-size: 1.1rem;
                font-weight: 600;
                text-decoration: none;
                transition: all 0.3s ease;
            }
            .mobile-get-started .get-started-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 20px rgba(251, 191, 36, 0.25);
            }
        }

        @media (max-width: 480px) {
            .signup,
            .get-started {
                display: none;
            }
        }
      `}</style>
    </nav>
  )
}
