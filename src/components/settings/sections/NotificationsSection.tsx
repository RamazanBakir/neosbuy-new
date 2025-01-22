import { Switch } from '@headlessui/react'
import { useState } from 'react'

export default function NotificationSection() {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])

  const tasks = [
    { id: 'push', label: 'Push' },
    { id: 'email', label: 'Email' }
  ]

  const handleTaskToggle = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  return (
    <div className="space-y-6">
      {/* Tasks Setting */}
      <div className="space-y-4">
        <div className="flex items-center">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tasks</label>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {tasks.map((task) => (
            <div 
              key={task.id}
              className="flex items-center justify-between p-4 border-b last:border-b-0 border-gray-200 dark:border-gray-700"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300">{task.label}</span>
              <Switch
                checked={selectedTasks.includes(task.id)}
                onChange={() => handleTaskToggle(task.id)}
                className={`${
                  selectedTasks.includes(task.id) ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
              >
                <span className={`${
                  selectedTasks.includes(task.id) ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
              </Switch>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 