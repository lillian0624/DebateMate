'use client'

import { Brain, Zap, Target, TrendingUp, Award, Lightbulb } from 'lucide-react'

interface DebateMetrics {
  persuasiveness: number
  clarity: number
  logic: number
}

interface MetricsPanelProps {
  metrics: DebateMetrics
}

export default function MetricsPanel({ metrics }: MetricsPanelProps) {
  const getClarityEmoji = (score: number) => {
    if (score < 3) return '😕'
    if (score < 7) return '🙂'
    return '🤩'
  }

  const getColorClass = (score: number) => {
    if (score < 3) return 'from-red-500 to-red-600'
    if (score < 7) return 'from-yellow-500 to-yellow-600'
    return 'from-green-500 to-green-600'
  }

  const getScoreLabel = (score: number) => {
    if (score < 3) return 'Needs Work'
    if (score < 5) return 'Fair'
    if (score < 7) return 'Good'
    if (score < 9) return 'Very Good'
    return 'Excellent'
  }

  const getClarityFeedback = (score: number) => {
    if (score < 3) return 'Your argument needs more structure and organization'
    if (score < 5) return 'Try to organize your points more clearly'
    if (score < 7) return 'Good organization, but could be clearer'
    if (score < 9) return 'Very clear and well-structured argument'
    return 'Excellent clarity and organization!'
  }

  const overallScore = Math.round((metrics.persuasiveness + metrics.clarity + metrics.logic) / 3)

  return (
    <div className="bg-white rounded-2xl p-6 h-full border border-gray-200 shadow-lg">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-200">
        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Debate Metrics</h2>
          <p className="text-sm text-gray-600">Real-time analysis of your arguments</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Overall Score */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">{overallScore}</div>
            <div className="text-gray-600 text-sm mb-3">Overall Score</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${getColorClass(overallScore)} transition-all duration-1000 ease-out`}
                style={{ width: `${(overallScore / 10) * 100}%` }}
              />
            </div>
            <div className="text-gray-700 text-sm mt-2">{getScoreLabel(overallScore)}</div>
          </div>
        </div>

        {/* Individual Metrics */}
        <div className="space-y-4">
          {/* Persuasiveness */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-gray-900 font-medium">Persuasiveness</span>
              </div>
              <span className="text-gray-600 text-sm">{metrics.persuasiveness}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className={`h-3 rounded-full bg-gradient-to-r ${getColorClass(metrics.persuasiveness)} transition-all duration-1000 ease-out`}
                style={{ width: `${(metrics.persuasiveness / 10) * 100}%` }}
              />
            </div>
            <div className="text-gray-600 text-xs">{getScoreLabel(metrics.persuasiveness)}</div>
          </div>

          {/* Clarity */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-yellow-600" />
                <span className="text-gray-900 font-medium">Clarity</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getClarityEmoji(metrics.clarity)}</span>
                <span className="text-gray-600 text-sm">{metrics.clarity}/10</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className={`h-3 rounded-full bg-gradient-to-r ${getColorClass(metrics.clarity)} transition-all duration-1000 ease-out`}
                style={{ width: `${(metrics.clarity / 10) * 100}%` }}
              />
            </div>
            <div className="text-gray-600 text-xs">{getClarityFeedback(metrics.clarity)}</div>
          </div>

          {/* Logic */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-gray-900 font-medium">Logic</span>
              </div>
              <span className="text-gray-600 text-sm">{metrics.logic}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className={`h-3 rounded-full bg-gradient-to-r ${getColorClass(metrics.logic)} transition-all duration-1000 ease-out`}
                style={{ width: `${(metrics.logic / 10) * 100}%` }}
              />
            </div>
            <div className="text-gray-600 text-xs">{getScoreLabel(metrics.logic)}</div>
          </div>
        </div>

        {/* Improvement Tips */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
          <h3 className="text-gray-900 font-medium mb-3 flex items-center">
            <Zap className="w-4 h-4 mr-2 text-yellow-600" />
            Improvement Tips
          </h3>
          <ul className="text-gray-700 text-sm space-y-2">
            {metrics.persuasiveness < 6 && (
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Use more evidence and specific examples to strengthen your arguments</span>
              </li>
            )}
            {metrics.clarity < 6 && (
              <li className="flex items-start space-x-2">
                <span className="text-yellow-600 mt-1">•</span>
                <span>Structure your arguments with clear points and transitions</span>
              </li>
            )}
            {metrics.logic < 6 && (
              <li className="flex items-start space-x-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Strengthen your logical reasoning and avoid fallacies</span>
              </li>
            )}
            {metrics.persuasiveness >= 6 && metrics.clarity >= 6 && metrics.logic >= 6 && (
              <li className="flex items-start space-x-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Excellent work! Keep building on your strong foundation</span>
              </li>
            )}
          </ul>
        </div>

        {/* Achievement Badge */}
        {overallScore >= 8 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-300">
            <div className="flex items-center space-x-3">
              <Award className="w-6 h-6 text-yellow-600" />
              <div>
                <div className="text-gray-900 font-medium">Debate Master!</div>
                <div className="text-gray-600 text-sm">Outstanding argumentation skills</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
