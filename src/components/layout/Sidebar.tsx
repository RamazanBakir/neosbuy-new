import { 
  ChatBubbleLeftIcon, 
  ArrowLeftIcon,
  Square2StackIcon,
  QuestionMarkCircleIcon,
  Cog6ToothIcon
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
  onClose: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
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
        <div className="px-3 mb-6">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-700 bg-white hover:bg-gray-100 rounded-lg border border-gray-200">
            + Start New
          </button>
        </div>

        <div className="px-3 mb-6">
          <h2 className="text-xs font-medium text-gray-500 uppercase px-3 mb-2">Tools</h2>
          <div className="space-y-1">
            {tools.map((tool) => (
              <button
                key={tool.label}
                className={`w-full flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg ${
                  tool.active ? 'bg-white shadow-sm' : 'hover:bg-gray-100'
                }`}
              >
                <tool.icon className="h-5 w-5" />
                <span className="text-sm">{tool.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="px-3">
          <h2 className="text-xs font-medium text-gray-500 uppercase px-3 mb-2">Others</h2>
          <div className="space-y-1">
            {others.map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
} 