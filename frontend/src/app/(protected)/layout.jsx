import { Navbar } from '@/components/dashboard/Navbar';
import { Sidebar } from '@/components/dashboard/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 ">

          <main className="p-6 bg-gray-100/50 dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">{children}</main>
        </div>
      </div>
    </div>
  );
}
