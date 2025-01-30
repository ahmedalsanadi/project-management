import { UserMenu } from './UserMenu';
import ThemeSwitch from '@/components/common/ThemeSwitch';

export function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold">Project Management</h1>
          </div>
          {/* Client component handles user-related actions */}
          <div className="flex items-center gap-4">
            <ThemeSwitch />
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
