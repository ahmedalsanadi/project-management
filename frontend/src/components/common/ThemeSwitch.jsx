'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Loader2 } from 'lucide-react';

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Placeholder loading icon
    return (
      <div className="p-2 rounded-full text-gray-600 dark:text-gray-400 animate-spin">
        <Loader2 className="h-6 w-6" />
      </div>
    );
  }

  if (resolvedTheme === 'dark') {
    return (
      <button
        onClick={() => setTheme('light')}
        className="p-2 rounded-full text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <Sun className="h-6 w-6" />
      </button>
    );
  }

  if (resolvedTheme === 'light') {
    return (
      <button
        onClick={() => setTheme('dark')}
        className="p-2 rounded-full text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <Moon className="h-6 w-6" />
      </button>
    );
  }
}
