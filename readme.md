This assignment is actually testing much more than "can you build a MERN app".

They are evaluating whether you can think like a software engineer and product engineer.

If I were reviewing submissions, I'd score candidates on:

1. Architecture
2. Product Thinking
3. AI Integration Design
4. Clean Code
5. Scalability
6. UX
7. Deployment

Most candidates will build:

> Upload File → OCR → OpenAI → Save Result

That's a mediocre submission.

You should build:

> Production-style AI Travel Planner Platform

---

# 1. Assignment Breakdown

## Functional Requirements

### Authentication

Required:

* Register
* Login
* JWT Authentication
* Protected Routes

APIs:

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

---

### Travel Document Upload

User uploads:

* Flight Ticket
* Hotel Booking
* Train Ticket
* Bus Ticket
* Visa
* Other Travel Documents

Supported Formats:

```txt
PDF
PNG
JPG
JPEG
WEBP
```

---

### Data Extraction

Need to extract:

Flight:

```json
{
  "airline": "Indigo",
  "flightNumber": "6E-212",
  "departureCity": "Delhi",
  "arrivalCity": "Mumbai",
  "departureTime": "...",
  "arrivalTime": "..."
}
```

Hotel:

```json
{
  "hotelName": "",
  "checkIn": "",
  "checkOut": "",
  "location": ""
}
```

---

### AI Processing

Input:

```txt
Extracted travel details
```

Output:

```txt
Day-by-Day Itinerary
```

Example:

```txt
Day 1
- Land in Mumbai
- Check into Hotel
- Visit Marine Drive

Day 2
- Gateway of India
- Colaba Causeway
...
```

---

### Itinerary Management

Store:

```text
User
   |
   |-- Itinerary 1
   |-- Itinerary 2
   |-- Itinerary 3
```

User can:

* View
* Delete
* Share

---

### Sharing

Minimum:

```text
/share/:shareId
```

Public link

Example:

```txt
tripwise.com/share/abc123
```

This is already enough.

---

# 2. Product Vision

Instead of:

```txt
AI Travel Itinerary Generator
```

Build:

```txt
TripWise AI
Your Personal AI Travel Planner
```

This sounds like a real product.

---

# 3. Suggested Tech Stack

## Frontend

```txt
React
Vite
TypeScript
React Router
TanStack Query
Axios
React Hook Form
Zod
Shadcn UI
TailwindCSS
```

---

## Backend

```txt
Node.js
Express
MongoDB
Mongoose
JWT
bcrypt
multer
```

---

## AI

Preferred:

```txt
Gemini 2.5 Flash
```

Reason:

```txt
Cheap
Fast
Excellent OCR
Multimodal
```

You can upload image directly to Gemini.

---

## File Storage

Basic:

```txt
Cloudinary
```

Bonus:

```txt
AWS S3
```

Use S3 if you want bonus points.

---

# 4. High-Level Architecture

```text
Client
   |
   v
React Frontend
   |
   v
Express API
   |
   +---- MongoDB
   |
   +---- S3
   |
   +---- Gemini API
```

---

# 5. Database Design

## User

```js
{
  _id,
  name,
  email,
  password,
  createdAt
}
```

---

## Document

```js
{
  _id,
  userId,
  fileUrl,
  fileType,
  uploadedAt
}
```

---

## Itinerary

```js
{
  _id,
  userId,

  title,

  destination,

  startDate,
  endDate,

  extractedData,

  itinerary,

  shareId,

  createdAt
}
```

---

# 6. API Design

## Auth

```http
POST /api/auth/register

POST /api/auth/login

GET /api/auth/me
```

---

## Upload

```http
POST /api/documents/upload
```

Response:

```json
{
  "documentId": "123"
}
```

---

## Generate Itinerary

```http
POST /api/itineraries/generate
```

Body:

```json
{
  "documentId": "123"
}
```

---

## Get All Itineraries

```http
GET /api/itineraries
```

---

## Get Single

```http
GET /api/itineraries/:id
```

---

## Delete

```http
DELETE /api/itineraries/:id
```

---

## Share

```http
POST /api/itineraries/:id/share
```

Response:

```json
{
  "shareUrl": "/share/abc123"
}
```

---

## Public Shared Route

```http
GET /api/share/:shareId
```

---

# 7. AI Pipeline Design

This is where most candidates lose points.

Instead of:

```text
PDF -> OpenAI
```

Build:

```text
Upload
   |
   v
File Validation
   |
   v
Storage
   |
   v
OCR / Extraction
   |
   v
Structured JSON
   |
   v
AI Itinerary Generator
   |
   v
MongoDB
```

---

## Prompt 1

Extraction Prompt

```txt
Extract travel information from this document.

Return JSON only.

Fields:
- flight details
- hotel details
- destination
- travel dates
```

---

## Prompt 2

Itinerary Prompt

```txt
Create a detailed travel itinerary.

Requirements:
- day wise
- budget friendly
- tourist attractions
- food recommendations
- transportation suggestions

Return markdown.
```

---

# 8. Frontend Pages

## Public

```txt
Landing Page
Login
Register
```

---

## Protected

```txt
Dashboard

Upload Travel Docs

Generate Itinerary

My Trips

Trip Details

Profile
```

---

## Shared Route

```txt
/share/:shareId
```

Public page.

---

# 9. Folder Structure

## Backend

```text
server
|
├── src
│
├── config
│
├── controllers
│
├── services
│
├── middleware
│
├── models
│
├── routes
│
├── utils
│
├── validators
│
├── prompts
│
├── jobs
│
└── app.js
```

Notice:

```txt
AI logic inside services
```

Not controllers.

---

## Frontend

```text
src
|
├── api
├── components
├── features
│
├── pages
│
├── hooks
│
├── layouts
│
├── routes
│
├── types
│
├── utils
│
└── store
```

---

# 10. Bonus Features That Actually Matter

If you want to stand out:

### 1. Drag and Drop Upload

```txt
react-dropzone
```

---

### 2. AI Trip Summary Card

```txt
Budget
Duration
Cities
Flights
Hotels
```

Generated automatically.

---

### 3. PDF Export

```txt
Download itinerary as PDF
```

Huge UX improvement.

---

### 4. Editable Itinerary

User can modify generated plan.

This demonstrates product thinking.

---

### 5. Google Maps Links

Each attraction includes:

```txt
Open in Google Maps
```

Massive bonus.

---

# 11. Deployment Plan

Frontend:

```txt
Vercel
```

Backend:

```txt
Render
```

Database:

```txt
MongoDB Atlas
```

Storage:

```txt
AWS S3
```

---

# 12. Recommended Phase-by-Phase Implementation

## Phase 1 — Project Setup

Duration: 2–3 hrs

* Create repositories
* Setup React
* Setup Express
* Setup MongoDB Atlas
* Setup ESLint + Prettier

Deliverable:

```txt
Project running locally
```

---

## Phase 2 — Authentication

Duration: 4–5 hrs

* Register
* Login
* JWT
* Protected Routes

Deliverable:

```txt
User can authenticate
```

---

## Phase 3 — File Upload

Duration: 4 hrs

* Multer
* S3
* Upload UI
* Validation

Deliverable:

```txt
Files stored successfully
```

---

## Phase 4 — AI Extraction

Duration: 6 hrs

* Gemini Integration
* OCR
* JSON extraction

Deliverable:

```txt
Travel details extracted
```

---

## Phase 5 — Itinerary Generation

Duration: 5 hrs

* Prompt engineering
* Structured itinerary generation

Deliverable:

```txt
Day-wise itinerary
```

---

## Phase 6 — Itinerary Management

Duration: 3 hrs

* History
* Details
* Delete

Deliverable:

```txt
Trip dashboard
```

---

## Phase 7 — Sharing

Duration: 2 hrs

* Share ID
* Public route

Deliverable:

```txt
Public itinerary pages
```

---

## Phase 8 — Polish & Deployment

Duration: 5 hrs

* Responsive UI
* Loading states
* Error handling
* Deploy

Deliverable:

```txt
Production-ready submission
```

# What Will Impress Reviewers Most?

In order of importance:

1. Clean backend architecture
2. Proper AI pipeline (Extraction → Structured JSON → Itinerary)
3. Good database design
4. Shareable itinerary links
5. Strong UI/UX
6. S3 integration
7. PDF export
8. Editable itineraries

If you execute the plan above cleanly, your project will look closer to a junior-to-mid-level production system rather than a typical take-home assignment submission.
