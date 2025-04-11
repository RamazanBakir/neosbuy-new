import { useState, Dispatch, SetStateAction } from 'react'
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
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import ContextMenu from '../common/ContextMenu'
import { useTranslation } from 'react-i18next'

const tools = [
  { icon: ChatBubbleLeftIcon, label: 'sidebar.aiChat', active: true },
]

const others = [
  { 
    icon: Square2StackIcon, 
    label: 'sidebar.extension',
    onClick: () => {}
  },
  { 
    icon: QuestionMarkCircleIcon, 
    label: 'sidebar.support',
    onClick: () => window.location.href = 'mailto:help@neosbuy.app'
  },
  { 
    icon: Cog6ToothIcon, 
    label: 'sidebar.pricingPlans',
    onClick: () => {}
  },
  { 
    icon: Cog6ToothIcon, 
    label: 'sidebar.profileSettings',
    onClick: () => {}
  }
]

interface SidebarProps {
  sessions: ChatSession[]
  activeSessionId: string | null
  onSessionSelect: (sessionId: string) => void
  onNewSession: () => void
  onUpdateSessionTitle: (sessionId: string, title: string) => void
  onDeleteSession: (sessionId: string) => void
  onClose: () => void
  showLoginModal: boolean
  setShowLoginModal: Dispatch<SetStateAction<boolean>>
  showRegisterModal: boolean
  setShowRegisterModal: Dispatch<SetStateAction<boolean>>
}

export default function Sidebar({ 
  sessions, 
  activeSessionId, 
  onSessionSelect, 
  onNewSession,
  onUpdateSessionTitle,
  onDeleteSession,
  onClose,
  showLoginModal,
  setShowLoginModal,
  showRegisterModal,
  setShowRegisterModal
}: SidebarProps) {
  const { user } = useAuth()
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isAIChatOpen, setIsAIChatOpen] = useState(true)
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    sessionId: string
  } | null>(null)
  const { t } = useTranslation()

  const handleSettingsClick = () => {
    if (user) {
      setIsSettingsOpen(true)
    } else {
      setIsAuthOpen(true)
    }
  }

  const truncateTitle = (title: string, maxLength: number = 25) => {
    if (title.length <= maxLength) return title
    return title.substring(0, maxLength) + '...'
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

  const handleContextMenu = (e: React.MouseEvent, sessionId: string) => {
    e.preventDefault()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      sessionId
    })
  }

  return (
    <aside className="h-full bg-gray-50 dark:bg-[#202123] flex flex-col w-64 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700/50">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="NeosBuy" className="h-8 w-auto" />
          <span className="font-semibold text-xl text-gray-900 dark:text-gray-200">NeosBuy</span>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Tools Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-2">
          <div className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            <span>Tools</span>
          </div>

          <div>
            <button
              onClick={() => setIsAIChatOpen(!isAIChatOpen)}
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
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
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  <span>{t('sidebar.newChat')}</span>
                </button>

                {sessions.map((session) => (
                  <div 
                    key={session.id} 
                    className="group flex items-center"
                    onContextMenu={(e) => handleContextMenu(e, session.id)}
                  >
                    {editingSessionId === session.id ? (
                      <div className="flex-1 px-3 py-2">
                        <div className="relative">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleEditSave()
                              if (e.key === 'Escape') handleEditCancel()
                            }}
                            maxLength={50}
                            placeholder={t('sidebar.search')}
                            className="w-full px-2 py-1 pr-16 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <button
                              onClick={handleEditSave}
                              className="p-1 text-gray-400 hover:text-green-500"
                              title={t('sidebar.save')}
                            >
                              <CheckIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={handleEditCancel}
                              className="p-1 text-gray-400 hover:text-red-500"
                              title={t('sidebar.cancel')}
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => onSessionSelect(session.id)}
                          className={`flex-1 flex items-center px-3 py-2 text-sm rounded-lg min-w-0 ${
                            session.id === activeSessionId
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                          }`}
                        >
                          <ChatBubbleLeftIcon className="h-4 w-4 min-w-[16px] mr-2" />
                          <span className="truncate block max-w-[160px]">{session.title}</span>
                        </button>
                        <div className="flex items-center opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() => handleEditStart(session)}
                            className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                            title={t('sidebar.edit')}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onDeleteSession(session.id)}
                            className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                            title={t('sidebar.delete')}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-3 py-2">
          <h3 className="px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
            {t('sidebar.others')}
          </h3>
          <div className="mt-2 space-y-1">
            {others.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <item.icon className="h-5 w-5" />
                <span>{t(item.label)}</span>
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

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          items={[
            {
              label: t('common.edit'),
              onClick: () => {
                setEditingSessionId(contextMenu.sessionId)
                setEditTitle(sessions.find(s => s.id === contextMenu.sessionId)?.title || '')
              }
            },
            {
              label: t('common.delete'),
              onClick: () => onDeleteSession(contextMenu.sessionId)
            }
          ]}
        />
      )}
    </aside>
  )
} 