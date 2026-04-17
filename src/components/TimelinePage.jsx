import { useState } from 'react'
import callIcon from '../assets/call.png'
import textIcon from '../assets/text.png'
import videoIcon from '../assets/video.png'

const actionIcons = {
  call: callIcon,
  text: textIcon,
  video: videoIcon,
}

function TimelinePage({ timeline, friends }) {
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
          {filteredTimeline.length === 0 ? (
            <div className="loading-card">
              <p>No timeline entries yet. Start by checking in with your friends!</p>
            </div>
          ) : (
            filteredTimeline.map((entry) => (
              <TimelineEntry key={entry.id} entry={entry} />
            ))
          )}
        </div>
      </section>
    </div>
  )
}

function TimelineEntry({ entry }) {
  return (
    <article className="timeline-entry">
      <div className="timeline-entry__icon">
        <img src={actionIcons[entry.type]} alt="" />
      </div>
      <div>
        <h3>{entry.title}</h3>
        <p className="timeline-entry__date">{formatDate(entry.date)}</p>
      </div>
    </article>
  )
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default TimelinePage