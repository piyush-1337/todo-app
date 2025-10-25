export interface Task {
  id: string
  title: string
  description: string
  deadline: string
  priority: "low" | "medium" | "high"
  tags: string[]
  completed: boolean
}
