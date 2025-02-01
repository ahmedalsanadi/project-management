'use client';
import { use, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '@/services/project.service';
import { taskService } from '@/services/task.service';
import KanbanBoard from '@/components/dashboard/KanbanBoard';
import TaskTable from '@/components/dashboard/TaskTable';
import { Calendar, Clock, Users, LayoutGrid, Table, Plus } from 'lucide-react';
import { Spinner } from '@/components/common/Spinner';
import TaskFormModal from '@/components/common/TaskFormModal';

const ShowProject = ({ params }) => {
  const { id } = use(params);
  const [viewMode, setViewMode] = useState('kanban');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectService.getProject(id),
  });

  const createTaskMutation = useMutation({
    mutationFn: (taskData) => taskService.createTask(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries(['project', id]);
      setIsCreateModalOpen(false);
    },
  });

  const handleCreateTask = async (taskData) => {
    await createTaskMutation.mutateAsync({
      ...taskData,
      project_id: id,
    });
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 p-6 rounded-lg">
          <p className="text-red-600">Error: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Previous project header code remains the same */}
      <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {project.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
              {project.description}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                Created {new Date(project.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Users className="w-4 h-4" />
              <span className="text-sm">
                {project.team_members} team members
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {new Date(project.deadline).toLocaleDateString()} deadline
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Project Tasks
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                viewMode === 'kanban'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                viewMode === 'table'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>Table</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto pb-4">
          {viewMode === 'kanban' ? (
            <KanbanBoard tasks={project.tasks} />
          ) : (
            <TaskTable tasks={project.tasks} />
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      {isCreateModalOpen && (
        <TaskFormModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTask}
          projectId={id}
        />
      )}
    </div>
  );
};

export default ShowProject;
