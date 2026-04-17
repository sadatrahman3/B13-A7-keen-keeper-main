import { useParams, useNavigate } from 'react-router-dom'
import callIcon from '../assets/call.png'
import textIcon from '../assets/text.png'
import videoIcon from '../assets/video.png'

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

const actionIcons = {
  call: callIcon,
  text: textIcon,
  video: videoIcon,
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
    <div className="not-found-page">
      <div className="loading-card">
        <h2>👤 Friend Not Found</h2>
        <p>This friend doesn't exist in your contacts.</p>
      </div>
    </div>
  )
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default FriendDetailsPage