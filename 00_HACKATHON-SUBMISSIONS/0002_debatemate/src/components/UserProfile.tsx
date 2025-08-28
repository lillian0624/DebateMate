'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, LogOut, Settings, Trophy, TrendingUp, Calendar, Award } from 'lucide-react'
import { useUser } from '@/contexts/UserContext'

export default function UserProfile() {
    const { user, logout, debateHistory } = useUser()
    const router = useRouter()
    const [showDropdown, setShowDropdown] = useState(false)

    if (!user) return null

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const getPerformanceLevel = (score: number) => {
        if (score >= 8) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' }
        if (score >= 6) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' }
        if (score >= 4) return { level: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' }
        return { level: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-100' }
    }

    const totalDebates = debateHistory.length
    const totalRounds = debateHistory.reduce((sum, d) => sum + (typeof d.rounds === 'number' ? d.rounds : d.messages.length), 0)
    const avgAiScore = totalDebates > 0
        ? Math.round((debateHistory.reduce((sum, d) => sum + d.aiScore, 0) / totalDebates) * 10) / 10
        : 0
    const performance = getPerformanceLevel(
        totalDebates > 0
            ? Math.round((debateHistory.reduce((sum, d) => sum + ((d.finalMetrics.persuasiveness + d.finalMetrics.clarity + d.finalMetrics.logic) / 3), 0) / totalDebates) * 10) / 10
            : 0
    )

    return (
        <div className="relative">
            {/* Profile Button */}
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{user.username}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                </div>
            </button>

            {/* Dropdown */}
            {showDropdown && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-20">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{user.username}</h3>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                    <p className="text-xs text-gray-500">Joined {formatDate(user.createdAt)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="p-6 border-b border-gray-200">
                            <h4 className="text-sm font-medium text-gray-900 mb-4">Your Performance</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{totalRounds}</div>
                                    <div className="text-xs text-gray-600">Chat Rounds</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-indigo-600">{avgAiScore}</div>
                                    <div className="text-xs text-gray-600">Avg AI Score</div>
                                </div>
                            </div>

                            {avgAiScore > 0 && (
                                <div className="mt-4">
                                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${performance.bg} ${performance.color}`}>
                                        {performance.level}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="p-4">
                            <div className="space-y-2">
                                <button
                                    onClick={() => { setShowDropdown(false); router.push('/history') }}
                                    className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                                    <Trophy className="w-4 h-4 text-yellow-600" />
                                    <span className="text-sm text-gray-700">View Debate History</span>
                                </button>
                                <button
                                    onClick={() => { setShowDropdown(false); router.push('/analytics') }}
                                    className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    <span className="text-sm text-gray-700">Performance Analytics</span>
                                </button>
                                <button
                                    onClick={() => { setShowDropdown(false); router.push('/results') }}
                                    className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                                    <Award className="w-4 h-4 text-purple-600" />
                                    <span className="text-sm text-gray-700">Analysis</span>
                                </button>
                                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                                    <Settings className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm text-gray-700">Settings</span>
                                </button>
                                <hr className="my-2" />
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center space-x-3 p-3 text-left hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <LogOut className="w-4 h-4 text-red-600" />
                                    <span className="text-sm text-red-700">Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
