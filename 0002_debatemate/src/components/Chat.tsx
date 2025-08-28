'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, MessageCircle, Mic } from 'lucide-react'
import VoiceInput from './VoiceInput'

interface Message {
  role: 'user' | 'assistant'
  content: string
  type?: 'argument' | 'rebuttal' | 'feedback'
  timestamp: Date
}

interface ChatProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  isLoading: boolean
  placeholder?: string
}

export default function Chat({ messages, onSendMessage, isLoading, placeholder = "Type your message..." }: ChatProps) {
  const [input, setInput] = useState('')
  const [showVoiceInput, setShowVoiceInput] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim())
      setInput('')
    }
  }

  const handleVoiceTranscript = (transcript: string) => {
    setInput(transcript)
    setShowVoiceInput(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }

  useEffect(() => {
    autoResize()
  }, [input])

  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col h-full border border-gray-200 shadow-lg">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-200">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Debate Chat</h2>
          <p className="text-sm text-gray-600">Exchange arguments with your AI opponent</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-lg font-medium mb-2 text-gray-700">Ready to Debate!</p>
            <p className="text-sm text-gray-600">Make your opening argument below to begin the debate.</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${message.role === 'user'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                : 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white'
                }`}>
                {message.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={`flex-1 max-w-[85%] ${message.role === 'user' ? 'text-right' : ''
                }`}>
                <div className={`inline-block p-4 rounded-2xl shadow-sm ${message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900 border border-gray-200'
                  }`}>
                  <p className="whitespace-pre-wrap leading-relaxed text-left">{message.content}</p>
                </div>
                <div className={`flex items-center space-x-2 mt-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                  {message.type && (
                    <span className={`text-xs px-2 py-1 rounded-full ${message.role === 'user'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-indigo-100 text-indigo-700'
                      }`}>
                      {message.type}
                    </span>
                  )}
                  <span className={`text-xs ${message.role === 'user' ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="bg-gray-100 text-gray-900 p-4 rounded-2xl border border-gray-200">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">AI is thinking...</p>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Voice Input Toggle */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => setShowVoiceInput(!showVoiceInput)}
            disabled={isLoading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${showVoiceInput
              ? 'bg-blue-100 text-blue-700 border border-blue-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
          >
            <Mic size={16} />
            <span className="text-sm font-medium">
              {showVoiceInput ? 'Hide Voice Input' : 'Use Voice Input'}
            </span>
          </button>
        </div>

        {/* Voice Input Component */}
        {showVoiceInput && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
            <VoiceInput
              onTranscript={handleVoiceTranscript}
              disabled={isLoading}
              placeholder="Click to start speaking your argument..."
            />
          </div>
        )}

        {/* Text Input */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="w-full p-4 pr-12 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            rows={1}
            disabled={isLoading}
            style={{ minHeight: '60px', maxHeight: '120px' }}
          />
          <div className="absolute bottom-3 right-3 flex items-center space-x-2">
            <span className="text-xs text-gray-400">
              {input.length}/500
            </span>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-200 hover:scale-105 disabled:hover:scale-100 flex items-center justify-center"
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <p className="text-xs text-blue-700">
            💡 <strong>Tip:</strong> Use evidence, logical reasoning, and clear structure to make stronger arguments.
            Press Enter to send, Shift+Enter for new line. You can also use voice input for hands-free debating!
          </p>
        </div>
      </form>
    </div>
  )
}
