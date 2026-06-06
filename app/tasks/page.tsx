'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, CheckCircle2, Circle, Trash2, LogOut, Layers, Filter, Calendar, ListTodo } from 'lucide-react'

interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
}

export default function TasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/')
      return
    }
    fetchTasks(token)
  }, [router])

  const fetchTasks = async (token: string) => {
    try {
      const response = await fetch('[https://build-a-simple-9058-api.onrender.com/api/tasks](https://build-a-simple-9058-api.onrender.com/api/tasks)', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error()
      const data = await response.json()
      setTasks(Array.isArray(data) ? data : [])
    } catch {
      handleLogout()
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setActionLoading(true)

    const token = localStorage.getItem('auth_token')
    try {
      const response = await fetch('[https://build-a-simple-9058-api.onrender.com/api/tasks](https://build-a-simple-9058-api.onrender.com/api/tasks)', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, completed: false }),
      })
      if (response.ok) {
        setTitle('')
        setDescription('')
        if (token) fetchTasks(token)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleComplete = async (task: Task) => {
    const token = localStorage.getItem('auth_token')
    try {
      const response = await fetch(`https://build-a-simple-9058-api.onrender.com/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...task, completed: !task.completed }),
      })
      if (response.ok && token) fetchTasks(token)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteTask = async (id: string) => {
    const token = localStorage.getItem('auth_token')
    try {
      const response = await fetch(`https://build-a-simple-9058-api.onrender.com/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok && token) fetchTasks(token)
    } catch (err) {
      console.error(err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    router.push('/')
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  const activeCount = tasks.filter((t) => !t.completed).length

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Premium Navbar */}
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 text-white">
              <Layers className="h-4 w-4 stroke-[1.5]" />
            </div>
            <span className="font-semibold tracking-tight text-neutral-900">Aura Workspace</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-neutral-50"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-soft">
            <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ListTodo className="h-4 w-4 text-neutral-400" /> Create Architecture
            </h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="Review system requirements..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3.5 py-2.5 text-sm transition-all focus:border-neutral-900 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Context / Details (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Provide parameters and criteria..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3.5 py-2.5 text-sm transition-all focus:border-neutral-900 focus:bg-white resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={actionLoading}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-neutral-950 px-4 py-2.5 text-xs font-medium text-white transition-all hover:bg-neutral-800 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" /> Add Task Space
              </button>
            </form>
          </div>

          {/* Quick Metrics */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-soft flex justify-between items-center">
            <div>
              <span className="block text-2xl font-semibold text-neutral-900">{activeCount}</span>
              <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Remaining Nodes</span>
            </div>
            <div className="text-right">
              <span className="block text-2xl font-semibold text-neutral-900">{tasks.length}</span>
              <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Total Actions</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Task List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-neutral-900">Task Dynamic Matrix</h1>
              <p className="text-xs text-neutral-400 mt-0.5">Real-time enterprise workflows and objectives.</p>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl self-start sm:self-center">
              {(['all', 'active', 'completed'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-3 py-1.5 text-xs font-medium capitalize rounded-lg transition-all ${
                    filter === type
                      ? 'bg-white text-neutral-900 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Tasks Container */}
          <div className="space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white border border-neutral-100 rounded-2xl space-y-3">
                <svg className="animate-spin h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-xs font-medium text-neutral-400">Syncing Environment...</span>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white border border-neutral-100 rounded-2xl text-center px-4">
                <Filter className="h-8 w-8 text-neutral-300 stroke-[1.2] mb-3" />
                <h3 className="text-sm font-semibold text-neutral-800">No active structures located</h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs">Modify filters or build architectural components to initialize.</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`group flex items-start justify-between p-4 bg-white border rounded-2xl transition-all duration-200 ${
                    task.completed 
                      ? 'border-neutral-100 bg-neutral-50/40 opacity-70' 
                      : 'border-neutral-100 shadow-soft hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1 pr-4">
                    <button
                      onClick={() => handleToggleComplete(task)}
                      className="mt-0.5 text-neutral-400 hover:text-neutral-900 transition-colors flex-shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-neutral-900 stroke-[2]" />
                      ) : (
                        <Circle className="h-5 w-5 stroke-[1.5]" />
                      )}
                    </button>
                    <div className="space-y-0.5">
                      <p className={`text-sm font-medium ${task.completed ? 'line-through text-neutral-400' : 'text-neutral-900'}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className={`text-xs ${task.completed ? 'line-through text-neutral-400/80' : 'text-neutral-500'}`}>
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 transition-all duration-150 flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4 stroke-[1.5]" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}