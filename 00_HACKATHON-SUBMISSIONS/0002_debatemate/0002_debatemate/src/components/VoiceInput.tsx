'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react'

interface VoiceInputProps {
    onTranscript: (text: string) => void
    disabled?: boolean
    placeholder?: string
}

export default function VoiceInput({ onTranscript, disabled = false, placeholder = "Click to start speaking..." }: VoiceInputProps) {
    const [isListening, setIsListening] = useState(false)
    const [isSupported, setIsSupported] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isMuted, setIsMuted] = useState(false)
    const [isSecure, setIsSecure] = useState(false)
    const [micGranted, setMicGranted] = useState<boolean | null>(null)

    const recognitionRef = useRef<SpeechRecognition | null>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        // Check if speech recognition is supported and context is secure
        if (typeof window !== 'undefined') {
            setIsSecure(window.isSecureContext)
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            if (SpeechRecognition) {
                setIsSupported(true)
                recognitionRef.current = new SpeechRecognition()

                // Configure speech recognition
                recognitionRef.current.continuous = true
                recognitionRef.current.interimResults = true
                recognitionRef.current.lang = 'en-US'
                recognitionRef.current.maxAlternatives = 1

                // Handle speech recognition results
                recognitionRef.current.onresult = (event) => {
                    let finalTranscript = ''
                    let interimTranscript = ''

                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcript = event.results[i][0].transcript
                        if (event.results[i].isFinal) {
                            finalTranscript += transcript
                        } else {
                            interimTranscript += transcript
                        }
                    }

                    const fullTranscript = finalTranscript + interimTranscript
                    setTranscript(fullTranscript)

                    // Auto-submit when we have a final result and it's substantial
                    if (finalTranscript.trim().length > 10) {
                        onTranscript(finalTranscript.trim())
                        setTranscript('')
                        stopListening()
                    }
                }

                // Handle speech recognition errors
                recognitionRef.current.onerror = (event: unknown) => {
                    const errType = (event as { error?: string })?.error ?? 'unknown'
                    let message = `Speech recognition error: ${errType}`
                    if (errType === 'audio-capture') {
                        message = 'Microphone not available or permission denied. Please allow microphone access and ensure a working mic is connected.'
                        setMicGranted(false)
                    } else if (errType === 'not-allowed') {
                        message = 'Microphone permission blocked. Click the lock icon in the address bar to allow microphone access.'
                        setMicGranted(false)
                    } else if (errType === 'no-speech') {
                        message = 'No speech detected. Try speaking closer to the microphone.'
                    } else if (errType === 'aborted') {
                        message = 'Voice input aborted. Please try again.'
                    }
                    console.error('Speech recognition error:', errType)
                    setError(message)
                    setIsListening(false)
                }

                // Handle speech recognition end
                recognitionRef.current.onend = () => {
                    setIsListening(false)
                }

                // Handle speech recognition start
                recognitionRef.current.onstart = () => {
                    setError(null)
                    setIsListening(true)
                }
            }
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [onTranscript])

    const requestMicAccess = async () => {
        try {
            if (!navigator.mediaDevices?.getUserMedia) {
                setError('Microphone API not available in this browser.')
                setMicGranted(false)
                return false
            }
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            stream.getTracks().forEach(t => t.stop())
            setMicGranted(true)
            setError(null)
            return true
        } catch (e) {
            setMicGranted(false)
            setError('Please allow microphone access to use voice input.')
            return false
        }
    }

    const startListening = () => {
        if (!recognitionRef.current || isListening || disabled) return

        setError(null)
        setTranscript('')

        const doStart = async () => {
            if (micGranted !== true) {
                const ok = await requestMicAccess()
                if (!ok) return
            }
            try {
                recognitionRef.current!.start()
                timeoutRef.current = setTimeout(() => {
                    stopListening()
                }, 30000)
            } catch (err) {
                console.error('Error starting speech recognition:', err)
                setError('Failed to start voice input. Please try again.')
            }
        }
        doStart()
    }

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            try {
                recognitionRef.current.stop()
            } catch (err) {
                console.error('Error stopping speech recognition:', err)
            }
        }

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
    }

    const toggleListening = () => {
        if (isListening) {
            stopListening()
        } else {
            startListening()
        }
    }

    const clearTranscript = () => {
        setTranscript('')
        setError(null)
    }

    if (!isSupported) {
        return (
            <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <VolumeX className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                <p className="text-sm text-yellow-700">
                    Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {!isSecure && (
                <div className="text-center p-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-700 text-xs">
                    Voice input requires a secure context. Please use HTTPS or localhost.
                </div>
            )}
            {/* Voice Input Button */}
            <div className="flex items-center justify-center">
                <button
                    onClick={toggleListening}
                    disabled={disabled}
                    className={`relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-200 ${isListening
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                        : 'bg-blue-500 hover:bg-blue-600'
                        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} shadow-lg`}
                >
                    {isListening ? (
                        <MicOff className="w-6 h-6 text-white" />
                    ) : (
                        <Mic className="w-6 h-6 text-white" />
                    )}

                    {/* Recording indicator */}
                    {isListening && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                    )}
                </button>
            </div>

            {/* Status and Controls */}
            <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-4">
                    <span className={`text-sm font-medium ${isListening ? 'text-red-600' : 'text-gray-600'
                        }`}>
                        {isListening ? 'Listening...' : 'Click to speak'}
                    </span>

                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-1 rounded-full transition-colors ${isMuted ? 'bg-gray-200 text-gray-600' : 'bg-blue-100 text-blue-600'
                            }`}
                        title={isMuted ? 'Unmute' : 'Mute'}
                    >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                </div>

                {/* Live Transcript */}
                {transcript && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                            <span className="text-xs font-medium text-blue-700">Live Transcript:</span>
                            <button
                                onClick={clearTranscript}
                                className="text-blue-500 hover:text-blue-700 text-xs"
                            >
                                Clear
                            </button>
                        </div>
                        <p className="text-sm text-blue-800 leading-relaxed">
                            {transcript}
                        </p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-700">{error}</p>
                        <div className="mt-2 flex items-center justify-center gap-2">
                            <button
                                onClick={requestMicAccess}
                                className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded"
                            >
                                Request Microphone Access
                            </button>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="text-red-500 hover:text-red-700 text-xs mt-1"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Instructions */}
                <div className="text-xs text-gray-500 space-y-1">
                    <p>• Speak clearly in English</p>
                    <p>• Auto-submits when you pause</p>
                    <p>• Click the mic to start/stop</p>
                </div>
            </div>
        </div>
    )
}

// Extend Window interface for TypeScript
declare global {
    interface Window {
        SpeechRecognition: typeof SpeechRecognition
        webkitSpeechRecognition: typeof SpeechRecognition
    }
}
