import AuthProvider from '@/components/providers/AuthProvider';
import './globals.css';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import { DarkModeProvider } from '@/providers/ThemeProvider';

export const metadata = {
  title: 'Project Management',
  description: 'A project management application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ReactQueryProvider>
          <DarkModeProvider>
            <AuthProvider>{children}</AuthProvider>
          </DarkModeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
