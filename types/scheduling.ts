export interface Process {
  id: string
  name: string
  arrivalTime: number
  burstTime: number
  priority?: number
  startTime?: number
  completionTime?: number
  turnaroundTime?: number
  waitingTime?: number
  responseTime?: number
  remainingTime?: number
}

export interface GanttSegment {
  processName: string
  startTime: number
  endTime: number
}

export interface SchedulingResult {
  processes: Process[]
  ganttChart: GanttSegment[]
  algorithm: string
}

export type SchedulingAlgorithm = "FCFS" | "SJF" | "SRTF" | "RR" | "Priority" | "PriorityPreemptive"
