# MediNotes Organizer

A beautiful web application for organizing and managing medical study notes. This application allows users to extract Markdown content from text inputs, organize notes by subject, and view them as HTML pages.

## Features

- **Extract Markdown**: Automatically extract Markdown content from pasted text
- **Subject Organization**: Organize your notes by custom subjects
- **Section Navigation**: Each note is automatically divided into sections based on headers
- **Responsive Design**: Optimized for tablet viewing with a medical-themed pink color scheme
- **Firebase Integration**: Store and retrieve your notes from Firebase

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- Firebase account

### Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Configure Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore database
   - Copy your Firebase config
   - Rename `.env.local.example` to `.env.local` and add your Firebase configuration

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
