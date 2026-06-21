# RepoMind AI — Product Requirements Document

**Version:** 1.1  
**Status:** Draft  
**Last Updated:** June 2026 (rev. — RAG layer, RepositoryFile, analysis status, MVP contributor mode scope)  

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Solution Statement](#2-solution-statement)
3. [Target Users & Personas](#3-target-users--personas)
4. [MVP Features](#4-mvp-features)
5. [Future Features](#5-future-features)
6. [Competitive Analysis](#6-competitive-analysis)
7. [System Architecture](#7-system-architecture)
8. [Database Design](#8-database-design)

---

## 1. Problem Statement

### Why Developers Struggle with Large GitHub Repositories

Modern open-source projects have grown enormously in scale and complexity. A repository like React, Kubernetes, or VS Code can contain **thousands of files** spread across dozens of directories, each with its own conventions, abstractions, and undocumented decisions.

Developers face several compounding problems:

- **Documentation is incomplete or stale.** READMEs often describe setup but rarely explain _why_ the codebase is structured the way it is. Architecture decisions live in the heads of the original authors, or are buried in years of closed GitHub issues.
- **Understanding architecture takes hours or days.** A new engineer joining a team must manually trace function calls, read unrelated files, and build a mental model from scratch before they can write a single useful line of code.
- **Tribal knowledge is invisible.** Naming conventions, coding patterns, and folder structures are rarely documented. Contributors are expected to infer them.
- **Search doesn't explain.** Tools like `grep` or GitHub's built-in search can locate code, but cannot explain what it does or how it connects to the rest of the system.

### Why Contributing to Open Source is Difficult

Open-source contribution has a famously steep onboarding cliff. Even experienced engineers struggle to make their first pull request to an unfamiliar project.

- **No clear starting point.** The `CONTRIBUTING.md` file, when it exists, typically describes _process_ (how to fork, how to submit a PR) but not _substance_ (which files to read first, which concepts to understand, which issues are genuinely approachable).
- **"Good first issue" labels are misleading.** An issue tagged as beginner-friendly may still require deep familiarity with the codebase to implement correctly. There is no context about prerequisites.
- **Fear of wasting maintainer time.** New contributors often abandon efforts mid-way because they are unsure if their approach is correct, and do not want to submit a bad PR.
- **Tech stack mismatch.** A developer skilled in Python may not know which open-source Python projects actively welcome contributors, or which ones have healthy maintainer response times.

### Why Students Find Unfamiliar Codebases Overwhelming

For students and junior developers, reading production code is a qualitatively different experience from writing tutorial code.

- **Production codebases are non-linear.** Unlike tutorials, real code is tangled with abstractions, design patterns, and historical decisions that are not explained inline.
- **No teacher to ask.** A student working through an open-source repo at 11pm cannot ask the original author why a particular pattern was chosen.
- **The gap between "I learned React" and "I can contribute to React" is enormous.** Students frequently overestimate how ready they are — or underestimate the gap — leading to frustration and disengagement from open source entirely.

---

## 2. Solution Statement

> **RepoMind AI helps developers understand, navigate, and contribute to GitHub repositories using AI-generated explanations, architecture insights, real-time chat, and personalized contributor onboarding.**

RepoMind bridges the gap between "I found an interesting repo" and "I made my first contribution" by treating the codebase as a conversational artifact rather than a static pile of files. It combines repository analysis, a context-aware AI chat interface, and a contributor copilot into a single, focused product.

---

## 3. Target Users & Personas

### Persona 1 — GSoC Aspirant

| Attribute | Detail |
|-----------|--------|
| **Name** | Arjun, 21 |
| **Background** | Third-year CS undergraduate applying to Google Summer of Code |
| **Goal** | Get accepted to a GSoC program by demonstrating meaningful open-source contributions |
| **Technical Level** | Intermediate — comfortable with one or two languages, limited production codebase experience |

**Pain Points:**
- Cannot understand large repositories well enough to identify where to start contributing.
- Doesn't know which issues are genuinely suitable for his current skill level vs. which ones look easy but require deep context.
- Spends days reading code without making meaningful progress.
- Has no structured path from "I want to contribute" to "I submitted a PR."

**How RepoMind Helps:**  
The Contributor Copilot matches Arjun's skill level to appropriate issues, explains what he needs to learn before starting each one, and gives him a step-by-step contribution roadmap.

---

### Persona 2 — Student Developer

| Attribute | Detail |
|-----------|--------|
| **Name** | Priya, 19 |
| **Background** | First-year engineering student exploring open source for the first time |
| **Goal** | Understand how real software is built and make her first open-source contribution |
| **Technical Level** | Beginner — knows the basics of Python and JavaScript from coursework |

**Pain Points:**
- Finds open-source projects intimidating — the scale and unfamiliarity of production code feels overwhelming.
- Does not know how to read a codebase systematically.
- Has no mentor or guide to ask basic questions ("What does this folder do?", "Why is this file called that?").
- Gets discouraged quickly when she cannot make sense of what she's reading.

**How RepoMind Helps:**  
The Repo Chat lets Priya ask natural-language questions about any part of the codebase and get plain-English answers. The architecture overview gives her a map before she dives in.

---

### Persona 3 — Software Engineer

| Attribute | Detail |
|-----------|--------|
| **Name** | Marcus, 29 |
| **Background** | Full-stack engineer at a mid-sized startup, 5 years of professional experience |
| **Goal** | Quickly ramp up on a new open-source library he's integrating into his team's stack |
| **Technical Level** | Advanced — strong production experience, reads code fluently |

**Pain Points:**
- Needs to understand a new codebase in hours, not days — he doesn't have time for slow exploration.
- Wants to understand _architectural decisions_, not just surface-level code structure.
- Specific questions ("Where does this library handle retries?", "What's the error handling strategy?") take too long to answer through manual search.

**How RepoMind Helps:**  
The Repo Chat gives Marcus instant, grounded answers to specific architectural questions. The tech stack analysis gives him a fast overview of dependencies and patterns before he digs in.

---

### Persona 4 — Tech Recruiter / Interview Candidate

| Attribute | Detail |
|-----------|--------|
| **Name** | Neha, 26 |
| **Background** | Software engineer preparing for technical interviews at top-tier companies |
| **Goal** | Understand the open-source projects listed on her resume deeply enough to discuss them confidently in interviews |
| **Technical Level** | Intermediate — has used several open-source libraries, written some contributions |

**Pain Points:**
- Wants to be able to explain the architecture and key design decisions of repos she has contributed to.
- Needs repository-specific preparation — not generic "how does React work" answers, but answers grounded in the actual code.
- Current tools don't connect "what is in this codebase" to "what would an interviewer ask."

**How RepoMind Helps:**  
Repo Chat lets Neha explore any repository in depth and ask the kinds of questions interviewers typically ask. _(Future feature: interview question generation per repo.)_

---

## 4. MVP Features

The MVP focuses on three core features that deliver the core value loop: understand → ask → contribute.

---

### 4.1 Repository Analysis

**Input:** A GitHub repository URL (public repos in MVP; private repos in future versions).

**Processing:**
1. Fetch file tree and key files via GitHub API.
2. Extract `README`, `package.json` / `requirements.txt` / `Cargo.toml`, and top-level folder structure.
3. Run analysis via Gemini API to generate structured output.

**Output:**

| Field | Description |
|-------|-------------|
| **Project Summary** | 2–4 sentence plain-English overview of what the project does and who it's for |
| **Tech Stack** | List of languages, frameworks, databases, and major dependencies detected |
| **Folder Structure** | Annotated directory tree with a one-line explanation of each top-level folder |
| **Entry Points** | Key files to read first (e.g., `index.ts`, `main.py`, `App.jsx`) |

**Example output (folder structure):**
```
vercel/next.js
├── packages/        # Monorepo — individual Next.js packages
├── app/             # App Router implementation (RSC, layouts, routing)
├── pages/           # Pages Router implementation (legacy)
├── test/            # Integration and unit tests
├── docs/            # Documentation source files
└── scripts/         # Build and release automation
```

---

### 4.2 Repository Chat

An AI chat interface grounded in the actual contents of the repository. Users can ask questions in natural language and receive answers that reference specific files and line numbers.

**Example questions:**
- "How does authentication work in this project?"
- "Where is the database configuration located?"
- "What does the `useSession` hook do and where is it defined?"
- "Which files would I need to modify to add a new API endpoint?"
- "Explain the middleware pipeline in plain English."

**Behavior:**
- Answers cite specific files and directories from the repo.
- Follow-up questions maintain conversational context.
- Chat history is saved per repository session.
- Responses are grounded — the model does not hallucinate files that don't exist.

---

### 4.3 Contributor Mode

A structured onboarding mode that gives a developer a learning path into the codebase — without touching GitHub Issues. Issue matching is intentionally deferred to V2 (see section 5) because it requires a separate subsystem: GitHub Issues API integration, label filtering, skill matching, and a ranking algorithm. Adding it to MVP would double the surface area of this feature before the core is validated.

**Input:** User's self-reported skill level (beginner / intermediate / advanced) and primary languages.

**Output:**

| Section | Content |
|---------|---------|
| **Important files** | The 3–5 files most central to understanding how the codebase works — entry points, core modules, key abstractions |
| **Suggested reading order** | A sequenced list of files and folders, from high-level to low-level, with a one-line reason for each step |
| **Learning path** | Prerequisite concepts and patterns to understand before the code will make sense (e.g. "This project uses the observer pattern — read about that first") |
| **Setup guide** | How to clone, install, and run the project locally — extracted from README and CONTRIBUTING.md, presented in plain language |

**What this is not (V2):** Issue matching, label filtering, and skill-to-issue ranking are deferred. V1 contributor mode is purely a learning and orientation tool.

---

## 5. Future Features

These features are planned for post-MVP releases. They are intentionally excluded from v1 to keep scope focused.

| Feature | Description | Priority |
|---------|-------------|----------|
| **Contributor copilot — issue matching** | GitHub Issues API integration, label filtering, skill-to-issue ranking, and matched issue cards (moved from MVP) | High |
| **Architecture diagrams** | Auto-generated visual diagrams of the codebase structure, data flow, and service boundaries | High |
| **Security analysis** | Identify common vulnerability patterns, outdated dependencies with known CVEs, and insecure configurations | High |
| **Dependency analysis** | Deep dive into the dependency graph — direct vs. transitive, license analysis, maintenance status | Medium |
| **Interview question generation** | Generate likely interview questions based on the repo's architecture and the user's level of familiarity | Medium |
| **Repository comparison** | Side-by-side comparison of two repos — architecture, tech stack, community health, onboarding difficulty | Medium |
| **Private repository support** | Connect via GitHub OAuth to analyze private repos | High |
| **PR review assistant** | AI review of a user's draft pull request against the repo's conventions | High |
| **Contributor leaderboard** | Community features — track and celebrate contributors discovered through RepoMind | Low |

---

## 6. Competitive Analysis

### Platform Comparison

| Product | What it does | Key weakness |
|---------|-------------|--------------|
| **ExplainGitHub** | Generates plain-English summaries of GitHub repositories | Explanation only — no chat, no contributor onboarding, no issue matching |
| **Sourcegraph** | Powerful code search and navigation across repositories | Extremely complex interface built for experienced engineers; no AI explanations; overwhelming for beginners |
| **GitHub Copilot** | In-editor AI code generation and completion | Operates at the file level — does not explain entire repos, architecture, or help contributors find where to start |
| **CodeSee** | Automated codebase maps and architecture visualizations | Visualization only — no conversational interface, no contributor mode |
| **Mintlify** | AI-powered documentation generation | Documentation output only — not an exploration or contribution tool |

---

### RepoMind Differentiator

RepoMind is the only tool that combines repository understanding, real-time conversational exploration, and contributor onboarding in a single workflow. Specifically:

**1. Contributor-first design**  
Every other tool is built for engineers who already know what they're doing. RepoMind is explicitly designed for the person who is _not yet_ comfortable — the student, the GSoC aspirant, the first-time contributor.

**2. Personalized learning paths**  
RepoMind doesn't just show you issues — it tells you what you need to learn before you can solve each one, and gives you a sequenced roadmap for getting there. No other tool does this.

**3. Conversational codebase exploration**  
Unlike search tools (Sourcegraph) that require you to know what you're looking for, RepoMind lets you ask open-ended questions ("How does X work?") and get grounded, contextual answers.

**4. Open-source focused**  
GitHub Copilot is built for professional software development. RepoMind is built specifically for open-source discovery, exploration, and contribution — a use case no major tool fully addresses.

**5. Repo discovery**  
No existing tool lets you say "I know Python and Django — find me an active repo with good first issues." RepoMind's repo explorer closes this gap.

---

## 7. System Architecture

The system has two distinct runtime paths: an **indexing pipeline** that runs once per repository (or per new commit), and a **query pipeline** that runs on every chat message.

### 7.1 Indexing pipeline (runs once per repo / commit)

```
GitHub API
  ↓
Repository Files (.ts, .py, .md, .json, .yaml, ...)
  ↓
Chunker  (split by function / class / section boundary)
  ↓
Embeddings Model  (text-embedding-004 via Gemini)
  ↓
Vector Store  (pgvector in PostgreSQL, keyed by repo + commit SHA)
```

The indexing step is triggered when a user submits a new GitHub URL, or when the stored commit SHA for a repo differs from the latest on `main`. Results are cached — re-indexing only runs on new commits, not on every chat message.

### 7.2 Query pipeline (runs on every chat message)

```
User Question
  ↓
Query Embedder  (same model as indexing — consistency is critical)
  ↓
Vector Search  (cosine similarity against stored chunk embeddings)
  ↓
Retrieved Chunks  (top-k code snippets with file path + line numbers)
  ↓
Context Builder  (user question + retrieved chunks → grounded prompt)
  ↓
Gemini  (generates answer citing specific files and line numbers)
```

Without this layer, Gemini has no knowledge of the repository's actual contents and will hallucinate plausible-sounding but incorrect answers. The RAG pipeline is what makes chat responses grounded and trustworthy.

### 7.3 Full system view

```
┌─────────────────────────────────────────────────────┐
│                      USER                           │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────┐
│              Next.js Frontend                       │
│   Repo Analysis UI · Chat Interface · Copilot UI   │
└──────────────────────┬──────────────────────────────┘
                       │ REST / JSON
                       ▼
┌─────────────────────────────────────────────────────┐
│              Express.js API Server                  │
│   /api/analyze · /api/chat · /api/issues · /api/auth│
└───────┬──────────────────────────┬──────────────────┘
        │                          │
        ▼                          ▼
┌──────────────┐        ┌──────────────────────────────┐
│  GitHub API  │        │         PostgreSQL            │
│              │        │  ┌─────────────────────────┐ │
│ - File tree  │        │  │  Relational tables       │ │
│ - Issues     │        │  │  users, repos, analyses  │ │
│ - Repo meta  │        │  │  chat_history            │ │
└──────┬───────┘        │  └─────────────────────────┘ │
       │                │  ┌─────────────────────────┐ │
       ▼                │  │  pgvector extension      │ │
  File contents ──────► │  │  chunk embeddings        │ │
  (indexing)            │  │  keyed by repo+SHA       │ │
                        │  └─────────────────────────┘ │
                        └──────────────┬───────────────┘
                                       │ top-k chunks
                                       ▼
                              ┌─────────────────┐
                              │   Gemini API     │
                              │                  │
                              │ - Embeddings     │
                              │ - Chat (RAG)     │
                              │ - Analysis       │
                              └─────────────────┘
```

**Technology Choices:**

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | Next.js (App Router) | SSR for fast initial load; React ecosystem |
| API | Express.js (Node) | Lightweight, well-suited for API orchestration |
| Embeddings + LLM | Gemini API | `text-embedding-004` for indexing; `gemini-1.5-pro` for chat — same provider, consistent vector space |
| Vector store | pgvector (PostgreSQL extension) | Avoids a separate vector DB in MVP; cosine similarity search built in |
| Relational DB | PostgreSQL + pgvector | Single database handles both relational data and vector search |
| Auth | JWT + bcrypt | Simple, stateless, well-understood |
| Hosting | Vercel (frontend) + Railway (API + DB) | Low operational overhead for MVP |

### 7.4 Key implementation notes

**Chunking strategy matters.** Splitting files by character count loses semantic boundaries. Split instead at function/class/method boundaries using a syntax-aware parser (e.g. Tree-sitter). Each chunk should carry metadata: `{ file_path, start_line, end_line, language, repo_id, commit_sha }`.

**Cache embeddings by commit SHA.** Store the last-indexed commit SHA per repo. On each request, compare against the GitHub API's latest SHA. Only re-index changed files, not the entire repo.

**Top-k retrieval + re-ranking.** Retrieve top-20 chunks by cosine similarity, then re-rank by file relevance (e.g. prioritise files closer to entry points) before passing the top-5 to Gemini. This improves answer quality without increasing token cost.

---

## 8. Database Design

### Entity Relationship Overview

```
User ──< Repository ──< Analysis
                  └──< ChatHistory
```

---

### Entity: User

Stores registered user accounts.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `name` | VARCHAR(255) | Display name |
| `email` | VARCHAR(255) | Unique, used for login |
| `password` | VARCHAR(255) | bcrypt hash — never stored plain |
| `createdAt` | TIMESTAMP | Account creation timestamp |

---

### Entity: Repository

Represents a GitHub repository that has been submitted for analysis.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `githubUrl` | TEXT | Full GitHub URL (e.g. `https://github.com/vercel/next.js`) |
| `name` | VARCHAR(255) | Repository name (e.g. `next.js`) |
| `owner` | VARCHAR(255) | GitHub username or org (e.g. `vercel`) |
| `description` | TEXT | Short description pulled from GitHub API |
| `status` | ENUM | Analysis status — `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED` |
| `createdAt` | TIMESTAMP | When it was first added to RepoMind |

**Analysis status lifecycle:**

```
PENDING → PROCESSING → COMPLETED
                    ↘ FAILED
```

- `PENDING` — URL submitted, job queued, no processing started yet
- `PROCESSING` — files are being fetched, chunked, and embedded
- `COMPLETED` — all pipeline steps finished; chat and contributor mode are available
- `FAILED` — pipeline encountered an error (rate limit, private repo, timeout); retryable

This field is what the frontend polls to show a progress state instead of a blank screen. Without it, the UI has no way to distinguish "still loading" from "something went wrong".

---

### Entity: RepositoryFile

Stores the parsed contents of individual files fetched from GitHub. This is the source of truth that the chunker reads from — having it in the database means the chunker can re-run without re-fetching from GitHub, and individual files can be surfaced in the UI with syntax highlighting.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `repositoryId` | UUID | Foreign key → Repository |
| `path` | TEXT | File path relative to repo root (e.g. `src/auth/middleware.ts`) |
| `content` | TEXT | Full raw file content as fetched from GitHub |
| `language` | VARCHAR(50) | Detected language (e.g. `typescript`, `python`, `markdown`) — used by chunker and syntax highlighter |
| `createdAt` | TIMESTAMP | When this file was stored |

**Why not just use ChunkEmbedding.content?** Chunks are truncated fragments; `RepositoryFile` holds the complete file. The AI needs complete file content to answer questions like "show me the full auth middleware" — a chunk boundary mid-function would give a partial and misleading answer.

---

### Entity: Analysis

Stores the output of a repository analysis run.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `repositoryId` | UUID | Foreign key → Repository |
| `summary` | TEXT | AI-generated project summary |
| `techStack` | JSONB | Array of detected technologies |
| `folderStructure` | JSONB | Annotated directory tree |
| `createdAt` | TIMESTAMP | When this analysis was generated |

---

### Entity: ChatHistory

Stores each question/answer pair from a repository chat session.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `repositoryId` | UUID | Foreign key → Repository |
| `question` | TEXT | User's question |
| `answer` | TEXT | AI-generated answer |
| `createdAt` | TIMESTAMP | Message timestamp |

---

### Entity: ChunkEmbedding

Stores vector embeddings of code chunks for semantic search (requires the `pgvector` PostgreSQL extension).

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `repositoryId` | UUID | Foreign key → Repository |
| `commitSha` | VARCHAR(40) | Git commit SHA at time of indexing — used to invalidate stale embeddings |
| `filePath` | TEXT | Relative path within the repo (e.g. `src/auth/middleware.ts`) |
| `startLine` | INTEGER | First line of this chunk |
| `endLine` | INTEGER | Last line of this chunk |
| `content` | TEXT | Raw chunk text (stored for prompt assembly) |
| `embedding` | vector(768) | Float vector from `text-embedding-004` |
| `createdAt` | TIMESTAMP | When this chunk was indexed |

---

### SQL Schema (PostgreSQL)

```sql
-- Users
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Analysis status enum
CREATE TYPE analysis_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- Repositories
CREATE TABLE repositories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_url  TEXT NOT NULL,
  name        VARCHAR(255) NOT NULL,
  owner       VARCHAR(255) NOT NULL,
  description TEXT,
  status      analysis_status NOT NULL DEFAULT 'PENDING',
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Repository files (parsed file contents)
CREATE TABLE repository_files (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repository_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
  path          TEXT NOT NULL,
  content       TEXT NOT NULL,
  language      VARCHAR(50),
  created_at    TIMESTAMP DEFAULT NOW(),
  UNIQUE (repository_id, path)
);

CREATE INDEX ON repository_files (repository_id);

-- Analyses
CREATE TABLE analyses (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repository_id    UUID REFERENCES repositories(id) ON DELETE CASCADE,
  summary          TEXT,
  tech_stack       JSONB,
  folder_structure JSONB,
  created_at       TIMESTAMP DEFAULT NOW()
);

-- Chunk embeddings (requires pgvector extension)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE chunk_embeddings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repository_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
  commit_sha    VARCHAR(40) NOT NULL,
  file_path     TEXT NOT NULL,
  start_line    INTEGER NOT NULL,
  end_line      INTEGER NOT NULL,
  content       TEXT NOT NULL,
  embedding     vector(768),
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX ON chunk_embeddings USING ivfflat (embedding vector_cosine_ops);

-- Chat history
CREATE TABLE chat_history (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repository_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
  question      TEXT NOT NULL,
  answer        TEXT NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW()
);
```

---

*End of Document — RepoMind AI PRD v1.0*