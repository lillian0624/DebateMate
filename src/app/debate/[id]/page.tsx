'use client'

import { useState, useEffect, use } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Sparkles, ArrowRight } from 'lucide-react'
import Chat from '@/components/Chat'
import MetricsPanel from '@/components/MetricsPanel'
import HistoryPanel from '@/components/HistoryPanel'
import { useUser } from '@/contexts/UserContext'

interface Message {
    role: 'user' | 'assistant'
    content: string
    type?: 'argument' | 'rebuttal' | 'feedback'
    timestamp: Date
}

interface DebateTopic {
    id: string
    title: string
    description: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    category: string
}

interface DebateMetrics {
    persuasiveness: number
    clarity: number
    logic: number
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

export default function DebatePage({ params }: { params: Promise<{ id: string }> }) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const stance = searchParams.get('stance') as 'pro' | 'con' | null
    const { saveDebate, ensureUser } = useUser()

    // Unwrap the params Promise using React.use()
    const resolvedParams = use(params)

    const [messages, setMessages] = useState<Message[]>([])
    const [selectedTopic, setSelectedTopic] = useState<DebateTopic | null>(null)
    const [userStance, setUserStance] = useState<'pro' | 'con' | null>(null)
    const [currentMetrics, setCurrentMetrics] = useState<DebateMetrics>({
        persuasiveness: 0,
        clarity: 0,
        logic: 0
    })
    const [isLoading, setIsLoading] = useState(false)
    const [userScore, setUserScore] = useState(0)
    const [aiScore, setAiScore] = useState(0)

    useEffect(() => {
        // Find the topic by ID (support custom topics from localStorage)
        let topic = SAMPLE_TOPICS.find(t => t.id === resolvedParams.id)
        if (!topic && typeof window !== 'undefined') {
            try {
                const stored = localStorage.getItem('debatemate_custom_topics')
                if (stored) {
                    const custom = JSON.parse(stored) as DebateTopic[]
                    topic = custom.find(t => t.id === resolvedParams.id) || null as any
                }
            } catch { }
        }
        if (!topic) {
            router.push('/')
            return
        }

        if (!stance || (stance !== 'pro' && stance !== 'con')) {
            router.push('/')
            return
        }

        setSelectedTopic(topic)
        setUserStance(stance)

        // Ensure there is a user (create a guest if needed) so we can save history
        ensureUser()

        // Add initial debate context
        const initialMessage: Message = {
            role: 'assistant',
            content: `Welcome to your debate on "${topic.title}"! 🏛️\n\nYou're arguing the ${stance === 'pro' ? 'PRO' : 'CON'} position, and I'll be your opponent arguing the ${stance === 'pro' ? 'CON' : 'PRO'} position.\n\nLet's begin! Make your opening argument below.`,
            type: 'argument',
            timestamp: new Date()
        }
        setMessages([initialMessage])
    }, [resolvedParams.id, stance, router])

    const sendMessage = async (userInput: string) => {
        if (!userInput.trim() || !selectedTopic || !userStance) return

        const userMessage: Message = {
            role: 'user',
            content: userInput,
            type: 'argument',
            timestamp: new Date()
        }
        setMessages(prev => [...prev, userMessage])
        setIsLoading(true)

        try {
            const response = await fetch('/api/debate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userMessage: userInput,
                    topic: selectedTopic.title,
                    userStance: userStance,
                    aiStance: userStance === 'pro' ? 'con' : 'pro'
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to get response')
            }

            const data = await response.json()

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.counterArgument,
                type: 'argument',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, assistantMessage])

            // Update metrics
            if (data.metrics) {
                setCurrentMetrics(data.metrics)
            }

            // Update scores
            if (data.score) {
                setUserScore(prev => prev + data.score.user)
                setAiScore(prev => prev + data.score.ai)
            }

        } catch (error) {
            console.error('Error sending message:', error)
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, there was an error processing your argument. Please try again.',
                type: 'argument',
                timestamp: new Date()
            }])
        } finally {
            setIsLoading(false)
        }
    }

    const resetDebate = () => {
        router.push('/')
    }

    const saveCurrentDebate = async () => {
        if (!selectedTopic || !userStance || messages.length <= 1) return

        const debateData = {
            topic: selectedTopic.title,
            userStance,
            messages: messages.slice(1), // Exclude the initial welcome message
            rounds: messages.length - 1,
            finalMetrics: currentMetrics,
            userScore,
            aiScore,
            duration: '12:34' // TODO: Calculate actual duration
        }

        // Ensure we have a user, then persist debate
        const uid = ensureUser()
        await saveDebate(debateData)
    }

    if (!selectedTopic || !userStance) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading debate...</p>
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 py-6 min-h-screen flex flex-col">
                {/* Enhanced Header */}
                <div className="bg-white rounded-xl p-6 mb-6 shadow-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">DebateMate</h1>
                                    <p className="text-sm text-gray-600">
                                        Topic: {selectedTopic.title} | Your stance: {userStance.toUpperCase()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">You: {userScore}</div>
                                    <div className="text-xs text-gray-500">Score</div>
                                </div>
                                <div className="text-2xl text-gray-400">vs</div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-red-600">AI: {aiScore}</div>
                                    <div className="text-xs text-gray-500">Score</div>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={async () => {
                                        await saveCurrentDebate()
                                        router.push(`/results?topic=${encodeURIComponent(selectedTopic.title)}&stance=${userStance}&userScore=${userScore}&aiScore=${aiScore}&persuasiveness=${currentMetrics.persuasiveness}&clarity=${currentMetrics.clarity}&logic=${currentMetrics.logic}&rounds=${messages.length}&duration=12:34`)
                                    }}
                                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                                >
                                    <span>View Results</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={resetDebate}
                                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-gray-700 transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                                >
                                    <span>New Debate</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Chat Area */}
                    <div className="lg:col-span-2">
                        <Chat
                            messages={messages}
                            onSendMessage={sendMessage}
                            isLoading={isLoading}
                            placeholder="Enter your opening argument..."
                        />
                    </div>

                    {/* Metrics Panel */}
                    <div className="lg:col-span-1">
                        <MetricsPanel metrics={currentMetrics} />
                    </div>

                    {/* History Panel */}
                    <div className="lg:col-span-1">
                        <HistoryPanel messages={messages} />
                    </div>
                </div>
            </div>
        </main>
    )
}
