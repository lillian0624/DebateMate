'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    History,
    Calendar,
    Trophy,
    TrendingUp,
    MessageSquare,
    Clock,
    Trash2,
    Eye,
    ArrowLeft,
    Filter,
    Search
} from 'lucide-react'
import { useUser } from '@/contexts/UserContext'

export default function HistoryPage() {
    const { debateHistory, deleteDebate, user } = useUser()
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStance, setFilterStance] = useState<'all' | 'pro' | 'con'>('all')
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'score'>('newest')

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <History className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
                    <p className="text-gray-600 mb-6">Please sign in to view your debate history.</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        )
    }

    // Filter and sort debates
    const filteredDebates = debateHistory
        .filter(debate => {
            const matchesSearch = debate.topic.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesStance = filterStance === 'all' || debate.userStance === filterStance
            return matchesSearch && matchesStance
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                case 'oldest':
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                case 'score':
                    const scoreA = (a.finalMetrics.persuasiveness + a.finalMetrics.clarity + a.finalMetrics.logic) / 3
                    const scoreB = (b.finalMetrics.persuasiveness + b.finalMetrics.clarity + b.finalMetrics.logic) / 3
                    return scoreB - scoreA
                default:
                    return 0
            }
        })

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getOverallScore = (metrics: any) => {
        return Math.round(((metrics.persuasiveness + metrics.clarity + metrics.logic) / 3) * 10) / 10
    }

    const getScoreColor = (score: number) => {
        if (score >= 8) return 'text-green-600 bg-green-100'
        if (score >= 6) return 'text-blue-600 bg-blue-100'
        if (score >= 4) return 'text-yellow-600 bg-yellow-100'
        return 'text-red-600 bg-red-100'
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => router.push('/')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Debate History</h1>
                            <p className="text-gray-600">Review your past debates and track your progress</p>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <History className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{debateHistory.length}</div>
                                <div className="text-sm text-gray-600">Total Debates</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <Trophy className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{user.averageScore}</div>
                                <div className="text-sm text-gray-600">Avg Score</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {debateHistory.filter(d => d.userScore > d.aiScore).length}
                                </div>
                                <div className="text-sm text-gray-600">Wins</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {debateHistory.reduce((sum, d) => sum + d.messages.length, 0)}
                                </div>
                                <div className="text-sm text-gray-600">Total Messages</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-8">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center space-x-2">
                            <Search className="w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search debates..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <select
                                value={filterStance}
                                onChange={(e) => setFilterStance(e.target.value as any)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Stances</option>
                                <option value="pro">PRO</option>
                                <option value="con">CON</option>
                            </select>
                        </div>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="score">Highest Score</option>
                        </select>
                    </div>
                </div>

                {/* Debate List */}
                <div className="space-y-4">
                    {filteredDebates.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 shadow-lg border border-gray-200 text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <History className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Debates Found</h3>
                            <p className="text-gray-600 mb-6">
                                {debateHistory.length === 0
                                    ? "You haven't completed any debates yet. Start your first debate!"
                                    : "No debates match your current filters."
                                }
                            </p>
                            <button
                                onClick={() => router.push('/')}
                                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                            >
                                Start New Debate
                            </button>
                        </div>
                    ) : (
                        filteredDebates.map((debate) => {
                            const overallScore = getOverallScore(debate.finalMetrics)
                            const scoreColor = getScoreColor(overallScore)

                            return (
                                <div key={debate.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-3">
                                                <h3 className="text-lg font-semibold text-gray-900">{debate.topic}</h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${debate.userStance === 'pro'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {debate.userStance.toUpperCase()}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${scoreColor}`}>
                                                    {overallScore}/10
                                                </span>
                                            </div>

                                            <div className="grid md:grid-cols-4 gap-4 mb-4">
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{formatDate(debate.createdAt)}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{debate.duration}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <MessageSquare className="w-4 h-4" />
                                                    <span>{debate.messages.length} messages</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <Trophy className="w-4 h-4" />
                                                    <span>You: {debate.userScore} vs AI: {debate.aiScore}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-4">
                                                <div className="text-sm">
                                                    <span className="text-gray-600">Persuasiveness: </span>
                                                    <span className="font-medium">{debate.finalMetrics.persuasiveness}/10</span>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="text-gray-600">Clarity: </span>
                                                    <span className="font-medium">{debate.finalMetrics.clarity}/10</span>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="text-gray-600">Logic: </span>
                                                    <span className="font-medium">{debate.finalMetrics.logic}/10</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2 ml-4">
                                            <button
                                                onClick={() => {
                                                    // TODO: Implement view debate functionality
                                                    console.log('View debate:', debate.id)
                                                }}
                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                title="View Debate"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this debate?')) {
                                                        deleteDebate(debate.id)
                                                    }
                                                }}
                                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                title="Delete Debate"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </main>
    )
}
