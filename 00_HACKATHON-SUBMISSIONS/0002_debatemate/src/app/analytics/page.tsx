'use client'

import { useMemo } from 'react'
import { useUser } from '@/contexts/UserContext'
import { TrendingUp, Trophy, BarChart3, Gauge, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AnalyticsPage() {
    const { debateHistory, user } = useUser()
    const router = useRouter()

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
                    <p className="text-gray-600 mb-6">Please sign in to view your analytics.</p>
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

    const stats = useMemo(() => {
        const total = debateHistory.length
        const wins = debateHistory.filter(d => d.userScore > d.aiScore).length
        const winRate = total ? Math.round((wins / total) * 100) : 0
        const totalMsgs = debateHistory.reduce((s, d) => s + d.messages.length, 0)
        const avgRounds = total ? Math.round((totalMsgs / total) * 10) / 10 : 0
        const avgPers = total ? Math.round((debateHistory.reduce((s, d) => s + d.finalMetrics.persuasiveness, 0) / total) * 10) / 10 : 0
        const avgClar = total ? Math.round((debateHistory.reduce((s, d) => s + d.finalMetrics.clarity, 0) / total) * 10) / 10 : 0
        const avgLogic = total ? Math.round((debateHistory.reduce((s, d) => s + d.finalMetrics.logic, 0) / total) * 10) / 10 : 0
        const avgOverall = total ? Math.round(((avgPers + avgClar + avgLogic) / 3) * 10) / 10 : 0
        return { total, wins, winRate, avgRounds, avgPers, avgClar, avgLogic, avgOverall }
    }, [debateHistory])

    const bar = (val: number, color: string) => (
        <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={`${color} h-2 rounded-full`} style={{ width: `${(val / 10) * 100}%` }} />
        </div>
    )

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
                    <p className="text-gray-600">Insights from your saved debates</p>
                </div>

                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
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
                                <div className="text-2xl font-bold text-gray-900">{stats.winRate}%</div>
                                <div className="text-sm text-gray-600">Win Rate</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <Clock className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{stats.avgRounds}</div>
                                <div className="text-sm text-gray-600">Avg Messages</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                <Gauge className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{stats.avgOverall}</div>
                                <div className="text-sm text-gray-600">Avg Overall</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Metric Averages</h2>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1"><span>Persuasiveness</span><span>{stats.avgPers}/10</span></div>
                            {bar(stats.avgPers, 'bg-blue-500')}
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1"><span>Clarity</span><span>{stats.avgClar}/10</span></div>
                            {bar(stats.avgClar, 'bg-yellow-500')}
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1"><span>Logic</span><span>{stats.avgLogic}/10</span></div>
                            {bar(stats.avgLogic, 'bg-green-500')}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}



