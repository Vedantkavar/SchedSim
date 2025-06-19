"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Process } from "@/types/scheduling"
import { Plus } from "lucide-react"

interface ProcessInputProps {
  onAddProcess: (process: Process) => void
  usePriority: boolean
}

export function ProcessInput({ onAddProcess, usePriority }: ProcessInputProps) {
  const [name, setName] = useState("")
  const [arrivalTime, setArrivalTime] = useState("")
  const [burstTime, setBurstTime] = useState("")
  const [priority, setPriority] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !arrivalTime || !burstTime) return

    setIsSubmitting(true)

    const process: Process = {
      id: Date.now().toString(),
      name,
      arrivalTime: Number.parseInt(arrivalTime),
      burstTime: Number.parseInt(burstTime),
      priority: usePriority && priority ? Number.parseInt(priority) : undefined,
    }

    // Small delay for animation effect
    await new Promise((resolve) => setTimeout(resolve, 300))

    onAddProcess(process)

    // Reset form
    setName("")
    setArrivalTime("")
    setBurstTime("")
    setPriority("")
    setIsSubmitting(false)
  }

  const handleMouseEnter = () => {
    // Dispatch custom event to close algorithm dropdown
    window.dispatchEvent(new CustomEvent("closeAlgorithmDropdown"))
  }

  return (
    <Card
      className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1"
      onMouseEnter={handleMouseEnter}
    >
      <CardHeader className="transition-colors duration-200">
        <CardTitle className="flex items-center gap-2 transition-all duration-200">
          <Plus className={`w-5 h-5 transition-transform duration-300 ${isSubmitting ? "rotate-90 scale-110" : ""}`} />
          Add Process
        </CardTitle>
        <CardDescription>Enter process details to add to the scheduling queue</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="transition-colors duration-200">
              Process Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="P1, P2, etc."
              required
              className="transition-all duration-200 focus:scale-[1.02] focus:shadow-md"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="arrival" className="transition-colors duration-200">
                Arrival Time
              </Label>
              <Input
                id="arrival"
                type="number"
                min="0"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                placeholder="0"
                required
                className="transition-all duration-200 focus:scale-[1.02] focus:shadow-md"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="burst" className="transition-colors duration-200">
                Burst Time
              </Label>
              <Input
                id="burst"
                type="number"
                min="1"
                value={burstTime}
                onChange={(e) => setBurstTime(e.target.value)}
                placeholder="5"
                required
                className="transition-all duration-200 focus:scale-[1.02] focus:shadow-md"
              />
            </div>
          </div>

          {usePriority && (
            <div className="priority-container">
              <div className="space-y-2 priority-pop-in priority-element">
                <Label htmlFor="priority" className="transition-colors duration-200">
                  Priority
                </Label>
                <Input
                  id="priority"
                  type="number"
                  min="1"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  placeholder="1"
                  required={usePriority}
                  className="transition-all duration-200 focus:scale-[1.02] focus:shadow-md transform hover:scale-[1.01]"
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            className={`w-full transition-all duration-300 transform ${
              isSubmitting
                ? "scale-95 bg-green-500 hover:bg-green-600"
                : "hover:scale-105 hover:shadow-lg active:scale-95"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding...
              </div>
            ) : (
              "Add Process"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
