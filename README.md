# Careeralley: Navigate Your Learning

**An intelligent, AI-powered learning ecosystem that generates highly personalized, adaptive roadmaps tailored exactly to a user's goals and proficiency.**

<br/>

Navigating the massive ocean of online courses and tutorials is overwhelming. Students often fall into 'tutorial hell,' learning theories without a structured path or practical application. 

**Careeralley** is an intelligent, AI-powered learning ecosystem that solves this. Instead of a one-size-fits-all curriculum, Careeralley dynamically generates highly personalized, adaptive roadmaps tailored exactly to a user's goals and proficiency. But we didn't stop at just roadmaps—Careeralley bridges the gap between theory and real-world execution. With integrated peer-to-peer video mock interviews powered by Jitsi, dynamic AI-generated technical questions, Google OAuth for seamless onboarding, and contextual real-time study groupings, Careeralley isn't just another studying website. It is a complete, immersive career preparation platform built to get students hired.

<br/>

## 🛑 The Problem

The current online education ecosystem provides learners with immense access to e-learning resources. However, several critical pain points persist:

1. **Lack of Personalization:** Standard learning platforms rely on static curriculums. They do not tailor the pace or the content according to an individual’s existing expertise.
2. **Unstructured Learning Paths:** Most learners piece together knowledge from fragmented sources. There is no definitive sequence, making it easy to miss core fundamentals. 
3. **Absence of Practical Exposure:** Many platforms focus purely on theoretical knowledge delivery. Learners possess the theory but lack the confidence to apply it in real-world scenarios or interviews.
4. **Fragmented Services:** Users have to juggle multiple platforms: one for roadmaps, another for video learning, a third (like Zoom) for mock interviews, and a fourth (like Discord) for community discussion.

<br/>

## ✨ Core Features & Solutions

Careeralley bridges the gap between unstructured learning and focused career guidance by combining several powerful features:

### 🤖 AI-Based Personalized Roadmap Generation
Central to Careeralley is its intelligent roadmap generator. During onboarding, the system collects user interests, target goals, and current expertise levels to generate adaptive, hierarchical roadmaps structured into specific Subtopics and actionable Learning Resources.

### 🎥 Live Peer-to-Peer Mock Interviews (with Video)
To prepare students for actual industry scenarios, the platform offers a state-of-the-art interactive mock interview suite.
- **Peer Matching:** Users can request and join mock interviews with peers.
- **Embedded Video Calls:** Jitsi Meet is natively integrated into the interview room, allowing face-to-face communication without leaving the platform.
- **AI-Generated Questions:** The AI dynamically generates rigorous technical questions based on the selected interview topic, serving them to the interviewer to ask.
- **Live Scoring & Synchronization:** The interviewer formally evaluates the candidate. The system meticulously synchronizes state between both users, culminating in detailed performance scorecards upon completion.

### 💬 Dynamic AI Assistant
An embedded conversational AI assistant allows users to input custom queries, ask for alternative learning routes, and clarify highly specific sub-domain questions right from their dashboard.

### 🔐 Single Sign-On (SSO) Authentication
Seamless integration with Google OAuth allows users to instantly and securely onboard into the platform without the friction of remembering traditional credentials.

### 🎨 Premium Immersive UI/UX
Careeralley doesn't look like a standard academic portal. It features a stunning, immersive dark-mode aesthetic utilizing deep olive and vibrant neon-lime accents. It makes heavy use of glassmorphism, responsive micro-animations, and dynamic UI states to keep the learning experience highly engaging and modern.

<br/>

## 🛠️ Technology Stack & Architecture

The platform is designed using a robust, modular, and scalable Full-Stack architecture built entirely for the cloud.

### Frontend (User Interface)
* **Framework:** Next.js utilizing React.
* **Styling:** Custom Vanilla CSS & modular design tokens ensuring total control over the bespoke animations and glassmorphic aesthetics.
* **Deployment:** Vercel (providing edge network caching and high availability).

### Backend (Business Logic & APIs)
* **Language:** Go (Golang) - Chosen for maximum performance, minimal memory footprint, and excellent concurrent request handling capabilities.
* **Web Framework:** Gin Web Framework for lightning-fast RESTful HTTP routing.
* **ORM:** GORM utilizing the PostgreSQL driver.
* **Authentication:** Dual-layer security featuring Google OAuth 2.0 integration and secure JSON Web Tokens (JWT) for stateless session management.
* **Deployment:** Railway App (providing a scalable containerized deployment environment).

### Database & Third-Party APIs
* **Database Engine:** Supabase PostgreSQL (providing a highly secure, cloud-native relational database).
* **Video Infrastructure:** Integrated Jitsi Meet open-source API.
* **Artificial Intelligence Engine:** Groq API leveraging LLMs (like LLaMA-3) for instantaneous, low-latency roadmap parsing and interview question generation.

<br/>

## ⚙️ Intelligent System Workflows

### The Mock Interview Synchronization Flow
1. **Matching:** User requests an interview; a peer joins. The backend generates a secure, unique Jitsi room URI.
2. **Execution:** Both users connect to the room. The system assigns "Interviewer" and "Interviewee" roles.
3. **AI Injection:** The backend constructs an LLM prompt contextualizing the interview topic and fetches a rigorous technical question & model answer, sending it to the Interviewer.
4. **Scoring & Completion:** The Interviewer scores the Candidate based on the model answer. When all questions are resolved, the backend calculates the finalized math, updates the Supabase status to `completed`, and elegantly reveals the performance cards to both parties.

### Dual-Environment Fallback Architecture
The backend is rigorously engineered to seamlessly transition between Local Development and Cloud Production without code modifications. It intelligently monitors environment variables (`DATABASE_URL`, `FRONTEND_URL`), safely falling back to local localhosts and local Postgres instances when required.

<br/>

## 📊 Competitive Edge

Careeralley vastly outperforms existing generic solutions by unifying the ecosystem:

* **vs. Traditional MOOCs (Coursera, Udemy):** MOOCs force a one-size-fits-all curriculum. Careeralley shifts the paradigm by building the curriculum *around* the user's specific skill gaps.
* **vs. Static Roadmaps (roadmap.sh):** Static roadmaps don't care if you have 5 years of experience or 0. Careeralley dynamically structures trees based on exact user proficiency.
* **vs. Solo Practice Platforms (Leetcode):** Platforms like LeetCode teach logic but ignore verbal communication. Careeralley integrates live human interaction over video, augmented by AI evaluations, perfectly simulating real-world job interviews.

<br/>

## 💻 Getting Started (Local Development)

### Prerequisites
- Node.js (for frontend)
- Go (for backend)
- PostgreSQL (or a Supabase project)
- Groq API Key
- Google OAuth 2.0 Credentials

### 1. Clone the repository
```bash
git clone <your-github-repo-url>
cd careeralley_project_structure
```

### 2. Backend Setup
```bash
cd backend
# Install Go dependencies
go mod download

# Set up environment variables
# Create a .env file based on an .env.example (if provided) with:
# DATABASE_URL=...
# GROQ_API_KEY=...
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
# JWT_SECRET=...

# Run the server
go run main.go
```
The backend server will run typically on `http://localhost:8080`.

### 3. Frontend Setup
```bash
cd frontend
# Install Node dependencies
npm install

# Set up environment variables
# Create a .env.local file with:
# NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
# NEXT_PUBLIC_GOOGLE_CLIENT_ID=...

# Run the development server
npm run dev
```
Visit `http://localhost:3000` to view the application.
