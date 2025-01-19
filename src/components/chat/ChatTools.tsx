import { 
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  TagIcon,
  QuestionMarkCircleIcon,
  PencilIcon,
  PhotoIcon,
  EyeIcon,
  LightBulbIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

const tools = [
  { icon: PencilIcon, label: 'Help me ask', isPro: false },
  { icon: PhotoIcon, label: 'Search with images', isPro: true },
  { icon: EyeIcon, label: 'Analyze image', isPro: true },
  { icon: QuestionMarkCircleIcon, label: 'Get advice', isPro: false },
  { icon: LightBulbIcon, label: 'Brainstorm', isPro: false },
  { icon: GlobeAltIcon, label: 'Web search', isPro: false },
  { 
    icon: MagnifyingGlassIcon, 
    label: 'Search Products', 
    isPro: false 
  },
  { 
    icon: ShoppingCartIcon, 
    label: 'Track Order', 
    isPro: false 
  },
  { 
    icon: TagIcon, 
    label: 'Compare Prices', 
    isPro: true 
  },
  { 
    icon: QuestionMarkCircleIcon, 
    label: 'Product Suggestion', 
    isPro: false 
  }
]

export default function ChatTools() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-3xl mx-auto mb-8">
      {tools.map((tool) => (
        <button
          key={tool.label}
          className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
        >
          <tool.icon className="h-6 w-6 text-gray-600 dark:text-gray-300 mb-2" />
          <span className="text-sm text-gray-700 dark:text-gray-200">{tool.label}</span>
          {tool.isPro && (
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium mt-1">Pro</span>
          )}
        </button>
      ))}
    </div>
  )
} 