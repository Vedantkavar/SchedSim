import type { Process, SchedulingResult, GanttSegment } from "@/types/scheduling"

export function fcfsScheduling(processes: Process[]): SchedulingResult {
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime)
  const ganttChart: GanttSegment[] = []
  let currentTime = 0

  const result = sortedProcesses.map((process) => {
    const startTime = Math.max(currentTime, process.arrivalTime)
    const completionTime = startTime + process.burstTime

    ganttChart.push({
      processName: process.name,
      startTime,
      endTime: completionTime,
    })

    currentTime = completionTime

    return {
      ...process,
      startTime,
      completionTime,
      turnaroundTime: completionTime - process.arrivalTime,
      waitingTime: startTime - process.arrivalTime,
      responseTime: startTime - process.arrivalTime,
    }
  })

  return {
    processes: result,
    ganttChart,
    algorithm: "First Come First Serve (FCFS)",
  }
}

export function sjfScheduling(processes: Process[]): SchedulingResult {
  const ganttChart: GanttSegment[] = []
  const completed: Process[] = []
  const remaining = [...processes]
  let currentTime = 0

  while (remaining.length > 0) {
    const available = remaining.filter((p) => p.arrivalTime <= currentTime)

    if (available.length === 0) {
      currentTime = Math.min(...remaining.map((p) => p.arrivalTime))
      continue
    }

    const shortest = available.reduce((min, p) => (p.burstTime < min.burstTime ? p : min))

    const startTime = currentTime
    const completionTime = startTime + shortest.burstTime

    ganttChart.push({
      processName: shortest.name,
      startTime,
      endTime: completionTime,
    })

    completed.push({
      ...shortest,
      startTime,
      completionTime,
      turnaroundTime: completionTime - shortest.arrivalTime,
      waitingTime: startTime - shortest.arrivalTime,
      responseTime: startTime - shortest.arrivalTime,
    })

    currentTime = completionTime
    remaining.splice(remaining.indexOf(shortest), 1)
  }

  return {
    processes: completed,
    ganttChart,
    algorithm: "Shortest Job First (SJF)",
  }
}

export function srtfScheduling(processes: Process[]): SchedulingResult {
  const ganttChart: GanttSegment[] = []
  const completed: Process[] = []
  const remaining = processes.map((p) => ({ ...p, remainingTime: p.burstTime, startTime: -1 }))
  let currentTime = 0

  while (remaining.some((p) => p.remainingTime! > 0)) {
    const available = remaining.filter((p) => p.arrivalTime <= currentTime && p.remainingTime! > 0)

    if (available.length === 0) {
      currentTime++
      continue
    }

    const shortest = available.reduce((min, p) => (p.remainingTime! < min.remainingTime! ? p : min))

    if (shortest.startTime === -1) {
      shortest.startTime = currentTime
    }

    shortest.remainingTime!--
    currentTime++

    // Add to Gantt chart or extend existing segment
    if (ganttChart.length === 0 || ganttChart[ganttChart.length - 1].processName !== shortest.name) {
      ganttChart.push({
        processName: shortest.name,
        startTime: currentTime - 1,
        endTime: currentTime,
      })
    } else {
      ganttChart[ganttChart.length - 1].endTime = currentTime
    }

    if (shortest.remainingTime === 0) {
      completed.push({
        ...shortest,
        completionTime: currentTime,
        turnaroundTime: currentTime - shortest.arrivalTime,
        waitingTime: currentTime - shortest.arrivalTime - shortest.burstTime,
        responseTime: shortest.startTime! - shortest.arrivalTime,
      })
    }
  }

  return {
    processes: completed.sort(
      (a, b) => processes.findIndex((p) => p.id === a.id) - processes.findIndex((p) => p.id === b.id),
    ),
    ganttChart,
    algorithm: "Shortest Remaining Time First (SRTF)",
  }
}

export function roundRobinScheduling(processes: Process[], timeQuantum: number): SchedulingResult {
  const ganttChart: GanttSegment[] = []
  const completed: Process[] = []

  // Create working copies with remaining time and response tracking
  const processMap = new Map(
    processes.map((p) => [
      p.id,
      {
        ...p,
        remainingTime: p.burstTime,
        startTime: -1,
        completionTime: 0,
        turnaroundTime: 0,
        waitingTime: 0,
        responseTime: 0,
      },
    ]),
  )

  const readyQueue: string[] = [] // Queue of process IDs
  let currentTime = 0
  let processIndex = 0 // Track which processes we've checked for arrival

  // Sort processes by arrival time for easier processing
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime)

  // Add initial process(es) that arrive at time 0
  while (processIndex < sortedProcesses.length && sortedProcesses[processIndex].arrivalTime <= currentTime) {
    readyQueue.push(sortedProcesses[processIndex].id)
    processIndex++
  }

  while (readyQueue.length > 0 || processIndex < sortedProcesses.length) {
    // If no processes in ready queue, advance time to next arrival
    if (readyQueue.length === 0) {
      currentTime = sortedProcesses[processIndex].arrivalTime
      readyQueue.push(sortedProcesses[processIndex].id)
      processIndex++
    }

    // Get the next process from the front of the queue
    const currentProcessId = readyQueue.shift()!
    const currentProcess = processMap.get(currentProcessId)!

    // Set response time if this is the first time the process runs
    if (currentProcess.startTime === -1) {
      currentProcess.startTime = currentTime
      currentProcess.responseTime = currentTime - currentProcess.arrivalTime
    }

    // Calculate execution time (min of time quantum and remaining time)
    const executionTime = Math.min(timeQuantum, currentProcess.remainingTime)
    const startTime = currentTime
    const endTime = currentTime + executionTime

    // Add to Gantt chart
    ganttChart.push({
      processName: currentProcess.name,
      startTime: startTime,
      endTime: endTime,
    })

    // Update process and time
    currentProcess.remainingTime -= executionTime
    currentTime = endTime

    // Check for newly arrived processes during this execution
    while (processIndex < sortedProcesses.length && sortedProcesses[processIndex].arrivalTime <= currentTime) {
      readyQueue.push(sortedProcesses[processIndex].id)
      processIndex++
    }

    // If process is completed
    if (currentProcess.remainingTime === 0) {
      currentProcess.completionTime = currentTime
      currentProcess.turnaroundTime = currentTime - currentProcess.arrivalTime
      currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime
      completed.push(currentProcess)
    } else {
      // Process still has remaining time, add it back to the end of the queue
      readyQueue.push(currentProcessId)
    }
  }

  // Sort completed processes back to original order
  const result = completed.sort(
    (a, b) => processes.findIndex((p) => p.id === a.id) - processes.findIndex((p) => p.id === b.id),
  )

  return {
    processes: result,
    ganttChart,
    algorithm: `Round Robin (Time Quantum: ${timeQuantum})`,
  }
}

export function priorityScheduling(
  processes: Process[],
  priorityOrder: "higher-first" | "lower-first" = "lower-first",
): SchedulingResult {
  const ganttChart: GanttSegment[] = []
  const completed: Process[] = []
  const remaining = [...processes]
  let currentTime = 0

  while (remaining.length > 0) {
    const available = remaining.filter((p) => p.arrivalTime <= currentTime)

    if (available.length === 0) {
      currentTime = Math.min(...remaining.map((p) => p.arrivalTime))
      continue
    }

    const highest = available.reduce((max, p) => {
      const pPriority = p.priority ?? (priorityOrder === "higher-first" ? 0 : 999)
      const maxPriority = max.priority ?? (priorityOrder === "higher-first" ? 0 : 999)

      if (priorityOrder === "higher-first") {
        return pPriority > maxPriority ? p : max
      } else {
        return pPriority < maxPriority ? p : max
      }
    })

    const startTime = currentTime
    const completionTime = startTime + highest.burstTime

    ganttChart.push({
      processName: highest.name,
      startTime,
      endTime: completionTime,
    })

    completed.push({
      ...highest,
      startTime,
      completionTime,
      turnaroundTime: completionTime - highest.arrivalTime,
      waitingTime: startTime - highest.arrivalTime,
      responseTime: startTime - highest.arrivalTime,
    })

    currentTime = completionTime
    remaining.splice(remaining.indexOf(highest), 1)
  }

  const orderText =
    priorityOrder === "higher-first" ? "Higher Number = Higher Priority" : "Lower Number = Higher Priority"

  return {
    processes: completed,
    ganttChart,
    algorithm: `Priority Scheduling (Non-Preemptive) - ${orderText}`,
  }
}

export function priorityPreemptiveScheduling(
  processes: Process[],
  priorityOrder: "higher-first" | "lower-first" = "lower-first",
): SchedulingResult {
  const ganttChart: GanttSegment[] = []
  const completed: Process[] = []
  const remaining = processes.map((p) => ({ ...p, remainingTime: p.burstTime, startTime: -1 }))
  let currentTime = 0

  while (remaining.some((p) => p.remainingTime! > 0)) {
    const available = remaining.filter((p) => p.arrivalTime <= currentTime && p.remainingTime! > 0)

    if (available.length === 0) {
      currentTime++
      continue
    }

    const highest = available.reduce((max, p) => {
      const pPriority = p.priority ?? (priorityOrder === "higher-first" ? 0 : 999)
      const maxPriority = max.priority ?? (priorityOrder === "higher-first" ? 0 : 999)

      if (priorityOrder === "higher-first") {
        return pPriority > maxPriority ? p : max
      } else {
        return pPriority < maxPriority ? p : max
      }
    })

    if (highest.startTime === -1) {
      highest.startTime = currentTime
    }

    highest.remainingTime!--
    currentTime++

    // Add to Gantt chart or extend existing segment
    if (ganttChart.length === 0 || ganttChart[ganttChart.length - 1].processName !== highest.name) {
      ganttChart.push({
        processName: highest.name,
        startTime: currentTime - 1,
        endTime: currentTime,
      })
    } else {
      ganttChart[ganttChart.length - 1].endTime = currentTime
    }

    if (highest.remainingTime === 0) {
      completed.push({
        ...highest,
        completionTime: currentTime,
        turnaroundTime: currentTime - highest.arrivalTime,
        waitingTime: currentTime - highest.arrivalTime - highest.burstTime,
        responseTime: highest.startTime! - highest.arrivalTime,
      })
    }
  }

  const orderText =
    priorityOrder === "higher-first" ? "Higher Number = Higher Priority" : "Lower Number = Higher Priority"

  return {
    processes: completed.sort(
      (a, b) => processes.findIndex((p) => p.id === a.id) - processes.findIndex((p) => p.id === b.id),
    ),
    ganttChart,
    algorithm: `Priority Scheduling (Preemptive) - ${orderText}`,
  }
}
