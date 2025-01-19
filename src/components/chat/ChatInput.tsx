import { PaperAirplaneIcon } from '@heroicons/react/24/solid'

export default function ChatInput() {
  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="relative bg-white rounded-lg shadow-sm border border-gray-200">
        <textarea
          className="w-full px-4 py-3 pr-12 rounded-lg resize-none focus:outline-none focus:ring-0 focus:border-gray-300"
          placeholder="Type your message..."
          rows={1}
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600">
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
} 