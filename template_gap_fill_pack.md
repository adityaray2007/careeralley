# CareerAlley Template Gap-Fill Pack (With Pseudocode)

This file is prepared to fill the sections that are expected in your final report template but are currently missing or incomplete.

Use this content directly in your report and adjust names/dates/links as needed.

---

## 1) Background Research (Template: Chapter 2)

Online learning has grown rapidly through MOOCs, coding practice platforms, roadmap websites, and collaborative communities. While these platforms have improved accessibility, they still present key challenges: fragmented workflows, weak personalization, and limited practical readiness support for interviews and peer interaction.

MOOC platforms such as Coursera, edX, and Udemy provide high-quality content but often rely on course catalogs rather than deeply personalized learning pathways. Learners with unclear goals frequently struggle to decide what to learn next. Static roadmap systems (for example, role-based visual maps) improve sequence visibility but are not adaptive to user background, pace, or learning goals. Recommendation-based content platforms improve engagement but can produce non-sequential learning paths.

Another major limitation in existing ecosystems is fragmentation. Problem-solving platforms focus primarily on coding practice, while communication platforms (chat/community tools) support collaboration but are generally disconnected from a learner's structured progression. Practical assessment and confidence-building mechanisms, such as mock interview simulation tied to an individual's study path, are often absent in most learning systems.

Recent AI-assisted systems demonstrate potential for adaptive guidance. However, many implementations provide suggestions without integrating full lifecycle support: onboarding-based personalization, roadmap generation, progress tracking, practical simulation, and peer collaboration in a single environment.

CareerAlley addresses this gap through a unified architecture that combines:
- user onboarding and skill profiling,
- AI-generated personalized roadmaps,
- AI assistant-led dynamic planning,
- mock interview simulation and scoring,
- roadmap-linked group collaboration,
- dashboard-based study and progress monitoring.

This integrated approach aims to reduce decision fatigue, improve learning efficiency, and bridge the gap between theoretical learning and practical readiness.

---

## 2) Project Planning (Template: Chapter 3)

### 2.1 Project Lifecycle

The project follows an iterative agile lifecycle. Core requirements were identified early, then implemented in modules across short development cycles. Each cycle included implementation, integration checks, and feedback-driven refinement.

Lifecycle phases:
1. Requirement analysis and scope definition
2. Architecture and database design
3. Incremental module development
4. Integration testing and debugging
5. Documentation and closure

### 2.2 Project Setup

Team setup includes:
- Source management using Git repository
- Frontend: Next.js and React
- Backend: Go (Gin framework)
- Database: PostgreSQL with GORM
- API testing: Postman/manual endpoint checks
- Local development environment for each team member

Coding and collaboration setup:
- Branch-based development
- Modular backend controllers and routes
- Component-based frontend pages
- Shared API contracts for frontend-backend communication

### 2.3 Stakeholders

Primary stakeholders:
- Students/learners (end users)
- Project team (developers)
- Faculty mentor/project guide

Secondary stakeholders:
- Peer interview participants
- System maintainer/admin
- External API providers (AI provider, OAuth provider)

### 2.4 Project Resources

Required resources:
- Team members (development and testing effort)
- Development systems (laptop/desktop with internet)
- PostgreSQL database environment
- External AI API access
- Documentation tools for final report and diagrams

### 2.5 Assumptions

The project assumes:
- Stable internet connectivity for API calls
- Availability of external AI services
- Availability of team members per schedule
- Access to required development tools and runtime dependencies
- Sufficient test data and user scenarios for validation

---

## 3) Project Tracking (Template: Chapter 4)

### 3.1 Tracking

Project tracking was performed using:
- Git commits and version history for development progress
- API-level verification of feature completion
- Module-level integration checks (auth, roadmap, assistant, interview, chat)
- Iterative debugging logs and retest cycles

### 3.2 Communication Plan

Internal communication:
- Weekly team sync meetings
- Task-level discussion during implementation cycles
- Shared progress updates after feature completion

External/mentor communication:
- Periodic review sessions with mentor
- Requirement and milestone confirmation
- Feedback incorporation into implementation and documentation

### 3.3 Deliverables

Major deliverables:
- Full-stack web application
- Implemented modules (Auth, Onboarding, Roadmap, Assistant, Mock Interview, Chat, Dashboard)
- Database schema and integrated backend APIs
- Simulation and testing results
- Final technical report and diagrams

---

## 4) System Analysis and Design Completeness Pack (Template: Chapter 5)

### 4.1 Overall Description

CareerAlley is a full-stack learning platform designed to provide structured and personalized learning journeys. The system accepts user input through onboarding and assessment, derives user level and preferences, and generates roadmap content using AI-assisted services. The roadmap is organized hierarchically and linked to tracking modules that monitor progress and study behavior.

The platform extends beyond static planning by integrating an AI assistant for dynamic roadmap creation, a mock interview module for practical readiness, and group chat for collaborative learning. This creates a complete learning loop: plan -> learn -> practice -> track -> improve.

### 4.2 Users and Roles

User roles include:
- Guest user (pre-auth access)
- Registered learner (core learning features)
- Peer participant (mock interview collaboration)
- Admin/maintainer (operational maintenance)
- External service actors (AI provider, OAuth provider)

---

## 5) Tracking/Planning Tables (Reference)

Use the table file you already have:
- `report_tables_guide.json`
- `report_tables_guide_viewer.html`
- `report_tables_guide.docx`

These include all table-ready content (functional requirements, risks, feasibility, comparisons, test matrix, schedule, API summary, etc.).

---

## 6) Pseudocode Section (Template: Chapter 7)

Below are properly structured pseudocode blocks you can place under:
`Algorithms/Pseudo Code OF CORE FUNCTIONALITY`

### 6.1 Pseudocode: Personalized Roadmap Generation

```text
ALGORITHM GeneratePersonalizedRoadmap(userId, cardId, answers)
INPUT: userId, cardId, answers[]
OUTPUT: roadmapId or error

1. Validate request payload
2. card <- FetchCareerCard(cardId)
3. IF card does not exist THEN
4.     RETURN error("Card not found")
5. ENDIF

6. levelScores <- {beginner: 0, intermediate: 0, advanced: 0}
7. FOR each answer in answers DO
8.     inferredLevel <- InferLevelFromAnswer(answer)
9.     levelScores[inferredLevel] <- levelScores[inferredLevel] + 1
10. ENDFOR

11. finalLevel <- ResolveDominantLevel(levelScores)

12. aiResponse <- CallAIForRoadmap(card.name, finalLevel, answers)
13. IF aiResponse is invalid OR empty THEN
14.     RETURN error("AI generation failed")
15. ENDIF

16. oldRoadmaps <- FetchRoadmapsByUserAndCard(userId, cardId)
17. FOR each oldRoadmap in oldRoadmaps DO
18.     DeleteSubtopicsByRoadmap(oldRoadmap.id)
19.     DeleteTopicsByRoadmap(oldRoadmap.id)
20.     DeleteRoadmap(oldRoadmap.id)
21. ENDFOR

22. roadmapId <- InsertRoadmap(userId, cardId, finalLevel, isAIGenerated=true)
23. topicIndex <- 0
24. FOR each topic in aiResponse.topics DO
25.     topicId <- InsertTopic(roadmapId, topic.title, topic.estimatedTime, topic.difficulty, topicIndex)
26.     topicIndex <- topicIndex + 1
27.     FOR each subtopic in topic.subtopics DO
28.         InsertSubtopic(topicId, subtopic.title)
29.     ENDFOR
30. ENDFOR

31. RETURN roadmapId
END ALGORITHM
```

### 6.2 Pseudocode: Mock Interview Question + Scoring Flow

```text
ALGORITHM RunMockInterviewRound(interviewId, interviewerId, intervieweeId, totalQuestions)
INPUT: interviewId, interviewerId, intervieweeId, totalQuestions
OUTPUT: finalScore

1. questionNumber <- 1
2. totalScore <- 0

3. WHILE questionNumber <= totalQuestions DO
4.     questionData <- GenerateAIInterviewQuestion(interviewId, intervieweeId, questionNumber)
5.     IF questionData is invalid THEN
6.         RETURN error("Question generation failed")
7.     ENDIF

8.     SaveInterviewQuestion(interviewId, questionData, intervieweeId, questionNumber)
9.     DisplayQuestionToInterviewer(questionData.question)

10.    candidateAnswer <- CaptureCandidateAnswer()
11.    score <- EvaluateOrCollectScore(candidateAnswer, questionData.suggestedAnswer)
12.    score <- Clamp(score, 0, 10)

13.    SaveQuestionScore(interviewId, questionNumber, score)
14.    totalScore <- totalScore + score
15.    questionNumber <- questionNumber + 1
16. ENDWHILE

17. maxScore <- totalQuestions * 10
18. SaveInterviewResult(interviewId, intervieweeId, totalScore, maxScore)
19. RETURN totalScore
END ALGORITHM
```

### 6.3 Pseudocode: Real-Time Group Chat Message Broadcast

```text
ALGORITHM HandleChatMessage(cardId, senderUserId, senderName, content)
INPUT: cardId, senderUserId, senderName, content
OUTPUT: broadcast status

1. IF content is empty THEN
2.     RETURN error("Invalid message")
3. ENDIF

4. messageId <- SaveMessageToDatabase(cardId, senderUserId, senderName, content)
5. payload <- BuildOutgoingPayload(messageId, cardId, senderUserId, senderName, content, currentTime)
6. clients <- FetchConnectedClientsForCard(cardId)

7. FOR each client in clients DO
8.     sendStatus <- SendPayload(client, payload)
9.     IF sendStatus is failed THEN
10.        DisconnectClient(client)
11.    ENDIF
12. ENDFOR

13. RETURN success
END ALGORITHM
```

---

## 7) References Block (Template-Compatible Starter)

Use this style and replace/add your actual sources:

1. R. Buyya, C. S. Yeo, and S. Venugopal, "Cloud computing and emerging IT platforms: Vision, hype and reality," Future Generation Computer Systems, 2009.
2. M. Fowler, "Patterns of Enterprise Application Architecture," Addison-Wesley, 2002.
3. Official PostgreSQL Documentation, https://www.postgresql.org/docs/
4. Gin Web Framework Documentation, https://gin-gonic.com/docs/
5. Next.js Documentation, https://nextjs.org/docs
6. React Documentation, https://react.dev/

---

## 8) Final Checklist Before Submission

- Replace placeholder names/enrollment numbers
- Update table and figure captions
- Update List of Tables / List of Figures / TOC fields
- Ensure pseudocode section is present and formatted
- Add citation references for related work and tools used
- Check consistency: if report says backend is Go, remove Spring Boot mentions
