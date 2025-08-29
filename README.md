# PurpleNotes

A beautiful web application for organizing and managing Markdown notes. This application allows users to extract Markdown content from text inputs, organize notes by subject, and view them as HTML pages.

## Features

- **Extract Markdown**: Automatically extract Markdown content from pasted text
- **Subject Organization**: Organize your notes by custom subjects
- **Section Navigation**: Each note is automatically divided into sections based on headers
- **Responsive Design**: Optimized for mobile/tablet viewing with a beautiful purple color scheme
- **Firebase Integration**: Store and retrieve your notes from Firebase
- **Table Support**: Enhanced styling for tables with horizontal scrolling on mobile devices

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- Firebase account

### Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Configure Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore database
   - Copy your Firebase config
   - Create `.env.local` file and add your Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Deployment

### Firebase Deployment

1. Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

2. Log in to Firebase
```bash
firebase login
```

3. Deploy to Firebase
```bash
npm run deploy
```

This will build the Next.js application, generate static files, and deploy to Firebase hosting.

## Usage

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
