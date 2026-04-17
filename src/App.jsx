import { useEffect, useState } from 'react'
import {
  HashRouter,
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import './App.css'
import callIcon from './assets/call.png'
import facebookIcon from './assets/facebook.png'
import instagramIcon from './assets/instagram.png'
import logoIcon from './assets/logo.png'
import logoWordmark from './assets/logo-xl.png'
import textIcon from './assets/text.png'
import twitterIcon from './assets/twitter.png'
import videoIcon from './assets/video.png'

const actionIcons = {
  call: callIcon,
  text: textIcon,
  video: videoIcon,
}

const statusMeta = {
  overdue: {
    label: 'Overdue',
    className: 'status-overdue',
  },
  'almost due': {
    label: 'Almost Due',
    className: 'status-almost-due',
  },
  'on-track': {
    label: 'On Track',
    className: 'status-on-track',
  },
}

const analyticsColors = ['#f97316', '#10b981', '#2563eb']

const navItems = [
  {
    to: '/',
    label: 'Home',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" />
      </svg>
    ),
  },
  {
    to: '/timeline',
    label: 'Timeline',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 4h2v5H6zm5 4h2v9h-2zm5-2h2v13h-2zM4 20h16v2H4z" />
      </svg>
    ),
  },
  {
    to: '/stats',
    label: 'Stats',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 19V9h3v10zm5 0V5h3v14zm5 0v-7h3v7z" />
      </svg>
    ),
  },
]

function readStoredTimeline() {
  const fallback = [
    {
      id: 'seed-1',
      friendId: 2,
      type: 'text',
      friendName: 'Maya Thompson',
      title: 'Text with Maya Thompson',
      date: '2026-04-12',
      timestamp: new Date('2026-04-12T09:00:00').toISOString(),
    },
    {
      id: 'seed-2',
      friendId: 4,
      type: 'call',
      friendName: 'Daniel Brooks',
      title: 'Call with Daniel Brooks',
      date: '2026-04-14',
      timestamp: new Date('2026-04-14T19:30:00').toISOString(),
    },
    {
      id: 'seed-3',
      friendId: 1,
      type: 'video',
      friendName: 'Ava Martinez',
      title: 'Video with Ava Martinez',
      date: '2026-04-15',
      timestamp: new Date('2026-04-15T20:15:00').toISOString(),
    },
  ]

  const storedTimeline = localStorage.getItem('keenkeeper-timeline')

  if (!storedTimeline) {
    return fallback
  }

  try {
    return JSON.parse(storedTimeline)
  } catch {
    return fallback
  }
}

function App() {
  const [friends, setFriends] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeline, setTimeline] = useState(() => readStoredTimeline())
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    let isMounted = true

    async function loadFriends() {
      setLoading(true)

      try {
        const response = await fetch('./friends.json')
        const data = await response.json()

        if (isMounted) {
          setFriends(data)
        }
      } catch {
        if (isMounted) {
          setFriends([])
        }
      } finally {
        if (isMounted) {
          setTimeout(() => {
            setLoading(false)
          }, 650)
        }
      }
    }

    loadFriends()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('keenkeeper-timeline', JSON.stringify(timeline))
  }, [timeline])

  function pushToast(message) {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`

    setToasts((current) => [...current, { id, message }])

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 2400)
  }

  function handleQuickCheckIn(friend, type) {
    const actionLabel = type.charAt(0).toUpperCase() + type.slice(1)
    const timestamp = new Date()
    const entry = {
      id: `${friend.id}-${timestamp.getTime()}`,
      friendId: friend.id,
      friendName: friend.name,
      type,
      title: `${actionLabel} with ${friend.name}`,
      date: timestamp.toLocaleDateString('en-CA'),
      timestamp: timestamp.toISOString(),
    }

    setTimeline((current) => [entry, ...current])
    pushToast(`${actionLabel} logged for ${friend.name}`)
  }

  return (
    <HashRouter>
      <div className="app-shell">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <Header />
        <main className="page-shell">
          <Routes>
            <Route
              path="/"
              element={<HomePage friends={friends} loading={loading} />}
            />
            <Route
              path="/friends/:friendId"
              element={
                <FriendDetailsPage
                  friends={friends}
                  loading={loading}
                  onQuickCheckIn={handleQuickCheckIn}
                />
              }
            />
            <Route
              path="/timeline"
              element={<TimelinePage timeline={timeline} friends={friends} />}
            />
            <Route path="/stats" element={<StatsPage timeline={timeline} />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
        <Footer />
        <ToastStack toasts={toasts} />
      </div>
    </HashRouter>
  )
}

function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="brand" aria-label="KeenKeeper home">
          <img src={logoIcon} alt="" className="brand__mark" />
          <img src={logoWordmark} alt="KeenKeeper" className="brand__wordmark" />
        </Link>

        <nav className="nav-links" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link--active' : ''}`
              }
            >
              <span className="nav-link__icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

function HomePage({ friends, loading }) {
  const overdueCount = friends.filter((friend) => friend.status === 'overdue').length
  const almostDueCount = friends.filter(
    (friend) => friend.status === 'almost due',
  ).length
  const onTrackCount = friends.filter((friend) => friend.status === 'on-track').length

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div className="hero-card__eyebrow">Friendships deserve follow-through</div>
        <h1>Keep the people you care about closer, longer.</h1>
        <p className="hero-card__copy">
          Track when you last checked in, spot overdue friendships early, and
          stay consistent with the relationships that matter most.
        </p>
        <button type="button" className="primary-button">
          <img src={logoIcon} alt="" />
          Add a Friend
        </button>

        <div className="summary-grid">
          <SummaryCard label="Total Friends" value={friends.length || 0} tone="neutral" />
          <SummaryCard label="Overdue" value={overdueCount} tone="overdue" />
          <SummaryCard label="Almost Due" value={almostDueCount} tone="almost-due" />
          <SummaryCard label="On Track" value={onTrackCount} tone="on-track" />
        </div>
      </section>

      <section className="section-card">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">Home</p>
            <h2>Your Friends</h2>
          </div>
          <p className="section-heading__note">
            Tap any profile to open the full relationship snapshot.
          </p>
        </div>

        {loading ? (
          <LoadingState />
        ) : (
          <div className="friends-grid">
            {friends.map((friend) => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function FriendCard({ friend }) {
  const status = statusMeta[friend.status]

  return (
    <Link to={`/friends/${friend.id}`} className="friend-card">
      <div className="friend-card__top">
        <img src={friend.picture} alt={friend.name} className="friend-card__avatar" />
        <span className={`status-pill ${status.className}`}>{status.label}</span>
      </div>
      <h3>{friend.name}</h3>
      <p className="friend-card__days">
        {friend.days_since_contact} days since last contact
      </p>
      <div className="tag-row">
        {friend.tags.map((tag) => (
          <span key={tag} className="tag-chip">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}

function FriendDetailsPage({ friends, loading, onQuickCheckIn }) {
  const { friendId } = useParams()
  const navigate = useNavigate()
  const friend = friends.find((entry) => entry.id === Number(friendId))

  if (loading) {
    return <LoadingState expanded />
  }

  if (!friend) {
    return <NotFoundCard />
  }

  const status = statusMeta[friend.status]

  return (
    <div className="details-layout">
      <section className="details-sidebar">
        <button type="button" className="ghost-button" onClick={() => navigate(-1)}>
          Back
        </button>

        <article className="profile-card">
          <img src={friend.picture} alt={friend.name} className="profile-card__avatar" />
          <div className="profile-card__header">
            <h1>{friend.name}</h1>
            <span className={`status-pill ${status.className}`}>{status.label}</span>
          </div>

          <div className="tag-row">
            {friend.tags.map((tag) => (
              <span key={tag} className="tag-chip">
                {tag}
              </span>
            ))}
          </div>

          <p className="profile-card__bio">{friend.bio}</p>

          <div className="profile-card__meta">
            <span>Email</span>
            <a href={`mailto:${friend.email}`}>{friend.email}</a>
          </div>

          <div className="profile-actions">
            <button type="button" className="muted-button">
              Snooze 2 Weeks
            </button>
            <button type="button" className="muted-button">
              Archive
            </button>
            <button type="button" className="danger-button">
              Delete
            </button>
          </div>
        </article>
      </section>

      <section className="details-content">
        <div className="stat-card-grid">
          <MetricCard label="Days Since Contact" value={friend.days_since_contact} />
          <MetricCard label="Goal" value={`${friend.goal} days`} />
          <MetricCard label="Next Due Date" value={formatDate(friend.next_due_date)} />
        </div>

        <article className="info-card">
          <div className="card-heading">
            <div>
              <p className="section-heading__eyebrow">Relationship Goal</p>
              <h2>Stay in touch every {friend.goal} days</h2>
            </div>
            <button type="button" className="ghost-button">
              Edit
            </button>
          </div>
          <p>
            Keep a steady rhythm with {friend.name.split(' ')[0]} so the friendship
            feels warm, current, and easy to maintain.
          </p>
        </article>

        <article className="info-card">
          <div className="card-heading">
            <div>
              <p className="section-heading__eyebrow">Quick Check-In</p>
              <h2>Log a new interaction</h2>
            </div>
          </div>

          <div className="action-grid">
            <ActionButton
              label="Call"
              icon={callIcon}
              onClick={() => onQuickCheckIn(friend, 'call')}
            />
            <ActionButton
              label="Text"
              icon={textIcon}
              onClick={() => onQuickCheckIn(friend, 'text')}
            />
            <ActionButton
              label="Video"
              icon={videoIcon}
              onClick={() => onQuickCheckIn(friend, 'video')}
            />
          </div>
        </article>
      </section>
    </div>
  )
}

function TimelinePage({ timeline }) {
  const [filter, setFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')

  const filteredTimeline = timeline
    .filter((entry) => filter === 'all' || entry.type === filter)
    .sort((first, second) => {
      if (sortOrder === 'newest') {
        return new Date(second.timestamp) - new Date(first.timestamp)
      }

      return new Date(first.timestamp) - new Date(second.timestamp)
    })

  return (
    <div className="page-stack">
      <section className="section-card">
        <div className="section-heading section-heading--wrap">
          <div>
            <p className="section-heading__eyebrow">History</p>
            <h1>Timeline</h1>
          </div>
          <div className="toolbar">
            {['all', 'call', 'text', 'video'].map((option) => (
              <button
                key={option}
                type="button"
                className={`toolbar-button ${filter === option ? 'toolbar-button--active' : ''}`}
                onClick={() => setFilter(option)}
              >
                {option === 'all'
                  ? 'All'
                  : option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
            <button
              type="button"
              className="toolbar-button"
              onClick={() =>
                setSortOrder((current) => (current === 'newest' ? 'oldest' : 'newest'))
              }
            >
              {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
            </button>
          </div>
        </div>

        <div className="timeline-list">
          {filteredTimeline.map((entry) => (
            <article key={entry.id} className="timeline-entry">
              <div className="timeline-entry__icon">
                <img src={actionIcons[entry.type]} alt="" />
              </div>
              <div className="timeline-entry__content">
                <p className="timeline-entry__date">{formatDate(entry.date)}</p>
                <h3>{entry.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

function StatsPage({ timeline }) {
  const chartData = [
    {
      name: 'Call',
      value: timeline.filter((entry) => entry.type === 'call').length,
    },
    {
      name: 'Text',
      value: timeline.filter((entry) => entry.type === 'text').length,
    },
    {
      name: 'Video',
      value: timeline.filter((entry) => entry.type === 'video').length,
    },
  ]

  return (
    <div className="page-stack">
      <section className="section-card">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">Insights</p>
            <h1>Friendship Analytics</h1>
          </div>
          <p className="section-heading__note">
            Breakdown of all logged check-ins across calls, texts, and video chats.
          </p>
        </div>

        <div className="chart-panel">
          <div className="chart-copy">
            <h2>Interaction mix</h2>
            <p>
              Keep an eye on how you tend to show up for friends so your outreach
              stays balanced.
            </p>
          </div>

          <div className="chart-shell">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={analyticsColors[index % analyticsColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  )
}

function Footer() {
  const socialLinks = [
    { href: 'https://facebook.com', icon: facebookIcon, label: 'Facebook' },
    { href: 'https://instagram.com', icon: instagramIcon, label: 'Instagram' },
    { href: 'https://twitter.com', icon: twitterIcon, label: 'Twitter' },
  ]

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <img src={logoWordmark} alt="KeenKeeper" className="site-footer__brand" />
        <p>Be intentional about the people who matter to you.</p>
        <div className="site-footer__socials">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={link.label}
            >
              <img src={link.icon} alt="" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

function SummaryCard({ label, value, tone }) {
  return (
    <article className={`summary-card summary-card--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}

function MetricCard({ label, value }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}

function ActionButton({ label, icon, onClick }) {
  return (
    <button type="button" className="action-button" onClick={onClick}>
      <img src={icon} alt="" />
      <span>{label}</span>
    </button>
  )
}

function LoadingState({ expanded = false }) {
  return (
    <div className={`loading-card ${expanded ? 'loading-card--expanded' : ''}`}>
      <div className="spinner" />
      <p>Loading your friendship dashboard...</p>
    </div>
  )
}

function NotFoundCard() {
  return (
    <section className="section-card">
      <h1>Friend not found</h1>
      <p>This profile does not exist or may have been removed.</p>
      <Link to="/" className="primary-button primary-button--link">
        Go back home
      </Link>
    </section>
  )
}

function NotFoundPage() {
  const location = useLocation()

  return (
    <section className="section-card not-found-page">
      <p className="section-heading__eyebrow">404 Page</p>
      <h1>That page slipped through the cracks.</h1>
      <p>
        We could not find <code>{location.pathname}</code>. Head back to the
        dashboard and keep in touch with your people.
      </p>
      <Link to="/" className="primary-button primary-button--link">
        Return Home
      </Link>
    </section>
  )
}

function ToastStack({ toasts }) {
  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast">
          {toast.message}
        </div>
      ))}
    </div>
  )
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default App
