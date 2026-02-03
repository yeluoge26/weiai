import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import Layout from '@/components/Layout'
import Login from '@/pages/Login'
import Chat from '@/pages/Chat'
import ChatRoom from '@/pages/ChatRoom'
import Contacts from '@/pages/Contacts'
import Moments from '@/pages/Moments'
import Community from '@/pages/Community'
import Discover from '@/pages/Discover'
import Profile from '@/pages/Profile'
import Wallet from '@/pages/Wallet'
import CharacterDetail from '@/pages/CharacterDetail'
import CreateCharacter from '@/pages/CreateCharacter'
import Favorites from '@/pages/Favorites'
import Notifications from '@/pages/Notifications'
import PrivacySettings from '@/pages/PrivacySettings'
import Settings from '@/pages/Settings'
import HelpFeedback from '@/pages/HelpFeedback'
import About from '@/pages/About'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/chat" replace />} />
        <Route path="chat" element={<Chat />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="moments" element={<Moments />} />
        <Route path="community" element={<Community />} />
        <Route path="discover" element={<Discover />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route
        path="/character/:id"
        element={
          <ProtectedRoute>
            <CharacterDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat/:characterId"
        element={
          <ProtectedRoute>
            <ChatRoom />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wallet"
        element={
          <ProtectedRoute>
            <Wallet />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-character"
        element={
          <ProtectedRoute>
            <CreateCharacter />
          </ProtectedRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/privacy-settings"
        element={
          <ProtectedRoute>
            <PrivacySettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/help-feedback"
        element={
          <ProtectedRoute>
            <HelpFeedback />
          </ProtectedRoute>
        }
      />
      <Route
        path="/about"
        element={
          <ProtectedRoute>
            <About />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
