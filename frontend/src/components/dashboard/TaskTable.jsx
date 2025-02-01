'use client';
import { useState } from 'react';
import { User, Clock, AlertCircle, Edit, Trash2, Eye } from 'lucide-react';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import TaskFormModal from '@/components/common/TaskFormModal'; // Import the new TaskFormModal
import { taskService } from '@/services/task.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function TaskTable({ tasks }) {
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Mutation for deleting a task
  const deleteTaskMutation = useMutation({
    mutationFn: (id) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });

  // Mutation for updating a task
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, taskData }) => taskService.updateTask(id, taskData),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });

  // Handle deleting a task
  const handleDeleteTask = async () => {
    if (taskToDelete) {
      await deleteTaskMutation.mutateAsync(taskToDelete);
      setIsDeleteModalOpen(false);
    }
  };

  // Handle updating a task
  const handleUpdateTask = async (taskData) => {
    await updateTaskMutation.mutateAsync({
      id: taskToEdit.id,
      taskData,
    });
    setIsEditModalOpen(false);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Assigned To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Deadline
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {task.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{task.assigned_user?.name || 'Unassigned'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      {task.deadline
                        ? new Date(task.deadline).toLocaleDateString()
                        : 'No deadline'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{task.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-4">
                    <a
                      href={`/dashboard/tasks/${task.id}`}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <Eye className="w-5 h-5" />
                    </a>
                    <button
                      onClick={() => {
                        setTaskToEdit(task);
                        setIsEditModalOpen(true);
                      }}
                      className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setTaskToDelete(task.id);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteTask}
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
        />
      )}

      {/* Edit Task Modal */}
      {isEditModalOpen && (
        <TaskFormModal
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateTask}
          initialData={taskToEdit}
        />
      )}
    </>
  );
}