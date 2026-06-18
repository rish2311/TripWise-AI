# TripWise AI — Implementation Plan

> **Goal**: Build a production-style AI Travel Planner that goes beyond a basic take-home assignment.
> **Stack**: React + Vite + TypeScript · Node.js + Express · MongoDB Atlas · Gemini 2.5 Flash · AWS S3

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Repository Structure](#repository-structure)
4. [Database Schema](#database-schema)
5. [API Contract](#api-contract)
6. [AI Pipeline Design](#ai-pipeline-design)
7. [Phase-by-Phase Plan](#phase-by-phase-plan)
8. [Bonus Features Roadmap](#bonus-features-roadmap)
9. [Deployment Plan](#deployment-plan)

---

## Project Overview

**TripWise AI** — *Your Personal AI Travel Planner*

Users upload travel documents (flight tickets, hotel bookings, visas, etc.). The app uses Gemini 2.5 Flash to extract structured data and then generates a rich, day-by-day travel itinerary. Users can view, manage, edit, export as PDF, and share itineraries via public links.

---

## Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React + Vite + TypeScript | Core framework |
| React Router v6 | Client-side routing |
| TanStack Query | Server state & caching |
| Axios | HTTP client |
| React Hook Form + Zod | Forms & validation |
| Shadcn UI + TailwindCSS | UI components & styling |
| react-dropzone | Drag & drop file upload |
| react-markdown | Render AI-generated itinerary |
| @react-pdf/renderer | PDF export |

### Backend
| Tool | Purpose |
|---|---|
| Node.js + Express | API server |
| MongoDB + Mongoose | Database |
| JWT + bcrypt | Auth |
| multer | File parsing middleware |
| AWS SDK v3 (S3) | File storage |
| @google/generative-ai | Gemini API |
| express-validator | Request validation |
| morgan + winston | Logging |
| helmet + cors | Security |

---

## Repository Structure

```
tripwise-ai/
├── client/                        # React + Vite frontend
│   └── src/
│       ├── api/                   # Axios instances & API calls
│       ├── components/            # Shared UI components
│       ├── features/              # Feature-scoped modules
│       │   ├── auth/
│       │   ├── upload/
│       │   ├── itinerary/
│       │   └── share/
│       ├── hooks/                 # Custom React hooks
│       ├── layouts/               # Page layouts
│       ├── pages/                 # Route-level pages
│       ├── routes/                # Protected/public route wrappers
│       ├── types/                 # TypeScript types/interfaces
│       ├── utils/                 # Helpers & formatters
│       └── store/                 # Zustand / context state
│
└── server/                        # Express backend
    └── src/
        ├── config/                # DB, S3, Gemini config
        ├── controllers/           # Route handlers (thin layer)
        ├── services/              # Business & AI logic
        │   ├── ai.service.js
        │   ├── s3.service.js
        │   └── itinerary.service.js
        ├── middleware/            # Auth, error, multer
        ├── models/                # Mongoose schemas
        ├── routes/                # Express route definitions
        ├── utils/                 # Helpers
        ├── validators/            # express-validator chains
        ├── prompts/               # Gemini prompt templates
        └── app.js
```

---

## Database Schema

### User
```js
{
  _id: ObjectId,
  name: String,
  email: String,       // unique
  password: String,    // bcrypt hashed
  createdAt: Date
}
```

### Document
```js
{
  _id: ObjectId,
  userId: ObjectId,    // ref: User
  fileUrl: String,     // S3 URL
  s3Key: String,       // for deletion
  fileType: String,    // 'flight' | 'hotel' | 'train' | 'bus' | 'visa' | 'other'
  mimeType: String,
  uploadedAt: Date
}
```

### Itinerary
```js
{
  _id: ObjectId,
  userId: ObjectId,    // ref: User
  documentId: ObjectId,
  title: String,
  destination: String,
  startDate: Date,
  endDate: Date,
  extractedData: {     // structured JSON from Gemini
    flights: Array,
    hotels: Array,
    trains: Array,
    otherDetails: Object
  },
  itinerary: String,   // Markdown (day-by-day)
  isEdited: Boolean,
  shareId: String,     // nanoid, set on share
  isShared: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Contract

### Auth
```
POST   /api/auth/register        → { token, user }
POST   /api/auth/login           → { token, user }
GET    /api/auth/me              → { user }          [Protected]
```

### Documents
```
POST   /api/documents/upload     → { documentId }    [Protected, multipart]
GET    /api/documents/:id        → { document }      [Protected]
DELETE /api/documents/:id        → { message }       [Protected]
```

### Itineraries
```
POST   /api/itineraries/generate        → { itinerary }   [Protected]
       Body: { documentId }

GET    /api/itineraries                 → [itinerary[]]   [Protected]
GET    /api/itineraries/:id             → { itinerary }   [Protected]
PATCH  /api/itineraries/:id             → { itinerary }   [Protected]
DELETE /api/itineraries/:id             → { message }     [Protected]

POST   /api/itineraries/:id/share       → { shareUrl }    [Protected]
GET    /api/share/:shareId              → { itinerary }   [Public]
```

---

## AI Pipeline Design

```
User Uploads File
      │
      ▼
File Validation (type, size, extension)
      │
      ▼
Upload to AWS S3 → store fileUrl + s3Key
      │
      ▼
Pass file buffer to Gemini 2.5 Flash (multimodal)
      │
      ▼
  [Prompt 1 — Extraction]
  Return structured JSON: flights, hotels, trains, dates, destination
      │
      ▼
Validate & sanitize extracted JSON
      │
      ▼
  [Prompt 2 — Itinerary Generation]
  Generate day-wise itinerary in Markdown
      │
      ▼
Save Document + Itinerary to MongoDB
      │
      ▼
Return itinerary to client
```

### Prompt 1 — Extraction
```
You are a travel document parser. Extract all travel information from the attached document.

Return ONLY valid JSON:
{
  "flights": [{ "airline", "flightNumber", "departureCity", "arrivalCity", "departureTime", "arrivalTime" }],
  "hotels":  [{ "hotelName", "checkIn", "checkOut", "location" }],
  "trains":  [{ "trainName", "trainNumber", "from", "to", "departureTime" }],
  "destination": "",
  "startDate": "",
  "endDate": "",
  "travelers": ""
}
If a field is not found, use null.
```

### Prompt 2 — Itinerary Generation
```
You are an expert travel planner. Create a comprehensive day-by-day itinerary based on:
{extracted_json}

Requirements:
- Day-wise plan from arrival to departure
- Budget-friendly tourist attractions
- Food recommendations (local cuisine)
- Transportation tips between locations
- Hotel check-in/check-out reminders
- Time estimates for each activity

Return the itinerary in clean Markdown with Day headers.
```

---

## Phase-by-Phase Plan

---

### Phase 1 — Project Setup & Scaffolding
**Duration**: 2–3 hours

#### Tasks
- [ ] Create monorepo `tripwise-ai/` with `client/` and `server/` folders
- [ ] Frontend: scaffold with `npm create vite@latest client -- --template react-ts`
- [ ] Frontend: install all dependencies (shadcn, tailwind, tanstack-query, axios, zod, react-hook-form, react-router-dom, react-dropzone)
- [ ] Frontend: configure TailwindCSS + Shadcn UI
- [ ] Backend: `npm init` in `server/`, install all dependencies
- [ ] Backend: Express app with helmet, cors, morgan
- [ ] Backend: Connect to MongoDB Atlas
- [ ] Backend: ESLint + Prettier on both sides
- [ ] Backend: `.env.example` with all required keys

#### Environment Variables
```env
PORT=5000
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=
GEMINI_API_KEY=
CLIENT_URL=http://localhost:5173
```

**Deliverable**: Both client and server running locally. `GET /api/health` returns `{ status: "ok" }`.

---

### Phase 2 — Authentication
**Duration**: 4–5 hours

#### Backend
- [ ] `User` Mongoose model
- [ ] `auth.validator.js` (name, email, password rules)
- [ ] `auth.service.js` → hash password, compare, sign JWT
- [ ] `auth.controller.js` → register, login, getMe
- [ ] `auth.routes.js`
- [ ] `authMiddleware.js` → verify JWT, attach `req.user`

#### Frontend
- [ ] Zustand auth store (token + user)
- [ ] `LoginPage` with React Hook Form + Zod
- [ ] `RegisterPage` with React Hook Form + Zod
- [ ] `ProtectedRoute` wrapper
- [ ] `PublicRoute` wrapper (redirect if logged in)
- [ ] Axios interceptor → attach `Authorization: Bearer <token>`
- [ ] Persist token in localStorage, restore on load

**Deliverable**: User can register, login, access protected dashboard. Token persists on refresh.

---

### Phase 3 — File Upload
**Duration**: 4 hours

#### Backend
- [ ] AWS S3 client in `config/s3.js`
- [ ] `s3.service.js` → `uploadToS3(file)`, `deleteFromS3(key)`
- [ ] `multer` middleware (memory storage, 10MB limit)
- [ ] File type validation: `pdf`, `png`, `jpg`, `jpeg`, `webp`
- [ ] `Document` Mongoose model
- [ ] `documents.controller.js` → upload handler
- [ ] `documents.routes.js`

#### Frontend
- [ ] `UploadPage` with `react-dropzone`
- [ ] Drag-and-drop zone with accepted file types shown
- [ ] Upload progress indicator
- [ ] File preview (image thumbnail or PDF icon)
- [ ] Error handling
- [ ] On success → store `documentId`, navigate to generate step

**Deliverable**: Files stored in S3, document record in MongoDB.

---

### Phase 4 — AI Data Extraction
**Duration**: 6 hours

#### Backend
- [ ] Gemini client in `config/gemini.js`
- [ ] `prompts/extraction.prompt.js`
- [ ] `ai.service.js` → `extractTravelData(fileBuffer, mimeType)`
  - Send file to Gemini as multimodal input
  - Parse and validate returned JSON
- [ ] Robust error handling (invalid JSON, Gemini errors, retries)

#### Frontend
- [ ] Trigger extraction automatically after upload
- [ ] Loading state: *"AI is reading your document..."*
- [ ] Display extracted data preview card (flights, hotels, destination)

**Deliverable**: Uploading a flight ticket returns structured JSON with travel details.

---

### Phase 5 — Itinerary Generation
**Duration**: 5 hours

#### Backend
- [ ] `prompts/itinerary.prompt.js`
- [ ] Extend `ai.service.js` → `generateItinerary(extractedData)`
- [ ] `Itinerary` Mongoose model
- [ ] `itinerary.service.js` → orchestrates extraction + generation + DB save
- [ ] `itinerary.controller.js` → `POST /api/itineraries/generate`

#### Frontend
- [ ] *"Generate Itinerary"* button after extraction preview
- [ ] Loading state: *"Building your travel plan..."*
- [ ] Navigate to `TripDetailPage` on success
- [ ] Render markdown itinerary with `react-markdown`
- [ ] AI Trip Summary Card: destination, duration, flights, hotels, dates

**Deliverable**: User gets a full day-by-day itinerary from a document upload.

---

### Phase 6 — Itinerary Management
**Duration**: 3 hours

#### Backend
- [ ] `GET /api/itineraries` → list all user itineraries
- [ ] `GET /api/itineraries/:id` → single itinerary
- [ ] `DELETE /api/itineraries/:id` → delete itinerary + document + S3 file
- [ ] `PATCH /api/itineraries/:id` → update title or itinerary content

#### Frontend
- [ ] `MyTripsPage` → grid of trip cards (destination, dates, delete button)
- [ ] `TripDetailPage`:
  - AI Summary Card
  - Full markdown itinerary
  - Edit button (toggle editable textarea, save to backend)
  - Share button
  - Download PDF button
- [ ] Delete with confirmation dialog

**Deliverable**: User can browse all trips, view details, edit, and delete.

---

### Phase 7 — Sharing
**Duration**: 2 hours

#### Backend
- [ ] `POST /api/itineraries/:id/share` → generate `nanoid`, set `isShared = true`, return `shareUrl`
- [ ] `GET /api/share/:shareId` → public route, returns itinerary if shared

#### Frontend
- [ ] Share button → call API → copy link to clipboard
- [ ] Toast: *"Link copied to clipboard!"*
- [ ] `SharedTripPage` at `/share/:shareId`
  - Read-only public itinerary
  - TripWise AI branding
  - *"Plan your trip with TripWise AI"* CTA

**Deliverable**: Any itinerary shareable via public URL, no login required.

---

### Phase 8 — Polish & Deployment
**Duration**: 5 hours

#### UI Polish
- [ ] Responsive design (mobile-first)
- [ ] Loading skeletons (not spinners)
- [ ] Empty states for My Trips
- [ ] Toast notifications for all actions
- [ ] 404 page + global error boundary

#### PDF Export
- [ ] `@react-pdf/renderer` → `ItineraryPDF` component
- [ ] *"Download PDF"* button on TripDetailPage

#### Google Maps Links (Bonus)
- [ ] Parse attraction names from markdown
- [ ] Link each to `https://maps.google.com/?q=<attraction>`

#### Deployment
- [ ] **Frontend** → Vercel (set `VITE_API_URL`)
- [ ] **Backend** → Render (set all env vars, health check `/api/health`)
- [ ] **Database** → MongoDB Atlas
- [ ] **Storage** → AWS S3
- [ ] Full end-to-end smoke test on production URLs

**Deliverable**: Production-ready, fully deployed application on public URLs.

---

## Bonus Features Roadmap

| Feature | Priority | Recommended Phase |
|---|---|---|
| Drag & Drop Upload | High | Phase 3 |
| AI Trip Summary Card | High | Phase 5 |
| PDF Export | Medium | Phase 8 |
| Editable Itinerary | Medium | Phase 6 |
| Google Maps Links | Medium | Phase 8 |
| Multiple Doc Upload | Low | Post-launch |
| Email Sharing | Low | Post-launch |

---

## Deployment Plan

```
Frontend  →  Vercel          (React + Vite build)
Backend   →  Render          (Node.js + Express)
Database  →  MongoDB Atlas   (Free tier M0)
Storage   →  AWS S3          (us-east-1)
AI        →  Gemini 2.5 Flash (Google AI Studio API key)
```

### Production Env Checklist
- [ ] `MONGODB_URI` → Atlas connection string
- [ ] `JWT_SECRET` → strong random secret
- [ ] `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` + `AWS_REGION` + `AWS_BUCKET_NAME`
- [ ] `GEMINI_API_KEY`
- [ ] `CLIENT_URL` → Vercel production URL
- [ ] `VITE_API_URL` → Render backend URL (set in Vercel env)

---

## What Will Impress Reviewers

> In priority order:

1. **Clean backend architecture** — services vs controllers, AI logic inside `services/`
2. **Proper AI pipeline** — Extraction → Structured JSON → Itinerary (not just PDF → OpenAI)
3. **Good database design** — proper refs, shareId pattern
4. **Shareable itinerary links** — public `/share/:shareId`
5. **Strong UI/UX** — loading states, empty states, responsive
6. **S3 integration** — not local disk storage
7. **PDF export** — huge UX win
8. **Editable itineraries** — shows product thinking
