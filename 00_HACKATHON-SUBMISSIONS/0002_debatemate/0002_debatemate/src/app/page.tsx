'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Brain, Award, TrendingUp, Target, MessageSquare, Trophy, ArrowRight, BookOpen } from 'lucide-react'
import Link from 'next/link'

interface DebateTopic {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
}

const SAMPLE_TOPICS: DebateTopic[] = [
  {
    id: '1',
    title: 'Should social media be regulated?',
    description: 'Debate the impact of social media regulation on free speech and user safety',
    difficulty: 'intermediate',
    category: 'Technology'
  },
  {
    id: '2',
    title: 'Is remote work better than office work?',
    description: 'Compare productivity, collaboration, and work-life balance in different work environments',
    difficulty: 'beginner',
    category: 'Business'
  },
  {
    id: '3',
    title: 'Should AI development be paused?',
    description: 'Discuss the risks and benefits of artificial intelligence advancement',
    difficulty: 'advanced',
    category: 'Technology'
  },
  {
    id: '4',
    title: 'Should college education be free?',
    description: 'Debate accessibility vs. quality in higher education funding',
    difficulty: 'intermediate',
    category: 'Education'
  },
  {
    id: '5',
    title: 'Should pets be allowed in workplaces?',
    description: 'Explore the benefits and challenges of pet-friendly office policies',
    difficulty: 'beginner',
    category: 'Business'
  },
  {
    id: '6',
    title: 'Is universal basic income necessary?',
    description: 'Discuss economic security and automation in modern society',
    difficulty: 'advanced',
    category: 'Economics'
  }
]

export default function Home() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [topics, setTopics] = useState<DebateTopic[]>(SAMPLE_TOPICS)
  const [showCreate, setShowCreate] = useState(false)
  const [newTopic, setNewTopic] = useState<{ title: string; description: string; difficulty: 'beginner' | 'intermediate' | 'advanced'; category: string }>({
    title: '',
    description: '',
    difficulty: 'beginner',
    category: 'General'
  })
  const [formError, setFormError] = useState<string | null>(null)

  // Load and persist custom topics
  useEffect(() => {
    try {
      const stored = localStorage.getItem('debatemate_custom_topics')
      if (stored) {
        const custom = JSON.parse(stored) as DebateTopic[]
        if (Array.isArray(custom)) {
          setTopics([...SAMPLE_TOPICS, ...custom])
        }
      }
    } catch { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Persist only topics beyond SAMPLE_TOPICS by id range
    const custom = topics.filter(t => Number(t.id) > 1000)
    localStorage.setItem('debatemate_custom_topics', JSON.stringify(custom))
  }, [topics])

  const filteredTopics = topics.filter(topic => {
    const difficultyMatch = selectedDifficulty === 'all' || topic.difficulty === selectedDifficulty
    const categoryMatch = selectedCategory === 'all' || topic.category === selectedCategory
    return difficultyMatch && categoryMatch
  })

  const categories = ['all', ...Array.from(new Set(topics.map(t => t.category)))]

  const createTopic = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    if (!newTopic.title.trim() || !newTopic.description.trim()) {
      setFormError('Please provide both a title and description.')
      return
    }
    const nextId = (Date.now()).toString() // Ensure id > 1000 for persistence filter
    const topic: DebateTopic = { id: nextId, ...newTopic }
    setTopics(prev => [topic, ...prev])
    setShowCreate(false)
    setNewTopic({ title: '', description: '', difficulty: 'beginner', category: 'General' })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center text-gray-900 mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-6 shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              DebateMate
            </h1>
            <p className="text-2xl text-gray-700 mb-4">Master Critical Thinking Through AI-Powered Debates</p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Challenge yourself with intelligent AI opponents, receive real-time feedback, and develop your argumentation skills in a safe, educational environment.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center text-gray-800">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Opponents</h3>
            <p className="text-gray-600">Debate against intelligent AI that adapts to your skill level and provides challenging counter-arguments.</p>
          </div>
          <div className="text-center text-gray-800">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <Award className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-Time Feedback</h3>
            <p className="text-gray-600">Get instant analysis of your arguments with scores for persuasiveness, clarity, and logical reasoning.</p>
          </div>
          <div className="text-center text-gray-800">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Skill Development</h3>
            <p className="text-gray-600">Track your progress, review debate history, and improve your critical thinking skills over time.</p>
          </div>
        </div>
      </div>

      {/* Topic Selection */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Choose Your Debate Topic</h2>

          {/* Create Topic CTA */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowCreate(true)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              + Create Topic
            </button>
          </div>

          {/* Create Topic Modal */}
          {showCreate && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-2xl border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Create a New Debate Topic</h3>
                <form onSubmit={createTopic} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={newTopic.title}
                      onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Should governments ban single-use plastics?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newTopic.description}
                      onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Briefly describe the debate angle and what to consider."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                      <select
                        value={newTopic.difficulty}
                        onChange={(e) => setNewTopic({ ...newTopic, difficulty: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <input
                        type="text"
                        value={newTopic.category}
                        onChange={(e) => setNewTopic({ ...newTopic, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Environment, Technology, Ethics"
                      />
                    </div>
                  </div>

                  {formError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                      {formError}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => { setShowCreate(false); setFormError(null) }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                    >
                      Save Topic
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 text-sm font-medium">Difficulty:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 text-sm font-medium">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => (
              <div key={topic.id} className="group bg-gray-50 rounded-xl p-6 border border-gray-200 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all duration-300 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${topic.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                    topic.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                    {topic.difficulty}
                  </span>
                  <span className="text-gray-500 text-xs">{topic.category}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {topic.title}
                </h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed flex-grow">
                  {topic.description}
                </p>
                <div className="flex space-x-3 mt-auto">
                  <Link
                    href={`/debate/${topic.id}?stance=pro`}
                    className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2 shadow-sm"
                  >
                    <span>Argue PRO</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/debate/${topic.id}?stance=con`}
                    className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2 shadow-sm"
                  >
                    <span>Argue CON</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredTopics.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No topics match your current filters. Try adjusting the difficulty or category.</p>
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Choose Topic & Stance</h3>
              <p className="text-gray-600">Pick a debate topic that interests you and decide whether to argue for or against the proposition.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                <MessageSquare className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Debate with AI</h3>
              <p className="text-gray-600">Engage in a structured debate with our AI opponent that provides intelligent counter-arguments.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Trophy className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Get Feedback</h3>
              <p className="text-gray-600">Receive instant feedback on your arguments and track your improvement over time.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}