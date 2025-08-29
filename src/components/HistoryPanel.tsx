'use client'

import { History, Clock, MessageSquare, User, Bot } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  type?: 'argument' | 'rebuttal' | 'feedback'
  timestamp: Date
}

interface HistoryPanelProps {
  messages: Message[]
}

export default function HistoryPanel({ messages }: HistoryPanelProps) {
  // Get last 10 debate turns (excluding the initial welcome message)
  const debateTurns = messages
    .filter(msg => msg.role === 'user' || (msg.role === 'assistant' && msg.content !== messages[0]?.content))
    .slice(-10)

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getMessagePreview = (content: string) => {
    if (content.length <= 80) return content
    return content.substring(0, 80) + '...'
  }

  const getTurnNumber = (index: number) => {
    return debateTurns.length - index
  }

  return (
    <div className="bg-white rounded-2xl p-6 h-full border border-gray-200 shadow-lg">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-200">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
          <History className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Debate History</h2>
          <p className="text-sm text-gray-600">Recent argument exchanges</p>
        </div>
      </div>
      
      <div className="space-y-3 max-h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {debateTurns.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-lg font-medium mb-2 text-gray-700">No Debate History</p>
            <p className="text-sm text-gray-600">Start your first argument to see the history here.</p>
          </div>
        ) : (
          debateTurns.map((message, index) => (
            <div key={index} className="group bg-gray-50 rounded-xl p-4 border border-gray-200 hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                      : 'bg-gradient-to-r from-indigo-500 to-indigo-600'
                  }`}>
                    {message.role === 'user' ? <User size={12} className="text-white" /> : <Bot size={12} className="text-white" />}
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    message.role === 'user' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {message.role === 'user' ? 'You' : 'AI'}
                  </span>
                  <span className="text-gray-500 text-xs">Turn {getTurnNumber(index)}</span>
                </div>
                <span className="text-gray-500 text-xs">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              
              <div className="space-y-2">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {getMessagePreview(message.content)}
                </p>
                
                <div className="flex items-center justify-between">
                  {message.type && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      message.role === 'user' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {message.type}
                    </span>
                  )}
                  <div className="flex items-center space-x-1 text-gray-500">
                    <MessageSquare className="w-3 h-3" />
                    <span className="text-xs">{message.content.length} chars</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {debateTurns.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-gray-600 text-sm">
            <span>Showing last {debateTurns.length} turns</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>You</span>
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span>AI</span>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
              <div className="text-lg font-bold text-blue-600">
                {debateTurns.filter(m => m.role === 'user').length}
              </div>
              <div className="text-xs text-gray-600">Your Arguments</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
              <div className="text-lg font-bold text-indigo-600">
                {debateTurns.filter(m => m.role === 'assistant').length}
              </div>
              <div className="text-xs text-gray-600">AI Responses</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
