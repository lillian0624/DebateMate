'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
    id: string
    username: string
    email: string
    createdAt: string
    totalDebates: number
    averageScore: number
}

interface DebateHistory {
    id: string
    topic: string
    userStance: 'pro' | 'con'
    messages: Array<{
        role: 'user' | 'assistant'
        content: string
        type?: 'argument' | 'rebuttal' | 'feedback'
        timestamp: Date
    }>
    rounds?: number
    finalMetrics: {
        persuasiveness: number
        clarity: number
        logic: number
    }
    userScore: number
    aiScore: number
    duration: string
    createdAt: string
}

interface UserContextType {
    user: User | null
    isAuthenticated: boolean
    debateHistory: DebateHistory[]
    login: (username: string, email: string) => void
    ensureUser: () => string
    logout: () => void
    saveDebate: (debate: Omit<DebateHistory, 'id' | 'createdAt'>) => void
    deleteDebate: (debateId: string) => void
    updateUserStats: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [debateHistory, setDebateHistory] = useState<DebateHistory[]>([])
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // Load user data from localStorage on mount and hydrate history from server if available
    useEffect(() => {
        const savedUser = localStorage.getItem('debatemate_user')
        const savedHistory = localStorage.getItem('debatemate_history')

        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser)
                setUser(userData)
                setIsAuthenticated(true)
            } catch (error) {
                console.error('Error parsing user data:', error)
                localStorage.removeItem('debatemate_user')
            }
        }

        if (savedHistory) {
            try {
                const historyData = JSON.parse(savedHistory)
                setDebateHistory(historyData)
            } catch (error) {
                console.error('Error parsing history data:', error)
                localStorage.removeItem('debatemate_history')
            }
        }

        // Also attempt to fetch server-backed history for this user if we have one
        ; (async () => {
            try {
                const currentUser = savedUser ? JSON.parse(savedUser) as User : null
                if (currentUser?.id) {
                    const res = await fetch(`/api/debates?userId=${encodeURIComponent(currentUser.id)}`)
                    if (res.ok) {
                        const data = await res.json()
                        if (Array.isArray(data.debates)) {
                            setDebateHistory(data.debates)
                        }
                    }
                }
            } catch (e) {
                // Non-fatal: keep local copy
            }
        })()
    }, [])

    // Save user data to localStorage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('debatemate_user', JSON.stringify(user))
        } else {
            localStorage.removeItem('debatemate_user')
        }
    }, [user])

    // Save debate history to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('debatemate_history', JSON.stringify(debateHistory))
    }, [debateHistory])

    const login = (username: string, email: string) => {
        const newUser: User = {
            id: Date.now().toString(),
            username,
            email,
            createdAt: new Date().toISOString(),
            totalDebates: 0,
            averageScore: 0
        }
        setUser(newUser)
        setIsAuthenticated(true)
    }

    const ensureUser = () => {
        if (user) return user.id
        const guestName = `Guest_${Math.floor(Math.random() * 10000)}`
        const newUser: User = {
            id: Date.now().toString(),
            username: guestName,
            email: `${guestName.toLowerCase()}@local`,
            createdAt: new Date().toISOString(),
            totalDebates: 0,
            averageScore: 0
        }
        setUser(newUser)
        setIsAuthenticated(true)
        try { localStorage.setItem('debatemate_user', JSON.stringify(newUser)) } catch { }
        return newUser.id
    }

    const logout = () => {
        setUser(null)
        setIsAuthenticated(false)
        setDebateHistory([])
        localStorage.removeItem('debatemate_user')
        localStorage.removeItem('debatemate_history')
    }

    const saveDebate = async (debate: Omit<DebateHistory, 'id' | 'createdAt'>) => {
        const newDebate: DebateHistory = {
            ...debate,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        }

        setDebateHistory(prev => {
            const updated = [newDebate, ...prev]
            if (user) {
                const totalDebates = updated.length
                const totalScore = updated.reduce((sum, d) => {
                    const overall = (d.finalMetrics.persuasiveness + d.finalMetrics.clarity + d.finalMetrics.logic) / 3
                    return sum + overall
                }, 0)
                const averageScore = totalDebates > 0 ? Math.round((totalScore / totalDebates) * 10) / 10 : 0
                setUser(prevUser => prevUser ? { ...prevUser, totalDebates, averageScore } : prevUser)
            }
            return updated
        })

        // Persist to server (filesystem JSON) for durability per user
        try {
            // Try current state first, then fall back to localStorage snapshot
            let uid = user?.id
            if (!uid) {
                try {
                    const saved = localStorage.getItem('debatemate_user')
                    if (saved) uid = (JSON.parse(saved) as User).id
                } catch { }
            }
            if (uid) {
                await fetch('/api/debates', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: uid, debate: newDebate })
                })
                // After successful save, refresh from server to ensure consistency
                try {
                    const res = await fetch(`/api/debates?userId=${encodeURIComponent(uid)}`)
                    if (res.ok) {
                        const data = await res.json()
                        if (Array.isArray(data.debates)) {
                            setDebateHistory(data.debates)
                        }
                    }
                } catch { }
            }
        } catch (e) {
            console.error('Failed to persist debate to server:', e)
        }
    }

    const deleteDebate = (debateId: string) => {
        setDebateHistory(prev => prev.filter(debate => debate.id !== debateId))
        updateUserStats()
    }

    const updateUserStats = () => {
        if (!user) return

        const totalDebates = debateHistory.length
        const totalScore = debateHistory.reduce((sum, debate) => {
            const overallScore = (debate.finalMetrics.persuasiveness +
                debate.finalMetrics.clarity +
                debate.finalMetrics.logic) / 3
            return sum + overallScore
        }, 0)
        const averageScore = totalDebates > 0 ? totalScore / totalDebates : 0

        setUser(prev => prev ? {
            ...prev,
            totalDebates,
            averageScore: Math.round(averageScore * 10) / 10
        } : null)
    }

    // Recompute user stats whenever debate history changes (e.g., after server hydration)
    useEffect(() => {
        if (user) {
            updateUserStats()
        }
    }, [debateHistory])

    return (
        <UserContext.Provider value={{
            user,
            isAuthenticated,
            debateHistory,
            login,
            ensureUser,
            logout,
            saveDebate,
            deleteDebate,
            updateUserStats
        }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}
