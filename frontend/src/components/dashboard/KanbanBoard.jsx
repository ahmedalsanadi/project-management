'use client';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/services/task.service';
import { Clock, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

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

export default function KanbanBoard({ tasks: initialTasks }) {
  const [localTasks, setLocalTasks] = useState(initialTasks);
  const queryClient = useQueryClient();

  const getColumns = (tasksData) => {
    const cols = {
      pending: { title: 'Pending', items: [] },
      in_progress: { title: 'In Progress', items: [] },
      completed: { title: 'Completed', items: [] },
    };

    tasksData.forEach((task) => {
      if (cols[task.status]) {
        cols[task.status].items.push(task);
      }
    });

    return cols;
  };

  const columns = getColumns(localTasks);

  const updateTaskStatusMutation = useMutation({
    mutationFn: ({ id, status }) => taskService.updateTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['project']);
    },
    onError: (error, variables) => {
      setLocalTasks((prev) =>
        prev.map((task) =>
          task.id.toString() === variables.id.toString()
            ? { ...task, status: variables.previousStatus }
            : task
        )
      );
      toast.error(error.message || 'Failed to update task status');
    },
  });

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    const updatedTasks = localTasks.map((task) =>
      task.id.toString() === draggableId
        ? { ...task, status: destination.droppableId }
        : task
    );

    setLocalTasks(updatedTasks);
    toast.success('Task updated successfully!');

    updateTaskStatusMutation.mutate({
      id: draggableId,
      status: destination.droppableId,
      previousStatus: source.droppableId,
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[36rem] w-full">
        {Object.entries(columns).map(([columnId, column]) => (
          <div key={columnId} className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
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
                  className={`flex-1 rounded-lg p-2 ${columnStyles[columnId]} min-h-[200px]`}
                >
                  {column.items.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-white dark:bg-gray-800 p-3 mb-2 rounded-lg shadow-sm 
                            ${taskStyles[task.status]} 
                            ${snapshot.isDragging ? 'shadow-lg' : 'hover:shadow-md'}
                            transition-shadow duration-200`}
                        >
                          <h3 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
                            {task.title}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                            {task.description}
                          </p>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <User className="w-3 h-3" />
                              <span className="truncate">{task.assigned_user?.name || 'Unassigned'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="w-3 h-3" />
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