
import { Navbar } from '@/components/dashboard/Navbar';
import { Sidebar } from '@/components/dashboard/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="h-screen flex overflow-hiddenbg-gray-50 dark:bg-gray-900">
    <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar /> 
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}