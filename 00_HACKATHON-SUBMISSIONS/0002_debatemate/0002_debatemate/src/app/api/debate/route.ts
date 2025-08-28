import { NextRequest, NextResponse } from 'next/server'

interface DebateMetrics {
  persuasiveness: number
  clarity: number
  logic: number
}

// Fallback sentiment analysis using keyword rules
function fallbackSentimentAnalysis(text: string): DebateMetrics {
  const lowerText = text.toLowerCase()
  
  // Simple keyword-based scoring
  const persuasiveWords = ['because', 'therefore', 'evidence', 'prove', 'demonstrate', 'clearly', 'obviously']
  const clearWords = ['first', 'second', 'finally', 'in conclusion', 'however', 'although', 'furthermore']
  const logicalWords = ['if', 'then', 'because', 'therefore', 'thus', 'hence', 'consequently']
  
  const persuasiveScore = persuasiveWords.filter(word => lowerText.includes(word)).length * 1.5
  const clarityScore = clearWords.filter(word => lowerText.includes(word)).length * 1.2
  const logicScore = logicalWords.filter(word => lowerText.includes(word)).length * 1.3
  
  return {
    persuasiveness: Math.min(10, Math.max(1, Math.round(persuasiveScore + 3))),
    clarity: Math.min(10, Math.max(1, Math.round(clarityScore + 3))),
    logic: Math.min(10, Math.max(1, Math.round(logicScore + 3)))
  }
}

// Call Ollama for counter-argument generation
async function generateCounterArgument(userMessage: string, topic: string, userStance: string, aiStance: string): Promise<string> {
  const debateContext = `You are participating in a formal debate on the topic: "${topic}"

The user is arguing the ${userStance.toUpperCase()} position, and you are arguing the ${aiStance.toUpperCase()} position.

Your role is to:
1. Provide a strong counter-argument to the user's point
2. Use logical reasoning and evidence
3. Stay in character as a debate opponent
4. Be respectful but challenging
5. Keep responses concise but compelling (2-3 sentences)

The user just said: "${userMessage}"

Respond as the ${aiStance.toUpperCase()} debater:`

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama2:7b',
        prompt: debateContext,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get response from Ollama')
    }

    const data = await response.json()
    return data.response || 'I need to think about that argument more carefully.'
  } catch (error) {
    console.error('Ollama error:', error)
    return 'That\'s an interesting point. However, I believe there are strong counter-arguments to consider.'
  }
}

// Call Ollama for metrics analysis
async function analyzeMetrics(userMessage: string): Promise<DebateMetrics> {
  const analysisPrompt = `Analyze the following debate argument and return ONLY a JSON object with three scores (persuasiveness, clarity, logic) from 1-10:

Argument: "${userMessage}"

Return ONLY this JSON format:
{
  "persuasiveness": number,
  "clarity": number,
  "logic": number
}`

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama2:7b',
        prompt: analysisPrompt,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get response from Ollama')
    }

    const data = await response.json()
    const responseText = data.response || ''
    
    // Try to parse JSON from the response
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const metrics = JSON.parse(jsonMatch[0])
        return {
          persuasiveness: Math.min(10, Math.max(1, metrics.persuasiveness || 5)),
          clarity: Math.min(10, Math.max(1, metrics.clarity || 5)),
          logic: Math.min(10, Math.max(1, metrics.logic || 5))
        }
      }
    } catch (parseError) {
      console.error('JSON parsing failed, using fallback:', parseError)
    }
    
    // Fallback to keyword analysis
    return fallbackSentimentAnalysis(userMessage)
  } catch (error) {
    console.error('Ollama analysis error:', error)
    return fallbackSentimentAnalysis(userMessage)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userMessage, topic, userStance, aiStance } = await req.json()
    
    if (!userMessage?.trim()) {
      return NextResponse.json({
        error: 'Please provide a user message'
      }, { status: 400 })
    }

    console.log('Processing debate:', { userMessage, topic, userStance, aiStance })

    // Generate counter-argument
    const counterArgument = await generateCounterArgument(userMessage, topic, userStance, aiStance)
    
    // Analyze metrics
    const metrics = await analyzeMetrics(userMessage)
    
    // Simple scoring system
    const score = {
      user: Math.floor(Math.random() * 3) + 1, // 1-3 points
      ai: Math.floor(Math.random() * 3) + 1    // 1-3 points
    }

    console.log('Debate response:', { counterArgument, metrics, score })

    return NextResponse.json({
      counterArgument,
      metrics,
      score
    })
  } catch (error) {
    console.error('Debate API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process debate argument',
        counterArgument: 'I apologize, but I encountered an error processing your argument. Please try again.',
        metrics: fallbackSentimentAnalysis(''),
        score: { user: 0, ai: 0 }
      },
      { status: 500 }
    )
  }
}
