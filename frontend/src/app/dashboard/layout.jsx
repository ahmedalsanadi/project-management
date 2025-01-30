import ClientSidebar from "@/components/dashboard/ClientSidebar";
import { Navbar } from '@/components/dashboard/Navbar';

export default function DashboardLayout({ children }) {
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
     {/* <ClientSidebar /> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Navbar /> */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}