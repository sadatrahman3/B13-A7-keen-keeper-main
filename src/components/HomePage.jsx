import { Link } from 'react-router-dom'
import logoIcon from '../assets/logo.png'

function HomePage({ friends, loading }) {
  const overdueCount = friends.filter((friend) => friend.status === 'overdue').length
  const almostDueCount = friends.filter(
    (friend) => friend.status === 'almost due',
  ).length
  const onTrackCount = friends.filter((friend) => friend.status === 'on-track').length

  return (
    <div className="page-stack">
      <section className="hero-card">
        
        <h1>Friends to keep close in your life</h1>
        <p className="hero-card__copy">
          Your personal shelf of meaningful connections. Browse, tend, and nurture the
          relationships that matter most.
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

function SummaryCard({ label, value, tone }) {
  return (
    <article className={`summary-card summary-card--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
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

function LoadingState({ expanded = false }) {
  return (
    <div className={`loading-card ${expanded ? 'loading-card--expanded' : ''}`}>
      <div className="spinner" />
      <p>Loading your friendship dashboard...</p>
    </div>
  )
}

export default HomePage