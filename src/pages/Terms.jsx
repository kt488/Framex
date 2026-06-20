import { useEffect } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function Terms() {
  useEffect(() => {
    document.title = 'Terms of Service | FrameX'
  }, [])

  return (
    <>
      <div className="aurora-bg">
        <div className="aurora-blob aurora-blob--1" />
        <div className="aurora-blob aurora-blob--2" />
      </div>

      <Nav />

      <section className="terms-section">
        <div className="terms-glass">
          <span className="section-label">Legal</span>
          <h1>Terms of Service</h1>
          <p className="terms-date">Last Updated: June 2026</p>

          {[
            { title: '1. Acceptance of Terms', body: 'By accessing or using the FrameX platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services.' },
            { title: '2. User Responsibilities', body: 'You are responsible for your account and all activities that occur under it. You agree to use FrameX only for lawful purposes and in a manner that does not infringe the rights of others or restrict their use and enjoyment of the platform.' },
            { title: '3. Content Ownership', body: 'You retain ownership of the content you post on FrameX. By posting content, you grant FrameX a non-exclusive, royalty-free, worldwide license to use, reproduce, and distribute your content on the platform.' },
            { title: '4. Prohibited Conduct', body: 'You agree not to:', list: ['Post or share content that is unlawful, harmful, or violates the rights of others.', 'Use FrameX for spamming, harassment, or any form of abusive behavior.', 'Attempt to gain unauthorized access to FrameX or its systems.', 'Reverse engineer, decompile, or otherwise tamper with the FrameX app or services.'] },
            { title: '5. Termination', body: 'FrameX reserves the right to terminate or suspend your account at any time, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users or the platform.' },
            { title: '6. Disclaimers', body: 'FrameX is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that the service will be uninterrupted, secure, or error-free.' },
            { title: '7. Limitation of Liability', body: 'To the fullest extent permitted by law, FrameX shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the platform.' },
            { title: '8. Changes to Terms', body: 'FrameX reserves the right to modify these Terms of Service at any time. We will notify users of significant changes via the platform or through other reasonable means.' },
            { title: '9. Contact Us', body: null, contact: true },
          ].map((block) => (
            <div key={block.title} className="terms-block">
              <h2>{block.title}</h2>
              {block.body && <p>{block.body}</p>}
              {block.list && (
                <ul>
                  {block.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {block.contact && (
                <p>
                  If you have any questions about these Terms of Service, please contact us at{' '}
                  <a href="mailto:support@framex.com">support@framex.com</a>.
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />

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

        /* ===== TERMS PAGE ===== */
        .terms-section {
            padding: 8rem 5% 4rem;
            min-height: 100vh;
            display: flex;
            justify-content: center;
        }

        .terms-glass {
            max-width: 720px;
            width: 100%;
            padding: 3.5rem 3rem;
            background: var(--color-glass);
            backdrop-filter: blur(var(--glass-blur));
            -webkit-backdrop-filter: blur(var(--glass-blur));
            border: var(--glass-border);
            border-radius: 28px;
            box-shadow: var(--shadow-glass-lg);
        }

        .terms-glass h1 {
            font-size: clamp(1.8rem, 3vw, 2.5rem);
            margin-bottom: 0.5rem;
        }

        .terms-date {
            color: rgba(255, 255, 255, 0.3);
            font-size: 0.9rem;
            margin-bottom: 2.5rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .terms-block {
            margin-bottom: 2rem;
        }

        .terms-block h2 {
            font-size: 1.15rem;
            color: rgba(255, 255, 255, 0.85);
            margin-bottom: 0.6rem;
            font-weight: 600;
        }

        .terms-block p {
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.92rem;
            line-height: 1.75;
        }

        .terms-block ul {
            list-style: disc;
            padding-left: 1.25rem;
            margin-top: 0.5rem;
        }

        .terms-block ul li {
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.92rem;
            line-height: 1.75;
            margin-bottom: 0.3rem;
        }

        .terms-block a {
            color: var(--color-amber);
            transition: color 0.3s ease;
        }

        .terms-block a:hover {
            color: #fff;
        }

        @media (max-width: 768px) {
            .terms-glass {
                padding: 2rem 1.5rem;
                border-radius: 20px;
            }
        }
      `}</style>
    </>
  )
}
