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
}

export default function Layout({ 
  children, 
  sessions, 
  activeSessionId, 
  onNewSession, 
  onSessionSelect 
}: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-gray-50">
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
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        <Header 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen}
        />
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  )
} 