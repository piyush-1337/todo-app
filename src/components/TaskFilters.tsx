"use client"

import { Button } from "@/components/ui/button"

export default function TaskFilters({
  allTags,
  selectedTags,
  selectedStatus,
  selectedPriority,
  onTagsChange,
  onStatusChange,
  onPriorityChange,
}: {
  allTags: string[]
  selectedTags: string[]
  selectedStatus: string
  selectedPriority: string
  onTagsChange: (tags: string[]) => void
  onStatusChange: (status: string) => void
  onPriorityChange: (priority: string) => void
}) {
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-slate-900 dark:text-white">Filters</h3>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
        <div className="flex flex-wrap gap-2">
          {["all", "pending", "completed"].map((status) => (
            <Button
              key={status}
              onClick={() => onStatusChange(status)}
              variant={selectedStatus === status ? "default" : "outline"}
              size="sm"
              className={selectedStatus === status ? "bg-blue-600 text-white" : ""}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Priority</label>
        <div className="flex flex-wrap gap-2">
          {["all", "low", "medium", "high"].map((priority) => (
            <Button
              key={priority}
              onClick={() => onPriorityChange(priority)}
              variant={selectedPriority === priority ? "default" : "outline"}
              size="sm"
              className={selectedPriority === priority ? "bg-blue-600 text-white" : ""}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {allTags.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tags</label>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                size="sm"
                className={selectedTags.includes(tag) ? "bg-indigo-600 text-white" : ""}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
