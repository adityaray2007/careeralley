# CareerAlley Report Tables Guide

Use this file to add strong, project-specific tables in your final report.
I mapped table placement to your current report sections (Introduction, Requirement Analysis, Risk Analysis, Feasibility, Proposed Solution, Simulation, Result Analysis, Learning Outcomes, Conclusion).

---

## How to use in Word

1. Go to the section mentioned under each table.
2. Insert a table with the same number of columns.
3. Copy the content from here.
4. Add caption in Word: `References -> Insert Caption -> Label: Table`.
5. Update `List of Tables` at the end.

---

## Table Placement Map (Where to add)

- `Table 1` -> Section `1.2 Related Work`
- `Table 2` -> Section `Requirement Analysis`
- `Table 3` -> Section `Requirement Analysis`
- `Table 4` -> Section `Risk Analysis`
- `Table 5` -> Section `Feasibility Study`
- `Table 6` -> Section `Proposed Solution`
- `Table 7` -> Section `Proposed Solution` (after architecture discussion)
- `Table 8` -> Section `Simulation Design and Implementation`
- `Table 9` -> Section `Simulation Design and Implementation` (integration testing)
- `Table 10` -> Section `Result Comparison and Analysis`
- `Table 11` -> Section `Learning Outcomes`
- `Table 12` -> Section `Conclusion with Challenges`

---

## Table 1: Related Work Comparison
**Add in:** `1.2 Related Work`  
**Columns:** 5

| Platform/System | Personalization | Structured Roadmap | Practical Training | Limitation vs CareerAlley |
|---|---|---|---|---|
| Coursera/Udemy (MOOCs) | Medium | Course-level | Low | No complete personalized roadmap flow |
| roadmap.sh | Low | High (static) | Low | Same roadmap for all users |
| YouTube Recommendations | Medium | Low | Low | Random learning sequence |
| LeetCode/HackerRank | Low | Medium (problem-focused) | High (coding only) | Limited domain scope |
| Discord/Slack communities | Low | Low | Medium | Collaboration not integrated with roadmap |
| CareerAlley (Proposed) | High | High (dynamic AI roadmap) | High (mock interviews + chat) | Depends on AI output quality and tuning |

---

## Table 2: Functional Requirements Matrix
**Add in:** `Requirement Analysis`  
**Columns:** 4

| Req ID | Requirement | Priority | Module |
|---|---|---|---|
| FR-01 | User signup/login with JWT and Google OAuth | High | Auth |
| FR-02 | Onboarding question flow and preference capture | High | Onboarding |
| FR-03 | AI-based personalized roadmap generation | High | Roadmap |
| FR-04 | AI assistant for custom roadmap conversations | High | Assistant |
| FR-05 | Mock interview creation, joining, scoring, completion | High | Mock Interview |
| FR-06 | Group chat per roadmap card (WebSocket) | Medium | Chat |
| FR-07 | Subtopic progress update and completion tracking | High | Progress |
| FR-08 | Study session start/stop with duration stats | Medium | Study Analytics |
| FR-09 | Dashboard with active cards and learning stats | High | Dashboard |

---

## Table 3: Non-Functional Requirements Matrix
**Add in:** `Requirement Analysis`  
**Columns:** 4

| NFR ID | Requirement | Target/Expectation | Validation Method |
|---|---|---|---|
| NFR-01 | Performance | Fast API response for normal operations | Endpoint response checks |
| NFR-02 | Scalability | Support multiple concurrent users | Load testing (basic) |
| NFR-03 | Security | JWT-protected endpoints and secure auth flow | Auth/authorization testing |
| NFR-04 | Availability | Stable service with minimal downtime | Runtime monitoring |
| NFR-05 | Usability | Intuitive UI with clear navigation | User walkthrough feedback |
| NFR-06 | Reliability | Graceful handling of API/AI failures | Error-path testing |
| NFR-07 | Maintainability | Modular frontend/backend structure | Code review and module isolation |

---

## Table 4: Risk Register
**Add in:** `Risk Analysis`  
**Columns:** 5

| Risk ID | Risk Description | Probability | Impact | Mitigation |
|---|---|---|---|---|
| R-01 | AI may return inconsistent roadmap/interview output | Medium | High | Structured prompts + response validation |
| R-02 | Frontend-backend contract mismatch | Medium | High | API schema checks and integration testing |
| R-03 | Authentication/session errors | Medium | High | JWT middleware validation and token checks |
| R-04 | Real-time chat scaling issue | Medium | Medium | Optimize WebSocket handling and message limits |
| R-05 | Database relation inconsistency | Low | High | FK design checks and query validation |
| R-06 | User drop-off after onboarding | Medium | Medium | Better UX and smoother onboarding flow |
| R-07 | Third-party API dependency failure | Medium | High | Retry/fallback messaging in UI |

---

## Table 5: Feasibility Summary
**Add in:** `Feasibility Study`  
**Columns:** 3

| Feasibility Type | Observation | Conclusion |
|---|---|---|
| Technical | Next.js + Go + PostgreSQL + AI API stack is available and implementable | Feasible |
| Economic | Uses mostly open-source stack and student-level infra | Feasible |
| Operational | User flow is understandable: auth -> onboarding -> roadmap -> learning | Feasible |
| Time | Can be built in staged increments with core-first approach | Feasible |

---

## Table 6: Proposed Solution Modules
**Add in:** `Proposed Solution`  
**Columns:** 4

| Module | Purpose | Key Features | Output |
|---|---|---|---|
| Auth & Onboarding | Identify user and learning intent | JWT auth, Google OAuth, onboarding answers | User profile context |
| Roadmap Engine | Generate personalized roadmap | AI topic/subtopic generation, level mapping | Structured roadmap |
| AI Assistant | Dynamic guidance | Conversational query, roadmap draft/save | Custom learning path |
| Mock Interview | Practical skill training | Match users, AI questions, scoring/results | Interview score + feedback |
| Group Chat | Peer collaboration | Card-specific chat room via WebSocket | Real-time discussion |
| Dashboard | Monitoring progress | Study stats, active cards, completion % | Learning insights |

---

## Table 7: System Components and Tech Stack
**Add in:** `Proposed Solution` (after system architecture paragraph)  
**Columns:** 4

| Layer | Technology | Responsibility | Example Files |
|---|---|---|---|
| Frontend | Next.js + React | UI, routes, API calls, UX flows | `frontend/src/app/*` |
| Backend API | Go + Gin | REST endpoints and business logic | `backend/controllers/*`, `backend/routes/*` |
| Data Layer | GORM + PostgreSQL | Persist users, roadmaps, chat, interviews | `backend/models/*`, `backend/config/db.go` |
| AI Integration | Groq-compatible API usage | Generate roadmap, assistant responses, interview questions | `assistantController`, `mockInterviewController` |
| Real-time Layer | Gorilla WebSocket | Group chat rooms and broadcast | `chatController.go` |

---

## Table 8: Simulation Scenarios and Expected Results
**Add in:** `Simulation Design and Implementation`  
**Columns:** 4

| Scenario ID | Scenario | Steps Covered | Expected Result |
|---|---|---|---|
| S-01 | New user journey | Signup -> login -> onboarding -> card selection -> roadmap | Roadmap generated and visible |
| S-02 | AI assistant flow | Chat prompt -> assistant roadmap -> save roadmap | Saved roadmap appears in user list |
| S-03 | Mock interview flow | Create/join interview -> generate question -> score -> complete | Scores/results persisted |
| S-04 | Group chat flow | Join card chat -> send/receive messages | Real-time synced chat with history |
| S-05 | Progress tracking flow | Mark subtopic complete -> start/end study session | Dashboard metrics update |

---

## Table 9: Integration Testing Checklist
**Add in:** `Simulation Design and Implementation` (integration testing subsection)  
**Columns:** 4

| Integration Path | Test Case | Status | Notes |
|---|---|---|---|
| Frontend -> Backend | Auth endpoints (`/signup`, `/login`) | Pass | Token returned and stored |
| Frontend -> Backend | Roadmap endpoints (`/generate-roadmap`, `/roadmap/:id`) | Pass | Data rendered in roadmap page |
| Backend -> DB | Roadmap/topic/subtopic insert flow | Pass | Hierarchical data stored |
| Backend -> AI API | Assistant and interview question generation | Pass | JSON parsed and used |
| WebSocket flow | Chat join/history/message broadcast | Pass | Multi-user sync works |
| Dashboard aggregation | Study stats and progress calculations | Pass | Values returned in API |

---

## Table 10: Result Comparison Table
**Add in:** `Result Comparison and Analysis`  
**Columns:** 6

| Parameter | Traditional MOOCs | Static Roadmap Sites | Coding Platforms | Chat Platforms | CareerAlley |
|---|---|---|---|---|---|
| Personalized Path | Medium | Low | Low | Low | High |
| Structured Learning Sequence | Medium | High | Medium | Low | High |
| Practical Simulation | Low | Low | Medium | Low | High |
| Peer Collaboration | Low | Low | Low | High | High |
| Unified Learning Ecosystem | Low | Low | Low | Low | High |

---

## Table 11: Learning Outcomes Mapping
**Add in:** `Learning Outcomes`  
**Columns:** 4

| Outcome Area | Skills Gained | Project Evidence | Proficiency |
|---|---|---|---|
| Full-stack development | UI + API integration | Next.js pages with Gin APIs | High |
| Database engineering | Relational design and CRUD flows | PostgreSQL tables and GORM models | High |
| Secure authentication | JWT and OAuth handling | Protected routes and token flow | Medium-High |
| AI integration | Prompting and response handling | Assistant + roadmap + interview AI | Medium-High |
| Real-time systems | WebSocket communication | Group chat module | Medium |
| Debugging/problem solving | Cross-layer issue resolution | Auth/API/data flow fixes | High |

---

## Table 12: Challenges and Resolutions
**Add in:** `Conclusion with Challenges`  
**Columns:** 4

| Challenge | Root Cause | Resolution Applied | Future Improvement |
|---|---|---|---|
| Auth flow issues after signup/login | Token/state synchronization | Improved login handling and route checks | Add automated auth tests |
| API integration mismatches | Inconsistent request/response assumptions | Standardized payload structure | Introduce API schema validation |
| DB relationship complexity | Multiple linked entities (roadmap-topic-subtopic) | Better FK modeling and query checks | Add migration/versioning strategy |
| AI output inconsistency | Non-deterministic responses | Structured prompts and parsing safeguards | Add quality scoring/fallback generation |
| Performance delays in AI flows | External API latency | UI loaders and backend optimizations | Add caching and async queues |

---

## Table 13: Project Schedule (Extra)
**Add in:** `Project Planning`  
**Columns:** 4

| Week | Planned Work | Major Output | Status |
|---|---|---|---|
| 1 | Requirement collection and problem finalization | Problem statement + scope | Completed |
| 2 | Architecture and database planning | Architecture + ER draft | Completed |
| 3 | Authentication and onboarding implementation | Signup/login/onboarding APIs + UI | Completed |
| 4 | Career cards and roadmap flow integration | Card selection + roadmap generation | Completed |
| 5 | Progress tracking and dashboard | Study/progress APIs + dashboard UI | Completed |
| 6 | AI assistant integration | Assistant chat and save-roadmap flow | Completed |
| 7 | Mock interview module | Create/join/score/complete interview | Completed |
| 8 | Group chat and real-time messaging | WebSocket chat rooms + history | Completed |
| 9 | Testing, debugging, optimization | Integration checks + bug fixes | Completed |
| 10 | Documentation and final packaging | Report + diagrams + demo assets | In Progress |

---

## Table 14: API Endpoint Summary (Extra)
**Add in:** `System Analysis and Design` (after architecture section)  
**Columns:** 5

| Method | Endpoint | Auth Required | Module | Purpose |
|---|---|---|---|---|
| POST | `/signup` | No | Auth | Create user account |
| POST | `/login` | No | Auth | Login and return JWT |
| GET | `/fields` | No | Career | Fetch learning fields |
| GET | `/career-cards` | No | Career | Fetch career cards |
| POST | `/onboarding-answers` | Yes | Onboarding | Save onboarding answers |
| POST | `/generate-roadmap` | Yes | Roadmap | Generate personalized roadmap |
| GET | `/roadmap/:card_id` | Yes | Roadmap | Get user roadmap for card |
| POST | `/progress` | Yes | Progress | Update subtopic completion |
| POST | `/study-session/start` | Yes | Study | Start study session |
| POST | `/study-session/end` | Yes | Study | End study session |
| POST | `/assistant/chat` | Yes | Assistant | AI learning conversation |
| POST | `/mock-interviews` | Yes | Mock Interview | Create interview request |
| GET | `/chat/:card_id/ws` | Token query | Chat | Real-time group chat |

---

## Table 15: Database Entity Summary (Extra)
**Add in:** `Data Architecture` subsection  
**Columns:** 4

| Table Name | Primary Key | Important Columns | Purpose |
|---|---|---|---|
| users | id | name, email, provider, onboarded | Store user identity and status |
| career_cards | id | name, field, description, icon | Available career paths |
| roadmaps | id | user_id, card_id, level, is_ai_generated | User learning roadmap header |
| topics | id | roadmap_id, title, difficulty, order_index | Roadmap topic structure |
| subtopics | id | topic_id, title | Topic decomposition |
| user_progresses | id | user_id, subtopic_id, completed | Progress tracking |
| study_sessions | id | user_id, subtopic_id, start_time, duration | Study analytics |
| chat_messages | id | card_id, user_id, content, created_at | Group chat history |
| mock_interviews | id | requester_id, responder_id, topic, status | Interview sessions |
| mock_interview_questions | id | interview_id, for_user_id, question, score | Interview Q&A records |
| mock_interview_results | id | interview_id, user_id, total_score, max_score | Final interview outcomes |

---

## Table 16: Test Case Summary (Extra)
**Add in:** `Simulation Design and Implementation` (before observations/results)  
**Columns:** 5

| Test ID | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-01 | Signup + login | JWT issued and redirect works | JWT stored and redirected | Pass |
| TC-02 | Onboarding submission | Answers saved and cards recommended | Data persisted and cards returned | Pass |
| TC-03 | Roadmap generation | AI roadmap created and saved | Roadmap/topics/subtopics persisted | Pass |
| TC-04 | Progress update | Subtopic completion toggles correctly | Completion state updated in UI and DB | Pass |
| TC-05 | Study timer flow | Session start/end stores duration | Duration computed and shown in stats | Pass |
| TC-06 | Assistant roadmap save | Assistant-generated roadmap persisted | Card/roadmap created and visible | Pass |
| TC-07 | Mock interview round flow | Question generation and scoring works | Scores saved and result generated | Pass |
| TC-08 | WebSocket group chat | Real-time messaging between participants | Messages broadcast and stored | Pass |

---

## Word formatting tips for clean marks

- Keep heading style consistent with template.
- Use same font as template (`Times New Roman`) in final report body.
- Keep table captions above table, figure captions below figure.
- Use concise row text; avoid paragraph-sized cells.
- Ensure table numbering is continuous and update `List of Tables` before final submission.
