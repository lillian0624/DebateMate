// Simple test script for the debate API
const testDebateAPI = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/debate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userMessage: 'Social media should be regulated because it spreads misinformation and harms mental health.',
        topic: 'Should social media be regulated?',
        userStance: 'pro',
        aiStance: 'con'
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('✅ API Test Successful!')
    console.log('Counter Argument:', data.counterArgument)
    console.log('Metrics:', data.metrics)
    console.log('Score:', data.score)
  } catch (error) {
    console.error('❌ API Test Failed:', error.message)
  }
}

// Run the test
testDebateAPI()
