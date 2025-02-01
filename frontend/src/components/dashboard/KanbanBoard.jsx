'use client';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/services/task.service';
import { AlertCircle, Clock, User } from 'lucide-react';

const columnStyles = {
  pending: 'bg-yellow-50 dark:bg-yellow-900/10',
  in_progress: 'bg-blue-50 dark:bg-blue-900/10',
  completed: 'bg-green-50 dark:bg-green-900/10',
};

const taskStyles = {
  pending: 'border-l-4 border-yellow-400',
  in_progress: 'border-l-4 border-blue-400',
  completed: 'border-l-4 border-green-400',
};

export default function KanbanBoard({ tasks }) {
  const queryClient = useQueryClient();

  const columns = {
    pending: { title: 'Pending', items: [] },
    in_progress: { title: 'In Progress', items: [] },
    completed: { title: 'Completed', items: [] },
  };

  tasks.forEach((task) => {
    if (columns[task.status]) {
      columns[task.status].items.push(task);
    }
  });

  const updateTaskStatusMutation = useMutation({
    mutationFn: ({ id, status }) => taskService.updateTaskStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries(['tasks']);
      const previousTasks = queryClient.getQueryData(['tasks']);
      queryClient.setQueryData(['tasks'], (oldTasks) =>
        oldTasks.map((task) => (task.id === id ? { ...task, status } : task))
      );
      return { previousTasks };
    },
    onError: (error, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;
    updateTaskStatusMutation.mutate({
      id: draggableId,
      status: destination.droppableId,
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 min-h-[36rem]">
        {Object.entries(columns).map(([columnId, column]) => (
          <div key={columnId} className="flex flex-col w-80 min-w-80">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-700 dark:text-gray-200">
                {column.title}
              </h2>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800">
                {column.items.length}
              </span>
            </div>
            <Droppable droppableId={columnId}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`flex-1 rounded-lg p-4 ${columnStyles[columnId]}`}
                >
                  {column.items.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-white dark:bg-gray-800 p-4 mb-3 rounded-lg shadow-sm 
                            ${taskStyles[task.status]} hover:shadow-md transition-shadow duration-200`}
                        >
                          <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                            {task.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            {task.description}
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <User className="w-4 h-4" />
                              <span>{task.assigned_user?.name || 'Unassigned'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span>
                                {task.deadline
                                  ? new Date(task.deadline).toLocaleDateString()
                                  : 'No deadline'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}