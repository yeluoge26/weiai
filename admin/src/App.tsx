import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import BasicLayout from '@/layouts/BasicLayout'
import Login from '@/pages/login'
import Dashboard from '@/pages/dashboard'
import UserList from '@/pages/users'
import CharacterList from '@/pages/characters'
import GiftList from '@/pages/gifts'
import ScriptEditor from '@/pages/scripts'
import MomentList from '@/pages/moments'
import Settings from '@/pages/settings'
import VipManagement from '@/pages/vip'
import Analytics from '@/pages/analytics'
import AIConfigManagement from '@/pages/ai-config'
import SystemMonitor from '@/pages/monitor'
import SecuritySettings from '@/pages/security'

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <BasicLayout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/users" element={<UserList />} />
                  <Route path="/characters" element={<CharacterList />} />
                  <Route path="/gifts" element={<GiftList />} />
                  <Route path="/scripts" element={<ScriptEditor />} />
                  <Route path="/moments" element={<MomentList />} />
                  <Route path="/vip" element={<VipManagement />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/ai-config" element={<AIConfigManagement />} />
                  <Route path="/monitor" element={<SystemMonitor />} />
                  <Route path="/security" element={<SecuritySettings />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </BasicLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
