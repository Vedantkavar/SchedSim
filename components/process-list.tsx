"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Process } from "@/types/scheduling"
import { Trash2, List, Edit3, Check, X, Plus } from "lucide-react"

interface ProcessListProps {
  processes: Process[]
  onRemoveProcess: (id: string) => void
  onEditProcess: (id: string, updatedProcess: Partial<Process>) => void
  onAddProcess: (process: Process) => void
  usePriority: boolean
}

export function ProcessList({
  processes,
  onRemoveProcess,
  onEditProcess,
  onAddProcess,
  usePriority,
}: ProcessListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    arrivalTime: "",
    burstTime: "",
    priority: "",
  })
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addForm, setAddForm] = useState({
    name: "",
    arrivalTime: "",
    burstTime: "",
    priority: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const startEditing = (process: Process) => {
    setEditingId(process.id)
    setEditForm({
      name: process.name,
      arrivalTime: process.arrivalTime.toString(),
      burstTime: process.burstTime.toString(),
      priority: process.priority?.toString() || "",
    })
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditForm({ name: "", arrivalTime: "", burstTime: "", priority: "" })
  }

  const saveEditing = () => {
    if (!editingId) return

    const updatedProcess: Partial<Process> = {
      name: editForm.name,
      arrivalTime: Number.parseInt(editForm.arrivalTime) || 0,
      burstTime: Number.parseInt(editForm.burstTime) || 1,
      priority: editForm.priority ? Number.parseInt(editForm.priority) : undefined,
    }

    onEditProcess(editingId, updatedProcess)
    setEditingId(null)
    setEditForm({ name: "", arrivalTime: "", burstTime: "", priority: "" })
  }

  const handleRemove = async (id: string) => {
    setRemovingId(id)
    await new Promise((resolve) => setTimeout(resolve, 300))
    onRemoveProcess(id)
    setRemovingId(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEditing()
    } else if (e.key === "Escape") {
      cancelEditing()
    }
  }

  const handleAddKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddSubmit(e as any)
    } else if (e.key === "Escape") {
      handleCloseModal()
    }
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!addForm.name || !addForm.arrivalTime || !addForm.burstTime) return
    if (usePriority && !addForm.priority) return

    setIsSubmitting(true)

    const process: Process = {
      id: Date.now().toString(),
      name: addForm.name,
      arrivalTime: Number.parseInt(addForm.arrivalTime),
      burstTime: Number.parseInt(addForm.burstTime),
      priority: usePriority && addForm.priority ? Number.parseInt(addForm.priority) : undefined,
    }

    // Small delay for animation effect
    await new Promise((resolve) => setTimeout(resolve, 300))

    onAddProcess(process)

    // Reset form and close modal
    setAddForm({ name: "", arrivalTime: "", burstTime: "", priority: "" })
    setIsSubmitting(false)
    setShowAddModal(false)
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
    setAddForm({ name: "", arrivalTime: "", burstTime: "", priority: "" })
    setIsSubmitting(false)
  }

  const handleOpenModal = () => {
    setShowAddModal(true)
    // Focus on first input after modal opens
    setTimeout(() => {
      const firstInput = document.querySelector("#modal-name") as HTMLInputElement
      if (firstInput) firstInput.focus()
    }, 100)
  }

  const handleAddAnother = async () => {
    if (!addForm.name || !addForm.arrivalTime || !addForm.burstTime) return
    if (usePriority && !addForm.priority) return

    setIsSubmitting(true)

    const process: Process = {
      id: Date.now().toString(),
      name: addForm.name,
      arrivalTime: Number.parseInt(addForm.arrivalTime),
      burstTime: Number.parseInt(addForm.burstTime),
      priority: usePriority && addForm.priority ? Number.parseInt(addForm.priority) : undefined,
    }

    // Small delay for animation effect
    await new Promise((resolve) => setTimeout(resolve, 300))

    onAddProcess(process)

    // Reset form but keep modal open
    setAddForm({ name: "", arrivalTime: "", burstTime: "", priority: "" })
    setIsSubmitting(false)

    // Focus on first input after reset
    setTimeout(() => {
      const firstInput = document.querySelector("#modal-name") as HTMLInputElement
      if (firstInput) firstInput.focus()
    }, 100)
  }

  return (
    <>
      <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <List className="w-5 h-5 transition-transform duration-300 hover:rotate-12" />
                Process Queue
              </CardTitle>
              {processes.length > 0 && (
                <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                  {processes.length}
                </span>
              )}
            </div>
            <Button
              onClick={handleOpenModal}
              size="sm"
              className="h-8 px-3 bg-green-600 hover:bg-green-700 text-white transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Process
            </Button>
          </div>
          <CardDescription>Current processes in the scheduling queue • Click to edit</CardDescription>
        </CardHeader>
        <CardContent>
          {processes.length === 0 ? (
            <div className="text-center py-6 transition-all duration-500">
              <p className="text-gray-500 dark:text-gray-400 text-sm">No processes added yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Click "Add Process" to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {processes.map((process, index) => (
                <div
                  key={process.id}
                  className={`flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 group ${
                    removingId === process.id
                      ? "scale-95 opacity-50 -translate-x-4"
                      : "hover:bg-gray-100 dark:hover:bg-gray-750 hover:scale-[1.02] hover:shadow-md"
                  } ${editingId === process.id ? "ring-2 ring-blue-500 scale-[1.02] shadow-lg" : ""}`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "slideInFromLeft 0.5s ease-out forwards",
                  }}
                >
                  {editingId === process.id ? (
                    // Edit Mode
                    <div className="flex-1 space-y-2 animate-in fade-in duration-300">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600 dark:text-gray-400">Process Name</Label>
                          <Input
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            placeholder="Process name"
                            className="h-8 text-sm transition-all duration-200 focus:scale-[1.02]"
                            onKeyDown={handleKeyPress}
                            autoFocus
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600 dark:text-gray-400">Priority</Label>
                          <Input
                            type="number"
                            value={editForm.priority}
                            onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                            placeholder="Priority (optional)"
                            className="h-8 text-sm transition-all duration-200 focus:scale-[1.02]"
                            onKeyDown={handleKeyPress}
                            min="1"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600 dark:text-gray-400">Arrival Time</Label>
                          <Input
                            type="number"
                            value={editForm.arrivalTime}
                            onChange={(e) => setEditForm({ ...editForm, arrivalTime: e.target.value })}
                            placeholder="Arrival time"
                            className="h-8 text-sm transition-all duration-200 focus:scale-[1.02]"
                            onKeyDown={handleKeyPress}
                            min="0"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600 dark:text-gray-400">Burst Time</Label>
                          <Input
                            type="number"
                            value={editForm.burstTime}
                            onChange={(e) => setEditForm({ ...editForm, burstTime: e.target.value })}
                            placeholder="Burst time"
                            className="h-8 text-sm transition-all duration-200 focus:scale-[1.02]"
                            onKeyDown={handleKeyPress}
                            min="1"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-1">
                        <Button
                          size="sm"
                          onClick={saveEditing}
                          className="h-7 px-2 transition-all duration-200 hover:scale-110 active:scale-95"
                          disabled={!editForm.name || !editForm.arrivalTime || !editForm.burstTime}
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEditing}
                          className="h-7 px-2 transition-all duration-200 hover:scale-110 active:scale-95"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <>
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium transition-all duration-300 hover:scale-110 hover:rotate-12">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-gray-100 text-sm transition-colors duration-200">
                            {process.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                            AT: {process.arrivalTime} | BT: {process.burstTime}
                            {process.priority !== undefined && ` | P: ${process.priority}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(process)}
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 h-7 w-7 p-0 transition-all duration-200 hover:scale-110 active:scale-95"
                          title="Edit process"
                        >
                          <Edit3 className="w-3.5 h-3.5 transition-transform duration-200 hover:rotate-12" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(process.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-7 w-7 p-0 transition-all duration-200 hover:scale-110 active:scale-95"
                          title="Remove process"
                          disabled={removingId === process.id}
                        >
                          <Trash2
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${removingId === process.id ? "animate-spin" : "hover:rotate-12"}`}
                          />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Process Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md priority-pop-in priority-element"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-green-600" />
                  Add New Process
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseModal}
                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="modal-name" className="transition-colors duration-200">
                    Process Name
                  </Label>
                  <Input
                    id="modal-name"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    placeholder="P1, P2, etc."
                    required
                    className="transition-all duration-200 focus:scale-[1.02] focus:shadow-md"
                    onKeyDown={handleAddKeyPress}
                  />
                </div>

                {usePriority && (
                  <div className="space-y-2 priority-pop-in priority-element">
                    <Label htmlFor="modal-priority" className="transition-colors duration-200">
                      Priority
                    </Label>
                    <Input
                      id="modal-priority"
                      type="number"
                      min="1"
                      value={addForm.priority}
                      onChange={(e) => setAddForm({ ...addForm, priority: e.target.value })}
                      placeholder="1"
                      required={usePriority}
                      className="transition-all duration-200 focus:scale-[1.02] focus:shadow-md"
                      onKeyDown={handleAddKeyPress}
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="modal-arrival" className="transition-colors duration-200">
                      Arrival Time
                    </Label>
                    <Input
                      id="modal-arrival"
                      type="number"
                      min="0"
                      value={addForm.arrivalTime}
                      onChange={(e) => setAddForm({ ...addForm, arrivalTime: e.target.value })}
                      placeholder="0"
                      required
                      className="transition-all duration-200 focus:scale-[1.02] focus:shadow-md"
                      onKeyDown={handleAddKeyPress}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modal-burst" className="transition-colors duration-200">
                      Burst Time
                    </Label>
                    <Input
                      id="modal-burst"
                      type="number"
                      min="1"
                      value={addForm.burstTime}
                      onChange={(e) => setAddForm({ ...addForm, burstTime: e.target.value })}
                      placeholder="5"
                      required
                      className="transition-all duration-200 focus:scale-[1.02] focus:shadow-md"
                      onKeyDown={handleAddKeyPress}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                    className="flex-1 transition-all duration-200 hover:scale-105 active:scale-95"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleAddAnother}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:scale-105 active:scale-95"
                    disabled={
                      isSubmitting ||
                      !addForm.name ||
                      !addForm.arrivalTime ||
                      !addForm.burstTime ||
                      (usePriority && !addForm.priority)
                    }
                  >
                    Add Another
                  </Button>
                  <Button
                    type="submit"
                    className={`flex-1 transition-all duration-300 transform ${
                      isSubmitting
                        ? "scale-95 bg-green-500 hover:bg-green-600"
                        : "bg-green-600 hover:bg-green-700 hover:scale-105 hover:shadow-lg active:scale-95"
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Adding...
                      </div>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add & Close
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
