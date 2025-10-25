"use client"

import type { Task } from "@/types/task"
import { Button } from "@/components/ui/button"

export default function TaskItem({
  task,
  isSelected,
  onSelect,
  onDelete,
  onToggleCompletion,
}: {
  task: Task
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onToggleCompletion: () => void
}) {
  const formatDistanceToNow = (date: Date): string => {
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 0) {
      const absMins = Math.abs(diffMins)
      if (absMins < 60) return `${absMins} minute${absMins !== 1 ? "s" : ""} ago`
      const absHours = Math.floor(absMins / 60)
      if (absHours < 24) return `${absHours} hour${absHours !== 1 ? "s" : ""} ago`
      const absDays = Math.floor(absMins / 1440)
      return `${absDays} day${absDays !== 1 ? "s" : ""} ago`
    }

    if (diffMins < 60) return `in ${diffMins} minute${diffMins !== 1 ? "s" : ""}`
    if (diffHours < 24) return `in ${diffHours} hour${diffHours !== 1 ? "s" : ""}`
    return `in ${diffDays} day${diffDays !== 1 ? "s" : ""}`
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
      case "low":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
      default:
        return "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
    }
  }

  const isDeadlineSoon = task.deadline && new Date(task.deadline) < new Date(Date.now() + 24 * 60 * 60 * 1000)
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && !task.completed

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all ${
        isSelected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
          : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700"
      } ${task.completed ? "opacity-60" : ""} ${isOverdue ? "border-red-500 bg-red-50 dark:bg-red-950" : ""}`}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onSelect}
        className="w-5 h-5 mt-1 rounded border-slate-300 dark:border-slate-600 cursor-pointer"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1">
            <button
              onClick={onToggleCompletion}
              className={`text-left font-semibold text-lg transition-all ${
                task.completed ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-white"
              }`}
            >
              {task.title}
            </button>
            {isOverdue && <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-1">⚠️ Overdue</p>}
            {isDeadlineSoon && !isOverdue && (
              <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold mt-1">⏰ Due soon</p>
            )}
          </div>
          <Button
            onClick={onDelete}
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900"
          >
            Delete
          </Button>
        </div>

        {task.description && <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">{task.description}</p>}

        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
          </span>

          {task.deadline && (
            <span className="text-xs text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded-full">
              {formatDistanceToNow(new Date(task.deadline))}
            </span>
          )}

          {task.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
