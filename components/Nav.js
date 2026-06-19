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
    </nav>
  )
}
