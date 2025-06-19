"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { SchedulingResult } from "@/types/scheduling"

interface ResultsTableProps {
  result: SchedulingResult
}

export function ResultsTable({ result }: ResultsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Results</CardTitle>
        <CardDescription>Process execution times and performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Process</TableHead>
              <TableHead>Arrival Time</TableHead>
              <TableHead>Burst Time</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>Completion Time</TableHead>
              <TableHead>Turnaround Time</TableHead>
              <TableHead>Waiting Time</TableHead>
              <TableHead>Response Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.processes.map((process) => (
              <TableRow key={process.id}>
                <TableCell className="font-medium">{process.name}</TableCell>
                <TableCell>{process.arrivalTime}</TableCell>
                <TableCell>{process.burstTime}</TableCell>
                <TableCell>{process.startTime}</TableCell>
                <TableCell>{process.completionTime}</TableCell>
                <TableCell>{process.turnaroundTime}</TableCell>
                <TableCell>{process.waitingTime}</TableCell>
                <TableCell>{process.responseTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
