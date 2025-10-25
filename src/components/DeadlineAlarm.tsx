"use client";

import { useEffect, useState } from "react";
import type { Task } from "@/types/task";

export default function DeadlineAlarm({ tasks }: { tasks: Task[] }) {
  const [alarmedTasks, setAlarmedTasks] = useState<Set<string>>(new Set());

  useEffect(() => {
    const checkDeadlines = () => {
      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

      tasks.forEach((task) => {
        if (task.deadline && !task.completed && !alarmedTasks.has(task.id)) {
          const deadline = new Date(task.deadline);

          if (deadline > now && deadline <= oneHourFromNow) {
            if (
              "Notification" in window &&
              Notification.permission === "granted"
            ) {
              new Notification("Task Deadline Approaching!", {
                body: `"${task.title}" is due in less than an hour`,
                icon: "/favicon.ico",
              });
            }

            alert(
              `⏰ Deadline Alert!\n\n"${task.title}" is due soon!\n\nDeadline: ${deadline.toLocaleString()}`,
            );

            setAlarmedTasks((prev) => new Set([...prev, task.id]));
          }
        }
      });
    };

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    checkDeadlines();
    const interval = setInterval(checkDeadlines, 60000);

    return () => clearInterval(interval);
  }, [tasks, alarmedTasks]);

  return null;
}
