import { SidebarNav } from "./SidebarNav";

export function Sidebar() {
  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow bg-indigo-700  dark:bg-gray-900 border-r border-indigo-600  dark:border-gray-800 pt-5 pb-4 overflow-y-auto">
          {/* Client component handles user & navigation */}
          <SidebarNav />
        </div>
      </div>
    </div>
  );
}
