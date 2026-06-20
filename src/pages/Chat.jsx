import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeChannel, setActiveChannel] = useState(null)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [channels, setChannels] = useState([])
  const [profiles, setProfiles] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    document.title = 'Chat — FrameX'
  }, [])

  // Check auth and load initial data
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login')
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
  }, [navigate])

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
    navigate('/login')
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

        /* ===== CHAT SECTION ===== */
        .chat-section {
            display: flex;
            min-height: calc(100vh - 72px);
            padding: 72px 0 0 0;
            position: relative;
        }

        /* ── Hoverboard (channel sidebar) ── */
        .hoverboard {
            width: 240px;
            min-width: 240px;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            padding: 1.25rem 0.75rem;
            background: linear-gradient(
                180deg,
                rgba(255, 255, 255, 0.04) 0%,
                rgba(255, 255, 255, 0.01) 100%
            );
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border-right: 1px solid rgba(255, 255, 255, 0.04);
            transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            overflow-y: auto;
        }

        .hoverboard.collapsed {
            width: 0;
            min-width: 0;
            padding: 1.25rem 0;
            overflow: hidden;
        }

        .hoverboard-header {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            padding: 0.5rem 0.75rem;
            margin-bottom: 0.5rem;
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.72rem;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
        }

        .hoverboard-header i:first-child {
            font-size: 0.85rem;
            color: var(--color-amber);
        }

        .hoverboard-toggle {
            margin-left: auto;
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.25);
            cursor: pointer;
            padding: 0.2rem;
            font-size: 0.7rem;
            transition: color 0.3s;
        }

        .hoverboard-toggle:hover {
            color: rgba(255, 255, 255, 0.6);
        }

        .hoverboard-channels {
            display: flex;
            flex-direction: column;
            gap: 0.15rem;
        }

        .hoverboard-tile {
            display: flex;
            align-items: center;
            gap: 0.65rem;
            width: 100%;
            padding: 0.6rem 0.75rem;
            background: transparent;
            border: 1px solid transparent;
            border-radius: 10px;
            color: rgba(255, 255, 255, 0.45);
            font-size: 0.88rem;
            font-family: var(--font-body);
            cursor: pointer;
            text-align: left;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
        }

        .hoverboard-tile i {
            width: 16px;
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.3);
            transition: color 0.3s;
        }

        .hoverboard-tile span {
            flex: 1;
        }

        .hoverboard-tile:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.06);
            color: rgba(255, 255, 255, 0.85);
            transform: translateX(3px) translateY(-1px);
            box-shadow:
                0 4px 16px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }

        .hoverboard-tile:hover i {
            color: var(--color-amber);
        }

        .hoverboard-tile.active {
            background: linear-gradient(
                135deg,
                rgba(251, 191, 36, 0.08) 0%,
                rgba(251, 191, 36, 0.02) 100%
            );
            border-color: rgba(251, 191, 36, 0.15);
            color: #fff;
            box-shadow:
                0 4px 20px rgba(251, 191, 36, 0.06),
                inset 0 1px 0 rgba(251, 191, 36, 0.1);
        }

        .hoverboard-tile.active i {
            color: var(--color-amber);
        }

        .hoverboard-tile.active::after {
            content: '';
            position: absolute;
            left: -0.75rem;
            top: 50%;
            transform: translateY(-50%);
            width: 3px;
            height: 20px;
            background: var(--color-amber);
            border-radius: 0 3px 3px 0;
            box-shadow: 0 0 12px rgba(251, 191, 36, 0.4);
        }

        .hoverboard-badge {
            background: rgba(251, 191, 36, 0.15);
            color: var(--color-amber);
            font-size: 0.7rem;
            font-weight: 600;
            padding: 0.1rem 0.5rem;
            border-radius: 10px;
            min-width: 20px;
            text-align: center;
            flex: 0;
        }

        .hoverboard-divider {
            height: 1px;
            background: rgba(255, 255, 255, 0.05);
            margin: 0.75rem 0.75rem;
        }

        .hoverboard-dm-header {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            padding: 0.5rem 0.75rem;
            color: rgba(255, 255, 255, 0.4);
            font-size: 0.72rem;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            margin-bottom: 0.25rem;
        }

        .hoverboard-dm-header i {
            font-size: 0.8rem;
            color: var(--color-amber);
        }

        .hoverboard-dms {
            display: flex;
            flex-direction: column;
            gap: 0.1rem;
        }

        .hoverboard-dm-tile {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            padding: 0.5rem 0.75rem;
            background: transparent;
            border: none;
            border-radius: 10px;
            color: rgba(255, 255, 255, 0.4);
            font-size: 0.85rem;
            font-family: var(--font-body);
            cursor: pointer;
            text-align: left;
            transition: all 0.3s ease;
        }

        .hoverboard-dm-tile:hover {
            background: rgba(255, 255, 255, 0.04);
            color: rgba(255, 255, 255, 0.8);
            transform: translateX(2px);
        }

        .dm-status {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            flex-shrink: 0;
        }

        .dm-status.online {
            background: #4ade80;
            box-shadow: 0 0 6px rgba(74, 222, 128, 0.4);
        }

        .dm-status.away {
            background: #fbbf24;
            box-shadow: 0 0 6px rgba(251, 191, 36, 0.3);
        }

        .dm-status.offline {
            background: rgba(255, 255, 255, 0.2);
        }

        .dm-initials {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.06);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.65rem;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.5);
            flex-shrink: 0;
        }

        /* ── Chat main panel ── */
        .chat-main {
            flex: 1;
            display: flex;
            flex-direction: column;
            min-width: 0;
        }

        .chat-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem 2rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            background: rgba(255, 255, 255, 0.01);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
        }

        .chat-mobile-menu {
            display: none;
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.5);
            font-size: 1.1rem;
            cursor: pointer;
        }

        .chat-header-info {
            display: flex;
            align-items: center;
            gap: 0.6rem;
        }

        .chat-header-info i {
            font-size: 1rem;
        }

        .chat-header-info h2 {
            font-size: 1rem;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.9);
        }

        .chat-header-meta {
            margin-left: auto;
        }

        .chat-member-count {
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.3);
            display: flex;
            align-items: center;
            gap: 0.4rem;
        }

        /* ── Messages area ── */
        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 1.5rem 2rem 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        .chat-date-divider {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
        }

        .chat-date-divider::before,
        .chat-date-divider::after {
            content: '';
            flex: 1;
            height: 1px;
            background: rgba(255, 255, 255, 0.04);
        }

        .chat-date-divider span {
            font-size: 0.72rem;
            color: rgba(255, 255, 255, 0.25);
            font-weight: 500;
            letter-spacing: 0.05em;
            text-transform: uppercase;
        }

        .chat-msg {
            display: flex;
            gap: 0.75rem;
            padding: 0.5rem 1rem;
            border-radius: 12px;
            transition: background 0.3s;
        }

        .chat-msg:hover {
            background: rgba(255, 255, 255, 0.02);
        }

        .chat-msg-avatar {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: 600;
            color: #08080f;
            overflow: hidden;
        }

        .chat-msg-avatar-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 10px;
        }

        .chat-msg-body {
            flex: 1;
            min-width: 0;
        }

        .chat-msg-body p {
            margin: 0;
            color: rgba(255, 255, 255, 0.75);
            font-size: 0.92rem;
            line-height: 1.5;
            word-wrap: break-word;
        }

        .chat-msg-head {
            display: flex;
            align-items: baseline;
            gap: 0.5rem;
            margin-bottom: 0.15rem;
        }

        .chat-msg-user {
            font-weight: 600;
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.9);
        }

        .chat-msg-time {
            font-size: 0.7rem;
            color: rgba(255, 255, 255, 0.2);
        }

        .chat-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            padding: 4rem 2rem;
            color: rgba(255, 255, 255, 0.2);
        }

        .chat-empty i {
            font-size: 2.5rem;
            opacity: 0.5;
        }

        .chat-empty p {
            font-size: 0.9rem;
        }

        /* ── Chat input ── */
        .chat-input-area {
            display: flex;
            gap: 0.75rem;
            padding: 1rem 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.04);
            background: rgba(255, 255, 255, 0.01);
        }

        .chat-input-wrapper {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0 0.75rem;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 14px;
            transition: all 0.3s ease;
        }

        .chat-input-wrapper:focus-within {
            border-color: rgba(251, 191, 36, 0.25);
            background: rgba(255, 255, 255, 0.06);
            box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.04);
        }

        .chat-input-wrapper input {
            flex: 1;
            background: none;
            border: none;
            outline: none;
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.9rem;
            font-family: var(--font-body);
            padding: 0.75rem 0;
        }

        .chat-input-wrapper input::placeholder {
            color: rgba(255, 255, 255, 0.2);
        }

        .chat-input-btn {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.2);
            cursor: pointer;
            padding: 0.25rem;
            font-size: 1rem;
            transition: color 0.3s;
        }

        .chat-input-btn:hover {
            color: rgba(255, 255, 255, 0.5);
        }

        .chat-send-btn {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--color-amber), #f59e0b);
            border: none;
            color: #08080f;
            font-size: 1rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            flex-shrink: 0;
        }

        .chat-send-btn:hover:not(:disabled) {
            transform: scale(1.05);
            box-shadow: 0 4px 20px rgba(251, 191, 36, 0.3);
        }

        .chat-send-btn:disabled {
            opacity: 0.3;
            cursor: not-allowed;
            transform: none;
        }

        @media (max-width: 768px) {
            .hoverboard {
                position: fixed;
                left: 0;
                top: 72px;
                bottom: 0;
                z-index: 50;
                width: 260px;
                min-width: 260px;
                transform: translateX(0);
            }
            .hoverboard.collapsed {
                transform: translateX(-100%);
                width: 260px;
                min-width: 260px;
                padding: 1.25rem 0.75rem;
            }
            .hoverboard-toggle {
                display: none;
            }
            .chat-mobile-menu {
                display: block;
            }
            .chat-header {
                padding: 0.75rem 1rem;
            }
            .chat-messages {
                padding: 1rem 0.75rem;
            }
            .chat-input-area {
                padding: 0.75rem 1rem;
            }
        }
      `}</style>
    </>
  )
}
