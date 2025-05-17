import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { VoteProvider } from "@/context/VoteContext";
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeScript from "@/components/theme/ThemeScript";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TheEnd.page - Créez votre page de fin personnalisée",
  description: "Créez une page marquant la fin d'un job, d'un projet, d'une relation, ou d'un serveur avec TheEnd.page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className="transition-colors duration-300">
      <head>
        {/* Script pour éviter le flash initial (FOUC) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const storedTheme = localStorage.getItem('theme');
                  if (storedTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else if (storedTheme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if(prefersDark) {
                      document.documentElement.classList.add('dark');
                    }
                  }
                } catch (e) {
                  console.error(e);
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300`}
      >
        <ThemeScript />
        <ThemeProvider>
          <AuthProvider>
            <VoteProvider>
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </VoteProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
