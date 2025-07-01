import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return format(new Date(date), "MMM dd, yyyy")
}

export function formatDateTime(date: Date | string) {
  return format(new Date(date), "MMM dd, yyyy 'at' h:mm a")
}

export function formatRelativeTime(date: Date | string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function getPriorityColor(priority: string) {
  switch (priority.toLowerCase()) {
    case "high":
      return "priority-high"
    case "medium":
      return "priority-medium"
    case "low":
      return "priority-low"
    default:
      return "priority-low"
  }
}

export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "new":
      return "status-new"
    case "in-progress":
      return "status-in-progress"
    case "resolved":
      return "status-resolved"
    case "closed":
      return "status-closed"
    default:
      return "status-new"
  }
}

export function capitalizeFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case "new":
      return "⚪"
    case "in-progress":
      return "🟡"
    case "resolved":
      return "🟢"
    case "closed":
      return "⚫"
    default:
      return "⚪"
  }
}

export function getPriorityIcon(priority: string) {
  switch (priority.toLowerCase()) {
    case "high":
      return "🔴"
    case "medium":
      return "🟡"
    case "low":
      return "🟢"
    default:
      return "🟢"
  }
}
