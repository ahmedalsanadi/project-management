import AuthProvider from '@/components/providers/AuthProvider';
import './globals.css';

export const metadata = {
  title: 'Project Management',
  description: 'A project management application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
