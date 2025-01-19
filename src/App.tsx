import Layout from './components/layout/Layout'
import ChatTools from './components/chat/ChatTools'
import ChatInput from './components/chat/ChatInput'
import { ThemeProvider } from './context/ThemeContext'

export default function App() {
  return (
    <ThemeProvider>
      <Layout>
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <h1 className="text-4xl text-gray-700 text-center mb-8">
              How can I help you today?
            </h1>
            <ChatTools />
          </div>
          <div className="pb-8">
            <ChatInput />
          </div>
        </div>
      </Layout>
    </ThemeProvider>
  )
}
