import { ReactNode, useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { ChatSession } from '../../types/chat'

interface LayoutProps {
  children: ReactNode
  sessions: ChatSession[]
  activeSessionId: string | null
  onNewSession: () => void
  onSessionSelect: (sessionId: string) => void
  onUpdateSessionTitle: (sessionId: string, title: string) => void
  onDeleteSession: (sessionId: string) => void
}

export default function Layout({ 
  children, 
  sessions, 
  activeSessionId, 
  onNewSession, 
  onSessionSelect, 
  onUpdateSessionTitle, 
  onDeleteSession 
}: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#343541]">
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-y-0 left-0 lg:relative w-64 z-50">
          <Sidebar 
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSessionSelect={onSessionSelect}
            onNewSession={onNewSession}
            onClose={() => setIsSidebarOpen(false)} 
            onUpdateSessionTitle={onUpdateSessionTitle}
            onDeleteSession={onDeleteSession}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        <Header 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen}
        />
        <main className="flex-1 overflow-auto bg-white dark:bg-[#343541]">
          {children}
        </main>
      </div>
    </div>
  )
} 