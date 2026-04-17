import { useEffect, useState } from 'react'
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

// Layout & Pages
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './components/HomePage'
import FriendDetailsPage from './components/FriendDetailsPage'
import TimelinePage from './components/TimelinePage'
import StatsPage from './components/StatsPage'
import NotFoundPage from './components/NotFoundPage'
import ToastStack from './components/ToastStack'

// Essential Assets
import logoIcon from './assets/logo.png' 

import './App.css'

// --- Configuration & Helpers ---

// If you don't have these files, I'm setting them to empty strings 
// so the app doesn't crash. Replace with actual imports if you have the files.
const callIcon = ""; 
const textIcon = "";
const videoIcon = "";

const actionIcons = {
  call: callIcon,
  text: textIcon,
  video: videoIcon,
}

const statusMeta = {
  overdue: { label: 'Overdue', className: 'status-overdue' },
  'almost due': { label: 'Almost Due', className: 'status-almost-due' },
  'on-track': { label: 'On Track', className: 'status-on-track' },
}

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
  ]

  const storedTimeline = localStorage.getItem('keenkeeper-timeline')
  if (!storedTimeline) return fallback

  try {
    return JSON.parse(storedTimeline)
  } catch {
    return fallback
  }
}

// --- Main App Component ---

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
        if (isMounted) setFriends(data)
      } catch {
        if (isMounted) setFriends([])
      } finally {
        if (isMounted) {
          setTimeout(() => setLoading(false), 650)
        }
      }
    }
    loadFriends()
    return () => { isMounted = false }
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
            <Route 
              path="/stats" 
              element={<StatsPage timeline={timeline} />} 
            />
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

export default App