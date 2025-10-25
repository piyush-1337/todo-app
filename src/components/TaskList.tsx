"use client";

import { useState } from "react";
import type { Task } from "@/types/task";
import TaskItem from "./TaskItem";
import { Button } from "@/components/ui/button";

export default function TaskList({
  tasks,
  onDeleteTask,
  onDeleteMultipleTasks,
  onToggleCompletion,
}: {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onDeleteMultipleTasks: (ids: string[]) => void;
  onToggleCompletion: (id: string) => void;
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSelectTask = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === tasks.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(tasks.map((t) => t.id)));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size > 0) {
      onDeleteMultipleTasks(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          No tasks found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.length > 1 && (
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedIds.size === tasks.length}
              onChange={handleSelectAll}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-600"
            />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {selectedIds.size > 0
                ? `${selectedIds.size} selected`
                : "Select all"}
            </span>
          </label>
          {selectedIds.size > 0 && (
            <Button
              onClick={handleDeleteSelected}
              variant="destructive"
              size="sm"
            >
              Delete Selected
            </Button>
          )}
        </div>
      )}

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isSelected={selectedIds.has(task.id)}
            onSelect={() => handleSelectTask(task.id)}
            onDelete={() => onDeleteTask(task.id)}
            onToggleCompletion={() => onToggleCompletion(task.id)}
          />
        ))}
      </div>
    </div>
  );
}
