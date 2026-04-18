# DAPS — Digital Asset Protection System for Sports Media

> A web-based platform that helps sports organizations **upload media**, generate **AI-powered fingerprints**, detect **unauthorized distribution**, track **content propagation**, and receive **real-time analytics** — all powered by Google Cloud.

🔗 **Live Demo**: [guardian-sport-ai.web.app](https://guardian-sport-ai.web.app)

---

## Problem

Sports organizations generate massive volumes of high-value digital media that rapidly scatter across global platforms. This vast visibility gap leaves proprietary content highly vulnerable to unauthorized redistribution and intellectual property violations.

## Solution

DAPS provides an end-to-end pipeline for protecting sports media assets:

1. **Upload** — Ingest images and videos into a secure Google Cloud Storage bucket.
2. **Analyze** — A Cloud Function triggers Gemini 1.5 Flash Vision to analyze each asset for authenticity, deepfake artifacts, and semantic content.
3. **Fingerprint** — A SynthID-style cryptographic signature is generated and stored alongside the AI analysis in Firestore.
4. **Monitor** — The dashboard shows real-time violation trends, evidence confidence, and propagation maps drawn live from Firestore.
5. **Enforce** — Security scans detect unauthorized matches across external platforms and trigger DMCA takedown workflows.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Tailwind CSS 4, Vite 8, Recharts |
| Auth | Firebase Authentication (email/password) |
| Database | Cloud Firestore (real-time sync) |
| Storage | Google Cloud Storage |
| AI/ML | Gemini 1.5 Flash Vision via `@google/generative-ai` |
| Backend | Firebase Cloud Functions (2nd Gen, Node.js 24) |
| Hosting | Firebase Hosting (global CDN + SSL) |
| CI/CD | GitHub → Firebase deploy |

## Architecture

```
User → React SPA (Firebase Hosting)
         ↓ upload
       Cloud Storage bucket
         ↓ onObjectFinalized trigger
       Cloud Function (us-east1)
         ↓ sends image/video
       Gemini 1.5 Flash Vision API
         ↓ returns analysis JSON
       Cloud Firestore (mediaLibrary collection)
         ↓ onSnapshot real-time sync
       React Dashboard (live updates)
```

## Features

- **Landing Page** — Premium animated landing with scroll reveals, 3D tilt cards, animated stat counters, and propagation map visualization.
- **Authentication** — Full login/register/forgot-password flow with Firebase Auth, protected routes, session persistence, and error normalization.
- **Upload Pipeline** — Multi-file upload with progress bars, live processing modal showing each pipeline stage, and automatic Cloud Function trigger.
- **Media Library** — Real-time Firestore-synced grid with Vertex AI semantic search, image/video preview, authenticity scores, SynthID signatures, AI semantic tags, and audit trail timeline.
- **Detection Results** — Violation evidence table with source thumbnails, match URLs, platform identification, confidence bars, and status lifecycle (Open → Reviewing → Removed).
- **Security Scan** — One-click global threat sweep that injects violation records into Firestore for immediate dashboard visibility.
- **Dashboard** — Live KPI cards (total assets, open violations, avg authenticity), 7-day violation trend chart, and external match activity map.
- **Analytics** — Monthly upload/violation/takedown bar chart, evidence source donut chart, asset type distribution, and authenticity score area chart — all from live Firestore data.
- **Alerts** — Chronological feed of violation and scan events with severity indicators.
- **Settings** — User profile editing, notification preferences, enforcement toggles, and API/security info — all persisted to Firestore.

## Security

- **Firestore rules** — Per-collection ACLs requiring authentication; `userSettings` is owner-only; `violations` and `securityScans` are read-only for clients (admin SDK writes); catch-all deny for unmatched paths.
- **Storage rules** — Auth-required uploads restricted to image/video MIME types under 100 MB; all other paths denied.
- **API keys** — Gemini key stored in `functions/.env` (gitignored), never committed to source control.

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Deploy to Firebase
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules,storage
```

## Project Structure

```
src/
├── components/
│   ├── auth/          # ProtectedRoute, PublicOnlyRoute
│   ├── landing/       # FooterSection, HowItWorksSection, ProblemSection, SolutionSection
│   └── layout/        # MainLayout, Navbar, Sidebar
├── context/           # AuthContext (Firebase Auth provider)
├── pages/             # Landing, Login, Register, ForgotPassword,
│                      # DashboardOverview, UploadMedia, MediaLibrary,
│                      # DetectionResults, Alerts, Analytics, Settings
├── firebase.js        # Firebase SDK initialization
└── main.jsx           # App entry point with AuthProvider
functions/
├── index.js           # Cloud Function: onMediaUpload (Gemini 1.5 Flash)
└── .env               # GEMINI_API_KEY (gitignored)
```

## Team

Built for the Google Cloud Hackathon 2026.

## License

MIT
