interface ChatListProps {
  sessions: ChatSession[]
  activeSessionId: string | null
  onSelectSession: (id: string) => void
}

export default function ChatList({ sessions, activeSessionId, onSelectSession }: ChatListProps) {
  return (
    <div className="flex flex-col space-y-2">
      {sessions.map((session) => (
        <button
          key={session.id}
          onClick={() => onSelectSession(session.id)}
          className={`flex flex-col items-start p-3 w-full rounded-lg transition-colors ${
            session.id === activeSessionId
              ? 'bg-gray-100 dark:bg-gray-700'
              : 'hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          <div className="flex items-center w-full">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 flex-1">
              {session.title || t('chat.newChatTitle')}
            </span>
            {session.sessionId && (
              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-full">
                Devam ediyor
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {new Date(session.createdAt).toLocaleDateString('tr-TR')}
          </span>
        </button>
      ))}
    </div>
  )
} 