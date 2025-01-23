import Layout from './components/layout/Layout'
import ChatTools from './components/chat/ChatTools'
import Chat from './components/chat/Chat'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { useState, useEffect } from 'react'
import { ChatMessage, ChatSession } from './types/chat'

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const savedSessions = localStorage.getItem('chat_sessions')
    return savedSessions ? JSON.parse(savedSessions) : []
  })
  
  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    return localStorage.getItem('active_session_id')
  })

  // Sessions değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('chat_sessions', JSON.stringify(sessions))
  }, [sessions])

  // Active session değiştiğinde localStorage'a kaydet
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
      messages: []
    }
    setSessions(prev => [newSession, ...prev])
    setActiveSessionId(newSession.id)
  }

  const handleUpdateSession = (sessionId: string, messages: ChatMessage | ChatMessage[]) => {
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          messages: [...session.messages, ...(Array.isArray(messages) ? messages : [messages])]
        }
      }
      return session
    }))
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <Layout 
          sessions={sessions}
          activeSessionId={activeSessionId}
          onNewSession={handleNewSession}
          onSessionSelect={setActiveSessionId}
        >
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-center mb-8">
                How can I help you today?
              </h1>
              <ChatTools />
            </div>
            <div className="pb-8">
              <Chat 
                sessions={sessions}
                activeSessionId={activeSessionId}
                onUpdateSession={handleUpdateSession}
              />
            </div>
          </div>
        </Layout>
      </ThemeProvider>
    </AuthProvider>
  )
}
