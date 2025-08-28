'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, Home, Trophy, History, LogIn } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import UserProfile from './UserProfile'
import AuthModal from './AuthModal'

export default function Navigation() {
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)
    const [showAuthModal, setShowAuthModal] = useState(false)
    const { isAuthenticated } = useUser()

    useEffect(() => {
        setMounted(true)
    }, [])

    const isActive = (path: string) => {
        return pathname === path
    }

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">DebateMate</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-8">
                        <Link
                            href="/"
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${mounted && isActive('/')
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                        >
                            <Home className="w-4 h-4" />
                            <span>Home</span>
                        </Link>

                        {isAuthenticated && (
                            <Link
                                href="/history"
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${mounted && isActive('/history')
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                <History className="w-4 h-4" />
                                <span>History</span>
                            </Link>
                        )}

                        <Link
                            href="/results"
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${mounted && isActive('/results')
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                        >
                            <Trophy className="w-4 h-4" />
                            <span>Results</span>
                        </Link>
                    </div>

                    {/* User Section */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <UserProfile />
                        ) : (
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                            >
                                <LogIn className="w-4 h-4" />
                                <span>Sign In</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
            />
        </nav>
    )
}
