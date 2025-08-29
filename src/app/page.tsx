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

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
