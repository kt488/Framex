import Head from 'next/head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service | FrameX</title>
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
    </>
  )
}
