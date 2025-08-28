#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')

console.log('🔍 Checking DebateMate Environment...\n')

// Check Node.js version
try {
  const nodeVersion = process.version
  console.log(`✅ Node.js: ${nodeVersion}`)
} catch (error) {
  console.log('❌ Node.js not found')
}

// Check if package.json exists
if (fs.existsSync('package.json')) {
  console.log('✅ package.json found')
} else {
  console.log('❌ package.json not found')
}

// Check if node_modules exists
if (fs.existsSync('node_modules')) {
  console.log('✅ Dependencies installed')
} else {
  console.log('❌ Dependencies not installed - run npm install')
}

// Check Ollama
try {
  const ollamaOutput = execSync('ollama list', { encoding: 'utf8' })
  if (ollamaOutput.includes('llama2:7b')) {
    console.log('✅ Ollama with llama2:7b model found')
  } else {
    console.log('⚠️  Ollama found but llama2:7b model not available')
    console.log('   Run: ollama pull llama2:7b')
  }
} catch (error) {
  console.log('❌ Ollama not found or not running')
  console.log('   Install: https://ollama.ai')
}

// Check if Next.js dev server is running
try {
  const response = execSync('curl -s http://localhost:3000', { encoding: 'utf8', timeout: 5000 })
  if (response.includes('DebateMate')) {
    console.log('✅ Next.js dev server running on http://localhost:3000')
  } else {
    console.log('⚠️  Server running but may not be DebateMate')
  }
} catch (error) {
  console.log('❌ Next.js dev server not running')
  console.log('   Run: npm run dev')
}

console.log('\n🎯 Next Steps:')
console.log('1. If any ❌ items above, fix them first')
console.log('2. Run: npm run dev')
console.log('3. Open: http://localhost:3000')
console.log('4. Start debating! 🏛️')
