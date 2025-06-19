"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { SchedulingResult } from "@/types/scheduling"
import { Play, Pause, RotateCcw, X, Zap, Gauge } from "lucide-react"

interface GanttChartProps {
  result: SchedulingResult
}

export function GanttChart({ result }: GanttChartProps) {
  const [showSimulation, setShowSimulation] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1000) // milliseconds per step
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const simScrollRef = useRef<HTMLDivElement | null>(null)

  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-red-500",
    "bg-teal-500",
  ]

  const getColorForProcess = (processName: string) => {
    const index = result.processes.findIndex((p) => p.name === processName)
    return colors[index % colors.length]
  }

  const totalTime = Math.max(...result.ganttChart.map((g) => g.endTime))
  const timeUnitWidth = 60 // Width per time unit

  // Generate time markers from 0 to totalTime
  const timeMarkers = Array.from({ length: totalTime + 1 }, (_, i) => i)

  // Simulation functions
  const startSimulation = () => {
    setShowSimulation(true)
    setCurrentStep(0)
    setIsPlaying(false)
  }

  const closeSimulation = () => {
    setShowSimulation(false)
    setIsPlaying(false)
    setCurrentStep(0)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const resetSimulation = () => {
    setCurrentStep(0)
    setIsPlaying(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const nextStep = () => {
    if (currentStep < result.ganttChart.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Auto-play effect
  useEffect(() => {
    if (isPlaying && currentStep < result.ganttChart.length) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= result.ganttChart.length - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, speed)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, currentStep, speed, result.ganttChart.length])

  // Get segments to show up to current step
  const visibleSegments = result.ganttChart.slice(0, currentStep + 1)
  const currentSegment = result.ganttChart[currentStep]

  // Auto-scroll effect for simulation
  useEffect(() => {
    if (currentSegment && simScrollRef.current) {
      const currentTime = currentSegment.endTime
      const scrollPosition = currentTime * timeUnitWidth - simScrollRef.current.clientWidth / 2
      simScrollRef.current.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: "smooth",
      })
    }
  }, [currentStep, currentSegment, timeUnitWidth])

  // Auto-scroll to end for main chart
  useEffect(() => {
    if (scrollRef.current && result.ganttChart.length > 0) {
      const lastSegment = result.ganttChart[result.ganttChart.length - 1]
      const scrollPosition = lastSegment.endTime * timeUnitWidth - scrollRef.current.clientWidth / 2
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: "smooth",
        })
      }, 500)
    }
  }, [result.ganttChart, timeUnitWidth])

  return (
    <>
      <Card className="transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gantt Chart</CardTitle>
              <CardDescription>Process execution timeline starting from time 0</CardDescription>
            </div>
            <Button
              onClick={startSimulation}
              className="bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Zap className="w-4 h-4 mr-2" />
              Simulate
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Scrollable container */}
            <div ref={scrollRef} className="overflow-x-auto border rounded-lg bg-gray-50 dark:bg-gray-900 p-4">
              <div style={{ width: `${totalTime * timeUnitWidth}px`, minWidth: "100%" }}>
                {/* Time markers at top */}
                <div className="relative mb-4" style={{ height: "30px" }}>
                  {timeMarkers.map((time) => (
                    <div
                      key={time}
                      className="absolute text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-2 py-1 rounded border"
                      style={{
                        left: `${time * timeUnitWidth}px`,
                        transform: "translateX(-50%)",
                      }}
                    >
                      {time}
                    </div>
                  ))}
                </div>

                {/* Vertical grid lines */}
                <div className="relative">
                  {timeMarkers.map((time) => (
                    <div
                      key={`grid-${time}`}
                      className="absolute top-0 w-px h-20 bg-gray-300 dark:bg-gray-600"
                      style={{ left: `${time * timeUnitWidth}px` }}
                    />
                  ))}

                  {/* Process segments */}
                  <div className="relative" style={{ height: "60px" }}>
                    {result.ganttChart.map((segment, index) => (
                      <div
                        key={index}
                        className={`${getColorForProcess(segment.processName)} absolute top-2 bottom-2 flex items-center justify-center text-white font-bold text-lg border-r border-white/20`}
                        style={{
                          left: `${segment.startTime * timeUnitWidth}px`,
                          width: `${(segment.endTime - segment.startTime) * timeUnitWidth}px`,
                        }}
                        title={`${segment.processName}: ${segment.startTime} → ${segment.endTime}`}
                      >
                        {segment.processName}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time markers at bottom */}
                <div className="relative mt-4" style={{ height: "30px" }}>
                  {timeMarkers.map((time) => (
                    <div
                      key={`bottom-${time}`}
                      className="absolute text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-2 py-1 rounded border"
                      style={{
                        left: `${time * timeUnitWidth}px`,
                        transform: "translateX(-50%)",
                      }}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Process Legend */}
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-6 transition-colors duration-300">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Process Legend</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.processes.map((process, index) => (
                  <div
                    key={process.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center gap-3 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md"
                  >
                    <div className={`w-6 h-6 rounded ${colors[index % colors.length]} flex-shrink-0`}></div>
                    <div className="flex-1">
                      <div className="text-gray-900 dark:text-white font-bold text-lg">{process.name}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">BT: {process.burstTime}u</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Execution Timeline */}
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-6 transition-colors duration-300">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Execution Timeline</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-200 dark:scrollbar-track-gray-800">
                {result.ganttChart.map((segment, index) => {
                  const processIndex = result.processes.findIndex((p) => p.name === segment.processName)
                  const duration = segment.endTime - segment.startTime

                  return (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full ${colors[processIndex % colors.length]} flex-shrink-0`}
                        ></div>
                        <div className="text-gray-900 dark:text-white font-bold text-lg">{segment.processName}</div>
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 font-medium">
                        {segment.startTime} → {segment.endTime} ({duration} units)
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simulation Modal */}
      {showSimulation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeSimulation}>
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  Gantt Chart Simulation
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Step {currentStep + 1} of {result.ganttChart.length}
                  {currentSegment && (
                    <span className="ml-2 font-medium">
                      → {currentSegment.processName} ({currentSegment.startTime}-{currentSegment.endTime})
                    </span>
                  )}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeSimulation}
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Simulation Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Simulated Gantt Chart */}
              <div
                ref={simScrollRef}
                className="overflow-x-auto border rounded-lg bg-gray-50 dark:bg-gray-900 p-4 mb-6"
              >
                <div style={{ width: `${totalTime * timeUnitWidth}px`, minWidth: "100%" }}>
                  {/* Time markers at top */}
                  <div className="relative mb-4" style={{ height: "30px" }}>
                    {timeMarkers.map((time) => (
                      <div
                        key={time}
                        className="absolute text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-2 py-1 rounded border"
                        style={{
                          left: `${time * timeUnitWidth}px`,
                          transform: "translateX(-50%)",
                        }}
                      >
                        {time}
                      </div>
                    ))}
                  </div>

                  {/* Vertical grid lines */}
                  <div className="relative">
                    {timeMarkers.map((time) => (
                      <div
                        key={`sim-grid-${time}`}
                        className="absolute top-0 w-px h-20 bg-gray-300 dark:bg-gray-600"
                        style={{ left: `${time * timeUnitWidth}px` }}
                      />
                    ))}

                    {/* Animated Process segments */}
                    <div className="relative" style={{ height: "60px" }}>
                      {visibleSegments.map((segment, index) => (
                        <div
                          key={index}
                          className={`${getColorForProcess(segment.processName)} absolute top-2 bottom-2 flex items-center justify-center text-white font-bold text-lg border-r border-white/20 transition-all duration-500 ${
                            index === currentStep ? "animate-pulse scale-105 shadow-lg" : ""
                          }`}
                          style={{
                            left: `${segment.startTime * timeUnitWidth}px`,
                            width: `${(segment.endTime - segment.startTime) * timeUnitWidth}px`,
                            animation: index === currentStep ? "slideInFromLeft 0.5s ease-out" : undefined,
                          }}
                          title={`${segment.processName}: ${segment.startTime} → ${segment.endTime}`}
                        >
                          {segment.processName}
                        </div>
                      ))}

                      {/* Current time indicator */}
                      {currentSegment && (
                        <div
                          className="absolute top-0 bottom-0 w-1 bg-red-500 animate-pulse z-10"
                          style={{
                            left: `${currentSegment.endTime * timeUnitWidth}px`,
                            transform: "translateX(-50%)",
                          }}
                        >
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            T={currentSegment.endTime}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Time markers at bottom */}
                  <div className="relative mt-4" style={{ height: "30px" }}>
                    {timeMarkers.map((time) => (
                      <div
                        key={`sim-bottom-${time}`}
                        className="absolute text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-2 py-1 rounded border"
                        style={{
                          left: `${time * timeUnitWidth}px`,
                          transform: "translateX(-50%)",
                        }}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Current Step Info */}
              {currentSegment && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full ${getColorForProcess(currentSegment.processName)} flex items-center justify-center text-white font-bold`}
                    >
                      {currentSegment.processName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-lg text-purple-900 dark:text-purple-100">
                        Process {currentSegment.processName} Executing
                      </div>
                      <div className="text-sm text-purple-700 dark:text-purple-300">
                        Time {currentSegment.startTime} → {currentSegment.endTime} (
                        {currentSegment.endTime - currentSegment.startTime} units)
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Controls */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center gap-2">
                <Button
                  onClick={resetSimulation}
                  variant="outline"
                  size="sm"
                  className="transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={prevStep}
                  variant="outline"
                  size="sm"
                  disabled={currentStep === 0}
                  className="transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  ← Prev
                </Button>
                <Button
                  onClick={nextStep}
                  variant="outline"
                  size="sm"
                  disabled={currentStep >= result.ganttChart.length - 1}
                  className="transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Next →
                </Button>
              </div>

              <div className="flex items-center gap-4">
                {/* Speed Control */}
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <select
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value={2000}>0.5x</option>
                    <option value={1000}>1x</option>
                    <option value={500}>2x</option>
                    <option value={250}>4x</option>
                  </select>
                </div>

                <Button
                  onClick={togglePlayPause}
                  className={`transition-all duration-200 hover:scale-105 active:scale-95 ${
                    isPlaying ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                  }`}
                  disabled={currentStep >= result.ganttChart.length - 1 && !isPlaying}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
