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
import { useTranslation } from 'react-i18next'

const tools = [
  { icon: PencilIcon, label: 'tools.helpMeAsk', isPro: false },
  { icon: PhotoIcon, label: 'tools.searchWithImages', isPro: true },
  { icon: EyeIcon, label: 'tools.analyzeImage', isPro: true },
  { icon: QuestionMarkCircleIcon, label: 'tools.getAdvice', isPro: false },
  { icon: LightBulbIcon, label: 'tools.brainstorm', isPro: false },
  { icon: GlobeAltIcon, label: 'tools.webSearch', isPro: false },
  { icon: MagnifyingGlassIcon, label: 'tools.searchProducts', isPro: false },
  { icon: ShoppingCartIcon, label: 'tools.trackOrder', isPro: false },
  { icon: TagIcon, label: 'tools.comparePrices', isPro: true },
  { icon: QuestionMarkCircleIcon, label: 'tools.productSuggestion', isPro: false }
]

export default function ChatTools() {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-3xl mx-auto mb-8">
      {tools.map((tool) => (
        <button
          key={tool.label}
          className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
        >
          <tool.icon className="h-6 w-6 text-gray-600 dark:text-gray-300 mb-2" />
          <span className="text-sm text-gray-700 dark:text-gray-200">{t(tool.label)}</span>
          {tool.isPro && (
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium mt-1">{t('tools.pro')}</span>
          )}
        </button>
      ))}
    </div>
  )
} 