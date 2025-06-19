"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SchedulingResult } from "@/types/scheduling"

interface MetricsCardProps {
  result: SchedulingResult
}

export function MetricsCard({ result }: MetricsCardProps) {
  const avgWaitingTime = result.processes.reduce((sum, p) => sum + p.waitingTime, 0) / result.processes.length
  const avgTurnaroundTime = result.processes.reduce((sum, p) => sum + p.turnaroundTime, 0) / result.processes.length
  const avgResponseTime = result.processes.reduce((sum, p) => sum + p.responseTime, 0) / result.processes.length
  const totalTime = Math.max(...result.ganttChart.map((g) => g.endTime))
  const cpuUtilization = (result.processes.reduce((sum, p) => sum + p.burstTime, 0) / totalTime) * 100

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Avg Waiting Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgWaitingTime.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">time units</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Avg Turnaround Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgTurnaroundTime.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">time units</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgResponseTime.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">time units</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">CPU Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cpuUtilization.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">efficiency</p>
        </CardContent>
      </Card>
    </div>
  )
}
