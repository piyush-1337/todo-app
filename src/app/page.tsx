"use client";

import { useState, useEffect } from "react";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import TaskFilters from "@/components/TaskFilters";
import DeadlineAlarm from "@/components/DeadlineAlarm";
import type { Task } from "@/types/task";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks);
        extractTags(parsedTasks);
      } catch (error) {
        console.error("Failed to load tasks:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const extractTags = (taskList: Task[]) => {
    const tags = new Set<string>();
    taskList.forEach((task) => {
      task.tags.forEach((tag) => tags.add(tag));
    });
    setAllTags(Array.from(tags));
  };

  const addTask = (task: Task) => {
    const newTask = { ...task, id: Date.now().toString() };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    extractTags(updatedTasks);
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    extractTags(updatedTasks);
  };

  const deleteMultipleTasks = (ids: string[]) => {
    const updatedTasks = tasks.filter((task) => !ids.includes(task.id));
    setTasks(updatedTasks);
    extractTags(updatedTasks);
  };

  const toggleTaskCompletion = (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    );
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => task.tags.includes(tag));
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "completed" && task.completed) ||
      (selectedStatus === "pending" && !task.completed);
    const matchesPriority =
      selectedPriority === "all" || task.priority === selectedPriority;

    return matchesTags && matchesStatus && matchesPriority;
  });

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <DeadlineAlarm tasks={tasks} />

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            My Tasks
          </h1>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6">
          <TaskForm onAddTask={addTask} />
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6">
          <TaskFilters
            allTags={allTags}
            selectedTags={selectedTags}
            selectedStatus={selectedStatus}
            selectedPriority={selectedPriority}
            onTagsChange={setSelectedTags}
            onStatusChange={setSelectedStatus}
            onPriorityChange={setSelectedPriority}
          />
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
          <TaskList
            tasks={filteredTasks}
            onDeleteTask={deleteTask}
            onDeleteMultipleTasks={deleteMultipleTasks}
            onToggleCompletion={toggleTaskCompletion}
          />
        </div>
      </div>
    </main>
  );
}
