import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { ChatSession } from '../../types/chat'
import AuthModal from '../auth/AuthModal'
import SettingsModal from '../settings/SettingsModal'
import { 
  ChatBubbleLeftIcon, 
  ArrowLeftIcon,
  Square2StackIcon,
  QuestionMarkCircleIcon,
  Cog6ToothIcon,
  PlusIcon,
  ChevronDownIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

const tools = [
  { icon: ChatBubbleLeftIcon, label: 'AI Chat', active: true },
]

const others = [
  { icon: Square2StackIcon, label: 'Extension' },
  { icon: QuestionMarkCircleIcon, label: 'Support' },
  { icon: Cog6ToothIcon, label: 'Pricing Plans' },
  { icon: Cog6ToothIcon, label: 'Profile & Settings' }
]

interface SidebarProps {
  sessions: ChatSession[]
  activeSessionId: string | null
  onSessionSelect: (sessionId: string) => void
  onNewSession: () => void
  onUpdateSessionTitle: (sessionId: string, title: string) => void
  onDeleteSession: (sessionId: string) => void
  onClose: () => void
}

export default function Sidebar({ 
  sessions, 
  activeSessionId, 
  onSessionSelect, 
  onNewSession,
  onUpdateSessionTitle,
  onDeleteSession,
  onClose 
}: SidebarProps) {
  const { user } = useAuth()
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isAIChatOpen, setIsAIChatOpen] = useState(true)
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const handleSettingsClick = () => {
    if (user) {
      setIsSettingsOpen(true)
    } else {
      setIsAuthOpen(true)
    }
  }

  const handleEditStart = (session: ChatSession) => {
    setEditingSessionId(session.id)
    setEditTitle(session.title)
  }

  const handleEditSave = () => {
    if (editingSessionId && editTitle.trim()) {
      onUpdateSessionTitle(editingSessionId, editTitle.trim())
      setEditingSessionId(null)
    }
  }

  const handleEditCancel = () => {
    setEditingSessionId(null)
    setEditTitle('')
  }

  return (
    <aside className="h-full bg-gray-50 flex flex-col w-64 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="NeosBuy" className="h-8 w-auto" />
          <span className="font-semibold text-xl">NeosBuy</span>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-200 rounded-lg flex items-center justify-center"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Tools Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-2">
          <div className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600">
            <span>Tools</span>
          </div>

          <div>
            <button
              onClick={() => setIsAIChatOpen(!isAIChatOpen)}
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <div className="flex items-center space-x-2">
                <ChatBubbleLeftIcon className="h-5 w-5" />
                <span>AI Chat</span>
              </div>
              <ChevronDownIcon 
                className={`h-4 w-4 transition-transform ${isAIChatOpen ? 'transform rotate-180' : ''}`} 
              />
            </button>

            {isAIChatOpen && (
              <div className="ml-4 mt-1 space-y-1">
                <button
                  onClick={onNewSession}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  <span>Start New</span>
                </button>

                {sessions.map((session) => (
                  <div key={session.id} className="group flex items-center">
                    {editingSessionId === session.id ? (
                      <div className="flex-1 px-3 py-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={handleEditSave}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleEditSave()
                            if (e.key === 'Escape') handleEditCancel()
                          }}
                          className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => onSessionSelect(session.id)}
                          onDoubleClick={() => handleEditStart(session)}
                          className={`flex-1 flex items-center px-3 py-2 text-sm rounded-lg ${
                            session.id === activeSessionId
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <ChatBubbleLeftIcon className="h-4 w-4 mr-2" />
                          <span className="truncate">{session.title}</span>
                        </button>
                        <button
                          onClick={() => onDeleteSession(session.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-3 mb-6">
          <h2 className="text-xs font-medium text-gray-500 uppercase px-3 mb-2">Others</h2>
          <div className="space-y-1">
            {others.map((item) => (
              <button
                key={item.label}
                onClick={item.label === 'Profile & Settings' ? handleSettingsClick : undefined}
                className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </aside>
  )
} 