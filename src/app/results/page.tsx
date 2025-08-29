
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Trophy, Award, TrendingUp, Brain, ArrowRight, Home, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { useUser } from '@/contexts/UserContext'

interface DebateResults {
    topic: string
    userStance: string
    userScore: number
    aiScore: number
    finalMetrics: {
        persuasiveness: number
        clarity: number
        logic: number
    }
    totalRounds: number
    duration: string
}

export default function ResultsPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { user, debateHistory, ensureUser, saveDebate } = useUser()
    const [results, setResults] = useState<DebateResults | null>(null)

    useEffect(() => {
        const run = async () => {
            // Prefer explicit query params if present (e.g., after finishing a debate)
            const qpTopic = searchParams.get('topic')
            const qpStance = searchParams.get('stance')
            const qpUserScore = searchParams.get('userScore')
            const qpAiScore = searchParams.get('aiScore')
            const qpPers = searchParams.get('persuasiveness')
            const qpClar = searchParams.get('clarity')
            const qpLogic = searchParams.get('logic')
            const qpRounds = searchParams.get('rounds')
            const qpDuration = searchParams.get('duration')

            if (qpTopic && qpStance && qpUserScore && qpAiScore && qpPers && qpClar && qpLogic && qpRounds && qpDuration) {
                const fromQuery: DebateResults = {
                    topic: qpTopic,
                    userStance: qpStance,
                    userScore: parseInt(qpUserScore),
                    aiScore: parseInt(qpAiScore),
                    finalMetrics: {
                        persuasiveness: parseInt(qpPers),
                        clarity: parseInt(qpClar),
                        logic: parseInt(qpLogic)
                    },
                    totalRounds: parseInt(qpRounds),
                    duration: qpDuration
                }
                setResults(fromQuery)
                // Persist this debate to history if not already saved
                const uid = ensureUser()
                await saveDebate({
                    topic: fromQuery.topic,
                    userStance: fromQuery.userStance as any,
                    messages: [],
                    rounds: fromQuery.totalRounds,
                    finalMetrics: fromQuery.finalMetrics,
                    userScore: fromQuery.userScore,
                    aiScore: fromQuery.aiScore,
                    duration: fromQuery.duration
                })
                return
            }

            // Otherwise, load the latest saved debate from this account
            if (user && debateHistory.length > 0) {
                const latest = debateHistory[0]
                const fromHistory: DebateResults = {
                    topic: latest.topic,
                    userStance: latest.userStance,
                    userScore: latest.userScore,
                    aiScore: latest.aiScore,
                    finalMetrics: {
                        persuasiveness: latest.finalMetrics.persuasiveness,
                        clarity: latest.finalMetrics.clarity,
                        logic: latest.finalMetrics.logic
                    },
                    totalRounds: latest.messages.length,
                    duration: latest.duration
                }
                setResults(fromHistory)
                return
            }

            // Fallback when no data
            setResults(null)
        }
        void run()
    }, [searchParams, user, debateHistory, ensureUser, saveDebate])

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 mb-4">Please sign in to view your results.</p>
                    <Link href="/" className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">Go to Home</Link>
                </div>
            </div>
        )
    }

    if (!results) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">No results available yet. Complete a debate to see your analysis.</p>
                </div>
            </div>
        )
    }

    const overallScore = Math.round((results.finalMetrics.persuasiveness + results.finalMetrics.clarity + results.finalMetrics.logic) / 3)
    const isWinner = results.userScore > results.aiScore
    const isTie = results.userScore === results.aiScore

    const getPerformanceLevel = (score: number) => {
        if (score >= 8) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' }
        if (score >= 6) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' }
        if (score >= 4) return { level: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' }
        return { level: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-100' }
    }

    const performance = getPerformanceLevel(overallScore)

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-6 shadow-lg">
                        <Trophy className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Debate Results</h1>
                    <p className="text-lg text-gray-600">Great job completing your debate!</p>
                </div>

                {/* Results Summary */}
                <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg border border-gray-200">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{results.topic}</h2>
                        <p className="text-gray-600">You argued the <span className="font-semibold text-blue-600">{results.userStance.toUpperCase()}</span> position</p>
                    </div>

                    {/* Score Display */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-green-600 mb-2">{results.userScore}</div>
                            <div className="text-gray-600">Your Score</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-gray-400 mb-2">vs</div>
                            <div className="text-gray-600">Final Result</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-red-600 mb-2">{results.aiScore}</div>
                            <div className="text-gray-600">AI Score</div>
                        </div>
                    </div>

                    {/* Winner Announcement */}
                    <div className={`text-center p-6 rounded-xl mb-8 ${isWinner ? 'bg-green-50 border border-green-200' :
                        isTie ? 'bg-yellow-50 border border-yellow-200' :
                            'bg-red-50 border border-red-200'
                        }`}>
                        {isWinner ? (
                            <div className="flex items-center justify-center space-x-3">
                                <Trophy className="w-8 h-8 text-green-600" />
                                <div>
                                    <h3 className="text-2xl font-bold text-green-600">Congratulations!</h3>
                                    <p className="text-green-700">You won the debate!</p>
                                </div>
                            </div>
                        ) : isTie ? (
                            <div className="flex items-center justify-center space-x-3">
                                <Award className="w-8 h-8 text-yellow-600" />
                                <div>
                                    <h3 className="text-2xl font-bold text-yellow-600">It's a Tie!</h3>
                                    <p className="text-yellow-700">Great debate from both sides!</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center space-x-3">
                                <Brain className="w-8 h-8 text-red-600" />
                                <div>
                                    <h3 className="text-2xl font-bold text-red-600">Good Effort!</h3>
                                    <p className="text-red-700">Keep practicing to improve your skills!</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* Overall Performance */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                            Overall Performance
                        </h3>
                        <div className="text-center">
                            <div className="text-5xl font-bold text-gray-900 mb-2">{overallScore}</div>
                            <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${performance.bg} ${performance.color}`}>
                                {performance.level}
                            </div>
                        </div>
                    </div>

                    {/* Detailed Metrics */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Detailed Metrics</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-700">Persuasiveness</span>
                                    <span className="text-gray-900 font-semibold">{results.finalMetrics.persuasiveness}/10</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${(results.finalMetrics.persuasiveness / 10) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-700">Clarity</span>
                                    <span className="text-gray-900 font-semibold">{results.finalMetrics.clarity}/10</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${(results.finalMetrics.clarity / 10) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-700">Logic</span>
                                    <span className="text-gray-900 font-semibold">{results.finalMetrics.logic}/10</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${(results.finalMetrics.logic / 10) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Debate Stats */}
                <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Debate Statistics</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">{results.totalRounds}</div>
                            <div className="text-gray-600">Total Rounds</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-indigo-600 mb-2">{results.duration}</div>
                            <div className="text-gray-600">Duration</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-2">{overallScore}</div>
                            <div className="text-gray-600">Average Score</div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
                    >
                        <Home className="w-5 h-5" />
                        <span>Back to Home</span>
                    </Link>
                    <button
                        onClick={() => router.back()}
                        className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2 border border-gray-300"
                    >
                        <RotateCcw className="w-5 h-5" />
                        <span>Try Another Topic</span>
                    </button>
                </div>
            </div>
        </main>
    )
}
