# 🏛️ DebateMate - Open-Source AI Debate Coach

> **Master critical thinking through interactive AI-powered debates**

## 🎯 What is DebateMate?

DebateMate transforms the **basic chat app** into an **AI-powered debate training platform**, designed to help students and professionals practice **critical thinking, persuasion, and structured argumentation**. 

---

## 🛠️ Tech Stack  
  
  
### **Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons

### **Backend**
- **Next.js API Routes** - Serverless API endpoints
- **Ollama** - Local AI model inference
- **llama2:7b** - Open-source language model
- **Deployment:** Docker-ready, local or cloud hosting 

### **AI Components**
- **AI Models:** Open-source (LLaMA 3, Mistral, Falcon via Ollama)
- **Debate Engine** - Structured argument generation
- **Metrics Analysis** - AI-powered argument evaluation
- **Fallback System** - Keyword-based analysis when AI fails
- **Context Management** - Debate topic and stance tracking
- **Whisper API / Vosk / DeepSpeech** for speech-to-text
 
---


## ✨ Key Features

### 🎯 **Interactive Debates**
- **Choose from curated topics** or add your own
- **Select your stance** (pro or con)
- **Debate with AI opponent** using open-source LLMs
- **Real-time argument exchange** with structured responses

### 🔊 Voice Debate (Optional Feature)

DebateMate also supports **voice-based debates**, making practice feel more like a real-world discussion.  
With voice input and output powered by speech-to-text (STT) and text-to-speech (TTS) technologies, you can **speak your arguments naturally** and receive **AI feedback in real-time**.

#### How it works:
1. 🎙️ **Speak your argument** – Use your microphone to present your point.
2. 🧠 **AI listens & responds** – The model converts your speech into text, generates a counterargument or feedback, and replies.
3. 🔁 **Voice feedback loop** – The AI’s response is read aloud so you can continue the debate conversationally.
4. 📊 **Feedback metrics update live** – Argument clarity, persuasiveness, and engagement scores are updated as you speak.


### 🏆 **Intelligent Scoring & Feedback System**
- AI generates **counter-arguments** instead of simple replies  
- Each round is scored with **clarity, logic, and persuasiveness metrics** 
- **Optional Hybrid mode**: adds **overall performance summary** across rounds.  
- **Fallback keyword analysis** when model feedback fails.  

### 🎨 **Beautiful Interface**
- Tailwind CSS powered **debate dashboard** 
- Live **debate metrics panel** (badges, bars, colors, emojis)
- **Real-time chat interface** with debate bubbles
- **Score tracking** and debate statistics
- **Topic difficulty levels** (beginner, intermediate, advanced)

### 📊 **Advanced Metrics**
- **Persuasiveness scoring** with animated progress bars
- **Clarity analysis** with emoji indicators (😕 → 🙂 → 🤩)
- **Logic evaluation** with numerical scoring
- **Real-time feedback** and improvement tips

### 👤 User Accounts & Chat History  

DebateMate now includes a **fully functional user system** with persistent debate tracking and analytics.  

**User Authentication:**  
- Sign In / Sign Up modal with **clean, responsive UI**  
- **localStorage-based** session persistence  
- User profile dropdown showing stats and quick actions  
- Automatic login state management  

**Chat History & Analytics:**  
- Complete **debate history page** (`/history`)  
- Track **total debates, average score, wins, and performance level**  
- **Search and filter** debates by topic, stance, or date  
- Sort debates: newest, oldest, or highest score  
- Delete individual debates  

**User Profile Dashboard:**  
- Displays **total debates, average score, performance level**  
- Quick actions: view history, analytics, settings  
- Sign out functionality  

**Enhanced Navigation:**  
- Conditional links: history only visible when signed in  
- Seamless user experience integrating authentication and profile  

**User Flow:**  
1. Sign Up / Sign In → access DebateMate  
2. Start debating → debates automatically saved to history  
3. View history → analyze past debates and performance  
4. Track progress → real-time performance updates  

**Data Storage:**  
- All user data and debate history saved locally via **localStorage**  
- Automatic updates after each debate  
- Real-time analytics for ongoing performance tracking  

**Analytics Metrics:**  
- Total debates completed  
- Average score per debate  
- Win rate against AI  
- Performance level (Excellent / Good / Fair / Needs Improvement)  
- Total messages exchanged




## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **Ollama** with llama2:7b model

### Installation

1. **Clone the repository:**
```bash
 
git clone https://github.com/openxai-hackathon/2025.git
cd 00_HACKATHON-SUBMISSIONS/0002_DebateMate
```

2. **Install dependencies:**
```bash
npm install --legacy-peer-deps
```

3. **Start Ollama and pull the model:**
```bash
# Start Ollama service
brew services start ollama

# Pull the required model
ollama pull llama2:7b
```

4. **Run the development server:**
```bash
npm run dev
```

5. **Open your browser** and go to [http://localhost:3000](http://localhost:3000)

## 🎮 How to Use

### 1. **Choose a Topic**
- Browse through curated debate topics
- Select difficulty level (beginner, intermediate, advanced)
- Topics include: social media regulation, remote work, AI development, education

### 2. **Pick Your Stance**
- Click "Argue PRO" or "Argue CON"
- The AI will take the opposite position
- Get ready for a structured debate!

### 3. **Start Debating**
- Make your opening argument
- Respond to AI counter-arguments
- Watch your score increase with strong points
- Use logical reasoning and evidence

### 4. **Track Progress**
- Monitor your score vs. AI score
- Review debate history
- Improve your argumentation skills

## 🛠️ Tech Stack


## 🎯 Sample Debate Topics

### **Beginner Level**
- Is remote work better than office work?
- Should pets be allowed in workplaces?

### **Intermediate Level**
- Should social media be regulated?
- Should college education be free?

### **Advanced Level**
- Should AI development be paused?
- Is universal basic income necessary?

## 🔧 Development

### **Project Structure**
```
00_HACKATHON-SUBMISSIONS/
├── 0002_DebateMate/
├── pages/
│ └── api/chat.ts # API route with debate + feedback logic
├── components/
│ └── Chat.tsx # Debate UI with metrics panel
├── app/history/page.tsx # User debate history
│
├── contexts/UserContext.tsx # User state management
├── components/AuthModal.tsx # Authentication modal
├── components/UserProfile.tsx # Profile and dashboard
├── public/ # Assets (icons, emojis, badges)
├── styles/ # Tailwind setup
├── package.json
└── README.md (this file)
```

### **Available Scripts**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Customization

### **Adding New Topics**
Edit the `SAMPLE_TOPICS` array in `src/app/page.tsx`:

```typescript
const SAMPLE_TOPICS: DebateTopic[] = [
  {
    id: '5',
    title: 'Your New Topic',
    description: 'Topic description here',
    difficulty: 'intermediate'
  }
]
```

### **Modifying AI Behavior**
Update the debate context in `src/app/api/debate/route.ts` to change how the AI responds.

### **Styling Changes**
Modify `src/app/globals.css` and component styles to match my brand.

## 🔧 Technical Features

### **Error Handling**
- **Safe JSON parsing** with try/catch blocks
- **Fallback sentiment analysis** with keyword rules
- **Graceful degradation** when Ollama is unavailable
- **User-friendly error messages**

### **Performance Optimizations**
- **Streaming responses** for real-time interaction
- **Efficient state management** with React hooks
- **Optimized re-renders** with proper component structure
- **Fast loading** with Next.js optimizations

### **AI Integration**
- **Dual Ollama calls** - one for counter-arguments, one for analysis
- **Structured JSON responses** for metrics
- **Context-aware prompts** for better debate quality
- **Fallback mechanisms** for reliability

## 🚀 Future Enhancements

### **Planned Features**
- **Voice debates** - Speech-to-text and text-to-speech
- **Multiplayer debates** - Challenge friends or join debate rooms
- **Educator mode** - Teachers assign topics and track student performance
- **Advanced scoring** - More sophisticated argument analysis
- **Debate history** - Save and review past debates
- **Custom topics** - Users can add their own debate topics

### **AI Improvements**
- **Better argument analysis** - More sophisticated scoring algorithms
- **Evidence suggestions** - AI provides relevant facts and statistics
- **Logical fallacy detection** - Identify weak arguments
- **Debate coaching** - Personalized tips and feedback

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### **Areas for Contribution**
- **New debate topics** - Add interesting and relevant topics
- **UI/UX improvements** - Better design and user experience
- **AI enhancements** - Improved debate logic and responses
- **Performance optimization** - Faster loading and responses
- **Documentation** - Better guides and tutorials

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ollama team** for making local AI accessible
- **Next.js team** for the amazing React framework
- **Tailwind CSS** for the utility-first styling
- **Open-source community** for inspiration and tools

## 📞 Support

- **Issues** - Report bugs and request features on GitHub
- **Discussions** - Join community discussions
- **Documentation** - Check the docs for detailed guides

---

**Happy debating! 🏛️**

> DebateMate is designed to make critical thinking and debate skills accessible to everyone through the power of open-source AI.
