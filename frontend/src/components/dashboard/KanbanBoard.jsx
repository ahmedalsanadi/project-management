"use client";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/services/task.service";

export default function KanbanBoard() {
  const queryClient = useQueryClient();

  // Fetch tasks using React Query
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskService.getAllTasks,
  });

  // Organize tasks into columns
  const columns = {
    pending: { title: "Pending", items: [] },
    in_progress: { title: "In Progress", items: [] },
    completed: { title: "Completed", items: [] },
  };

  tasks.forEach((task) => {
    if (columns[task.status]) {
      columns[task.status].items.push(task);
    }
  });

  // Task status update mutation
  const updateTaskStatusMutation = useMutation({
    mutationFn: ({ id, status }) => taskService.updateTaskStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries(["tasks"]);

      const previousTasks = queryClient.getQueryData(["tasks"]);

      queryClient.setQueryData(["tasks"], (oldTasks) =>
        oldTasks.map((task) =>
          task.id === id ? { ...task, status } : task
        )
      );

      return { previousTasks };
    },
    onError: (error, variables, context) => {
      console.error("Failed to update task status:", error);
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["tasks"]);
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
                  {isLoading ? (
                    <p>Loading...</p>
                  ) : (
                    column.items.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-4 mb-2 rounded shadow"
                          >
                            <h3 className="font-medium">{task.title}</h3>
                            <p className="text-sm text-gray-600">{task.description}</p>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
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
