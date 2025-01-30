'use client';

import { useState, useEffect } from 'react';
import { taskService } from '@/services/task.service';
import KanbanBoard from '@/components/dashboard/KanbanBoard';
import { List, LayoutKanban } from 'lucide-react';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState('kanban');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded ${
              view === 'list'
                ? 'bg-indigo-100 text-indigo-600'
                : 'text-gray-600'
            }`}
          >
            <List className="h-5 w-5" />
          </button>
          <button
            onClick={() => setView('kanban')}
            className={`p-2 rounded ${
              view === 'kanban'
                ? 'bg-indigo-100 text-indigo-600'
                : 'text-gray-600'
            }`}
          >
            <LayoutKanban className="h-5 w-5" />
          </button>
        </div>
      </div>

      {view === 'kanban' ? (
        <KanbanBoard tasks={tasks} onTaskUpdate={loadTasks} />
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <li key={task.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-indigo-600 truncate">
                      {task.title}
                    </h3>
                    <div className="ml-2 flex-shrink-0 flex">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          task.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : task.status === 'in_progress'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="text-sm text-gray-500">
                        {task.description}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>Due {new Date(task.deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
