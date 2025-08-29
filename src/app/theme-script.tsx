"use client";

export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              const savedTheme = localStorage.getItem('theme');
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              
              if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.add('light');
              }
            } catch (err) { 
              // In case localStorage is blocked
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
            }
          })();
        `,
      }}
    />
  );
}
