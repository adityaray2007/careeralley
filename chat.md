# CareerAlley Diagram Generation Guide

This README is prepared so you can give it to another AI and generate all required diagrams for your project.

Project stack summary:
- Frontend: Next.js (App Router) in `frontend`
- Backend: Go + Gin + GORM in `backend`
- Database: PostgreSQL (`careeralley`) via GORM auto-migrations
- Auth: JWT (local + Google OAuth)
- Real-time: WebSocket group chat
- AI features: roadmap generation, assistant chat, interview question generation

---

## 1) System Architecture Diagram

### Goal
Show the full high-level architecture and how data flows across frontend, backend, external AI APIs, and PostgreSQL.

### Must include components
- User (browser)
- Next.js frontend (`frontend/src/app/*`)
- Gin backend API (`backend/main.go` + `backend/routes/*`)
- PostgreSQL database `careeralley`
- External AI provider (Groq-compatible endpoints used in assistant/mock interview)
- Google OAuth provider
- WebSocket hub (`chatController`)

### Must include connections/arrows
- Browser -> Frontend (UI interaction)
- Frontend -> Backend REST (HTTP/JSON)
- Frontend -> Backend WebSocket (`/chat/:card_id/ws?token=...`)
- Backend -> PostgreSQL (read/write)
- Backend -> Groq API (AI chat, AI roadmap, AI interview question)
- Backend <-> Google OAuth (auth redirect/callback)

### Suggested layering
- Presentation layer: Next.js pages/components
- API/service layer: Gin routes/controllers/services
- Data layer: GORM models + PostgreSQL
- External integrations: Groq + Google OAuth + Jitsi meeting links

### Prompt template for image AI
Create a clean modern system architecture diagram for a project called CareerAlley. Include: User Browser, Next.js Frontend, Go Gin Backend API, PostgreSQL database named careeralley, WebSocket Hub for group chat, Groq AI API, Google OAuth, and Jitsi meeting URL usage. Show arrows for REST, WebSocket, DB reads/writes, OAuth redirects, and AI API calls. Use grouped containers: Frontend, Backend, Database, External Services. Professional software architecture style, white background, clear labels.

---

## 2) Use Case Diagram

### Goal
Show what each actor can do in the system.

### Actors
- Guest User
- Registered User
- Google OAuth User
- AI Service (external system)

### Core use cases to include
- Sign up
- Login (email/password)
- Login with Google
- Complete onboarding questionnaire
- Select field and career card
- Take skill assessment
- Generate AI roadmap
- View roadmap
- Track subtopic progress
- Start/stop study session
- View dashboard analytics
- Join group chat by roadmap card
- Chat with AI assistant
- Generate and save roadmap from assistant
- Create mock interview request
- Join mock interview
- Generate interview questions
- Score interview answers
- Complete interview and view results

### Key relationships
- Registered User includes all authenticated features
- AI-related use cases extend from normal flow (generate roadmap, generate interview question)

### Prompt template
Create a UML use case diagram for CareerAlley. Actors: Guest User, Registered User, Google OAuth User, External AI Service. Include use cases for authentication, onboarding, field/career selection, skill assessment, AI roadmap generation, roadmap progress tracking, study sessions, dashboard analytics, group chat, AI assistant roadmap generation and save, mock interview lifecycle (create/join/generate question/score/complete). Show include/extend where appropriate. Use standard UML notation.

---

## 3) Class Diagram

### Goal
Represent backend domain classes (Go structs/models) and important relationships.

### Core classes (from `backend/models`)
- User
- Field
- CareerCard
- OnboardingQuestion
- OnboardingOption
- UserOnboardingAnswer
- CardQuestion
- CardOption
- UserCardAnswer
- Roadmap
- Topic
- Subtopic
- Resource
- UserProgress
- StudySession
- ChatMessage
- MockInterview
- MockInterviewQuestion
- MockInterviewResult

### Important attributes to show
- PKs (`ID`)
- FK-like fields (`UserID`, `CardID`, `RoadmapID`, `TopicID`, etc.)
- Core business fields (example: `Roadmap.Level`, `MockInterview.Status`, `StudySession.Duration`)

### Relationships to show
- User 1..* Roadmap
- Roadmap 1..* Topic
- Topic 1..* Subtopic
- Subtopic 1..* Resource
- User 1..* UserProgress
- User 1..* StudySession
- User 1..* ChatMessage
- User 1..* MockInterview (as requester/responder/interviewer)
- CareerCard 1..* Roadmap
- CareerCard 1..* CardQuestion
- CardQuestion 1..* CardOption
- User 1..* UserCardAnswer
- OnboardingQuestion 1..* OnboardingOption
- User 1..* UserOnboardingAnswer
- MockInterview 1..* MockInterviewQuestion
- MockInterview 1..* MockInterviewResult

### Prompt template
Create a UML class diagram for CareerAlley backend (Go + GORM). Include classes: User, Field, CareerCard, OnboardingQuestion, OnboardingOption, UserOnboardingAnswer, CardQuestion, CardOption, UserCardAnswer, Roadmap, Topic, Subtopic, Resource, UserProgress, StudySession, ChatMessage, MockInterview, MockInterviewQuestion, MockInterviewResult. Include primary attributes and one-to-many associations with multiplicities. Keep diagram readable with grouped domains: Auth, Onboarding, Roadmap, Progress, Chat, MockInterview.

---

## 4) Activity Diagram

### Goal
Show detailed workflow for one major process.

### Best process to draw
`Onboarding -> Career Selection -> Skill Assessment -> AI Roadmap Generation -> Learning Progress`

### Flow steps
1. User logs in/signs up
2. System checks `onboarded` status
3. If not onboarded: fetch onboarding questions
4. User submits answers
5. Backend stores answers + marks user onboarded + recommends cards
6. User selects field and career card
7. User answers AI-generated assessment questions
8. Backend computes level (beginner/intermediate/advanced)
9. Backend calls AI service and generates roadmap topics/subtopics
10. Roadmap saved in DB
11. User views roadmap
12. User marks subtopics complete + starts/stops study sessions
13. Dashboard updates progress and time stats

### Decision nodes to include
- Onboarded? (Yes/No)
- Existing roadmap found? (reuse/regenerate path)
- All subtopics completed? (journey complete)

### Prompt template
Create a UML activity diagram for CareerAlley from onboarding to roadmap execution. Include decision nodes for onboarded status and roadmap existence, actions for submitting onboarding answers, selecting card, skill assessment, AI roadmap generation, saving to PostgreSQL, updating progress, study session start/end, and dashboard stats refresh.

---

## 5) Sequence Diagram

### Goal
Show message-level interaction across layers.

### Best sequence to draw
`Generate Roadmap` sequence (very important core flow)

### Lifelines
- User
- Frontend (`card-questions` page)
- Backend route/controller (`/generate-roadmap`)
- AI Service (`services.GenerateRoadmap` + external API)
- PostgreSQL

### Message order
1. User submits assessment answers
2. Frontend POST `/generate-roadmap` with `card_id`, `level`, `answers`
3. Backend validates request + loads career card
4. Backend calls AI service
5. AI returns structured topics/subtopics
6. Backend deletes prior roadmap for same user/card (if exists)
7. Backend inserts roadmap
8. Backend inserts topics
9. Backend inserts subtopics
10. Backend returns success
11. Frontend redirects to `/roadmap/:cardId`
12. Frontend GET `/roadmap/:cardId`
13. Backend returns roadmap + completion flags

### Prompt template
Create a UML sequence diagram for CareerAlley AI roadmap generation. Lifelines: User, Next.js Frontend, Gin Controller, AI Service, PostgreSQL. Show request validation, card lookup, AI generation call, old roadmap cleanup, roadmap/topic/subtopic inserts, response back to frontend, and roadmap fetch for display.

---

## 6) ER Diagram (Data Architecture)

### Goal
Show PostgreSQL entities and cardinalities.

### Tables/entities to include
- users
- fields
- career_cards
- onboarding_questions
- onboarding_options
- user_onboarding_answers
- card_questions
- card_options
- user_card_answers
- roadmaps
- topics
- subtopics
- resources
- user_progresses
- study_sessions
- chat_messages
- mock_interviews
- mock_interview_questions
- mock_interview_results

### Primary/foreign key mapping (conceptual)
- roadmaps.user_id -> users.id
- roadmaps.card_id -> career_cards.id
- topics.roadmap_id -> roadmaps.id
- subtopics.topic_id -> topics.id
- resources.subtopic_id -> subtopics.id
- user_progresses.user_id -> users.id
- user_progresses.subtopic_id -> subtopics.id
- study_sessions.user_id -> users.id
- study_sessions.subtopic_id -> subtopics.id
- chat_messages.user_id -> users.id
- chat_messages.card_id -> career_cards.id
- onboarding_options.question_id -> onboarding_questions.id
- user_onboarding_answers.user_id -> users.id
- user_onboarding_answers.question_id -> onboarding_questions.id
- user_onboarding_answers.option_id -> onboarding_options.id
- card_questions.card_id -> career_cards.id
- card_options.question_id -> card_questions.id
- user_card_answers.user_id -> users.id
- user_card_answers.question_id -> card_questions.id
- user_card_answers.option_id -> card_options.id
- mock_interview_questions.interview_id -> mock_interviews.id
- mock_interview_results.interview_id -> mock_interviews.id
- mock_interview_results.user_id -> users.id

### Optional DB introspection commands (if needed)
Run in terminal (from `backend`) if environment already has DB connection:
- `psql "$DATABASE_URL" -d careeralley -c "\dt"`
- `psql "$DATABASE_URL" -d careeralley -c "\d+ roadmaps"`
- `psql "$DATABASE_URL" -d careeralley -c "\d+ topics"`
- `psql "$DATABASE_URL" -d careeralley -c "\d+ subtopics"`

### Prompt template
Create a crow's-foot ER diagram for CareerAlley PostgreSQL schema. Include entities: users, fields, career_cards, onboarding_questions, onboarding_options, user_onboarding_answers, card_questions, card_options, user_card_answers, roadmaps, topics, subtopics, resources, user_progresses, study_sessions, chat_messages, mock_interviews, mock_interview_questions, mock_interview_results. Show PK/FK columns and one-to-many cardinalities.

---

## 7) UI Mockups

### Goal
Create polished screens reflecting actual frontend routes/components.

### Key screens to design
- Landing page (`/`)
- Login (`/login`)
- Signup (`/signup`)
- Onboarding questionnaire (`/onboarding`)
- Fields selection (`/fields`)
- Career cards (`/cards?field=...`)
- Skill assessment (`/card-questions/[id]`)
- Dashboard (`/dashboard`)
- Roadmap details (`/roadmap/[id]`)
- Group chat (`/chat`)
- AI Assistant (`/ai-assistant`)
- Mock interviews list (`/mock-interviews`)
- Mock interview room (`/mock-interviews/[id]`)
- My roadmaps (`/roadmaps`)

### Style direction (from existing UI code)
- Dark/light theme toggle
- Neon green accent (`#b5f23d` family)
- Rounded cards, subtle glow, futuristic learning platform feel
- Sidebar-based authenticated layout
- Data-driven cards, charts, progress bars, badges

### Prompt template
Create a high-fidelity UI mockup set for CareerAlley (web app). Include 13 screens: landing, login, signup, onboarding wizard, fields grid, career cards grid, skill assessment stepper, dashboard analytics, roadmap tracker, group chat, AI assistant chat with roadmap preview, mock interviews list, mock interview room, and roadmaps list. Style: modern dark UI with neon green accents, rounded cards, subtle glow, clean typography, dashboard-style components.

---

## 8) Flowchart (Algorithm)

### Goal
Represent algorithmic decision flow of main recommendation/generation logic.

### Best algorithm flow to draw
`User skill level + card selection -> AI roadmap generation and persistence`

### Algorithm details to include
- Input: selected `card_id`, assessment answers mapped to levels
- Count level tags (`beginner/intermediate/advanced`)
- Resolve final level by max score rule
- Fetch selected career card from DB
- Build AI prompt context (`card name + level + answers`)
- Call AI model
- Validate AI response
- If invalid -> return error/fallback
- Delete old roadmap tree (roadmap/topics/subtopics) for same user/card
- Insert new roadmap
- Insert ordered topics
- Insert subtopics per topic
- Return success and roadmap id

### Prompt template
Create a software flowchart for CareerAlley roadmap generation algorithm. Start from user assessment answers and selected career card, compute level, call AI to generate roadmap JSON, validate response, delete old roadmap records for user/card, persist new roadmap/topics/subtopics in PostgreSQL, and return success. Include decision diamonds for validation failures and existing roadmap check.

---

## Quick API Reference (for diagram labeling)

Auth:
- `POST /signup`
- `POST /login`
- `GET /auth/google`
- `GET /auth/google/callback`

Roadmap + learning:
- `GET /fields`
- `GET /career-cards`
- `GET /onboarding-questions`
- `POST /onboarding-answers`
- `GET /ai-card-questions/:card_id`
- `POST /generate-roadmap`
- `GET /roadmap/:card_id`
- `POST /progress`
- `POST /study-session/start`
- `POST /study-session/end`
- `GET /study-stats`
- `GET /roadmap-progress/:card_id`
- `GET /user-dashboard`

Assistant:
- `POST /assistant/chat`
- `POST /assistant/generate-roadmap`
- `POST /assistant/save-roadmap`

Group chat:
- `GET /chat/:card_id/ws` (WebSocket)
- `GET /chat/:card_id/history`
- `GET /chat/my-cards`

Mock interviews:
- `GET /mock-interviews`
- `POST /mock-interviews`
- `GET /mock-interviews/:id`
- `POST /mock-interviews/:id/join`
- `POST /mock-interviews/:id/generate-question`
- `POST /mock-interviews/:id/score`
- `POST /mock-interviews/:id/complete`
- `DELETE /mock-interviews/:id`

---

## Final note you can give the image AI

Use consistent naming from this document exactly (CareerAlley, roadmaps/topics/subtopics, mock_interviews, onboarding, assistant). Keep diagrams professional, readable, and export in high resolution (PNG + editable source if possible).

---

## 9) SDLC Diagram

### Goal
Show your project lifecycle from idea to deployment/maintenance, tailored to CareerAlley.

### SDLC model to use
Use an iterative/agile SDLC (best fit for this project because features like AI assistant, mock interviews, and dashboard are evolving in cycles).

### Phases to include
1. Requirement Analysis
   - Identify user needs: onboarding, roadmap generation, progress tracking, interviews, chat
   - Define functional and non-functional requirements
2. System Design
   - Define architecture (Next.js + Go/Gin + PostgreSQL + AI APIs)
   - Design DB schema and API contracts
   - Design UI/UX screens and flows
3. Implementation
   - Build frontend pages/components
   - Build backend routes/controllers/services
   - Implement models and migrations with GORM
4. Testing
   - Unit/API testing for auth, roadmap generation, progress endpoints
   - UI and integration tests for end-to-end user flows
   - Validate AI output handling and error paths
5. Deployment
   - Deploy frontend and backend
   - Configure env vars (`DATABASE_URL`, AI keys, OAuth keys)
   - Production DB setup and migrations
6. Maintenance & Iteration
   - Monitor performance/errors
   - Add improvements (new roadmap logic, better interview features)
   - Security and dependency updates

### Prompt template
Create an SDLC diagram for CareerAlley using an iterative agile lifecycle. Show phases: Requirement Analysis, System Design, Implementation, Testing, Deployment, Maintenance and Iteration. Under each phase include project-specific activities for a Next.js + Go/Gin + PostgreSQL + AI platform (roadmaps, onboarding, chat, mock interviews). Use loop arrows from Maintenance back to Requirements/Design.

---

## 10) Gantt Chart

### Goal
Provide a project timeline view to present planning and execution.

### Suggested workstreams
- Planning & Requirements
- Architecture & DB Design
- Backend Core APIs
- Frontend Core Screens
- AI Integration
- Real-time Features (WebSocket chat)
- Mock Interview Module
- Testing & QA
- Deployment & Documentation

### Suggested timeline example (10 weeks)
- Week 1: Planning & requirements
- Week 2: Architecture + ER/class design
- Weeks 3-4: Backend auth, onboarding, roadmap APIs
- Weeks 4-6: Frontend flows (auth, onboarding, fields/cards, roadmap)
- Weeks 5-6: AI integration (assistant + roadmap + interview question generation)
- Week 7: Chat + WebSocket features
- Weeks 7-8: Mock interviews end-to-end
- Week 9: QA, bug fixes, performance checks
- Week 10: Deployment + final docs/demo prep

### Dependencies to show
- Backend API baseline before frontend integration
- DB schema before roadmap/progress features
- AI integration after base roadmap flow exists
- QA starts after main modules are integrated

### Prompt template
Create a professional Gantt chart for CareerAlley project over 10 weeks. Tasks: requirements, architecture design, database schema, backend APIs, frontend UI flows, AI integration, websocket chat, mock interview module, QA/testing, deployment and documentation. Show task dependencies and overlapping workstreams. Clean PM style suitable for academic/project report.

---

## 11) Stakeholder Diagram

### Goal
Map all stakeholders and their relationship with the system.

### Primary stakeholders
- Students/Learners (main end users)
- Project Developer Team
- Product Owner/Project Lead

### Secondary stakeholders
- Mentors/Interview peers (mock interview participants)
- Admin/Maintainer (operational ownership)
- AI Provider (Groq API dependency)
- OAuth Provider (Google auth dependency)
- Infrastructure/Hosting provider

### Relationship mapping
- Students interact directly with frontend and backend features
- Developer team builds/maintains backend, frontend, DB
- Product owner defines requirements and priorities
- External providers supply AI/auth infrastructure
- Admin monitors uptime, DB health, and updates

### Diagram style suggestion
- Put `CareerAlley Platform` in center
- Place stakeholder groups around center with directional arrows
- Use categories/colors: Internal, External, End Users

### Prompt template
Create a stakeholder diagram for CareerAlley platform. Center node: CareerAlley Platform. Surrounding stakeholders: Students/Learners, Developer Team, Product Owner, Mentors/Interview Peers, Admin/Maintainer, AI Provider (Groq), Google OAuth Provider, Hosting/Infrastructure Provider. Group stakeholders as Internal, External, and End Users. Show influence and interaction arrows.

---

## 12) Communication Flow

### Goal
Show who communicates with whom and through which channels.

### Communication layers to include
- User communication flow (UI interactions and feedback loops)
- System communication flow (frontend/backend/db/external APIs)
- Team communication flow (project execution)

### A) User/system communication (technical)
- User -> Frontend UI (forms, dashboard, chats)
- Frontend -> Backend REST
- Frontend <-> Backend WebSocket (group chat)
- Backend <-> PostgreSQL
- Backend -> AI service (roadmap/assistant/interview question)
- Backend <-> Google OAuth
- Backend -> Frontend (JSON responses/status/errors)

### B) Team communication (process)
- Product Owner -> Dev Team (requirements/priorities)
- Dev Team -> QA/Testing (build handoff)
- QA -> Dev Team (bug reports)
- Dev Team -> Product Owner (status/release updates)
- Optional: users -> team (feedback loop for improvement)

### Prompt template
Create a communication flow diagram for CareerAlley with two sections: (1) Technical communication flow and (2) Team communication flow. Technical section should show User, Next.js Frontend, Go/Gin Backend, PostgreSQL, AI API, Google OAuth, and WebSocket channels. Team section should show Product Owner, Developer Team, QA, and User feedback loops. Use directional arrows and label channel types (REST, WebSocket, OAuth redirect, DB query, API call, bug report, status update).
