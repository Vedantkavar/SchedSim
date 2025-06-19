"use client"
//vedant
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { SchedulingAlgorithm } from "@/types/scheduling"
import { Play, Trash2, Settings, ChevronDown, Info } from "lucide-react"

interface AlgorithmSelectorProps {
  selectedAlgorithm: SchedulingAlgorithm
  onAlgorithmChange: (algorithm: SchedulingAlgorithm) => void
  timeQuantum: number
  onTimeQuantumChange: (quantum: number) => void
  priorityOrder: "higher-first" | "lower-first"
  onPriorityOrderChange: (order: "higher-first" | "lower-first") => void
  usePriority: boolean
  onUsePriorityChange: (usePriority: boolean) => void
  onRunScheduling: () => void
  onClearProcesses: () => void
  processCount: number
  onDropdownClose?: () => void
}

export function AlgorithmSelector({
  selectedAlgorithm,
  onAlgorithmChange,
  timeQuantum,
  onTimeQuantumChange,
  priorityOrder,
  onPriorityOrderChange,
  usePriority,
  onUsePriorityChange,
  onRunScheduling,
  onClearProcesses,
  processCount,
  onDropdownClose,
}: AlgorithmSelectorProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const priorityDropdownRef = useRef<HTMLDivElement>(null)
  const priorityButtonRef = useRef<HTMLButtonElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const priorityHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const algorithms = [
    {
      value: "FCFS" as SchedulingAlgorithm,
      label: "First Come First Serve",
      shortName: "FCFS",
      description: "Processes are executed in the order they arrive. Simple but can cause long waiting times.",
      info: "Non-preemptive • Fair ordering • May cause convoy effect",
    },
    {
      value: "SJF" as SchedulingAlgorithm,
      label: "Shortest Job First",
      shortName: "SJF",
      description: "Shortest burst time process is executed first. Minimizes average waiting time.",
      info: "Non-preemptive • Optimal for avg waiting time • May cause starvation",
    },
    {
      value: "SRTF" as SchedulingAlgorithm,
      label: "Shortest Remaining Time First",
      shortName: "SRTF",
      description: "Preemptive version of SJF. Process with shortest remaining time gets CPU.",
      info: "Preemptive • Dynamic priority • Context switching overhead",
    },
    {
      value: "RR" as SchedulingAlgorithm,
      label: "Round Robin",
      shortName: "RR",
      description: "Each process gets equal CPU time slices. Fair and responsive for interactive systems.",
      info: "Preemptive • Time quantum based • Good for time-sharing systems",
    },
    {
      value: "Priority" as SchedulingAlgorithm,
      label: "Priority (Non-Preemptive)",
      shortName: "Priority NP",
      description: "Processes with higher priority are executed first. Non-preemptive scheduling.",
      info: "Non-preemptive • Priority based • May cause starvation",
    },
    {
      value: "PriorityPreemptive" as SchedulingAlgorithm,
      label: "Priority (Preemptive)",
      shortName: "Priority P",
      description: "Higher priority processes can interrupt lower priority ones. Preemptive scheduling.",
      info: "Preemptive • Dynamic priority • Context switching overhead",
    },
  ]

  const priorityOptions = [
    {
      value: "higher-first" as const,
      label: "Higher Number = Higher Priority",
      shortName: "Higher First",
      description: "Priority 5 > Priority 3 > Priority 1",
    },
    {
      value: "lower-first" as const,
      label: "Lower Number = Higher Priority",
      shortName: "Lower First",
      description: "Priority 1 > Priority 3 > Priority 5",
    },
  ]

  const selectedAlgo = algorithms.find((algo) => algo.value === selectedAlgorithm)
  const selectedPriorityOption = priorityOptions.find((option) => option.value === priorityOrder)

  // Listen for external close requests
  useEffect(() => {
    if (onDropdownClose) {
      const closeDropdown = () => {
        setIsDropdownOpen(false)
        setIsPriorityDropdownOpen(false)
      }
      window.addEventListener("closeAlgorithmDropdown", closeDropdown)
      return () => window.removeEventListener("closeAlgorithmDropdown", closeDropdown)
    }
  }, [onDropdownClose])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
      if (priorityHoverTimeoutRef.current) {
        clearTimeout(priorityHoverTimeoutRef.current)
      }
    }
  }, [])

  const handleRunScheduling = async () => {
    setIsRunning(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    onRunScheduling()
    setIsRunning(false)
  }

  const handleClearProcesses = async () => {
    setIsClearing(true)
    await new Promise((resolve) => setTimeout(resolve, 300))
    onClearProcesses()
    setIsClearing(false)
  }

  const handleAlgorithmSelect = (algorithm: SchedulingAlgorithm) => {
    onAlgorithmChange(algorithm)
    setIsDropdownOpen(false)
    // Hide info when algorithm changes
    setShowInfo(false)
  }

  const handlePriorityOrderSelect = (order: "higher-first" | "lower-first") => {
    onPriorityOrderChange(order)
    setIsPriorityDropdownOpen(false)
  }

  const toggleInfo = () => {
    setShowInfo(!showInfo)
  }

  // Algorithm dropdown handlers
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    setIsDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false)
    }, 150)
  }

  const handleDropdownMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
  }

  const handleDropdownMouseLeave = () => {
    setIsDropdownOpen(false)
  }

  // Priority dropdown handlers
  const handlePriorityMouseEnter = () => {
    if (priorityHoverTimeoutRef.current) {
      clearTimeout(priorityHoverTimeoutRef.current)
    }
    setIsPriorityDropdownOpen(true)
  }

  const handlePriorityMouseLeave = () => {
    priorityHoverTimeoutRef.current = setTimeout(() => {
      setIsPriorityDropdownOpen(false)
    }, 150)
  }

  const handlePriorityDropdownMouseEnter = () => {
    if (priorityHoverTimeoutRef.current) {
      clearTimeout(priorityHoverTimeoutRef.current)
    }
  }

  const handlePriorityDropdownMouseLeave = () => {
    setIsPriorityDropdownOpen(false)
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Scheduling Algorithm
        </CardTitle>
        <CardDescription>Select and configure the scheduling algorithm</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="transition-colors duration-200">Algorithm</Label>
            <button
              onClick={toggleInfo}
              className={`relative flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-300 ease-out transform ${
                showInfo
                  ? "bg-blue-600 border-blue-600 text-white scale-110 shadow-lg shadow-blue-800/25"
                  : "text-blue-400 hover:border-blue-600 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:scale-105"
              }`}
              title="Show algorithm information"
            >
              <Info
                className={`w-3 h-3 transition-all duration-300 ease-out ${
                  showInfo ? "rotate-180" : "group-hover:rotate-12"
                }`}
              />
            </button>
          </div>

          {/* Custom Compact Dropdown Button */}
          <div className="relative" ref={dropdownRef}>
            <button
              ref={buttonRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-white/10 hover:bg-red/20 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/30 dark:border-white/20 dark:hover:border-white/30 shadow-lg hover:shadow-xl text-gray-900 dark:text-white transition-all duration-200"
            >
              <span>{selectedAlgo?.shortName}</span>
              <ChevronDown
                className={`h-3 w-3 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Content */}
            {isDropdownOpen && (
              <div
                className="absolute top-full left-0 mt-2 mx-2 min-w-[280px] z-20 rounded-lg border border-gray-400/30 dark:border-gray-500/30 backdrop-blur-md shadow-xl overflow-hidden"
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
                style={{
                  animation: "dropdownSlideDown 0.3s ease-out forwards",
                }}
              >
                <div className="p-2">
                  {algorithms.map((algo, index) => (
                    <button
                      key={algo.value}
                      onClick={() => handleAlgorithmSelect(algo.value)}
                      className={`w-full text-left px-3 mb-1 py-1.5 rounded-md text-gray-800 dark:text-gray-200 hover:bg-white/40 dark:hover:bg-gray-700/40 backdrop-blur-sm transition-all duration-200 ${
                        selectedAlgorithm === algo.value
                          ? "bg-white/40 dark:bg-gray-700/40 shadow-md backdrop-blur-sm"
                          : ""
                      }`}
                      style={{
                        animation: `fillFromTop 0.4s ease-out forwards`,
                        animationDelay: `${index * 80}ms`,
                        opacity: 0,
                        transform: "translateY(-10px)",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{algo.label}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{algo.shortName}</div>
                        </div>
                        {selectedAlgorithm === algo.value && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Selected Algorithm Information - Simplified Animation */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-out ${
              showInfo ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div
              className={`bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3 transition-all duration-500 ease-out ${
                showInfo ? "translate-y-0 scale-100" : "-translate-y-2 scale-98"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full flex-shrink-0">
                  <Info className="w-4 h-4" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="font-semibold text-lg text-blue-900 dark:text-blue-100">{selectedAlgo?.label}</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                    {selectedAlgo?.description}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-medium bg-blue-100 dark:bg-blue-900/30 px-3 py-2 rounded-md">
                    {selectedAlgo?.info}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Use Priority Toggle */}
        <div className="space-y-2 animate-in slide-in-from-top duration-300">
          <Label className="transition-colors duration-200">Use Priority</Label>
          <div className="flex gap-2">
            <button
              onClick={() => onUsePriorityChange(true)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                usePriority
                  ? "bg-green-600 border-green-600 text-white shadow-md"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => onUsePriorityChange(false)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                !usePriority
                  ? "bg-red-600 border-red-600 text-white shadow-md"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              No
            </button>
          </div>
        </div>

        {/* Round Robin Time Quantum */}
        {selectedAlgorithm === "RR" && (
          <div className="space-y-2 animate-in slide-in-from-top duration-300">
            <Label htmlFor="quantum" className="transition-colors duration-200">
              Time Quantum
            </Label>
            <Input
              id="quantum"
              type="number"
              min="1"
              value={timeQuantum}
              onChange={(e) => onTimeQuantumChange(Number.parseInt(e.target.value) || 1)}
              className="transition-all duration-200 focus:scale-[1.02] focus:shadow-md"
            />
          </div>
        )}

        {/* Priority Order Selection - Shows for all algorithms when priority is enabled */}
        {usePriority && (

          <div className="priority-container">
            {/* <div className="space-y-3 priority-pop-in priority-element"> */}
              <Label className="transition-colors duration-200">Priority Order</Label>

              {/* Custom Priority Order Dropdown Button */}
              <div className="relative" ref={priorityDropdownRef}>
                <button
                  ref={priorityButtonRef}
                  onMouseEnter={handlePriorityMouseEnter}
                  onMouseLeave={handlePriorityMouseLeave}
                  className="inline-flex mt-3 mb-1 items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-white/10 hover:bg-red/20 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/30 dark:border-white/20 dark:hover:border-white/30 shadow-lg hover:shadow-xl text-gray-900 dark:text-white transition-all duration-200"
                >
                  <span>{selectedPriorityOption?.shortName}</span>
                  <ChevronDown
                    className={`h-3 w-3 transition-transform duration-200 ${isPriorityDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Priority Dropdown Content */}
                {isPriorityDropdownOpen && (
                  
                  <div
                    className="absolute top-full pb-1 left-0 mx-2 mt-1 min-w-[280px] z-20 rounded-lg border border-gray-400/30 dark:border-gray-500/30 backdrop-blur-md shadow-xl overflow-hidden"
                    onMouseEnter={handlePriorityDropdownMouseEnter}
                    onMouseLeave={handlePriorityDropdownMouseLeave}
                    style={{
                      animation: "dropdownSlideDown 0.3s ease-out forwards",
                    }}
                  >
                    
                    <div className="p-2">
                      {priorityOptions.map((option, index) => (
                        <button
                          key={option.value}
                          onClick={() => handlePriorityOrderSelect(option.value)}
                          className={`w-full text-left px-3 mb-1 py-1.5 rounded-md text-gray-800 dark:text-gray-200 hover:bg-white/40 dark:hover:bg-gray-700/40 backdrop-blur-sm transition-all duration-200 ${
                            priorityOrder === option.value
                              ? "bg-white/40 dark:bg-gray-700/40 shadow-md backdrop-blur-sm"
                              : ""
                          }`}
                          style={{
                            animation: `fillFromTop 0.4s ease-out forwards`,
                            animationDelay: `${index * 80}ms`,
                            opacity: 0,
                            transform: "translateY(-10px)",
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-sm">{option.label}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">{option.description}</div>
                            </div>
                            {priorityOrder === option.value && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            {/* </div> */}
          </div>
        )}

        <div className="space-y-2">
          <Button onClick={handleRunScheduling} disabled={processCount === 0 || isRunning} className="w-full">
            {isRunning ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Running...
              </div>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Scheduling
              </>
            )}
          </Button>

          <Button
            onClick={handleClearProcesses}
            variant="outline"
            disabled={processCount === 0 || isClearing}
            className="w-full"
          >
            {isClearing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Clearing...
              </div>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Processes
              </>
            )}
          </Button>
        </div>

        {/* <div className="text-sm text-gray-500">Processes: {processCount}</div> */}
      </CardContent>
    </Card>
  )
}
