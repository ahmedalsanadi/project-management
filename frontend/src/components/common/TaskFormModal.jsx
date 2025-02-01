'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/services/task.service';
import { toast, Toaster } from 'react-hot-toast';

const TaskFormModal = ({ onClose, onSubmit, initialData, projectId }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    project_id: projectId || '',
    assigned_to: '',
    deadline: '',
    status: 'pending',
  });
  

  const queryClient = useQueryClient();

  const {
    data: members,
    isLoading: isMembersLoading,
    isError: isMembersError,
  } = useQuery({
    queryKey: ['members'],
    queryFn: () => taskService.getMembers(),
  });

  useEffect(() => {
    if (initialData) {
      setTaskData({
        title: initialData.title,
        description: initialData.description,
        project_id: initialData.project_id,
        assigned_to: initialData.assigned_to,
        deadline: initialData.deadline,
        status: initialData.status,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(taskData);
      toast.success('Task submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit the task!');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {initialData ? 'Edit Task' : 'Create New Task'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              value={taskData.title}
              onChange={(e) =>
                setTaskData({ ...taskData, title: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              value={taskData.description}
              onChange={(e) =>
                setTaskData({ ...taskData, description: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Assigned To
            </label>
            <select
              value={taskData.assigned_to}
              onChange={(e) =>
                setTaskData({ ...taskData, assigned_to: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              {isMembersLoading ? (
                <option>Loading members...</option>
              ) : isMembersError ? (
                <option>Error loading members</option>
              ) : (
                members?.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Deadline
            </label>
            <input
              type="date"
              value={taskData.deadline}
              onChange={(e) =>
                setTaskData({ ...taskData, deadline: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              value={taskData.status}
              onChange={(e) =>
                setTaskData({ ...taskData, status: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
