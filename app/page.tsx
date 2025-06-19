"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlgorithmSelector } from "@/components/algorithm-selector"
import { ProcessList } from "@/components/process-list"
import { GanttChart } from "@/components/gantt-chart"
import { ResultsTable } from "@/components/results-table"
import { MetricsCard } from "@/components/metrics-card"
import type { Process, SchedulingResult, SchedulingAlgorithm } from "@/types/scheduling"
import {
  fcfsScheduling,
  sjfScheduling,
  roundRobinScheduling,
  priorityScheduling,
  priorityPreemptiveScheduling,
  srtfScheduling,
} from "@/lib/scheduling-algorithms"
import { ThemeToggle } from "@/components/theme-toggle"

export default function OSScheduler() {
  const [processes, setProcesses] = useState<Process[]>([])
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SchedulingAlgorithm>("FCFS")
  const [timeQuantum, setTimeQuantum] = useState(2)
  const [priorityOrder, setPriorityOrder] = useState<"higher-first" | "lower-first">("lower-first")
  const [usePriority, setUsePriority] = useState(false)
  const [result, setResult] = useState<SchedulingResult | null>(null)
  const [activeTab, setActiveTab] = useState("visualization")

  const handleAddProcess = (process: Process) => {
    setProcesses([...processes, process])
  }

  const handleRemoveProcess = (id: string) => {
    setProcesses(processes.filter((p) => p.id !== id))
  }

  const handleEditProcess = (id: string, updatedProcess: Partial<Process>) => {
    setProcesses(processes.map((p) => (p.id === id ? { ...p, ...updatedProcess } : p)))
    // Clear results when processes are edited
    setResult(null)
  }

  const handleClearProcesses = () => {
    setProcesses([])
    setResult(null)
  }

  const handleUsePriorityChange = (newUsePriority: boolean) => {
    setUsePriority(newUsePriority)
    // Clear results when priority setting changes
    setResult(null)

    // If disabling priority, remove priority from existing processes
    if (!newUsePriority) {
      setProcesses(processes.map((p) => ({ ...p, priority: undefined })))
    }
  }

  const handleRunScheduling = () => {
    if (processes.length === 0) return

    let schedulingResult: SchedulingResult

    // If priority is enabled, use priority-based scheduling for all algorithms
    if (usePriority) {
      switch (selectedAlgorithm) {
        case "FCFS":
        case "SJF":
        case "SRTF":
        case "RR":
        case "Priority":
          schedulingResult = priorityScheduling(processes, priorityOrder)
          break
        case "PriorityPreemptive":
          schedulingResult = priorityPreemptiveScheduling(processes, priorityOrder)
          break
        default:
          schedulingResult = priorityScheduling(processes, priorityOrder)
      }
    } else {
      // Use original algorithms without priority
      switch (selectedAlgorithm) {
        case "FCFS":
          schedulingResult = fcfsScheduling(processes)
          break
        case "SJF":
          schedulingResult = sjfScheduling(processes)
          break
        case "RR":
          schedulingResult = roundRobinScheduling(processes, timeQuantum)
          break
        case "Priority":
          schedulingResult = priorityScheduling(processes, priorityOrder)
          break
        case "PriorityPreemptive":
          schedulingResult = priorityPreemptiveScheduling(processes, priorityOrder)
          break
        case "SRTF":
          schedulingResult = srtfScheduling(processes)
          break
        default:
          schedulingResult = fcfsScheduling(processes)
      }
    }

    setResult(schedulingResult)
    setActiveTab("visualization") // Automatically switch to visualization tab
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2 relative">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 ">OS Scheduling Algorithms Visualizer</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Algorithm Configuration Only */}
          <div className="lg:col-span-1 space-y-4">
            <AlgorithmSelector
              selectedAlgorithm={selectedAlgorithm}
              onAlgorithmChange={setSelectedAlgorithm}
              timeQuantum={timeQuantum}
              onTimeQuantumChange={setTimeQuantum}
              priorityOrder={priorityOrder}
              onPriorityOrderChange={setPriorityOrder}
              usePriority={usePriority}
              onUsePriorityChange={handleUsePriorityChange}
              onRunScheduling={handleRunScheduling}
              onClearProcesses={handleClearProcesses}
              processCount={processes.length}
            />
            {/* Process List - Show on mobile/tablet only */}
            <div className="lg:hidden">
              <ProcessList
                processes={processes}
                onRemoveProcess={handleRemoveProcess}
                onEditProcess={handleEditProcess}
                onAddProcess={handleAddProcess}
                usePriority={usePriority}
              />
            </div>
          </div>

          {/* Right Side - Results and Visualization */}
          <div className="lg:col-span-2 space-y-4">
            {/* Process List - Show on desktop only, positioned at top right */}
            <div className="hidden lg:block">
              <ProcessList
                processes={processes}
                onRemoveProcess={handleRemoveProcess}
                onEditProcess={handleEditProcess}
                onAddProcess={handleAddProcess}
                usePriority={usePriority}
              />
            </div>

            {/* Tabs for Visualization and Results */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="visualization">Visualization</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
              </TabsList>

              <TabsContent value="visualization" className="space-y-4">
                {result ? (
                  <>
                    <GanttChart result={result} />
                    <MetricsCard result={result} />
                  </>
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center h-64">
                      <div className="text-center space-y-2">
                        <p className="text-gray-500">Add processes and run scheduling to see visualization</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="results">
                {result ? (
                  <ResultsTable result={result} />
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center h-64">
                      <div className="text-center space-y-2">
                        <p className="text-gray-500">Run scheduling to see detailed results</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
