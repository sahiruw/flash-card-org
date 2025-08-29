import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="container mx-auto max-w-5xl px-4 py-8 flex-grow">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-4 text-[color:var(--primary)]">MediNotes Organizer</h1>
            <p className="mb-6 text-lg">
              Easily manage and organize your medical study notes. Extract markdown text from any source,
              organize by subject, and access your notes anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/add" className="btn-primary text-center">
                Add New Note
              </Link>
              <Link href="/subjects" className="btn-secondary text-center">
                Manage Subjects
              </Link>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Image
              src="/file.svg"
              alt="Notes illustration"
              width={320}
              height={320}
              className="dark:invert"
              priority
            />
          </div>
        </div>
        
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="card">
            <h3 className="text-xl font-bold mb-2 text-[color:var(--primary)]">Extract Markdown</h3>
            <p>
              Easily extract markdown content from any text. Just paste your content and the app will
              automatically identify and extract markdown for you.
            </p>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-bold mb-2 text-[color:var(--primary)]">Organize by Subject</h3>
            <p>
              Keep your notes organized by subject. Create custom subjects and categorize your notes
              for easy retrieval later.
            </p>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-bold mb-2 text-[color:var(--primary)]">Section Navigation</h3>
            <p>
              Each note is automatically divided into sections based on headers. Quickly jump between
              sections for efficient studying.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="bg-[color:var(--card)] border-t border-[color:var(--border)] py-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <div className="container mx-auto">
          MediNotes Organizer © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}

        