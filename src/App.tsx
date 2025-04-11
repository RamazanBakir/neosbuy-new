import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ChatTools from './components/chat/ChatTools'
import Chat from './components/chat/Chat'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { useState, useEffect } from 'react'
import { ChatMessage, ChatSession } from './types/chat'
import AuthCallback from './components/auth/AuthCallback'
import { useTranslation } from 'react-i18next'
import BetaAnnouncement from './components/common/BetaAnnouncement'

export default function App() {
  const { t } = useTranslation()
  const { user } = useAuth()
  
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    if (user) {
      const savedSessions = localStorage.getItem('chat_sessions')
      return savedSessions ? JSON.parse(savedSessions) : []
    }
    return []
  })
  
  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    return localStorage.getItem('active_session_id')
  })

  const [showTools, setShowTools] = useState(() => {
    const savedShowTools = localStorage.getItem('show_tools')
    if (savedShowTools === null) return true
    return JSON.parse(savedShowTools)
  })

  const [showBetaAnnouncement, setShowBetaAnnouncement] = useState(() => {
    const hasSeenAnnouncement = localStorage.getItem('has_seen_beta_announcement')
    return !hasSeenAnnouncement && !user
  })

  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  useEffect(() => {
    localStorage.setItem('show_tools', JSON.stringify(showTools))
  }, [showTools])

  useEffect(() => {
    if (user && sessions.length > 0) {
      localStorage.setItem('chat_sessions', JSON.stringify(sessions))
    }
  }, [sessions, user])

  useEffect(() => {
    if (!user) {
      setSessions([])
      setActiveSessionId(null)
    } else {
      const savedSessions = localStorage.getItem('chat_sessions')
      if (savedSessions) {
        setSessions(JSON.parse(savedSessions))
      }
    }
  }, [user])

  useEffect(() => {
    if (activeSessionId) {
      localStorage.setItem('active_session_id', activeSessionId)
    } else {
      localStorage.removeItem('active_session_id')
    }
  }, [activeSessionId])

  const handleNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'Yeni Sohbet',
      createdAt: new Date(),
      messages: [],
      sessionId: null
    }
    setSessions(prev => [newSession, ...prev])
    setActiveSessionId(newSession.id)
  }

  const handleUpdateSession = (sessionId: string, messages: ChatMessage | ChatMessage[]) => {
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        setShowTools(false)
        return {
          ...session,
          messages: [...session.messages, ...(Array.isArray(messages) ? messages : [messages])]
        }
      }
      return session
    }))
  }

  const handleUpdateSessionTitle = (sessionId: string, title: string) => {
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return { ...session, title }
      }
      return session
    }))
  }

  const handleDeleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId))
    if (activeSessionId === sessionId) {
      // Silinen session aktifse, başka bir session'a geç veya null yap
      const remainingSessions = sessions.filter(s => s.id !== sessionId)
      setActiveSessionId(remainingSessions[0]?.id || null)
    }
  }

  const handleCloseBetaAnnouncement = () => {
    setShowBetaAnnouncement(false)
    localStorage.setItem('has_seen_beta_announcement', 'true')
  }

  const handleLogin = () => {
    setShowLoginModal(true)
  }

  const handleRegister = () => {
    setShowRegisterModal(true)
  }

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <BetaAnnouncement
            isOpen={showBetaAnnouncement}
            onClose={handleCloseBetaAnnouncement}
            onLogin={handleLogin}
            onRegister={handleRegister}
          />
          <Routes>
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              path="/"
              element={
                <Layout 
                  sessions={sessions}
                  activeSessionId={activeSessionId}
                  onNewSession={() => {
                    handleNewSession()
                    setShowTools(true)
                  }}
                  onSessionSelect={(id) => {
                    setActiveSessionId(id)
                    const session = sessions.find(s => s.id === id)
                    setShowTools(session?.messages.length === 0)
                  }}
                  onUpdateSessionTitle={handleUpdateSessionTitle}
                  onDeleteSession={handleDeleteSession}
                  showLoginModal={showLoginModal}
                  setShowLoginModal={setShowLoginModal}
                  showRegisterModal={showRegisterModal}
                  setShowRegisterModal={setShowRegisterModal}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      {showTools && (
                        <>
                          <h1 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
                            {t('chat.howCanIHelpYouToday')}
                          </h1>
                          <ChatTools />
                        </>
                      )}
                    </div>
                    <div className="pb-8">
                      <Chat 
                        sessions={sessions}
                        activeSessionId={activeSessionId}
                        onUpdateSession={handleUpdateSession}
                        onUpdateSessionTitle={handleUpdateSessionTitle}
                        setSessions={setSessions}
                        setActiveSessionId={setActiveSessionId}
                      />
                    </div>
                  </div>
                </Layout>
              }
            />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}
