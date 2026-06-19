import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Nav from '../components/Nav'
import { supabase } from '../lib/supabaseClient'

function ChatMessage({ msg }) {
  return (
    <div className="chat-msg">
      <div className="chat-msg-avatar" style={{ background: msg.profiles?.avatar_url ? 'transparent' : '#f472b6' }}>
        {msg.profiles?.avatar_url ? (
          <img src={msg.profiles.avatar_url} alt="" className="chat-msg-avatar-img" />
        ) : (
          (msg.profiles?.display_name?.[0] || msg.profiles?.username?.[0] || '?').toUpperCase()
        )}
      </div>
      <div className="chat-msg-body">
        <div className="chat-msg-head">
          <span className="chat-msg-user">{msg.profiles?.display_name || msg.profiles?.username || 'Unknown'}</span>
          <span className="chat-msg-time">
            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p>{msg.content}</p>
      </div>
    </div>
  )
}

export default function Chat() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeChannel, setActiveChannel] = useState(null)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [channels, setChannels] = useState([])
  const [profiles, setProfiles] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Check auth and load initial data
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)

      // Fetch channels
      const { data: channelData } = await supabase.from('channels').select('*').order('id')
      if (channelData) {
        setChannels(channelData)
        setActiveChannel(channelData[0]?.name || 'general')
      }

      // Fetch profiles
      const { data: profileData } = await supabase.from('profiles').select('*')
      if (profileData) setProfiles(profileData)

      setLoading(false)
    }

    init()
  }, [router])

  // Fetch messages when active channel changes
  useEffect(() => {
    if (!activeChannel) return

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*, profiles!user_id(username, display_name, avatar_url)')
        .eq('channel_id', channels.find((c) => c.name === activeChannel)?.id)
        .order('created_at', { ascending: true })

      if (data) setMessages(data)
    }

    fetchMessages()
  }, [activeChannel, channels])

  // Real-time subscription for new messages
  useEffect(() => {
    if (!activeChannel) return

    const channelId = channels.find((c) => c.name === activeChannel)?.id
    if (!channelId) return

    const subscription = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`,
        },
        async (payload) => {
          // Fetch the new message with profile data
          const { data } = await supabase
            .from('messages')
            .select('*, profiles!user_id(username, display_name, avatar_url)')
            .eq('id', payload.new.id)
            .single()

          if (data) {
            setMessages((prev) => [...prev, data])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [activeChannel, channels])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || !user || !activeChannel) return

    const channelId = channels.find((c) => c.name === activeChannel)?.id
    if (!channelId) return

    const { error } = await supabase.from('messages').insert({
      channel_id: channelId,
      user_id: user.id,
      content: input,
    })

    if (!error) setInput('')
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="auth-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="auth-glass" style={{ textAlign: 'center', padding: '3rem' }}>
          <i className="fas fa-spinner fa-spin fa-3x" style={{ color: 'var(--color-amber)' }} />
          <p style={{ marginTop: '1rem' }}>Loading chat...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Chat — FrameX</title>
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

      <section className="chat-section">
        {/* Hoverboard — channel sidebar */}
        <aside className={`hoverboard ${sidebarOpen ? '' : 'collapsed'}`}>
          <div className="hoverboard-header">
            <i className="fas fa-layer-group" />
            <span>Channels</span>
            <button className="hoverboard-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <i className={`fas fa-chevron-${sidebarOpen ? 'left' : 'right'}`} />
            </button>
          </div>

          <nav className="hoverboard-channels">
            {channels.map((ch) => (
              <button
                key={ch.id}
                className={`hoverboard-tile ${activeChannel === ch.name ? 'active' : ''}`}
                onClick={() => setActiveChannel(ch.name)}
              >
                <i className={`fas ${ch.icon}`} />
                <span>{ch.label}</span>
              </button>
            ))}
          </nav>

          <div className="hoverboard-divider" />

          <div className="hoverboard-dm-header">
            <i className="fas fa-user-friends" />
            <span>Direct Messages</span>
          </div>

          <nav className="hoverboard-dms">
            {profiles.map((p) => (
              <button key={p.id} className="hoverboard-dm-tile">
                <span className={`dm-status ${p.status || 'offline'}`} />
                <span className="dm-initials">
                  {(p.display_name?.[0] || p.username?.[0] || '?').toUpperCase()}
                </span>
                <span>{p.display_name || p.username}</span>
              </button>
            ))}
            {profiles.length === 0 && (
              <div className="hoverboard-dm-tile" style={{ opacity: 0.5, cursor: 'default' }}>
                <span>No users yet</span>
              </div>
            )}
          </nav>

          <div className="hoverboard-divider" />

          <button className="hoverboard-dm-tile" onClick={handleSignOut} style={{ marginTop: 'auto', color: 'var(--color-error, #ef4444)' }}>
            <i className="fas fa-sign-out-alt" />
            <span>Sign Out</span>
          </button>
        </aside>

        {/* Chat main area */}
        <div className="chat-main">
          <header className="chat-header">
            <button className="chat-mobile-menu" onClick={() => setSidebarOpen(true)}>
              <i className="fas fa-bars" />
            </button>
            <div className="chat-header-info">
              {activeChannel && (
                <>
                  <i className={`fas ${channels.find((c) => c.name === activeChannel)?.icon}`} style={{ color: 'var(--color-amber)' }} />
                  <h2>{channels.find((c) => c.name === activeChannel)?.label}</h2>
                </>
              )}
            </div>
            <div className="chat-header-meta">
              <span className="chat-member-count">
                <i className="fas fa-user" /> {profiles.length}
              </span>
            </div>
          </header>

          <div className="chat-messages">
            {messages.length > 0 && (
              <div className="chat-date-divider">
                <span>Today</span>
              </div>
            )}
            {messages.map((msg) => (
              <ChatMessage key={msg.id} msg={msg} />
            ))}
            {messages.length === 0 && (
              <div className="chat-empty">
                <i className="fas fa-comment-dots" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}
          </div>

          <form className="chat-input-area" onSubmit={sendMessage}>
            <div className="chat-input-wrapper">
              <button type="button" className="chat-input-btn" title="Attach file">
                <i className="fas fa-paperclip" />
              </button>
              <input
                type="text"
                placeholder={activeChannel ? `Message #${channels.find((c) => c.name === activeChannel)?.label || activeChannel}` : 'Select a channel'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!activeChannel}
              />
              <button type="button" className="chat-input-btn" title="Emoji">
                <i className="fas fa-smile" />
              </button>
            </div>
            <button type="submit" className="chat-send-btn" disabled={!input.trim() || !activeChannel}>
              <i className="fas fa-paper-plane" />
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
