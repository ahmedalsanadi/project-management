'use client';
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { taskService } from '@/services/task.service';

export default function KanbanBoard({ tasks, onTaskUpdate }) {
  const [columns, setColumns] = useState({
    pending: {
      title: 'Pending',
      items: [],
    },
    in_progress: {
      title: 'In Progress',
      items: [],
    },
    completed: {
      title: 'Completed',
      items: [],
    },
  });

  useEffect(() => {
    console.log('Fetching tasks...'); // Add this log

    taskService
      .getAllTasks()
      .then((data) => {
        console.log('Received tasks:', data); // Log the actual response

        if (data) {
          const newColumns = {
            pending: { title: 'Pending', items: [] },
            in_progress: { title: 'In Progress', items: [] },
            completed: { title: 'Completed', items: [] },
          };

          data.forEach((task) => {
            if (newColumns[task.status]) {
              newColumns[task.status].items.push(task);
            } else {
              console.warn('Unexpected task status:', task.status);
            }
          });

          setColumns(newColumns);
        }
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  }, []);

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) return;

    // Remove from source
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });

    // Update task status in backend
    try {
      await taskService.updateTaskStatus(draggableId, destination.droppableId);
      onTaskUpdate && onTaskUpdate();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 h-full">
        {Object.entries(columns).map(([columnId, column]) => (
          <div key={columnId} className="flex flex-col w-80">
            <h2 className="font-semibold mb-4">{column.title}</h2>
            <Droppable droppableId={columnId}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex-1 bg-gray-100 p-4 rounded-lg"
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
                          className="bg-white p-4 mb-2 rounded shadow"
                        >
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-gray-600">
                            {task.description}
                          </p>
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
